# Ayira Hero Banner Component Documentation

> Image production dimensions and safe zones are defined in [Homepage Image Dimensions](image-dimensions.md).

The **Ayira Hero Banner** is a premium, fully customisable hero carousel section for the Ayira storefront. It features an infinite looping horizontal carousel layout with 100% full-width slides, simple circular dot pagination aligned below the cards, touch/swipe support, and scoped hero-specific button styles — all implemented as a native Shopify OS 2.0 custom element with no external dependencies.

---

## 📂 File Locations

| File | Role |
| :--- | :--- |
| `sections/ayira-hero-banner.liquid` | Section markup, slide blocks, dot pagination, schema |
| `assets/section-ayira-hero-banner.css` | All component styles (carousel, slides, overlay, buttons, dots) |
| `assets/ayira-hero-banner.js` | Custom element `<ayira-hero-banner-carousel>` — infinite looping autoplay, swipe, dots, keyboard nav |
| `locales/en.default.schema.json` | English translation keys under `sections.ayira-hero-banner` |

---

## ⚡ Key Features

1. **Auto-advancing infinite loop** with a configurable timer (3 – 15 s). Moves continuously in a single direction (leftward) and loops seamlessly by snapping. Pauses automatically on hover and keyboard focus; resumes on mouseout / blur.
2. **Full-width layout** driven by a CSS flex layout and calculated pixel offset, fitting each slide exactly to 100% of the container width.
3. **Per-slide content overlay** — each slide block independently controls vertical position (top / middle / bottom), horizontal position (left / center / right), and text alignment.
4. **Eyebrow badge** — a dot + uppercase label (e.g. `• WEEKLY SPECIALS`) rendered above the heading with the theme accent colour.
5. **Circular dot pagination** — clean, circular dots centered underneath the banner card. The active dot matches the primary button theme color. Dots are keyboard-navigable with arrow keys.
6. **Touch / pointer swipe** — 50 px threshold; ignores predominantly vertical drags. Works on both touch and pointer devices.
7. **Scoped hero button styles** — Dawn's default `.button` border/pseudo-element system is overridden *only within this section*, giving pill-shaped primary and frosted-glass secondary buttons without affecting any other component.
8. **`prefers-reduced-motion` safe** — autoplay is disabled and slide transitions snap instantly when the user has reduced motion enabled.
9. **Rounded corners** — each slide card carries `border-radius: 1.6rem` (`--ayira-banner-radius`), matching the Ayira card aesthetic.

---

## 🛠️ Schema Configuration & Settings

### Section-level Settings

| ID | Type | Label | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `autoplay` | `checkbox` | Auto-advance slides | `true` | Enables timed slide advancement. |
| `autoplay_speed` | `range` | Change slides every | `5` s | Interval between slide advances (3 – 15 s). |
| `image_height` | `select` | Banner height | `adapt` | `small` (36 rem) / `medium` (52 rem) / `large` (68 rem) / `adapt` (no min-height, adapts to image aspect ratio). Mobile heights are 75 % of desktop values. |
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

To achieve a seamless infinite loop in a single direction (leftward):
1. **Dynamic Cloning**: If there are 2 or more slides, the first slide is cloned and appended, and the last slide is cloned and prepended.
2. **Translation Offset**: The track offset is computed in JS based on container and slide widths:
   `TranslateX = - elementIndex * slideWidth`
3. **Transition Snapping**: The JS listens to `transitionend` events. When transitioning to a clone at index `0` (prepended last slide) or index `slideCount + 1` (appended first slide), the script instantly resets the track translation to the corresponding real slide index (index `slideCount` or index `1` respectively) without animation (`transition = 'none'`), creating an infinite loop.

The CSS applies the offset via:

```css
.ayira-hero-banner__track {
  transform: translateX(var(--slide-offset, 0px));
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
```

When `prefers-reduced-motion` is active or `animate = false`, the transitions snap instantly, bypassing the `transitionend` listener to immediately complete the snap.

### How `overflow: hidden` clips adjacent slides

The track wrapper `.ayira-hero-banner__track-wrapper` has `overflow: hidden` and `border-radius: var(--ayira-banner-radius)` to clip the trailing slide track content and keep the corners rounded.

The dot pagination is rendered below the track wrapper inside `<ayira-hero-banner-carousel>`. Since the wrapper is standard block flow, the pagination is positioned below it naturally:

```
<ayira-hero-banner-carousel>
  <div class="ayira-hero-banner__track-wrapper">  ← overflow: hidden clips adjacent slides here
    <ul class="ayira-hero-banner__track"> ... </ul>
  </div>
  <div class="ayira-hero-banner__pagination"> ... </div>  ← flows below the slides naturally
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
- **Change border radius:** Update `--ayira-banner-radius` at the top of `section-ayira-hero-banner.css`. The value cascades to individual slides.
- **Adjust dot size / color:** Edit `.ayira-hero-banner__dot` (`width` / `height`) and `.ayira-hero-banner__dot.is-active` in the CSS.
- **Change autoplay default:** The `autoplay_speed` schema default is `5` (seconds). Change the `"default"` value in the schema to adjust it project-wide.
- **Single-slide use:** When only one slide block is added, the dot pagination bar is automatically hidden (the `{% if section.blocks.size > 1 %}` guard in the Liquid).
- **Theme Editor live reload:** The custom element re-initialises cleanly because the browser destroys and recreates the element when Shopify injects a new section HTML payload during customiser edits.
