# Product

## Register

product

## Users

Men who care about how they dress — professionals, creatives, tradespeople, and style-conscious individuals who want clothing that fits their life, not just their measurements. They shop with intent: replacing a worn blazer, building a capsule wardrobe, finding gear that lasts. They value quality over quantity, fit over trends, and they want the confidence of knowing a piece works before it arrives.

Context: Mobile-first, often browsing between tasks. They expect speed, clarity, and zero friction. They've been burned by "true to size" lies and want proof — visual and dimensional — before committing.

Job to be done: "Help me find the right garment, in the right size, that looks right on me — without the hassle of returns."

## Product Purpose

A men's fashion e-commerce platform that eliminates the guesswork of online clothing shopping through:

1. **Curated catalog** — outerwear, formal, casual, workwear, headwear, footwear, accessories — organized by how men actually dress (occasion + function), not arbitrary categories
2. **AI virtual fitting room** — upload one photo, try on any garment instantly (upper-body MVP, full-body roadmap). See fit, drape, proportion on *your* body, not a model's.
3. **Precision sizing** — user-managed measurement profile + size charts + recommendation engine that learns from purchases and returns
4. **Commerce that gets out of the way** — fast, mobile-native, Stripe-powered, Medusa-backed headless architecture

Success looks like: <15% return rate (vs 30-40% industry), >3 min session duration, repeat purchase within 60 days, users trusting the "Try On" result enough to buy without hesitation.

## Brand Personality

**Confident, Refined, Bold** — the quiet authority of a well-cut suit, the edge of a perfectly worn leather jacket. Not loud, not generic. Masculine without toxicity. Elegant without pretension. Utilitarian without being purely functional. The brand speaks to men who know quality when they see it and don't need to be told.

Voice: Direct, knowledgeable, respectful. No marketing fluff. "This jacket uses 14oz Japanese selvedge denim. It will fade uniquely to you." Not "Elevate your denim game."

Emotional goals: Confidence (I know this fits), Satisfaction (this was worth it), Loyalty (they get me).

## Anti-references

- Generic Shopify/BigCommerce templates — cookie-cutter grids, interchangeable product cards, zero brand voice
- Over-designed fashion editorials — style over substance, confusing navigation, unshoppable beauty
- Amazon-style utilitarian density — pure function, no soul, overwhelming choice paralysis
- "Lifestyle" brands that paste the same aesthetic on everything — performative masculinity, vague aspiration
- Sites that hide fit information — no measurements, no model specs, "true to size" as a substitute for data

## Design Principles

1. **Show, don't sell** — Let the garment speak. High-fidelity imagery, interactive try-on, precise measurements. The product *is* the marketing.
2. **Respect the user's intelligence** — No dark patterns, no fake urgency, no "only 2 left!" unless it's true. Men who buy quality hate being manipulated.
3. **Fit is the feature** — Every design decision serves the fitting room. If it doesn't help a man know "will this fit me?", it doesn't ship.
4. **Craft over trend** — Timeless patterns, durable materials, honest construction. The UI mirrors the product: built to last, not built to impress on launch day.
5. **Mobile is not an afterthought** — Thumb-first navigation, bottom tab bar, touch targets ≥44px, progressive image loading. The primary experience is one-handed.

## Accessibility & Inclusion

- **WCAG 2.1 AA baseline** — All text ≥4.5:1 contrast, keyboard-navigable, screen-reader semantic HTML, focus indicators visible, reduced-motion alternatives for all animations
- **AAA for critical paths** — Checkout forms, size selection, measurement inputs, error states meet 7:1 contrast where feasible
- **Inclusive sizing language** — No "standard/plus" labels. Measurements in cm/in. Fit descriptors (slim/regular/relaxed/oversized) tied to data, not demographics
- **Color-blind safe palette** — Primary actions distinguishable without color alone (icon + weight + position)
- **Reduced motion** — All transitions/animations have `prefers-reduced-motion: reduce` fallback (instant or crossfade)