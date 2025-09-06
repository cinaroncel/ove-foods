import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getRecipes, getProducts } from '@/lib/cms/data-provider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Users, ChefHat, ArrowLeft } from 'lucide-react'

interface RecipePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipes = await getRecipes()
  const recipe = recipes.find(r => r.slug === params.slug)

  if (!recipe) {
    return {
      title: 'Recipe Not Found'
    }
  }

  return {
    title: recipe.seo?.title || recipe.title,
    description: recipe.seo?.description || recipe.description,
    openGraph: {
      title: recipe.seo?.title || recipe.title,
      description: recipe.seo?.description || recipe.description,
      images: recipe.seo?.ogImage ? [recipe.seo.ogImage] : [recipe.heroImage],
    },
  }
}

export async function generateStaticParams() {
  const recipes = await getRecipes()
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }))
}

export default async function RecipePage({ params }: RecipePageProps) {
  const [recipes, products] = await Promise.all([
    getRecipes(),
    getProducts()
  ])

  const recipe = recipes.find(r => r.slug === params.slug)

  if (!recipe) {
    notFound()
  }

  const relatedProducts = products.filter(p => 
    recipe.relatedProductIds?.includes(p.id)
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/recipes">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <Image
          src={`/assets/recipes/${recipe.heroImage}`}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12 text-white">
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-white/20 text-white">
                    {tag}
                  </Badge>
                ))}
                <Badge className={`${getDifficultyColor(recipe.difficulty)} border-0`}>
                  {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                </Badge>
                {recipe.featured && (
                  <Badge className="bg-amber-500 text-white border-0">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {recipe.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
                {recipe.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipe Info */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {recipe.times.prep + recipe.times.cook}
                    </div>
                    <div className="text-sm text-gray-600">Total Minutes</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {recipe.times.prep}
                    </div>
                    <div className="text-sm text-gray-600">Prep Time</div>
                  </div>
                  <div className="text-center">
                    <ChefHat className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {recipe.times.cook}
                    </div>
                    <div className="text-sm text-gray-600">Cook Time</div>
                  </div>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {recipe.servings}
                    </div>
                    <div className="text-sm text-gray-600">Servings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {ingredient.quantity} {ingredient.unit} {ingredient.item}
                        </div>
                        {ingredient.notes && (
                          <div className="text-sm text-gray-600 mt-1">
                            {ingredient.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Instructions</h2>
                <div className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-800 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Featured Products</h3>
                  <div className="space-y-4">
                    {relatedProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors">
                          {product.images[0] && (
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={`/assets/products/${product.images[0]}`}
                                alt={product.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium group-hover:text-amber-700 transition-colors">
                              {product.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {product.shortCopy}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recipe Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Back to Recipes */}
            <Card>
              <CardContent className="p-6 text-center">
                <Button asChild className="w-full">
                  <Link href="/recipes">
                    View All Recipes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}