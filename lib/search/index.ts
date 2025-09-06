import Fuse from 'fuse.js'
import type { Product, Recipe, SearchFilters, SearchResult } from '../cms/types'

// Fuse.js configuration for products
const productSearchOptions: Fuse.IFuseOptions<Product> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'shortCopy', weight: 0.3 },
    { name: 'longCopy', weight: 0.2 },
    { name: 'specs.variety', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
}

// Fuse.js configuration for recipes
const recipeSearchOptions: Fuse.IFuseOptions<Recipe> = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'ingredients.item', weight: 0.2 },
    { name: 'tags', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
}

export class ProductSearch {
  private fuse: Fuse<Product>

  constructor(products: Product[]) {
    this.fuse = new Fuse(products, productSearchOptions)
  }

  search(query: string, filters?: SearchFilters): SearchResult<Product>[] {
    let results = this.fuse.search(query)

    // Apply additional filters
    if (filters) {
      results = results.filter(result => {
        const product = result.item

        if (filters.category && product.categoryId !== filters.category) {
          return false
        }

        if (filters.featured !== undefined && product.featured !== filters.featured) {
          return false
        }

        return true
      })
    }

    return results.map(result => ({
      item: result.item,
      score: result.score || 0
    }))
  }

  getAllProducts(): Product[] {
    return this.fuse.getIndex().docs as Product[]
  }
}

export class RecipeSearch {
  private fuse: Fuse<Recipe>

  constructor(recipes: Recipe[]) {
    this.fuse = new Fuse(recipes, recipeSearchOptions)
  }

  search(query: string, filters?: SearchFilters): SearchResult<Recipe>[] {
    let results = this.fuse.search(query)

    // Apply additional filters
    if (filters) {
      results = results.filter(result => {
        const recipe = result.item

        if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
          return false
        }

        if (filters.tags && filters.tags.length > 0) {
          const hasMatchingTag = filters.tags.some(tag => 
            recipe.tags.includes(tag)
          )
          if (!hasMatchingTag) return false
        }

        if (filters.featured !== undefined && recipe.featured !== filters.featured) {
          return false
        }

        return true
      })
    }

    return results.map(result => ({
      item: result.item,
      score: result.score || 0
    }))
  }

  getAllRecipes(): Recipe[] {
    return this.fuse.getIndex().docs as Recipe[]
  }
}

// Utility functions for filtering
export function filterProducts(products: Product[], filters: SearchFilters): Product[] {
  return products.filter(product => {
    if (filters.category && product.categoryId !== filters.category) {
      return false
    }

    if (filters.featured !== undefined && product.featured !== filters.featured) {
      return false
    }

    return true
  })
}

export function filterRecipes(recipes: Recipe[], filters: SearchFilters): Recipe[] {
  return recipes.filter(recipe => {
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false
    }

    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        recipe.tags.includes(tag)
      )
      if (!hasMatchingTag) return false
    }

    if (filters.featured !== undefined && recipe.featured !== filters.featured) {
      return false
    }

    return true
  })
}

// Get unique tags from recipes
export function getUniqueRecipeTags(recipes: Recipe[]): string[] {
  const tags = new Set<string>()
  recipes.forEach(recipe => {
    recipe.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
}

// Get difficulty levels
export function getDifficultyLevels(): Array<{ value: string; label: string }> {
  return [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ]
}
