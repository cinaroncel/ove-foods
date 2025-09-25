'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { categoriesService } from '@/lib/firebase/firestore'
import { Plus, Edit, Trash2, Check, X } from 'lucide-react'
import type { Category } from '@/lib/cms/types'

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    heroImage: '',
    order: 0
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesService.getOrdered('order', 'asc')
      setCategories(data)
    } catch (error) {
      setError('Failed to load categories')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingId) {
        await categoriesService.update(editingId, {
          ...formData,
          updatedAt: new Date().toISOString()
        })
        setSuccess('Category updated successfully!')
        setEditingId(null)
      } else {
        await categoriesService.create({
          ...formData,
          id: formData.slug,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        setSuccess('Category created successfully!')
        setShowAddForm(false)
      }
      
      setFormData({ name: '', slug: '', description: '', heroImage: '', order: 0 })
      await loadCategories()
    } catch (error) {
      setError('Failed to save category')
      console.error(error)
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      heroImage: category.heroImage || '',
      order: category.order || 0
    })
    setEditingId(category.id)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      await categoriesService.delete(id)
      setSuccess('Category deleted successfully!')
      await loadCategories()
    } catch (error) {
      setError('Failed to delete category')
      console.error(error)
    }
  }

  const handleAddNewCategories = async () => {
    const newCategories = [
      {
        id: "honey",
        slug: "honey",
        name: "Honey",
        description: "Pure and natural honey varieties with distinct flavors and textures",
        heroImage: "https://placehold.co/1200x600/e5e7eb/6b7280?text=Honey",
        order: 50
      },
      {
        id: "seasoning",
        slug: "seasoning",
        name: "Seasoning",
        description: "Premium spices, herbs, and seasoning blends to enhance your culinary creations",
        heroImage: "https://placehold.co/1200x600/e5e7eb/6b7280?text=Seasoning",
        order: 60
      },
      {
        id: "gourmet-products",
        slug: "gourmet-products",
        name: "Gourmet Products",
        description: "Carefully curated selection of artisanal and gourmet food products",
        heroImage: "https://placehold.co/1200x600/e5e7eb/6b7280?text=Gourmet+Products",
        order: 70
      }
    ]

    try {
      setError('')
      setSuccess('')
      
      for (const category of newCategories) {
        // Check if category already exists
        const existing = categories.find(c => c.id === category.id)
        if (!existing) {
          await categoriesService.create({
            ...category,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
      }
      
      setSuccess('New categories (Honey, Seasoning, Gourmet Products) added successfully!')
      await loadCategories()
    } catch (error) {
      setError('Failed to add new categories')
      console.error(error)
    }
  }

  if (loading) return <div className="p-6">Loading categories...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNewCategories} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Missing Categories
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription className="text-green-600">{success}</AlertDescription>
        </Alert>
      )}

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Category' : 'Add New Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heroImage">Hero Image URL</Label>
                  <Input
                    id="heroImage"
                    value={formData.heroImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  <Check className="w-4 h-4 mr-2" />
                  {editingId ? 'Update' : 'Create'} Category
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingId(null)
                    setFormData({ name: '', slug: '', description: '', heroImage: '', order: 0 })
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{category.name}</h3>
                    <Badge variant="outline">Order: {category.order}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{category.description}</p>
                  <div className="text-sm text-muted-foreground">
                    <p>ID: {category.id}</p>
                    <p>Slug: {category.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}