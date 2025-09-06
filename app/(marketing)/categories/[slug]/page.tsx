import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCategories, getProducts } from '@/lib/cms/data-provider'
import { ProductGrid } from '@/components/blocks/product-grid'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package } from 'lucide-react'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getCategories()
  const category = categories.find(c => c.slug === params.slug)

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
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ])

  const category = categories.find(c => c.slug === params.slug)

  if (!category) {
    notFound()
  }

  // Filter products for this category
  const categoryProducts = products.filter(p => p.categoryId === category.id)

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
            src={`/assets/categories/${category.heroImage}`}
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
              categories={categories}
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
      {categories.length > 1 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Other Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories
                .filter(c => c.id !== category.id)
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
                          src={`/assets/categories/${otherCategory.heroImage}`}
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