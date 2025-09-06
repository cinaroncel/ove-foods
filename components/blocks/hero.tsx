'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { fadeInUp } from '@/lib/motion/constants'

interface HeroProps {
  headline: string
  subcopy: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
  }
  image?: {
    src: string
    alt: string
  }
  video?: {
    src: string
    poster?: string
  }
  className?: string
}

export function Hero({
  headline,
  subcopy,
  primaryCta,
  secondaryCta,
  image,
  video,
  className
}: HeroProps) {
  return (
    <section className={`relative overflow-hidden min-h-screen flex items-center ${className || ''}`}>
      {/* Full Background Video/Image */}
      {video ? (
        <video
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          Your browser does not support the video tag.
        </video>
      ) : image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover -z-10"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-warm/5 to-brand-accent/5 -z-10" />
      )}

      {/* Dark overlay removed since no text content */}

      {/* Content Container - Empty to show only video */}
      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        {/* All text content removed - only background video displays */}
      </div>

      {/* Bottom fade gradient and scroll indicator removed */}
    </section>
  )
}
