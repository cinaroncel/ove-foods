'use client'

import { AdminCategoryList } from '@/components/admin/admin-category-list'

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
      </div>
      
      <AdminCategoryList />
    </div>
  )
}