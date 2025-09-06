# OVE Foods Website

A premium marketing website for OVE Foods, featuring Mediterranean olive oils, vinegars, and culinary products. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Performance Optimized**: Static generation with ISR, optimized images, Core Web Vitals focused
- **Accessibility First**: WCAG 2.2 AA compliant, keyboard navigation, screen reader friendly
- **SEO Optimized**: Structured data (JSON-LD), meta tags, sitemap generation
- **Responsive Design**: Mobile-first approach with smooth animations
- **Content Management**: JSON-based content with easy CMS migration path
- **Analytics Ready**: Google Analytics 4 and Vercel Analytics integration
- **Form Handling**: Contact forms with validation and spam protection

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Search**: Fuse.js (client-side)
- **Forms**: React Hook Form + Zod validation
- **Analytics**: Vercel Analytics + Google Analytics 4
- **Error Monitoring**: Sentry
- **Deployment**: Vercel

## 📁 Project Structure

```
├── app/                          # Next.js 14 App Router
│   ├── (marketing)/             # Marketing pages group
│   │   ├── page.tsx             # Home page
│   │   ├── products/            # Products pages
│   │   ├── recipes/             # Recipes pages
│   │   ├── our-story/           # Company story
│   │   ├── sustainability/      # Sustainability page
│   │   ├── contact/             # Contact page
│   │   └── where-to-buy/        # Store locator
│   ├── api/                     # API routes
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── sitemap.ts               # Dynamic sitemap
│   └── robots.ts                # Robots.txt
├── components/                   # React components
│   ├── blocks/                  # Page sections
│   ├── layout/                  # Layout components
│   └── ui/                      # Base UI components
├── lib/                         # Utilities and helpers
│   ├── analytics/               # Analytics integration
│   ├── cms/                     # Data providers
│   ├── motion/                  # Animation constants
│   ├── search/                  # Search functionality
│   └── seo/                     # SEO utilities
├── data/                        # JSON content files
├── public/                      # Static assets
└── styles/                      # CSS files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ove-foods
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your values:
   ```env
   # Analytics
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_VERCEL_ANALYTICS=true
   
   # Email Service (SendGrid example)
   SENDGRID_API_KEY=your_sendgrid_api_key
   FROM_EMAIL=noreply@ovefoods.com
   TO_EMAIL=contact@ovefoods.com
   
   # Sentry (optional)
   SENTRY_DSN=your_sentry_dsn_here
   
   # Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📝 Content Management

### Current Setup (JSON-based)

Content is managed through JSON files in the `/data` directory:

- `categories.json` - Product categories
- `products.json` - Product catalog
- `recipes.json` - Recipe collection
- `locations.json` - Contact locations
- `story-posts.json` - Company timeline
- `sustainability-*.json` - Sustainability content

### Adding New Content

1. **Products**: Add entries to `data/products.json`
2. **Recipes**: Add entries to `data/recipes.json`
3. **Images**: Place in `public/assets/products/` or `public/assets/recipes/`

### CMS Migration Path

The current JSON structure is designed for easy migration to:
- Sanity
- Contentful
- Payload CMS
- Strapi

## 🎨 Customization

### Brand Colors

Edit `styles/globals.css` to customize the color palette:

```css
:root {
  --brand-primary: hsl(28 80% 52%);  /* Warm golden olive */
  --brand-accent: hsl(145 60% 35%);   /* Deep sage green */
  --brand-warm: hsl(35 85% 65%);     /* Warm amber */
  --brand-earth: hsl(25 45% 25%);    /* Rich earth brown */
}
```

### Typography

The site uses Inter (sans-serif) and Playfair Display (serif). Update in `app/layout.tsx`.

### Components

All components are built with Tailwind CSS and follow the shadcn/ui patterns for consistency.

## 📊 Analytics & Tracking

### Events Tracked

- `view_product` - Product page views
- `click_retailer_link` - Retailer link clicks
- `search_site` - Site searches
- `filter_recipes` - Recipe filtering
- `view_recipe` - Recipe page views
- `newsletter_submit` - Newsletter signups
- `contact_submit` - Contact form submissions

### Privacy Compliance

- Cookie consent banner
- Analytics opt-out
- GDPR/CCPA compliant data handling

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - automatic deployments on push to main

### Other Platforms

The app is compatible with any Node.js hosting platform:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run format       # Format code with Prettier
```

## 📈 Performance

### Core Web Vitals Targets

- **LCP**: ≤ 2.5s
- **CLS**: ≤ 0.1  
- **TBT**: ≤ 200ms

### Optimizations

- Static generation with ISR
- Image optimization with `next/image`
- Code splitting and lazy loading
- Preconnect to external domains
- Optimized font loading

## ♿ Accessibility

- WCAG 2.2 AA compliant
- Keyboard navigation
- Screen reader support
- High contrast ratios
- Focus management
- Skip links

## 🔒 Security

- Content Security Policy headers
- Input validation and sanitization
- Rate limiting on forms
- Honeypot spam protection
- Secure cookie handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary to OVE Foods. All rights reserved.

## 📞 Support

For questions or support:
- Email: dev@ovefoods.com
- Documentation: [Link to internal docs]
- Issues: [Link to issue tracker]
