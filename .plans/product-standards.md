# Product Data Standard — Ayira Mini Mart

The target every product must meet before we consider the catalog "clean."
Store context: quick-access / emergency mini mart in Qatar. Catalog is mostly
snacks, soft drinks, confectionery. Shopper intent: "I need X now — is it in
stock — order fast." Data leads, theme follows.

## Guiding principle: keep it reversible

A clean, consistently-structured catalog can be re-presented **any** way later
(separate products ↔ variants). A messy one locks you into one shape. So we
capture structuring info as **data**, not as free text buried in the title.

**Decision (owner's call, not yet verified with data):** each size/pack is its
own **separate product**, not a variant — "that's how customers want to see it."
We follow this, but keep titles + fields disciplined so sizes can be grouped
into variants later by script if the data ever says otherwise.

---

## The standard, field by field

### 1. Title — `Brand Flavor/Variant Size`
Consistent, predictable order. This format is what makes the catalog reversible:
a script can group by brand+flavor to build variants later.
- ✅ `7Up 330ml`, `7Up Lemon & Lime 2.25L`, `Barbican Apple 330ml`
- ❌ `7UP` vs `7Up` (casing drift), size sometimes missing, flavor sometimes
  before/after brand.
- Rules: one brand casing per brand. Always include size/pack. Units lowercase
  and attached to number: `330ml`, `1.5l`, `200g`, `6x250ml`.

### 2. Product Type — the taxonomy key
Drives every collection (they're smart collections keyed on `TYPE`). Must be
**exact and consistent** — a typo silently drops the product out of its
collection.
- Use the settled type list (see Taxonomy in `notes.md` once grouped).
- One product = one type. Don't invent near-duplicates (`Biscuits` vs
  `Biscuits & Wafers` — pick one).

### 3. Vendor = BRAND (currently wrong everywhere)
Today vendor is `Ayira Mini Mart` on every product. Change to the real brand:
`7Up`, `Pepsi`, `Barbican`, `Coca-Cola`, `Lay's`, etc.
- Why: brand is a primary search + filter axis in grocery. Free, high-value.
- Unbranded/loose items: use a sensible brand or `Generic`, not the store name.

### 4. Tags = cross-cutting attributes (currently wasted)
Today tags just repeat the product type — zero information. Tags should carry
what the category can't:
- **Dietary (important in Qatar):** `Halal`, `Sugar-Free`, `Diet`, `Vegan`
- **Merchandising:** `New`, `Offer`, `Best-Seller`
- **Pack:** `Single`, `Multipack`
- Rule: never tag with the product type. Tags power collection-page filters —
  only add a tag you'd actually want as a filter or badge.

### 5. Variants — Default only (per owner's decision)
Each product stays single-variant (`Default Title`) for now. Size/flavor live in
separate products. Revisit only if order data shows shoppers want a size picker.

### 6. SKU — required, unique
`AYR-####` scheme is fine. Every product needs one (it's the inventory identity).

### 7. Inventory — NOT tracked, always available (decided)
Decision: we do **not** track stock. Every product is assumed always in stock.
- Set each variant to "don't track quantity" (Shopify: uncheck *Track quantity*),
  so it always shows available and never blocks add-to-cart.
- No out-of-stock states, no negative counts, no per-item stock upkeep.
- Revisit only if the business actually needs stock control later.

### 8. Image — required, consistent
Every product needs its featured image (most already have one). Keep style
consistent (same background treatment) so the grid looks like one shelf.

### 9. Description — optional, skip for now
Empty is acceptable for a quick-access snack shop. No one reads a paragraph about
soda. Don't spend time here until the above is done.

---

## Per-product checklist

- [ ] Title follows `Brand Flavor Size`, consistent casing + units
- [ ] Product Type exact, from the settled list
- [ ] Vendor = real brand (not "Ayira Mini Mart")
- [ ] Tags carry real attributes (Halal / Sugar-Free / Offer / New), never the type
- [ ] SKU present and unique
- [ ] Variant set to "don't track quantity" (always available)
- [ ] Featured image present, consistent style

## Priority order to fix (cheapest + highest impact first)

1. **Turn off stock tracking** — one bulk pass, "don't track quantity" on all
   variants so nothing reads as out of stock
2. **Vendor → brand** — unlocks brand search/filter, mechanical fix
3. **Title consistency** — enables reversibility + better search
4. **Tags → real attributes** — powers filters/badges
5. **Type cleanup** — merge dupes (e.g. the `RAYYAN`/`Rayyan` 330ml×12), fix strays

## Deferred (YAGNI for now)
- Metafields for structured size/weight/nutrition — title convention covers
  reversibility for now; add only if a real feature needs it.
- Descriptions.
- Variant/size-picker model — owner's call is separate products; only revisit
  with real order data.
