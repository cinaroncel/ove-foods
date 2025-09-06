# ARCHITECTURE — Tech & Implementation Plan

## 1) Stack

* **Framework:** Next.js (App Router) + TypeScript
* **Styling:** Tailwind CSS + CSS variables; shadcn/ui
* **CMS:** Sanity / Contentful / Payload (pick one)
* **Deployment:** Vercel (Preview, Staging, Production)
* **Search:** Fuse.js client-side (upgrade path: Algolia)
* **Analytics:** GA4 or Vercel Analytics; events per SEO\_QA.md
* **Error Monitoring:** Sentry

## 2) Directory Structure (proposed)

```
app/
  (marketing)/
    page.tsx                # Home
    products/
      page.tsx              # Grid
      [slug]/page.tsx       # Product Detail
    recipes/
      page.tsx
      [slug]/page.tsx
    our-story/page.tsx
    sustainability/page.tsx
    where-to-buy/page.tsx
    contact/page.tsx
  api/
    contact/route.ts        # POST contact form
    revalidate/route.ts     # (optional) ISR on-demand
components/
lib/
  cms/                      # CMS client, queries, mappers
  search/                   # fuse.js setup
  analytics/                # event emitters
styles/
data/                      # JSON seed (if no CMS yet)
public/
```

## 3) Data Fetching & Caching

* **Strategy:** Static generation with ISR for most pages.
* Home, products, recipes: `revalidate: 3600` (1h).
* Product/Recipe detail: ISR; prebuild top N pages.
* Search: client-side over pre-fetched lists or API endpoint returning minimal JSON.

## 4) Routing & SEO

* Use Next App Router layouts to share head/meta, breadcrumb JSON-LD, and OpenGraph.
* `next-sitemap` for `sitemap.xml`; custom `robots.txt`.
* Canonical URLs and structured data per template.

## 5) Components & State

* UI components are server components by default; interactive pieces as client components (`"use client"`).
* Global state light; filters/search local to pages.
* Form state with React Hook Form.

## 6) Forms & Email

* Contact form → API route → SendGrid/Mail provider.
* Anti‑spam: honeypot + basic rate limit + optional captcha.

## 7) CMS Integration (if Sanity example)

* `sanity.config.ts`, GROQ queries; `deskStructure` for editors.
* Image pipeline → `next-sanity-image`.
* Preview mode for drafts; webhooks for revalidate on publish.

## 8) Internationalization (optional)

* Next i18n routing; dictionaries per locale; localized CMS fields.
* Default EN; TR optional in v1.

## 9) Performance Budget

* JS ≤ 200KB gz on Home; images AVIF/WebP; font subsetting & preconnect.
* LCP ≤ 2.5s; CLS ≤ 0.1; TBT ≤ 200ms (lab).

## 10) Security & Privacy

* Minimal PII; environment variables for secrets.
* Headers: `Content-Security-Policy` (strict sources), Referrer-Policy, X-Frame-Options.
* Cookie banner + consent storage.

## 11) Observability

* Sentry init in client/server.
* Analytics events wrappers with TypeScript types.
* Health check endpoint (optional).

## 12) Migrations & Redirects

* Map old routes; configure `next.config.ts` redirects.
* Upload assets to `public/` or CMS; avoid hotlinking.

## 13) Local Dev & DX

* Scripts: `dev`, `build`, `start`, `typecheck`, `test`, `e2e`, `lint`, `format`.
* Husky pre-commit: typecheck + lint + unit tests.
* VSCode settings: path aliases (`@/`), Tailwind IntelliSense.
