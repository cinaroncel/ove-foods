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
  try {
    return await productsService.getAll();
  } catch (error) {
    console.warn('Failed to fetch products:', error);
    return [];
  }
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    return await productsService.getBySlug(slug);
  } catch (error) {
    console.warn('Failed to fetch product by slug:', error);
    return null;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    return await productsService.getById(id);
  } catch (error) {
    console.warn('Failed to fetch product by id:', error);
    return null;
  }
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    return await getProductsByCategoryFirebase(categoryId);
  } catch (error) {
    console.warn('Failed to fetch products by category:', error);
    return [];
  }
};

export const getFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    return await getFeaturedProductsFirebase();
  } catch (error) {
    console.warn('Failed to fetch featured products:', error);
    return [];
  }
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    return await getCategoriesOrdered();
  } catch (error) {
    console.warn('Failed to fetch categories:', error);
    return [];
  }
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    return await categoriesService.getBySlug(slug);
  } catch (error) {
    console.warn('Failed to fetch category by slug:', error);
    return null;
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    return await categoriesService.getById(id);
  } catch (error) {
    console.warn('Failed to fetch category by id:', error);
    return null;
  }
};

// Recipes
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    return await recipesService.getAll();
  } catch (error) {
    console.warn('Failed to fetch recipes:', error);
    return [];
  }
};

export const getRecipeBySlug = async (slug: string): Promise<Recipe | null> => {
  try {
    return await recipesService.getBySlug(slug);
  } catch (error) {
    console.warn('Failed to fetch recipe by slug:', error);
    return null;
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    return await recipesService.getById(id);
  } catch (error) {
    console.warn('Failed to fetch recipe by id:', error);
    return null;
  }
};

export const getRecipesByProductId = async (productId: string): Promise<Recipe[]> => {
  try {
    return await getRecipesByProductIdFirebase(productId);
  } catch (error) {
    console.warn('Failed to fetch recipes by product id:', error);
    return [];
  }
};

export const getFeaturedRecipes = async (limit = 6): Promise<Recipe[]> => {
  try {
    return await getFeaturedRecipesFirebase();
  } catch (error) {
    console.warn('Failed to fetch featured recipes:', error);
    return [];
  }
};

export async function getProductsByRecipeId(recipeId: string): Promise<Product[]> {
  const products = await getProducts()
  const recipe = await getRecipeBySlug(recipeId)
  
  if (!recipe) return []
  
  return products.filter(product => recipe.relatedProductIds.includes(product.id))
}

// Locations
export const getLocations = async (): Promise<Location[]> => {
  try {
    return await locationsService.getAll();
  } catch (error) {
    console.warn('Failed to fetch locations:', error);
    return [];
  }
};

export const getLocationById = async (id: string): Promise<Location | null> => {
  try {
    return await locationsService.getById(id);
  } catch (error) {
    console.warn('Failed to fetch location by id:', error);
    return null;
  }
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