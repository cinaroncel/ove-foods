'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, RefreshCw, Eye } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const PAGES = [
  { value: 'home', label: 'Home Page', path: '/' },
  { value: 'products', label: 'Products Page', path: '/products' },
  { value: 'recipes', label: 'Recipes Page', path: '/recipes' },
  { value: 'our-story', label: 'Our Story', path: '/our-story' },
  { value: 'sustainability', label: 'Sustainability', path: '/sustainability' },
  { value: 'contact', label: 'Contact', path: '/contact' },
  { value: 'where-to-buy', label: 'Where to Buy', path: '/where-to-buy' }
]

// Mock content data - in a real app, this would come from an API
const MOCK_CONTENT = {
  home: {
    hero: {
      headline: "Authentic Mediterranean Flavors",
      subcopy: "Premium olive oils, aged vinegars, and gourmet products crafted with three generations of Turkish expertise. From our family business to your kitchen.",
      primaryCta: "Explore Products",
      secondaryCta: "Find Recipes"
    },
    story: {
      headline: "Our Story",
      description: "From a family olive oil business established in Turkey in 1948 to a global premium food brand, discover three generations of passion and tradition behind OVE Foods."
    },
    products: {
      headline: "Featured Products",
      description: "Discover our most beloved oils and vinegars, each crafted with care and tradition."
    }
  },
  'our-story': {
    hero: {
      headline: "Our Journey",
      subcopy: "From a family olive oil business established in Turkey in 1948 to a global premium food brand, our story spans three generations of dedication to quality and tradition."
    },
    heritage: {
      headline: "Mediterranean Heritage",
      description: "Olive oil has been a staple of Mediterranean cultures for thousands of years, dating back to the Ancient Greeks and Romans..."
    }
  }
}

export function AdminContentEditor() {
  const [selectedPage, setSelectedPage] = useState<string>('')
  const [content, setContent] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const loadPageContent = (pageId: string) => {
    setSelectedPage(pageId)
    setContent(MOCK_CONTENT[pageId as keyof typeof MOCK_CONTENT] || {})
  }

  const updateContent = (section: string, field: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const saveContent = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/content/${selectedPage}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      if (response.ok) {
        toast({
          title: "Content saved",
          description: "Page content has been updated successfully",
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const previewPage = () => {
    const page = PAGES.find(p => p.value === selectedPage)
    if (page) {
      window.open(page.path, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Selector */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Label htmlFor="page-select">Select Page to Edit</Label>
          <Select value={selectedPage} onValueChange={loadPageContent}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Choose a page..." />
            </SelectTrigger>
            <SelectContent>
              {PAGES.map((page) => (
                <SelectItem key={page.value} value={page.value}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedPage && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={previewPage}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={saveContent} disabled={saving}>
              {saving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Content Editor */}
      {selectedPage && (
        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList>
            {Object.keys(content).map((section) => (
              <TabsTrigger key={section} value={section} className="capitalize">
                {section}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(content).map(([section, sectionContent]) => (
            <TabsContent key={section} value={section}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{section} Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(sectionContent as any).map(([field, value]) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={`${section}-${field}`} className="capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      {field.includes('description') || field.includes('subcopy') ? (
                        <Textarea
                          id={`${section}-${field}`}
                          value={value as string}
                          onChange={(e) => updateContent(section, field, e.target.value)}
                          rows={4}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <Input
                          id={`${section}-${field}`}
                          value={value as string}
                          onChange={(e) => updateContent(section, field, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {!selectedPage && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <div className="text-2xl font-semibold text-gray-400">Select a Page</div>
              <p className="text-gray-500">
                Choose a page from the dropdown above to start editing its content
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
