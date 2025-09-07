'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/admin/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { ProductForm } from '@/components/admin/product-form'
import { productsService } from '@/lib/firebase/firestore'
import type { Product } from '@/lib/cms/types'

export default function EditProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProduct()
  }, [params.id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const productData = await productsService.getById(params.id as string)
      if (productData) {
        setProduct(productData)
      } else {
        setError('Product not found')
      }
    } catch (error: any) {
      console.error('Error loading product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <div className="w-64 flex-shrink-0">
            <AdminSidebar />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading product...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !product) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <div className="w-64 flex-shrink-0">
            <AdminSidebar />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
          <AdminSidebar />
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p className="text-muted-foreground">
                Update product information
              </p>
            </div>

            <ProductForm product={product} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}