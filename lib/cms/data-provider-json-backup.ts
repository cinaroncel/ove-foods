import { z } from 'zod'
import type { 
  Category, 
  Product, 
  Recipe, 
  Location, 
  StoryPost, 
  SustainabilityPost, 
  SustainabilityMetric 
} from './types'

// Zod schemas for runtime validation
const CategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
  heroImage: z.string().optional(),
  order: z.number().default(100)
})

const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  categoryId: z.string(),
  shortCopy: z.string(),
  longCopy: z.string(),
  images: z.array(z.string()),
  specs: z.object({
    volume: z.string().optional(),
    variety: z.string().optional(),
    origin: z.string().optional(),
    acidity: z.string().optional()
  }).optional(),
  nutrition: z.object({
    servingSize: z.string().optional(),
    calories: z.number().optional(),
    fat: z.string().optional(),
    saturatedFat: z.string().optional(),
    sodium: z.string().optional(),
    carbs: z.string().optional(),
    protein: z.string().optional()
  }).optional(),
  certifications: z.array(z.object({
    label: z.string(),
    icon: z.string().optional()
  })),
  awards: z.array(z.object({
    name: z.string(),
    year: z.number(),
    link: z.string().optional()
  })),
  relatedRecipeIds: z.array(z.string()),
  retailerLinks: z.array(z.object({
    label: z.string(),
    url: z.string()
  })),
  featured: z.boolean().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional()
  }).optional()
})

const RecipeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  heroImage: z.string(),
  description: z.string(),
  ingredients: z.array(z.object({
    item: z.string(),
    quantity: z.number(),
    unit: z.string(),
    notes: z.string().optional()
  })),
  steps: z.array(z.string()),
  times: z.object({
    prep: z.number(),
    cook: z.number()
  }),
  servings: z.number(),
  tags: z.array(z.string()),
  relatedProductIds: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  featured: z.boolean().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional()
  }).optional()
})

// Data provider functions
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await import('../../data/categories.json')
    const categories = z.array(CategorySchema).parse(response.default)
    return categories.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error loading categories:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories()
  return categories.find(category => category.slug === slug) || null
}

export async function getCategoriesWithSubs(): Promise<Category[]> {
  // For now, just return regular categories since we don't have subcategories in JSON
  return await getCategories()
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await import('../../data/products.json')
    return z.array(ProductSchema).parse(response.default)
  } catch (error) {
    console.error('Error loading products:', error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find(product => product.slug === slug) || null
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter(product => product.categoryId === categoryId)
}

export async function getProductsByCategoryIncludingSubs(categoryId: string): Promise<Product[]> {
  // For now, just return products from the category since we don't have subcategories in JSON
  return await getProductsByCategory(categoryId)
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await getProducts()
  return products.filter(product => product.featured).slice(0, limit)
}

export async function getRecipes(): Promise<Recipe[]> {
  try {
    const response = await import('../../data/recipes.json')
    return z.array(RecipeSchema).parse(response.default)
  } catch (error) {
    console.error('Error loading recipes:', error)
    return []
  }
}

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const recipes = await getRecipes()
  return recipes.find(recipe => recipe.slug === slug) || null
}

export async function getFeaturedRecipes(limit = 6): Promise<Recipe[]> {
  const recipes = await getRecipes()
  return recipes.filter(recipe => recipe.featured).slice(0, limit)
}

export async function getRecipesByProductId(productId: string): Promise<Recipe[]> {
  const recipes = await getRecipes()
  return recipes.filter(recipe => recipe.relatedProductIds.includes(productId))
}

export async function getProductsByRecipeId(recipeId: string): Promise<Product[]> {
  const products = await getProducts()
  const recipe = await getRecipeBySlug(recipeId)
  
  if (!recipe) return []
  
  return products.filter(product => recipe.relatedProductIds.includes(product.id))
}

export async function getLocations(): Promise<Location[]> {
  try {
    const response = await import('../../data/locations.json')
    return response.default as Location[]
  } catch (error) {
    console.error('Error loading locations:', error)
    return []
  }
}

export async function getStoryPosts(): Promise<StoryPost[]> {
  try {
    const response = await import('../../data/story-posts.json')
    return response.default as StoryPost[]
  } catch (error) {
    console.error('Error loading story posts:', error)
    return []
  }
}

export async function getSustainabilityPosts(): Promise<SustainabilityPost[]> {
  try {
    const response = await import('../../data/sustainability-posts.json')
    return response.default as SustainabilityPost[]
  } catch (error) {
    console.error('Error loading sustainability posts:', error)
    return []
  }
}

export async function getSustainabilityMetrics(): Promise<SustainabilityMetric[]> {
  try {
    const response = await import('../../data/sustainability-metrics.json')
    return response.default as SustainabilityMetric[]
  } catch (error) {
    console.error('Error loading sustainability metrics:', error)
    return []
  }
}

// Cache utilities for ISR
export const revalidate = 3600 // 1 hour
