# Ayira Hero Banner Component Documentation

The **Ayira Hero Banner** is a premium, fully customisable hero carousel section for the Ayira storefront. It features auto-advancing slides with horizontal transitions, per-slide content overlays, a pill-animated dot pagination bar, touch/swipe support, and scoped hero-specific button styles — all implemented as a native Shopify OS 2.0 custom element with no external dependencies.

---

## 📂 File Locations

| File | Role |
| :--- | :--- |
| `sections/ayira-hero-banner.liquid` | Section markup, slide blocks, dot pagination, schema |
| `assets/section-ayira-hero-banner.css` | All component styles (carousel, slides, overlay, buttons, dots) |
| `assets/ayira-hero-banner.js` | Custom element `<ayira-hero-banner-carousel>` — autoplay, swipe, dots, keyboard nav |
| `locales/en.default.schema.json` | English translation keys under `sections.ayira-hero-banner` |

---

## ⚡ Key Features

1. **Auto-advancing carousel** with a configurable timer (3 – 15 s). Pauses automatically on hover and keyboard focus; resumes on mouseout / blur.
2. **Horizontal slide transition** driven by a CSS custom property (`--slide-offset`) and `translateX`, giving a smooth `cubic-bezier(0.4, 0, 0.2, 1)` glide with zero layout reflow.
3. **Per-slide content overlay** — each slide block independently controls vertical position (top / middle / bottom), horizontal position (left / center / right), and text alignment.
4. **Eyebrow badge** — a dot + uppercase label (e.g. `• WEEKLY SPECIALS`) rendered above the heading with the theme accent colour.
5. **Pill-animated dot pagination** — inactive dots are circular; the active dot expands to a pill shape via CSS `width` transition. Dots are keyboard-navigable with arrow keys.
6. **Touch / pointer swipe** — 50 px threshold; ignores predominantly vertical drags. Works on both touch and pointer devices.
7. **Scoped hero button styles** — Dawn's default `.button` border/pseudo-element system is overridden *only within this section*, giving pill-shaped primary and frosted-glass secondary buttons without affecting any other component.
8. **`prefers-reduced-motion` safe** — autoplay is disabled and slide transitions snap instantly when the user has reduced motion enabled.
9. **Rounded corners** — the slide track wrapper carries `border-radius: 1.6rem` (`--ayira-banner-radius`), matching the Ayira card aesthetic.

---

## 🛠️ Schema Configuration & Settings

### Section-level Settings

| ID | Type | Label | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `autoplay` | `checkbox` | Auto-advance slides | `true` | Enables timed slide advancement. |
| `autoplay_speed` | `range` | Change slides every | `5` s | Interval between slide advances (3 – 15 s). |
| `image_height` | `select` | Banner height | `medium` | `small` (36 rem) / `medium` (52 rem) / `large` (68 rem) / `adapt` (no min-height, adapts to image aspect ratio). Mobile heights are 75 % of desktop values. |
| `padding_top` | `range` | Top padding | `0` px | Section wrapper top padding (0 – 100 px). Halved automatically on mobile. |
| `padding_bottom` | `range` | Bottom padding | `0` px | Section wrapper bottom padding (0 – 100 px). Halved automatically on mobile. |

### Block Settings (`slide`) — one block = one carousel slide

| ID | Type | Label | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `image` | `image_picker` | Image | — | **Recommended: 2400 × 1200 px (2:1), JPG or WebP, < 500 KB.** Min 1200 × 600 px. |
| `image_behavior` | `select` | Image behavior | `none` | `none` / `ambient` (slow drift) / `zoom-in`. Uses Dawn's native `animate--*` class system. |
| `eyebrow_label` | `text` | Eyebrow label | — | Rendered as `• LABEL` above the heading. Leave empty to hide. |
| `heading` | `inline_richtext` | Heading | *(default copy)* | Supports inline bold/italic via `inline_richtext`. |
| `heading_size` | `select` | Heading size | `h1` | `h2` / `h1` / `h0` / `hxl` / `hxxl` — maps to Dawn's type-scale utility classes. |
| `heading_tag` | `select` | Heading HTML tag | `h2` | `h1` / `h2` / `h3` / `p` — controls the rendered HTML element for SEO semantics. |
| `text` | `text` | Subtext | *(default copy)* | Short paragraph beneath the heading. |
| `content_position_vertical` | `select` | Vertical position | `middle` | `top` / `middle` / `bottom` |
| `content_position_horizontal` | `select` | Horizontal position | `center` | `left` / `center` / `right` |
| `content_alignment` | `select` | Text alignment | `center` | `left` / `center` / `right` — aligns text and buttons inside the content box. |
| `button_label_1` | `text` | Button 1 label | `Shop weekly specials` | Leave empty to hide. |
| `button_link_1` | `url` | Button 1 link | — | |
| `button_style_secondary_1` | `checkbox` | Button 1 secondary style | `false` | `false` = primary (solid pill), `true` = secondary (frosted glass pill). |
| `button_label_2` | `text` | Button 2 label | `Browse all` | Leave empty to hide. |
| `button_link_2` | `url` | Button 2 link | — | |
| `button_style_secondary_2` | `checkbox` | Button 2 secondary style | `true` | Defaults to secondary (ghost) style for the second CTA. |

