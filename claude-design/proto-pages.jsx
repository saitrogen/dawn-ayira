// ────────────────────────────────────────────────────────────
// Page components — Home, Collection, Product, Cart, Search, Static
// ────────────────────────────────────────────────────────────

// ────────────── Home ──────────────
function PHome() {
  const s = window.useStore();
  const mobile = s.viewport === 'mobile';
  const featured = s.SHOP.products.filter(p => p.collection === "soft-drinks").slice(0, mobile ? 4 : 4);
  const icecream = s.SHOP.products.filter(p => p.collection === "ice-cream-1");
  const juice = s.SHOP.products.filter(p => p.collection === "juice");
  const collections = s.SHOP.collections.filter(c => c.featured).slice(0, mobile ? 4 : 5);

  return (
    <div className="ay-page-fade">
      {/* Hero */}
      <section data-proto-section="hero" className="ay-hero">
        <div className="ay-container">
          <div className="ay-hero-frame">
            <div className="ay-hero-bg" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80)` }}></div>
            <div className="ay-hero-inner">
              <span className="ay-eyebrow"><span className="pip"></span> Same-day delivery</span>
              <h1>The everyday minimart, online.</h1>
              <p>Beverages, snacks and pantry essentials from Ayira Mini Mart in Al Khor — saved to your cart and on the way in under two hours.</p>
              <div className="ay-hero-cta">
                <a className="ay-btn ay-btn-accent ay-btn-lg" onClick={() => s.navigate('collection', { handle: 'soft-drinks' })}>Shop weekly specials</a>
                <a className="ay-btn ay-btn-secondary ay-btn-lg" style={{ background: 'transparent', color: 'var(--t-on-primary)', borderColor: 'rgba(255,255,255,0.4)' }} onClick={() => s.navigate('collection', { handle: 'all' })}>Browse all</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection list */}
      <section data-proto-section="collection_list" className="ay-section" style={mobile ? { padding: '20px 0' } : { padding: '32px 0 48px' }}>
        <div className="ay-container">
          <div className="ay-section-head">
            <div>
              <div className="ay-section-eyebrow">Shop by aisle</div>
              <h2>Browse our collections</h2>
            </div>
            <a className="viewall" onClick={() => s.navigate('collection', { handle: 'all' })}>All collections <PI name="arrow-right" size={16} /></a>
          </div>
          <div className="ay-coll-grid" style={mobile ? null : { gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {collections.map((c, i) => (
              <a key={i} className="ay-coll" onClick={() => s.navigate('collection', { handle: c.handle })}>
                {c.image
                  ? <div className="ay-coll-bg" style={{ backgroundImage: `url(${c.image})` }}></div>
                  : <div className="ay-coll-bg placeholder"><span>{c.title[0]}</span></div>}
                <div className="ay-coll-text">
                  <div>
                    <h3>{c.title}</h3>
                    <div className="count">{c.product_count} items</div>
                  </div>
                  <div className="arr"><PI name="arrow-right" size={16} /></div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured collection — soft drinks */}
      <section data-proto-section="featured_collection" className="ay-section" style={mobile ? { padding: '20px 0' } : null}>
        <div className="ay-container">
          <div className="ay-section-head">
            <div>
              <div className="ay-section-eyebrow">Weekly picks</div>
              <h2>Soft drinks · weekly favourites</h2>
            </div>
            <a className="viewall" onClick={() => s.navigate('collection', { handle: 'soft-drinks' })}>View all <PI name="arrow-right" size={16} /></a>
          </div>
          <div className={`ay-prod-grid cols-${mobile ? 2 : 4}`}>
            {featured.map((p, i) => <PProductCard key={i} p={p} />)}
          </div>
        </div>
      </section>

      {/* Multicolumn (value props) */}
      <section data-proto-section="multi_column" className="ay-section" style={mobile ? { padding: '20px 0' } : null}>
        <div className="ay-container">
          <div className="ay-cols">
            {[
              { icon: "truck",        title: "Same-day delivery", text: "Order before 4pm. We deliver across Al Khor by evening." },
              { icon: "shield-check", title: "Quality assured",   text: "Hand-picked stock. Easy returns within 48 hours." },
              { icon: "credit-card",  title: "Secure checkout",   text: "Apple Pay, Google Pay and all major cards accepted." },
              { icon: "phone",        title: "We're here",        text: "Call or WhatsApp our store any time during opening hours." },
            ].map((it, i) => (
              <div key={i} className="ay-col">
                <span className="ic"><PI name={it.icon} size={22} /></span>
                <h4>{it.title}</h4>
                <p>{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured collection — ice cream */}
      <section data-proto-section="featured_collection_2" className="ay-section" style={mobile ? { padding: '20px 0' } : null}>
        <div className="ay-container">
          <div className="ay-section-head">
            <div>
              <div className="ay-section-eyebrow">Frozen aisle</div>
              <h2>Cool down — ice cream</h2>
            </div>
            <a className="viewall" onClick={() => s.navigate('collection', { handle: 'ice-cream-1' })}>View all <PI name="arrow-right" size={16} /></a>
          </div>
          <div className={`ay-prod-grid cols-${mobile ? 2 : 3}`}>
            {[...icecream, ...juice.slice(0,1)].slice(0, mobile ? 4 : 3).map((p, i) => <PProductCard key={i} p={p} />)}
          </div>
        </div>
      </section>

      {/* Rich text */}
      <section data-proto-section="rich_text" className="ay-section" style={mobile ? { padding: '20px 0' } : null}>
        <div className="ay-container">
          <div className="ay-richtext">
            <div className="ay-eyebrow">Store hours · Al Khor</div>
            <h2>Open seven days, just around the corner.</h2>
            <p>Stop in for fresh stock, or shop online and we'll bring it over. We open at 7am Saturday through Thursday, and 8am on Fridays — last delivery slot goes out at 10pm.</p>
            <a className="ay-btn ay-btn-secondary" onClick={() => s.navigate('page', { handle: 'contact-us', title: 'Contact us' })}>Get directions</a>
          </div>
        </div>
      </section>

      <PFooter />
    </div>
  );
}

// ────────────── Collection ──────────────
function PCollection() {
  const s = window.useStore();
  const mobile = s.viewport === 'mobile';
  const [showFilters, setShowFilters] = React.useState(!mobile);
  const handle = s.page.params.handle || 'soft-drinks';
  const all = s.SHOP.collections;
  const coll = all.find(c => c.handle === handle) || { handle: 'all', title: 'All products', description: 'Everything we stock — beverages, snacks, frozen and essentials.', product_count: s.SHOP.products.length };
  const products = handle === 'all' ? s.SHOP.products : s.SHOP.products.filter(p => p.collection === handle);

  return (
    <main className="ay-page-fade">
      <div className="ay-container">
        <div className="ay-crumbs">
          <a onClick={() => s.navigate('home')}>Home</a>
          <span className="sep">/</span>
          <a onClick={() => s.navigate('collection', { handle: 'all' })}>Shop</a>
          <span className="sep">/</span>
          <span className="cur">{coll.title}</span>
        </div>
        <div className="ay-coll-hd">
          <h1>{coll.title}</h1>
          <p>{coll.description}</p>
        </div>
        <div className="ay-coll-results-bar">
          <div className="count">{products.length} product{products.length === 1 ? '' : 's'}</div>
          <div className="right">
            {mobile && <button className="ay-btn ay-btn-secondary ay-btn-sm" onClick={() => setShowFilters(o => !o)}><PI name="sliders-horizontal" size={14} /> Filter</button>}
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
        <div className="ay-coll-layout" style={mobile ? { gridTemplateColumns: '1fr' } : null}>
          {(!mobile || showFilters) && (
            <aside className="ay-filters">
              {!mobile && (
                <div className="ay-active-filters">
                  <span className="ay-active-filter">{coll.title} <span className="x"><PI name="x" size={12} /></span></span>
                  <button className="ay-clear-all">Clear all</button>
                </div>
              )}
              <div className="ay-filter-grp">
                <h5>Availability</h5>
                <label><input type="checkbox" defaultChecked /> In stock <span className="count">{products.filter(p => p.available).length}</span></label>
                <label><input type="checkbox" /> Out of stock <span className="count">{products.filter(p => !p.available).length}</span></label>
              </div>
              <div className="ay-filter-grp">
                <h5>Price (QAR)</h5>
                <div className="ay-filter-price">
                  <div className="ay-filter-price-row">
                    <input placeholder="From" defaultValue="1" />
                    <span className="sep">→</span>
                    <input placeholder="To" defaultValue="10" />
                  </div>
                  <button className="ay-btn ay-btn-secondary ay-btn-sm" style={{ alignSelf: 'flex-start' }}>Apply</button>
                </div>
              </div>
              {handle === 'soft-drinks' && (
                <div className="ay-filter-grp">
                  <h5>Brand</h5>
                  <label><input type="checkbox" /> Pepsi <span className="count">2</span></label>
                  <label><input type="checkbox" /> Coca-Cola <span className="count">1</span></label>
                  <label><input type="checkbox" /> Sprite <span className="count">1</span></label>
                  <label><input type="checkbox" /> Mirinda <span className="count">1</span></label>
                  <label><input type="checkbox" /> 7Up <span className="count">1</span></label>
                </div>
              )}
              <div className="ay-filter-grp">
                <h5>Size</h5>
                <label><input type="checkbox" /> 150ml <span className="count">3</span></label>
                <label><input type="checkbox" /> 330ml <span className="count">5</span></label>
                <label><input type="checkbox" /> 1.25L <span className="count">3</span></label>
                <label><input type="checkbox" /> 2.25L <span className="count">4</span></label>
              </div>
            </aside>
          )}
          <div>
            {products.length === 0 ? (
              <div className="ay-empty">
                <span className="ic"><PI name="package" size={28} /></span>
                <h3>No products in this collection yet</h3>
                <p>Try browsing one of our featured aisles.</p>
                <button className="ay-btn ay-btn-primary" onClick={() => s.navigate('collection', { handle: 'soft-drinks' })}>Shop soft drinks</button>
              </div>
            ) : (
              <div className={`ay-prod-grid cols-${mobile ? 2 : 3}`}>
                {products.map((p, i) => <PProductCard key={i} p={p} />)}
              </div>
            )}
            {products.length > 0 && (
              <div className="ay-pag">
                <a><PI name="chevron-left" size={14} /></a>
                <a className="active">1</a>
                <a>2</a>
                <a><PI name="chevron-right" size={14} /></a>
              </div>
            )}
          </div>
        </div>
      </div>
      <PFooter />
    </main>
  );
}

// ────────────── PDP ──────────────
function PProduct() {
  const s = window.useStore();
  const mobile = s.viewport === 'mobile';
  const handle = s.page.params.handle;
  const p = s.SHOP.products.find(x => x.handle === handle) || s.SHOP.products[0];
  const sizes = p.options?.Size || ["Default"];
  const [size, setSize] = React.useState(sizes[0]);
  const [qty, setQty] = React.useState(1);
  const [thumbIdx, setThumbIdx] = React.useState(0);
  const onSale = p.compareAt && p.compareAt > p.price;
  const related = s.SHOP.products.filter(x => x.collection === p.collection && x.handle !== p.handle).slice(0, mobile ? 2 : 4);
  const coll = s.SHOP.collections.find(c => c.handle === p.collection);

  // Build a small set of "gallery thumbs" — reuse other products from the same collection
  const thumbs = [p, ...s.SHOP.products.filter(x => x.collection === p.collection && x.handle !== p.handle)].slice(0, 4);
  const active = thumbs[thumbIdx] || p;

  return (
    <main className="ay-page-fade">
      <div className="ay-container">
        <div className="ay-crumbs">
          <a onClick={() => s.navigate('home')}>Home</a><span className="sep">/</span>
          <a onClick={() => s.navigate('collection', { handle: p.collection })}>{coll?.title || p.type}</a><span className="sep">/</span>
          <span className="cur">{p.title}</span>
        </div>
        <div className="ay-pdp" style={{ position: 'relative' }}>
          <div className="ay-pdp-gallery">
            <div className="ay-pdp-main">
              {onSale && (
                <div className="ay-badges">
                  <span className="ay-badge sale">Save {Math.round((1 - p.price/p.compareAt) * 100)}%</span>
                </div>
              )}
              <img src={active.image} alt={p.title} />
            </div>
            {!mobile && (
              <div className="ay-pdp-thumbs">
                {thumbs.map((t, i) => (
                  <div key={i} className={`ay-pdp-thumb ${i === thumbIdx ? 'active' : ''}`} onClick={() => setThumbIdx(i)}>
                    <img src={t.image} alt={t.title} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="ay-pdp-info">
            <div className="vendor">Ayira Mini Mart · {p.type}</div>
            <h1>{p.title}</h1>
            <div className="ay-flex-c" style={{ gap: 8, fontSize: 13, color: 'var(--color-ink-500)' }}>
              <span style={{ color: 'var(--t-accent)' }}>★ ★ ★ ★ ★</span>
              <span>4.8 (124 reviews)</span>
            </div>
            <div className="ay-pdp-price-row">
              <div className="ay-pdp-price">
                {pfmt(p.price)}{onSale && <span className="old">{pfmt(p.compareAt)}</span>}
              </div>
              <div className={`ay-pdp-stock ${!p.available ? 'out' : ''}`}>
                <span className="dot"></span>
                {p.available ? 'In stock · Ready to ship' : 'Out of stock — restocking soon'}
              </div>
            </div>
            <p style={{ fontSize: 14.5, color: 'var(--color-ink-700)', lineHeight: 1.6 }}>
              {productCopy(p)}
            </p>
            <div className="ay-pdp-opt">
              <div className="label">Size <span className="v">· {size}</span></div>
              <div className="variants">
                {sizes.map((sz, i) => (
                  <button key={i} className={`variant ${sz === size ? 'active' : ''}`} onClick={() => setSize(sz)}>{sz}</button>
                ))}
              </div>
            </div>
            <div className="ay-pdp-controls">
              <div className="ay-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}><PI name="minus" size={16} /></button>
                <span className="v">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}><PI name="plus" size={16} /></button>
              </div>
              <button
                className="ay-btn ay-btn-primary ay-btn-lg"
                disabled={!p.available}
                onClick={() => s.addToCart(p, qty, size)}
              >
                <PI name="shopping-bag" size={18} /> Add to cart · {pfmt(p.price * qty)}
              </button>
            </div>
            <button className="ay-btn ay-btn-accent ay-btn-lg" style={{ width: '100%' }} onClick={() => { s.addToCart(p, qty, size); }}>Buy it now</button>
            <div className="ay-pdp-meta">
              <div className="ay-pdp-meta-item">
                <span className="ic"><PI name="truck" size={20} /></span>
                <div><div className="ttl">Same-day delivery</div><div className="sub">Order before 4pm in Al Khor</div></div>
              </div>
              <div className="ay-pdp-meta-item">
                <span className="ic"><PI name="package-check" size={20} /></span>
                <div><div className="ttl">Easy returns</div><div className="sub">Within 48 hours of delivery</div></div>
              </div>
            </div>
            <div className="ay-pdp-accord">
              <details className="ay-pdp-accord-item" open>
                <summary>Description</summary>
                <p>{productCopy(p)}</p>
              </details>
              <details className="ay-pdp-accord-item">
                <summary>Shipping & returns</summary>
                <p>Same-day delivery in Al Khor for orders placed before 4pm. Returns accepted within 48 hours for sealed, undamaged items. Frozen and chilled items are not returnable once opened.</p>
              </details>
              <details className="ay-pdp-accord-item">
                <summary>Storage</summary>
                <p>Store in a cool, dry place. Once opened, refrigerate and consume within the time stated on the packaging.</p>
              </details>
            </div>
          </div>
          {mobile && p.available && (
            <div className="ay-sticky-atc">
              <div className="price"><div className="p">{pfmt(p.price * qty)}</div><div className="u">{size} · qty {qty}</div></div>
              <button className="ay-btn ay-btn-primary" onClick={() => s.addToCart(p, qty, size)}>Add to cart</button>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <section className="ay-section" style={mobile ? { padding: '20px 0' } : { padding: '32px 0 48px' }}>
            <div className="ay-section-head">
              <div>
                <div className="ay-section-eyebrow">You might also like</div>
                <h2>More from {coll?.title || p.type}</h2>
              </div>
              <a className="viewall" onClick={() => s.navigate('collection', { handle: p.collection })}>View all <PI name="arrow-right" size={16} /></a>
            </div>
            <div className={`ay-prod-grid cols-${mobile ? 2 : 4}`}>
              {related.map((rp, i) => <PProductCard key={i} p={rp} />)}
            </div>
          </section>
        )}
      </div>
      <PFooter />
    </main>
  );
}

function productCopy(p) {
  const copies = {
    "soft-drinks": "Classic carbonated refreshment, ice-cold ready. Sold per bottle — choose your size below. Stock up by the case for parties and gatherings.",
    "juice":       "Real fruit juice, lightly chilled. A grab-and-go drink that's right at home in a school lunch or office fridge.",
    "ice-cream-1": "Indulgent frozen dessert, kept at -18°C from store to your door. Best eaten within 10 minutes of arrival — or popped straight in the freezer.",
    "chocolates-1": "Smooth, milk-chocolate treat for everyday cravings or last-minute gifts. Pairs well with a hot coffee.",
    "gums":         "Long-lasting flavor for after meals or busy mornings. Sugar-free options available.",
    "candy":        "Sweet, bright and snackable — perfect for kids' party bags and pick-and-mix moments.",
    "noodles":      "Quick-cook noodles for those nights when dinner needs to be ready in 5 minutes.",
    "water":        "Pure, lightly mineralized water bottled in Qatar. Carry a few for the gym, keep a case at home.",
    "dairy":        "Fresh, refrigerated daily. Trusted dairy essentials for breakfast, baking and everything in between.",
  };
  return copies[p.collection] || "Hand-picked from our shelves for quality and freshness. Sold individually.";
}

// ────────────── Cart page ──────────────
function PCartPage() {
  const s = window.useStore();
  const mobile = s.viewport === 'mobile';
  const remaining = Math.max(0, s.threshold - s.subtotal);
  const pct = Math.min(100, (s.subtotal / s.threshold) * 100);

  if (s.cart.length === 0) {
    return (
      <main className="ay-container ay-page-fade">
        <div className="ay-empty" style={{ padding: '80px 24px' }}>
          <span className="ic"><PI name="shopping-bag" size={32} /></span>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet. Browse our featured collections to get started.</p>
          <button className="ay-btn ay-btn-primary" onClick={() => s.navigate('home')}>Continue shopping</button>
        </div>
        <PFooter />
      </main>
    );
  }

  return (
    <main className="ay-page-fade">
      <div className="ay-container">
        <div className="ay-crumbs">
          <a onClick={() => s.navigate('home')}>Home</a><span className="sep">/</span><span className="cur">Your cart</span>
        </div>
        <div className="ay-cart-page">
          <div>
            <h1>Your cart</h1>
            <div className={`ay-ship-prog ${s.freeShipping ? 'unlocked' : ''}`} style={{ marginBottom: 20 }}>
              <div className="ay-ship-prog-text">
                <span className="ic"><PI name={s.freeShipping ? 'check-circle' : 'truck'} size={16} /></span>
                {s.freeShipping
                  ? <span>You unlocked <strong>free delivery</strong> across Al Khor.</span>
                  : <span>Add <strong>{pfmt(remaining)}</strong> more for free delivery</span>}
              </div>
              <div className="ay-ship-bar"><div className="fill" style={{ width: `${pct}%` }}></div></div>
            </div>
            {!mobile && (
              <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr 100px 100px 60px', gap: 16, padding: '0 14px 12px', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-ink-500)', fontWeight: 600 }}>
                <div></div><div>Product</div><div>Price</div><div style={{ textAlign: 'right' }}>Total</div><div></div>
              </div>
            )}
            <div className="ay-cart-page-lines">
              {s.cart.map((l, i) => mobile ? (
                <div key={i} className="ay-cart-page-line">
                  <div className="img" onClick={() => s.navigate('product', { handle: l.p.handle })}><img src={l.p.image} alt={l.p.title} /></div>
                  <div>
                    <div className="nm" onClick={() => s.navigate('product', { handle: l.p.handle })} style={{ cursor: 'pointer' }}>{l.p.title}</div>
                    <div className="meta">Size: {l.size}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, justifyContent: 'space-between' }}>
                      <div className="ay-qty">
                        <button onClick={() => s.updateQty(i, -1)}><PI name="minus" size={14} /></button>
                        <span className="v">{l.qty}</span>
                        <button onClick={() => s.updateQty(i, 1)}><PI name="plus" size={14} /></button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="price">{pfmt(l.p.price * l.qty)}</div>
                        <button className="rm" onClick={() => s.removeLine(i)}><PI name="x" size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={i} className="ay-cart-page-line">
                  <div className="img" onClick={() => s.navigate('product', { handle: l.p.handle })} style={{ cursor: 'pointer' }}><img src={l.p.image} alt={l.p.title} /></div>
                  <div>
                    <div className="nm" onClick={() => s.navigate('product', { handle: l.p.handle })} style={{ cursor: 'pointer' }}>{l.p.title}</div>
                    <div className="meta">Size: {l.size}</div>
                  </div>
                  <div>
                    <div className="ay-qty">
                      <button onClick={() => s.updateQty(i, -1)}><PI name="minus" size={14} /></button>
                      <span className="v">{l.qty}</span>
                      <button onClick={() => s.updateQty(i, 1)}><PI name="plus" size={14} /></button>
                    </div>
                  </div>
                  <div className="lt">{pfmt(l.p.price * l.qty)}</div>
                  <button className="rm" onClick={() => s.removeLine(i)} aria-label="Remove"><PI name="x" size={16} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button className="ay-btn ay-btn-ghost" onClick={() => s.navigate('home')}><PI name="arrow-left" size={16} /> Continue shopping</button>
              <button className="ay-btn ay-btn-ghost" onClick={() => s.clearCart()} style={{ color: 'var(--color-ink-500)' }}>Clear cart</button>
            </div>
          </div>
          <div className="ay-cart-page-summary">
            <h3>Order summary</h3>
            <div className="ay-cart-row" style={{ marginBottom: 8 }}><span className="x">Subtotal · {s.itemCount} items</span><span>{pfmt(s.subtotal)}</span></div>
            <div className="ay-cart-row" style={{ marginBottom: 8 }}><span className="x">Delivery</span><span>{s.delivery === 0 ? <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Free</span> : pfmt(s.delivery)}</span></div>
            <div className="ay-cart-row total" style={{ marginTop: 12 }}><span>Total (QAR)</span><span>{pfmt(s.total)}</span></div>
            <button className="ay-btn ay-btn-primary ay-btn-lg" style={{ width: '100%', marginTop: 16 }}>Continue to checkout</button>
            <div style={{ display: 'flex', gap: 6, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['VISA','MC','AMEX','APAY','GPAY','COD'].map(t => <span key={t} className="ay-badge sold-out" style={{ fontSize: 9 }}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
      <PFooter />
    </main>
  );
}

// ────────────── Search results ──────────────
function PSearch() {
  const s = window.useStore();
  const mobile = s.viewport === 'mobile';
  const q = s.page.params.q || '';
  const matches = s.SHOP.products.filter(p =>
    p.title.toLowerCase().includes(q.toLowerCase()) ||
    p.type.toLowerCase().includes(q.toLowerCase()) ||
    (p.collection || '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="ay-container ay-page-fade">
      <div className="ay-search-results-hd">
        <h1>Search results</h1>
        <p>{matches.length} products for "<strong style={{ color: 'var(--color-ink-900)' }}>{q}</strong>"</p>
      </div>
      <div className="ay-search-results-tabs">
        <a className="ay-search-tab active">Products <span className="ct">{matches.length}</span></a>
        <a className="ay-search-tab">Collections <span className="ct">0</span></a>
        <a className="ay-search-tab">Pages <span className="ct">0</span></a>
      </div>
      {matches.length === 0 ? (
        <div className="ay-empty">
          <span className="ic"><PI name="search-x" size={28} /></span>
          <h3>No matches for "{q}"</h3>
          <p>Try a different search term, or browse one of our collections below.</p>
          <button className="ay-btn ay-btn-primary" onClick={() => s.navigate('home')}>Back to home</button>
        </div>
      ) : (
        <div className={`ay-prod-grid cols-${mobile ? 2 : 4}`}>
          {matches.map((p, i) => <PProductCard key={i} p={p} />)}
        </div>
      )}
      <PFooter />
    </main>
  );
}

// ────────────── Static page (contact, about, etc.) ──────────────
function PStaticPage() {
  const s = window.useStore();
  const { handle, title } = s.page.params;
  const content = {
    'contact-us': {
      title: "Contact us",
      lede: "Stop by, call, or message — whichever is easiest.",
      body: [
        { h: "Visit the store", p: "Ayira Mini Mart · Al Khor, Qatar. Open 7 days a week.", icon: "map-pin" },
        { h: "Call or WhatsApp", p: "+974 5xxx xxxx · we answer between 7am and 10pm.", icon: "phone" },
        { h: "Email us", p: "hello@ayiraminimart.com — for orders and refunds.", icon: "mail" },
      ],
    },
    'account': {
      title: "Your account",
      lede: "Sign in to track your orders and save your favourites.",
      body: [],
    },
  }[handle] || { title: title || "Page", lede: "", body: [] };

  return (
    <main className="ay-container ay-page-fade">
      <div className="ay-crumbs">
        <a onClick={() => s.navigate('home')}>Home</a><span className="sep">/</span><span className="cur">{content.title}</span>
      </div>
      <div className="ay-section">
        <div className="ay-richtext" style={{ maxWidth: 800, padding: 0 }}>
          <h2 style={{ textAlign: 'left', marginBottom: 12 }}>{content.title}</h2>
          {content.lede && <p style={{ textAlign: 'left' }}>{content.lede}</p>}
        </div>
        {content.body.length > 0 && (
          <div className="ay-cols" style={{ marginTop: 32, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {content.body.map((b, i) => (
              <div key={i} className="ay-col">
                <span className="ic"><PI name={b.icon} size={22} /></span>
                <h4>{b.h}</h4>
                <p>{b.p}</p>
              </div>
            ))}
          </div>
        )}
        {handle === 'account' && (
          <div style={{ maxWidth: 420, margin: '32px 0', padding: 24, background: 'var(--color-cream-50)', borderRadius: 16, border: '1px solid var(--color-ink-200)' }}>
            <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 700, color: 'var(--color-ink-900)' }}>Sign in</h4>
            <input placeholder="Email" style={{ width: '100%', marginBottom: 10, padding: 11, borderRadius: 10, border: '1.5px solid var(--color-ink-200)', font: 'inherit', fontSize: 14 }} />
            <input type="password" placeholder="Password" style={{ width: '100%', marginBottom: 14, padding: 11, borderRadius: 10, border: '1.5px solid var(--color-ink-200)', font: 'inherit', fontSize: 14 }} />
            <button className="ay-btn ay-btn-primary" style={{ width: '100%' }}>Sign in</button>
            <a style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--t-primary)' }}>Create an account →</a>
          </div>
        )}
      </div>
      <PFooter />
    </main>
  );
}

// ────────────── Footer ──────────────
function PFooter() {
  const s = window.useStore();
  return (
    <footer data-proto-section="footer" className="ay-footer">
      <div className="ay-container">
        <div className="ay-footer-inner">
          <div className="ay-footer-brand">
            <img src="assets/logo-wordmark-cream.png" alt="Ayira Mini Mart" />
            <p>Your neighbourhood minimart in Al Khor — beverages, snacks, frozen and everyday essentials.</p>
            <div className="socials">
              <a aria-label="Instagram"><PI name="camera" size={16} /></a>
              <a aria-label="WhatsApp"><PI name="message-circle" size={16} /></a>
              <a aria-label="Email"><PI name="mail" size={16} /></a>
            </div>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              <li><a onClick={() => s.navigate('collection', { handle: 'soft-drinks' })}>Soft Drinks</a></li>
              <li><a onClick={() => s.navigate('collection', { handle: 'juice' })}>Juice</a></li>
              <li><a onClick={() => s.navigate('collection', { handle: 'chocolates-1' })}>Chocolates</a></li>
              <li><a onClick={() => s.navigate('collection', { handle: 'ice-cream-1' })}>Ice Cream</a></li>
              <li><a onClick={() => s.navigate('collection', { handle: 'noodles' })}>Noodles</a></li>
            </ul>
          </div>
          <div>
            <h5>Help</h5>
            <ul>
              <li><a onClick={() => s.navigate('page', { handle: 'contact-us', title: 'Contact us' })}>Contact us</a></li>
              <li><a onClick={() => s.navigate('page', { handle: 'faq', title: 'FAQ' })}>FAQ</a></li>
              <li><a onClick={() => s.navigate('page', { handle: 'shipping', title: 'Shipping & delivery' })}>Shipping & delivery</a></li>
              <li><a onClick={() => s.navigate('page', { handle: 'returns', title: 'Returns & refunds' })}>Returns & refunds</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a onClick={() => s.navigate('page', { handle: 'about', title: 'About us' })}>About us</a></li>
              <li><a onClick={() => s.navigate('page', { handle: 'privacy', title: 'Privacy policy' })}>Privacy policy</a></li>
              <li><a onClick={() => s.navigate('page', { handle: 'terms', title: 'Terms of service' })}>Terms of service</a></li>
              <li><a onClick={() => s.navigate('search', { q: '' })}>Search</a></li>
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
            <span className="chip">VISA</span><span className="chip">MC</span><span className="chip">AMEX</span>
            <span className="chip">APAY</span><span className="chip">GPAY</span><span className="chip">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { PHome, PCollection, PProduct, PCartPage, PSearch, PStaticPage, PFooter });
