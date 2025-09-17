import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCategories, getProducts } from '@/lib/cms/data-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, ArrowRight } from 'lucide-react'
import { getCategoryImageUrl } from '@/lib/utils/image-utils'

export const dynamic = 'force-dynamic' // Always fetch fresh data

export const metadata: Metadata = {
  title: 'Product Categories - Premium Mediterranean Products',
  description: 'Explore our curated selection of premium olive oils, vinegars, cooking sprays, and specialty products.',
  openGraph: {
    title: 'Product Categories - Premium Mediterranean Products',
    description: 'Explore our curated selection of premium olive oils, vinegars, cooking sprays, and specialty products.',
  },
}

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ])

  // Sort categories by order
  const sortedCategories = categories.sort((a, b) => (a.order || 0) - (b.order || 0))

  // Get product counts for each category
  const categoriesWithCounts = sortedCategories.map(category => ({
    ...category,
    productCount: products.filter(p => p.categoryId === category.id).length
  }))

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Package className="w-12 h-12 text-amber-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Product Categories
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Discover our curated collection of premium Mediterranean products, 
              each crafted with passion and tradition.
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                Browse All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categoriesWithCounts.map((category, index) => (
              <Card key={category.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64">
                  {category.heroImage ? (
                    <Image
                      src={getCategoryImageUrl(category.heroImage)}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200" />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-900">
                      {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-end p-6">
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700 transition-colors group-hover:gap-3 duration-300"
                  >
                    Explore {category.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {products.length}
              </div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {products.filter(p => p.featured).length}
              </div>
              <div className="text-gray-600">Featured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                100%
              </div>
              <div className="text-gray-600">Premium</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Explore?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Dive into our premium collection and discover the perfect products 
            for your culinary adventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/products">
                Browse All Products
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/recipes">
                View Recipes
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}