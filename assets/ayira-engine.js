/**
 * Ayira Minimart Storefront Engine
 * High-velocity grocery cart controller, inline steppers, and floating basket bar.
 * Lightweight vanilla JavaScript (zero Web Component overhead).
 */

(function () {
  'use strict';

  window.Ayira = window.Ayira || {};

  const AyiraCart = {
    state: {
      count: 0,
      total: 0,
      items: {} // variantId -> { key, quantity, price, linePrice, title, image }
    },

    debounceTimers: {},

    async init() {
      await this.fetch();
      this.bindEvents();
      this.render();
    },

    /**
     * Fetch current cart state from Shopify JSON API
     */
    async fetch() {
      try {
        const response = await fetch('/cart.js', {
          headers: { 'Accept': 'application/json' },
          credentials: 'same-origin'
        });
        if (!response.ok) throw new Error('Cart fetch failed');
        const cart = await response.json();
        this.updateState(cart);
        return cart;
      } catch (err) {
        console.warn('[Ayira] Could not fetch cart:', err);
      }
    },

    /**
     * Map Shopify cart JSON into internal state
     */
    updateState(cart) {
      this.state.count = cart.item_count || 0;
      this.state.total = cart.total_price || 0;
      this.state.currency = cart.currency || 'QAR';
      this.state.items = {};

      if (Array.isArray(cart.items)) {
        cart.items.forEach((item) => {
          this.state.items[item.variant_id] = {
            key: item.key,
            quantity: item.quantity,
            title: item.title,
            price: item.price,
            linePrice: item.final_line_price,
            image: item.image
          };
        });
      }

      this.render();
      this.notify(cart);
    },

    /**
     * Broadcast update to DOM and any listening components
     */
    notify(cart) {
      document.dispatchEvent(new CustomEvent('ayira:cart-updated', {
        detail: { cart: cart || this.state }
      }));

      // Synchronize with legacy Dawn pubsub if present
      if (window.PUB_SUB_EVENTS && window.pubsub) {
        window.pubsub.publish(window.PUB_SUB_EVENTS.cartUpdate, {
          source: 'ayira-engine',
          cart: cart || this.state
        });
      }
    },

    /**
     * Format money string
     */
    formatMoney(cents) {
      if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
        return window.Shopify.formatMoney(cents);
      }
      const amount = (cents / 100).toFixed(2);
      const currency = this.state.currency || 'QAR';
      return `${currency} ${amount}`;
    },

    /**
     * Optimistically update UI before server roundtrip
     */
    optimisticSet(variantId, targetQty) {
      const vid = Number(variantId);
      const prevQty = this.state.items[vid]?.quantity || 0;
      const diff = targetQty - prevQty;

      this.state.count = Math.max(0, this.state.count + diff);

      if (targetQty > 0) {
        this.state.items[vid] = {
          ...(this.state.items[vid] || {}),
          quantity: targetQty
        };
      } else {
        delete this.state.items[vid];
      }

      this.render();
    },

    /**
     * Queue network change with debounce
     */
    queueChange(variantId, targetQty) {
      const vid = Number(variantId);
      this.optimisticSet(vid, targetQty);

      if (this.debounceTimers[vid]) {
        clearTimeout(this.debounceTimers[vid]);
      }

      this.debounceTimers[vid] = setTimeout(() => {
        delete this.debounceTimers[vid];
        this.syncServer(vid, targetQty);
      }, 300);
    },

    /**
     * Sync quantity to Shopify Cart API
     */
    async syncServer(variantId, quantity) {
      const vid = Number(variantId);
      try {
        let endpoint = '/cart/change.js';
        let body = {};

        // If item is already in cart, use line key or variant id
        const existing = this.state.items[vid];
        if (existing && existing.key) {
          body = { id: existing.key, quantity };
        } else {
          // If not in cart and adding for first time
          if (quantity > 0) {
            endpoint = '/cart/add.js';
            body = { items: [{ id: vid, quantity }] };
          } else {
            return;
          }
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          throw new Error(`Cart update failed: ${res.statusText}`);
        }

        // Always re-fetch canonical cart state
        await this.fetch();
      } catch (err) {
        console.error('[Ayira] Cart sync error, rolling back:', err);
        await this.fetch();
      }
    },

    /**
     * Render UI states across all synced elements
     */
    render() {
      // 1. Update header cart bubble counters
      const countElements = document.querySelectorAll('[data-ayira-cart-count], #cart-icon-bubble .cart-count-bubble span:first-child');
      countElements.forEach((el) => {
        el.textContent = this.state.count;
        if (el.parentElement) {
          el.parentElement.classList.toggle('has-items', this.state.count > 0);
          el.parentElement.classList.toggle('hidden', this.state.count === 0);
        }
      });

      // 2. Update all product cards
      const cards = document.querySelectorAll('[data-product-card]');
      cards.forEach((card) => {
        const variantId = Number(card.dataset.variantId);
        if (!variantId) return;

        const qty = this.state.items[variantId]?.quantity || 0;
        const actionArea = card.querySelector('.ayira-card-action');
        if (!actionArea) return;

        const isAvailable = card.dataset.available !== 'false';

        if (!isAvailable) {
          // Out of stock state
          if (!actionArea.querySelector('.ay-prod-add.disabled')) {
            actionArea.innerHTML = `
              <button type="button" class="ay-prod-add disabled" disabled aria-label="Sold out">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="icon-plus">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
              </button>`;
          }
          return;
        }

        if (qty === 0) {
          // Resting Add state
          if (!actionArea.querySelector('.ay-prod-add:not(.disabled)')) {
            actionArea.innerHTML = `
              <button type="button" class="ay-prod-add" aria-label="Add to cart" data-action="add">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" class="icon-plus">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
              </button>`;
          }
        } else {
          // Active Stepper state
          const existingStepper = actionArea.querySelector('.ayira-card-stepper');
          if (existingStepper) {
            const countDisplay = existingStepper.querySelector('.ayira-card-stepper__count');
            if (countDisplay && countDisplay.textContent !== String(qty)) {
              countDisplay.textContent = qty;
            }
          } else {
            actionArea.innerHTML = `
              <div class="ayira-card-stepper" role="group" aria-label="Quantity">
                <button type="button" class="ayira-card-stepper__btn" data-action="decrement" aria-label="Decrease quantity">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-minus">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <span class="ayira-card-stepper__count" aria-live="polite">${qty}</span>
                <button type="button" class="ayira-card-stepper__btn" data-action="increment" aria-label="Increase quantity">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-plus">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>`;
          }
        }
      });

      // 3. Update persistent floating mini-cart bar
      const cartBar = document.getElementById('ayira-cart-bar');
      if (cartBar) {
        const isCartPage = window.location.pathname.includes('/cart');
        if (this.state.count > 0 && !isCartPage) {
          cartBar.classList.add('is-active');
          const countLabel = cartBar.querySelector('[data-cart-bar-count]');
          const totalLabel = cartBar.querySelector('[data-cart-bar-total]');
          if (countLabel) countLabel.textContent = `${this.state.count} ${this.state.count === 1 ? 'item' : 'items'}`;
          if (totalLabel) totalLabel.textContent = this.formatMoney(this.state.total);
        } else {
          cartBar.classList.remove('is-active');
        }
      }
    },

    /**
     * Bind click delegation on document
     */
    bindEvents() {
      document.addEventListener('click', (e) => {
        // 1. Click on Resting [ADD]
        const addBtn = e.target.closest('[data-action="add"]');
        if (addBtn) {
          e.preventDefault();
          e.stopPropagation();
          const card = addBtn.closest('[data-product-card]');
          if (!card) return;
          const variantId = card.dataset.variantId;
          if (variantId) this.queueChange(variantId, 1);
          return;
        }

        // 2. Click on Stepper [+]
        const incBtn = e.target.closest('[data-action="increment"]');
        if (incBtn) {
          e.preventDefault();
          e.stopPropagation();
          const card = incBtn.closest('[data-product-card]');
          if (!card) return;
          const variantId = card.dataset.variantId;
          const currentQty = this.state.items[variantId]?.quantity || 0;
          this.queueChange(variantId, currentQty + 1);
          return;
        }

        // 3. Click on Stepper [-]
        const decBtn = e.target.closest('[data-action="decrement"]');
        if (decBtn) {
          e.preventDefault();
          e.stopPropagation();
          const card = decBtn.closest('[data-product-card]');
          if (!card) return;
          const variantId = card.dataset.variantId;
          const currentQty = this.state.items[variantId]?.quantity || 0;
          this.queueChange(variantId, Math.max(0, currentQty - 1));
          return;
        }
      });
    }
  };

  window.Ayira.Cart = AyiraCart;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AyiraCart.init());
  } else {
    AyiraCart.init();
  }
})();
