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
import { Badge } from '@/components/ui/badge'
import { uploadRecipeImage } from '@/lib/firebase/storage'
import { recipesService } from '@/lib/firebase/firestore'
import { getProducts } from '@/lib/cms/data-provider'
import type { Recipe, Product } from '@/lib/cms/types'
import { getRecipeImageUrl } from '@/lib/utils/image-utils'
import { Trash2, Plus, X } from 'lucide-react'

interface RecipeFormProps {
  recipe?: Recipe
  onSubmit?: () => void
}

export function RecipeForm({ recipe, onSubmit }: RecipeFormProps) {
  const router = useRouter()
  const isEditing = !!recipe
  
  const [formData, setFormData] = useState({
    title: recipe?.title || '',
    slug: recipe?.slug || '',
    description: recipe?.description || '',
    servings: recipe?.servings || 4,
    difficulty: recipe?.difficulty || 'easy' as 'easy' | 'medium' | 'hard',
    times: {
      prep: recipe?.times?.prep || 15,
      cook: recipe?.times?.cook || 30
    },
    featured: recipe?.featured || false
  })
  
  const [heroImage, setHeroImage] = useState(recipe?.heroImage || '')
  const [ingredients, setIngredients] = useState(recipe?.ingredients || [
    { item: '', quantity: 0, unit: '', notes: '' }
  ])
  const [steps, setSteps] = useState(recipe?.steps || [''])
  const [tags, setTags] = useState(recipe?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [relatedProductIds, setRelatedProductIds] = useState(recipe?.relatedProductIds || [])
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadProducts()
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

  const loadProducts = async () => {
    try {
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const handleHeroImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)
    
    try {
      const downloadURL = await uploadRecipeImage(file)
      console.log('Recipe image uploaded to Firebase Storage:', downloadURL)
      setHeroImage(downloadURL)
    } catch (error: any) {
      console.error('Upload error:', error)
      setError('Failed to upload image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { item: '', quantity: 0, unit: '', notes: '' }])
  }

  const updateIngredient = (index: number, field: string, value: string | number) => {
    setIngredients(ingredients.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    ))
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const addStep = () => {
    setSteps([...steps, ''])
  }

  const updateStep = (index: number, value: string) => {
    setSteps(steps.map((step, i) => i === index ? value : step))
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const toggleRelatedProduct = (productId: string) => {
    setRelatedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const recipeData = {
        ...formData,
        heroImage,
        ingredients: ingredients.filter(ing => ing.item.trim()),
        steps: steps.filter(step => step.trim()),
        tags,
        relatedProductIds
      }

      if (isEditing) {
        await recipesService.update(recipe.id, recipeData)
      } else {
        await recipesService.create(recipeData)
      }

      onSubmit?.()
      router.push('/admin/recipes')
    } catch (error: any) {
      console.error('Save error:', error)
      setError(error.message || 'Failed to save recipe')
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
            Core recipe details and description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Recipe Title</Label>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 0 }))}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="prepTime">Prep Time (minutes)</Label>
              <Input
                id="prepTime"
                type="number"
                value={formData.times.prep}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  times: { ...prev.times, prep: parseInt(e.target.value) || 0 }
                }))}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="cookTime">Cook Time (minutes)</Label>
              <Input
                id="cookTime"
                type="number"
                value={formData.times.cook}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  times: { ...prev.times, cook: parseInt(e.target.value) || 0 }
                }))}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                difficulty: value as 'easy' | 'medium' | 'hard' 
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Featured Recipe</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
          <CardDescription>
            Main recipe photo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroImage">Upload Hero Image</Label>
            <Input
              id="heroImage"
              type="file"
              accept="image/*"
              onChange={handleHeroImageUpload}
              disabled={uploading}
              className="cursor-pointer"
            />
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" />
            </div>
          )}

          {heroImage && (
            <div className="relative w-64 h-48">
              <img
                src={getRecipeImageUrl(heroImage)}
                alt="Hero image"
                className="w-full h-full object-cover rounded border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
          <CardDescription>
            List all ingredients with quantities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Label>Ingredient</Label>
                <Input
                  placeholder="e.g., Extra Virgin Olive Oil"
                  value={ingredient.item}
                  onChange={(e) => updateIngredient(index, 'item', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder="2"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-2">
                <Label>Unit</Label>
                <Input
                  placeholder="tbsp"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Input
                  placeholder="optional"
                  value={ingredient.notes}
                  onChange={(e) => updateIngredient(index, 'notes', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addIngredient}>
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
          <CardDescription>
            Step-by-step cooking instructions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <Textarea
                placeholder="Describe this step..."
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                rows={2}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeStep(index)}
                disabled={steps.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Add tags to help categorize and search for this recipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-3 py-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Products</CardTitle>
          <CardDescription>
            Select products that are featured or used in this recipe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className={`p-3 border rounded cursor-pointer transition-colors ${
                  relatedProductIds.includes(product.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => toggleRelatedProduct(product.id)}
              >
                <div className="font-medium text-sm">{product.title}</div>
                <div className="text-xs text-muted-foreground">{product.shortCopy}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/recipes')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </div>
    </form>
  )
}