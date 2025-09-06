import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, MapPin, Globe } from 'lucide-react'
import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = generatePageMetadata({
  title: 'Where to Buy - OVE Foods',
  description: 'Find OVE Foods premium olive oils and vinegars at retailers near you. Available at specialty stores, supermarkets, and online.',
  path: '/where-to-buy'
})

// Static retailer data - in a real app, this might come from CMS
const onlineRetailers = [
  {
    name: 'Amazon',
    description: 'Fast shipping, wide selection of our products',
    url: 'https://amazon.com',
    logo: '🛒'
  },
  {
    name: 'Williams Sonoma',
    description: 'Premium culinary products and specialty foods',
    url: 'https://williams-sonoma.com',
    logo: '🍳'
  },
  {
    name: 'Dean & DeLuca',
    description: 'Gourmet foods and specialty ingredients',
    url: 'https://deandeluca.com',
    logo: '🥘'
  },
  {
    name: 'Sur La Table',
    description: 'Cooking tools and premium ingredients',
    url: 'https://surlatable.com',
    logo: '👨‍🍳'
  }
]

const retailChains = [
  {
    name: 'Whole Foods Market',
    description: 'Natural and organic products nationwide',
    locations: '500+ stores',
    region: 'United States',
    logo: '🌿'
  },
  {
    name: 'Kroger',
    description: 'Supermarket chain with specialty food sections',
    locations: '2,700+ stores',
    region: 'United States',
    logo: '🛍️'
  },
  {
    name: 'Safeway',
    description: 'Grocery stores with premium product selection',
    locations: '900+ stores',
    region: 'United States',
    logo: '🏪'
  },
  {
    name: 'Target',
    description: 'General merchandise with specialty food aisles',
    locations: '1,800+ stores',
    region: 'United States',
    logo: '🎯'
  },
  {
    name: 'Metro',
    description: 'Premium grocery chain',
    locations: '650+ stores',
    region: 'Canada',
    logo: '🍁'
  },
  {
    name: 'Tesco',
    description: 'Supermarket with international foods section',
    locations: '3,400+ stores',
    region: 'United Kingdom',
    logo: '🇬🇧'
  }
]

const specialtyStores = [
  {
    name: 'Local Gourmet Shops',
    description: 'Independent specialty food stores',
    findText: 'Use our store locator to find specialty retailers near you'
  },
  {
    name: 'Italian Delis',
    description: 'Authentic Italian food stores and delis',
    findText: 'Many Italian specialty stores carry our products'
  },
  {
    name: 'Farmers Markets',
    description: 'Local farmers markets and artisan food vendors',
    findText: 'Find us at select farmers markets in major cities'
  }
]

export default function WhereToBuyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/20 py-12">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Where to Buy</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find OVE Foods premium olive oils and vinegars at retailers near you. 
              Available online and at specialty stores worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Online Retailers */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Shop Online
            </h2>
            <p className="text-lg text-muted-foreground">
              Order our products online for convenient delivery to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {onlineRetailers.map((retailer) => (
              <Card key={retailer.name} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="text-4xl mb-2">{retailer.logo}</div>
                  <CardTitle className="text-lg">{retailer.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {retailer.description}
                  </p>
                  <Button asChild className="w-full">
                    <a
                      href={retailer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Shop Now
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Retail Chains */}
      <section className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Retail Locations
            </h2>
            <p className="text-lg text-muted-foreground">
              Visit these major retail chains to find our products in-store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retailChains.map((chain) => (
              <Card key={chain.name}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{chain.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{chain.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        {chain.region}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {chain.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{chain.locations}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Stores */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Specialty Stores
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our products at independent specialty food stores and local markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialtyStores.map((store) => (
              <div key={store.name} className="text-center space-y-4">
                <h3 className="text-xl font-bold">{store.name}</h3>
                <p className="text-muted-foreground">{store.description}</p>
                <p className="text-sm text-primary font-medium">{store.findText}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Locator CTA */}
      <section className="section-padding bg-gradient-to-r from-brand-primary to-brand-accent text-white">
        <div className="container mx-auto container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Can't Find Us Near You?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Contact us to suggest a retailer in your area, or ask your local specialty store 
            to carry OVE Foods products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="/contact">Contact Us</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <a href="mailto:retail@ovefoods.com">Retail Inquiries</a>
            </Button>
          </div>
        </div>
      </section>

      {/* International Availability */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              International Availability
            </h2>
            <p className="text-lg text-muted-foreground">
              Our products are available in select markets worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🇺🇸</div>
              <h3 className="text-xl font-bold mb-2">United States</h3>
              <p className="text-muted-foreground">Available nationwide through major retailers and online.</p>
            </div>

            <div>
              <div className="text-4xl mb-4">🇨🇦</div>
              <h3 className="text-xl font-bold mb-2">Canada</h3>
              <p className="text-muted-foreground">Select products available at premium grocery chains.</p>
            </div>

            <div>
              <div className="text-4xl mb-4">🇪🇺</div>
              <h3 className="text-xl font-bold mb-2">Europe</h3>
              <p className="text-muted-foreground">Available in specialty stores across major European markets.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
