// Ayira storefront atomic + composed components (used inside .vp-body)
// All components are namespaced under window.AY.* to share between scripts.

const I = ({ name, size = 20, stroke = 1.75 }) => (
  <i data-lucide={name} style={{ width: size, height: size, strokeWidth: stroke, display: 'inline-flex' }}></i>
);

const fmt = (n) => window.fmtPrice(n);

// ────────────────────────── ANNOUNCEMENT BAR ──────────────────────────
function AnnouncementBar({ variant = "single", text }) {
  const S = window.SHOP;
  if (variant === "rotating") {
    return (
      <div className="ay-ann">
        <span className="ay-ann-arrow"><I name="chevron-left" size={14} /></span>
        <span>{text || S.announcement}</span>
        <span className="ay-ann-arrow"><I name="chevron-right" size={14} /></span>
      </div>
    );
  }
  if (variant === "cta") {
    return (
      <div className="ay-ann">
        <span>{text || S.announcement_promo}</span>
        <a className="ay-ann-cta">Shop now →</a>
      </div>
    );
  }
  if (variant === "scrolling") {
    return (
      <div className="ay-ann scrolling">
        <div className="ay-ann-track">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:14 }}>
              <span>{S.announcement}</span>
              <span style={{ color:'var(--t-accent)' }}>★</span>
              <span>{S.announcement_alt}</span>
              <span style={{ color:'var(--t-accent)' }}>★</span>
            </span>
          ))}
        </div>
      </div>
    );
  }
  return <div className="ay-ann"><span>{text || S.announcement}</span></div>;
}

