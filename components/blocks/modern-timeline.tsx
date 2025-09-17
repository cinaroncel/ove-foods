'use client'

import * as React from 'react'
import Image from 'next/image'
import { useScroll, useTransform, motion } from "framer-motion";
import type { StoryPost } from '@/lib/cms/types'

interface ModernTimelineProps {
  posts: StoryPost[]
  className?: string
}

export function ModernTimeline({ posts, className }: ModernTimelineProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Sort posts by year if available
  const sortedPosts = React.useMemo(() => {
    return [...posts].sort((a, b) => {
      if (!a.year || !b.year) return 0
      return a.year - b.year
    })
  }, [posts])

  return (
    <div className={`w-full bg-background font-sans md:px-10 ${className || ''}`} ref={containerRef}>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {sortedPosts.map((post, index) => (
          <div
            key={post.id}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="absolute left-2 md:left-2 flex items-center justify-center">
                <Image
                  src="/assets/scrollolive.png"
                  alt="Olive Branch"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-3xl font-bold text-primary">
                {post.year}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-primary">
                {post.year}
              </h3>
              
              <div className="space-y-6">
                {/* Title */}
                <h4 className="text-2xl md:text-3xl font-bold text-foreground">
                  {post.title}
                </h4>
                
                {/* Content */}
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {post.content}
                </p>
                
                {/* Excerpt if different from content */}
                {post.excerpt && post.excerpt !== post.content && (
                  <p className="text-sm text-muted-foreground italic">
                    {post.excerpt}
                  </p>
                )}
                
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl max-w-2xl">
                  <Image
                    src={`/assets/facilities/${post.coverImage}`}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Animated timeline line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary via-primary/50 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}