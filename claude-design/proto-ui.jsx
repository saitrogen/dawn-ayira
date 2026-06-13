// ────────────────────────────────────────────────────────────
// Interactive UI primitives — they read the store context
// ────────────────────────────────────────────────────────────
const PI = ({ name, size = 20, stroke = 1.75 }) => (
  <i data-lucide={name} style={{ width: size, height: size, strokeWidth: stroke, display: 'inline-flex' }}></i>
);
const pfmt = (n) => window.fmtPrice(n);

// ────────────── Announcement bar ──────────────
function PAnn() {
  const messages = [
    "Free delivery in Al Khor on orders over QAR 50",
    "Same-day delivery, 7 days a week — order before 4pm",
    "Save 15% on your first order with code AYIRA15",
  ];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % messages.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="ay-ann">
      <span className="ay-ann-arrow" onClick={() => setI(n => (n - 1 + messages.length) % messages.length)}><PI name="chevron-left" size={14} /></span>
      <span key={i} style={{ animation: 'ay-page-in .25s var(--ease-out)' }}>{messages[i]}</span>
      <span className="ay-ann-arrow" onClick={() => setI(n => (n + 1) % messages.length)}><PI name="chevron-right" size={14} /></span>
    </div>
  );
}

// ────────────── Header ──────────────
function PHeader() {
  const s = window.useStore();
  const mobile = s.viewport === 'mobile';
  const [openNav, setOpenNav] = React.useState(null);

  if (mobile) {
    return (
      <header className="ay-header sticky">
        <div className="ay-container">
          <div className="ay-header-row">
            <button className="ay-icon-btn" onClick={() => s.setMobMenuOpen(true)} aria-label="Menu"><PI name="menu" /></button>
            <button className="ay-icon-btn" onClick={() => s.setSearchOpen(o => !o)} aria-label="Search"><PI name="search" /></button>
            <a className="ay-brand" onClick={() => s.navigate('home')}><img src="assets/logo-wordmark-forest.png" alt="Ayira Mini Mart" /></a>
            <span></span>
            <button className="ay-icon-btn" onClick={() => s.setCartOpen(true)} aria-label="Cart">
              <PI name="shopping-bag" />
              {s.itemCount > 0 && <span className="bub">{s.itemCount}</span>}
            </button>
          </div>
        </div>
        {s.searchOpen && <PSearchOverlay />}
      </header>
    );
  }

  return (
    <header className="ay-header sticky">
      <div className="ay-container">
        <div className="ay-header-row">
          <a className="ay-brand" onClick={() => s.navigate('home')}><img src="assets/logo-wordmark-forest.png" alt="Ayira Mini Mart" /></a>
          <nav className="ay-nav">
            {s.SHOP.mainMenu.map((m, i) => (
              <span key={i} className={`ay-nav-item ${s.page.name === 'home' && m.title === 'Home' ? 'active' : ''}${openNav === i ? ' open' : ''}`}
                    onMouseEnter={() => m.children && setOpenNav(i)}
                    onMouseLeave={() => setOpenNav(null)}
                    onClick={() => {
                      if (m.title === 'Home') s.navigate('home');
                      else if (m.title === 'Contact Us') s.navigate('page', { handle: 'contact-us', title: 'Contact us' });
                      else if (!m.children) s.navigate('collection', { handle: m.title.toLowerCase() });
                    }}>
                {m.title}
                {m.children && <PI name="chevron-down" size={14} />}
                {m.children && (
                  <div className="ay-nav-flyout">
                    {m.children.map((c, j) => (
                      <a key={j} onClick={e => { e.stopPropagation(); s.navigate('collection', { handle: c.url.split('/').pop() }); }}>{c.title}</a>
                    ))}
                  </div>
                )}
              </span>
            ))}
          </nav>
          <div className="ay-icons">
            <div className="ay-search" style={{ width: 240, marginRight: 4 }}>
              <span className="search-ic"><PI name="search" size={18} /></span>
              <input
                placeholder="Search the store…"
                onFocus={() => s.setSearchOpen(true)}
                onKeyDown={e => { if (e.key === 'Enter') s.navigate('search', { q: e.target.value || 'cola' }); }}
              />
            </div>
            <button className="ay-icon-btn" aria-label="Account" onClick={() => s.navigate('page', { handle: 'account', title: 'Your account' })}><PI name="user" /></button>
            <button className="ay-icon-btn" aria-label="Wishlist"><PI name="heart" /></button>
            <button className="ay-icon-btn" aria-label="Cart" onClick={() => s.setCartOpen(true)}>
              <PI name="shopping-bag" />
              {s.itemCount > 0 && <span className="bub">{s.itemCount}</span>}
            </button>
          </div>
        </div>
      </div>
      {s.searchOpen && <PSearchOverlay />}
    </header>
  );
}

