import { getCategories, getProducts } from '@/lib/cms/data-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Package, Sparkles, Crown, Star, Leaf } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 py-24 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* Accent lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
        
        <div className="container mx-auto container-padding relative">
          <div className="text-center max-w-5xl mx-auto">
            {/* Leaf Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150"></div>
                <div className="relative bg-gradient-to-br from-primary to-accent p-4 rounded-full">
                  <Leaf className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
              <span className="block text-white mb-2">Premium</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Collections
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-emerald-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              Discover extraordinary Mediterranean flavors through our 
              <span className="text-primary font-medium"> meticulously curated </span>
              selection of premium olive oils, artisanal vinegars, and specialty products.
            </p>
            
            <div className="flex items-center justify-center gap-6 text-emerald-200">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium">Authentic Mediterranean</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Category Cards */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto container-padding">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Our <span className="text-accent">Signature</span> Collections
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Each category represents years of tradition, craftsmanship, and dedication to exceptional quality.
            </p>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23059669%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="container mx-auto container-padding text-center relative">
          {/* Accent lines */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary"></div>
              <Leaf className="w-6 h-6 text-primary" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary"></div>
            </div>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Seeking Something <span className="text-primary">Exceptional</span>?
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-12 leading-relaxed">
            Our culinary experts are here to guide you through custom selections, 
            exclusive collections, and personalized recommendations tailored to your refined taste.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-primary-foreground px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
              <Link href="/contact" className="flex items-center gap-3">
                <Leaf className="w-5 h-5" />
                Connect With Our Experts
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <div className="flex items-center gap-3 text-emerald-200">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-lg">Complimentary consultation</span>
            </div>
          </div>
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
  const icons = [Package, Leaf, Star, Sparkles, Crown, Package, Star];
  const IconComponent = icons[index % icons.length];
  
  return (
    <Link href={`/categories/${category.slug}`} className="block group">
      <div className="relative">
        {/* Background card */}
        <Card className="relative bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 hover:border-primary/40 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden transform hover:-translate-y-3 backdrop-blur-sm">
          {/* Green accent line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          
          {/* Background decoration */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-emerald-100/20 to-emerald-200/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          
          <CardHeader className="relative p-8 lg:p-10">
            {/* Icon section */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                {/* Icon background glow */}
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Icon container */}
                <div className="relative bg-gradient-to-br from-slate-100 to-slate-200/50 p-4 rounded-2xl border border-slate-200/40 group-hover:border-primary/60 group-hover:bg-gradient-to-br group-hover:from-emerald-50 group-hover:to-emerald-100/50 transition-all duration-500">
                  <IconComponent className="w-7 h-7 text-slate-600 group-hover:text-primary transition-colors duration-300" />
                </div>
              </div>
            </div>
            
            {/* Category name */}
            <CardTitle className="text-2xl lg:text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300 mb-4 leading-tight text-center">
              {category.name}
            </CardTitle>
            
            {/* Description */}
            <CardDescription className="text-lg text-slate-600 group-hover:text-slate-700 leading-relaxed transition-colors duration-300 text-center">
              {category.description}
            </CardDescription>
          </CardHeader>

          {/* Bottom section */}
          <CardContent className="relative px-8 lg:px-10 pb-8 lg:pb-10">
            <div className="flex items-center justify-between">
              {/* Explore text */}
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-slate-700 group-hover:text-primary transition-colors duration-300">
                  Explore Collection
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-300"></div>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent p-3 rounded-full border border-slate-200 group-hover:border-primary transition-all duration-300 group-hover:scale-110">
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
            
            {/* Bottom decorative line */}
            <div className="mt-6 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-primary transition-colors duration-500"></div>
          </CardContent>
        </Card>
      </div>
    </Link>
  )
}
