'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, ExternalLink, User } from 'lucide-react'
import { signOutAdmin } from '@/lib/firebase/auth'

export function AdminHeader() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Clear temporary session
      localStorage.removeItem('temp-admin-session')
      // Try Firebase signout
      await signOutAdmin()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if Firebase logout fails, redirect to login
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            OVE Foods Admin
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Site
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} disabled={loading}>
                <LogOut className="w-4 h-4 mr-2" />
                {loading ? 'Signing out...' : 'Sign out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
