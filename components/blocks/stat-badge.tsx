'use client'

import * as React from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { 
  Leaf, 
  CheckCircle, 
  Droplets, 
  MapPin, 
  Sun, 
  Recycle,
  TrendingUp,
  Award,
  Users,
  Globe
} from 'lucide-react'
import { fadeInUp, shouldReduceMotion } from '@/lib/motion/constants'
import type { SustainabilityMetric } from '@/lib/cms/types'

const iconMap = {
  leaf: Leaf,
  'check-circle': CheckCircle,
  droplet: Droplets,
  'map-pin': MapPin,
  sun: Sun,
  recycle: Recycle,
  'trending-up': TrendingUp,
  award: Award,
  users: Users,
  globe: Globe
}

interface StatBadgeProps {
  metric: SustainabilityMetric
  index?: number
  className?: string
}

function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = React.useState(0)
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration })
  
  React.useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setCount(Math.round(latest))
    })
    
    return unsubscribe
  }, [spring])
  
  const startAnimation = React.useCallback(() => {
    motionValue.set(target)
  }, [motionValue, target])
  
  return { count, startAnimation }
}

export function StatBadge({ metric, index = 0, className }: StatBadgeProps) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  
  // Extract numeric value from metric.value
  const numericValue = React.useMemo(() => {
    const match = metric.value.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }, [metric.value])
  
  const { count, startAnimation } = useCountUp(numericValue)
  
  // Start animation when in view
  React.useEffect(() => {
    if (isInView && !shouldReduceMotion()) {
      const timer = setTimeout(startAnimation, index * 200)
      return () => clearTimeout(timer)
    }
  }, [isInView, startAnimation, index])
  
  // Get icon component
  const IconComponent = metric.icon ? iconMap[metric.icon as keyof typeof iconMap] : TrendingUp
  
  // Format display value
  const displayValue = shouldReduceMotion() || !isInView 
    ? metric.value 
    : metric.value.replace(/\d+/, count.toString())

  return (
    <motion.div
      ref={ref}
      initial={fadeInUp.initial}
      animate={isInView ? fadeInUp.animate : fadeInUp.initial}
      transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
      className={`text-center space-y-4 ${className || ''}`}
    >
      {/* Icon */}
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <IconComponent className="h-8 w-8 text-primary" />
      </div>
      
      {/* Value */}
      <div>
        <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
          {displayValue}
        </div>
        <h3 className="text-lg font-semibold mb-2">{metric.label}</h3>
        {metric.description && (
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {metric.description}
          </p>
        )}
      </div>
    </motion.div>
  )
}

interface StatBadgeGridProps {
  metrics: SustainabilityMetric[]
  className?: string
}

export function StatBadgeGrid({ metrics, className }: StatBadgeGridProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${className || ''}`}>
      {metrics.map((metric, index) => (
        <StatBadge 
          key={metric.id} 
          metric={metric} 
          index={index}
        />
      ))}
    </div>
  )
}
