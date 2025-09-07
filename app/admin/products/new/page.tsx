'use client'

import { ProtectedRoute } from '@/components/admin/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { ProductForm } from '@/components/admin/product-form'

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
          <AdminSidebar />
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">
                Create a new product for your catalog
              </p>
            </div>

            <ProductForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}