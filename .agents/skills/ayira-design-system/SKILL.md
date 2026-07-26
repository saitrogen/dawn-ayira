---
name: ayira-design-system
description: Core, confirmed Ayira storefront design guardrails. Use for every Ayira Shopify storefront UI/UX review, redesign, section, Liquid markup, CSS, visual asset, content, responsive, accessibility, or design QA task. Prevent unsupported design assumptions while the system is still growing.
---

# Ayira Design System

Treat this skill as the only source of truth for confirmed Ayira design
decisions. Theme code is an implementation to audit, not a source from which to
infer missing design rules.

## Governing principle

Do no design harm.

- Follow the confirmed rules below.
- Preserve accessibility, truthful commerce information, Shopify-calculated
  values, and Dawn behavior.
- When a design decision is not defined here, do not invent one, derive one
  from legacy CSS, or turn an existing inconsistency into a standard.
- Preserve the functional structure and make only the smallest reversible
  change needed.
- If an undefined decision would materially affect the design, state the gap
  and ask for direction.
- Treat proposals as proposals until the owner confirms them and this skill is
  updated.

## Confirmed core

### Color

- Forest `#0D4F47`: primary brand color; use boldly for primary branded
  surfaces and actions.
- Cream `#F6F6EE`: primary page background; do not replace it with pure white
  as the general storefront canvas.
- Mustard `#D4A737`: accent only; keep it to approximately 5% or less of a
  composition. Do not use it as a large background or as small text when
  contrast is insufficient.
- Ink `#344054`: regular text.
- Strong ink `#101828`: headings and high-emphasis text.
- Do not introduce additional brand colors or hard-coded near-duplicates
  without confirmation.
- Use semantic roles and active Shopify color schemes where they already work.
  Do not hard-code colors that make a visible Theme Editor control ineffective.

### Typography

- Use Hanken Grotesk only.
- Use bold or extrabold headings with negative letter-spacing.
- Use `16px` size and `1.55` line-height for body copy.
- Do not introduce another typeface or arbitrary type scale.

### Spacing

- Use a `4px` base unit.
- Use generous desktop section padding in the `64–96px` range.
- Do not invent arbitrary off-scale spacing.
- Mobile spacing, layout grids, and component-specific dimensions remain
  undefined unless explicitly confirmed later.

### Shape

- Use rounded corners in the `12–20px` range.
- Reserve pill shapes for chips, badges, and calls to action.
- Do not introduce sharp, decorative, or arbitrary radii.

### Shadows

- Use forest-tinted shadows, never neutral gray shadows.
- Use the elevation names `sm`, `md`, `lg`, and `xl`.
- Exact shadow recipes and component assignments are not yet confirmed. Reuse
  a confirmed token when one exists; otherwise do not invent a permanent
  recipe.

### Icons

- Use Lucide icons.
- Use a `1.75px` stroke and a `24×24px` default canvas.
- Keep icon treatment consistent and provide accessible names for icon-only
  controls.

### Voice

- Address the customer in the second person.
- Use sentence case.
- Do not use exclamation marks.
- Do not use emoji in interface copy.
- Do not make claims that inventory, fulfilment, pricing, or Shopify data
  cannot support.

### Motion

- Use ease-out motion between `120–360ms`.
- Do not use bounce effects.
- Respect reduced-motion preferences.
- Exact durations by component remain undefined; do not create a new motion
  convention without confirmation.

## Non-negotiable safety

- Preserve Dawn custom elements, IDs, classes, `data-*` attributes, live
  regions, section replacement targets, and JavaScript hooks required for
  storefront behavior.
- Preserve Shopify-calculated prices, discounts, availability, variants,
  selling plans, quantity rules, unit prices, cart state, and checkout
  behavior.
- Keep controls keyboard accessible, focus visible, contrast readable, and
  touch targets usable.
- Do not ship a control that appears configurable or actionable but has no
  effect.
- Do not simulate products, availability, offers, destinations, or catalogue
  variety with misleading placeholders.
- Hide an unfinished or empty merchandising surface when leaving it visible
  would mislead customers or testers.

## Working method

1. Read this skill before Ayira storefront design work.
2. Inspect theme code only to understand behavior and measure conformance with
   these confirmed rules.
3. Separate functional defects from undefined design decisions.
4. Fix shared foundations before repeating local overrides.
5. Preserve Dawn and Shopify contracts while changing presentation.
6. Validate the affected responsive, keyboard, focus, reduced-motion, empty,
   loading, success, error, and disabled states.
7. Run Theme Check and relevant syntax, JSON, and diff checks after code
   changes.
8. Add a new rule to this skill only after the owner confirms it as a durable
   Ayira decision.

## Undefined means undefined

This skill does not yet prescribe complete component anatomy, page
composition, breakpoints, grid dimensions, type scales, state colors, Theme
Editor setting matrices, imagery direction, or detailed responsive behavior.

Do not fill those gaps from preference, generic best practices, screenshots,
legacy theme code, or temporary migration work. Suggest options when useful,
but obtain confirmation before treating any option as Ayira's system.
