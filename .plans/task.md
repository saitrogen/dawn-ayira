# living task
roadmap: 
step 1:
- [ ] tokens
- [ ] typography
- [ ] buttons
- [ ] announcement bar
- [ ] header

Step 1 — Foundation System

Goal:
Make stock Dawn visually become “Ayira” before custom components.

1. Tokens System
File setup
assets/
  ayira-tokens.css
  ayira-base.css
  ayira-components.css
Checklist

[ ]Color tokens
- [ ]Define brand palette
- [ ]Define semantic aliases
- [ ]Define surface hierarchy
- [ ]Define text hierarchy
- [ ]Define border colors
- [ ]Define state colors

[ ]Typography tokens
- [ ]Font families
- [ ]Font weights
- [ ]Font scale
- [ ]Line heights
- [ ]Letter spacing

[ ]Layout tokens
- [ ]Spacing scale
- [ ]Radius scale
- [ ]Shadow scale
- [ ]Container width
- [ ]Transition durations
[ ]Responsive tokens
- [ ]Mobile spacing adjustments
- [ ]Fluid typography
- [ ]Breakpoint strategy

[ ]Integration
- [ ]Load CSS in theme.liquid
- [ ] Ensure token files load before Dawn CSS overrides
- [ ] Remove duplicate hardcoded values

2. Typography System

Goal:
Entire store immediately feel premium/minimal.

Checklist
Base typography
- [ ] Set body font
- [ ] Set heading font
- [ ] Set body background
- [ ] Set default text color
Heading system
- [ ] Style h1
- [ ] Style h2
- [ ] Style h3
- [ ] Style h4
- [ ] Define heading spacing
Body text
- [ ] Paragraph spacing
- [ ] Muted text color
- [ ] Caption styles
- [ ] Link styles
Shopify/Dawn overrides
[ ] Override .h0
[ ] Override .h1
[ ] Override .h2
[ ] Override .h3
[ ] Override .caption
[ ] Override .subtitle
Responsive typography
[ ] Mobile heading sizes
[ ] Mobile line-height tuning
[ ] Prevent overflow
Polish
[ ] Improve text rendering
[ ] Consistent letter spacing
[ ] Consistent vertical rhythm

3. Buttons System

Goal:
One reusable button language everywhere.

Checklist
[ ] Base button
  [ ] Pill radius
  [ ] Consistent height
  [ ] Font weight
  [ ] Hover transition
  [ ] Focus state
Variants
[ ] Primary button
[ ] Secondary button
[ ] Ghost button
[ ] Text button
[ ] Icon button
States
[ ] Hover
[ ] Active
[ ] Disabled
[ ] Loading
[ ] Focus-visible
Shopify integration
[ ] Override .button
[ ] Override .button--secondary
[ ] Override cart buttons
[ ] Override quantity buttons
Accessibility
[ ] Keyboard focus visible
[ ] Contrast ratio check
[ ] Reduced motion support