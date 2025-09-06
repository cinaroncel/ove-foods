export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  heroImage?: string
  order: number
}

export interface Product {
  id: string
  slug: string
  title: string
  categoryId: string
  shortCopy: string
  longCopy: string
  images: string[]
  specs?: {
    volume?: string
    variety?: string
    origin?: string
    acidity?: string
  }
  nutrition?: {
    servingSize?: string
    calories?: number
    fat?: string
    saturatedFat?: string
    sodium?: string
    carbs?: string
    protein?: string
  }
  certifications: Array<{
    label: string
    icon?: string
  }>
  awards: Array<{
    name: string
    year: number
    link?: string
  }>
  relatedRecipeIds: string[]
  retailerLinks: Array<{
    label: string
    url: string
  }>
  featured?: boolean
  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
}

export interface Recipe {
  id: string
  slug: string
  title: string
  heroImage: string
  description: string
  ingredients: Array<{
    item: string
    quantity: number
    unit: string
    notes?: string
  }>
  steps: string[]
  times: {
    prep: number // minutes
    cook: number // minutes
  }
  servings: number
  tags: string[]
  relatedProductIds: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  featured?: boolean
  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
}

export interface Location {
  id: string
  type: 'Headquarters' | 'Factory' | 'Office'
  name: string
  address: {
    street: string
    city: string
    region: string
    postal: string
    country: string
  }
  phone?: string
  fax?: string
  email?: string
  hours?: string
  mapUrl?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface StoryPost {
  id: string
  slug: string
  title: string
  coverImage: string
  excerpt: string
  content: string
  year?: number
  featured?: boolean
  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
}

export interface SustainabilityPost {
  id: string
  slug: string
  title: string
  coverImage: string
  excerpt: string
  content: string
  pillar: 'sourcing' | 'environment' | 'community'
  badges: Array<{
    label: string
    icon?: string
  }>
  resources?: Array<{
    label: string
    url: string
  }>
  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
}

export interface SustainabilityMetric {
  id: string
  label: string
  value: string
  description?: string
  icon?: string
}

export interface Page {
  id: string
  slug: string
  title: string
  sections: Array<{
    type: 'hero' | 'richText' | 'imageGrid' | 'stats' | 'contact' | 'custom'
    data: any
  }>
  seo?: {
    title?: string
    description?: string
    ogImage?: string
  }
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Search and filter types
export interface SearchFilters {
  query?: string
  category?: string
  tags?: string[]
  difficulty?: string
  featured?: boolean
}

export interface SearchResult<T> {
  item: T
  score: number
}
