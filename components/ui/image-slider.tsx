'use client'

import * as React from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageSliderProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageSlider({ images, alt, className }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!images || images.length === 0) return null

  // If only one image, show it without slider controls
  if (images.length === 1) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg bg-white">
          <Image
            src={images[0]}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4"
            priority
          />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg bg-white group">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-4 transition-opacity duration-300"
          priority
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative aspect-square rounded overflow-hidden bg-white transition-all duration-200",
                currentIndex === index 
                  ? "ring-2 ring-primary ring-offset-2 shadow-md" 
                  : "hover:shadow-md hover:scale-105"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 10vw"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Dots Indicator (for mobile) */}
      {images.length > 1 && images.length <= 8 && (
        <div className="flex justify-center gap-2 md:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                currentIndex === index 
                  ? "bg-primary scale-125" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}