// ────────────── Mobile menu drawer ──────────────
function PMobMenu() {
  const s = window.useStore();
  if (!s.mobMenuOpen) return null;
  return (
    <div className={`ay-mob-menu ${s.mobMenuOpen ? 'open' : ''}`}>
      <div className="ay-mob-menu-head">
        <img src="assets/logo-wordmark-forest.png" alt="Ayira Mini Mart" />
        <button className="ay-icon-btn" onClick={() => s.setMobMenuOpen(false)}><PI name="x" /></button>
      </div>
      <div className="ay-mob-menu-body">
        <a onClick={() => s.navigate('home')}>Home</a>
        {s.SHOP.mainMenu.filter(m => m.title !== 'Home' && m.title !== 'Contact Us').map((m, i) => (
          <div key={i}>
            <div className="grp-label">{m.title}</div>
            <div className="sub">
              {m.children.map((c, j) => (
                <a key={j} onClick={() => s.navigate('collection', { handle: c.url.split('/').pop() })}>{c.title}</a>
              ))}
            </div>
          </div>
        ))}
        <a onClick={() => s.navigate('page', { handle: 'contact-us', title: 'Contact us' })}>Contact us</a>
      </div>
    </div>
  );
}

// ────────────── Predictive search overlay ──────────────
function PSearchOverlay() {
  const s = window.useStore();
  const [q, setQ] = React.useState("");
  const matches = q.trim().length >= 2
    ? s.SHOP.products.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.type.toLowerCase().includes(q.toLowerCase())).slice(0, 4)
    : s.SHOP.products.slice(0, 4);
  const collMatches = q.trim().length >= 2
    ? s.SHOP.collections.filter(c => c.title.toLowerCase().includes(q.toLowerCase())).slice(0, 3)
    : s.SHOP.collections.filter(c => c.featured).slice(0, 3);
  return (
    <div className="ay-search-overlay" onClick={e => e.stopPropagation()}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '16px 32px 0' }}>
        <div className="ay-search">
          <span className="search-ic"><PI name="search" size={18} /></span>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search products, collections…"
            onKeyDown={e => { if (e.key === 'Enter') s.navigate('search', { q: q || 'cola' }); }}
          />
        </div>
      </div>
      <div className="ay-pred">
        {q.length < 2 && (
          <div className="ay-pred-section">
            <div className="ay-pred-head">Popular searches</div>
            {['pepsi 1.25L', 'cola', 'ice cream', 'kdd mango'].map(t => (
              <div key={t} className="ay-pred-row" onClick={() => s.navigate('search', { q: t })}>
                <div className="term"><span className="ic"><PI name="trending-up" size={14} /></span> {t}</div>
              </div>
            ))}
          </div>
        )}
        <div className="ay-pred-section">
          <div className="ay-pred-head">Products{matches.length > 0 ? ` · ${matches.length}` : ''}</div>
          {matches.length === 0 && <div style={{ padding: 12, fontSize: 13, color: 'var(--color-ink-500)' }}>No products match "{q}"</div>}
          {matches.map((p, i) => (
            <div key={i} className="ay-pred-row" onClick={() => s.navigate('product', { handle: p.handle })}>
              <div className="pimg"><img src={p.image} alt={p.title} /></div>
              <div><div className="nm">{p.title}</div><div className="sub">{p.type} · {p.options.Size[0]}</div></div>
              <div className="pr">{pfmt(p.price)}</div>
            </div>
          ))}
        </div>
        {collMatches.length > 0 && (
          <div className="ay-pred-section">
            <div className="ay-pred-head">Collections</div>
            {collMatches.map((c, i) => (
              <div key={i} className="ay-pred-row" style={{ gridTemplateColumns: 'auto 1fr' }} onClick={() => s.navigate('collection', { handle: c.handle })}>
                <div className="pimg" style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}><PI name="package" size={18} /></div>
                <div><div className="nm">{c.title}</div><div className="sub">{c.product_count} products</div></div>
              </div>
            ))}
          </div>
        )}
        <div style={{ padding: '12px 8px', textAlign: 'center' }}>
          <button className="ay-btn ay-btn-ghost ay-btn-sm" onClick={() => s.navigate('search', { q: q || 'cola' })}>
            View all results <PI name="arrow-right" size={14} />
          </button>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 12, right: 16 }}>
        <button className="ay-icon-btn" onClick={() => s.setSearchOpen(false)}><PI name="x" /></button>
      </div>
    </div>
  );
}

