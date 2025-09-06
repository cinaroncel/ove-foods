import { MetadataRoute } from 'next'
import { getProducts, getRecipes } from '@/lib/cms/data-provider'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ovefoods.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/our-story`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/sustainability`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/where-to-buy`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  try {
    // Dynamic product pages
    const products = await getProducts()
    const productPages = products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic recipe pages
    const recipes = await getRecipes()
    const recipePages = recipes.map((recipe) => ({
      url: `${SITE_URL}/recipes/${recipe.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...productPages, ...recipePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if dynamic content fails
    return staticPages
  }
}
