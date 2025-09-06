# OVE Foods Website — Product Requirements Document (PRD)

**Version:** 1.0
**Date:** 2025-09-04
**Owner:** Yiğit / Web Team
**Reviewer(s):** Brand, Marketing, Ops
**Code Owners:** Frontend (Next.js), Design (UI/UX), Content (CMS)

> This PRD defines the scope for redesigning the OVE Foods website, *inspired by but not copying* the structure and flow of pompeian.com. All copy, imagery, and visual identity will be original to OVE Foods.

---

## 1) Summary & Objectives

**Goal:** Ship a modern, fast, and SEO-friendly OVE Foods website showcasing products, recipes, and brand story; enable editors to publish easily; improve conversions for "Where to Buy" and newsletter signups.

**Primary Outcomes (KPIs):**

* +60% organic sessions within 90 days post-launch (baseline: current 30-day average).
* ≥ 2.5% click-through to "Where to Buy / Retail links".
* ≥ 1.5% newsletter signup rate on /recipes and /blog pages.
* Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 90 on key templates.

**Secondary Outcomes:** Lower content ops overhead (≤10 min to create product/recipe); improved brand trust (time on site, return visits).

**Non-Goals:**

* No direct e‑commerce/checkout in v1 (link out to retailers/marketplaces).
* No complex PIM/ERP integrations in v1 (static CMS content + manual updates).

---

## 2) Audience & Personas

1. **Home Cooks (Consumer):** seeks quality oils/vinegars; wants recipes and tips; buys at retail.
2. **Retail Buyers (B2B):** wants quick product spec sheets, certifications, case sizes, contact.
3. **Foodservice / HoReCa:** similar to B2B; needs bulk SKUs, stability, shelf-life.
4. **Press/Influencers:** needs assets, brand story, contact.

---

## 3) Information Architecture (IA)

**Global Nav:** Products · Recipes · Our Story · Sustainability · Community/News · Contact / Where to Buy

**Sitemap (v1):**

* `/` Home
* `/products` (grid by category)

  * `/products/[slug]` product detail
  * `/categories/[slug]` category listing (optional v1)
* `/recipes` (list + filters)

  * `/recipes/[slug]` recipe detail
* `/our-story`
* `/sustainability`
* `/community` (news/blog/press)
* `/where-to-buy`
* `/contact` (carry over validated info from current site)
* `/legal/privacy` · `/legal/terms` · Cookie Preferences

**Footer:** navigation, social links, certifications/badges, newsletter, privacy/terms.

---

## 4) Functional Requirements (by area)

### 4.1 Global

* **Header/Nav:** sticky; keyboard-accessible dropdown/mega menu.
* **Search:** site search across products & recipes (client-side fuzzy in v1; server index later).
* **Where to Buy:** retailers list + outbound links; optional map (static for v1).
* **Newsletter:** email capture (Mailchimp or simple webhook).
* **Language:** EN in v1; TR optional (see §8 for i18n).

### 4.2 Home Page

* **Hero:** headline + subcopy + CTA ("Explore Products" / "Find a Recipe"); responsive hero image.
* **Featured Products:** 4–8 product cards (from CMS).
* **Recipes Teaser:** 3–6 cards; tags visible.
* **Our Story Teaser:** timeline snippet.
* **Sustainability Highlights:** 3 stat tiles + certifications (icons).
* **CTA strip:** "Where to Buy" + newsletter sign-up.

### 4.3 Products

* **Products Grid:** filter by category (e.g., olive oils, vinegars, sprays), tag chips (e.g., "extra virgin", "organic").
* **Product Detail:** title, gallery, short copy, long copy, key specs, nutrition (optional), certifications, awards, related recipes, retailer links.
* **Schema.org:** `Product` + `AggregateRating` (when applicable).

### 4.4 Recipes

* **List:** cards with quick filters (product, category, diet tags, difficulty); text search with debounce.
* **Detail:** hero image, ingredients (quantities + units), steps (numbered), prep/cook time, servings, nutrition (optional), related products.
* **Schema.org:** `Recipe` (JSON‑LD).

### 4.5 Our Story

* **Timeline:** milestones modules; founders, heritage, sourcing regions (no copying external content).
* **Media:** photography slots + pull quotes.

### 4.6 Sustainability

* **Pillars:** e.g., sourcing, environment, community.
* **Certifications:** badges (e.g., organic, non‑GMO; TBD).
* **Goals & Progress:** counters/metrics; link to PDFs if any.

