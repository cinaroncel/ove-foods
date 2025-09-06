# TODO — OVE Foods Website (Pompeian‑Inspired)

> Master backlog and sprint checklist. Pair with the PRD on the other canvas.

## 0) Project Setup

* [ ] Create Git repo `ovefoods-web` (Next.js App Router + TS)
* [ ] Add Tailwind + shadcn/ui baseline
* [ ] Install tooling: ESLint, Prettier, Husky (pre-commit), Vitest, Playwright, Sentry
* [ ] Configure CI: typecheck, unit tests, Playwright smoke, Lighthouse CI
* [ ] Set up Vercel: preview → staging → production projects

## 1) Content & Brand Inputs

* [ ] Confirm brand palette + typography (distinct from Pompeian)
* [ ] Deliver initial product list (SKUs, categories)
* [ ] Provide first 6–10 recipes (with images)
* [ ] Gather contact/location details (validated)
* [ ] Sustainability/story copy draft (optional v1)

## 2) Design System

* [ ] Tokens: colors, spacing, radii, shadows, typography scale
* [ ] Components: Nav, MegaMenu, Hero, ProductCard, ProductGrid, RecipeCard, Filters, Timeline, StatBadge, ContactBlock, Footer
* [ ] States & A11y: focus-visible, keyboard flows, contrast, skip link

## 3) Pages & Routes

* [ ] Home (`/`) — hero, featured products, recipes teaser, story teaser, sustainability stats, CTA strip
* [ ] Products (`/products`) — grid + filters
* [ ] Product detail (`/products/[slug]`) — gallery, specs, related recipes, retailer links
* [ ] Recipes (`/recipes`) — list + filters (tags, product), text search (debounced)
* [ ] Recipe detail (`/recipes/[slug]`) — ingredients, steps, times, related products
* [ ] Our Story (`/our-story`) — timeline modules
* [ ] Sustainability (`/sustainability`) — pillars, certifications, goals
* [ ] Where to Buy (`/where-to-buy`) — retailers + outbound links (optional region filter)
* [ ] Contact (`/contact`) — addresses, map, form (spam-protected)
* [ ] Legal (`/legal/privacy`, `/legal/terms`), cookie preferences

## 4) CMS & Data

* [ ] Choose CMS (Sanity / Contentful / Payload)
* [ ] Implement schemas (Category, Product, Recipe, StoryPost, SustainabilityPost, Location, Page)
* [ ] Seed initial content (10+ products, 6+ recipes)
* [ ] Previews (products & recipes)
* [ ] Authoring validations (alt text, SEO fields)

## 5) Search & Filters

* [ ] Client-side search (Fuse.js) for recipes/products
* [ ] URL query params for filters
* [ ] Pagination or lazy load for grids

## 6) SEO & Analytics

* [ ] Meta titles/descriptions per route
* [ ] OpenGraph/Twitter images
* [ ] `robots.txt` + `sitemap.xml`
* [ ] JSON-LD: Organization, Product, Recipe, BreadcrumbList
* [ ] Analytics events (see SEO\_QA.md)

## 7) Performance & A11y

* [ ] LCP image ≤ 200KB; responsive `next/image`
* [ ] Defer non-critical JS; preconnect fonts
* [ ] CLS ≤ 0.1; lazy load below fold
* [ ] WCAG 2.2 AA; keyboard-only nav passes

## 8) Testing

* [ ] Unit tests for components (Vitest)
* [ ] Playwright: home load, product page, recipe filters, contact form
* [ ] Lighthouse CI thresholds (Perf ≥ 90, A11y ≥ 95, SEO ≥ 90)

## 9) Deploy & Handover

* [ ] Staging review checklist complete
* [ ] Redirects from old paths validated
* [ ] Editor training (CMS how-to)
* [ ] Post-launch monitoring (Sentry, analytics dashboards)

---

## Sprint Plan (2‑Week)

**D1–2** Setup + tokens + core components
**D3–4** Home + Products grid
**D5–6** Product detail + JSON‑LD
**D7–8** Recipes list + filters + detail
**D9** Story/Sustainability stubs
**D10** Contact/Where to Buy + form
**D11** SEO/A11y/Perf pass
**D12** Tests & CI, analytics events
**D13–14** Content entry, QA, launch

---

## Roles

* **PM/Owner:** Yiğit
* **FE:** TBD
* **Design:** TBD
* **Content:** TBD
* **QA:** TBD
