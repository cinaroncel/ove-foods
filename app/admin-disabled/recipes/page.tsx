'use client'

export const dynamic = 'force-dynamic'

import { AdminRecipeList } from '@/components/admin/admin-recipe-list'

export default function AdminRecipesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
          <p className="text-gray-600">Manage your recipe collection</p>
        </div>
      </div>
      
      <AdminRecipeList />
    </div>
  )
}