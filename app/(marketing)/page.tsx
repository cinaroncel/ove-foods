import { Hero } from '@/components/blocks/hero'
import { ProductGrid } from '@/components/blocks/product-grid'
import { RecipeGrid } from '@/components/blocks/recipe-grid'
import { ModernTimeline } from '@/components/blocks/modern-timeline'
import { StatBadgeGrid } from '@/components/blocks/stat-badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  getFeaturedProducts, 
  getFeaturedRecipes, 
  getStoryPosts,
  getSustainabilityMetrics,
  getCategories,
  getHeroSettings
} from '@/lib/cms/data-provider'
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic' // Always fetch fresh data

export const metadata: Metadata = generatePageMetadata({
  title: 'OVE Foods - Premium Mediterranean Olive Oils & Culinary Products',
  description: 'Discover premium olive oils, aged vinegars, and gourmet culinary products crafted with Mediterranean tradition. From our family to your kitchen.',
  path: '/'
})

export default async function HomePage() {
  // Fetch data for the page
  const [featuredProducts, featuredRecipes, storyPosts, sustainabilityMetrics, categories, heroSettings] = await Promise.all([
    getFeaturedProducts(8),
    getFeaturedRecipes(6),
    getStoryPosts(),
    getSustainabilityMetrics(),
    getCategories(),
    getHeroSettings()
  ])

  // Get featured story posts for timeline
  const timelinePosts = storyPosts.filter(post => post.featured).slice(0, 3)
  
  // Get top sustainability metrics
  const topMetrics = sustainabilityMetrics.slice(0, 3)

  return (
    <>
      {/* Hero Section */}
      <Hero
        headline={heroSettings.headline}
        subcopy={heroSettings.subcopy}
        primaryCta={heroSettings.primaryCta}
        secondaryCta={heroSettings.secondaryCta}
        video={{
          src: heroSettings.videoSrc
        }}
      />

      {/* Story Teaser Section */}
      {timelinePosts.length > 0 && (
        <section className="section-padding bg-muted/20">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Our Story
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From a family olive oil business established in Turkey in 1948 to a global premium food brand, 
                discover three generations of passion and tradition behind OVE Foods.
              </p>
            </div>
            
            <ModernTimeline posts={timelinePosts} className="mb-12" />
            
            <div className="text-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/our-story">Read Our Full Story</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most beloved oils and vinegars, each crafted with care and tradition.
            </p>
          </div>
          
          <ProductGrid 
            products={featuredProducts} 
            categories={categories}
            className="mb-8"
          />
          
          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recipes Teaser Section */}
      <section className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Inspired Recipes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Elevate your cooking with Mediterranean-inspired recipes featuring our premium products.
            </p>
          </div>
          
          <RecipeGrid 
            recipes={featuredRecipes}
            className="mb-8"
          />
          
          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/recipes">Discover All Recipes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sustainability Highlights */}
      {topMetrics.length > 0 && (
        <section className="section-padding">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Sustainability Commitment
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're committed to protecting our planet while crafting exceptional products. 
                Here's how we're making a difference.
              </p>
            </div>
            
            <StatBadgeGrid metrics={topMetrics} className="mb-12" />
            
            <div className="text-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/sustainability">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Strip */}
      <section className="section-padding bg-gradient-to-r from-brand-primary to-brand-accent text-white">
        <div className="container mx-auto container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Elevate Your Cooking?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Find OVE Foods products at premium retailers near you or discover 
            new recipes to inspire your culinary journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link href="/recipes">View Recipes</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
