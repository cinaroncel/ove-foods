import { getCategories, getProducts } from '@/lib/cms/data-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Package, Sparkles } from 'lucide-react'
import type { Category } from '@/lib/cms/types'

export const dynamic = 'force-dynamic' // Always fetch fresh data

export default async function ProductsPage() {
  // Load data server-side
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts()
  ])

  // Sort categories by order
  const sortedCategories = categories.sort((a, b) => (a.order || 0) - (b.order || 0))

  // Get product count for each category
  const categoriesWithCounts = sortedCategories.map(category => ({
    ...category,
    productCount: products.filter(p => p.categoryId === category.id).length
  }))

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-muted/20 py-20">
        <div className="container mx-auto container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Explore Our Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover premium Mediterranean flavors through our carefully curated collection 
              of olive oils, vinegars, and specialty products.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>{categories.length} Premium Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categoriesWithCounts.map((category, index) => (
              <CategoryPathwayCard 
                key={category.id}
                category={category} 
                productCount={category.productCount}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Get in touch with our team for custom orders, bulk purchasing, 
            or questions about our products.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

interface CategoryPathwayCardProps {
  category: Category & { productCount: number }
  productCount: number
  index: number
}

function CategoryPathwayCard({ category, productCount, index }: CategoryPathwayCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="block group">
      <Card className="bg-white border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden transform hover:-translate-y-2">
        <div className="relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" />
          
          {/* Floating decorative element */}
          <div className="absolute -top-2 -right-2 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-700" />
          
          <CardHeader className="relative p-8">
            {/* Icon and title section */}
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </CardTitle>
              </div>
              
              {/* Animated arrow */}
              <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            
            {/* Description */}
            <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {category.description}
            </CardDescription>
          </CardHeader>

          {/* Bottom action area */}
          <CardContent className="relative p-8 pt-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                Explore Collection
              </span>
              
              {/* Animated underline */}
              <div className="h-0.5 bg-primary/20 group-hover:bg-primary flex-1 ml-4 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
