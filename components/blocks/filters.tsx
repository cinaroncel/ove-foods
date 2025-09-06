'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { debounce } from '@/lib/utils'
import { useAnalytics } from '@/lib/analytics'

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface FiltersProps {
  searchPlaceholder?: string
  categories?: FilterOption[]
  tags?: FilterOption[]
  difficulties?: FilterOption[]
  showSearch?: boolean
  showCategories?: boolean
  showTags?: boolean
  showDifficulties?: boolean
  onFiltersChange?: (filters: Record<string, string | string[]>) => void
  className?: string
}

export function Filters({
  searchPlaceholder = "Search...",
  categories = [],
  tags = [],
  difficulties = [],
  showSearch = true,
  showCategories = true,
  showTags = true,
  showDifficulties = true,
  onFiltersChange,
  className
}: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const analytics = useAnalytics()
  
  const [searchQuery, setSearchQuery] = React.useState(
    searchParams.get('q') || ''
  )
  const [selectedCategory, setSelectedCategory] = React.useState(
    searchParams.get('category') || ''
  )
  const [selectedTags, setSelectedTags] = React.useState<string[]>(
    searchParams.getAll('tags')
  )
  const [selectedDifficulty, setSelectedDifficulty] = React.useState(
    searchParams.get('difficulty') || ''
  )

  // Debounced search function
  const debouncedSearch = React.useMemo(
    () => debounce((query: string) => {
      updateURL({ q: query })
      if (query) {
        analytics.searchSite({ 
          term: query, 
          filters: JSON.stringify({
            category: selectedCategory,
            tags: selectedTags,
            difficulty: selectedDifficulty
          })
        })
      }
    }, 300),
    [selectedCategory, selectedTags, selectedDifficulty]
  )

  // Update URL with new filters
  const updateURL = (newFilters: Record<string, string | string[]>) => {
    const params = new URLSearchParams()
    
    // Preserve existing params and add new ones
    searchParams.forEach((value, key) => {
      if (!newFilters.hasOwnProperty(key)) {
        params.append(key, value)
      }
    })
    
    // Add new filters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => v && params.append(key, v))
      } else if (value) {
        params.set(key, value)
      }
    })
    
    const url = params.toString() ? `?${params.toString()}` : ''
    router.push(url, { scroll: false })
    
    // Call callback if provided
    if (onFiltersChange) {
      const allFilters = {
        q: searchQuery,
        category: selectedCategory,
        tags: selectedTags,
        difficulty: selectedDifficulty,
        ...newFilters
      }
      onFiltersChange(allFilters)
    }
  }

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    const newCategory = category === selectedCategory ? '' : category
    setSelectedCategory(newCategory)
    updateURL({ category: newCategory })
    
    if (newCategory) {
      analytics.filterRecipes({ filter_name: 'category', value: newCategory })
    }
  }

  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    updateURL({ tags: newTags })
    
    analytics.filterRecipes({ 
      filter_name: 'tags', 
      value: newTags.join(',') 
    })
  }

  // Handle difficulty selection
  const handleDifficultyChange = (difficulty: string) => {
    const newDifficulty = difficulty === selectedDifficulty ? '' : difficulty
    setSelectedDifficulty(newDifficulty)
    updateURL({ difficulty: newDifficulty })
    
    if (newDifficulty) {
      analytics.filterRecipes({ filter_name: 'difficulty', value: newDifficulty })
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedTags([])
    setSelectedDifficulty('')
    router.push('', { scroll: false })
    
    if (onFiltersChange) {
      onFiltersChange({})
    }
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0 || selectedDifficulty

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Search */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
            aria-label="Search"
          />
        </div>
      )}

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <button
                onClick={() => {
                  setSearchQuery('')
                  updateURL({ q: '' })
                }}
                className="ml-1 hover:text-destructive"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {categories.find(c => c.value === selectedCategory)?.label}
              <button
                onClick={() => handleCategoryChange('')}
                className="ml-1 hover:text-destructive"
                aria-label="Clear category filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tags.find(t => t.value === tag)?.label || tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:text-destructive"
                aria-label={`Remove ${tag} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {selectedDifficulty && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {difficulties.find(d => d.value === selectedDifficulty)?.label}
              <button
                onClick={() => handleDifficultyChange('')}
                className="ml-1 hover:text-destructive"
                aria-label="Clear difficulty filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter options */}
      <div className="space-y-4">
        {/* Categories */}
        {showCategories && categories.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`px-3 py-2 text-sm border rounded-md transition-colors focus-visible-ring ${
                    selectedCategory === category.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-input'
                  }`}
                  aria-pressed={selectedCategory === category.value}
                >
                  {category.label}
                  {category.count && (
                    <span className="ml-1 text-xs opacity-70">({category.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {showTags && tags.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => handleTagToggle(tag.value)}
                  className={`px-3 py-2 text-sm border rounded-md transition-colors focus-visible-ring ${
                    selectedTags.includes(tag.value)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-input'
                  }`}
                  aria-pressed={selectedTags.includes(tag.value)}
                >
                  {tag.label}
                  {tag.count && (
                    <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Difficulties */}
        {showDifficulties && difficulties.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.value}
                  onClick={() => handleDifficultyChange(difficulty.value)}
                  className={`px-3 py-2 text-sm border rounded-md transition-colors focus-visible-ring capitalize ${
                    selectedDifficulty === difficulty.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-input'
                  }`}
                  aria-pressed={selectedDifficulty === difficulty.value}
                >
                  {difficulty.label}
                  {difficulty.count && (
                    <span className="ml-1 text-xs opacity-70">({difficulty.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
