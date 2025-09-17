import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCategoriesWithSubs, getProductsByCategoryIncludingSubs, getProductsByCategory } from '@/lib/cms/data-provider'
import { ProductGrid } from '@/components/blocks/product-grid'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'
import { getCategoryImageUrl } from '@/lib/utils/image-utils'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoriesWithSubs = await getCategoriesWithSubs()
  
  // Flatten categories to include subcategories
  const allCategories: any[] = []
  categoriesWithSubs.forEach(category => {
    allCategories.push(category)
    if (category.subcategories) {
      allCategories.push(...category.subcategories)
    }
  })
  
  const category = allCategories.find(c => c.slug === params.slug)

  if (!category) {
    return {
      title: 'Category Not Found'
    }
  }

  return {
    title: `${category.name} - Premium Products`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Premium Products`,
      description: category.description,
      images: category.heroImage ? [category.heroImage] : [],
    },
  }
}

export async function generateStaticParams() {
  const categoriesWithSubs = await getCategoriesWithSubs()
  
  // Include both parent categories and subcategories
  const allCategories: any[] = []
  categoriesWithSubs.forEach(category => {
    allCategories.push(category)
    if (category.subcategories) {
      allCategories.push(...category.subcategories)
    }
  })
  
  return allCategories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoriesWithSubs = await getCategoriesWithSubs()
  
  // Flatten categories to include subcategories
  const allCategories: any[] = []
  categoriesWithSubs.forEach(category => {
    allCategories.push(category)
    if (category.subcategories) {
      allCategories.push(...category.subcategories)
    }
  })
  
  const category = allCategories.find(c => c.slug === params.slug)

  if (!category) {
    notFound()
  }

  // Get products based on category type
  let categoryProducts: any[]
  if (category.parentCategoryId) {
    // This is a subcategory - show only products from this subcategory
    categoryProducts = await getProductsByCategory(category.id)
  } else {
    // This is a parent category - show products from this category AND all its subcategories
    categoryProducts = await getProductsByCategoryIncludingSubs(category.id)
  }
  
  // Also get subcategories if this is a parent category (for navigation)
  const subcategories = category.parentCategoryId ? [] : categoriesWithSubs.find(c => c.id === category.id)?.subcategories || []

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Products
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        {category.heroImage ? (
          <Image
            src={getCategoryImageUrl(category.heroImage)}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 text-white">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-8 h-8" />
                <span className="text-lg font-medium opacity-90">Category</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {category.name}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subcategories Navigation - Only show for parent categories with subcategories */}
      {subcategories.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Removed Shop by Type text - keeping cards only */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subcategories.map((subcategory: any) => (
                <Link
                  key={subcategory.id}
                  href={`/categories/${subcategory.slug}`}
                  className="group p-6 bg-white rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
                >
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {subcategory.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      {subcategory.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our {category.name}
                </h2>
                <p className="text-gray-600">
                  {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
          </div>

          {categoryProducts.length > 0 ? (
            <ProductGrid 
              products={categoryProducts} 
              categories={allCategories}
              loading={false}
            />
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600 mb-8">
                We're currently updating our {category.name.toLowerCase()} selection.
              </p>
              <Button asChild>
                <Link href="/products">
                  Browse All Products
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      {allCategories.filter(c => !c.parentCategoryId).length > 1 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Other Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allCategories
                .filter(c => c.id !== category.id && !c.parentCategoryId)
                .slice(0, 3)
                .map((otherCategory) => (
                  <Link
                    key={otherCategory.id}
                    href={`/categories/${otherCategory.slug}`}
                    className="group"
                  >
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      {otherCategory.heroImage ? (
                        <Image
                          src={getCategoryImageUrl(otherCategory.heroImage)}
                          alt={otherCategory.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute inset-0 flex items-end p-6">
                        <h3 className="text-white text-xl font-semibold">
                          {otherCategory.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 group-hover:text-gray-900 transition-colors">
                      {otherCategory.description}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our complete collection of premium products or get in touch with our team 
            for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/products">
                Browse All Products
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}