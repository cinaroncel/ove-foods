/**
 * Helper function to get the correct image URL
 * Handles both Firebase Storage URLs and local asset paths
 */
export function getImageUrl(imagePath: string, type: 'products' | 'recipes' = 'products'): string {
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
export function getProductImageUrl(imagePath: string): string {
  return getImageUrl(imagePath, 'products')
}

/**
 * Get recipe image URL  
 */
export function getRecipeImageUrl(imagePath: string): string {
  return getImageUrl(imagePath, 'recipes')
}