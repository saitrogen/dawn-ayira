# Lesson: Custom sections must preserve Dawn's required element IDs

## The problem

Replacing a Dawn section with a custom one (e.g. `ayira-header` instead of `header`) breaks cart AJAX updates with the error:

> "There was an error while updating your cart. Please try again."

## Why

Dawn's `cart.js` expects specific element IDs in the DOM to update after every cart change:

| ID | Purpose |
|----|---------|
| `cart-icon-bubble` | Cart count badge in the header |
| `cart-live-region-text` | Accessible live region for cart total |
| `main-cart-items` | Cart items table wrapper |
| `main-cart-footer` | Cart footer (totals + checkout) |

If any of these are missing, `document.getElementById(...)` returns null, JavaScript throws silently, and the whole cart update fails — even though the server-side cart change succeeded.

## The fix

Any custom header section must have `id="cart-icon-bubble"` on its cart icon link:

```html
<a href="{{ routes.cart_url }}" id="cart-icon-bubble" ...>
```

Also update `sections/cart-icon-bubble.liquid` to render the custom header's cart icon markup (SVG + badge), so the live AJAX update replaces the content correctly.

## Rule

**When building a custom Shopify section that replaces a Dawn section, check `assets/cart.js` → `getSectionsToRender()` for any hardcoded element IDs and make sure your custom section has them.**
