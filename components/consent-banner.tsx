'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { setAnalyticsConsent, hasAnalyticsConsent } from '@/lib/analytics'

export function ConsentBanner() {
  const [showBanner, setShowBanner] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = hasAnalyticsConsent()
    const hasDeclined = localStorage.getItem('analytics-consent') === 'false'
    
    if (!hasConsent && !hasDeclined) {
      setShowBanner(true)
    }
    setIsLoaded(true)
  }, [])

  const handleAccept = () => {
    setAnalyticsConsent(true)
    setShowBanner(false)
  }

  const handleDecline = () => {
    setAnalyticsConsent(false)
    setShowBanner(false)
  }

  if (!isLoaded) return null

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg"
        >
          <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">We use cookies</p>
                  <p className="text-xs text-muted-foreground">
                    We use cookies and similar technologies to improve your experience, 
                    analyze site usage, and assist in our marketing efforts. 
                    <a 
                      href="/legal/privacy" 
                      className="text-primary hover:underline ml-1"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                  className="flex-1 sm:flex-none"
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="flex-1 sm:flex-none"
                >
                  Accept
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDecline}
                  className="p-2"
                  aria-label="Close banner"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
