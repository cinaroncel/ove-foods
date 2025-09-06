import type { Metadata } from 'next'
import type { Product, Recipe } from '../cms/types'

const SITE_NAME = 'OVE Foods'
const SITE_DESCRIPTION = 'Premium olive oils, vinegars, and culinary products crafted with passion and tradition. Discover authentic flavors that elevate your cooking.'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ovefoods.com'

export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${SITE_NAME}`,
      default: SITE_NAME
    },
    description: SITE_DESCRIPTION,
    keywords: ['olive oil', 'vinegar', 'gourmet', 'cooking', 'culinary', 'premium', 'authentic'],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: '/assets/og-image.jpg',
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: ['/assets/og-image.jpg'],
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  }
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  ogImage,
  noIndex = false
}: {
  title: string
  description: string
  path?: string
  ogImage?: string
  noIndex?: boolean
}): Metadata {
  const url = `${SITE_URL}${path}`
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : undefined,
    },
    twitter: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: noIndex ? {
      index: false,
      follow: false,
    } : undefined,
  }
}

export function generateProductMetadata(product: Product): Metadata {
  const title = product.seo?.title || product.title
  const description = product.seo?.description || product.shortCopy
  const ogImage = product.seo?.ogImage || product.images[0]
  
  return generatePageMetadata({
    title,
    description,
    path: `/products/${product.slug}`,
    ogImage: ogImage ? `/assets/products/${ogImage}` : undefined,
  })
}

export function generateRecipeMetadata(recipe: Recipe): Metadata {
  const title = recipe.seo?.title || recipe.title
  const description = recipe.seo?.description || recipe.description
  const ogImage = recipe.seo?.ogImage || recipe.heroImage
  
  return generatePageMetadata({
    title,
    description,
    path: `/recipes/${recipe.slug}`,
    ogImage: ogImage ? `/assets/recipes/${ogImage}` : undefined,
  })
}

// JSON-LD structured data generators
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
    description: SITE_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://www.facebook.com/ovefoods',
      'https://www.instagram.com/ovefoods',
      'https://www.twitter.com/ovefoods'
    ]
  }
}

export function generateProductJsonLd(product: Product, category?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.shortCopy,
    image: product.images.map(img => `${SITE_URL}/assets/products/${img}`),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME
    },
    category: category || 'Food',
    offers: product.retailerLinks.map(retailer => ({
      '@type': 'Offer',
      url: retailer.url,
      seller: {
        '@type': 'Organization',
        name: retailer.label
      },
      availability: 'https://schema.org/InStock'
    })),
    additionalProperty: product.specs ? Object.entries(product.specs).map(([key, value]) => ({
      '@type': 'PropertyValue',
      name: key,
      value: value
    })) : undefined
  }
}

export function generateRecipeJsonLd(recipe: Recipe, relatedProducts: Product[] = []) {
  const totalTime = recipe.times.prep + recipe.times.cook
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: [`${SITE_URL}/assets/recipes/${recipe.heroImage}`],
    author: {
      '@type': 'Organization',
      name: SITE_NAME
    },
    prepTime: `PT${recipe.times.prep}M`,
    cookTime: `PT${recipe.times.cook}M`,
    totalTime: `PT${totalTime}M`,
    recipeYield: recipe.servings.toString(),
    recipeCategory: recipe.tags.find(tag => 
      ['appetizer', 'main', 'dessert', 'side', 'salad'].includes(tag.toLowerCase())
    ) || 'Main Course',
    recipeCuisine: recipe.tags.find(tag => 
      ['mediterranean', 'italian', 'greek', 'spanish'].includes(tag.toLowerCase())
    ),
    recipeIngredient: recipe.ingredients.map(ing => 
      `${ing.quantity} ${ing.unit} ${ing.item}${ing.notes ? ` (${ing.notes})` : ''}`
    ),
    recipeInstructions: recipe.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: step
    })),
    nutrition: {
      '@type': 'NutritionInformation',
      servingSize: `${recipe.servings} servings`
    },
    keywords: recipe.tags.join(', ')
  }
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`
    }))
  }
}
