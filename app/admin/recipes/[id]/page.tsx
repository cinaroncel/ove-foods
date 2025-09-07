'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/admin/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { RecipeForm } from '@/components/admin/recipe-form'
import { recipesService } from '@/lib/firebase/firestore'
import type { Recipe } from '@/lib/cms/types'

export default function EditRecipePage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRecipe()
  }, [params.id])

  const loadRecipe = async () => {
    try {
      setLoading(true)
      const recipeData = await recipesService.getById(params.id as string)
      if (recipeData) {
        setRecipe(recipeData)
      } else {
        setError('Recipe not found')
      }
    } catch (error: any) {
      console.error('Error loading recipe:', error)
      setError('Failed to load recipe')
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
              <p className="text-muted-foreground">Loading recipe...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !recipe) {
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
              <h1 className="text-3xl font-bold">Edit Recipe</h1>
              <p className="text-muted-foreground">
                Update recipe information
              </p>
            </div>

            <RecipeForm recipe={recipe} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}