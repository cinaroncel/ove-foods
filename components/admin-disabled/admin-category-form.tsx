'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/lib/cms/types'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  heroImage: z.string().optional(),
  order: z.number().min(0, 'Order must be 0 or greater'),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface AdminCategoryFormProps {
  category?: Category
  mode: 'create' | 'edit'
}

export function AdminCategoryForm({ category, mode }: AdminCategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      heroImage: category?.heroImage || '',
      order: category?.order || 0,
    }
  })

  const watchedValues = watch()

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setValue('name', name)
    if (mode === 'create') {
      setValue('slug', generateSlug(name))
    }
  }

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      const url = mode === 'create' 
        ? '/api/admin/categories'
        : `/api/admin/categories/${category!.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: mode === 'edit' ? category!.id : data.slug
        })
      })

      if (response.ok) {
        router.push('/admin/categories')
        router.refresh()
      } else {
        console.error('Failed to save category')
      }
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Add New Category' : 'Edit Category'}
          </h1>
          <p className="text-gray-600">
            {mode === 'create' ? 'Create a new category' : 'Update category information'}
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          {mode === 'create' ? 'Create Category' : 'Update Category'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              onChange={handleNameChange}
              placeholder="Category name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="category-slug"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Category description (optional)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="heroImage">Hero Image</Label>
            <Input
              id="heroImage"
              {...register('heroImage')}
              placeholder="hero-image.jpg (optional)"
            />
          </div>

          <div>
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              {...register('order', { valueAsNumber: true })}
              placeholder="0"
              min="0"
            />
            {errors.order && (
              <p className="text-sm text-red-600 mt-1">{errors.order.message}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}