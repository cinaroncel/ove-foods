import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCategoriesWithSubs, getProductsByCategoryIncludingSubs, getProductsByCategory } from '@/lib/cms/data-provider'
import { ProductGrid } from '@/components/blocks/product-grid'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Package, Droplets, Sparkles, Crown, Coffee, Salad, Gift } from 'lucide-react'
import { getCategoryImageUrl } from '@/lib/utils/image-utils'

export const dynamic = 'force-dynamic' // Always fetch fresh data

// Category-specific styling and icons
const getCategoryTheme = (slug: string) => {
  const themes: Record<string, {
    icon: any;
    gradient: string;
    bgPattern: string;
    accentColor: string;
    badgeText: string;
  }> = {
    'olive-oils': {
      icon: Droplets,
      gradient: 'from-emerald-900 via-emerald-800 to-green-900',
      bgPattern: '#059669',
      accentColor: 'text-emerald-400',
      badgeText: 'Premium Quality'
    },
    'organic-extra-virgin-olive-oil': {
      icon: Sparkles,
      gradient: 'from-green-900 via-emerald-800 to-teal-900',
      bgPattern: '#0d9488',
      accentColor: 'text-teal-400',
      badgeText: 'Organic & Pure'
    },
    'extra-virgin-olive-oil': {
      icon: Crown,
      gradient: 'from-amber-900 via-yellow-800 to-orange-900',
      bgPattern: '#d97706',
      accentColor: 'text-amber-400',
      badgeText: 'Extra Virgin'
    },
    'vinegars': {
      icon: Droplets,
      gradient: 'from-red-900 via-rose-800 to-pink-900',
      bgPattern: '#be123c',
      accentColor: 'text-rose-400',
      badgeText: 'Aged & Refined'
    },
    'honey': {
      icon: Coffee,
      gradient: 'from-yellow-900 via-amber-800 to-orange-900',
      bgPattern: '#f59e0b',
      accentColor: 'text-yellow-400',
      badgeText: 'Pure & Natural'
    },
    'seasoning': {
      icon: Salad,
      gradient: 'from-orange-900 via-red-800 to-rose-900',
      bgPattern: '#dc2626',
      accentColor: 'text-orange-400',
      badgeText: 'Artisanal Blend'
    },
    'gourmet-products': {
      icon: Gift,
      gradient: 'from-purple-900 via-indigo-800 to-blue-900',
      bgPattern: '#7c3aed',
      accentColor: 'text-purple-400',
      badgeText: 'Gourmet Selection'
    },
    'specialty': {
      icon: Sparkles,
      gradient: 'from-indigo-900 via-purple-800 to-pink-900',
      bgPattern: '#8b5cf6',
      accentColor: 'text-indigo-400',
      badgeText: 'Specialty Items'
    },
    'pure-olive-oil': {
      icon: Droplets,
      gradient: 'from-green-900 via-teal-800 to-cyan-900',
      bgPattern: '#059669',
      accentColor: 'text-green-400',
      badgeText: 'Pure & Clean'
    },
    'infused-olive-oils': {
      icon: Sparkles,
      gradient: 'from-violet-900 via-purple-800 to-fuchsia-900',
      bgPattern: '#a855f7',
      accentColor: 'text-violet-400',
      badgeText: 'Infused Flavors'
    }
  }
  
  // Default theme for any category not specifically defined
  return themes[slug] || {
    icon: Package,
    gradient: 'from-slate-900 via-gray-800 to-slate-900',
    bgPattern: '#64748b',
    accentColor: 'text-slate-400',
    badgeText: 'Premium Collection'
  }
}

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // Block cooking sprays category explicitly
  if (params.slug === 'cooking-sprays') {
    return {
      title: 'Category Not Found'
    }
  }
  
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
  
  // Filter out cooking sprays
  const filteredCategories = allCategories.filter(category => category.slug !== 'cooking-sprays')
  
  return filteredCategories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Block cooking sprays category explicitly
  if (params.slug === 'cooking-sprays') {
    notFound()
  }
  
  const categoriesWithSubs = await getCategoriesWithSubs()
  
  // Get theme for this category
  const theme = getCategoryTheme(params.slug)
  const IconComponent = theme.icon
  
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
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
      <section className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} py-24 lg:py-32`}>
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27${encodeURIComponent(theme.bgPattern)}%27%20fill-opacity%3D%270.05%27%3E%3Ccircle%20cx%3D%2730%27%20cy%3D%2730%27%20r%3D%274%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Accent lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* Category Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150"></div>
                <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-full">
                  <IconComponent className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className={`${theme.accentColor} bg-white/10 border-white/20 px-4 py-2 text-sm font-medium`}>
                {theme.badgeText}
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
              <span className="block text-white mb-2">{category.name.split(' ').slice(0, -1).join(' ')}</span>
              <span className={`block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent`}>
                {category.name.split(' ').slice(-1)[0]}
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              {category.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme.accentColor}`}>{categoryProducts.length}+</div>
                <div className="text-white/80 text-sm">Products</div>
              </div>
              {subcategories.length > 0 && (
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme.accentColor}`}>{subcategories.length}</div>
                  <div className="text-white/80 text-sm">Categories</div>
                </div>
              )}
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme.accentColor}`}>Premium</div>
                <div className="text-white/80 text-sm">Quality</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Learn More
              </Button>
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