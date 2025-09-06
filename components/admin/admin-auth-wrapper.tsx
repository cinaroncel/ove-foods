'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsLoading(false)
      return
    }

    // Simple client-side auth check using localStorage for now
    const checkAuth = () => {
      try {
        // Add a small delay to ensure localStorage is available
        setTimeout(() => {
          const isLoggedIn = localStorage.getItem('admin-logged-in') === 'true'
          
          if (isLoggedIn) {
            setIsAuthenticated(true)
          } else {
            setIsAuthenticated(false)
            router.replace('/admin/login')
          }
          setIsLoading(false)
        }, 100)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        router.replace('/admin/login')
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, pathname])

  // For login page, just render children
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
