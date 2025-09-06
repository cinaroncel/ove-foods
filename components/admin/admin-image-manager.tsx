'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Search, Folder, Trash2, Eye, Copy } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const IMAGE_CATEGORIES = [
  { value: 'all', label: 'All Images' },
  { value: 'products', label: 'Products' },
  { value: 'recipes', label: 'Recipes' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'other', label: 'Other' }
]

// Mock image data - in a real app, this would come from an API
const MOCK_IMAGES = [
  {
    id: '1',
    filename: 'premium-olive-oil-bottle.jpg',
    category: 'products',
    url: '/assets/products/premium-olive-oil-bottle.jpg',
    size: '245 KB',
    uploadDate: '2024-01-15'
  },
  {
    id: '2', 
    filename: 'aged-balsamic-vinegar.png',
    category: 'products',
    url: '/assets/products/aged-balsamic-vinegar.png',
    size: '312 KB',
    uploadDate: '2024-01-14'
  },
  {
    id: '3',
    filename: 'facilities-1.jpeg',
    category: 'facilities',
    url: '/assets/facilities/facilities-1.jpeg',
    size: '1.2 MB',
    uploadDate: '2024-01-13'
  }
]

export function AdminImageManager() {
  const [images, setImages] = useState(MOCK_IMAGES)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const filteredImages = images.filter(image => {
    const matchesSearch = image.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', selectedCategory === 'all' ? 'other' : selectedCategory)

        const response = await fetch('/api/admin/images/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          setImages(prev => [...prev, result.image])
        }
      }

      toast({
        title: "Images uploaded",
        description: `Successfully uploaded ${files.length} image(s)`,
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const copyImagePath = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied!",
      description: "Image path copied to clipboard",
    })
  }

  const deleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== imageId))
        toast({
          title: "Image deleted",
          description: "Image has been removed successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Images'}
              </Button>
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop files here, or click to select files
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {IMAGE_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={image.url}
                alt={image.filename}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => copyImagePath(image.url)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteImage(image.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="font-medium text-sm truncate" title={image.filename}>
                  {image.filename}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {image.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{image.size}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {image.uploadDate}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Image className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>No images found</p>
          {searchTerm && (
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          )}
        </div>
      )}
    </div>
  )
}
