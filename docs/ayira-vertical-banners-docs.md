# Ayira Vertical Banners Component Documentation

> Image production dimensions and safe zones are defined in [Homepage Image Dimensions](image-dimensions.md).

The **Ayira Vertical Banners** section is a premium, high-end vertical category banner component designed to mimic the interactive look and feel of modern video "Reels". It displays vertical tiles arranged in a horizontal scroll track that allows users to drag/swipe horizontally on both desktop and mobile viewports. The component features a tall 9:16 aspect ratio, full-bleed background images (with solid color fallbacks), a dark top-down gradient overlay for heading legibility, and modern CSS elevation hover states.

---

## 📂 File Locations

| File | Role |
| :--- | :--- |
| `sections/ayira-vertical-banners.liquid` | Section markup, block loops, embedded CSS stylesheet, and settings schema |
| `templates/index.json` | Registration and default blocks configuration on the homepage layout |

---

## ⚡ Key Features

1. **Reels-Style Horizontal Scroll Track** — The banners layout in a single-row flex track that scrolls horizontally across all screen widths. Tactile touch/swipe interactions are powered by native scroll-snapping (`scroll-snap-type: x mandatory`).
2. **Mobile Viewport-Relative Card Sizing** — Mobile cards are dynamically sized based on viewport width:
   ```css
   flex: 0 0 calc((100vw - 40px) / 2.7);
   ```
   This calculation accounts for left-hand padding (`24px`/`1.5rem`) and column gaps (`8px`), ensuring exactly **2.7 cards** are visible on-screen at any time. The third card is cropped by approximately 30%, visually signaling to mobile users that the row is scrollable.
3. **9:16 Portrait Aspect Ratio** — Matches standard mobile Reels/TikTok proportions, reducing height contextually on smaller screens for a compact and app-like experience.
4. **Interactive Hover Elevation** — Hovering over any banner card triggers a premium CSS transition sequence:
   - The card shifts vertically (`translateY(-6px)`).
   - The card shadow deepens for a physical elevation effect.
   - The background image scales up smoothly (`scale(1.04)`) using a custom cubic-bezier timing function.
5. **Full-Bleed Media with Text Safety** — Banners display high-quality background images (or product apparel onboarding placeholders). A dark, top-heavy gradient overlay is layered between the image and the title to guarantee text contrast and legibility under light backgrounds.
6. **Embedded Styles (shopify-liquid Standard)** — Stylesheet is built directly into the section file using `{% stylesheet %}` and `{% style %}` tags to avoid dependencies on external assets or blocked `asset_url` references.

---

## 🛠️ Schema Configuration & Settings

### Section-level Settings

| ID | Type | Label | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `eyebrow` | `text` | Eyebrow text | `Browse` | Tiny uppercase text rendered above the main heading. |
| `title` | `inline_richtext` | Heading | `Shop by Category` | Section title. Supports basic inline formatting. |
| `show_view_all` | `checkbox` | Show view all link | `true` | Toggles rendering of the "View all" navigation link. |
| `view_all_label` | `text` | View all link text | `All Categories` | Custom text for the navigation link. |
| `view_all_link` | `url` | View all link URL | — | Destination page for the "View all" link. |
| `color_scheme` | `color_scheme` | Color scheme | `scheme-1` | Active color palette selection. |
| `padding_top` | `range` | Top padding | `36` px | Section top margin (0 – 100 px, scaled down to 75% on mobile). |
| `padding_bottom` | `range` | Bottom padding | `36` px | Section bottom margin (0 – 100 px, scaled down to 75% on mobile). |

### Block Settings (`banner`) — unlimited blocks (recommended 3–10)

| ID | Type | Label | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `image` | `image_picker` | Banner image | — | Full-bleed background image graphic. |
| `title` | `inline_richtext` | Heading | `Category Name` | Bold card title, positioned in the top-left corner. |
| `link` | `url` | Link URL | — | Destination URL when clicking anywhere on the card. |
| `background_color` | `color` | Card background color | `#D4A737` | Solid background color when no image is loaded. |
| `text_color` | `color` | Card text color | `#FFFFFF` | Custom text color for card title readability. |

---

## 📐 Architecture & Implementation Notes

### Viewport Math on Mobile

To maintain high visual quality, the vertical banners track extends past the margins using negative right margins on mobile:
```css
@media screen and (max-width: 749px) {
  .ayira-vertical-banners__track {
    gap: 8px;
    margin-right: -24px;
    padding-right: 24px;
  }
}
```
The visible width of the track is exactly `100vw - 24px` (taking left-hand margins into account). To render exactly 2.7 cards, we solve:
$$\text{Card Width} = \frac{(100\text{vw} - 24\text{px}) - 2 \times \text{gap}}{2.7} = \frac{100\text{vw} - 40\text{px}}{2.7}$$
This ensures the 3rd card is clipped nicely at 70% width, providing a tactile prompt to swipe.

---

## 💡 Maintenance & Customization Tips

- **Change Desktop Tile Sizing**: By default, tiles size to `flex: 0 0 220px` on screens wider than `750px`. To make desktop cards wider or narrower, modify the `flex` basis inside the `@media screen and (min-width: 750px)` query.
- **Adjust Mobile Peek Sizing**: To show 2.5 cards instead of 2.7, change the mobile card width division factor from `/ 2.7` to `/ 2.5` in the mobile CSS block.
- **Color Schemes**: Individual blocks can use custom colors or theme schemes. Block background colors default to Ayira Mustard (`#D4A737`), Ayira Forest Green (`#0D4F47`), or Ayira Red (`#B42318`) depending on preloaded templates.
