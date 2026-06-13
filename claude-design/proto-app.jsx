// ────────────────────────────────────────────────────────────
// Root app — device frames, toolbar, page router
// ────────────────────────────────────────────────────────────

// ── Section isolation context ─────────────────────────────────
const IsolationCtx = React.createContext({ focusSection: null, setFocusSection: () => {} });

const HOME_SECTIONS = [
  { id: 'hero',                  label: 'Hero banner' },
  { id: 'collection_list',       label: 'Collection list' },
  { id: 'featured_collection',   label: 'Soft drinks' },
  { id: 'multi_column',          label: 'Value props' },
  { id: 'featured_collection_2', label: 'Ice cream' },
  { id: 'rich_text',             label: 'Store hours' },
  { id: 'footer',                label: 'Footer' },
];

// ── Toolbar ───────────────────────────────────────────────────
function Toolbar() {
  const s = window.useStore();
  const { focusSection, setFocusSection } = React.useContext(IsolationCtx);
  const cartCount = s.itemCount;
  const [showPicker, setShowPicker] = React.useState(false);
  const pickerRef = React.useRef(null);

  // Close picker on outside click
  React.useEffect(() => {
    if (!showPicker) return;
    function onDown(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [showPicker]);

  const activeLabel = focusSection
    ? (HOME_SECTIONS.find(x => x.id === focusSection)?.label || 'Section')
    : null;

  return (
    <div className="proto-tb">
      <div className="proto-tb-brand">
        <span className="dot"></span> Ayira × Dawn · Prototype
      </div>
      <div className="proto-tb-sep"></div>

      {/* Viewport toggle */}
      <div className="proto-tb-seg">
        <button className={s.viewport === 'desktop' ? 'active' : ''} onClick={() => s.setViewport('desktop')}>
          <PI name="monitor" size={14} /> Desktop
        </button>
        <button className={s.viewport === 'mobile' ? 'active' : ''} onClick={() => s.setViewport('mobile')}>
          <PI name="smartphone" size={14} /> Mobile
        </button>
      </div>
      <div className="proto-tb-sep"></div>

      {/* Page nav */}
      <button className="proto-tb-btn" onClick={() => s.navigate('home')}>
        <PI name="home" size={14} /> Home
      </button>
      <button className="proto-tb-btn" onClick={() => s.setCartOpen(true)}>
        <PI name="shopping-bag" size={14} /> Cart
        {cartCount > 0 && <span className="ct">{cartCount}</span>}
      </button>
      <button className="proto-tb-btn" onClick={() => { s.clearCart(); s.navigate('home'); }} title="Reset prototype">
        <PI name="refresh-cw" size={14} /> Reset
      </button>

      {/* Section isolation — home page only */}
      {s.page.name === 'home' && (
        <>
          <div className="proto-tb-sep"></div>
          <div ref={pickerRef} style={{ position: 'relative' }}>
            <button
              className="proto-tb-btn"
              style={activeLabel ? {
                background: 'rgba(255,255,255,.1)',
                color: '#F6F6EE',
                borderRadius: 10,
              } : {}}
              onClick={() => setShowPicker(o => !o)}
              title="Focus a single section for implementation reference"
            >
              <PI name={activeLabel ? 'maximize-2' : 'layout-template'} size={14} />
              {activeLabel || 'Focus section'}
              {activeLabel && (
                <span
                  style={{ marginLeft: 6, opacity: 0.5, fontSize: 17, lineHeight: 1, fontWeight: 300 }}
                  onClick={e => { e.stopPropagation(); setFocusSection(null); setShowPicker(false); }}
                  title="Exit focus mode"
                >×</span>
              )}
            </button>

            {showPicker && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                zIndex: 1100,
                background: 'rgba(10,17,13,0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,.09)',
                borderRadius: 12,
                padding: 5,
                minWidth: 178,
                boxShadow: '0 16px 48px rgba(0,0,0,.55)',
              }}>
                {/* Show all */}
                {focusSection && (
                  <>
                    <button
                      onClick={() => { setFocusSection(null); setShowPicker(false); }}
                      style={{
                        display: 'flex', width: '100%', alignItems: 'center', gap: 8,
                        padding: '7px 11px', borderRadius: 8,
                        fontSize: 12.5, fontFamily: 'inherit', background: 'none',
                        color: 'rgba(246,246,238,.5)',
                      }}
                    >
                      <PI name="layout-template" size={13} /> Show all sections
                    </button>
                    <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '3px 0' }}></div>
                  </>
                )}

                {/* Section list */}
                {HOME_SECTIONS.map(sec => {
                  const isActive = focusSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => { setFocusSection(sec.id); setShowPicker(false); }}
                      style={{
                        display: 'flex', width: '100%', alignItems: 'center', gap: 8,
                        padding: '7px 11px', borderRadius: 8,
                        fontSize: 12.5, fontFamily: 'inherit',
                        color: isActive ? '#F6F6EE' : 'rgba(246,246,238,.72)',
                        background: isActive ? 'rgba(255,255,255,.09)' : 'none',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      <span style={{ width: 14, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        {isActive && <PI name="check" size={13} />}
                      </span>
                      {sec.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Toolbar hint ──────────────────────────────────────────────
function ToolbarHint() {
  const s = window.useStore();
  const { focusSection } = React.useContext(IsolationCtx);
  const tips = {
    home:       'Click any product card or collection tile to navigate · click + to add to cart',
    collection: 'Click any product to view details · use sort to re-order',
    product:    'Pick a size, set quantity, then "Add to cart" — the drawer slides in',
    cart:       'Adjust quantities or remove items — the delivery bar updates in real time',
    search:     'Click any result to open the product · use the toolbar to reset',
    page:       'Static content page — use header nav or footer links to keep browsing',
  };
  const hint = focusSection
    ? `Viewing "${HOME_SECTIONS.find(x => x.id === focusSection)?.label}" in isolation · click × or press Esc to show all sections`
    : (tips[s.page.name] || '');
  return <div className="proto-tb-hint">{hint}</div>;
}

// ── Device frames ─────────────────────────────────────────────
function BrowserFrame({ urlPath, children }) {
  return (
    <div className="browser-frame">
      <div className="browser-chrome">
        <div className="dots"><span></span><span></span><span></span></div>
        <div className="btns">
          <button><PI name="chevron-left" size={14} /></button>
          <button><PI name="chevron-right" size={14} /></button>
          <button><PI name="refresh-cw" size={13} /></button>
        </div>
        <div className="url">
          <PI name="lock" size={12} />
          <span>ayira-mini-mart-3.myshopify.com</span>
          <span className="path">{urlPath}</span>
        </div>
        <div className="btns">
          <button><PI name="user" size={14} /></button>
          <button><PI name="more-vertical" size={14} /></button>
        </div>
      </div>
      <div className="browser-screen proto-scroll" style={{ minHeight: 760, maxHeight: 'calc(100vh - 160px)' }}>
        {children}
      </div>
    </div>
  );
}

function PhoneFrame({ children }) {
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  return (
    <div className="phone-frame">
      <div className="phone-screen">
        <div className="phone-notch"><div className="cam"></div></div>
        <div className="phone-statusbar">
          <span>{time}</span>
          <span className="signals">
            <span className="bars"><i></i><i></i><i></i><i></i></span>
            <PI name="wifi" size={14} />
            <span className="batt"><i></i></span>
          </span>
        </div>
        <div className="phone-scroll ay-mob">{children}</div>
      </div>
    </div>
  );
}

// ── Page router ───────────────────────────────────────────────
function PageBody() {
  const s = window.useStore();
  const map = {
    home:       <PHome />,
    collection: <PCollection />,
    product:    <PProduct />,
    cart:       <PCartPage />,
    search:     <PSearch />,
    page:       <PStaticPage />,
  };
  return map[s.page.name] || <PHome />;
}

function PathLabel() {
  const s = window.useStore();
  const labels = {
    home:       '/',
    collection: `/collections/${s.page.params.handle || 'all'}`,
    product:    `/products/${s.page.params.handle || ''}`,
    cart:       '/cart',
    search:     `/search?q=${encodeURIComponent(s.page.params.q || '')}`,
    page:       `/pages/${s.page.params.handle || ''}`,
  };
  return labels[s.page.name] || '/';
}

// ── Root ──────────────────────────────────────────────────────
function App() {
  const [focusSection, setFocusSection] = React.useState(null);
  return (
    <window.StoreProvider>
      <IsolationCtx.Provider value={{ focusSection, setFocusSection }}>
        <AppShell />
      </IsolationCtx.Provider>
    </window.StoreProvider>
  );
}

function AppShell() {
  const s = window.useStore();
  const { focusSection, setFocusSection } = React.useContext(IsolationCtx);
  const url = PathLabel();
  const mobile = s.viewport === 'mobile';

  // Exit isolation when navigating away from home
  React.useEffect(() => {
    if (s.page.name !== 'home') setFocusSection(null);
  }, [s.page.name]);

  // Apply / remove section isolation via DOM
  React.useEffect(() => {
    // Scroll container differs by viewport
    const scrollEl = document.querySelector('.proto-scroll') || document.querySelector('.phone-scroll');
    if (!scrollEl) return;
    const secs = scrollEl.querySelectorAll('[data-proto-section]');
    secs.forEach(el => {
      el.style.display = (!focusSection || el.dataset.protoSection === focusSection) ? '' : 'none';
    });
    // Jump to top of the isolated section
    if (focusSection) scrollEl.scrollTop = 0;
  }, [focusSection, s.page.name, s.viewport]);

  // Keyboard shortcuts
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        s.setCartOpen(false);
        s.setSearchOpen(false);
        s.setMobMenuOpen(false);
        if (focusSection) setFocusSection(null);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusSection]);

  const inner = (
    <React.Fragment>
      <PAnn />
      <PHeader />
      <PageBody />
      <PCartDrawer />
      <PMobMenu />
      <PToast />
    </React.Fragment>
  );

  return (
    <div className="proto-page">
      <Toolbar />
      <div className="proto-frame-wrap">
        {mobile
          ? <PhoneFrame>{inner}</PhoneFrame>
          : <BrowserFrame urlPath={url}>{inner}</BrowserFrame>}
      </div>
      <ToolbarHint />
    </div>
  );
}

const protoRoot = ReactDOM.createRoot(document.getElementById('root'));
protoRoot.render(<App />);

// Lucide icon hydration — run a few passes after each commit, then debounce
function hydrateIcons() { if (window.lucide) window.lucide.createIcons(); }
[60, 240, 700, 1500].forEach(t => setTimeout(hydrateIcons, t));
let __iconT;
const __obs = new MutationObserver(() => {
  if (!document.querySelector('i[data-lucide]')) return;
  clearTimeout(__iconT);
  __iconT = setTimeout(hydrateIcons, 60);
});
__obs.observe(document.getElementById('root'), { childList: true, subtree: true });
