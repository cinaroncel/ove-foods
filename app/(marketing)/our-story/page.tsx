import { ModernTimeline } from '@/components/blocks/modern-timeline'
import { Hero } from '@/components/blocks/hero'
import { getStoryPosts } from '@/lib/cms/data-provider'
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

export const revalidate = 3600 // 1 hour

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Story - OVE Foods',
  description: 'From a small family farm in Tuscany to a global premium food brand, discover the passion and tradition behind OVE Foods.',
  path: '/our-story'
})

export default async function OurStoryPage() {
  const storyPosts = await getStoryPosts()

  return (
    <>
      {/* Hero Section */}
      <Hero
        headline="Our Journey"
        subcopy="From a family olive oil business established in Turkey in 1948 to a global premium food brand, our story spans three generations of dedication to quality and tradition."
        primaryCta={{
          label: "Explore Products",
          href: "/products"
        }}
        secondaryCta={{
          label: "Visit Our Facilities",
          href: "/contact"
        }}
        video={{
          src: "/assets/hero-video.mp4",
          poster: "/assets/story-hero.jpg"
        }}
      />

      {/* Story Timeline */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Milestones in Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each chapter of our story represents a commitment to excellence, 
              sustainability, and the authentic Mediterranean tradition.
            </p>
          </div>
          
          <ModernTimeline posts={storyPosts} />
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do, from sourcing our olives 
              to crafting the final product.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <div className="text-2xl">🌿</div>
              </div>
              <h3 className="text-xl font-bold">Authenticity</h3>
              <p className="text-muted-foreground">
                We honor traditional Mediterranean methods passed down through generations, 
                ensuring every product reflects its authentic heritage.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <div className="text-2xl">🌍</div>
              </div>
              <h3 className="text-xl font-bold">Sustainability</h3>
              <p className="text-muted-foreground">
                We're committed to protecting our planet through sustainable farming practices, 
                renewable energy, and responsible packaging.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <div className="text-2xl">⭐</div>
              </div>
              <h3 className="text-xl font-bold">Excellence</h3>
              <p className="text-muted-foreground">
                From grove to bottle, we maintain the highest standards of quality, 
                ensuring every product meets our exacting specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mediterranean Heritage */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              The Mediterranean Tradition
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding the deep heritage and health benefits of olive oil
            </p>
          </div>
          
          <div className="prose prose-lg max-w-4xl mx-auto space-y-6">
            <p>
              Olive oil has been a staple of Mediterranean cultures for thousands of years, dating back to the Ancient Greeks and Romans, and it remains the most popular cooking oil in the region to this day. In fact, nutrition experts believe the Mediterranean basin is home to some of the longest-living populations precisely because their typical daily diet is so abundant in healthy fats from olive oil.
            </p>
            <p>
              Compared to other cooking oils, olive oil has the unique potential to deliver a one-two punch to chronic and degenerative diseases from the potent polyphenol compounds found in extra virgin olive oil and the high percentage of monounsaturated fatty acids (MUFAs) found in all grades. As a result, olive oil consumption has been associated with everything from improved cholesterol levels to better mood to stronger bones.
            </p>
          </div>
        </div>
      </section>

      {/* Family Legacy */}
      <section className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Three Generations of Excellence
              </h2>
              <div className="prose prose-lg">
                <p>
                  Our group of companies date back the year of 1948. In this year, our Grandfather has founded family's olive oil business by establishing storing and filling facilities. By the time his company has become the largest olive oil vendor in the local market.
                </p>
                <p>
                  Today, the third generation has made our group of companies export to around forty countries with modern olive oil storage and filling facilities and additional units for the storage and filling of vinegars and sauces and condiments.
                </p>
                <p>
                  Our companies are still operating in Izmir and Aydin. They are either one of the most important suppliers of the main exporters in the country or one of the exporters with the largest supply potential.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
                  <p>The Olivetti Family</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
