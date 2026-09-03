# Design

## Palette (OKLCH)

```css
:root {
  /* Brand seed: oklch(0.750 0.080 170.0) — sea-glass teal, weathered mineral */
  
  /* ── Color Strategy: COMMITTED (30–60% surface) ── */
  /* Primary carries the brand. BG stays pure. */

  /* Background — pure white. The brand lives in primary, not the surface. */
  --color-bg:         oklch(1.000 0.000 0);
  --color-bg-elevated: oklch(0.985 0.000 0);   /* subtle elevation for modals */

  /* Surface — bg pulled 8% toward ink. Cards, panels, dropdowns. */
  --color-surface:    oklch(0.985 0.002 170);
  --color-surface-hover: oklch(0.970 0.003 170);

  /* Ink — body text. Near-black with 3% brand hue tint for warmth. */
  --color-ink:        oklch(0.120 0.008 170);
  --color-ink-strong: oklch(0.060 0.005 170); /* headings */

  /* Primary — deep petrol teal. Authoritative, refined, unexpected for menswear. */
  /* L=0.38 C=0.115 — sits in "dark text on saturated fill = white text" zone */
  --color-primary:    oklch(0.380 0.115 170);
  --color-primary-hover: oklch(0.320 0.120 170);
  --color-primary-active: oklch(0.280 0.110 170);
  --color-primary-light:  oklch(0.920 0.035 170); /* for badges, tags, light fills */

  /* Accent — warm brass. Complementary warmth, distinct in hue AND lightness. */
  /* L=0.58 C=0.125 — readable white text on filled badges */
  --color-accent:     oklch(0.580 0.125 65);
  --color-accent-hover: oklch(0.520 0.130 65);
  --color-accent-light: oklch(0.930 0.040 65);

  /* Muted — ink pulled 40% toward bg. Secondary text, placeholders, dividers. */
  --color-muted:      oklch(0.480 0.005 170);
  --color-muted-strong: oklch(0.380 0.006 170);

  /* Border — subtle, surface-adjacent */
  --color-border:     oklch(0.900 0.003 170);
  --color-border-strong: oklch(0.820 0.005 170);

  /* Semantic — derived from palette */
  --color-success:    oklch(0.480 0.110 145);
  --color-warning:    oklch(0.620 0.140 75);
  --color-error:      oklch(0.520 0.180 25);
  --color-info:       oklch(0.520 0.130 220);

  /* Focus ring — primary at 60% opacity */
  --color-focus:      oklch(0.380 0.115 170 / 0.60);

  /* Overlay / backdrop */
  --color-overlay:    oklch(0.060 0.005 170 / 0.55);
}

/* Dark mode — pure near-black, primary brightens, accent holds */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:          oklch(0.055 0.000 0);
    --color-bg-elevated: oklch(0.085 0.000 0);
    --color-surface:     oklch(0.085 0.003 170);
    --color-surface-hover: oklch(0.110 0.004 170);
    --color-ink:         oklch(0.920 0.004 170);
    --color-ink-strong:  oklch(0.980 0.002 170);
    --color-primary:     oklch(0.620 0.130 170);
    --color-primary-hover: oklch(0.680 0.135 170);
    --color-primary-active: oklch(0.560 0.125 170);
    --color-primary-light: oklch(0.180 0.045 170);
    --color-accent:      oklch(0.640 0.135 65);
    --color-accent-hover: oklch(0.700 0.140 65);
    --color-accent-light: oklch(0.200 0.050 65);
    --color-muted:       oklch(0.620 0.004 170);
    --color-muted-strong: oklch(0.720 0.005 170);
    --color-border:      oklch(0.180 0.004 170);
    --color-border-strong: oklch(0.250 0.006 170);
    --color-focus:       oklch(0.620 0.130 170 / 0.60);
    --color-overlay:     oklch(0.000 0.000 0 / 0.70);
  }
}
```

## Typography

