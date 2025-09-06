import { StatBadgeGrid } from '@/components/blocks/stat-badge'
import { Hero } from '@/components/blocks/hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSustainabilityMetrics, getSustainabilityPosts } from '@/lib/cms/data-provider'
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

export const revalidate = 3600 // 1 hour

export const metadata: Metadata = generatePageMetadata({
  title: 'Sustainability - OVE Foods',
  description: 'Discover our commitment to sustainable practices, environmental protection, and community support in everything we do.',
  path: '/sustainability'
})

export default async function SustainabilityPage() {
  const [metrics, posts] = await Promise.all([
    getSustainabilityMetrics(),
    getSustainabilityPosts()
  ])

  // Group posts by pillar
  const postsByPillar = posts.reduce((acc, post) => {
    if (!acc[post.pillar]) acc[post.pillar] = []
    acc[post.pillar].push(post)
    return acc
  }, {} as Record<string, typeof posts>)

  return (
    <>
      {/* Hero Section */}
      <Hero
        headline="Sustainability First"
        subcopy="We believe that protecting our planet is essential to preserving the authentic flavors we love. Discover our commitment to sustainable practices across every aspect of our business."
        primaryCta={{
          label: "View Our Impact",
          href: "#metrics"
        }}
        secondaryCta={{
          label: "Learn More",
          href: "#pillars"
        }}
        image={{
          src: "/assets/sustainability-hero.jpg",
          alt: "Solar panels on olive oil production facility with olive groves in background"
        }}
      />

      {/* Sustainability Metrics */}
      <section id="metrics" className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Impact by the Numbers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Measurable progress toward a more sustainable future, 
              one bottle at a time.
            </p>
          </div>
          
          <StatBadgeGrid metrics={metrics} />
        </div>
      </section>

      {/* Sustainability Pillars */}
      <section id="pillars" className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Three Pillars
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our sustainability efforts are built on three foundational pillars 
              that guide our decision-making and operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sourcing Pillar */}
            {postsByPillar.sourcing && (
              <Card className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <CardTitle>Sustainable Sourcing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {postsByPillar.sourcing.map((post) => (
                    <div key={post.id}>
                      <h4 className="font-semibold mb-2">{post.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {post.excerpt}
                      </p>
                      {post.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.badges.map((badge, index) => (
                            <span 
                              key={index}
                              className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                            >
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Environment Pillar */}
            {postsByPillar.environment && (
              <Card className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <CardTitle>Environmental Protection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {postsByPillar.environment.map((post) => (
                    <div key={post.id}>
                      <h4 className="font-semibold mb-2">{post.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {post.excerpt}
                      </p>
                      {post.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.badges.map((badge, index) => (
                            <span 
                              key={index}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Community Pillar */}
            {postsByPillar.community && (
              <Card className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <CardTitle>Community Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {postsByPillar.community.map((post) => (
                    <div key={post.id}>
                      <h4 className="font-semibold mb-2">{post.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {post.excerpt}
                      </p>
                      {post.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.badges.map((badge, index) => (
                            <span 
                              key={index}
                              className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                            >
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Future Goals */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our 2030 Goals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to continuous improvement and have set ambitious 
              targets for the next decade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-primary">Net Zero</div>
              <h3 className="font-semibold">Carbon Emissions</h3>
              <p className="text-sm text-muted-foreground">
                Achieve net-zero carbon emissions across all operations
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-primary">100%</div>
              <h3 className="font-semibold">Renewable Energy</h3>
              <p className="text-sm text-muted-foreground">
                Power all facilities with renewable energy sources
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-primary">Zero</div>
              <h3 className="font-semibold">Waste to Landfill</h3>
              <p className="text-sm text-muted-foreground">
                Eliminate all production waste sent to landfills
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-primary">1000+</div>
              <h3 className="font-semibold">Farmers Supported</h3>
              <p className="text-sm text-muted-foreground">
                Partner with over 1000 local farmers globally
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
