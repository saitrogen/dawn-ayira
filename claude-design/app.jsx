// App entry — TOC, ref blocks, Tweaks panel
const { useState, useEffect, createContext, useContext } = React;

// ── Tweaks context ───────────────────────────────────────────
const TweaksCtx = createContext({});

// Each palette key = hero color (the first hex). TweakColor stores the whole array.
const BRAND_MAP = {
  '#0D4F47': { primary: '#0D4F47', hover: '#093E37', deep: '#062E29', soft: '#EBF1EF', soft2: '#D7E4E1', on: '#FBFBF6' }, // forest
  '#1F2937': { primary: '#1F2937', hover: '#111827', deep: '#030712', soft: '#F1F2F5', soft2: '#D6D9E0', on: '#FBFBF6' }, // midnight
  '#9F3815': { primary: '#9F3815', hover: '#7A2A10', deep: '#52190A', soft: '#FBEDE6', soft2: '#F2CFBE', on: '#FBFBF6' }, // rust
  '#0E3B2E': { primary: '#0E3B2E', hover: '#082A20', deep: '#041C14', soft: '#E8F0EC', soft2: '#CADBD2', on: '#FBFBF6' }, // dark green
};
const ACCENT_MAP = {
  '#D4A737': { accent: '#D4A737', hover: '#BC9226', soft: '#FBF5E2', on: '#062E29' }, // mustard
  '#E66A6A': { accent: '#E66A6A', hover: '#D04D4D', soft: '#FBEDED', on: '#3B0F0F' }, // rose
  '#A8D24A': { accent: '#A8D24A', hover: '#8FB73A', soft: '#F4F8E6', on: '#1A2B0A' }, // citrus
  '#F08A5D': { accent: '#F08A5D', hover: '#D67248', soft: '#FCEDE5', on: '#3B1A0A' }, // coral
};

const BRAND_OPTIONS = [
  ['#0D4F47', '#062E29', '#D4A737'],
  ['#1F2937', '#030712', '#94A3B8'],
  ['#9F3815', '#52190A', '#F08A5D'],
  ['#0E3B2E', '#041C14', '#A8D24A'],
];
const ACCENT_OPTIONS = [
  ['#D4A737', '#BC9226', '#FBF5E2'],
  ['#E66A6A', '#D04D4D', '#FBEDED'],
  ['#A8D24A', '#8FB73A', '#F4F8E6'],
  ['#F08A5D', '#D67248', '#FCEDE5'],
];

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "brandColor": ["#0D4F47", "#062E29", "#D4A737"],
  "accentColor": ["#D4A737", "#BC9226", "#FBF5E2"],
  "cardDensity": 4,
  "showBadges": true,
  "showSwatches": true,
  "showQuickAdd": true
}/*EDITMODE-END*/;

function applyBrand(brandArr, accentArr) {
  const r = document.documentElement.style;
  const p = BRAND_MAP[brandArr?.[0]] || BRAND_MAP['#0D4F47'];
  const a = ACCENT_MAP[accentArr?.[0]] || ACCENT_MAP['#D4A737'];
  r.setProperty('--t-primary', p.primary);
  r.setProperty('--t-primary-hover', p.hover);
  r.setProperty('--t-primary-deep', p.deep);
  r.setProperty('--t-primary-soft', p.soft);
  r.setProperty('--t-primary-soft-2', p.soft2);
  r.setProperty('--t-on-primary', p.on);
  r.setProperty('--t-accent', a.accent);
  r.setProperty('--t-accent-hover', a.hover);
  r.setProperty('--t-accent-soft', a.soft);
  r.setProperty('--t-on-accent', a.on);
}