```css
:root {
  /* Display: Didot — high-contrast serif for headlines, hero, editorial moments */
  --font-display: 'Didot', 'Bodoni Moda', Georgia, serif;
  --font-display-weight: 400; /* Didot is naturally high contrast; 400 = regular */
  --font-display-weight-bold: 700;

  /* UI / Body: Suisse Intl — Swiss precision, multiple widths, authoritative */
  --font-ui: 'Suisse Intl', 'IBM Plex Sans', system-ui, sans-serif;
  --font-ui-weight: 400;
  --font-ui-weight-medium: 500;
  --font-ui-weight-semibold: 600;
  --font-ui-weight-bold: 700;

  /* Mono: for prices, specs, codes, technical details */
  --font-mono: 'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace;
  --font-mono-weight: 400;
  --font-mono-weight-medium: 500;

  /* Fluid type scale (clamp) — caps at 6rem max per guidance */
  --text-xs:      clamp(0.70rem, 0.68rem + 0.10vw, 0.75rem);   /* 11.2–12px */
  --text-sm:      clamp(0.82rem, 0.78rem + 0.20vw, 0.875rem);  /* 13–14px */
  --text-base:    clamp(0.95rem, 0.88rem + 0.35vw, 1.05rem);   /* 15.2–16.8px */
  --text-lg:      clamp(1.10rem, 1.00rem + 0.50vw, 1.25rem);   /* 17.6–20px */
  --text-xl:      clamp(1.30rem, 1.15rem + 0.75vw, 1.55rem);   /* 20.8–24.8px */
  --text-2xl:     clamp(1.55rem, 1.35rem + 1.00vw, 1.95rem);   /* 24.8–31.2px */
  --text-3xl:     clamp(1.90rem, 1.60rem + 1.50vw, 2.50rem);   /* 30.4–40px */
  --text-4xl:     clamp(2.35rem, 1.90rem + 2.25vw, 3.20rem);   /* 37.6–51.2px */
  --text-5xl:     clamp(3.00rem, 2.30rem + 3.50vw, 4.50rem);   /* 48–72px */
  --text-6xl:     clamp(3.80rem, 2.80rem + 5.00vw, 6.00rem);   /* 60.8–96px max */

  /* Line heights */
  --leading-tight:   1.10;
  --leading-snug:    1.25;
  --leading-normal:  1.50;
  --leading-relaxed: 1.65;

  /* Letter spacing */
  --tracking-tight:  -0.02em;
  --tracking-normal:  0.00em;
  --tracking-wide:    0.03em;
  --tracking-wider:   0.08em; /* for uppercase labels */

  /* Text wrap */
  --text-wrap-balance: balance;
  ---text-wrap-pretty: pretty;
}
```

### Usage Rules

| Role | Font | Weight | Size | Line Height | Letter Space | Wrap |
|------|------|--------|------|-------------|--------------|------|
| Hero / H1 | Didot | 400/700 | 5xl/6xl | tight | tight | balance |
| H2 | Didot | 400 | 4xl | tight | tight | balance |
| H3 | Didot | 400 | 3xl | snug | normal | balance |
| H4 | Suisse Intl | 600 | 2xl | snug | normal | - |
| Body large | Suisse Intl | 400 | lg | relaxed | normal | pretty |
| Body | Suisse Intl | 400 | base | relaxed | normal | pretty |
| Body small | Suisse Intl | 400 | sm | normal | normal | - |
| Caption / Label | Suisse Intl | 500 | xs | normal | wider | - |
| Price / Spec | IBM Plex Mono | 500 | base | snug | normal | - |
| Button | Suisse Intl | 600 | sm | normal | normal | - |
| Nav / Tab | Suisse Intl | 500 | sm | normal | wider | - |

## Spacing & Layout

