# Developer Guide: Ayira Header Component

This guide provides a quick reference for the custom **Ayira Header** component implemented on the Dawn theme.

---

## 1. File Structure

The component follows Shopify OS 2.0 best practices, separating markup, style, behavior, and nested modules:

*   **Markup & Schema:** `sections/ayira-header.liquid`
    *   *Role:* Sets up semantic HTML rows, navigation structures, mobile menus, and theme schema toggles.
*   **Decoupled Styles:** `assets/section-ayira-header.css`
    *   *Role:* Contains isolated styling rules for desktop and mobile responsive layout layers.
*   **Asynchronous JavaScript:** `assets/ayira-header.js`
    *   *Role:* Powers mobile navigation drawers, overlay toggle inputs, autofocus, and the `<ayira-sticky-header>` component.
*   **Search Snippet:** `snippets/ayira-header-search.liquid`
    *   *Role:* Houses the unified, predictive-search-enabled form code used in both desktop and mobile views.

---

## 2. Key Features & Editor Settings

The header is fully configurable inside the **Shopify Theme Customizer**:

1.  **Desktop Logo Dimensions:**
    *   `logo_width` (Range: `80px` - `220px`): Desktop width.
    *   `logo_height` (Range: `20px` - `100px`): Desktop height.
2.  **Mobile Logo Dimensions:**
    *   `logo_height_mobile` (Range: `12px` - `60px`): Mobile height.
3.  **Sticky Styles (`sticky_header_type`):**
    *   `none`: Regular static element.
    *   `always`: Fixed to the top under all scroll conditions.
    *   `on-scroll-up`: Slides down into view *only* when the user scrolls upwards.
4.  **Color Schemes:** Inherits default Shopify color scheme gradients and tokens natively.

---

## 3. Core Implementation & Developer Notes

### Stacking Contexts & Layers
*   **Normal Header wrapper (`.ayira-header-wrapper`):** Defaults to `z-index: 100`.
*   **Open Mobile Drawer:** Placed inside the custom header container. Toggling the hamburger menu appends `.menu-open` to `<ayira-sticky-header>`, raising its stacking index to `z-index: 100000 !important`. This forces it to overlay the announcement bar and prevent overlap clipping.
*   **Mobile Search Toggle Panel:** Formulated as an absolute-positioned overlay within `.ayira-header__mobile` (`z-index: 95`), ensuring it drops down within the header bounds without colliding with elements outside it.

### Smooth Sticky Scroll (No Flickering)
*   **Method:** Custom web component `<ayira-sticky-header>` toggles `.shopify-section-header-sticky` and `.shopify-section-header-hidden` on the **parent** `.section-header` wrapper container.
*   **Why:** Toggling sticky status on the outermost Shopify section wrapper keeps the container's height in the browser document flow, completely avoiding the layout collapse loops (and violent flickering) caused by `position: fixed`.
*   **ResizeObserver:** Dynamically binds and updates the `--header-height` CSS variable on the document element (`:root`) for smooth top transitions:
    `transition: top 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);`

### Predictive Search Crash Protection
*   Dawn's native `search-form.js` executes `querySelector('button[type="reset"]')` and calls class events on it upon typing.
*   To prevent a crash (`TypeError: Cannot read classList of null`), a dummy reset button `<button type="reset" class="hidden" style="display: none !important;"></button>` is embedded inside both search forms.
*   **Desktop Column Display:** The desktop dropdown suggestions card has `.predictive-search` widened to `width: 620px !important;` in the stylesheet, allowing the suggestions column and matching product previews to render side-by-side cleanly.
