# Ayira Theme Working Model

## Repository context

This repository is a Shopify theme based on Dawn 15.5.0 and adapted into the Ayira Minimart storefront. It has no application framework, package manifest, bundler, or compile step: Shopify serves the Liquid, CSS, and JavaScript files directly.

Common development commands:

```bash
shopify theme dev --store=<store>.myshopify.com
shopify theme check --path .
shopify theme push
git fetch upstream
git pull upstream main
```

Theme preview and deployment commands require Shopify authentication. Treat `theme push` as a deployment action and run it only when explicitly requested.

## Theme structure

- `layout/theme.liquid` is the storefront shell and global asset entry point.
- `templates/` selects the JSON or Liquid page composition.
- `sections/` contains merchant-configurable page modules.
- `snippets/` contains reusable Liquid fragments.
- `assets/` contains Dawn behavior, component styles, and Ayira presentation styles.
- `config/settings_schema.json` defines theme settings; `config/settings_data.json` contains their current values.

The effective global CSS order is the settings-derived inline styles, Dawn's `base.css`, and then `ayira.css`. Component and section styles load where needed. Keep broad Ayira overrides in `ayira.css`; keep narrowly scoped rules with their owning component or section when that makes the dependency clearer.

Dawn color variables commonly store RGB channels and are consumed as `rgba(var(--color-foreground), ...)`. Prefer integrating Ayira colors through theme settings, color schemes, and shared tokens instead of adding isolated hard-coded values.

The JavaScript architecture uses browser custom elements rather than a framework. `global.js` provides shared storefront components and utilities, `pubsub.js` coordinates events between components, and `constants.js` defines shared event names and constants. Extend these contracts carefully rather than introducing a second interaction system.

## Brand foundation

- Hanken Grotesk (weights 300–800) is loaded for body and heading typography.
- Forest green `#0D4F47` is the primary brand and action color.
- Mustard gold `#D4A737` is the accent color.
- Warm cream `#F6F6EE` is the primary storefront background.
- Muted slate `#667085` supports secondary text.

Use these values through existing theme settings and design tokens wherever possible. New visual work should remain recognizably Ayira while preserving contrast, focus visibility, readable type, and responsive behavior.

## Architecture

Use this mental model for all storefront work:

```text
Shopify = commerce platform and source of truth
Dawn    = storefront behavior and interaction controller
Ayira   = UI, UX, content hierarchy, and visual identity
```

### Shopify owns

- Cart data, inventory, quantity rules, discounts, and calculated prices
- Cart and checkout APIs
- Checkout and payment processing
- Liquid objects, routes, section rendering, and theme settings

### Dawn owns

- Add, update, and remove interactions
- AJAX requests and section refreshes
- Pub/sub events and header synchronization
- Loading, error, focus, and accessibility behavior
- Cart notifications and reusable storefront custom elements

### Ayira owns

- Storefront markup and information hierarchy
- Typography, color, spacing, imagery, and responsive layout
- Component appearance, interaction presentation, and UX polish
- Branded empty, loading, success, and error-state presentation

## Dawn–Ayira contract

Ayira may redesign anything customers see, but it must preserve the behavioral hooks Dawn requires. These hooks include custom elements, stable IDs, compatibility classes, `data-*` attributes, replaceable section containers, and accessible live regions.

Ayira classes should be additive. Keep the Dawn hook alongside the Ayira class when JavaScript depends on it.

```html
<button class="ayira-qty__btn quantity__button">
```

Do not put Ayira-specific visual knowledge into Dawn JavaScript. Changes to shared Dawn assets must be generic robustness or compatibility improvements that continue to support the standard Dawn components and cart drawer.

## Change placement

- Commerce calculations or checkout rules belong to Shopify configuration, APIs, or Functions.
- Storefront interaction behavior belongs to Dawn or a generic behavioral component.
- Layout, markup, styling, responsive behavior, and visual states belong to Ayira.
- When changing Ayira markup, audit every Dawn selector, ID, custom element, and data attribute that consumes it.
- Prefer adapting Ayira markup to a stable Dawn contract over creating a duplicate Ayira JavaScript engine.
- Preserve Shopify-calculated values such as `final_price`, `final_line_price`, discounts, selling plans, unit prices, and quantity rules.
- Do not keep scripts, styles, sections, or compatibility shims that have no active consumer.

## Cart contract

The Ayira cart uses Dawn as its behavioral engine. Preserve the active contract around:

- `<cart-items>`, `<quantity-input>`, and `<cart-remove-button>`
- `#main-cart-items`, `.js-contents`, and the current Shopify section ID
- `#CartItem-*`, `#Quantity-*`, and `#Line-item-error-*`
- `.cart-item`, `.quantity__button`, and `.loading__spinner`
- `data-index`, `data-quantity-variant-id`, and `data-quantity-line-key`
- `#cart-errors`, `#cart-live-region-text`, and `#shopping-cart-line-item-status`
- `#cart-icon-bubble` and cart update pub/sub events

Optional section targets must be guarded in shared JavaScript. Missing optional markup must not abort the rest of a cart refresh.

## Verification

For cart or product-form changes, verify at minimum:

- Add to cart without navigation or full-page reload
- Notification and header badge updates
- Quantity increase, decrease, direct input, and limits
- Line removal and empty-cart transition
- Final and original prices, discounts, selling plans, and unit prices
- Loading, error, focus, and live-region behavior
- Desktop and mobile layouts
- Shopify theme validation, Theme Check, JavaScript syntax, and `git diff --check`

Keep commits focused by ownership boundary: Ayira presentation/markup changes separately from shared Dawn runtime changes when practical.
