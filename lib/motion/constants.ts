export const MOTION = {
  ease: [0.16, 1, 0.3, 1] as const,
  duration: { 
    fast: 0.2, 
    base: 0.5, 
    slow: 0.7 
  },
  stagger: { 
    small: 0.06, 
    base: 0.1, 
    large: 0.12 
  },
  viewport: { 
    once: true, 
    amount: 0.25 
  }
} as const

// Animation variants for common use cases
export const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 24, 
    scale: 0.98 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1 
  },
  transition: { 
    duration: MOTION.duration.base, 
    ease: MOTION.ease 
  }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: MOTION.stagger.base
    }
  }
}

export const slideInLeft = {
  initial: { 
    opacity: 0, 
    x: -24 
  },
  animate: { 
    opacity: 1, 
    x: 0 
  },
  transition: { 
    duration: MOTION.duration.base, 
    ease: MOTION.ease 
  }
}

export const slideInRight = {
  initial: { 
    opacity: 0, 
    x: 24 
  },
  animate: { 
    opacity: 1, 
    x: 0 
  },
  transition: { 
    duration: MOTION.duration.base, 
    ease: MOTION.ease 
  }
}

export const scaleIn = {
  initial: { 
    opacity: 0, 
    scale: 0.9 
  },
  animate: { 
    opacity: 1, 
    scale: 1 
  },
  transition: { 
    duration: MOTION.duration.fast, 
    ease: MOTION.ease 
  }
}

// Hover animations
export const cardHover = {
  rest: { 
    y: 0, 
    scale: 1,
    transition: { 
      duration: MOTION.duration.fast, 
      ease: MOTION.ease 
    }
  },
  hover: { 
    y: -4, 
    scale: 1.02,
    transition: { 
      duration: MOTION.duration.fast, 
      ease: MOTION.ease 
    }
  }
}

// Utility to check if user prefers reduced motion
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
