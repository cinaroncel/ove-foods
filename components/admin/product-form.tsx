'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { uploadProductImage } from '@/lib/firebase/storage'
import { productsService } from '@/lib/firebase/firestore'
import { getCategories } from '@/lib/cms/data-provider'
import type { Product, Category } from '@/lib/cms/types'
import { Trash2, Upload, Plus } from 'lucide-react'

interface ProductFormProps {
  product?: Product
  onSubmit?: () => void
}

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product
  
  const [formData, setFormData] = useState({
    title: product?.title || '',
    slug: product?.slug || '',
    categoryId: product?.categoryId || '',
    shortCopy: product?.shortCopy || '',
    longCopy: product?.longCopy || '',
    featured: product?.featured || false,
    specs: {
      volume: product?.specs?.volume || '',
      variety: product?.specs?.variety || '',
      origin: product?.specs?.origin || '',
      acidity: product?.specs?.acidity || ''
    },
    certifications: product?.certifications || [],
    awards: product?.awards || [],
    retailerLinks: product?.retailerLinks || []
  })
  
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // Generate slug from title
    if (formData.title && !isEditing) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, isEditing])

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setError('')
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const uploadId = `${Date.now()}-${i}`
      
      try {
        setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }))
        
        const imageUrl = await uploadProductImage(file)
        
        // Extract filename from URL for local storage
        const filename = file.name
        setImages(prev => [...prev, filename])
        
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[uploadId]
          return newProgress
        })
      } catch (error) {
        console.error('Upload error:', error)
        setError('Failed to upload image')
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[uploadId]
          return newProgress
        })
      }
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { label: '', icon: '' }]
    }))
  }

  const updateCertification = (index: number, field: 'label' | 'icon', value: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }))
  }

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const addRetailerLink = () => {
    setFormData(prev => ({
      ...prev,
      retailerLinks: [...prev.retailerLinks, { label: '', url: '' }]
    }))
  }

  const updateRetailerLink = (index: number, field: 'label' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      retailerLinks: prev.retailerLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const removeRetailerLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      retailerLinks: prev.retailerLinks.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const productData = {
        ...formData,
        images,
        relatedRecipeIds: product?.relatedRecipeIds || []
      }

      if (isEditing) {
        await productsService.update(product.id, productData)
      } else {
        await productsService.create(productData)
      }

      onSubmit?.()
      router.push('/admin/products')
    } catch (error: any) {
      console.error('Save error:', error)
      setError(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Core product details and description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Product Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
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
          </div>

          <div>
            <Label htmlFor="shortCopy">Short Description</Label>
            <Textarea
              id="shortCopy"
              value={formData.shortCopy}
              onChange={(e) => setFormData(prev => ({ ...prev, shortCopy: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="longCopy">Long Description (HTML)</Label>
            <Textarea
              id="longCopy"
              value={formData.longCopy}
              onChange={(e) => setFormData(prev => ({ ...prev, longCopy: e.target.value }))}
              rows={6}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <CardDescription>
            Upload product photos (first image will be the main image)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="images">Upload Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
          </div>

          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([id, progress]) => (
                <div key={id} className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={`/assets/products/${image}`}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Specifications</CardTitle>
          <CardDescription>
            Technical details about the product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                value={formData.specs.volume}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specs: { ...prev.specs, volume: e.target.value }
                }))}
                placeholder="e.g., 500ml"
              />
            </div>
            <div>
              <Label htmlFor="variety">Variety</Label>
              <Input
                id="variety"
                value={formData.specs.variety}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specs: { ...prev.specs, variety: e.target.value }
                }))}
                placeholder="e.g., Extra Virgin"
              />
            </div>
            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.specs.origin}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specs: { ...prev.specs, origin: e.target.value }
                }))}
                placeholder="e.g., Turkey"
              />
            </div>
            <div>
              <Label htmlFor="acidity">Acidity</Label>
              <Input
                id="acidity"
                value={formData.specs.acidity}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specs: { ...prev.specs, acidity: e.target.value }
                }))}
                placeholder="e.g., <0.8%"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
          <CardDescription>
            Product certifications and quality marks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.certifications.map((cert, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Certification name"
                value={cert.label}
                onChange={(e) => updateCertification(index, 'label', e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeCertification(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addCertification}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retailer Links</CardTitle>
          <CardDescription>
            Where customers can purchase this product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.retailerLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Retailer name"
                value={link.label}
                onChange={(e) => updateRetailerLink(index, 'label', e.target.value)}
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateRetailerLink(index, 'url', e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeRetailerLink(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addRetailerLink}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Retailer Link
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}