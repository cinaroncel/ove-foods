'use client'

import * as React from 'react'
import { RecipeGrid } from '@/components/blocks/recipe-grid'
import { Filters } from '@/components/blocks/filters'
import { RecipeSearch, filterRecipes, getDifficultyLevels } from '@/lib/search'
import { useSearchParams } from 'next/navigation'
import type { Recipe, SearchFilters } from '@/lib/cms/types'

interface RecipesClientProps {
  initialRecipes: Recipe[]
  tags: string[]
}

export default function RecipesClient({ initialRecipes, tags }: RecipesClientProps) {
  const searchParams = useSearchParams()
  const [filteredRecipes, setFilteredRecipes] = React.useState<Recipe[]>(initialRecipes)
  const [recipeSearch] = React.useState(() => new RecipeSearch(initialRecipes))

  // Apply filters when search params change
  React.useEffect(() => {
    const query = searchParams.get('q') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const selectedTags = searchParams.getAll('tags')

    const filters: SearchFilters = {
      query,
      difficulty,
      tags: selectedTags
    }

    let results = initialRecipes

    // Apply search if query exists
    if (query) {
      const searchResults = recipeSearch.search(query, filters)
      results = searchResults.map(result => result.item)
    } else {
      // Apply filters without search
      results = filterRecipes(initialRecipes, filters)
    }

    setFilteredRecipes(results)
  }, [searchParams, initialRecipes, recipeSearch])

  // Create filter options
  const tagOptions = tags.map(tag => ({
    label: tag.charAt(0).toUpperCase() + tag.slice(1),
    value: tag,
    count: initialRecipes.filter(r => r.tags.includes(tag)).length
  }))

  const difficultyOptions = getDifficultyLevels().map(level => ({
    ...level,
    count: initialRecipes.filter(r => r.difficulty === level.value).length
  }))

  return (
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
                {filteredRecipes.length} recipe{filteredRecipes.length === 1 ? '' : 's'} found
              </p>
            </div>

            <RecipeGrid
              recipes={filteredRecipes}
              loading={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}