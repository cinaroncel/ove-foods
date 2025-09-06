'use client'

import * as React from 'react'
import { ProductGrid } from '@/components/blocks/product-grid'
import { Filters } from '@/components/blocks/filters'
import { getProducts, getCategories } from '@/lib/cms/data-provider'
import { ProductSearch, filterProducts } from '@/lib/search'
import { useSearchParams } from 'next/navigation'
import type { Product, Category, SearchFilters } from '@/lib/cms/types'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = React.useState<Product[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [productSearch, setProductSearch] = React.useState<ProductSearch | null>(null)

  // Load initial data
  React.useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        
        setProducts(productsData)
        setCategories(categoriesData)
        setFilteredProducts(productsData)
        setProductSearch(new ProductSearch(productsData))
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Apply filters when search params change
  React.useEffect(() => {
    if (!products.length || !productSearch) return

    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const featured = searchParams.get('featured') === 'true'

    const filters: SearchFilters = {
      query,
      category,
      featured
    }

    let results = products

    // Apply search if query exists
    if (query) {
      const searchResults = productSearch.search(query, filters)
      results = searchResults.map(result => result.item)
    } else {
      // Apply filters without search
      results = filterProducts(products, filters)
    }

    setFilteredProducts(results)
  }, [searchParams, products, productSearch])

  // Create filter options
  const categoryOptions = categories.map(cat => ({
    label: cat.name,
    value: cat.id,
    count: products.filter(p => p.categoryId === cat.id).length
  }))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/20 py-12">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Products</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of premium Mediterranean olive oils, 
              aged vinegars, and specialty culinary products.
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
                  searchPlaceholder="Search products..."
                  categories={categoryOptions}
                  showTags={false}
                  showDifficulties={false}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading 
                    ? 'Loading products...' 
                    : `${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} found`
                  }
                </p>
              </div>

              <ProductGrid
                products={filteredProducts}
                categories={categories}
                loading={loading}
                showRetailerLinks={true}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