### 4.7 Community/News (optional in v1)

* **Posts:** basic blog with tags; press mentions; events.

### 4.8 Contact / Where to Buy

* **Contact Page:** address(es), map, email, phone; simple contact form with spam protection.
* **Where to Buy:** retailer list with outbound links; optional country/region filter.

---

## 5) Non‑Functional Requirements

**Performance:**

* LCP ≤ 2.5s (75th percentile), CLS ≤ 0.1, TBT ≤ 200ms on 4G/low-end device.
* Use `next/image`, AVIF/WebP, responsive sizes; lazy loading below the fold.

**Accessibility:**

* WCAG 2.2 AA; focus states; skip-to-content; semantic headings; alt text required in CMS.

**SEO:**

* Per‑page titles/descriptions; OG/Twitter images; canonical URLs; `robots.txt`; `sitemap.xml`.
* JSON‑LD for `Organization`, `Product`, `Recipe`, `BreadcrumbList`.

**Security & Privacy:**

* Cookie consent banner; privacy & terms; form spam protection (honeypot + rate‑limit + captcha).
* GDPR/KVKK aligned data handling for contact/newsletter.

**Analytics & Observability:**

* GA4 (or Vercel Analytics) + events (see §12).
* Sentry for frontend error tracking.

**Scalability:**

* Static generation (ISR) for most routes; dynamic for search if needed.

---

## 6) Tech Stack

* **Framework:** Next.js (App Router) + TypeScript.
* **Styling:** Tailwind CSS + CSS variables for tokens; shadcn/ui for base components.
* **CMS:** Sanity / Contentful / Payload (choose one; see §7 schema).
* **Hosting:** Vercel.
* **Forms:** API route → Mail provider (e.g., SendGrid) or Mailchimp.
* **Search:** client-side fuse.js in v1 (upgrade path: Algolia).
* **Maps:** static map image (no heavy SDK in v1).

---

## 7) Content Model (CMS Schemas)

> Fields marked **REQ** are required. All entries must have slug, SEO fields, and preview image.

### 7.1 Category

* **name** (REQ)
* **slug** (REQ)
* description
* heroImage
* order (int)

### 7.2 Product

* **title** (REQ)
* **slug** (REQ)
* **category** (REF Category, REQ)
* shortCopy (≤ 160 chars)
* longCopy (rich text)
* images\[] (1–6)
* specs: volume, variety, origin (TBD)
* nutrition (optional)
* certifications\[] (icons + labels)
* awards\[]
* relatedRecipes\[] (REF Recipe)
* retailerLinks\[] (label, URL)
* SEO (title, desc, OG)

### 7.3 Recipe

* **title** (REQ)
* **slug** (REQ)
* heroImage
* description (short)
* ingredients\[] { item, quantity, unit, notes }
* steps\[] (ordered rich text)
* time: prep, cook
* servings
* tags\[] (dietary, difficulty)
* relatedProducts\[]
* SEO

### 7.4 StoryPost / SustainabilityPost

* **title** (REQ), **slug** (REQ), coverImage, body\[], badges\[], SEO

### 7.5 Location

* **type** (HQ/Factory/Office)
* **name** (REQ)
* **address** (REQ)
* phone, email, hours
* map (lat, lng or static map url)

### 7.6 Page (Generic)

* **title** (REQ), **slug** (REQ), sections\[] (rich blocks), SEO

---

## 8) Internationalization (Optional v1)

* Strategy: default EN; optional TR locale.
* URL structure: `/[locale]/...` or domain mapping later.
* CMS: localized fields for text, images with language variants.

---

## 9) Editorial Workflow

* Draft → Preview → Publish (scheduled publish available).
* Required validations: alt text for images; SEO fields; related entities present.
* Content previews for Product and Recipe detail routes.

---

## 10) UX & Design Requirements

* **Look & Feel:** premium, culinary, warm light tones; avoid imitating another brand's colorway.
* **Grid:** 12‑col responsive; safe area padding 16–24px.
* **Components:** Nav, MegaMenu, Hero, ProductCard, ProductGrid, RecipeCard, Filters, Timeline, StatBadge, PressList, ContactBlock, Footer.
* **States:** hover, focus, active, disabled across components; skeleton loading for cards.

---

## 11) Migration & Redirects

