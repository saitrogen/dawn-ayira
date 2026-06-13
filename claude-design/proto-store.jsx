// ────────────────────────────────────────────────────────────
// Store: cart + router + viewport + toast
// All app state lives here. Pages and UI components consume via useStore().
// ────────────────────────────────────────────────────────────
const StoreCtx = React.createContext(null);
const useStore = () => React.useContext(StoreCtx);

const FREE_DELIVERY_THRESHOLD = 50; // QAR — matches the announcement bar copy

function StoreProvider({ children }) {
  const SHOP = window.SHOP;

  // Router state — single page at a time, no URL fragments
  const [page, setPage] = React.useState({ name: 'home', params: {} });
  const [history, setHistory] = React.useState([]);
  const [viewport, setViewport] = React.useState('desktop'); // desktop | mobile

  // Cart state. Seeded with 1 item so the drawer demo isn't empty on first visit.
  const [cart, setCart] = React.useState([
    { p: SHOP.products.find(p => p.handle === 'kdd-mango-nectar'), qty: 2, size: '250ml' },
  ]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [mobMenuOpen, setMobMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const toastT = React.useRef(null);

  function navigate(name, params = {}) {
    setHistory(h => [...h, page]);
    setPage({ name, params });
    setCartOpen(false);
    setMobMenuOpen(false);
    setSearchOpen(false);
    // Scroll the page scroll container, not window
    setTimeout(() => {
      document.querySelectorAll('.proto-scroll, .phone-scroll').forEach(el => el.scrollTo({ top: 0, behavior: 'instant' }));
    }, 10);
  }

  function back() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setPage(prev);
  }

  function showToast(text) {
    setToast(text);
    clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 2000);
  }

  function addToCart(p, qty = 1, size = null) {
    const chosenSize = size || (p.options?.Size?.[0]);
    setCart(c => {
      const ix = c.findIndex(l => l.p.handle === p.handle && l.size === chosenSize);
      if (ix >= 0) {
        const next = [...c];
        next[ix] = { ...next[ix], qty: next[ix].qty + qty };
        return next;
      }
      return [...c, { p, qty, size: chosenSize }];
    });
    setCartOpen(true);
    showToast(`${p.title} added to cart`);
  }

  function updateQty(idx, delta) {
    setCart(c => {
      const next = [...c];
      next[idx] = { ...next[idx], qty: Math.max(1, next[idx].qty + delta) };
      return next;
    });
  }

  function removeLine(idx) {
    setCart(c => c.filter((_, i) => i !== idx));
  }

  function clearCart() { setCart([]); }

  // Cart math
  const itemCount = cart.reduce((s, l) => s + l.qty, 0);
  const subtotal = cart.reduce((s, l) => s + l.p.price * l.qty, 0);
  const freeShipping = subtotal >= FREE_DELIVERY_THRESHOLD;
  const delivery = freeShipping || cart.length === 0 ? 0 : 8;
  const total = subtotal + delivery;

  const value = {
    SHOP, page, navigate, back, history,
    viewport, setViewport,
    cart, addToCart, updateQty, removeLine, clearCart,
    itemCount, subtotal, delivery, total, freeShipping, threshold: FREE_DELIVERY_THRESHOLD,
    cartOpen, setCartOpen,
    mobMenuOpen, setMobMenuOpen,
    searchOpen, setSearchOpen,
    toast,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

window.StoreCtx = StoreCtx;
window.useStore = useStore;
window.StoreProvider = StoreProvider;