// ── App ───────────────────────────────────────────────────────
function App() {
  const [tweaks, setTweak] = window.useTweaks(DEFAULT_TWEAKS);
  useEffect(() => applyBrand(tweaks.brandColor, tweaks.accentColor), [tweaks.brandColor, tweaks.accentColor]);

  const toc = [
    ["01", "Announcement bar", "announcement_bar"],
    ["02", "Header", "header"],
    ["03", "Image banner (Hero)", "hero"],
    ["04", "Multicolumn", "multi_column"],
    ["05", "Featured collection", "featured_collection"],
    ["06", "Collection list", "collection_list"],
    ["07", "Rich text", "rich_text"],
    ["08", "Product card", "product_card"],
    ["09", "Product page (PDP)", "pdp"],
    ["10", "Cart drawer + page", "cart_drawer"],
    ["11", "Collection page", "collection_page"],
    ["12", "Search results", "search_results"],
    ["13", "Footer", "footer"],
  ];

  return (
    <TweaksCtx.Provider value={{ tweaks, setTweak }}>
      <div className="doc-page">
        <div className="doc-wrap">
          {/* Masthead */}
          <header className="doc-masthead">
            <div>
              <div className="crumb"><span className="dot"></span> UI Reference Library · v1.0</div>
              <h1>Ayira Mini Mart × Dawn</h1>
              <p className="lede">Every Dawn section your storefront uses, mocked at desktop and mobile, annotated with the exact theme-customizer settings that produce it. Strict no-code build — every visual variance is replicable from default Dawn settings.</p>
            </div>
            <div className="meta">
              <div className="meta-row"><span className="k">Theme</span><span className="v pill">Dawn 15.4.1</span></div>
              <div className="meta-row"><span className="k">Store</span><span className="v">ayira-mini-mart-3.myshopify.com</span></div>
              <div className="meta-row"><span className="k">Currency</span><span className="v">QAR (Qatari Riyal)</span></div>
              <div className="meta-row"><span className="k">Location</span><span className="v">Al Khor, Qatar</span></div>
              <div className="meta-row"><span className="k">Sections</span><span className="v">13</span></div>
              <div className="meta-row"><span className="k">Viewports</span><span className="v">1280 · 375</span></div>
            </div>
          </header>

          {/* TOC */}
          <nav className="doc-toc">
            <div className="doc-toc-head"><span style={{ width: 6, height: 6, background: 'var(--t-accent)', borderRadius: '50%' }}></span> Contents</div>
            {toc.map(([n, t, id]) => (
              <a key={id} href={`#${id}`}><span className="n">{n}</span><span className="t">{t}</span></a>
            ))}
          </nav>

          {/* Blocks */}
          <Block1_Announcement />
          <Block2_Header />
          <Block3_Hero />
          <Block4_MultiColumn />
          <Block5_FeaturedCollection />
          <Block6_CollectionList />
          <Block7_RichText />
          <Block8_ProductCardWithTweaks />
          <Block9_PDP />
          <Block10_CartDrawer />
          <Block11_CollectionPage />
          <Block12_Search />
          <Block13_Footer />
        </div>

        {/* Tweaks panel */}
        <window.TweaksPanel title="Ayira × Dawn Tweaks">
          <window.TweakSection title="Brand">
            <window.TweakColor
              label="Primary color"
              value={tweaks.brandColor}
              options={BRAND_OPTIONS}
              onChange={v => setTweak('brandColor', v)}
            />
            <window.TweakColor
              label="Accent color"
              value={tweaks.accentColor}
              options={ACCENT_OPTIONS}
              onChange={v => setTweak('accentColor', v)}
            />
          </window.TweakSection>
          <window.TweakSection title="Product card · global">
            <window.TweakRadio
              label="Density (desktop)"
              value={String(tweaks.cardDensity)}
              onChange={v => setTweak('cardDensity', parseInt(v))}
              options={[
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
              ]}
            />
            <window.TweakToggle label="Show badges (Sale / Sold-out / New)" value={tweaks.showBadges} onChange={v => setTweak('showBadges', v)} />
            <window.TweakToggle label="Show variant swatches" value={tweaks.showSwatches} onChange={v => setTweak('showSwatches', v)} />
            <window.TweakToggle label="Show quick-add" value={tweaks.showQuickAdd} onChange={v => setTweak('showQuickAdd', v)} />
          </window.TweakSection>
        </window.TweaksPanel>
      </div>
    </TweaksCtx.Provider>
  );
}

