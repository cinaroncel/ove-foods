'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { productImagesStorage } from '@/lib/firebase/storage'
import { productsService } from '@/lib/firebase/firestore'
import { getProducts } from '@/lib/cms/data-provider'
import { RefreshCw, Image as ImageIcon, Link2 } from 'lucide-react'
import type { Product } from '@/lib/cms/types'

interface FirebaseImage {
  name: string
  url: string
  fullPath: string
}

export function FirebaseImageManager() {
  const [images, setImages] = useState<FirebaseImage[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  useEffect(() => {
    loadProducts()
    loadFirebaseImages()
  }, [])

  const loadProducts = async () => {
    try {
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
      setError('Failed to load products')
    }
  }

  const loadFirebaseImages = async () => {
    setLoading(true)
    setError('')
    
    try {
      // We need to use the Storage API to get file names properly
      // For now, let's extract names from URLs
      const urls = await productImagesStorage.listFiles()
      const imageList: FirebaseImage[] = urls.map((url) => {
        // Extract filename from Firebase Storage URL
        const urlParts = url.split('/')
        const filenamePart = urlParts[urlParts.length - 1]
        const filename = decodeURIComponent(filenamePart.split('?')[0])
        const name = filename.replace(/^\d+_/, '') // Remove timestamp prefix if exists
        
        return {
          name,
          url,
          fullPath: url
        }
      })
      
      setImages(imageList)
      setSuccess(`Found ${imageList.length} images in Firebase Storage`)
    } catch (error: any) {
      console.error('Error loading Firebase images:', error)
      setError('Failed to load Firebase images: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages(prev => 
      prev.includes(imageUrl) 
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    )
  }

  const assignImagesToProduct = async () => {
    if (!selectedProduct || selectedImages.length === 0) {
      setError('Please select a product and at least one image')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const product = products.find(p => p.id === selectedProduct)
      if (!product) {
        setError('Product not found')
        return
      }

      // Update the product with the selected images
      await productsService.update(selectedProduct, {
        ...product,
        images: selectedImages
      })

      setSuccess(`Successfully assigned ${selectedImages.length} images to ${product.title}`)
      setSelectedImages([])
      setSelectedProduct('')
    } catch (error: any) {
      console.error('Error assigning images:', error)
      setError('Failed to assign images: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Firebase Storage Image Manager
          </CardTitle>
          <CardDescription>
            Manage product images uploaded to Firebase Storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={loadFirebaseImages} 
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Images
            </Button>
          </div>

          {images.length > 0 && (
            <>
              <div>
                <Label>Select Product to Assign Images</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Firebase Storage Images ({images.length} found)</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Click on images to select them for assignment. Selected: {selectedImages.length}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                  {images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedImages.includes(image.url) 
                          ? 'border-primary ring-2 ring-primary ring-offset-2' 
                          : 'border-border hover:border-primary'
                      }`}
                      onClick={() => toggleImageSelection(image.url)}
                    >
                      {/* Image name at the top */}
                      <div className="px-2 py-1 bg-gray-50 border-b text-xs text-gray-600 font-medium truncate">
                        {image.name}
                      </div>
                      
                      {/* Image container */}
                      <div className="relative bg-white p-2">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-32 object-contain"
                        />
                        <div className="absolute inset-2 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all rounded" />
                        
                        {/* Selection checkmark */}
                        {selectedImages.includes(image.url) && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={assignImagesToProduct}
                disabled={loading || !selectedProduct || selectedImages.length === 0}
                className="w-full"
              >
                <Link2 className="h-4 w-4 mr-2" />
                Assign {selectedImages.length} Selected Images to Product
              </Button>
            </>
          )}

          {images.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No images found in Firebase Storage</p>
              <p className="text-sm">Upload some images first, then refresh</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}