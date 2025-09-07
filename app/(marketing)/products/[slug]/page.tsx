import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, Award, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RecipeGrid } from '@/components/blocks/recipe-grid'
import { 
  getProductBySlug, 
  getCategoryBySlug,
  getRecipesByProductId,
  getProducts
} from '@/lib/cms/data-provider'
import { 
  generateProductMetadata, 
  generateProductJsonLd, 
  generateBreadcrumbJsonLd 
} from '@/lib/seo/metadata'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: { slug: string }
}

export const dynamic = 'force-dynamic' // Always fetch fresh data

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return {}
  
  return generateProductMetadata(product)
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)
  
  if (!product) {
    notFound()
  }

  const [category, relatedRecipes] = await Promise.all([
    getCategoryBySlug(product.categoryId),
    getRecipesByProductId(product.id)
  ])

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.title, url: `/products/${product.slug}` }
  ]

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductJsonLd(product, category?.name)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems)),
        }}
      />

      {/* Breadcrumb */}
      <nav className="bg-muted/20 py-4" aria-label="Breadcrumb">
        <div className="container mx-auto container-padding">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => (
              <li key={item.url} className="flex items-center">
                {index > 0 && <span className="mx-2 text-muted-foreground">/</span>}
                {index === breadcrumbItems.length - 1 ? (
                  <span className="font-medium">{item.name}</span>
                ) : (
                  <Link 
                    href={item.url as any}
                    className="text-muted-foreground hover:text-primary transition-colors focus-visible-ring"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Product Details */}
      <section className="section-padding">
        <div className="container mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg bg-white">
                <Image
                  src={`/assets/products/${product.images[0]}`}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4"
                  priority
                />
              </div>
              
              {/* Thumbnail gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative aspect-square rounded overflow-hidden bg-white">
                      <Image
                        src={`/assets/products/${image}`}
                        alt={`${product.title} view ${index + 2}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                        className="object-contain p-1"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category and Featured Badge */}
              <div className="flex items-center gap-2">
                {category && (
                  <Badge variant="secondary">{category.name}</Badge>
                )}
                {product.featured && (
                  <Badge className="bg-brand-primary text-white">Featured</Badge>
                )}
              </div>

              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.title}</h1>
                <p className="text-lg text-muted-foreground">{product.shortCopy}</p>
              </div>

              {/* Certifications */}
              {product.certifications.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {product.certifications.map((cert) => (
                    <div key={cert.label} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{cert.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Specifications */}
              {product.specs && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Product Specifications</h3>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(product.specs).map(([key, value]) => (
                      value && (
                        <React.Fragment key={key}>
                          <dt className="text-muted-foreground capitalize">{key}:</dt>
                          <dd className="font-medium">{value}</dd>
                        </React.Fragment>
                      )
                    ))}
                  </dl>
                </div>
              )}

              {/* Awards */}
              {product.awards.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Awards & Recognition
                  </h3>
                  <ul className="space-y-2">
                    {product.awards.map((award, index) => (
                      <li key={index} className="text-sm">
                        <strong>{award.name}</strong> - {award.year}
                        {award.link && (
                          <a
                            href={award.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Learn more <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Section */}
              <div>
                <h3 className="font-semibold mb-3">Interested in This Product?</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Get in touch with our team for more information about this product, 
                    availability, and bulk ordering options.
                  </p>
                  <Button asChild>
                    <Link href="/contact" className="inline-flex items-center gap-2">
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Long Description */}
          <div className="prose prose-lg max-w-none mb-16">
            <h2>About This Product</h2>
            <div dangerouslySetInnerHTML={{ __html: product.longCopy }} />
          </div>

          {/* Nutrition Information */}
          {product.nutrition && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Nutrition Information</h2>
              <div className="bg-muted/20 rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(product.nutrition).map(([key, value]) => (
                    value && (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-primary">{value}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section className="section-padding bg-muted/20">
          <div className="container mx-auto container-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Recipes Featuring This Product
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover delicious ways to use {product.title} in your cooking.
              </p>
            </div>
            
            <RecipeGrid recipes={relatedRecipes.slice(0, 6)} />
            
            {relatedRecipes.length > 6 && (
              <div className="text-center mt-8">
                <Button asChild variant="outline">
                  <Link href={`/recipes?product=${product.id}`}>
                    View All Recipes
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  )
}
