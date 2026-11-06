# Product-card plus button: investigation and repair

Date: 6 November 2026

## Result and scope

The product-card plus button now uses Dawn's product form for the initial add. Dawn requests the updated cart sections and updates the notification and header. Ayira then reads the confirmed cart to update its product-card quantities and floating basket bar.

The repair also fixes last-unit removal and stale local items after a failed request.

The exact reported sequence—basket bar appears, disappears, and the cart stays unchanged—did not recur in the current preview. A normal add succeeded before the repair after the requests settled. The investigation confirmed defects that could cause inconsistent cart displays, but it did not identify the specific failed request from the original report.

Only `assets/ayira-engine.js` and `tests/ayira-cart.test.cjs` were changed for this repair. Other cart, header, and style edits were already present in the working tree. They were preserved. No theme push or production deployment was performed.

## Reported behavior

The user clicked a product-card plus button. A floating basket bar slid up, then disappeared. The header count and cart did not show the expected change.

That floating bar was an optimistic display: the theme could show the requested quantity before Shopify accepted it. Its appearance alone did not prove that the product had entered the cart.

## Investigation steps

### 1. Inspect the current files and settings

Two sub-agents traced separate parts of the flow:

- Product-card click, custom cart requests, Dawn product forms, and cart events.
- Header badges, cart markup, section IDs, and Dawn update hooks.

The active setting was `cart_type: "notification"`. This meant the initial-add flow needed to work with `cart-notification`, rather than a cart drawer.

The current header markup already contained persistent badge elements with `data-ayira-cart-count`. The cart page also retained the required Dawn IDs and custom elements. The investigation did not find a missing header badge hook in that working tree.

### 2. Trace the plus-button click

The Liquid card contained a Dawn `<product-form>` with a submit button. However, the document click listener in `ayira-engine.js` intercepted its `[data-action="add"]` button.

Before the repair, the path was:

```text
Plus-button click
  → Ayira document click listener
  → preventDefault() cancels form submission
  → queueChange(variantId, 1)
  → optimisticSet() updates local count and price
  → render() shows the floating basket bar
  → debounced request to /cart/add.js
  → GET /cart.js for the complete cart
  → updateState() and cart-update event
```

This bypassed Dawn's `product-form.js` request and section-rendering path. The Ayira request did not request notification or header sections, and did not call `cart-notification.renderContents()`.

The custom path still updated header badges through Ayira's own `render()` method when state was correct. Therefore, bypassing Dawn did not mean that every add would fail. It created a separate update path and showed the basket before the server confirmed the change.

### 3. Inspect the preview requests

The browser test used the running development preview at `http://127.0.0.1:9292`, on `/collections/all`.

A normal initial add returned HTTP 200. A later `/cart.js` response contained one item, and both header badge values became `1`. This established that the exact original failure was not reproduced by that test.

The investigation then tested related quantity and removal actions instead of assuming that the initial add had failed.

### 4. Reproduce last-unit removal failure

With one unit in the cart, clicking decrease caused a confirmed failure:

```text
POST /cart/change.js
HTTP 400
message begins: expected Integer to be ... : id
```

`optimisticSet(variantId, 0)` deleted the local item before the request ran. That also deleted the cart line key. `syncServer()` could no longer find the key and sent the numeric variant ID as its fallback. Shopify rejected that payload in the test.

This was a separate, directly reproduced defect.

### 5. Test failed-request recovery

A focused Node test simulated a rejected add followed by an empty `/cart.js` response.

The test first failed: the displayed count returned to zero, but `state.items[variantId]` still contained a quantity of one. `updateState()` copied the old local item into the new state when the server response did not contain it.

This could leave the card quantity and cart count inconsistent. The rollback needed to clear the item as well as the count and total.

## Repairs

### Initial add returns to Dawn

The delegated Ayira listener now exits when the add button is inside a Dawn product form or modal opener:

```js
if (addBtn.closest('modal-opener, product-form')) return;
```

This leaves the submit event available to Dawn. The normal card-add path is now:

```text
Plus-button click
  → Dawn product-form submit handler
  → add request with bundled cart sections
  → Shopify confirms the add
  → Dawn publishes cart-update and renders returned sections
  → notification opens and header section updates
  → Ayira receives cart-update
  → Ayira fetches the complete cart for the partial add response
  → card quantities, badges, and basket bar use confirmed cart data
```

The browser confirmed that the add response contained these sections:

```text
cart-notification-product
cart-notification-button
cart-icon-bubble
```

### Keep the line key until removal completes

`optimisticSet()` now keeps an existing keyed item at quantity zero until Shopify responds:

```js
if (targetQty > 0 || this.state.items[vid]?.key) {
  // Keep the item record, including its line key.
}
```

The removal request can then send the canonical line key:

```json
{ "id": "123:line-key", "quantity": 0 }
```

After Shopify returns an empty cart, the local item is removed. The repaired browser request returned HTTP 200.

### Accept the server result after success or rollback

The stale-item fallback was removed from `updateState()`. An item absent from the server cart is no longer restored merely because it existed in local state.

The existing logic still preserves a newer quantity when a debounce timer or queued target is pending. Otherwise, the server cart determines the settled item state.

### Preserve the fallback form's spinner hook

The generated fallback product form now includes `.loading__spinner` and Dawn's spinner SVG structure. Dawn accesses that element when submission starts and finishes. Without it, submission of the generated form could throw a JavaScript error.

The normal Liquid product form already contained this hook.

## Verification

| Check | Result |
| --- | --- |
| Desktop initial add | HTTP 200; notification opened; both badge values became `1`; basket bar stayed active |
| Bundled section response | Notification product, notification button, and cart icon sections returned |
| Card quantity increase | Server and local count reached `2` |
| Cart-page direct quantity input | Quantity changed to `3`; local count followed |
| Cart-page line removal | Empty-cart class and cleared badges confirmed |
| Mobile, 390 × 844 | Add, increase, decrease, and last-unit removal passed |
| Mobile empty state | Count and total were zero; items were empty; basket bar was inactive |
| Simulated HTTP 422 initial add | Count stayed zero; basket bar stayed inactive; button left its loading state |
| Regression tests | All three passed |
| JavaScript syntax and diff whitespace | Passed |
| Theme Check | No errors; two existing warnings |

The existing Theme Check warnings concern variable naming in `sections/main-article.liquid` and Liquid complexity in `snippets/facets.liquid`.

Run the focused checks from the repository root:

```bash
node --test tests/ayira-cart.test.cjs
node --check assets/ayira-engine.js
shopify theme check --path .
git diff --check
```

The regression tests cover three contracts:

1. A product-form add is not intercepted or queued by Ayira.
2. Last-unit removal sends its line key and accepts an empty server cart.
3. A rejected add clears the local item after the server returns an empty cart.

## Verification limits

These results apply to the development preview and the tested products. The browser rejection test used a simulated response. The tests do not establish production behavior, all discount and selling-plan combinations, inventory limits, or concurrent updates across different variants.

Ayira's existing stepper request queue remains in place. This repair restores Dawn ownership of the normal initial add; it does not replace the entire custom cart engine.

## Code references

- [Ayira cart engine](../assets/ayira-engine.js): `bindEvents()`, `optimisticSet()`, `updateState()`, and fallback form markup.
- [Dawn product form](../assets/product-form.js): submission, bundled sections, and cart-update publication.
- [Cart notification](../assets/cart-notification.js): returned-section rendering and notification display.
- [Product-card markup](../snippets/ayira-card-product.liquid): product form and plus button.
- [Regression tests](../tests/ayira-cart.test.cjs): focused checks for event ownership, removal, and rollback.
