# Ayira Collection List Component Documentation

The **Ayira Collection List** is a premium, fully customisable collection listing/aisle grid section for the Ayira storefront. It displays collection category tiles (linking to collection pages) using a sleek, horizontal scroll row on desktop (with right-edge "peek" capability to invite interaction) and a responsive 2-column grid on mobile. The component features full-bleed images with bottom-heavy dark gradient overlays, hover-triggered image zoom, localized product count labels, and custom micro-animated circle arrow buttons.

---

## 📂 File Locations

| File | Role |
| :--- | :--- |
| `sections/ayira-collection-list.liquid` | Section markup, collection blocks, dynamic counters, placeholders, schemas |
| `assets/section-ayira-collection-list.css` | All component layout and visual styles (scroll-snap track, tiles, gradient overlays, arrows) |
| `locales/en.default.json` | English translation keys under `sections.ayira_collection_list` |

---

## ⚡ Key Features

1. **Horizontal Scroll Track on Desktop** — Cards lay out in a single-row flex track that scrolls horizontally. It utilizes CSS scroll-snapping (`scroll-snap-type: x mandatory`) for smooth, tactile navigation.
2. **Right-Edge "Peek" Layout** — Desktop cards are sized (`calc(20% - 12px)`) so that a portion of the 6th card peeks from the right-hand edge of the viewport, naturally signaling to the user that more collections are scrollable.
3. **Responsive Mobile Grid** — Seamlessly switches to a clean 2-column grid on viewport sizes below `750px` (`max-width: 749px`), disabling horizontal scroll and scaling card aspect ratios dynamically.
4. **Interactive Card Hover** — Hovering over any collection tile initiates a micro-animation sequence:
   - The card lifts slightly (`translateY(-3px)`) and gains a deeper shadow.
   - The featured image scales up smoothly (`scale(1.04)`) using a custom cubic-bezier timing function.
   - The circle arrow button shifts right and changes background colour from white to gold.
5. **Full-Bleed Media with Overlay** — Uses collection featured images (or numbered apparel placeholder SVGs when no image is present) rendered behind a dark bottom-left heavy gradient overlay to ensure text contrast and readability.
6. **Optional Product Count** — Toggleable product count displays (e.g., "10 items") dynamically rendered beneath the collection name using localized translation strings.
7. **Semantic & Accessible Markup** — Structured using appropriate ARIA roles (`role="list"`, `role="listitem"`, `aria-label`) and full keyboard focus state rings (`:focus-visible`) for accessibility.

---

## 🛠️ Schema Configuration & Settings

### Section-level Settings

| ID | Type | Label | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `eyebrow` | `text` | Eyebrow Text | `Shop by Aisle` | A small, uppercase text label rendered above the section header. |
| `title` | `inline_richtext` | Section Title | `Browse our collections` | Main bold heading of the section. Supports basic inline formatting. |
| `show_view_all` | `checkbox` | Show 'All collections' link | `true` | Toggles the visibility of the "All collections →" navigation link. |
| `view_all_label` | `text` | Link label | `All collections` | Custom text for the navigation link. Defaults to "All collections". |
| `show_product_count` | `checkbox` | Show product count | `true` | Toggle to display the number of products (e.g. "12 items") inside the cards. |
| `color_scheme` | `color_scheme` | Color scheme | `scheme-1` | Selects the active theme color palette for background and foreground colors. |
| `padding_top` | `range` | Padding top | `48` px | Top spacing of the section (0 – 100 px, scaled down to 75% on mobile). |
| `padding_bottom` | `range` | Padding bottom | `48` px | Bottom spacing of the section (0 – 100 px, scaled down to 75% on mobile). |

### Block Settings (`collection`) — maximum 20 blocks per section

| ID | Type | Label | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | `collection` | Collection | — | The Shopify collection to display in this tile slot. |

---

## 📐 Architecture & Implementation Notes

### CSS Layout & Alignment

The container `.ayira-collection-list` is wrapped inside the standard Dawn page-width layout. To allow the cards to extend and peek past the standard margins on desktop, a negative right margin is applied to the scroll track:

```css
.ayira-collection-list__track {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Hide scrollbar for Firefox */
  margin-right: -24px;
  padding-right: 24px;
}
```

The scroll track hides webkit scrollbars globally, keeping a clean visual layout while maintaining full browser-native touch and trackpad swipe physics.

### Media Fallback Architecture

If a collection block is added but has no featured image, or if the merchant hasn't assigned a collection yet (onboarding state), the Liquid code automatically loops and displays placeholder graphics:

1. **Empty Block/Onboarding**: Renders a standard collection apparel SVG matching the tile's current index (`collection-apparel-1` through `collection-apparel-4`), overlaid with "Collection title" and a default "10 items" count.
2. **Collection with No Image**: Renders a placeholder card containing the first letter of the collection's title capitalized, preserving structural balance without relying on empty layout slots.

---

## 💡 Maintenance & Customization Tips

- **Adjust Tile Sizing / Margins**: The default sizing on desktop shows ~5 cards with a peek. To show more or fewer cards, adjust the `flex: 0 0 calc(...)` basis on `.ayira-collection-tile` under the desktop stylesheet query.
- **Modify Hover Animations**: To change how fast/slow the hover zooming or shifting is, look for the `transition` properties defined on `.ayira-collection-tile__img` and `.ayira-collection-tile__arrow`.
- **Change Default Translation Values**: Locate `locales/en.default.json` and adjust the strings in `sections.ayira_collection_list` for custom dynamic counter suffixes.
- **Onboarding Mode**: If a merchant deletes all blocks, the section renders 5 pre-styled onboarding cards in preview mode to show how the component behaves out-of-the-box.