* Validate any existing URLs; create 301 redirects where needed (e.g., `/contact` retained).
* Image assets renamed and optimized; no hotlinking from old site.

---

## 12) Analytics Tracking Plan (Events)

| Event                 | Trigger                    | Params                               |
| --------------------- | -------------------------- | ------------------------------------ |
| `view_product`        | Product detail visible     | `product_id`, `category`             |
| `click_retailer_link` | Outbound click on retailer | `product_id`, `retailer_name`, `url` |
| `search_site`         | User submits search        | `term`, `filters`                    |
| `filter_recipes`      | Filter changed             | `filter_name`, `value`               |
| `view_recipe`         | Recipe detail visible      | `recipe_id`, `tags`                  |
| `newsletter_submit`   | Form submit                | `source_page`                        |
| `contact_submit`      | Form submit                | `topic`                              |

---

## 13) Acceptance Criteria (Sample)

**Global Nav**

* *Given* keyboard-only user, *when* tabbing the header, *then* all menu items and dropdowns are reachable with visible focus and ESC closes menus.

**Home → Featured Products**

* *Given* CMS has 4+ products, *when* visiting home, *then* display the first 4 by `order` with valid images and alt text; layout remains intact with missing images (fallback).

**Products → Detail**

* *Given* a product has related recipes, *then* show up to 4 related recipes; JSON‑LD `Product` is present and valid (Rich Results Test).

**Recipes → Filters**

* *Given* user types in search, *then* results update after 300ms debounce; URL reflects filters via query params.

**Contact Form**

* *Given* spam bot missing honeypot or failing captcha, *then* form is rejected with generic error; no PII logged server‑side.

---

## 14) Performance & A11y Budget

* **Perf:** Hero LCP image ≤ 200KB; total JS ≤ 200KB (gzip) on Home; fonts ≤ 2 families.
* **A11y:** color contrast ratio ≥ 4.5:1 for text; captions for any video; aria‑labels for icons.

---

## 15) Deployment & Environments

* **Envs:** Preview (PR), Staging (password-protected), Production.
* **CI/CD:** auto deploy on PR with checks: typecheck, unit tests, Lighthouse CI (thresholds), Playwright smoke.

---

## 16) Risks & Assumptions

* Product imagery availability (assume we will reshoot or use owned assets).
* Content readiness for Sustainability and Community pages may lag; can ship stubs.
* B2B spec sheets may require PDF hosting (ensure accessible PDFs).

---

## 17) Timeline (Aggressive 2‑Week Sprint)

* **D1–2:** Wireframes in code, tokens, core components.
* **D3–6:** Home + Products (grid & detail).
* **D7–9:** Recipes (list, filters, detail).
* **D10–11:** Story & Sustainability; Contact/Where to Buy.
* **D12:** SEO/A11y/Perf pass; analytics & tracking.
* **D13–14:** Content load, QA, legal, launch.

---

## 18) Open Questions

* Final product categories and SKU list?
* Which CMS (Sanity vs Contentful vs Payload)?
* Newsletter provider preference?
* Regions for "Where to Buy" filters (TR only or multi‑region)?
* Language(s) for v1 (EN only vs EN/TR)?

---

## 19) Appendix A — Prompt Runbook (Cursor + Claude)

* **Scaffold:** "Create a Next.js (App Router, TS) + Tailwind project. Add components: Nav, Hero, ProductCard, ProductGrid, RecipeCard, Filters, Timeline, StatBadge, ContactBlock. Set up `/products`, `/recipes`, `/our-story`, `/sustainability`, `/where-to-buy`, `/contact`. Add unit tests (Vitest) and Playwright smoke."
* **CMS data layer (temporary):** "Add `data/` JSON for categories, products, recipes, locations; dynamic routes; ISR revalidate=3600."
* **Accessibility pass:** "Audit focus order, add aria labels, ensure skip link, write tests for keyboard nav of menu."
* **Perf pass:** "Implement next/image with responsive sizes; defer non-critical JS; preconnect fonts."

---

## 20) Appendix B — Style Tokens (Baseline)

* **Colors:** `--brand-primary`, `--brand-accent`, neutrals scale 50–900.
* **Type Scale:** xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl.
* **Spacing:** 4px scale (1–12).
* **Radii:** sm/md/lg/2xl.
* **Shadows:** xs/sm/md/lg.

---

*End of PRD*
