import { generatePageMetadata } from '@/lib/seo/metadata'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = generatePageMetadata({
  title: 'Certifications - OVE Foods',
  description: 'OVE Foods holds internationally recognized certifications including ISO standards, USDA Organic, Kosher, JAS, and FSSC certifications ensuring the highest quality and safety standards.',
  path: '/certifications'
})

const certifications = [
  {
    name: 'ISO 22000',
    description: 'Food Safety Management System',
    category: 'Food Safety'
  },
  {
    name: 'KOSHER',
    description: 'Kosher Certification',
    category: 'Religious Standards'
  },
  {
    name: 'JAS',
    description: 'Japanese Agricultural Standards',
    category: 'Quality Standards'
  },
  {
    name: 'USDA ORGANIC',
    description: 'United States Department of Agriculture Organic Certification',
    category: 'Organic Standards'
  },
  {
    name: 'ISO 14001',
    description: 'Environmental Management System',
    category: 'Environmental'
  },
  {
    name: 'ISO 9001:2015',
    description: 'Quality Management System',
    category: 'Quality Management'
  },
  {
    name: 'ISO 45001',
    description: 'Occupational Health and Safety Management System',
    category: 'Health & Safety'
  },
  {
    name: 'FSSC 22000',
    description: 'Food Safety System Certification',
    category: 'Food Safety'
  }
]

export default function CertificationsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/20 py-16">
        <div className="container mx-auto container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Our Certifications
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              OVE Foods maintains the highest standards of quality, safety, and sustainability through 
              internationally recognized certifications. These credentials demonstrate our unwavering 
              commitment to excellence in every aspect of our operations.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Display */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          {/* All Certifications Visual */}
          <div className="mb-16 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-primary/10">
              <Image
                src="/assets/certifications/all-certifications.png"
                alt="OVE Foods Certifications - ISO 22000, KOSHER, JAS, USDA ORGANIC, ISO 14001, ISO 9001:2015, ISO 45001, FSSC 22000"
                width={800}
                height={400}
                className="w-full h-auto mx-auto rounded-lg"
                priority
                quality={90}
              />
              <p className="text-sm text-muted-foreground mt-4 italic">
                Our internationally recognized certifications ensuring the highest quality and safety standards
              </p>
            </div>
          </div>

          {/* Individual Certification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="text-2xl font-bold text-primary">
                      {cert.name.split(' ')[0]}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {cert.name}
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {cert.description}
                  </p>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {cert.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Our Certifications Mean */}
      <section className="section-padding bg-muted/20">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our Certifications Mean
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each certification represents our dedication to maintaining the highest standards 
              in quality, safety, and environmental responsibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <div className="text-2xl">🛡️</div>
              </div>
              <h3 className="text-xl font-bold">Food Safety</h3>
              <p className="text-muted-foreground">
                Our ISO 22000 and FSSC 22000 certifications ensure the highest levels of food safety 
                management throughout our production process.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <div className="text-2xl">⭐</div>
              </div>
              <h3 className="text-xl font-bold">Quality Management</h3>
              <p className="text-muted-foreground">
                ISO 9001:2015 certification demonstrates our commitment to consistent quality 
                and continuous improvement in all our processes.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <div className="text-2xl">🌿</div>
              </div>
              <h3 className="text-xl font-bold">Environmental Responsibility</h3>
              <p className="text-muted-foreground">
                Our ISO 14001 certification reflects our dedication to environmental management 
                and sustainable business practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container mx-auto container-padding text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Trust in Quality
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our certifications are more than just credentials—they're our promise to deliver 
              products that meet the highest international standards of quality, safety, and sustainability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/products" 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Explore Our Products
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}