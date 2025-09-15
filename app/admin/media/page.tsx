'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/admin/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadProductImage, uploadRecipeImage } from '@/lib/firebase/storage'
import { FirebaseImageManager } from '@/components/admin/firebase-image-manager'
import { Upload, Image as ImageIcon, Trash2, ExternalLink } from 'lucide-react'

interface UploadedImage {
  name: string
  url: string
  type: 'products' | 'recipes'
  size?: number
  uploadedAt: Date
}

export default function MediaPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    loadExistingImages()
  }, [])

  const loadExistingImages = async () => {
    // In a real implementation, you would fetch existing images from Firebase Storage
    // For now, we'll just show uploaded images in the current session
  }

  const handleImageUpload = async (files: FileList | null, type: 'products' | 'recipes') => {
    if (!files || files.length === 0) return

    setError('')
    setSuccess('')
    setUploading(true)

    const uploadedImages: UploadedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const uploadId = `${Date.now()}-${i}`

      try {
        setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }))

        let imageUrl: string
        if (type === 'products') {
          imageUrl = await uploadProductImage(file)
        } else {
          imageUrl = await uploadRecipeImage(file)
        }

        const uploadedImage: UploadedImage = {
          name: file.name,
          url: imageUrl,
          type,
          size: file.size,
          uploadedAt: new Date()
        }

        uploadedImages.push(uploadedImage)

        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[uploadId]
          return newProgress
        })
      } catch (error: any) {
        console.error('Upload error:', error)
        setError(`Failed to upload ${file.name}: ${error.message}`)
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[uploadId]
          return newProgress
        })
      }
    }

    if (uploadedImages.length > 0) {
      setImages(prev => [...uploadedImages, ...prev])
      setSuccess(`Successfully uploaded ${uploadedImages.length} image(s)`)
    }

    setUploading(false)
  }

  const removeImage = (imageToRemove: UploadedImage) => {
    setImages(prev => prev.filter(img => img.name !== imageToRemove.name || img.uploadedAt !== imageToRemove.uploadedAt))
  }

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  const copyImagePath = (image: UploadedImage) => {
    navigator.clipboard.writeText(image.url)
    setSuccess(`Image URL copied: ${image.url}`)
  }

  const productImages = images.filter(img => img.type === 'products')
  const recipeImages = images.filter(img => img.type === 'recipes')

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
          <AdminSidebar />
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Media Library</h1>
              <p className="text-muted-foreground">
                Upload and manage images for products and recipes
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="manage" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="manage">Manage Images</TabsTrigger>
                <TabsTrigger value="upload">Upload Images</TabsTrigger>
                <TabsTrigger value="products">Product Images</TabsTrigger>
                <TabsTrigger value="recipes">Recipe Images</TabsTrigger>
              </TabsList>

              <TabsContent value="manage" className="space-y-6">
                <FirebaseImageManager />
              </TabsContent>

              <TabsContent value="upload" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload Product Images
                      </CardTitle>
                      <CardDescription>
                        Upload images for your products. Supported formats: JPG, PNG, WebP
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="product-images">Select Images</Label>
                          <Input
                            id="product-images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files, 'products')}
                            disabled={uploading}
                            className="cursor-pointer"
                          />
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>• Images will be optimized automatically</p>
                          <p>• Recommended size: 1200x1200px</p>
                          <p>• Maximum file size: 5MB per image</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload Recipe Images
                      </CardTitle>
                      <CardDescription>
                        Upload hero images for your recipes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="recipe-images">Select Images</Label>
                          <Input
                            id="recipe-images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files, 'recipes')}
                            disabled={uploading}
                            className="cursor-pointer"
                          />
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>• Use high-quality food photography</p>
                          <p>• Recommended ratio: 16:9 or 4:3</p>
                          <p>• Maximum file size: 5MB per image</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {Object.keys(uploadProgress).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(uploadProgress).map(([id, progress]) => (
                        <div key={id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Uploading...</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images ({productImages.length})</CardTitle>
                    <CardDescription>
                      Manage images uploaded for products
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {productImages.length === 0 ? (
                      <div className="text-center py-8">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No product images uploaded yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {productImages.map((image, index) => (
                          <div key={`${image.name}-${index}`} className="group relative">
                            <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => copyImagePath(image)}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeImage(image)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground truncate">
                              {image.name}
                              {image.size && (
                                <div className="text-xs">{formatFileSize(image.size)}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recipes">
                <Card>
                  <CardHeader>
                    <CardTitle>Recipe Images ({recipeImages.length})</CardTitle>
                    <CardDescription>
                      Manage images uploaded for recipes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recipeImages.length === 0 ? (
                      <div className="text-center py-8">
                        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No recipe images uploaded yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {recipeImages.map((image, index) => (
                          <div key={`${image.name}-${index}`} className="group relative">
                            <div className="aspect-video rounded-lg border overflow-hidden bg-muted">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-2">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => copyImagePath(image)}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeImage(image)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground truncate">
                              {image.name}
                              {image.size && (
                                <div className="text-xs">{formatFileSize(image.size)}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}