// ────────────── Interactive product card ──────────────
function PProductCard({ p, density = 'normal' }) {
  const s = window.useStore();
  const [adding, setAdding] = React.useState(false);
  const onSale = p.compareAt && p.compareAt > p.price;
  const isSoldOut = !p.available;
  const isNew = p.badges?.includes("new");
  const sizes = p.options?.Size || [];

  function handleAdd(e) {
    e.stopPropagation();
    if (isSoldOut) return;
    setAdding(true);
    s.addToCart(p, 1);
    setTimeout(() => setAdding(false), 800);
  }

  return (
    <div className="ay-prod" onClick={() => s.navigate('product', { handle: p.handle })}>
      <div className={`ay-prod-img ${isSoldOut ? 'unavail' : ''}`}>
        <img src={p.image} alt={p.title} loading="lazy" />
        <div className="ay-prod-badges">
          {onSale && <span className="ay-badge sale">Save {Math.round((1 - p.price/p.compareAt) * 100)}%</span>}
          {isNew && <span className="ay-badge new">New</span>}
          {isSoldOut && <span className="ay-badge sold-out">Sold out</span>}
        </div>
        <button className="ay-prod-fav" onClick={e => e.stopPropagation()} aria-label="Add to wishlist"><PI name="heart" size={16} /></button>
      </div>
      <div>
        <div className="ay-prod-meta">{p.type}</div>
        <div className="ay-prod-title">{p.title}</div>
      </div>
      {sizes.length > 0 && (
        <div className="ay-prod-swatches">
          {sizes.slice(0,3).map((sz, i) => (
            <span key={i} className={`ay-swatch ${i === 0 ? 'active' : ''}`} onClick={e => e.stopPropagation()}>{sz}</span>
          ))}
          {sizes.length > 3 && <span className="ay-swatch">+{sizes.length - 3}</span>}
        </div>
      )}
      <div className="ay-prod-foot">
        <div className="ay-prod-price">
          {pfmt(p.price)}{onSale && <span className="old">{pfmt(p.compareAt)}</span>}
        </div>
        <button
          className={`ay-prod-add ${adding ? 'added' : ''} ${isSoldOut ? 'disabled' : ''}`}
          onClick={handleAdd}
          aria-label={isSoldOut ? 'Sold out' : 'Add to cart'}
          disabled={isSoldOut}
        >
          <PI name={adding ? 'check' : 'plus'} size={16} />
        </button>
      </div>
    </div>
  );
}

