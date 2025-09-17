'use client'

import { usePathname } from 'next/navigation'
import { Nav } from '@/components/layout/nav'
import { Footer } from '@/components/layout/footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isAdminRoute && <Nav />}
      <main id="main-content" className={isAdminRoute ? "min-h-screen" : "flex-1"}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}