import { Hero } from '@/components/blocks/hero'
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'
import Image from 'next/image'

export const revalidate = 3600 // 1 hour

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Brands - OVE Foods',
  description: 'Discover the premium brands in the OVE Foods family, each crafted with dedication to quality and Mediterranean tradition.',
  path: '/brands'
})

export default function BrandsPage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        headline="Our Brands"
        subcopy="Discover the premium brands in the OVE Foods family, each crafted with dedication to quality and Mediterranean tradition."
        primaryCta={{
          label: "Explore Products",
          href: "/products"
        }}
        video={{
          src: "/assets/hero-video.mp4",
          poster: "/assets/story-hero.jpg"
        }}
      />

      {/* Brands Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Premium Brands
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Each brand represents our commitment to excellence, authenticity, and the finest Mediterranean quality.
            </p>
          </div>

          {/* Individual Brands Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Ovelio */}
            <div className="flex items-center justify-center p-8 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="relative w-full h-32">
                <Image
                  src="/assets/brands/ovelio.png"
                  alt="Ovelio"
                  fill
                  className="object-contain object-center"
                  priority
                />
              </div>
            </div>

            {/* Ovelino */}
            <div className="flex items-center justify-center p-8 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="relative w-full h-32">
                <Image
                  src="/assets/brands/ovelino.png"
                  alt="Ovelino"
                  fill
                  className="object-contain object-center"
                />
              </div>
            </div>

            {/* Ovelion */}
            <div className="flex items-center justify-center p-8 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="relative w-full h-32">
                <Image
                  src="/assets/brands/ovelion.png"
                  alt="Ovelion"
                  fill
                  className="object-contain object-center"
                />
              </div>
            </div>

            {/* Ravelli */}
            <div className="flex items-center justify-center p-8 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="relative w-full h-32">
                <Image
                  src="/assets/brands/ravelli.png"
                  alt="Ravelli"
                  fill
                  className="object-contain object-center"
                />
              </div>
            </div>

            {/* Ayasaranda Organic */}
            <div className="flex items-center justify-center p-8 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="relative w-full h-32">
                <Image
                  src="/assets/brands/ayasaranda.png"
                  alt="Ayasaranda Organic"
                  fill
                  className="object-contain object-center"
                />
              </div>
            </div>

            {/* Clemente */}
            <div className="flex items-center justify-center p-8 bg-white rounded-lg border hover:shadow-lg transition-shadow">
              <div className="relative w-full h-32">
                <Image
                  src="/assets/brands/clemente.png"
                  alt="Clemente"
                  fill
                  className="object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values Section */}
      <section className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Unites Our Brands
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              While each brand has its unique identity, they all share the core values that define OVE Foods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <div className="text-2xl">🏆</div>
              </div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-muted-foreground">
                Every brand upholds the highest standards of quality, from sourcing to production.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <div className="text-2xl">🌿</div>
              </div>
              <h3 className="text-xl font-bold">Authentic Heritage</h3>
              <p className="text-muted-foreground">
                Rooted in Mediterranean tradition and three generations of expertise.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <div className="text-2xl">✨</div>
              </div>
              <h3 className="text-xl font-bold">Global Excellence</h3>
              <p className="text-muted-foreground">
                Trusted by customers in over 40 countries worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
