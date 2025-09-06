// Firebase-based data provider to replace the JSON file-based one
import { 
  productsService, 
  categoriesService, 
  recipesService, 
  locationsService,
  getProductsByCategory as getProductsByCategoryFirebase,
  getFeaturedProducts as getFeaturedProductsFirebase,
  getFeaturedRecipes as getFeaturedRecipesFirebase,
  getRecipesByProductId as getRecipesByProductIdFirebase,
  getCategoriesOrdered
} from '@/lib/firebase/firestore';

import type { Product, Category, Recipe, Location } from '@/lib/cms/types';

// Products
export const getProducts = async (): Promise<Product[]> => {
  return productsService.getAll();
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  return productsService.getBySlug(slug);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  return productsService.getById(id);
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return getProductsByCategoryFirebase(categoryId);
};

export const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  return getFeaturedProductsFirebase();
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  return getCategoriesOrdered();
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  return categoriesService.getBySlug(slug);
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  return categoriesService.getById(id);
};

// Recipes
export const getRecipes = async (): Promise<Recipe[]> => {
  return recipesService.getAll();
};

export const getRecipeBySlug = async (slug: string): Promise<Recipe | null> => {
  return recipesService.getBySlug(slug);
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  return recipesService.getById(id);
};

export const getRecipesByProductId = async (productId: string): Promise<Recipe[]> => {
  return getRecipesByProductIdFirebase(productId);
};

export const getFeaturedRecipes = async (limit = 6): Promise<Recipe[]> => {
  return getFeaturedRecipesFirebase();
};

export async function getProductsByRecipeId(recipeId: string): Promise<Product[]> {
  const products = await getProducts()
  const recipe = await getRecipeBySlug(recipeId)
  
  if (!recipe) return []
  
  return products.filter(product => recipe.relatedProductIds.includes(product.id))
}

// Locations
export const getLocations = async (): Promise<Location[]> => {
  return locationsService.getAll();
};

export const getLocationById = async (id: string): Promise<Location | null> => {
  return locationsService.getById(id);
};

// Story posts and other content - keep JSON-based for now
export async function getStoryPosts() {
  try {
    const response = await import('../../data/story-posts.json')
    return response.default as any[]
  } catch (error) {
    console.error('Error loading story posts:', error)
    return []
  }
}

export async function getSustainabilityPosts() {
  try {
    const response = await import('../../data/sustainability-posts.json')
    return response.default as any[]
  } catch (error) {
    console.error('Error loading sustainability posts:', error)
    return []
  }
}

export async function getSustainabilityMetrics() {
  try {
    const response = await import('../../data/sustainability-metrics.json')
    return response.default as any[]
  } catch (error) {
    console.error('Error loading sustainability metrics:', error)
    return []
  }
}