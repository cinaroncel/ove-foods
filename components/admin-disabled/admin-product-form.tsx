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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Save, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Product, Category } from '@/lib/cms/types'

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  categoryId: z.string().min(1, 'Category is required'),
  shortCopy: z.string().min(1, 'Short copy is required'),
  longCopy: z.string().min(1, 'Long copy is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  featured: z.boolean().optional(),
  specs: z.object({
    volume: z.string().optional(),
    variety: z.string().optional(),
    origin: z.string().optional(),
    acidity: z.string().optional(),
  }).optional(),
  nutrition: z.object({
    servingSize: z.string().optional(),
    calories: z.number().optional(),
    fat: z.string().optional(),
    saturatedFat: z.string().optional(),
    sodium: z.string().optional(),
    carbs: z.string().optional(),
    protein: z.string().optional(),
  }).optional(),
  certifications: z.array(z.object({
    label: z.string(),
    icon: z.string().optional(),
  })).optional(),
  awards: z.array(z.object({
    name: z.string(),
    year: z.number(),
    link: z.string().optional(),
  })).optional(),
  relatedRecipeIds: z.array(z.string()).optional(),
  retailerLinks: z.array(z.object({
    label: z.string(),
    url: z.string(),
  })).optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  }).optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface AdminProductFormProps {
  product?: Product
  categories: Category[]
  mode: 'create' | 'edit'
}

export function AdminProductForm({ product, categories, mode }: AdminProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newImage, setNewImage] = useState('')
  const [newCertification, setNewCertification] = useState({ label: '', icon: '' })
  const [newAward, setNewAward] = useState({ name: '', year: new Date().getFullYear(), link: '' })
  const [newRetailerLink, setNewRetailerLink] = useState({ label: '', url: '' })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      slug: product?.slug || '',
      categoryId: product?.categoryId || '',
      shortCopy: product?.shortCopy || '',
      longCopy: product?.longCopy || '',
      images: product?.images || [],
      featured: product?.featured || false,
      specs: product?.specs || {},
      nutrition: product?.nutrition || {},
      certifications: product?.certifications || [],
      awards: product?.awards || [],
      relatedRecipeIds: product?.relatedRecipeIds || [],
      retailerLinks: product?.retailerLinks || [],
      seo: product?.seo || {},
    }
  })

  const watchedValues = watch()

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setValue('title', title)
    if (mode === 'create') {
      setValue('slug', generateSlug(title))
    }
  }

  const addImage = () => {
    if (newImage.trim()) {
      const currentImages = watchedValues.images || []
      setValue('images', [...currentImages, newImage.trim()])
      setNewImage('')
    }
  }

  const removeImage = (index: number) => {
    const currentImages = watchedValues.images || []
    setValue('images', currentImages.filter((_, i) => i !== index))
  }

  const addCertification = () => {
    if (newCertification.label.trim()) {
      const current = watchedValues.certifications || []
      setValue('certifications', [...current, { ...newCertification }])
      setNewCertification({ label: '', icon: '' })
    }
  }

  const removeCertification = (index: number) => {
    const current = watchedValues.certifications || []
    setValue('certifications', current.filter((_, i) => i !== index))
  }

  const addAward = () => {
    if (newAward.name.trim()) {
      const current = watchedValues.awards || []
      setValue('awards', [...current, { ...newAward }])
      setNewAward({ name: '', year: new Date().getFullYear(), link: '' })
    }
  }

  const removeAward = (index: number) => {
    const current = watchedValues.awards || []
    setValue('awards', current.filter((_, i) => i !== index))
  }

  const addRetailerLink = () => {
    if (newRetailerLink.label.trim() && newRetailerLink.url.trim()) {
      const current = watchedValues.retailerLinks || []
      setValue('retailerLinks', [...current, { ...newRetailerLink }])
      setNewRetailerLink({ label: '', url: '' })
    }
  }

  const removeRetailerLink = (index: number) => {
    const current = watchedValues.retailerLinks || []
    setValue('retailerLinks', current.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const url = mode === 'create' 
        ? '/api/admin/products'
        : `/api/admin/products/${product!.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: mode === 'edit' ? product!.id : data.slug
        })
      })

      if (response.ok) {
        router.push('/admin/products')
        router.refresh()
      } else {
        console.error('Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Add New Product' : 'Edit Product'}
          </h1>
          <p className="text-gray-600">
            {mode === 'create' ? 'Create a new product' : 'Update product information'}
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          {mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              onChange={handleTitleChange}
              placeholder="Product title"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              {...register('slug')}
              placeholder="product-slug"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select
              value={watchedValues.categoryId}
              onValueChange={(value) => setValue('categoryId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="shortCopy">Short Description</Label>
            <Textarea
              id="shortCopy"
              {...register('shortCopy')}
              placeholder="Brief product description"
              rows={3}
            />
            {errors.shortCopy && (
              <p className="text-sm text-red-600 mt-1">{errors.shortCopy.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="longCopy">Long Description</Label>
            <Textarea
              id="longCopy"
              {...register('longCopy')}
              placeholder="Detailed product description"
              rows={5}
            />
            {errors.longCopy && (
              <p className="text-sm text-red-600 mt-1">{errors.longCopy.message}</p>
            )}
          </div>

          <div>
            <Label>
              <input
                type="checkbox"
                checked={watchedValues.featured}
                onChange={(e) => setValue('featured', e.target.checked)}
                className="mr-2"
              />
              Featured Product
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Image filename (e.g., product-1.jpg)"
            />
            <Button type="button" onClick={addImage}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {(watchedValues.images || []).map((image, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {image}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeImage(index)}
                />
              </Badge>
            ))}
          </div>
          {errors.images && (
            <p className="text-sm text-red-600">{errors.images.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Specifications (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="specs.volume">Volume</Label>
            <Input
              id="specs.volume"
              {...register('specs.volume')}
              placeholder="e.g., 500ml"
            />
          </div>
          <div>
            <Label htmlFor="specs.variety">Variety</Label>
            <Input
              id="specs.variety"
              {...register('specs.variety')}
              placeholder="e.g., Extra Virgin"
            />
          </div>
          <div>
            <Label htmlFor="specs.origin">Origin</Label>
            <Input
              id="specs.origin"
              {...register('specs.origin')}
              placeholder="e.g., Italy"
            />
          </div>
          <div>
            <Label htmlFor="specs.acidity">Acidity</Label>
            <Input
              id="specs.acidity"
              {...register('specs.acidity')}
              placeholder="e.g., 0.2%"
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seo.title">SEO Title</Label>
            <Input
              id="seo.title"
              {...register('seo.title')}
              placeholder="SEO optimized title"
            />
          </div>
          <div>
            <Label htmlFor="seo.description">SEO Description</Label>
            <Textarea
              id="seo.description"
              {...register('seo.description')}
              placeholder="SEO meta description"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </form>
  )
}