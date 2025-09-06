'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Save, Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Recipe } from '@/lib/cms/types'

const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  heroImage: z.string().min(1, 'Hero image is required'),
  description: z.string().min(1, 'Description is required'),
  ingredients: z.array(z.object({
    item: z.string().min(1, 'Item is required'),
    quantity: z.number().min(0, 'Quantity must be positive'),
    unit: z.string().min(1, 'Unit is required'),
    notes: z.string().optional(),
  })).min(1, 'At least one ingredient is required'),
  steps: z.array(z.string().min(1, 'Step cannot be empty')).min(1, 'At least one step is required'),
  times: z.object({
    prep: z.number().min(0, 'Prep time must be 0 or greater'),
    cook: z.number().min(0, 'Cook time must be 0 or greater'),
  }),
  servings: z.number().min(1, 'Servings must be at least 1'),
  tags: z.array(z.string()).optional(),
  relatedProductIds: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  featured: z.boolean().optional(),
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
  }).optional(),
})

type RecipeFormData = z.infer<typeof recipeSchema>

interface AdminRecipeFormProps {
  recipe?: Recipe
  mode: 'create' | 'edit'
}

export function AdminRecipeForm({ recipe, mode }: AdminRecipeFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newStep, setNewStep] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors }
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: recipe?.title || '',
      slug: recipe?.slug || '',
      heroImage: recipe?.heroImage || '',
      description: recipe?.description || '',
      ingredients: recipe?.ingredients || [{ item: '', quantity: 0, unit: '', notes: '' }],
      steps: recipe?.steps || [''],
      times: recipe?.times || { prep: 0, cook: 0 },
      servings: recipe?.servings || 1,
      tags: recipe?.tags || [],
      relatedProductIds: recipe?.relatedProductIds || [],
      difficulty: recipe?.difficulty || 'easy',
      featured: recipe?.featured || false,
      seo: recipe?.seo || {},
    }
  })

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients'
  })

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'steps'
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

  const addTag = () => {
    if (newTag.trim()) {
      const current = watchedValues.tags || []
      setValue('tags', [...current, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    const current = watchedValues.tags || []
    setValue('tags', current.filter((_, i) => i !== index))
  }

  const addStep = () => {
    if (newStep.trim()) {
      const currentSteps = watchedValues.steps || []
      setValue('steps', [...currentSteps, newStep.trim()])
      setNewStep('')
    }
  }

  const onSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true)
    try {
      const url = mode === 'create' 
        ? '/api/admin/recipes'
        : `/api/admin/recipes/${recipe!.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: mode === 'edit' ? recipe!.id : data.slug
        })
      })

      if (response.ok) {
        router.push('/admin/recipes')
        router.refresh()
      } else {
        console.error('Failed to save recipe')
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Add New Recipe' : 'Edit Recipe'}
          </h1>
          <p className="text-gray-600">
            {mode === 'create' ? 'Create a new recipe' : 'Update recipe information'}
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          {mode === 'create' ? 'Create Recipe' : 'Update Recipe'}
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
              placeholder="Recipe title"
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
              placeholder="recipe-slug"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="heroImage">Hero Image</Label>
            <Input
              id="heroImage"
              {...register('heroImage')}
              placeholder="hero-image.jpg"
            />
            {errors.heroImage && (
              <p className="text-sm text-red-600 mt-1">{errors.heroImage.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Recipe description"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="times.prep">Prep Time (min)</Label>
              <Input
                id="times.prep"
                type="number"
                {...register('times.prep', { valueAsNumber: true })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="times.cook">Cook Time (min)</Label>
              <Input
                id="times.cook"
                type="number"
                {...register('times.cook', { valueAsNumber: true })}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input
                id="servings"
                type="number"
                {...register('servings', { valueAsNumber: true })}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={watchedValues.difficulty}
                onValueChange={(value) => setValue('difficulty', value as 'easy' | 'medium' | 'hard')}
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
          </div>

          <div>
            <Label>
              <input
                type="checkbox"
                checked={watchedValues.featured}
                onChange={(e) => setValue('featured', e.target.checked)}
                className="mr-2"
              />
              Featured Recipe
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <Label>Item</Label>
                <Input
                  {...register(`ingredients.${index}.item`)}
                  placeholder="Ingredient name"
                />
              </div>
              <div className="col-span-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="col-span-2">
                <Label>Unit</Label>
                <Input
                  {...register(`ingredients.${index}.unit`)}
                  placeholder="cup, tbsp, etc"
                />
              </div>
              <div className="col-span-3">
                <Label>Notes</Label>
                <Input
                  {...register(`ingredients.${index}.notes`)}
                  placeholder="Optional notes"
                />
              </div>
              <div className="col-span-1">
                {ingredientFields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendIngredient({ item: '', quantity: 0, unit: '', notes: '' })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Ingredient
          </Button>
          {errors.ingredients && (
            <p className="text-sm text-red-600">{errors.ingredients.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(watchedValues.steps || []).map((step, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <Label>Step {index + 1}</Label>
                <Textarea
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...(watchedValues.steps || [])]
                    newSteps[index] = e.target.value
                    setValue('steps', newSteps)
                  }}
                  placeholder="Describe this step..."
                  rows={2}
                />
              </div>
              {(watchedValues.steps || []).length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newSteps = [...(watchedValues.steps || [])]
                    newSteps.splice(index, 1)
                    setValue('steps', newSteps)
                  }}
                  className="mt-6"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            <Input
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Add a new step..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
            />
            <Button type="button" onClick={addStep}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {errors.steps && (
            <p className="text-sm text-red-600">{errors.steps.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {(watchedValues.tags || []).map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeTag(index)}
                />
              </Badge>
            ))}
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