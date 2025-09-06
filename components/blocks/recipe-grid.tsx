'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { RecipeCard } from './recipe-card'
import { Button } from '@/components/ui/button'
import type { Recipe } from '@/lib/cms/types'
import { staggerContainer, fadeInUp } from '@/lib/motion/constants'

interface RecipeGridProps {
  recipes: Recipe[]
  loading?: boolean
  showLoadMore?: boolean
  onLoadMore?: () => void
  className?: string
}

export function RecipeGrid({
  recipes,
  loading = false,
  showLoadMore = false,
  onLoadMore,
  className
}: RecipeGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className || ''}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No recipes found.</p>
        <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            variants={fadeInUp}
            custom={index}
          >
            <RecipeCard recipe={recipe} />
          </motion.div>
        ))}
      </motion.div>

      {showLoadMore && onLoadMore && (
        <div className="text-center mt-8">
          <Button onClick={onLoadMore} variant="outline" size="lg">
            Load More Recipes
          </Button>
        </div>
      )}
    </div>
  )
}

function RecipeCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
        <div className="flex gap-2">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-12" />
        </div>
        <div className="flex gap-1">
          <div className="h-5 bg-muted rounded w-12" />
          <div className="h-5 bg-muted rounded w-16" />
        </div>
        <div className="h-10 bg-muted rounded w-full" />
      </div>
    </div>
  )
}
