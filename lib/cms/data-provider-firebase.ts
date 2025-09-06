// Firebase-based data provider to replace the JSON file-based one
import { 
  productsService, 
  categoriesService, 
  recipesService, 
  locationsService,
  getProductsByCategory,
  getFeaturedProducts,
  getFeaturedRecipes,
  getRecipesByProductId,
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
  return getProductsByCategory(categoryId);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  return getFeaturedProducts();
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
  return getRecipesByProductId(productId);
};

export const getFeaturedRecipes = async (): Promise<Recipe[]> => {
  return getFeaturedRecipes();
};

// Locations
export const getLocations = async (): Promise<Location[]> => {
  return locationsService.getAll();
};

export const getLocationById = async (id: string): Promise<Location | null> => {
  return locationsService.getById(id);
};

// Story posts and other content will be migrated similarly
// For now, keeping the existing JSON-based providers for these