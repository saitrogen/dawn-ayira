(() => {
  if (window.ayiraWhatsAppOrderInitialized) return;
  window.ayiraWhatsAppOrderInitialized = true;

  const findErrorTarget = (button) => button.nextElementSibling?.matches('[data-whatsapp-order-error]')
    ? button.nextElementSibling
    : null;

  const showError = (button, message) => {
    const target = findErrorTarget(button);
    if (!target) return;
    target.textContent = message;
    target.hidden = false;
  };

  const clearError = (button) => {
    const target = findErrorTarget(button);
    if (!target) return;
    target.textContent = '';
    target.hidden = true;
  };

  const setLoading = (button, loading) => {
    const label = button.querySelector('[data-whatsapp-order-label]');
    if (!label) return;
    if (!button.dataset.defaultLabel) button.dataset.defaultLabel = label.textContent.trim();
    label.textContent = loading ? button.dataset.loadingLabel : button.dataset.defaultLabel;
    button.disabled = loading;
    button.toggleAttribute('aria-busy', loading);
  };

  const formatMoney = (amount, currency) => {
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'en', {
        style: 'currency',
        currency,
      }).format(amount / 100);
    } catch (_error) {
      return `${currency} ${(amount / 100).toFixed(2)}`;
    }
  };

  const buildMessage = (button, cart) => {
    const lines = [button.dataset.messagePrefix || `Hello ${button.dataset.shopName}, I would like to place this order:`, ''];

    cart.items.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.product_title || item.title}`);
      if (item.variant_title && item.variant_title !== 'Default Title') lines.push(`Variant: ${item.variant_title}`);
      lines.push(`Quantity: ${item.quantity}`);
      lines.push(`Unit price: ${formatMoney(item.final_price, cart.currency)}`);
      lines.push(`Line total: ${formatMoney(item.final_line_price, cart.currency)}`);

      Object.entries(item.properties || {}).forEach(([name, value]) => {
        if (!name.startsWith('_') && value) lines.push(`${name}: ${value}`);
      });

      lines.push('');
    });

    lines.push(`Estimated total: ${formatMoney(cart.total_price, cart.currency)}`);
    lines.push(`Cart: ${new URL(button.dataset.cartUrl, window.location.origin).href}`);

    if (button.dataset.instructions) {
      lines.push('', button.dataset.instructions);
    }

    return lines.join('\n');
  };

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-whatsapp-order]');
    if (!button || button.disabled) return;

    const phone = (button.dataset.phone || '').replace(/\D/g, '');
    clearError(button);

    if (phone.length < 7 || phone.length > 15) {
      showError(button, button.dataset.phoneError);
      return;
    }

    setLoading(button, true);

    try {
      const response = await fetch(`${window.Shopify.routes.root}cart.js`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Unable to fetch cart');

      const cart = await response.json();
      if (!cart.items?.length) {
        showError(button, button.dataset.emptyError);
        setLoading(button, false);
        return;
      }

      const message = buildMessage(button, cart);
      window.location.assign(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
      window.setTimeout(() => setLoading(button, false), 1500);
    } catch (_error) {
      showError(button, button.dataset.requestError);
      setLoading(button, false);
    }
  });
})();
