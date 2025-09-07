'use client'

import { ProtectedRoute } from '@/components/admin/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { RecipeForm } from '@/components/admin/recipe-form'

export default function NewRecipePage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
          <AdminSidebar />
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Add New Recipe</h1>
              <p className="text-muted-foreground">
                Create a new recipe for your collection
              </p>
            </div>

            <RecipeForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}