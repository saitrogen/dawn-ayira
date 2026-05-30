# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Dawn 15.4.1 (Shopify's reference theme) being forked into **Ayira Minimart** — a branded grocery/minimart storefront. The Ayira design system (colors, type, tokens) has been designed in `claude-design/` but **not yet integrated** into the theme files. All Shopify theme files are currently stock Dawn.

## Development commands

```bash
# Serve theme against a live store (requires Shopify CLI + store auth)
shopify theme dev --store=<store>.myshopify.com

# Push theme to store
shopify theme push

# Lint with Theme Check
shopify theme check

# Pull latest Dawn upstream changes
git fetch upstream
git pull upstream main
```

No build step. No package.json. No bundler. Liquid/CSS/JS ship directly to Shopify.

## Theme architecture

### CSS layering (load order in `layout/theme.liquid`)
1. **`{% style %}` block** (inline, lines 50-256) — generates all `:root` CSS vars and `.color-{scheme-id}` classes from `settings_schema.json` values at render time. This is where font families, color tokens, spacing, border-radius, shadow vars, and card geometry live.
2. **`base.css`** — Dawn's foundational CSS (alpha vars, focus styles, `.page-width`, layout primitives). Loaded synchronously and blocking.
3. **`component-*.css`** / **`section-*.css`** — each component/section has its own CSS file, loaded on-demand or via `stylesheet_tag`.

**Critical:** Dawn's color system uses RGB-channel vars (e.g. `--color-foreground: 18,18,18`) so colors can be composed with opacity: `rgba(var(--color-foreground), 0.75)`. Any Ayira color integration must match this pattern or override at the `:root` level.

### Liquid structure
- `layout/theme.liquid` — single layout wrapping all pages; head + header + `{{ content_for_layout }}` + footer
- `sections/` — OS2 sections rendered into JSON templates; each section is self-contained with its own schema block
- `snippets/` — reusable Liquid partials (card-product, price, icon-*, etc.)
- `templates/*.json` — JSON templates that compose sections into pages; `templates/*.liquid` for special cases (gift card, password)
- `config/settings_schema.json` — global theme settings (fonts, color schemes, spacing, card styles)
- `config/settings_data.json` — saved values for those settings (not in repo, store-specific)

### JavaScript
Web components pattern — custom elements extend `HTMLElement`. No framework. Key files:
- `assets/global.js` — shared utilities, `debounce`, `fetchConfig`, `trapFocus`
- `assets/pubsub.js` — tiny pub/sub event bus used across components
- `assets/constants.js` — shared constants

Each major feature has its own JS file (cart.js, facets.js, product-form.js, etc.). Scripts load `defer` in `<head>`.

## Ayira design system (`claude-design/`)

The source-of-truth design tokens for Ayira live in `claude-design/assets/colors_and_type.css`. **This file is not loaded by the theme yet.**

Key brand decisions:
- **Font:** Hanken Grotesk (all weights 300-800) via Google Fonts — replaces Dawn's `assistant_n4` default
- **Primary:** `--color-forest-700: #0D4F47` (deep green)
- **Accent:** `--color-mustard-500: #D4A737` (warm mustard)
- **Background:** `--color-cream-100: #F6F6EE`
- **Body text:** `--color-ink-500: #667085`
- Semantic aliases (`--bg-app`, `--fg-default`, `--primary`, `--accent`, etc.) are defined over the raw palette

`claude-design/` also contains HTML prototype files (Ayira Storefront Prototype.html, Ayira Dawn UI Reference.html) and React JSX files for the design prototype — **these are reference only**, not part of the Shopify theme.

Logo assets (forest + cream variants, mark + wordmark) are in `claude-design/assets/`.

## Integration work not yet done

- `settings_schema.json` has no Ayira font or brand color settings
- `layout/theme.liquid` has no custom stylesheet link
- No Ayira logo assets in `assets/`
- Dawn's `{% style %}` block still outputs Dawn defaults (Assistant font, black/white color scheme)

When integrating, the correct approach is:
1. Add Hanken Grotesk as the `type_header_font` and `type_body_font` defaults in `settings_schema.json` (Shopify font picker uses CDN fonts — Google Fonts require a workaround via `preconnect` + custom `font_face`)
2. Map Ayira tokens to Dawn's color scheme vars in `settings_data.json` or override in `{% style %}`
3. Copy logo assets to `assets/` and reference via `settings.logo`
