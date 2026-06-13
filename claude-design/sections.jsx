// RefBlock + viewport frames + the 13 Dawn section blocks.

function Customizer({ section, file, settings, note }) {
  return (
    <div className="cust">
      <div className="cust-head">
        <span className="dot"></span> Theme customizer · Dawn 15.4.1
      </div>
      <div className="cust-path">
        <span>Online Store</span>
        <span className="arrow">→</span>
        <span>Customize</span>
        <span className="arrow">→</span>
        <span style={{ color: 'var(--t-accent)' }}>{section}</span>
      </div>
      {file && <div style={{ fontSize: 11, color: '#6f8079', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>{file}</div>}
      {settings && settings.map((s, i) => (
        <div key={i} className="row">
          <span className="k">{s.k}</span>
          <span className={`v ${s.v === true ? 'bool-on' : s.v === false ? 'bool-off' : ''}`}>
            {typeof s.v === 'boolean' ? (s.v ? 'true' : 'false') : String(s.v)}
          </span>
        </div>
      ))}
      {note && <div className="note">{note}</div>}
    </div>
  );
}

function VP({ tag = "Desktop · 1280px", url = "ayira-mini-mart-3.myshopify.com", mobile = false, children }) {
  return (
    <div className={`vp ${mobile ? 'vp-mob' : ''}`} style={mobile ? { width: 375, maxWidth: '100%' } : null}>
      <div className="vp-bar">
        <div className="vp-bar-l">
          <span className="vp-dot r"></span>
          <span className="vp-dot y"></span>
          <span className="vp-dot g"></span>
          {!mobile && <span className="vp-url">{url}</span>}
        </div>
        <span className="vp-tag">{tag}</span>
      </div>
      <div className={`vp-body ay ${mobile ? 'ay-mob' : ''}`}>{children}</div>
    </div>
  );
}

function RefBlock({ id, num, dawnSection, title, desc, customizer, children, variantTabs, variantId, onVariant }) {
  return (
    <section className="ref" id={id}>
      <div className="ref-head">
        <div>
          <div className="eyebrow">
            <span className="num">{num}</span>
            Dawn · {dawnSection}
          </div>
          <h2>{title}</h2>
          <p className="desc">{desc}</p>
          {variantTabs && (
            <div className="variants">
              {variantTabs.map(v => (
                <button key={v.id} className={`variant-tab ${variantId === v.id ? 'active' : ''}`} onClick={() => onVariant(v.id)}>{v.label}</button>
              ))}
            </div>
          )}
        </div>
        <Customizer {...customizer} />
      </div>
      <div className="vp-row">{children}</div>
    </section>
  );
}

// ============================================================
// 13 Dawn section blocks
// ============================================================

function Block1_Announcement({ tw }) {
  const [v, setV] = React.useState("single");
  return (
    <RefBlock
      id="announcement_bar"
      num="01"
      dawnSection="Announcement bar"
      title="Announcement bar"
      desc="Single-row promotional strip pinned to the very top of every page. Lives inside Dawn's Header group as one or more Announcement blocks — add several blocks to auto-rotate."
      customizer={{
        section: "Header → Announcement bar",
        file: "sections/header-group / Announcement bar",
        settings: [
          { k: "color_scheme",     v: "Inverse" },
          { k: "show_country_selector", v: false },
          { k: "show_language_selector", v: false },
          { k: "auto_rotate_blocks", v: v === "rotating" || v === "scrolling" },
          { k: "rotate_seconds",   v: v === "rotating" ? 5 : "—" },
          { k: "block_text_1",     v: '"Free delivery in Al Khor on orders over QAR 50"' },
          { k: "block_link_label", v: v === "cta" ? '"Shop now"' : '"—"' },
        ],
        note: "Multiple Announcement blocks auto-rotate. The 'Scrolling' look is achieved with a long single text block on a sufficiently narrow screen — Dawn's announcement is single-line and will wrap on mobile; keep copy under 64 characters.",
      }}
      variantTabs={[
        { id: "single",    label: "Single message" },
        { id: "rotating",  label: "Rotating (2+ blocks)" },
        { id: "cta",       label: "With CTA link" },
        { id: "scrolling", label: "Scrolling marquee" },
      ]}
      variantId={v}
      onVariant={setV}
    >
      <VP tag="Desktop · 1280px">
        <AnnouncementBar variant={v} />
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <AnnouncementBar variant={v} />
      </VP>
    </RefBlock>
  );
}

function Block2_Header({ tw }) {
  const [v, setV] = React.useState("logo-left");
  return (
    <RefBlock
      id="header"
      num="02"
      dawnSection="Header"
      title="Header"
      desc="The sticky brand bar — logo, primary nav, search, account and cart. Dawn supports four logo positions; the two most useful are documented here. Sticky-on-scroll is a free toggle."
      customizer={{
        section: "Header → Header",
        file: "sections/header.liquid",
        settings: [
          { k: "logo_position", v: v === "logo-left" ? "Middle left" : "Top center" },
          { k: "menu",          v: "Main menu" },
          { k: "enable_sticky_header", v: true },
          { k: "show_line_separator",  v: false },
          { k: "color_scheme",  v: "Background 1" },
          { k: "margin_bottom", v: "0px" },
        ],
        note: "Dawn's logo position dropdown changes header layout entirely. With ‘Top center', search moves to a second row under the wordmark on mobile, navigation hides behind a hamburger.",
      }}
      variantTabs={[
        { id: "logo-left",   label: "Logo middle left · 1 row" },
        { id: "logo-center", label: "Logo top center · 2 rows" },
      ]}
      variantId={v}
      onVariant={setV}
    >
      <VP tag="Desktop · 1280px">
        {v === "logo-left" ? <HeaderLogoLeft /> : <HeaderLogoCenter />}
        <div style={{ height: 48 }}></div>
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <HeaderLogoLeft mobile />
        <div style={{ height: 32 }}></div>
      </VP>
    </RefBlock>
  );
}

function Block3_Hero() {
  const [v, setV] = React.useState("left");
  return (
    <RefBlock
      id="hero"
      num="03"
      dawnSection="Image banner"
      title="Image banner (Hero)"
      desc="Full-bleed image with a heading, subheading and up to two CTA buttons. Dawn's Image Banner is the section every grocery storefront pins to the top of the home page."
      customizer={{
        section: "Home page → Image banner",
        file: "sections/image-banner.liquid",
        settings: [
          { k: "image",             v: "hero-everyday.jpg · 2400×1200" },
          { k: "image_height",      v: v === "left" ? "Large" : "Medium" },
          { k: "image_behavior",    v: "None" },
          { k: "desktop_content_position", v: v === "left" ? "Middle left" : "Middle center" },
          { k: "desktop_content_alignment", v: v === "left" ? "Left" : "Center" },
          { k: "color_scheme",      v: "Accent 1 (forest)" },
          { k: "show_text_below",   v: false },
          { k: "stack_images_on_mobile", v: true },
          { k: "button_label_1",    v: '"Shop weekly specials"' },
          { k: "button_style_primary_1", v: true },
          { k: "button_label_2",    v: '"Browse all"' },
        ],
        note: "Text overlay always carries an automatic dark gradient on Dawn — no custom CSS needed. Switch desktop_content_alignment between Left/Center/Right and Dawn rebuilds the column.",
      }}
      variantTabs={[
        { id: "left",     label: "Content left · large" },
        { id: "centered", label: "Content centered · medium" },
      ]}
      variantId={v}
      onVariant={setV}
    >
      <VP tag="Desktop · 1280px">
        <Hero variant={v === "centered" ? "centered" : "default"} />
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <Hero variant={v === "centered" ? "centered" : "default"} />
      </VP>
    </RefBlock>
  );
}

function Block4_MultiColumn() {
  return (
    <RefBlock
      id="multi_column"
      num="04"
      dawnSection="Multicolumn"
      title="Multicolumn"
      desc="Up to six columns of icon + heading + short text. Use it for delivery promises, opening hours, store features — the value props strip every Shopify homepage needs."
      customizer={{
        section: "Home page → Multicolumn",
        file: "sections/multicolumn.liquid",
        settings: [
          { k: "title",          v: '""' },
          { k: "image_width",    v: "Half-width of column" },
          { k: "image_ratio",    v: "Square" },
          { k: "column_alignment", v: "Left" },
          { k: "background_style", v: "Column background" },
          { k: "columns_to_show_on_desktop", v: 4 },
          { k: "swipe_on_mobile", v: false },
          { k: "color_scheme",   v: "Background 2 (cream)" },
        ],
        note: "Each column is a block. Drop a custom-uploaded SVG as the image to get the Lucide-style icon — Dawn renders block.image at the size you set above.",
      }}
    >
      <VP tag="Desktop · 1280px">
        <MultiColumn />
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <MultiColumn mobile />
      </VP>
    </RefBlock>
  );
}

function Block5_FeaturedCollection() {
  const [v, setV] = React.useState("4");
  const S = window.SHOP;
  const products = S.products.filter(p => p.collection === "soft-drinks").slice(0, parseInt(v));
  return (
    <RefBlock
      id="featured_collection"
      num="05"
      dawnSection="Featured collection"
      title="Featured collection"
      desc="The product grid your home page lives on. Points at a single collection and renders the first N products. Card density (2/3/4/5-up) is a stock Dawn setting — no theme code required."
      customizer={{
        section: "Home page → Featured collection",
        file: "sections/featured-collection.liquid",
        settings: [
          { k: "title",                    v: '"Soft drinks · weekly favourites"' },
          { k: "collection",               v: "soft-drinks" },
          { k: "products_to_show",         v: parseInt(v) },
          { k: "columns_desktop",          v: parseInt(v) },
          { k: "columns_mobile",           v: 2 },
          { k: "image_ratio",              v: "Square" },
          { k: "show_secondary_image",     v: true },
          { k: "show_vendor",              v: false },
          { k: "show_rating",              v: false },
          { k: "enable_quick_add",         v: true },
          { k: "view_all_style",           v: "Link" },
        ],
        note: "Dawn's grid is a flat CSS grid — change columns_desktop and the same card markup re-flows. Quick-add is a single boolean toggle and renders the + icon you see on every tile.",
      }}
      variantTabs={[
        { id: "2", label: "2-up (large hero cards)" },
        { id: "3", label: "3-up" },
        { id: "4", label: "4-up (default)" },
        { id: "5", label: "5-up (dense)" },
      ]}
      variantId={v}
      onVariant={setV}
    >
      <VP tag="Desktop · 1280px">
        <FeaturedCollection title="Soft drinks · weekly favourites" products={products} cols={parseInt(v)} />
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <FeaturedCollection title="Weekly favourites" products={products} cols={2} mobile />
      </VP>
    </RefBlock>
  );
}

function Block6_CollectionList() {
  return (
    <RefBlock
      id="collection_list"
      num="06"
      dawnSection="Collection list"
      title="Collection list"
      desc="Card grid linking out to your top-level collections. Best placed right under the hero on the home page so shoppers can jump straight to an aisle."
      customizer={{
        section: "Home page → Collection list",
        file: "sections/collection-list.liquid",
        settings: [
          { k: "title",            v: '"Browse our collections"' },
          { k: "image_ratio",      v: "Portrait (4:5)" },
          { k: "columns_desktop",  v: 5 },
          { k: "swipe_on_mobile",  v: true },
          { k: "show_view_all",    v: true },
          { k: "color_scheme",     v: "Background 1" },
          { k: "collections (blocks)", v: '["Soft Drinks", "Juice", "Chocolates", "Ice Cream", "Noodles"]' },
        ],
        note: "Each card uses the collection's featured image. Collections without a featured image fall back to the placeholder you see here — upload images per collection in admin.",
      }}
    >
      <VP tag="Desktop · 1280px">
        <CollectionList />
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <CollectionList mobile />
      </VP>
    </RefBlock>
  );
}

function Block7_RichText() {
  return (
    <RefBlock
      id="rich_text"
      num="07"
      dawnSection="Rich text"
      title="Rich text"
      desc="Single-column heading + paragraph + optional button. Drop one between sections for store hours, delivery updates or short announcements that don't deserve a full image banner."
      customizer={{
        section: "Home page → Rich text",
        file: "sections/rich-text.liquid",
        settings: [
          { k: "desktop_content_position",  v: "Center" },
          { k: "content_alignment",         v: "Center" },
          { k: "color_scheme",              v: "Background 1" },
          { k: "full_width",                v: false },
          { k: "heading_size",              v: "Medium" },
          { k: "button_label",              v: '"Get directions"' },
          { k: "button_style_primary",      v: false },
        ],
        note: "Dawn renders heading, caption, text and button as four ordered blocks. Re-order them in the customizer block list to flip caption above/below the heading.",
      }}
    >
      <VP tag="Desktop · 1280px">
        <RichText />
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <RichText />
      </VP>
    </RefBlock>
  );
}

function Block8_ProductCard() {
  const [v, setV] = React.useState("default");
  const S = window.SHOP;
  // Show one card of each interesting state side-by-side
  const variantConfig = {
    "default":     { showBadges: true, showQuickAdd: true,  showSwatches: true,  quickAddStyle: "icon" },
    "outline-qa":  { showBadges: true, showQuickAdd: true,  showSwatches: true,  quickAddStyle: "outline" },
    "bar-qa":      { showBadges: true, showQuickAdd: true,  showSwatches: true,  quickAddStyle: "bar" },
    "minimal":     { showBadges: false, showQuickAdd: false, showSwatches: false, quickAddStyle: "icon" },
  };
  const cfg = variantConfig[v];
  const lineup = [
    S.products.find(p => p.handle === "coca-cola-original-taste"), // new badge
    S.products.find(p => p.handle === "pepsi"),                    // sale badge
    S.products.find(p => p.handle === "7up"),                       // sold-out
    S.products.find(p => p.handle === "galaxy-vanilla-ice-cream"), // sale
  ];
  return (
    <RefBlock
      id="product_card"
      num="08"
      dawnSection="Product card / Product grid item"
      title="Product card"
      desc="The PLP tile used everywhere a collection appears. Dawn's snippet exposes badges (Sale / Sold out / New tag), variant pills, and the quick-add affordance as customizer-driven toggles."
      customizer={{
        section: "Theme settings → Product cards",
        file: "snippets/card-product.liquid",
        settings: [
          { k: "image_padding",        v: "0px" },
          { k: "image_ratio",          v: "Square (1:1)" },
          { k: "image_shape",          v: "Default" },
          { k: "show_secondary_image", v: true },
          { k: "show_vendor",          v: false },
          { k: "show_rating",          v: false },
          { k: "show_quick_add",       v: cfg.showQuickAdd },
          { k: "quick_add_style",      v: v === "bar-qa" ? "Standard" : v === "outline-qa" ? "Bordered" : "Icon" },
          { k: "show_badges",          v: cfg.showBadges },
          { k: "sold_out_badge_text",  v: '"Sold out"' },
          { k: "sale_badge_text",      v: '"Save {n}%"' },
        ],
        note: "Dawn shows a Sale badge automatically when compare_at_price > price, and a Sold-out badge when no variant is available. Both auto-render — no custom logic needed.",
      }}
      variantTabs={[
        { id: "default",    label: "Icon quick-add (default)" },
        { id: "outline-qa", label: "Outline quick-add" },
        { id: "bar-qa",     label: "Full-width quick-add bar" },
        { id: "minimal",    label: "Minimal · no badges, no quick-add" },
      ]}
      variantId={v}
      onVariant={setV}
    >
      <VP tag="Desktop · 1280px · 4-up grid">
        <div className="ay-container" style={{ padding: '32px 48px' }}>
          <div className="ay-prod-grid cols-4">
            {lineup.map((p, i) => <ProductCard key={i} p={p} {...cfg} />)}
          </div>
        </div>
      </VP>
      <VP tag="Mobile · 375px · 2-up grid" mobile>
        <div className="ay-container" style={{ padding: '20px 16px' }}>
          <div className="ay-prod-grid cols-2">
            {lineup.slice(0, 2).map((p, i) => <ProductCard key={i} p={p} {...cfg} />)}
          </div>
        </div>
      </VP>
    </RefBlock>
  );
}

function Block9_PDP() {
  return (
    <RefBlock
      id="pdp"
      num="09"
      dawnSection="Main product"
      title="Product page (PDP)"
      desc="Image gallery + variant picker + quantity + add-to-cart, with native Dawn accordion blocks beneath. Mobile adds a sticky add-to-cart bar that pins to the viewport once the gallery scrolls off."
      customizer={{
        section: "Products → Default product",
        file: "sections/main-product.liquid",
        settings: [
          { k: "enable_sticky_info", v: true },
          { k: "gallery_layout",     v: "Thumbnails" },
          { k: "media_size",         v: "Large" },
          { k: "mobile_thumbnails",  v: "Hide" },
          { k: "hide_variants",      v: false },
          { k: "show_dynamic_checkout", v: true },
          { k: "enable_video_looping",  v: false },
          { k: "blocks_order",       v: '["text","title","price","variant_picker","quantity_selector","buy_buttons","description","collapsible_tab × 2"]' },
        ],
        note: "Sticky ATC on mobile is the buy-buttons block's enable_sticky setting. Each accordion row is a Collapsible row block — add as many as you need without code.",
      }}
    >
      <VP tag="Desktop · 1280px">
        <HeaderLogoLeft activeNav="Beverages" />
        <PDP />
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <HeaderLogoLeft activeNav="Beverages" mobile />
        <PDP mobile />
      </VP>
    </RefBlock>
  );
}

function Block10_CartDrawer() {
  return (
    <RefBlock
      id="cart_drawer"
      num="10"
      dawnSection="Cart drawer + Cart page"
      title="Cart"
      desc="Two surfaces, one cart. Drawer slides over the current page when a shopper clicks the bag icon; the full Cart page is reached at /cart. Dawn lets you serve either style by toggling cart_type at the theme-settings level."
      customizer={{
        section: "Theme settings → Cart  ·  /cart page",
        file: "sections/cart-drawer.liquid · sections/main-cart-items.liquid",
        settings: [
          { k: "cart_type",          v: '"Drawer"   ·  alt: "Page"' },
          { k: "show_vendor",        v: false },
          { k: "show_cart_note",     v: false },
          { k: "show_continue_shopping", v: true },
          { k: "color_scheme",       v: "Background 1" },
          { k: "cart_drawer_collection", v: "(none)" },
        ],
        note: "When cart_type=Drawer, the /cart page is still reachable as a fallback. We mock both so you can pick — most grocery stores stay on Drawer for fast multi-add flows.",
      }}
    >
      <VP tag="Desktop · cart drawer overlay">
        <div style={{ position: 'relative', height: 720, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <HeaderLogoLeft activeNav="Beverages" />
            <div className="ay-container" style={{ padding: '32px 48px' }}>
              <div className="ay-prod-grid cols-4">
                {window.SHOP.products.slice(0, 4).map((p, i) => <ProductCard key={i} p={p} />)}
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,46,41,0.4)' }}></div>
          <div style={{ position: 'absolute', top: 0, right: 0, height: '100%' }}>
            <CartDrawer />
          </div>
        </div>
      </VP>
      <VP tag="Mobile · cart drawer" mobile>
        <div style={{ height: 720, overflow: 'hidden' }}>
          <CartDrawer />
        </div>
      </VP>
      <div style={{ gridColumn: '1 / -1' }}>
        <VP tag="Desktop · /cart page">
          <HeaderLogoLeft activeNav="Beverages" />
          <CartPage />
        </VP>
      </div>
    </RefBlock>
  );
}

function Block11_CollectionPage() {
  return (
    <RefBlock
      id="collection_page"
      num="11"
      dawnSection="Main collection product grid"
      title="Collection page with filters & sort"
      desc="The /collections/{handle} template. Filter sidebar on the left (built from your storefront filters configuration in Shopify admin), sort dropdown top-right, pagination at the foot."
      customizer={{
        section: "Collections → Default collection",
        file: "sections/main-collection-product-grid.liquid",
        settings: [
          { k: "products_per_page",  v: 24 },
          { k: "columns_desktop",    v: 3 },
          { k: "image_ratio",        v: "Square" },
          { k: "show_secondary_image", v: true },
          { k: "show_vendor",        v: false },
          { k: "show_rating",        v: false },
          { k: "enable_quick_add",   v: true },
          { k: "enable_filtering",   v: true },
          { k: "filter_type",        v: "Vertical (sidebar)" },
          { k: "enable_sorting",     v: true },
          { k: "pagination_type",    v: "Paginated" },
        ],
        note: "Filters come from Shopify admin → Online Store → Navigation → Filters. Add Availability, Price, Brand (vendor or metafield), Size (option) to populate the sidebar exactly as shown.",
      }}
    >
      <VP tag="Desktop · 1280px">
        <HeaderLogoLeft activeNav="Beverages" />
        <CollectionPage />
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <HeaderLogoLeft activeNav="Beverages" mobile />
        <CollectionPage mobile />
      </VP>
    </RefBlock>
  );
}

function Block12_Search() {
  return (
    <RefBlock
      id="search_results"
      num="12"
      dawnSection="Predictive search + Search results"
      title="Search"
      desc="Two surfaces: the dropdown that appears as a shopper types in the header (suggestions + product matches + collections), and the /search results page itself."
      customizer={{
        section: "Theme settings → Search behavior",
        file: "sections/predictive-search.liquid · sections/main-search.liquid",
        settings: [
          { k: "enable_predictive_search", v: true },
          { k: "predictive_search_show_vendor", v: false },
          { k: "predictive_search_show_price",  v: true },
          { k: "min_chars_before_suggest",      v: 2 },
          { k: "search_results_columns_desktop", v: 4 },
          { k: "show_product_count",            v: true },
          { k: "show_collection_results",       v: true },
          { k: "show_page_results",             v: true },
        ],
        note: "Predictive search is a free Dawn feature — no app required. It indexes product title, vendor, type and tags. Tune which sections appear via the booleans above.",
      }}
    >
      <VP tag="Desktop · predictive dropdown">
        <HeaderLogoLeft activeNav="Home" />
        <PredictiveSearch />
      </VP>
      <VP tag="Mobile · predictive dropdown" mobile>
        <HeaderLogoLeft activeNav="Home" mobile />
        <PredictiveSearch />
      </VP>
      <div style={{ gridColumn: '1 / -1' }}>
        <VP tag="Desktop · /search results">
          <HeaderLogoLeft activeNav="Home" />
          <SearchResultsPage />
        </VP>
      </div>
    </RefBlock>
  );
}

function Block13_Footer() {
  return (
    <RefBlock
      id="footer"
      num="13"
      dawnSection="Footer"
      title="Footer"
      desc="Sitemap-style footer: brand column with newsletter, three menu columns sourced from your linked footer menus, and a bottom bar with payment icons. Every grocery store needs the FAQ / Shipping / Returns columns surfaced here."
      customizer={{
        section: "Footer → Footer",
        file: "sections/footer.liquid",
        settings: [
          { k: "color_scheme",         v: "Inverse (forest)" },
          { k: "newsletter_enable",    v: true },
          { k: "newsletter_heading",   v: '"Get our weekly specials"' },
          { k: "show_social",          v: true },
          { k: "show_country_selector", v: false },
          { k: "show_language_selector", v: false },
          { k: "show_payment_icons",   v: true },
          { k: "menu_block × 3",       v: '["Shop", "Help", "Company"]' },
          { k: "padding_top",          v: 56 },
          { k: "padding_bottom",       v: 28 },
        ],
        note: "Newsletter posts to your Shopify customer list out of the box. Add up to four Menu blocks — each one points at a Shopify navigation menu you build in admin.",
      }}
    >
      <VP tag="Desktop · 1280px">
        <Footer />
      </VP>
      <VP tag="Mobile · 375px" mobile>
        <Footer mobile />
      </VP>
    </RefBlock>
  );
}

Object.assign(window, {
  RefBlock, VP, Customizer,
  Block1_Announcement, Block2_Header, Block3_Hero, Block4_MultiColumn,
  Block5_FeaturedCollection, Block6_CollectionList, Block7_RichText,
  Block8_ProductCard, Block9_PDP, Block10_CartDrawer, Block11_CollectionPage,
  Block12_Search, Block13_Footer,
});
