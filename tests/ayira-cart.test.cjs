const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const source = readFileSync(join(__dirname, '../assets/ayira-engine.js'), 'utf8');
const emptyCart = { item_count: 0, total_price: 0, currency: 'QAR', items: [] };

function loadCart(fetch, { pageType = '', cartBar = null } = {}) {
  const listeners = {};
  const document = {
    readyState: 'loading',
    body: { classList: { contains: (name) => name === pageType } },
    addEventListener: (name, listener) => { listeners[name] = listener; },
    dispatchEvent: () => {},
    getElementById: (id) => id === 'ayira-cart-bar' ? cartBar : null,
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  const context = {
    window: { location: { pathname: '/' }, routes: { cart_url: '/cart' } },
    document,
    fetch,
    setTimeout,
    clearTimeout,
    CustomEvent: class CustomEvent {},
    console: { warn() {}, error() {} },
  };
  vm.runInNewContext(source, context);
  return { cart: context.window.Ayira.Cart, listeners };
}

function jsonResponse(data, ok = true) {
  return { ok, status: ok ? 200 : 422, headers: { get: () => 'application/json' }, json: async () => data };
}

test('product-form add stays with Dawn and does not queue an optimistic add', () => {
  const { cart, listeners } = loadCart();
  let queued = false;
  cart.queueChange = () => { queued = true; };
  cart.bindEvents();
  const card = { dataset: { variantId: '123', hasVariants: 'false' } };
  const button = {
    closest: (selector) => selector.includes('product-form') ? {} :
      selector === '[data-product-card]' ? card : null,
  };
  listeners.click({
    target: { closest: () => button },
    preventDefault: () => assert.fail('Dawn submission must remain enabled'),
    stopPropagation: () => assert.fail('Dawn event must remain enabled'),
  });
  assert.equal(queued, false);
  assert.equal(cart.state.count, 0);
});

test('removing the last item uses its line key and accepts the empty server cart', async () => {
  const requests = [];
  const { cart } = loadCart(async (url, options) => {
    requests.push({ url, body: JSON.parse(options.body) });
    return jsonResponse(emptyCart);
  });
  cart.updateState({ ...emptyCart, item_count: 1, total_price: 250, items: [
    { variant_id: 123, key: '123:line-key', quantity: 1, price: 250, final_line_price: 250 },
  ] });
  cart.optimisticSet(123, 0);
  assert.equal(cart.state.items[123].key, '123:line-key');
  await cart.dispatchSync(123, 0);
  assert.deepEqual(requests, [{ url: '/cart/change.js', body: { id: '123:line-key', quantity: 0 } }]);
  assert.equal(cart.state.count, 0);
  assert.equal(cart.state.total, 0);
  assert.equal(cart.state.items[123], undefined);
});

test('a rejected add restores the empty canonical cart without a phantom item', async () => {
  const requests = [];
  const { cart } = loadCart(async (url) => {
    requests.push(url);
    return url === '/cart/add.js'
      ? jsonResponse({ status: 422, description: 'Sold out' }, false)
      : jsonResponse(emptyCart);
  });
  cart.optimisticSet(123, 1);
  await cart.dispatchSync(123, 1);
  assert.deepEqual(requests, ['/cart/add.js', '/cart.js']);
  assert.equal(cart.state.count, 0);
  assert.equal(cart.state.total, 0);
  assert.equal(cart.state.items[123], undefined);
});

test('basket summary stays off product and cart pages and remains on collection pages', () => {
  for (const pageType of ['template-product', 'template-cart', 'template-collection']) {
    const classes = new Set(['is-active']);
    const cartBar = {
      classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
      querySelector: () => null,
    };
    const { cart } = loadCart(undefined, { pageType, cartBar });
    cart.state.count = 1;
    cart.render();
    assert.equal(classes.has('is-active'), pageType === 'template-collection', pageType);
  }
});
