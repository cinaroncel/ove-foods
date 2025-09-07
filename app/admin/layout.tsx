'use client'

import { AuthProvider } from '@/lib/auth/admin-auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}