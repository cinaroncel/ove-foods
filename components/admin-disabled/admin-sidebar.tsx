'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Package, 
  ChefHat, 
  FolderOpen, 
  Image, 
  FileText, 
  Settings,
  Home,
  MapPin
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Recipes', href: '/admin/recipes', icon: ChefHat },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Images', href: '/admin/images', icon: Image },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Locations', href: '/admin/locations', icon: MapPin },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