// ────────────────────────── HEADER ──────────────────────────
function HeaderLogoLeft({ activeNav = "Home", mobile = false }) {
  const S = window.SHOP;
  if (mobile) {
    return (
      <header className="ay-header sticky">
        <div className="ay-container">
          <div className="ay-header-row">
            <button className="ay-icon-btn"><I name="menu" /></button>
            <button className="ay-icon-btn"><I name="search" /></button>
            <a className="ay-brand"><img src="assets/logo-wordmark-forest.png" alt="Ayira Mini Mart" /></a>
            <span></span>
            <button className="ay-icon-btn"><I name="shopping-bag" /><span className="bub">3</span></button>
          </div>
        </div>
      </header>
    );
  }
  return (
    <header className="ay-header sticky">
      <div className="ay-container">
        <div className="ay-header-row">
          <a className="ay-brand"><img src="assets/logo-wordmark-forest.png" alt="Ayira Mini Mart" /></a>
          <nav className="ay-nav">
            {S.mainMenu.map((m, i) => (
              <a key={i} className={`ay-nav-item ${activeNav === m.title ? 'active' : ''}`}>
                {m.title}{m.children ? <I name="chevron-down" size={14} /> : null}
              </a>
            ))}
          </nav>
          <div className="ay-icons">
            <div className="ay-search" style={{ width: 220, marginRight: 4 }}>
              <I name="search" size={18} />
              <input placeholder="Search the store…" />
              <span className="search-ic"><I name="search" size={18} /></span>
            </div>
            <button className="ay-icon-btn" aria-label="Account"><I name="user" /></button>
            <button className="ay-icon-btn" aria-label="Wishlist"><I name="heart" /></button>
            <button className="ay-icon-btn" aria-label="Cart"><I name="shopping-bag" /><span className="bub">3</span></button>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderLogoCenter({ activeNav = "Home" }) {
  const S = window.SHOP;
  return (
    <header className="ay-header sticky ay-header-2row">
      <div className="ay-container">
        <div className="top-row">
          <div className="ay-search" style={{ width: 280 }}>
            <span className="search-ic"><I name="search" size={18} /></span>
            <input placeholder="Search the store…" />
          </div>
          <a className="ay-brand"><img src="assets/logo-wordmark-forest.png" alt="Ayira Mini Mart" /></a>
          <div className="ay-icons">
            <button className="ay-icon-btn"><I name="user" /></button>
            <button className="ay-icon-btn"><I name="heart" /></button>
            <button className="ay-icon-btn"><I name="shopping-bag" /><span className="bub">3</span></button>
          </div>
        </div>
        <nav className="nav-row">
          {S.mainMenu.map((m, i) => (
            <a key={i} className={`ay-nav-item ${activeNav === m.title ? 'active' : ''}`}>
              {m.title}{m.children ? <I name="chevron-down" size={14} /> : null}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

// ────────────────────────── HERO (IMAGE BANNER) ──────────────────────────
function Hero({ variant = "default" }) {
  // variant: "default" (left aligned) | "centered" | "second"
  const bg = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80";
  if (variant === "centered") {
    return (
      <section className="ay-hero">
        <div className="ay-container">
          <div className="ay-hero-frame" style={{ minHeight: 460, textAlign: 'center', justifyContent: 'center' }}>
            <div className="ay-hero-bg" style={{ backgroundImage: `url(${bg})` }}></div>
            <div className="ay-hero-inner" style={{ margin: '0 auto', textAlign: 'center', maxWidth: 620 }}>
              <span className="ay-eyebrow"><span className="pip"></span> Weekly specials</span>
              <h1>Fresh basics, delivered the same day.</h1>
              <p style={{ margin: '0 auto 28px' }}>Groceries, drinks and snacks from your Al Khor neighbourhood market — at your door in under two hours.</p>
              <div className="ay-hero-cta" style={{ justifyContent: 'center' }}>
                <a className="ay-btn ay-btn-accent ay-btn-lg">Shop weekly specials</a>
                <a className="ay-btn ay-btn-secondary ay-btn-lg" style={{ background: 'transparent', color: 'var(--t-on-primary)', borderColor: 'rgba(255,255,255,0.4)' }}>Browse all</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="ay-hero">
      <div className="ay-container">
        <div className="ay-hero-frame">
          <div className="ay-hero-bg" style={{ backgroundImage: `url(${bg})` }}></div>
          <div className="ay-hero-inner">
            <span className="ay-eyebrow"><span className="pip"></span> Same-day delivery</span>
            <h1>The everyday minimart, online.</h1>
            <p>Beverages, snacks and pantry essentials from Ayira Mini Mart in Al Khor — saved to your cart and on the way in under two hours.</p>
            <div className="ay-hero-cta">
              <a className="ay-btn ay-btn-accent ay-btn-lg">Shop weekly specials</a>
              <a className="ay-btn ay-btn-secondary ay-btn-lg" style={{ background: 'transparent', color: 'var(--t-on-primary)', borderColor: 'rgba(255,255,255,0.4)' }}>Browse all</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────── PRODUCT CARD (PLP TILE) ──────────────────────────
// Dawn-style: badge top-left, optional heart top-right, variant pills row,
// price + quick-add at the foot. All toggles driven by props.
function ProductCard({ p, showBadges = true, showQuickAdd = true, showSwatches = true, badgeLayout = "tl", quickAddStyle = "icon" }) {
  // badgeLayout: "tl" (top-left), "tr" (top-right), "below-image"
  // quickAddStyle: "icon" | "outline" | "bar"
  const onSale = p.compareAt && p.compareAt > p.price;
  const isSoldOut = !p.available;
  const isNew = p.badges?.includes("new");
  const sizes = p.options?.Size || [];
  const badges = (
    <div className="ay-prod-badges" style={badgeLayout === "tr" ? { left: 'auto', right: 10 } : null}>
      {onSale && <span className="ay-badge sale">Save {Math.round((1 - p.price/p.compareAt) * 100)}%</span>}
      {isNew && <span className="ay-badge new">New</span>}
      {isSoldOut && <span className="ay-badge sold-out">Sold out</span>}
    </div>
  );
  return (
    <div className="ay-prod">
      <div className={`ay-prod-img ${isSoldOut ? 'unavail' : ''}`}>
        <img src={p.image} alt={p.title} loading="lazy" />
        {showBadges && badgeLayout !== "below-image" && badges}
        <button className="ay-prod-fav" aria-label="Add to wishlist"><I name="heart" size={16} /></button>
      </div>
      {showBadges && badgeLayout === "below-image" && <div style={{ display:'flex', gap:6 }}>
        {onSale && <span className="ay-badge sale">Save {Math.round((1 - p.price/p.compareAt) * 100)}%</span>}
        {isNew && <span className="ay-badge new">New</span>}
        {isSoldOut && <span className="ay-badge sold-out">Sold out</span>}
      </div>}
      <div>
        <div className="ay-prod-meta">{p.type}</div>
        <div className="ay-prod-title">{p.title}</div>
      </div>
      {showSwatches && sizes.length > 0 && (
        <div className="ay-prod-swatches">
          {sizes.slice(0,3).map((s, i) => (
            <span key={i} className={`ay-swatch ${i === 0 ? 'active' : ''}`}>{s}</span>
          ))}
          {sizes.length > 3 && <span className="ay-swatch">+{sizes.length - 3}</span>}
        </div>
      )}
      {quickAddStyle === "bar" && showQuickAdd && (
        isSoldOut
          ? <button className="ay-prod-quickadd disabled" disabled>Sold out</button>
          : <button className="ay-prod-quickadd"><I name="plus" size={16} /> Quick add</button>
      )}
      <div className="ay-prod-foot">
        <div className={`ay-prod-price ${isSoldOut && quickAddStyle === 'bar' ? '' : ''}`}>
          {fmt(p.price)}{onSale && <span className="old">{fmt(p.compareAt)}</span>}
        </div>
        {quickAddStyle === "icon" && showQuickAdd && (
          isSoldOut
            ? <button className="ay-prod-add disabled" disabled><I name="plus" size={16} /></button>
            : <button className="ay-prod-add"><I name="plus" size={16} /></button>
        )}
        {quickAddStyle === "outline" && showQuickAdd && (
          isSoldOut
            ? <button className="ay-prod-quickadd disabled">Sold out</button>
            : <button className="ay-prod-quickadd outline">Add</button>
        )}
      </div>
    </div>
  );
}

// ────────────────────────── FEATURED COLLECTION ──────────────────────────
function FeaturedCollection({ title, eyebrow = "Weekly picks", products, cols = 4, viewAll = "View all", mobile = false }) {
  const grid = mobile ? 2 : cols;
  return (
    <section className="ay-section">
      <div className="ay-container">
        <div className="ay-section-head">
          <div>
            <div className="ay-section-eyebrow">{eyebrow}</div>
            <h2>{title}</h2>
          </div>
          <a className="viewall">{viewAll} <I name="arrow-right" size={16} /></a>
        </div>
        <div className={`ay-prod-grid cols-${grid}`}>
          {products.slice(0, mobile ? 4 : cols * 1).map((p, i) => (
            <ProductCard key={i} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────── COLLECTION LIST ──────────────────────────
function CollectionList({ mobile = false }) {
  const S = window.SHOP;
  const featured = S.collections.filter(c => c.featured).slice(0, mobile ? 4 : 5);
  return (
    <section className="ay-section">
      <div className="ay-container">
        <div className="ay-section-head">
          <div>
            <div className="ay-section-eyebrow">Shop by aisle</div>
            <h2>Browse our collections</h2>
          </div>
          <a className="viewall">All collections <I name="arrow-right" size={16} /></a>
        </div>
        <div className="ay-coll-grid" style={mobile ? null : { gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {featured.map((c, i) => (
            <a key={i} className="ay-coll">
              {c.image
                ? <div className="ay-coll-bg" style={{ backgroundImage: `url(${c.image})` }}></div>
                : <div className="ay-coll-bg placeholder"><span>{c.title[0]}</span></div>}
              <div className="ay-coll-text">
                <div>
                  <h3>{c.title}</h3>
                  <div className="count">{c.product_count} items</div>
                </div>
                <div className="arr"><I name="arrow-right" size={16} /></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────── MULTI-COLUMN ──────────────────────────
function MultiColumn({ mobile = false }) {
  const items = [
    { icon: "truck",      title: "Same-day delivery", text: "Order before 4pm. We deliver across Al Khor by evening." },
    { icon: "shield-check", title: "Quality assured",  text: "Hand-picked stock. Easy returns within 48 hours." },
    { icon: "credit-card",title: "Secure checkout",   text: "Apple Pay, Google Pay and all major cards accepted." },
    { icon: "phone",       title: "We're here",        text: "Call or WhatsApp our store any time during opening hours." },
  ];
  return (
    <section className="ay-section">
      <div className="ay-container">
        <div className="ay-cols">
          {items.map((it, i) => (
            <div key={i} className="ay-col">
              <span className="ic"><I name={it.icon} size={22} /></span>
              <h4>{it.title}</h4>
              <p>{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────────────────────── RICH TEXT ──────────────────────────
function RichText() {
  return (
    <section className="ay-section">
      <div className="ay-container">
        <div className="ay-richtext">
          <div className="ay-eyebrow">Store hours · Al Khor</div>
          <h2>Open seven days, just around the corner.</h2>
          <p>Stop in for fresh stock, or shop online and we'll bring it over. We open at 7am Saturday through Thursday, and 8am on Fridays — last delivery slot goes out at 10pm.</p>
          <a className="ay-btn ay-btn-secondary">Get directions</a>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────── FOOTER ──────────────────────────
function Footer({ mobile = false }) {
  const S = window.SHOP;
  return (
    <footer className="ay-footer">
      <div className="ay-container">
        <div className="ay-footer-inner">
          <div className="ay-footer-brand">
            <img src="assets/logo-wordmark-cream.png" alt="Ayira Mini Mart" />
            <p>Your neighbourhood minimart in Al Khor — beverages, snacks, frozen and everyday essentials.</p>
            <div className="socials">
              <a aria-label="Instagram"><I name="camera" size={16} /></a>
              <a aria-label="WhatsApp"><I name="message-circle" size={16} /></a>
              <a aria-label="Email"><I name="mail" size={16} /></a>
            </div>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              <li><a>Soft Drinks</a></li>
              <li><a>Juice</a></li>
              <li><a>Chocolates</a></li>
              <li><a>Ice Cream</a></li>
              <li><a>Noodles</a></li>
            </ul>
          </div>
          <div>
            <h5>Help</h5>
            <ul>
              <li><a>Contact us</a></li>
              <li><a>FAQ</a></li>
              <li><a>Shipping & delivery</a></li>
              <li><a>Returns & refunds</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a>About us</a></li>
              <li><a>Privacy policy</a></li>
              <li><a>Terms of service</a></li>
              <li><a>Search</a></li>
            </ul>
          </div>
          <div className="ay-footer-news">
            <h5>Get our weekly specials</h5>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>One short email every Saturday. Unsubscribe any time.</p>
            <input type="email" placeholder="you@example.com" />
            <button>Subscribe</button>
          </div>
        </div>
        <div className="ay-footer-bot">
          <div>© 2026 Ayira Mini Mart · Al Khor, Qatar</div>
          <div className="pay">
            <span className="chip">VISA</span>
            <span className="chip">MC</span>
            <span className="chip">AMEX</span>
            <span className="chip">APAY</span>
            <span className="chip">GPAY</span>
            <span className="chip">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ────────────────────────── PDP ──────────────────────────
function PDP({ mobile = false }) {
  const S = window.SHOP;
  const p = S.products.find(x => x.handle === "pepsi"); // on-sale demo product
  const thumbs = S.products.filter(x => x.collection === "soft-drinks").slice(0, 4);
  return (
    <main className="ay-container">
      <div className="ay-crumbs">
        <a>Home</a><span className="sep">/</span><a>Beverages</a><span className="sep">/</span><a>Soft Drinks</a><span className="sep">/</span><span className="cur">{p.title}</span>
      </div>
      <div className="ay-pdp" style={{ position: 'relative' }}>
        <div className="ay-pdp-gallery">
          <div className="ay-pdp-main">
            <div className="ay-badges">
              <span className="ay-badge sale">Save {Math.round((1 - p.price/p.compareAt) * 100)}%</span>
            </div>
            <img src={p.image} alt={p.title} />
          </div>
          {!mobile && (
            <div className="ay-pdp-thumbs">
              {thumbs.map((t, i) => (
                <div key={i} className={`ay-pdp-thumb ${i === 0 ? 'active' : ''}`}>
                  <img src={t.image} alt={t.title} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="ay-pdp-info">
          <div className="vendor">{p.vendor || 'Ayira Mini Mart'} · Soft Drinks</div>
          <h1>{p.title}</h1>
          <div className="ay-flex-c" style={{ gap: 8, fontSize: 13, color: 'var(--color-ink-500)' }}>
            <span style={{ color: 'var(--t-accent)' }}>★ ★ ★ ★ ★</span>
            <span>4.8 (124 reviews)</span>
          </div>
          <div className="ay-pdp-price-row">
            <div className="ay-pdp-price">
              {fmt(p.price)}{p.compareAt ? <span className="old">{fmt(p.compareAt)}</span> : null}
            </div>
            <div className="ay-pdp-stock"><span className="dot"></span>In stock · Ready to ship</div>
          </div>
          <p style={{ fontSize: 14.5, color: 'var(--color-ink-700)', lineHeight: 1.6 }}>
            The classic Pepsi cola. Refreshing, bold, ice-cold ready. Sold individually — pick your bottle size below.
          </p>
          <div className="ay-pdp-opt">
            <div className="label">Size <span className="v">· 1.25L</span></div>
            <div className="variants">
              {p.options.Size.map((s, i) => (
                <button key={i} className={`variant ${i === 0 ? 'active' : ''}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="ay-pdp-controls">
            <div className="ay-qty">
              <button><I name="minus" size={16} /></button>
              <span className="v">1</span>
              <button><I name="plus" size={16} /></button>
            </div>
            <button className="ay-btn ay-btn-primary ay-btn-lg"><I name="shopping-bag" size={18} /> Add to cart · {fmt(p.price)}</button>
          </div>
          <button className="ay-btn ay-btn-accent ay-btn-lg" style={{ width: '100%' }}>Buy it now</button>
          <div className="ay-pdp-meta">
            <div className="ay-pdp-meta-item">
              <span className="ic"><I name="truck" size={20} /></span>
              <div><div className="ttl">Same-day delivery</div><div className="sub">Order before 4pm in Al Khor</div></div>
            </div>
            <div className="ay-pdp-meta-item">
              <span className="ic"><I name="package-check" size={20} /></span>
              <div><div className="ttl">Easy returns</div><div className="sub">Within 48 hours of delivery</div></div>
            </div>
          </div>
          <div className="ay-pdp-accord">
            <details className="ay-pdp-accord-item" open>
              <summary>Description</summary>
              <p>Pepsi-Cola is a carbonated soft drink with the classic crisp, refreshing taste. Best served chilled. Stock up by the case for parties and gatherings.</p>
            </details>
            <details className="ay-pdp-accord-item">
              <summary>Ingredients</summary>
              <p>Carbonated water, high fructose corn syrup, caramel color, sugar, phosphoric acid, caffeine, citric acid and natural flavors.</p>
            </details>
            <details className="ay-pdp-accord-item">
              <summary>Shipping & returns</summary>
              <p>Same-day delivery in Al Khor for orders placed before 4pm. Returns accepted within 48 hours for sealed, undamaged items.</p>
            </details>
          </div>
        </div>
        {mobile && (
          <div className="ay-sticky-atc">
            <div className="price"><div className="p">{fmt(p.price)}</div><div className="u">1.25L · In stock</div></div>
            <button className="ay-btn ay-btn-primary">Add to cart</button>
          </div>
        )}
      </div>
    </main>
  );
}

// ────────────────────────── CART DRAWER ──────────────────────────
function CartDrawer() {
  const S = window.SHOP;
  const lines = [
    { p: S.products[3], qty: 2, size: "1.25L" }, // Pepsi
    { p: S.products[2], qty: 1, size: "350ml" }, // Coca-Cola
    { p: S.products[11], qty: 1, size: "59g" },  // Galaxy ice cream
  ];
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  return (
    <div className="ay-cart-drawer" style={{ width: '100%', height: 720 }}>
      <div className="ay-cart-head">
        <h3>Your cart · 3 items</h3>
        <button className="ay-cart-close"><I name="x" size={18} /></button>
      </div>
      <div className="ay-cart-body">
        {lines.map((l, i) => (
          <div key={i} className="ay-cart-line">
            <div className="img"><img src={l.p.image} alt={l.p.title} /></div>
            <div>
              <div className="nm">{l.p.title}</div>
              <div className="meta">Size: {l.size}</div>
              <div className="ay-qty">
                <button><I name="minus" size={12} /></button>
                <span className="v">{l.qty}</span>
                <button><I name="plus" size={12} /></button>
              </div>
            </div>
            <div className="right">
              <div className="price">{fmt(l.p.price * l.qty)}</div>
              <button className="rm"><I name="trash-2" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="ay-cart-foot">
        <div className="ay-cart-row"><span className="x">Subtotal</span><span>{fmt(subtotal)}</span></div>
        <div className="ay-cart-row"><span className="x">Delivery</span><span>{fmt(8)}</span></div>
        <div className="ay-cart-row total"><span>Total</span><span>{fmt(subtotal + 8)}</span></div>
        <div className="taxnote">Taxes included where applicable.</div>
        <button className="ay-btn ay-btn-primary ay-btn-lg">Checkout · {fmt(subtotal + 8)}</button>
        <button className="ay-btn ay-btn-ghost">Continue shopping</button>
      </div>
    </div>
  );
}

// ────────────────────────── CART PAGE ──────────────────────────
function CartPage({ mobile = false }) {
  const S = window.SHOP;
  const lines = [
    { p: S.products[3], qty: 2, size: "1.25L" },
    { p: S.products[2], qty: 1, size: "350ml" },
    { p: S.products[11], qty: 1, size: "59g" },
    { p: S.products[7], qty: 4, size: "180ml" },
  ];
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  return (
    <main className="ay-container">
      <div className="ay-cart-page">
        <div>
          <h1>Your cart</h1>
          {!mobile && (
            <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr 100px 100px 60px', gap: 16, padding: '0 14px 12px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-ink-500)', fontWeight: 600 }}>
              <div></div><div>Product</div><div>Price</div><div style={{ textAlign: 'right' }}>Total</div><div></div>
            </div>
          )}
          <div className="ay-cart-page-lines">
            {lines.map((l, i) => mobile ? (
              <div key={i} className="ay-cart-page-line">
                <div className="img"><img src={l.p.image} alt={l.p.title} /></div>
                <div>
                  <div className="nm">{l.p.title}</div>
                  <div className="meta">Size: {l.size}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, justifyContent: 'space-between' }}>
                    <div className="ay-qty"><button><I name="minus" size={14} /></button><span className="v">{l.qty}</span><button><I name="plus" size={14} /></button></div>
                    <div className="price">{fmt(l.p.price * l.qty)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="ay-cart-page-line">
                <div className="img"><img src={l.p.image} alt={l.p.title} /></div>
                <div>
                  <div className="nm">{l.p.title}</div>
                  <div className="meta">Size: {l.size}</div>
                </div>
                <div>
                  <div className="ay-qty"><button><I name="minus" size={14} /></button><span className="v">{l.qty}</span><button><I name="plus" size={14} /></button></div>
                </div>
                <div className="lt">{fmt(l.p.price * l.qty)}</div>
                <button className="rm"><I name="x" size={16} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="ay-cart-page-summary">
          <h3>Order summary</h3>
          <div className="ay-cart-row" style={{ marginBottom: 8 }}><span className="x">Subtotal · 4 items</span><span>{fmt(subtotal)}</span></div>
          <div className="ay-cart-row" style={{ marginBottom: 8 }}><span className="x">Delivery</span><span>{fmt(8)}</span></div>
          <div className="ay-cart-row total" style={{ marginTop: 12 }}><span>Total (QAR)</span><span>{fmt(subtotal + 8)}</span></div>
          <button className="ay-btn ay-btn-primary ay-btn-lg" style={{ width: '100%', marginTop: 16 }}>Continue to checkout</button>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, justifyContent: 'center' }}>
            <span className="ay-badge sold-out" style={{ fontSize: 9 }}>VISA</span>
            <span className="ay-badge sold-out" style={{ fontSize: 9 }}>MC</span>
            <span className="ay-badge sold-out" style={{ fontSize: 9 }}>APAY</span>
            <span className="ay-badge sold-out" style={{ fontSize: 9 }}>GPAY</span>
            <span className="ay-badge sold-out" style={{ fontSize: 9 }}>COD</span>
          </div>
        </div>
      </div>
    </main>
  );
}

// ────────────────────────── COLLECTION PAGE ──────────────────────────
function CollectionPage({ mobile = false }) {
  const S = window.SHOP;
  const products = S.products.filter(p => p.collection === "soft-drinks");
  return (
    <main className="ay-container">
      <div className="ay-coll-page">
        <div className="ay-crumbs">
          <a>Home</a><span className="sep">/</span><a>Beverages</a><span className="sep">/</span><span className="cur">Soft Drinks</span>
        </div>
        <div className="ay-coll-hd">
          <h1>Soft Drinks</h1>
          <p>Carbonated soft drinks, sodas and fizzy beverages — fully stocked across all the local favourites.</p>
        </div>
        <div className="ay-coll-results-bar">
          <div className="count">7 of 10 products</div>
          <div className="right">
            {mobile && <button className="ay-btn ay-btn-secondary ay-btn-sm"><I name="sliders-horizontal" size={14} /> Filter</button>}
            <span style={{ fontSize: 13, color: 'var(--color-ink-500)' }}>Sort by</span>
            <select>
              <option>Featured</option>
              <option>Price: Low to high</option>
              <option>Price: High to low</option>
              <option>Best selling</option>
              <option>A–Z</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
        <div className="ay-coll-layout">
          {!mobile && (
            <aside className="ay-filters">
              <div className="ay-active-filters">
                <span className="ay-active-filter">Cola <span className="x"><I name="x" size={12} /></span></span>
                <span className="ay-active-filter">In stock <span className="x"><I name="x" size={12} /></span></span>
                <button className="ay-clear-all">Clear all</button>
              </div>
              <div className="ay-filter-grp">
                <h5>Availability</h5>
                <label><input type="checkbox" defaultChecked /> In stock <span className="count">7</span></label>
                <label><input type="checkbox" /> Out of stock <span className="count">3</span></label>
              </div>
              <div className="ay-filter-grp">
                <h5>Price (QAR)</h5>
                <div className="ay-filter-price">
                  <div className="ay-filter-price-row">
                    <input placeholder="From" defaultValue="1" />
                    <span className="sep">→</span>
                    <input placeholder="To" defaultValue="5" />
                  </div>
                  <button className="ay-btn ay-btn-secondary ay-btn-sm" style={{ alignSelf: 'flex-start' }}>Apply</button>
                </div>
              </div>
              <div className="ay-filter-grp">
                <h5>Brand</h5>
                <label><input type="checkbox" defaultChecked /> Pepsi <span className="count">2</span></label>
                <label><input type="checkbox" /> Coca-Cola <span className="count">1</span></label>
                <label><input type="checkbox" /> Sprite <span className="count">1</span></label>
                <label><input type="checkbox" /> Mirinda <span className="count">1</span></label>
                <label><input type="checkbox" /> Barbican <span className="count">1</span></label>
                <label><input type="checkbox" /> 7Up <span className="count">1</span></label>
              </div>
              <div className="ay-filter-grp">
                <h5>Size</h5>
                <label><input type="checkbox" /> 150ml <span className="count">3</span></label>
                <label><input type="checkbox" /> 250ml <span className="count">2</span></label>
                <label><input type="checkbox" /> 330ml <span className="count">5</span></label>
                <label><input type="checkbox" /> 350ml <span className="count">2</span></label>
                <label><input type="checkbox" /> 1.25L <span className="count">3</span></label>
                <label><input type="checkbox" /> 2.25L <span className="count">4</span></label>
              </div>
              <div className="ay-filter-grp">
                <h5>Tag</h5>
                <label><input type="checkbox" defaultChecked /> Cola <span className="count">3</span></label>
                <label><input type="checkbox" /> Citrus <span className="count">2</span></label>
                <label><input type="checkbox" /> Carbonated <span className="count">7</span></label>
              </div>
            </aside>
          )}
          <div>
            <div className={`ay-prod-grid cols-${mobile ? 2 : 3}`}>
              {products.slice(0, mobile ? 6 : 6).map((p, i) => <ProductCard key={i} p={p} />)}
            </div>
            <div className="ay-pag">
              <a><I name="chevron-left" size={14} /></a>
              <a className="active">1</a>
              <a>2</a>
              <a><I name="chevron-right" size={14} /></a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ────────────────────────── PREDICTIVE SEARCH ──────────────────────────
function PredictiveSearch() {
  const S = window.SHOP;
  return (
    <div style={{ background: 'var(--bg-app)', padding: 20 }}>
      <div className="ay-search" style={{ maxWidth: 520, marginBottom: 8 }}>
        <span className="search-ic"><I name="search" size={18} /></span>
        <input value="pep" placeholder="Search the store…" readOnly style={{ background: '#fff' }} />
      </div>
      <div className="ay-pred">
        <div className="ay-pred-section">
          <div className="ay-pred-head">Suggestions</div>
          <div className="ay-pred-row"><div className="term"><span className="ic"><I name="search" size={14} /></span> pepsi</div></div>
          <div className="ay-pred-row"><div className="term"><span className="ic"><I name="search" size={14} /></span> pepsi 1.25l</div></div>
          <div className="ay-pred-row"><div className="term"><span className="ic"><I name="search" size={14} /></span> pepper</div></div>
        </div>
        <div className="ay-pred-section">
          <div className="ay-pred-head">Products</div>
          {S.products.slice(2, 5).map((p, i) => (
            <div key={i} className="ay-pred-row">
              <div className="pimg"><img src={p.image} alt={p.title} /></div>
              <div><div className="nm">{p.title}</div><div className="sub">{p.type} · {p.options.Size[0]}</div></div>
              <div className="pr">{fmt(p.price)}</div>
            </div>
          ))}
        </div>
        <div className="ay-pred-section">
          <div className="ay-pred-head">Collections</div>
          <div className="ay-pred-row" style={{ gridTemplateColumns: 'auto 1fr' }}>
            <div className="pimg" style={{ background: 'var(--t-primary-soft)', color: 'var(--t-primary)' }}><I name="package" size={18} /></div>
            <div><div className="nm">Soft Drinks</div><div className="sub">10 products</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────── SEARCH RESULTS PAGE ──────────────────────────
function SearchResultsPage({ mobile = false }) {
  const S = window.SHOP;
  const matched = S.products.filter(p => /soft|drink|pepsi|cola/i.test(p.title + " " + p.type)).slice(0, mobile ? 4 : 6);
  return (
    <main className="ay-container">
      <div className="ay-search-results-hd">
        <h1>Search results</h1>
        <p>4 products and 1 collection for "<strong style={{ color: 'var(--color-ink-900)' }}>cola</strong>"</p>
      </div>
      <div className="ay-search-results-tabs">
        <a className="ay-search-tab active">Products <span className="ct">{matched.length}</span></a>
        <a className="ay-search-tab">Collections <span className="ct">1</span></a>
        <a className="ay-search-tab">Pages <span className="ct">0</span></a>
      </div>
      <div className={`ay-prod-grid cols-${mobile ? 2 : 4}`}>
        {matched.map((p, i) => <ProductCard key={i} p={p} />)}
      </div>
      <div className="ay-pag">
        <a className="active">1</a>
        <a>2</a>
        <a><I name="chevron-right" size={14} /></a>
      </div>
    </main>
  );
}

// ────────────────────────── EXPORTS ──────────────────────────
Object.assign(window, {
  AnnouncementBar, HeaderLogoLeft, HeaderLogoCenter, Hero,
  ProductCard, FeaturedCollection, CollectionList, MultiColumn,
  RichText, Footer, PDP, CartDrawer, CartPage, CollectionPage,
  PredictiveSearch, SearchResultsPage, I, fmt,
});
