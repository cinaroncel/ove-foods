import { ProductGrid } from '@/components/blocks/product-grid'
import { Filters } from '@/components/blocks/filters'
import { getProducts, getCategoriesWithSubs } from '@/lib/cms/data-provider'
import { ProductSearch, filterProducts } from '@/lib/search'
import type { Product, Category, SearchFilters } from '@/lib/cms/types'

export const dynamic = 'force-dynamic' // Always fetch fresh data

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Load data server-side
  const [products, categoriesWithSubs] = await Promise.all([
    getProducts(),
    getCategoriesWithSubs()
  ])

  // Flatten categories to include subcategories
  const allCategories: Category[] = []
  categoriesWithSubs.forEach(category => {
    allCategories.push(category)
    if (category.subcategories) {
      allCategories.push(...category.subcategories)
    }
  })

  // Apply filters based on search params
  const query = typeof searchParams.q === 'string' ? searchParams.q : ''
  const category = typeof searchParams.category === 'string' ? searchParams.category : ''
  const featured = searchParams.featured === 'true'

  const filters: SearchFilters = {
    query,
    category,
    featured
  }

  let filteredProducts = products

  // Apply search if query exists
  if (query) {
    const productSearch = new ProductSearch(products)
    const searchResults = productSearch.search(query, filters)
    filteredProducts = searchResults.map(result => result.item)
  } else {
    // Apply filters without search
    filteredProducts = filterProducts(products, filters)
  }

  // Create filter options (including subcategories)
  const categoryOptions = allCategories.map(cat => ({
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
                  {`${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} found`}
                </p>
              </div>

              <ProductGrid
                products={filteredProducts}
                categories={allCategories}
                showRetailerLinks={true}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