---

## 📐 Architecture & Implementation Notes

### Custom Element: `<ayira-hero-banner-carousel>`

The carousel is implemented as a Web Components custom element defined in `ayira-hero-banner.js`. It self-initialises on `connectedCallback` and cleanly tears down on `disconnectedCallback`.

**Core internal state:**
- `currentIndex` — zero-based index of the active slide
- `autoplayTimer` — `setInterval` handle; cleared on pause, reinstated on resume
- `isHovered` / `isFocused` — separate booleans so hover + focus don't conflict on resume

### Slide Transition Mechanism

Slides are laid out in a horizontal flex row inside `.ayira-hero-banner__track`. The JS calculates a pixel offset (`currentIndex × slideWidth`) and writes it to the CSS custom property `--slide-offset` (with a `px` unit suffix). The CSS applies it via:

```css
.ayira-hero-banner__track {
  transform: translateX(calc(-1 * var(--slide-offset, 0px)));
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
```

When `prefers-reduced-motion` is active or `animate = false`, the transition is set to `none` for a single frame before being re-enabled, producing an instant snap.

### Why `overflow: hidden` is on the Track Wrapper, Not the Carousel Root

The dot pagination is a sibling of `.ayira-hero-banner__track-wrapper` inside `<ayira-hero-banner-carousel>`. If `overflow: hidden` were on the carousel root, the dots would be clipped and invisible. The solution:

```
<ayira-hero-banner-carousel>
  <div class="ayira-hero-banner__track-wrapper">  ← overflow: hidden clips slides here
    <ul class="ayira-hero-banner__track"> ... </ul>
  </div>
  <div class="ayira-hero-banner__pagination"> ... </div>  ← visible because it's a sibling
</ayira-hero-banner-carousel>
```

### Scoped Button Styles (No Global Side Effects)

Dawn's `.button` class relies on `::before` / `::after` pseudo-elements for its border and shadow system. Inside the hero banner, those pseudo-elements are suppressed and the button appearance is fully overridden using the parent class as a scope guard:

```css
/* Only applies inside this section — zero global impact */
.ayira-hero-banner__buttons .button { border-radius: 10rem; ... }
.ayira-hero-banner__buttons .button--primary { background-color: rgb(var(--color-button)); ... }
.ayira-hero-banner__buttons .button--secondary { backdrop-filter: blur(8px); ... }
.ayira-hero-banner__buttons .button::before,
.ayira-hero-banner__buttons .button::after { display: none; }
```

The merchant-facing toggle (`button_style_secondary_1`) still uses the same `button--primary` / `button--secondary` class names, so the theme editor experience is identical to other Dawn sections.

### Resize Handling

On `window.resize` (debounced 150 ms), the JS recalculates `slideWidth` and rewrites `--slide-offset` with no animation, preventing the carousel from getting stuck at a stale pixel offset after viewport changes.

---

## 💡 Maintenance Tips

- **Add a new slide:** In the Theme Customizer, click **Add block → Slide** inside the Ayira Hero Banner section. Each block is fully independent.
- **Change border radius:** Update `--ayira-banner-radius` at the top of `section-ayira-hero-banner.css`. The value cascades to both the track wrapper and individual slides.
- **Adjust dot size / active pill width:** Edit `.ayira-hero-banner__dot` (`width` / `height`) and `.ayira-hero-banner__dot.is-active` (`width`) in the CSS.
- **Change autoplay default:** The `autoplay_speed` schema default is `5` (seconds). Change the `"default"` value in the schema to adjust it project-wide.
- **Single-slide use:** When only one slide block is added, the dot pagination bar is automatically hidden (the `{% if section.blocks.size > 1 %}` guard in the Liquid).
- **Theme Editor live reload:** The custom element re-initialises cleanly because the browser destroys and recreates the element when Shopify injects a new section HTML payload during customiser edits.
