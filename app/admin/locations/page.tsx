'use client'

export const dynamic = 'force-dynamic'

import { AdminLocationList } from '@/components/admin/admin-location-list'

export default function AdminLocationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
          <p className="text-gray-600">Manage store locations</p>
        </div>
      </div>
      
      <AdminLocationList />
    </div>
  )
}