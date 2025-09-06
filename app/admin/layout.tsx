'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AdminHeader } from '@/components/admin/admin-header'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { onAuthStateChangedListener } from '@/lib/firebase/auth'
import { User } from 'firebase/auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }

    // Check for temporary admin session first
    const tempSession = localStorage.getItem('temp-admin-session')
    if (tempSession === 'true') {
      setUser({ uid: 'temp-admin' } as any)
      setLoading(false)
      return
    }

    // Listen to auth state changes
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
        router.replace('/admin/login')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, pathname])

  // For login page, render simple layout
  if (pathname === '/admin/login') {
    return <div className="min-h-screen">{children}</div>
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login redirect message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Show admin interface for authenticated users
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}