const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

test('quantity rules refresh without an optional loading spinner', async () => {
  let ProductInfo;
  const requests = [];
  vm.runInNewContext(readFileSync(join(__dirname, '../assets/product-info.js'), 'utf8'), {
    HTMLElement: class {},
    customElements: { get: () => undefined, define: (_, component) => { ProductInfo = component; } },
    fetch: async (url) => { requests.push(url); return { text: async () => '<div></div>' }; },
    DOMParser: class { parseFromString() { return {}; } },
    console: { error: (error) => assert.fail(String(error)) },
  });
  const info = Object.create(ProductInfo.prototype);
  Object.defineProperty(info, 'productForm', { value: { variantIdInput: { value: '123' } } });
  info.dataset = { url: '/products/test', section: 'main' };
  info.querySelector = () => null;
  let updated = false;
  info.updateQuantityRules = (section) => { assert.equal(section, 'main'); updated = true; };
  await info.fetchQuantityRules();
  assert.equal(updated, true);
  assert.deepEqual(requests, ['/products/test?variant=123&section_id=main']);
});
