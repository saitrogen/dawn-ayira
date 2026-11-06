/**
 * Ayira Minimart Storefront Engine
 * High-velocity grocery cart controller, inline steppers, and floating basket bar.
 * Two-way Dawn pubsub synchronization, race-condition free mutation queue,
 * robust variant handling, and quantity rules enforcement.
 */

(function () {
  'use strict';

  window.Ayira = window.Ayira || {};

  const AyiraCart = {
    state: {
      count: 0,
      total: 0,
      currency: 'QAR',
      items: {} // variantId (number) -> { key, quantity, price, linePrice, title, image }
    },

    debounceTimers: {},
    inFlight: {},      // variantId -> boolean
    queuedTarget: {},  // variantId -> number (target quantity queued while in flight)
    isInitialized: false,

    async init() {
      if (this.isInitialized) return;
      this.isInitialized = true;

      // 1. Fetch initial cart state from Shopify JSON API (silent, no broadcast)
      await this.fetch(false);

      // 2. Bind DOM event listeners
      this.bindEvents();

      // 3. Bind Dawn pubsub listeners
      this.bindPubSub();

      // 4. Initial render of steppers, mini-cart bar, and header badges
      this.render();
    },

    /**
     * Resolves localized cart endpoint with .js extension
     * @param {string} routeKey - key in window.routes (e.g. 'cart_add_url', 'cart_change_url', 'cart_url')
     * @param {string} fallback - fallback path
     */
    getEndpoint(routeKey, fallback) {
      const base = (window.routes && window.routes[routeKey]) ? window.routes[routeKey] : fallback;
      return base.endsWith('.js') ? base : `${base.replace(/\/$/, '')}.js`;
    },

    /**
     * Fetch current cart state from Shopify JSON API
     * @param {boolean} broadcast - whether to broadcast update to pubsub (default: false)
     */
    async fetch(broadcast = false) {
      try {
        const cartUrl = this.getEndpoint('cart_url', '/cart');
        const response = await fetch(cartUrl, {
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'same-origin'
        });
        if (!response.ok) throw new Error('Cart fetch failed');
        const cart = await response.json();
        this.updateState(cart, broadcast);
        return cart;
      } catch (err) {
        console.warn('[Ayira] Could not fetch cart:', err);
      }
    },

    /**
     * Map Shopify cart JSON into internal state
     * @param {Object} cart - Shopify cart object
     * @param {boolean} broadcast - whether to broadcast to pubsub
     */
    updateState(cart, broadcast = false) {
      if (!cart || typeof cart.item_count !== 'number') return;

      this.state.count = cart.item_count;
      this.state.total = typeof cart.total_price === 'number' ? cart.total_price : 0;
      this.state.currency = cart.currency || this.state.currency || 'QAR';

      const serverItems = {};
      if (Array.isArray(cart.items)) {
        cart.items.forEach((item) => {
          serverItems[Number(item.variant_id)] = {
            key: item.key,
            quantity: item.quantity,
            title: item.title,
            price: item.price,
            linePrice: item.final_line_price,
            image: item.image
          };
        });
      }

      // Preserve any pending optimistic items currently in-flight or debouncing for other variants
      const pendingVids = new Set([
        ...Object.keys(this.debounceTimers).map(Number),
        ...Object.keys(this.inFlight).map(Number)
      ]);
      pendingVids.forEach((pVid) => {
        const hasQueuedTarget = typeof this.queuedTarget[pVid] === 'number';
        const hasActiveTimer = Boolean(this.debounceTimers[pVid]);
        if (hasQueuedTarget || hasActiveTimer) {
          if (this.state.items[pVid]) {
            const serverQty = serverItems[pVid]?.quantity || 0;
            const optQty = this.state.items[pVid].quantity;
            const diff = optQty - serverQty;
            const price = this.state.items[pVid].price || serverItems[pVid]?.price || 0;

            serverItems[pVid] = {
              ...(serverItems[pVid] || {}),
              ...this.state.items[pVid],
              quantity: optQty
            };

            if (diff !== 0) {
              this.state.count = Math.max(0, this.state.count + diff);
              if (price) {
                this.state.total = Math.max(0, this.state.total + (diff * price));
              }
            }
          } else if (serverItems[pVid]) {
            // Target was 0 (optimistically removed)
            const serverQty = serverItems[pVid].quantity || 0;
            const price = serverItems[pVid].price || 0;
            this.state.count = Math.max(0, this.state.count - serverQty);
            if (price) {
              this.state.total = Math.max(0, this.state.total - (serverQty * price));
            }
            delete serverItems[pVid];
          }
        }
      });

      this.state.items = serverItems;

      this.render();

      if (broadcast) {
        this.notify(cart);
      }
    },

    /**
     * Broadcast update to DOM and Dawn pubsub
     */
    notify(cart) {
      const payload = cart || this.state;

      // Custom DOM event for Ayira components
      document.dispatchEvent(new CustomEvent('ayira:cart-updated', {
        detail: { cart: payload }
      }));

      // Dawn pubsub synchronization
      const publishFn = typeof publish === 'function' ? publish : (window.pubsub && window.pubsub.publish);
      const events = typeof PUB_SUB_EVENTS !== 'undefined' ? PUB_SUB_EVENTS : (window.PUB_SUB_EVENTS || {});
      if (publishFn && events.cartUpdate) {
        publishFn(events.cartUpdate, {
          source: 'ayira-engine',
          cartData: payload
        });
      }
    },

    /**
     * Listen to Dawn pubsub for external cart mutations (cart drawer, product form, cart page)
     */
    bindPubSub() {
      const subscribeFn = typeof subscribe === 'function' ? subscribe : (window.pubsub && window.pubsub.subscribe);
      const events = typeof PUB_SUB_EVENTS !== 'undefined' ? PUB_SUB_EVENTS : (window.PUB_SUB_EVENTS || {});

      if (subscribeFn && events.cartUpdate) {
        subscribeFn(events.cartUpdate, (event) => {
          // Ignore updates initiated by Ayira engine to avoid recursive loops
          if (event && event.source === 'ayira-engine') return;

          // If event has full canonical cart with item_count, update directly without extra network call
          if (event && event.cartData && typeof event.cartData.item_count === 'number' && Array.isArray(event.cartData.items)) {
            this.updateState(event.cartData, false);
          } else {
            // Partial response (e.g. from /cart/add.js in product-form.js) -> fetch canonical cart
            this.fetch(false);
          }
        });
      }

      if (subscribeFn && events.cartError) {
        subscribeFn(events.cartError, (event) => {
          if (event && event.source === 'ayira-engine') return;
          // Revert any optimistic state to canonical cart
          this.fetch(false);
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

      // Find unit price: check existing state first, fallback to DOM data-price
      let unitPrice = this.state.items[vid]?.price;
      if (unitPrice === undefined || unitPrice === null) {
        const card = document.querySelector('[data-product-card][data-variant-id="' + vid + '"]');
        if (card && card.dataset.price) {
          unitPrice = Number(card.dataset.price);
        }
      }

      if (unitPrice !== undefined && unitPrice !== null && !isNaN(Number(unitPrice))) {
        this.state.total = Math.max(0, this.state.total + (diff * Number(unitPrice)));
      }

      if (targetQty > 0 || this.state.items[vid]?.key) {
        this.state.items[vid] = {
          ...(this.state.items[vid] || {}),
          price: (unitPrice !== undefined && unitPrice !== null && !isNaN(Number(unitPrice))) ? Number(unitPrice) : this.state.items[vid]?.price,
          quantity: targetQty
        };
      } else {
        delete this.state.items[vid];
      }

      this.render();
    },

    /**
     * Queue network change with debounce per variant
     */
    queueChange(variantId, targetQty) {
      const vid = Number(variantId);
      this.optimisticSet(vid, targetQty);

      if (this.debounceTimers[vid]) {
        clearTimeout(this.debounceTimers[vid]);
      }

      this.debounceTimers[vid] = setTimeout(() => {
        delete this.debounceTimers[vid];
        this.dispatchSync(vid, targetQty);
      }, 250);
    },

    /**
     * Coordinate sequential in-flight requests per variant to eliminate race conditions
     */
    async dispatchSync(variantId, targetQty) {
      const vid = Number(variantId);

      // If a request is currently in-flight for this variant, queue target quantity
      if (this.inFlight[vid]) {
        this.queuedTarget[vid] = targetQty;
        return;
      }

      this.inFlight[vid] = true;
      try {
        await this.syncServer(vid, targetQty);
      } finally {
        this.inFlight[vid] = false;

        // If another target was queued while request was in-flight, dispatch next target
        if (typeof this.queuedTarget[vid] === 'number') {
          const nextTarget = this.queuedTarget[vid];
          delete this.queuedTarget[vid];
          if (nextTarget !== targetQty) {
            this.dispatchSync(vid, nextTarget);
          }
        }
      }
    },

    /**
     * Sync quantity to Shopify Cart API
     */
    async syncServer(variantId, quantity) {
      const vid = Number(variantId);
      try {
        const existing = this.state.items[vid];
        const isNewAdd = quantity > 0 && !(existing && existing.key);

        const endpoint = isNewAdd
          ? this.getEndpoint('cart_add_url', '/cart/add')
          : this.getEndpoint('cart_change_url', '/cart/change');

        const body = isNewAdd
          ? { id: vid, quantity: quantity }
          : { id: (existing && existing.key) ? existing.key : vid, quantity: quantity };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'same-origin',
          body: JSON.stringify(body)
        });

        let responseData;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          responseData = await res.json();
        } else {
          const text = await res.text();
          try {
            responseData = JSON.parse(text);
          } catch (e) {
            console.error('[Ayira] Non-JSON response from cart API:', text);
            throw new Error(`Cart update failed (${res.status})`);
          }
        }

        if (!res.ok || (responseData && responseData.status && responseData.status >= 400)) {
          const errMsg = responseData.description || responseData.message || responseData.errors || `Cart update failed (${res.status})`;
          throw new Error(errMsg);
        }

        // If response is the newly added line item, associate its canonical line key immediately
        if (responseData && responseData.key && this.state.items[vid]) {
          this.state.items[vid].key = responseData.key;
        }

        // If response is full canonical cart (from change.js), update directly and broadcast
        if (typeof responseData.item_count === 'number') {
          this.updateState(responseData, true);
        } else {
          // If response is added item (from add.js), fetch full canonical cart and broadcast
          await this.fetch(true);
        }
      } catch (err) {
        console.error('[Ayira] Cart sync error, rolling back:', err.message || err);

        delete this.queuedTarget[vid];
        if (this.debounceTimers[vid]) {
          clearTimeout(this.debounceTimers[vid]);
          delete this.debounceTimers[vid];
        }

        // Display visible error feedback in the floating bar if active
        const cartBar = document.getElementById('ayira-cart-bar');
        if (cartBar) {
          const countLabel = cartBar.querySelector('[data-cart-bar-count]');
          if (countLabel) {
            countLabel.textContent = err.message || 'Cart update error';
          }
        }

        // Update live region and error container for accessibility
        const liveRegion = document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
        if (liveRegion) {
          liveRegion.textContent = err.message || 'Cart update error';
          liveRegion.setAttribute('aria-hidden', 'false');
          setTimeout(() => {
            liveRegion.setAttribute('aria-hidden', 'true');
          }, 4000);
        }
        const cartErrors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        if (cartErrors) {
          cartErrors.textContent = err.message || 'Cart update error';
        }

        // Notify Dawn pubsub of error so live regions / error handlers update
        const publishFn = typeof publish === 'function' ? publish : (window.pubsub && window.pubsub.publish);
        const events = typeof PUB_SUB_EVENTS !== 'undefined' ? PUB_SUB_EVENTS : (window.PUB_SUB_EVENTS || {});
        if (publishFn && events.cartError) {
          publishFn(events.cartError, {
            source: 'ayira-engine',
            productVariantId: vid,
            message: err.message
          });
        }

        // Roll back state to canonical server truth
        await this.fetch(false);
      }
    },

    /**
     * Render UI states across all synced elements
     */
    render() {
      // 1. Update header cart bubble counters (both desktop & mobile)
      const countElements = document.querySelectorAll(
        '[data-ayira-cart-count], .ayira-header__cart-badge, #cart-icon-bubble .cart-count-bubble span:first-child'
      );

      countElements.forEach((el) => {
        el.textContent = this.state.count > 0 ? this.state.count : '';
        if (this.state.count > 0) {
          el.classList.remove('hidden');
          el.removeAttribute('hidden');
          el.setAttribute('aria-hidden', 'false');
        } else {
          el.classList.add('hidden');
          el.setAttribute('hidden', '');
          el.setAttribute('aria-hidden', 'true');
        }
      });

      // If cart icon bubble has no badge element in DOM yet (e.g. loaded on empty cart), inject it
      const desktopBubble = document.getElementById('cart-icon-bubble');
      if (desktopBubble && !desktopBubble.querySelector('[data-ayira-cart-count]')) {
        const badge = document.createElement('span');
        badge.className = `ayira-header__cart-badge${this.state.count === 0 ? ' hidden' : ''}`;
        badge.setAttribute('data-ayira-cart-count', '');
        badge.setAttribute('aria-hidden', this.state.count === 0 ? 'true' : 'false');
        if (this.state.count > 0) badge.textContent = this.state.count;
        desktopBubble.appendChild(badge);
      }

      // 2. Update all product cards
      const cards = document.querySelectorAll('[data-product-card]');
      cards.forEach((card) => {
        const isAvailable = card.dataset.available !== 'false';
        const hasVariants = card.dataset.hasVariants === 'true';
        const variantId = Number(card.dataset.variantId);
        const actionArea = card.querySelector('.ayira-card-action');
        if (!actionArea) return;

        // Sold out state
        if (!isAvailable) {
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

        // Multi-variant or special quantity rules: NEVER replace with single-variant stepper!
        if (hasVariants) {
          return;
        }

        if (!variantId) return;

        const qty = this.state.items[variantId]?.quantity || 0;
        const maxQty = card.dataset.maxQty ? Number(card.dataset.maxQty) : null;
        const isMax = maxQty !== null && qty >= maxQty;

        const productForm = actionArea.querySelector('product-form');
        const existingStepper = actionArea.querySelector('.ayira-card-stepper');

        if (qty === 0) {
          // Resting Add state: remove stepper and preserve/restore product-form
          if (existingStepper) {
            existingStepper.remove();
          }

          if (productForm) {
            productForm.classList.remove('hidden');
            productForm.removeAttribute('hidden');
            productForm.style.display = '';
          } else {
            // Restore full product-form structure adhering to Dawn–Ayira contract
            const sectionId = card.dataset.sectionId || '';
            const formId = `quick-add-${sectionId}${variantId}`;
            actionArea.innerHTML = `
              <product-form data-section-id="${sectionId}">
                <form method="post" action="/cart/add" id="${formId}" class="form" novalidate="novalidate" data-type="add-to-cart-form">
                  <input type="hidden" name="id" value="${variantId}" class="product-variant-id">
                  <button
                    id="${formId}-submit"
                    type="submit"
                    name="add"
                    class="ay-prod-add"
                    data-action="add"
                    aria-label="Add to cart"
                    aria-live="polite"
                    data-sold-out-message="true"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="icon-plus">
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                    <span class="loading__spinner hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" class="spinner" viewBox="0 0 66 66" aria-hidden="true" focusable="false">
                        <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                      </svg>
                    </span>
                  </button>
                </form>
              </product-form>`;
          }
        } else {
          // Active Stepper state: hide product-form and display stepper
          if (productForm) {
            productForm.classList.add('hidden');
            productForm.setAttribute('hidden', '');
            productForm.style.display = 'none';
          }

          if (existingStepper) {
            const countDisplay = existingStepper.querySelector('.ayira-card-stepper__count');
            if (countDisplay && countDisplay.textContent !== String(qty)) {
              countDisplay.textContent = qty;
            }
            const incBtn = existingStepper.querySelector('[data-action="increment"]');
            if (incBtn) {
              const wasFocused = document.activeElement === incBtn;
              incBtn.disabled = isMax;
              incBtn.classList.toggle('disabled', isMax);
              if (isMax && wasFocused) {
                const decBtn = existingStepper.querySelector('[data-action="decrement"]');
                if (decBtn) decBtn.focus();
              }
            }
          } else {
            const stepperDiv = document.createElement('div');
            stepperDiv.className = 'ayira-card-stepper';
            stepperDiv.setAttribute('role', 'group');
            stepperDiv.setAttribute('aria-label', 'Quantity');
            stepperDiv.innerHTML = `
              <button type="button" class="ayira-card-stepper__btn" data-action="decrement" aria-label="Decrease quantity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-minus">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="ayira-card-stepper__count" aria-live="polite">${qty}</span>
              <button type="button" class="ayira-card-stepper__btn${isMax ? ' disabled' : ''}" data-action="increment" aria-label="Increase quantity"${isMax ? ' disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-plus">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>`;
            actionArea.appendChild(stepperDiv);
          }
        }
      });

      // 3. Update persistent floating mini-cart bar
      const cartBar = document.getElementById('ayira-cart-bar');
      if (cartBar) {
        const isCartPage =
          document.body.classList.contains('template-cart') ||
          window.location.pathname.replace(/\/$/, '') === (window.routes?.cart_url || '/cart');
        const isProductPage = document.body.classList.contains('template-product');
        if (this.state.count > 0 && !isCartPage && !isProductPage) {
          cartBar.classList.add('is-active');
          const countLabel = cartBar.querySelector('[data-cart-bar-count]');
          const totalLabel = cartBar.querySelector('[data-cart-bar-total]');
          if (countLabel) {
            countLabel.textContent = `${this.state.count} ${this.state.count === 1 ? 'item' : 'items'}`;
          }
          if (totalLabel) {
            totalLabel.textContent = this.formatMoney(this.state.total);
          }
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
          // Dawn owns product-form submission and its bundled cart section updates.
          if (addBtn.closest('modal-opener, product-form')) return;

          const card = addBtn.closest('[data-product-card]');
          if (!card) return;

          // If product has variants or rules, do not handle via direct add
          if (card.dataset.hasVariants === 'true') return;

          const variantId = card.dataset.variantId || card.querySelector('input[name="id"]')?.value;
          if (!variantId) return;

          e.preventDefault();
          e.stopPropagation();
          this.queueChange(variantId, 1);

          // Retarget focus to the new stepper's increment button (or decrement if disabled)
          const incBtn = card.querySelector('[data-action="increment"]:not([disabled])') || card.querySelector('[data-action="decrement"]');
          if (incBtn) {
            incBtn.focus();
            requestAnimationFrame(() => {
              if (document.activeElement === document.body) {
                incBtn.focus();
              }
            });
          }
          return;
        }

        // 2. Click on Stepper [+]
        const incBtn = e.target.closest('[data-action="increment"]');
        if (incBtn) {
          e.preventDefault();
          e.stopPropagation();

          const card = incBtn.closest('[data-product-card]');
          if (!card) return;
          const variantId = card.dataset.variantId || card.querySelector('input[name="id"]')?.value;
          if (!variantId) return;

          const maxQty = card.dataset.maxQty ? Number(card.dataset.maxQty) : null;
          const currentQty = this.state.items[variantId]?.quantity || 0;
          if (maxQty !== null && currentQty >= maxQty) return;

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
          const variantId = card.dataset.variantId || card.querySelector('input[name="id"]')?.value;
          if (!variantId) return;

          const currentQty = this.state.items[variantId]?.quantity || 0;
          const nextQty = Math.max(0, currentQty - 1);
          this.queueChange(variantId, nextQty);

          if (nextQty === 0) {
            const restoredAddBtn = card.querySelector('[data-action="add"]');
            if (restoredAddBtn) {
              restoredAddBtn.focus();
              requestAnimationFrame(() => {
                if (document.activeElement === document.body) {
                  restoredAddBtn.focus();
                }
              });
            }
          }
          return;
        }
      });

      // Synchronize steppers when Shopify re-renders sections (theme editor or facet AJAX filters)
      document.addEventListener('shopify:section:load', () => this.render());

      const grid = document.getElementById('ProductGridContainer');
      if (grid && window.MutationObserver) {
        const observer = new MutationObserver((mutations) => {
          for (const m of mutations) {
            if (m.type === 'childList' && m.addedNodes.length > 0) {
              this.render();
              break;
            }
          }
        });
        observer.observe(grid, { childList: true, subtree: true });
      }
    }
  };

  window.Ayira.Cart = AyiraCart;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AyiraCart.init());
  } else {
    AyiraCart.init();
  }
})();
