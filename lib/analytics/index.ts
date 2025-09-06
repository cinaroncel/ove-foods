'use client'

// Analytics event types
export interface AnalyticsEvent {
  name: string
  parameters?: Record<string, string | number | boolean>
}

// Event parameter interfaces
export interface ViewProductParams {
  product_id: string
  category: string
}

export interface ClickRetailerLinkParams {
  product_id: string
  retailer_name: string
  url: string
}

export interface SearchSiteParams {
  term: string
  filters?: string
}

export interface FilterRecipesParams {
  filter_name: string
  value: string
}

export interface ViewRecipeParams {
  recipe_id: string
  tags: string
}

export interface NewsletterSubmitParams {
  source_page: string
}

export interface ContactSubmitParams {
  topic: string
}

// Analytics provider interface
interface AnalyticsProvider {
  track: (event: AnalyticsEvent) => void
  identify?: (userId: string, traits?: Record<string, any>) => void
  page?: (name: string, properties?: Record<string, any>) => void
}

// Google Analytics 4 implementation
class GA4Provider implements AnalyticsProvider {
  private gtag: any

  constructor() {
    if (typeof window !== 'undefined') {
      this.gtag = (window as any).gtag
    }
  }

  track(event: AnalyticsEvent) {
    if (!this.gtag) return
    
    this.gtag('event', event.name, event.parameters)
  }

  page(name: string, properties?: Record<string, any>) {
    if (!this.gtag) return
    
    this.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_title: name,
      ...properties
    })
  }
}

// Vercel Analytics implementation
class VercelProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent) {
    if (typeof window === 'undefined') return
    
    // Use Vercel Analytics track function if available
    const vercelAnalytics = (window as any).va
    if (vercelAnalytics?.track) {
      vercelAnalytics.track(event.name, event.parameters)
    }
  }
}

// Analytics manager
class Analytics {
  private providers: AnalyticsProvider[] = []
  private consentGiven = false

  constructor() {
    if (typeof window !== 'undefined') {
      // Check for stored consent
      this.consentGiven = localStorage.getItem('analytics-consent') === 'true'
      
      // Initialize providers based on environment
      if (process.env.NEXT_PUBLIC_GA_ID && this.consentGiven) {
        this.providers.push(new GA4Provider())
      }
      
      if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS && this.consentGiven) {
        this.providers.push(new VercelProvider())
      }
    }
  }

  setConsent(consent: boolean) {
    this.consentGiven = consent
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('analytics-consent', consent.toString())
      
      if (consent) {
        // Initialize providers when consent is given
        if (process.env.NEXT_PUBLIC_GA_ID) {
          this.providers.push(new GA4Provider())
        }
        
        if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS) {
          this.providers.push(new VercelProvider())
        }
      } else {
        // Clear providers when consent is withdrawn
        this.providers = []
      }
    }
  }

  private track(event: AnalyticsEvent) {
    if (!this.consentGiven) return
    
    this.providers.forEach(provider => {
      try {
        provider.track(event)
      } catch (error) {
        console.warn('Analytics provider error:', error)
      }
    })
  }

  // Specific event tracking methods
  viewProduct(params: ViewProductParams) {
    this.track({
      name: 'view_product',
      parameters: params
    })
  }

  clickRetailerLink(params: ClickRetailerLinkParams) {
    this.track({
      name: 'click_retailer_link',
      parameters: params
    })
  }

  searchSite(params: SearchSiteParams) {
    this.track({
      name: 'search_site',
      parameters: params
    })
  }

  filterRecipes(params: FilterRecipesParams) {
    this.track({
      name: 'filter_recipes',
      parameters: params
    })
  }

  viewRecipe(params: ViewRecipeParams) {
    this.track({
      name: 'view_recipe',
      parameters: params
    })
  }

  newsletterSubmit(params: NewsletterSubmitParams) {
    this.track({
      name: 'newsletter_submit',
      parameters: params
    })
  }

  contactSubmit(params: ContactSubmitParams) {
    this.track({
      name: 'contact_submit',
      parameters: params
    })
  }

  // Page tracking
  pageView(name: string, properties?: Record<string, any>) {
    if (!this.consentGiven) return
    
    this.providers.forEach(provider => {
      try {
        provider.page?.(name, properties)
      } catch (error) {
        console.warn('Analytics provider error:', error)
      }
    })
  }
}

// Singleton instance
export const analytics = new Analytics()

// React hook for analytics
export function useAnalytics() {
  return analytics
}

// Consent management
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('analytics-consent') === 'true'
}

export function setAnalyticsConsent(consent: boolean) {
  analytics.setConsent(consent)
}