```css
:root {
  /* Base unit: 4px. All spacing multiples of 4. */
  --space-1:   0.25rem;  /* 4px  */
  --space-2:   0.50rem;  /* 8px  */
  --space-3:   0.75rem;  /* 12px */
  --space-4:   1.00rem;  /* 16px */
  --space-5:   1.25rem;  /* 20px */
  --space-6:   1.50rem;  /* 24px */
  --space-7:   1.75rem;  /* 28px */
  --space-8:   2.00rem;  /* 32px */
  --space-10:  2.50rem;  /* 40px */
  --space-12:  3.00rem;  /* 48px */
  --space-16:  4.00rem;  /* 64px */
  --space-20:  5.00rem;  /* 80px */
  --space-24:  6.00rem;  /* 96px */
  --space-32:  8.00rem;  /* 128px */

  /* Semantic spacing */
  --space-section:      var(--space-16);  /* between major sections */
  --space-component:    var(--space-8);   /* between components */
  --space-element:      var(--space-4);   /* between elements */
  --space-inline:       var(--space-2);   /* inline gaps */
  --space-touch-target: var(--space-11);  /* 44px minimum */

  /* Container max widths */
  --container-sm:   640px;   /* article, form */
  --container-md:   896px;   /* content */
  --container-lg:   1152px;  /* page */
  --container-xl:   1344px;  /* wide */
  --container-full: 100%;

  /* Grid */
  --grid-cols-mobile:  2;
  --grid-cols-tablet:  3;
  --grid-cols-desktop: 4;
  --grid-cols-wide:    5;
  --grid-gap:          var(--space-4);

  /* Border radius */
  --radius-none:   0;
  --radius-sm:     0.25rem;  /* 4px  */
  --radius-md:     0.50rem;  /* 8px  */
  --radius-lg:     0.75rem;  /* 12px */
  --radius-xl:     1.00rem;  /* 16px */
  --radius-2xl:    1.50rem;  /* 24px */
  --radius-full:   9999px;

  /* Semantic radius */
  --radius-button:   var(--radius-md);
  --radius-card:     var(--radius-lg);
  --radius-input:    var(--radius-md);
  --radius-badge:    var(--radius-full);
  --radius-modal:    var(--radius-xl);
  --radius-image:    var(--radius-md);
}
```

### Responsive Breakpoints (Mobile-First)

```css
:root {
  --bp-xs:   375px;  /* iPhone SE */
  --bp-sm:   640px;  /* large phones */
  --bp-md:   768px;  /* tablets */
  --bp-lg:   1024px; /* laptops */
  --bp-xl:   1280px; /* desktops */
  --bp-2xl:  1536px; /* large desktops */
}

/* Media queries */
@media (min-width: 375px)  { /* xs */ }
@media (min-width: 640px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

## Motion

```css
:root {
  /* Durations */
  --duration-instant:   0ms;
  --duration-fast:      120ms;  /* micro-interactions */
  --duration-base:      200ms;  /* standard transitions */
  --duration-smooth:    300ms;  /* modals, drawers, page transitions */
  --duration-expressive: 500ms; /* hero reveals, scroll-driven */

  /* Easings — exponential out, no bounce */
  --ease-out-quart:    cubic-bezier(0.25, 1, 0.50, 1);
  --ease-out-quint:    cubic-bezier(0.23, 1, 0.32, 1);
  --ease-out-expo:     cubic-bezier(0.19, 1, 0.22, 1);
  --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-spring:       cubic-bezier(0.34, 1.56, 0.64, 1); /* subtle overshoot for delight */

  /* Reduced motion — instant or crossfade only */
  @media (prefers-reduced-motion: reduce) {
    :root {
      --duration-fast:       0ms;
      --duration-base:       0ms;
      --duration-smooth:     0ms;
      --duration-expressive: 0ms;
    }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

### Motion Choreography

| Trigger | Motion | Duration | Easing | Reduced Motion |
|---------|--------|----------|--------|----------------|
| Button press | scale(0.97) | fast | out-quart | instant |
| Button hover | translateY(-1px) + shadow | base | out-quint | instant |
| Card hover | translateY(-4px) + shadow | smooth | out-expo | instant |
| Modal open | fade + scale(0.96→1) | smooth | out-expo | crossfade |
| Drawer slide | translateX(100%→0) | smooth | out-expo | instant |
| Page transition | fade + translateY(8px→0) | smooth | out-quart | crossfade |
| Try-on loading | pulse ring + shimmer | expressive | linear | static spinner |
| Scroll reveal | fade + translateY(16px→0) | expressive | out-quint | instant |
| Stagger (list) | 60ms delay per item | base | out-quart | instant |

## Components

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-normal);
  border-radius: var(--radius-button);
  padding: var(--space-3) var(--space-6);
  min-height: var(--space-touch-target);
  min-width: var(--space-touch-target);
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-out-quart),
              box-shadow var(--duration-fast) var(--ease-out-quart),
              background-color var(--duration-fast) var(--ease-out-quart),
              border-color var(--duration-fast) var(--ease-out-quart);
}

.btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-focus);
}

.btn:active { transform: scale(0.97); }

/* Primary — filled primary, white text */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg);
  border: 2px solid var(--color-primary);
}
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-primary:active { background: var(--color-primary-active); }

/* Secondary — outline primary */
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}
.btn-secondary:hover { background: var(--color-primary-light); }

/* Ghost — no border, ink text */
.btn-ghost {
  background: transparent;
  color: var(--color-ink);
  border: 2px solid transparent;
}
.btn-ghost:hover { background: var(--color-surface-hover); }

/* Accent — for CTAs that need warmth (wishlist, try-on) */
.btn-accent {
  background: var(--color-accent);
  color: var(--color-bg);
  border: 2px solid var(--color-accent);
}
.btn-accent:hover { background: var(--color-accent-hover); }

/* Sizes */
.btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--text-xs); }
.btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--text-base); }
```

### Form Inputs

```css
.input {
  display: block;
  width: 100%;
  font-family: var(--font-ui);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-ink);
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-input);
  padding: var(--space-3) var(--space-4);
  min-height: var(--space-touch-target);
  transition: border-color var(--duration-fast) var(--ease-out-quart),
              box-shadow var(--duration-fast) var(--ease-out-quart);
}

.input::placeholder { color: var(--color-muted); }

.input:hover { border-color: var(--color-border-strong); }

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-error {
  border-color: var(--color-error);
}
.input-error:focus { box-shadow: 0 0 0 3px oklch(0.520 0.180 25 / 0.30); }
```

### Product Card

```css
.product-card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  overflow: hidden;
  transition: transform var(--duration-smooth) var(--ease-out-expo),
              box-shadow var(--duration-smooth) var(--ease-out-expo),
              border-color var(--duration-base) var(--ease-out-quart);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px oklch(0.120 0.008 170 / 0.25);
  border-color: var(--color-border-strong);
}

.product-card__image {
  aspect-ratio: 3 / 4;
  width: 100%;
  object-fit: cover;
  background: var(--color-surface-hover);
}

.product-card__content {
  padding: var(--space-4);
  display: grid;
  gap: var(--space-1);
}

.product-card__category {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-muted);
}

.product-card__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: var(--leading-snug);
  color: var(--color-ink);
  text-wrap: balance;
}

.product-card__price {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-ink-strong);
}

.product-card__actions {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}
```

### Navigation (Mobile Bottom Tab Bar)

```css
.nav-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  padding: var(--space-2) var(--space-1) env(safe-area-inset-bottom);
  box-shadow: 0 -4px 20px -8px var(--color-overlay);
}

.nav-bottom__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1);
  min-height: var(--space-touch-target);
  color: var(--color-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out-quart);
}

.nav-bottom__item:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-focus);
}

.nav-bottom__item--active {
  color: var(--color-primary);
}

.nav-bottom__icon { width: 24px; height: 24px; }
.nav-bottom__label { font-family: var(--font-ui); font-size: var(--text-xs); font-weight: 500; letter-spacing: var(--tracking-wide); }
```

### Try-On Modal

```css
.tryon-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: var(--color-overlay);
  backdrop-filter: blur(8px);
}

.tryon-modal__panel {
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  background: var(--color-bg);
  border-radius: var(--radius-modal);
  border: 1px solid var(--color-border);
  box-shadow: 0 25px 50px -12px var(--color-overlay);
  overflow: hidden;
  animation: modalIn var(--duration-smooth) var(--ease-out-expo);
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.tryon-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-border);
}

