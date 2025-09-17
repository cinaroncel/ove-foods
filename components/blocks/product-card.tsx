'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/cms/types'
import { cardHover } from '@/lib/motion/constants'
import { getProductImageUrl } from '@/lib/utils/image-utils'

interface ProductCardProps {
  product: Product
  category?: string
  showRetailerLinks?: boolean
  className?: string
}

export function ProductCard({ 
  product, 
  category, 
  showRetailerLinks = false,
  className 
}: ProductCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={cardHover}
      className={className}
    >
      <Card className="h-full overflow-hidden group flex flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-white to-gray-50 flex items-center justify-center flex-shrink-0">
          <Link href={`/products/${product.slug}`} className="block w-full h-full flex items-center justify-center p-6">
            <div className="relative w-full h-full">
              <Image
                src={getProductImageUrl(product.images?.[0])}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </Link>
          
          {/* Certifications overlay */}
          {product.certifications.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {product.certifications.slice(0, 2).map((cert) => (
                <Badge 
                  key={cert.label} 
                  variant="secondary" 
                  className="text-xs bg-white/90 text-black"
                >
                  {cert.label}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-brand-primary text-white">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
          <div className="flex-shrink-0">
            {category && (
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                {category}
              </p>
            )}
            <h3 className="font-semibold text-lg leading-tight">
              <Link 
                href={`/products/${product.slug}`}
                className="hover:text-primary transition-colors focus-visible-ring"
              >
                {product.title}
              </Link>
            </h3>
          </div>
          
          <div className="h-[3.75rem] flex items-start">
            <p className="text-sm text-muted-foreground line-clamp-3 leading-5">
              {product.shortCopy || ' '}
            </p>
          </div>
          
          {/* Specs */}
          {product.specs && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-auto">
              {product.specs.volume && (
                <span className="bg-muted px-2 py-1 rounded">
                  {product.specs.volume}
                </span>
              )}
              {product.specs.origin && (
                <span className="bg-muted px-2 py-1 rounded">
                  {product.specs.origin}
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 space-y-3 flex-shrink-0">
          <Button asChild className="w-full">
            <Link href={`/products/${product.slug}`}>
              View Details
            </Link>
          </Button>
          
          {showRetailerLinks && product.retailerLinks.length > 0 && (
            <div className="w-full">
              <p className="text-xs text-muted-foreground mb-2">Available at:</p>
              <div className="flex flex-wrap gap-2">
                {product.retailerLinks.slice(0, 3).map((retailer) => (
                  <a
                    key={retailer.label}
                    href={retailer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline focus-visible-ring"
                  >
                    {retailer.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
