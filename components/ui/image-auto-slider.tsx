'use client'

import React from 'react';
import Image from 'next/image';

interface ImageAutoSliderProps {
  images?: string[];
  className?: string;
}

export const ImageAutoSlider = ({ 
  images,
  className = "" 
}: ImageAutoSliderProps) => {
  // Default images from the self-slider folder
  const defaultImages = [
    "/assets/self-slider/slide1.jpg",
    "/assets/self-slider/slide2.jpg", 
    "/assets/self-slider/slide3.jpg",
    "/assets/self-slider/slide4.jpg",
    "/assets/self-slider/slide5.jpg",
    "/assets/self-slider/slide6.jpg"
  ];

  const slideImages = images || defaultImages;
  
  // Duplicate images for seamless loop
  const duplicatedImages = [...slideImages, ...slideImages];

  return (
    <>
      <style jsx>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .infinite-scroll {
          animation: scroll-right 25s linear infinite;
        }

        .scroll-container {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }

        .image-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-item:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>
      
      <div className={`w-full relative overflow-hidden flex items-center justify-center py-12 ${className}`}>
        {/* Scrolling images container */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <div className="scroll-container w-full max-w-7xl">
            <div className="infinite-scroll flex gap-6 w-max">
              {duplicatedImages.map((imageSrc, index) => (
                <div
                  key={index}
                  className="image-item flex-shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-xl overflow-hidden shadow-2xl border border-border/20"
                >
                  <Image
                    src={imageSrc}
                    alt={`Gallery image ${(index % slideImages.length) + 1}`}
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                    loading={index < 3 ? "eager" : "lazy"}
                    priority={index < 2}
                    quality={75}
                    sizes="(max-width: 768px) 192px, (max-width: 1024px) 256px, 320px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};