.tryon-modal__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 400;
  color: var(--color-ink-strong);
}

.tryon-modal__close {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full);
  background: transparent; border: none;
  color: var(--color-muted);
  cursor: pointer;
}
.tryon-modal__close:hover { background: var(--color-surface-hover); color: var(--color-ink); }

.tryon-modal__image {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: contain;
  background: var(--color-surface);
}

.tryon-modal__actions {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-top: 1px solid var(--color-border);
}
```

### Z-Index Scale

```css
:root {
  --z-dropdown:     100;  /* select menus, popovers */
  --z-sticky:       200;  /* sticky headers, nav */
  --z-drawer:       300;  /* side drawers, mobile nav */
  --z-modal-backdrop: 400; /* modal overlay */
  --z-modal:        500;  /* modal panel */
  --z-toast:        600;  /* toasts, notifications */
  --z-tooltip:      700;  /* tooltips, hover cards */
}
```

## Imagery & Media

```css
:root {
  /* Cloudinary transformations */
  --img-quality:      auto;
  --img-format:       auto;
  --img-product-card:  w_400,h_533,c_fill,q_auto,f_auto;
  --img-product-detail: w_800,h_1066,c_fill,q_auto,f_auto;
  --img-tryon-input:   w_768,h_1024,c_fill,q_auto,f_auto;
  --img-hero:          w_1920,q_auto,f_auto;
  --img-avatar:        w_128,h_128,c_fill,g_face,q_auto,f_auto;
}

/* Image loading */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

img[data-src] {
  opacity: 0;
  transition: opacity var(--duration-base) var(--ease-out-quart);
}
img.loaded { opacity: 1; }

/* Product gallery */
.product-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.product-gallery__main {
  aspect-ratio: 3 / 4;
  width: 100%;
  object-fit: cover;
  border-radius: var(--radius-image);
}

.product-gallery__thumbs {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding: var(--space-1) 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.product-gallery__thumb {
  flex: 0 0 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 2px solid transparent;
  cursor: pointer;
  scroll-snap-align: start;
  transition: border-color var(--duration-fast) var(--ease-out-quart);
}
.product-gallery__thumb--active { border-color: var(--color-primary); }
```

## Accessibility Checklist

- [ ] All text meets ≥4.5:1 contrast (body), ≥3:1 (large text), ≥7:1 (critical paths)
- [ ] Focus indicators visible on all interactive elements (3px primary ring)
- [ ] Touch targets ≥44×44px (min-height on buttons, inputs, nav items)
- [ ] Semantic HTML: header, nav, main, section, article, aside, footer
- [ ] Heading hierarchy: h1 → h2 → h3 (no skips)
- [ ] Alt text on all images (descriptive, not "image of")
- [ ] ARIA labels on icon-only buttons, status indicators
- [ ] Reduced motion: all animations have 0ms fallback
- [ ] Color-blind safe: primary actions distinguishable without color alone
- [ ] Form labels associated (label[for] / aria-labelledby)
- [ ] Error messages linked to inputs (aria-describedby)
- [ ] Skip link at top of page
- [ ] Language declared (lang="en")

## References & Mood

**Primary reference:** Filson — rugged authenticity, utilitarian honesty, heritage without nostalgia. The "black suits men" energy: authoritative, timeless, unpretentious.

**Color mood:** "Midnight brass in a heritage workshop — deep petrol teal walls, warm brass fixtures, the smell of waxed canvas and leather. Refined utility."

**Typography mood:** Didot's editorial elegance (the fashion authority) + Suisse Intl's Swiss precision (the engineering honesty). Together: "A Savile Row tailor who also builds furniture."

**Motion mood:** Expressive but never gratuitous. The weight of a heavy coat settling on shoulders. The smooth draw of a brass zipper. Signature moments: try-on reveal, page transitions that feel like turning pages in a lookbook.

---

*Generated from PRODUCT.md + user interview + palette seed (oklch 0.750 0.080 170). Strategy: Committed.*