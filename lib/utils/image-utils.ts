/**
 * Helper function to get the correct image URL
 * Handles both Firebase Storage URLs and local asset paths
 */
export function getImageUrl(imagePath: string | undefined | null, type: 'products' | 'recipes' | 'categories' = 'products'): string {
  // Handle null/undefined cases
  if (!imagePath) {
    return `/assets/${type}/placeholder.jpg` // fallback image
  }
  
  // If it's already a full URL (Firebase Storage), return as-is
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Otherwise, assume it's a local asset path
  return `/assets/${type}/${imagePath}`
}

/**
 * Get product image URL
 */
export function getProductImageUrl(imagePath: string | undefined | null): string {
  return getImageUrl(imagePath, 'products')
}

/**
 * Get recipe image URL  
 */
export function getRecipeImageUrl(imagePath: string | undefined | null): string {
  return getImageUrl(imagePath, 'recipes')
}

/**
 * Get category image URL
 */
export function getCategoryImageUrl(imagePath: string | undefined | null): string {
  return getImageUrl(imagePath, 'categories')
}