// Block 8 wrapper — reads tweaks so the product-card grid responds to the panel
function Block8_ProductCardWithTweaks() {
  const { tweaks } = useContext(TweaksCtx);
  return <Block8_ProductCardTweaked tweaks={tweaks} />;
}

function Block8_ProductCardTweaked({ tweaks }) {
  const [v, setV] = React.useState("default");
  const S = window.SHOP;
  const cfgByVariant = {
    "default":     { showBadges: tweaks.showBadges, showQuickAdd: tweaks.showQuickAdd, showSwatches: tweaks.showSwatches, quickAddStyle: "icon" },
    "outline-qa":  { showBadges: tweaks.showBadges, showQuickAdd: tweaks.showQuickAdd, showSwatches: tweaks.showSwatches, quickAddStyle: "outline" },
    "bar-qa":      { showBadges: tweaks.showBadges, showQuickAdd: tweaks.showQuickAdd, showSwatches: tweaks.showSwatches, quickAddStyle: "bar" },
    "minimal":     { showBadges: false, showQuickAdd: false, showSwatches: false, quickAddStyle: "icon" },
  };
  const cfg = cfgByVariant[v];
  const lineup = [
    S.products.find(p => p.handle === "coca-cola-original-taste"),
    S.products.find(p => p.handle === "pepsi"),
    S.products.find(p => p.handle === "7up"),
    S.products.find(p => p.handle === "galaxy-vanilla-ice-cream"),
    S.products.find(p => p.handle === "snickers-chocolate-bar"),
  ];
  return (
    <RefBlock
      id="product_card"
      num="08"
      dawnSection="Product card / Product grid item"
      title="Product card"
      desc="The PLP tile used everywhere a collection appears. Dawn's snippet exposes badges (Sale / Sold out / New tag), variant pills, and the quick-add affordance as customizer-driven toggles. Use the Tweaks panel (bottom right) to flip these globally."
      customizer={{
        section: "Theme settings → Product cards",
        file: "snippets/card-product.liquid",
        settings: [
          { k: "image_padding",        v: "0px" },
          { k: "image_ratio",          v: "Square (1:1)" },
          { k: "show_secondary_image", v: true },
          { k: "show_vendor",          v: false },
          { k: "show_rating",          v: false },
          { k: "show_quick_add",       v: cfg.showQuickAdd },
          { k: "quick_add_style",      v: v === "bar-qa" ? "Standard (bar)" : v === "outline-qa" ? "Bordered (outline)" : "Icon" },
          { k: "show_badges",          v: cfg.showBadges },
          { k: "sold_out_badge_text",  v: '"Sold out"' },
          { k: "sale_badge_text",      v: '"Save {percent}%"' },
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
      <VP tag={`Desktop · ${tweaks.cardDensity}-up grid`}>
        <div className="ay-container" style={{ padding: '32px 48px' }}>
          <div className={`ay-prod-grid cols-${tweaks.cardDensity}`}>
            {lineup.slice(0, tweaks.cardDensity).map((p, i) => <ProductCard key={i} p={p} {...cfg} />)}
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Re-hydrate Lucide icons after each React commit. Run a few staggered
// passes after mount to catch lazy renders, then stop — no observer needed.
function hydrateIcons() { if (window.lucide) window.lucide.createIcons(); }
[50, 200, 600, 1500].forEach(t => setTimeout(hydrateIcons, t));
// Also rehydrate any time React re-renders (Tweaks change). Cheap: short
// debounce so a flurry of state changes collapses to one createIcons pass.
let __iconT;
const __obs = new MutationObserver(() => {
  if (!document.querySelector('i[data-lucide]')) return;
  clearTimeout(__iconT);
  __iconT = setTimeout(hydrateIcons, 60);
});
__obs.observe(document.getElementById('root'), { childList: true, subtree: true });
