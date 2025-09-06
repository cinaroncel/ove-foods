'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, ExternalLink, Printer } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Location } from '@/lib/cms/types'
import { fadeInUp } from '@/lib/motion/constants'

interface ContactBlockProps {
  location: Location
  showMap?: boolean
  className?: string
}

export function ContactBlock({ location, showMap = true, className }: ContactBlockProps) {
  const fullAddress = `${location.address.street}, ${location.address.city}, ${location.address.region} ${location.address.postal}, ${location.address.country}`
  
  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case 'Headquarters': return 'Headquarters'
      case 'Factory': return 'Production Factory'
      case 'Office': return 'Office'
      default: return type
    }
  }

  return (
    <motion.div
      initial={fadeInUp.initial}
      whileInView={fadeInUp.animate}
      transition={fadeInUp.transition}
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      <Card className="h-full">
        {showMap && location.mapUrl && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
            {/* Static map image - in a real implementation, you'd generate this */}
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            
            {/* Map overlay with link */}
            <a
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 focus-visible-ring"
              aria-label={`View ${location.name} on map`}
            >
              <div className="bg-white/90 rounded-full p-3 shadow-lg">
                <ExternalLink className="h-6 w-6 text-primary" />
              </div>
            </a>
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{location.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getLocationTypeLabel(location.type)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Address */}
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm leading-relaxed">{fullAddress}</p>
              {location.mapUrl && (
                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline focus-visible-ring mt-1"
                >
                  View on map
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Phone */}
          {location.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <a
                href={`tel:${location.phone}`}
                className="text-sm hover:text-primary transition-colors focus-visible-ring"
              >
                {location.phone}
              </a>
            </div>
          )}

          {/* Fax */}
          {location.fax && (
            <div className="flex items-center space-x-3">
              <Printer className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">
                {location.fax}
              </span>
            </div>
          )}

          {/* Email */}
          {location.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <a
                href={`mailto:${location.email}`}
                className="text-sm hover:text-primary transition-colors focus-visible-ring"
              >
                {location.email}
              </a>
            </div>
          )}

          {/* Hours */}
          {location.hours && (
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm">{location.hours}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface ContactBlockGridProps {
  locations: Location[]
  showMaps?: boolean
  className?: string
}

export function ContactBlockGrid({ 
  locations, 
  showMaps = true, 
  className 
}: ContactBlockGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className || ''}`}>
      {locations.map((location) => (
        <ContactBlock
          key={location.id}
          location={location}
          showMap={showMaps}
        />
      ))}
    </div>
  )
}