// ────────────── Cart drawer ──────────────
function PCartDrawer() {
  const s = window.useStore();
  const mobile = s.viewport === 'mobile';
  const remaining = Math.max(0, s.threshold - s.subtotal);
  const pct = Math.min(100, (s.subtotal / s.threshold) * 100);

  return (
    <React.Fragment>
      <div className={`proto-overlay ${s.cartOpen ? 'open' : ''}`} onClick={() => s.setCartOpen(false)}></div>
      <aside className={`proto-drawer ${s.cartOpen ? 'open' : ''}`}>
        <div className="ay-cart-head">
          <h3>Your cart {s.itemCount > 0 ? `· ${s.itemCount} item${s.itemCount === 1 ? '' : 's'}` : ''}</h3>
          <button className="ay-cart-close" onClick={() => s.setCartOpen(false)}><PI name="x" size={18} /></button>
        </div>
        {s.cart.length === 0 ? (
          <div className="ay-empty" style={{ flex: 1 }}>
            <span className="ic"><PI name="shopping-bag" size={28} /></span>
            <h3>Your cart is empty</h3>
            <p>Add some pantry essentials and we'll bring them over the same day.</p>
            <button className="ay-btn ay-btn-primary" onClick={() => { s.setCartOpen(false); s.navigate('home'); }}>Browse fresh picks</button>
          </div>
        ) : (
          <React.Fragment>
            <div className="ay-cart-body">
              <div className={`ay-ship-prog ${s.freeShipping ? 'unlocked' : ''}`}>
                <div className="ay-ship-prog-text">
                  <span className="ic"><PI name={s.freeShipping ? 'check-circle' : 'truck'} size={16} /></span>
                  {s.freeShipping ? (
                    <span>You unlocked <strong>free delivery</strong> across Al Khor.</span>
                  ) : (
                    <span>Add <strong>{pfmt(remaining)}</strong> more for free delivery</span>
                  )}
                </div>
                <div className="ay-ship-bar"><div className="fill" style={{ width: `${pct}%` }}></div></div>
              </div>
              {s.cart.map((l, i) => (
                <div key={i} className="ay-cart-line">
                  <div className="img" style={{ cursor: 'pointer' }} onClick={() => { s.setCartOpen(false); s.navigate('product', { handle: l.p.handle }); }}><img src={l.p.image} alt={l.p.title} /></div>
                  <div>
                    <div className="nm">{l.p.title}</div>
                    <div className="meta">Size: {l.size}</div>
                    <div className="ay-qty">
                      <button onClick={() => s.updateQty(i, -1)}><PI name="minus" size={12} /></button>
                      <span className="v">{l.qty}</span>
                      <button onClick={() => s.updateQty(i, 1)}><PI name="plus" size={12} /></button>
                    </div>
                  </div>
                  <div className="right">
                    <div className="price">{pfmt(l.p.price * l.qty)}</div>
                    <button className="rm" onClick={() => s.removeLine(i)} aria-label="Remove"><PI name="trash-2" size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="ay-cart-foot">
              <div className="ay-cart-row"><span className="x">Subtotal</span><span>{pfmt(s.subtotal)}</span></div>
              <div className="ay-cart-row"><span className="x">Delivery</span><span>{s.delivery === 0 ? <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Free</span> : pfmt(s.delivery)}</span></div>
              <div className="ay-cart-row total"><span>Total</span><span>{pfmt(s.total)}</span></div>
              <div className="taxnote">Taxes included where applicable.</div>
              <button className="ay-btn ay-btn-primary ay-btn-lg">Checkout · {pfmt(s.total)}</button>
              <button className="ay-btn ay-btn-ghost" onClick={() => { s.setCartOpen(false); s.navigate('cart'); }}>View full cart</button>
            </div>
          </React.Fragment>
        )}
      </aside>
    </React.Fragment>
  );
}

// ────────────── Toast ──────────────
function PToast() {
  const s = window.useStore();
  return (
    <div className={`ay-toast ${s.toast ? 'show' : ''}`}>
      <span className="ic"><PI name="check-circle" size={18} /></span>
      <span>{s.toast || ''}</span>
    </div>
  );
}

Object.assign(window, { PI, pfmt, PAnn, PHeader, PMobMenu, PSearchOverlay, PProductCard, PCartDrawer, PToast });
