# UI — Design System & Components (with Scroll‑Triggered Animations)

## 1) Design Principles

* **Clarity first:** simple hierarchy, generous white space, readable type.
* **Warm culinary vibe:** premium yet approachable; avoid copying any competitor's trade dress.
* **Accessibility by default:** color contrast, focus states, keyboard flows, motion preferences.

## 2) Tokens (CSS Variables via Tailwind)

```css
:root {
  --brand-primary: hsl(28 80% 52%); /* placeholder */
  --brand-accent: hsl(145 60% 35%);
  --bg: hsl(40 33% 98%);
  --fg: hsl(24 30% 12%);
  --muted: hsl(24 20% 40%);
}
```

**Type Scale:** xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
**Spacing:** 4px grid (1–12)
**Radii:** sm, md, lg, 2xl
**Shadows:** xs, sm, md, lg
**Breakpoints:** sm (640), md (768), lg (1024), xl (1280), 2xl (1536)

## 3) Component Inventory

### 3.1 Navigation / Header

* **Props:** items: {label, href, children?}\[]; logoSrc; cta?.
* **Behaviors:** sticky; dropdown/mega; ESC to close; focus trap; mobile sheet.
* **A11y:** `nav` landmark, `aria-expanded`, `aria-controls`, skip to main.

### 3.2 Hero

* **Props:** headline, subcopy, primaryCta {label, href}, secondaryCta?, image.
* **Behaviors:** responsive picture sources; preload LCP; optional video variant.
* **A11y:** one `h1` per page; alt text; decorative images `aria-hidden`.

### 3.3 ProductCard

* **Props:** product: {title, slug, image, shortCopy, category, certifications?, price?}.
* **Behaviors:** hover lift; image lazy load; skeleton loading state.
* **A11y:** card as link or button; image alt; focus-visible ring.

### 3.4 ProductGrid

* **Props:** products\[]; filters?; loading?; pagination?.
* **Behaviors:** responsive columns (1→2→3→4); infinite scroll or pagination.
* **A11y:** grid role; announce filter changes; skip to results.

### 3.5 RecipeCard

* **Props:** recipe: {title, slug, heroImage, description, tags, prepTime, cookTime}.
* **Behaviors:** hover effects; tag chips; time badges.
* **A11y:** semantic time elements; tag list with proper roles.

### 3.6 Filters

* **Props:** options: {label, value, count?}\[]; selected\[]; onChange.
* **Behaviors:** multi-select; clear all; URL sync; debounced search.
* **A11y:** fieldset/legend; checkbox group; live region for results count.

### 3.7 Timeline

* **Props:** milestones: {year, title, description, image?}\[].
* **Behaviors:** scroll-triggered animations; progressive disclosure.
* **A11y:** chronological list; prefers-reduced-motion respect.

### 3.8 StatBadge

* **Props:** value, label, icon?, variant?.
* **Behaviors:** count-up animation on scroll into view.
* **A11y:** accessible numbers; motion preferences.

### 3.9 ContactBlock

* **Props:** location: {name, address, phone?, email?, hours?, mapUrl?}.
* **Behaviors:** expandable details; map integration.
* **A11y:** address markup; phone/email links; map alternative.

### 3.10 Footer

* **Props:** sections: {title, links\[]}\[]; social\[]; newsletter?; legal\[].
* **Behaviors:** responsive columns; newsletter form integration.
* **A11y:** navigation landmarks; form labels; social link text.

## 4) Animation System

### 4.1 Scroll Animations (Intersection Observer)

```typescript
// Fade in from bottom
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

// Stagger children
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

### 4.2 Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4.3 Common Animations

* **Cards:** hover lift (transform: translateY(-4px))
* **Images:** subtle zoom on hover (transform: scale(1.05))
* **CTAs:** color transition + slight scale
* **Scroll reveals:** fade + slide up for sections
* **Loading:** skeleton shimmer, spinner

## 5) Responsive Behavior

### 5.1 Grid System

* **Container:** max-width with padding (16px mobile, 24px desktop)
* **Columns:** CSS Grid with named lines
* **Breakpoint strategy:** mobile-first, progressive enhancement

### 5.2 Typography Scale

* **Mobile:** smaller base size (14px), tighter line-height
* **Desktop:** larger base (16px), more generous spacing
* **Headings:** fluid scaling with clamp()

### 5.3 Navigation Patterns

* **Mobile:** hamburger → full-screen overlay or slide-out drawer
* **Desktop:** horizontal nav with dropdowns
* **Tablet:** hybrid approach based on content width

## 6) Accessibility Features

### 6.1 Focus Management

* **Visible focus rings:** high contrast, rounded corners
* **Focus trapping:** in modals and dropdowns
* **Skip links:** to main content and navigation

### 6.2 Screen Reader Support

* **Landmark roles:** main, nav, aside, contentinfo
* **Heading hierarchy:** logical h1→h6 structure
* **Alt text:** descriptive for content images, empty for decorative
* **Live regions:** for dynamic content updates

### 6.3 Keyboard Navigation

* **Tab order:** logical and predictable
* **Arrow keys:** for menu navigation and carousels
* **Escape key:** closes overlays and dropdowns
* **Enter/Space:** activates buttons and links

## 7) Performance Considerations

### 7.1 Images

* **next/image:** automatic optimization and lazy loading
* **Responsive sources:** multiple sizes and formats (AVIF, WebP, JPEG)
* **Priority loading:** for above-the-fold images

### 7.2 Code Splitting

* **Route-based:** automatic with Next.js App Router
* **Component-based:** dynamic imports for heavy components
* **Third-party:** separate bundles for analytics, maps

### 7.3 Critical CSS

* **Inline critical:** above-the-fold styles
* **Preload fonts:** with font-display: swap
* **Minimize CLS:** size placeholders for images and ads

## 8) Implementation Notes

### 8.1 Component Architecture

```typescript
// Base component structure
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // ... specific props
}

const Component = ({ className, ...props }: ComponentProps) => {
  return (
    <div className={cn("base-styles", className)}>
      {/* component content */}
    </div>
  )
}
```

### 8.2 Styling Approach

* **Tailwind classes:** for layout and spacing
* **CSS variables:** for theme colors and measurements
* **Component variants:** using cva (class-variance-authority)
* **Custom properties:** for complex animations and calculations

### 8.3 State Management

* **Local state:** useState for component-specific state
* **URL state:** useSearchParams for filters and pagination
* **Global state:** Context API for theme, user preferences
* **Server state:** SWR or TanStack Query for data fetching

## 9) Testing Strategy

### 9.1 Unit Tests

* **Component rendering:** with React Testing Library
* **User interactions:** click, keyboard, form submission
* **Accessibility:** with jest-axe

### 9.2 Visual Regression

* **Chromatic:** for component library
* **Percy:** for full page screenshots
* **Cross-browser:** automated testing in CI

### 9.3 E2E Testing

* **Playwright:** critical user journeys
* **Accessibility:** automated a11y testing
* **Performance:** Lighthouse CI integration

---

*This design system provides the foundation for consistent, accessible, and performant UI components across the OVE Foods website.*
