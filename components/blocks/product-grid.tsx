'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import type { Product, Category } from '@/lib/cms/types'
import { staggerContainer, fadeInUp } from '@/lib/motion/constants'

interface ProductGridProps {
  products: Product[]
  categories?: Category[]
  loading?: boolean
  showLoadMore?: boolean
  onLoadMore?: () => void
  className?: string
}

export function ProductGrid({
  products,
  categories,
  loading = false,
  showLoadMore = false,
  onLoadMore,
  className
}: ProductGridProps) {
  // Create category lookup
  const categoryLookup = React.useMemo(() => {
    if (!categories) return {}
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name
      return acc
    }, {} as Record<string, string>)
  }, [categories])

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className || ''}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found.</p>
        <p className="text-muted-foreground">Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={fadeInUp}
            custom={index}
          >
            <ProductCard
              product={product}
              category={categoryLookup[product.categoryId]}
              showRetailerLinks={false}
            />
          </motion.div>
        ))}
      </motion.div>

      {showLoadMore && onLoadMore && (
        <div className="text-center mt-8">
          <Button onClick={onLoadMore} variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-6 bg-muted rounded w-full" />
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
        <div className="h-10 bg-muted rounded w-full" />
      </div>
    </div>
  )
}
