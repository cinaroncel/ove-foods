'use client'

import * as React from 'react'
import { RecipeGrid } from '@/components/blocks/recipe-grid'
import { Filters } from '@/components/blocks/filters'
import { getRecipes } from '@/lib/cms/data-provider'
import { RecipeSearch, filterRecipes, getUniqueRecipeTags, getDifficultyLevels } from '@/lib/search'
import { useSearchParams } from 'next/navigation'
import type { Recipe, SearchFilters } from '@/lib/cms/types'

export default function RecipesPage() {
  const searchParams = useSearchParams()
  const [recipes, setRecipes] = React.useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = React.useState<Recipe[]>([])
  const [loading, setLoading] = React.useState(true)
  const [recipeSearch, setRecipeSearch] = React.useState<RecipeSearch | null>(null)
  const [tags, setTags] = React.useState<string[]>([])

  // Load initial data
  React.useEffect(() => {
    async function loadData() {
      try {
        const recipesData = await getRecipes()
        const uniqueTags = getUniqueRecipeTags(recipesData)
        
        setRecipes(recipesData)
        setFilteredRecipes(recipesData)
        setRecipeSearch(new RecipeSearch(recipesData))
        setTags(uniqueTags)
      } catch (error) {
        console.error('Error loading recipes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Apply filters when search params change
  React.useEffect(() => {
    if (!recipes.length || !recipeSearch) return

    const query = searchParams.get('q') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const selectedTags = searchParams.getAll('tags')
    const featured = searchParams.get('featured') === 'true'

    const filters: SearchFilters = {
      query,
      difficulty,
      tags: selectedTags,
      featured
    }

    let results = recipes

    // Apply search if query exists
    if (query) {
      const searchResults = recipeSearch.search(query, filters)
      results = searchResults.map(result => result.item)
    } else {
      // Apply filters without search
      results = filterRecipes(recipes, filters)
    }

    setFilteredRecipes(results)
  }, [searchParams, recipes, recipeSearch])

  // Create filter options
  const tagOptions = tags.map(tag => ({
    label: tag.charAt(0).toUpperCase() + tag.slice(1),
    value: tag,
    count: recipes.filter(r => r.tags.includes(tag)).length
  }))

  const difficultyOptions = getDifficultyLevels().map(level => ({
    ...level,
    count: recipes.filter(r => r.difficulty === level.value).length
  }))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/20 py-12">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Recipe Collection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover Mediterranean-inspired recipes that showcase the authentic flavors 
              of our premium olive oils and vinegars.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Filters
                  searchPlaceholder="Search recipes..."
                  tags={tagOptions}
                  difficulties={difficultyOptions}
                  showCategories={false}
                  showTags={true}
                  showDifficulties={true}
                />
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading 
                    ? 'Loading recipes...' 
                    : `${filteredRecipes.length} recipe${filteredRecipes.length === 1 ? '' : 's'} found`
                  }
                </p>
              </div>

              <RecipeGrid
                recipes={filteredRecipes}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
