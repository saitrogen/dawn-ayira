# Ayira Announcement Bar Component Documentation

The **Ayira Announcement Bar** is a highly optimized, premium Shopify section component designed to support the Ayira storefront aesthetic. It features three customizable layout modes, seamless infinite CSS marquee loops, and lightweight Vanilla JS transitions.

---

## 📂 File Locations

- **Liquid Template / Section Config:** `sections/announcement-bar.liquid`
- **Styles / Transitions CSS:** `assets/section-announcement-bar.css`
- **Configuration (Active Layout):** `sections/header-group.json`

---

## ⚡ Key Features

1. **Three Layout Modes:**
   - **Single Message:** Renders the first configured block statically in the center.
   - **Carousel:** Cycles through configured blocks using custom transitions and inline Vanilla JS, avoiding heavy dependencies like Dawn's default slideshow scripts.
   - **Scrolling Marquee:** Creates an infinite, gapless scrolling loop with customizable speed and gold star (`★`) dividers.
2. **Flexible Links & CTA Modifiers:**
   - If a block has a link and a **Link Label**, it renders an underlined gold CTA link with an arrow (`→`) next to the text.
   - If a block has a link but **Link Label is empty**, the entire block container is wrapped with a absolute-positioned link overlay, making the entire message area clickable.
3. **Ayira Dark theme default:**
   - Automatically uses the signature Ayira deep dark forest green (`#031E1B`) background and bold white (`#FFFFFF`, `font-weight: 600`) text.
   - Integrates natively with Shopify color schemes; changing from the default color scheme (Scheme-4) seamlessly falls back to standard theme variables.
4. **Theme Editor Safe:**
   - Employs dedicated `shopify:section:load` and `shopify:section:unload` DOM event listeners to automatically initialize, clean up, and reload carousel interval loops as blocks or settings are updated in the Shopify Customizer.

---

## 🛠️ Schema Configuration & Settings

### Section Settings

| ID | Type | Label | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `layout_mode` | `select` | Layout Mode | `single` | Options: `single` (Single Message), `carousel` (Carousel), `marquee` (Scrolling Marquee). |
| `marquee_speed` | `range` | Marquee Speed | `20` | Transition duration (5s - 60s) for a marquee loop. Lower value = faster scroll. |
| `auto_rotate` | `checkbox` | Auto-rotate | `false` | Enable/disable auto-cycling in Carousel mode. |
| `change_slides_speed`| `range` | Change slides speed | `5` | Rotation delay in seconds (3s - 10s) for Carousel. |
| `color_scheme` | `color_scheme` | Color scheme | `scheme-4` | Scheme-4 maps to default Ayira Forest Green & Gold style. Other schemes override it. |
| `show_line_separator`| `checkbox` | Show separator line | `true` | Renders a border line below the bar. |
| `show_social` | `checkbox` | Show social icons | `false` | Shown in Single/Carousel mode only. Automatically hidden in Marquee. |
| `enable_country_selector`| `checkbox` | Enable country/region selector | `false` | Shown in Single/Carousel mode only. Automatically hidden in Marquee. |
| `enable_language_selector`| `checkbox` | Enable language selector | `false` | Shown in Single/Carousel mode only. Automatically hidden in Marquee. |

### Block Settings (`announcement`)

| ID | Type | Label | Description |
| :--- | :--- | :--- | :--- |
| `text` | `text` | Text | The announcement message to display. |
| `link` | `url` | Link | Optional redirection URL. |
| `link_label` | `text` | Link Label (CTA) | Custom text for gold underlined link (e.g., *Shop Now*). If empty, the entire message is clickable. |

---

## 📐 Architecture & Layout Details

### Symmetrical Marquee Spacing
To avoid visual jumps or clipping, the marquee duplicates blocks within a flat layout model:
```html
<div class="ayira-announcement-bar__marquee-group">
  <span class="ayira-announcement-bar__marquee-text">Message 1 <a href="...">CTA →</a></span>
  <span class="ayira-announcement-bar__divider">★</span>
  <span class="ayira-announcement-bar__marquee-text">Message 2</span>
  <span class="ayira-announcement-bar__divider">★</span>
</div>
```
- Spacing is controlled symmetrically via `gap: 5rem` on the group container and `padding-right: 5rem` on the end of the group to ensure the transition from the end of copy #1 to the start of copy #2 is mathematically identical.
- Block sizes smaller than 4 items are automatically duplicated 3 times inside Liquid to ensure there is enough text to fill viewports without clipping.

### Lightweight Vanilla JS Carousel
The inline carousel script prevents duplicate interval processes on Theme Editor events:
```javascript
document.addEventListener('shopify:section:load', function(event) {
  if (event.detail.sectionId === '{{ section.id }}') {
    // Clear active slide interval and re-initialize
  }
});
```

---

## 💡 Maintenance Tips
- If you need to change the marquee scroll direction to Left-to-Right, edit `assets/section-announcement-bar.css` under the `@keyframes ayiraMarquee` selector to translate from `-50%` to `0%` (or inverse values).
- The divider icon is hardcoded to the star character (`★`) to maintain the Ayira visual design standard. If another symbol is requested, update `★` inside `sections/announcement-bar.liquid`.
