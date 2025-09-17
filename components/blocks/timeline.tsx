'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { slideInLeft, slideInRight } from '@/lib/motion/constants'
import type { StoryPost } from '@/lib/cms/types'

interface TimelineProps {
  posts: StoryPost[]
  className?: string
}

interface TimelineItemProps {
  post: StoryPost
  index: number
}

function TimelineItem({ post, index }: TimelineItemProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className="relative">
      {/* Timeline line - hidden on mobile, centered on desktop */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border hidden lg:block" />
      
      {/* Timeline dot - positioned on left for mobile, center for desktop */}
      <div className="absolute left-4 lg:left-1/2 top-6 lg:transform lg:-translate-x-1/2 lg:-translate-y-2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10" />
      
      {/* Mobile timeline line - on the left side */}
      <div className="absolute left-6 top-0 w-0.5 h-full bg-border lg:hidden" />
      
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pl-12 lg:pl-0`}>
        {/* Content */}
        <motion.div
          initial={isEven ? slideInLeft.initial : slideInRight.initial}
          animate={isInView ? (isEven ? slideInLeft.animate : slideInRight.animate) : (isEven ? slideInLeft.initial : slideInRight.initial)}
          transition={{ ...slideInLeft.transition, delay: 0.2 }}
          className={`space-y-4 ${isEven ? 'lg:text-right lg:pr-8' : 'lg:pl-8'}`}
        >
          {post.year && (
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {post.year}
            </div>
          )}
          
          <h3 className="text-2xl font-bold">{post.title}</h3>
          
          <p className="text-muted-foreground leading-relaxed">
            {post.content}
          </p>
          
          {post.excerpt && post.excerpt !== post.content && (
            <p className="text-sm text-muted-foreground italic">
              {post.excerpt}
            </p>
          )}
        </motion.div>

        {/* Image */}
        <motion.div
          initial={isEven ? slideInRight.initial : slideInLeft.initial}
          animate={isInView ? (isEven ? slideInRight.animate : slideInLeft.animate) : (isEven ? slideInRight.initial : slideInLeft.initial)}
          transition={{ ...slideInRight.transition, delay: 0.4 }}
          className={`${isEven ? '' : 'lg:order-first'}`}
        >
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={`/assets/facilities/${post.coverImage}`}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function Timeline({ posts, className }: TimelineProps) {
  // Sort posts by year if available
  const sortedPosts = React.useMemo(() => {
    return [...posts].sort((a, b) => {
      if (!a.year || !b.year) return 0
      return a.year - b.year
    })
  }, [posts])

  return (
    <div className={`space-y-16 ${className || ''}`}>
      {sortedPosts.map((post, index) => (
        <TimelineItem key={post.id} post={post} index={index} />
      ))}
    </div>
  )
}
