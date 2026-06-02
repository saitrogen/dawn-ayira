# Ayira Product Card Component Documentation

The **Ayira Product Card** is a premium, fully customisable product display tile for the Ayira storefront. It integrates with Dawn's product listing sections and supports three distinct layout styles selectable directly from the section Customizer: **Minimal**, **Full-Width Button**, and **Compact Plus Button**. The design features hover-triggered visual lifts and zoom, clean badge styling, dynamic metadata sourcing, and full integration with Dawn's native ajax/quick-add cart behaviors.

---

## 📂 File Locations

| File | Role |
| :--- | :--- |
| `snippets/card-product.liquid` | Formats product information, badges, pricing, forms, and renders the layout based on `ayira_card_style` |
| `assets/component-ayira-card.css` | Scoped stylesheet containing container layout, image zooming, price scaling, and button styles |
| `locales/en.default.json` | Updated translation schema to support volume pricing strings |
| `sections/featured-collection.liquid` | Added card style customizer setting, passes option down to cards |
| `sections/main-collection-product-grid.liquid` | Added card style customizer setting, passes option down to cards |
| `sections/related-products.liquid` | Added card style customizer setting, passes option down to cards |
| `sections/main-search.liquid` | Added card style customizer setting, passes option down to cards |

---

## ⚡ Key Features

1. **Three Customizable Styles** — Selectable on a per-section basis:
   - **Minimal**: Cleans the card layout to focus entirely on product images, titles, and prices. Action buttons and quick-add systems are hidden.
   - **Full-Width Button**: Sits a prominent solid action button ("Add to Cart" or "Choose Options") below the card body spanning 100% width.
   - **Compact Plus Button**: The default Ayira signature style. Places price and a green compact `+` floating action button side-by-side in the footer.
2. **Integrated Quick-Add Mechanics** — Bypasses nothing. Integrates directly with Dawn's standard product form submission (`product-form.js`) and variant selection modal drawer (`quick-add.js`) so customer options and volume pricing function seamlessly out-of-the-box.
3. **Interactive Visual Feedback** — A smooth hover transition lifts the card container (`translateY(-3px)`), deepens the drop-shadow (`var(--ay-shadow-md)`), and scales the featured product image (`scale(1.04)`) using custom cubic-bezier timing.
4. **Clean Badge Layout** — Badges overlay the top-left of the image container with rounded pills and specific colors:
   - **Sale**: Gold/mustard background (`#D4A737`) displaying the calculated percent discount (e.g. `Save 20%`).
   - **New**: Forest green background (`#0D4F47`) for products tagged with `new` or `New`.
   - **Sold Out**: Semi-transparent gray background with a soft border.
5. **Fallback to Original Dawn Cards** — If the `ayira_card_style` setting is not passed (or set to `none`), the snippet gracefully defaults to Dawn's original card markup.

---

## 🛠️ Schema Configuration & Settings

To select the card style, open the Shopify Theme Customizer for any product grid section (e.g., **Featured collection**, **Product grid**) and locate the following setting:

| ID | Type | Label | Default | Options |
| :--- | :--- | :--- | :--- | :--- |
| `ayira_card_style` | `select` | Ayira Card Style | `compact` | `none` (Dawn default card) / `minimal` (Minimal) / `bar` (Full-Width Button) / `compact` (Compact Plus Button) |

---

## 📐 Architecture & Styling Details

### Layout CSS Variables

All styling uses modular custom properties defined at the top of `assets/component-ayira-card.css` to allow theme settings compatibility:

```css
:root {
  --ay-card-bg: #FFFFFF;
  --ay-card-border: rgba(var(--color-foreground), 0.08);
  --ay-card-radius: 16px;
  --ay-card-img-radius: 12px;
  --ay-card-img-bg: #FFFFFF;
  --ay-brand-forest: #0D4F47;
  --ay-brand-mustard: #D4A737;
}
```

### Hover Image Swap & Sold-Out Blending Logic

When a product card hover animation transitions to a secondary hover image (`.hover-image`), it handles opacity and overlap states cleanly using CSS sibling selectors:

* **Fading Primary Images**: To avoid a blended overlap ("ghosting") of the two images on card hover, the primary image is faded out *only* if a secondary sibling image exists:
  ```css
  .ay-prod:hover .ay-prod-img img:first-child:not(:only-child) {
    opacity: 0;
    transform: scale(1.04);
  }
  ```
* **Sold-Out Opacity Isolation**: When a product is sold out, a faded `0.45` opacity is applied to the image. To prevent the hidden hover image from receiving this opacity override in its resting state (which would cause a double-exposure blend), the `.hover-image` is explicitly excluded:
  ```css
  .ay-prod-img.unavail img:not(.hover-image) {
    opacity: 0.45;
    filter: saturate(0.4);
  }
  ```

### Self-Contained Assets Injection

Since related products and search pages do not load quick-add scripts globally in standard Dawn, the card snippet dynamically injects required assets if the section utilizes an action-based style:

```liquid
{%- if ayira_card_style == 'compact' or ayira_card_style == 'bar' -%}
  {{ 'quick-add.css' | asset_url | stylesheet_tag }}
  <script src="{{ 'product-form.js' | asset_url }}" defer="defer"></script>
  <script src="{{ 'quick-add.js' | asset_url }}" defer="defer"></script>
{%- endif -%}
```

This prevents javascript console errors and guarantees quick-add functionality on recommendation lists and search pages.
