import { getRecipes } from '@/lib/cms/data-provider'
import { getUniqueRecipeTags } from '@/lib/search'
import RecipesClient from './recipes-client'
import type { Recipe } from '@/lib/cms/types'

export const dynamic = 'force-dynamic' // Force fresh data every time

export default async function RecipesPage() {
  // Server-side data fetching - force fresh data
  const recipes = await getRecipes()
  const tags = getUniqueRecipeTags(recipes)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-muted/20 py-12">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Recipe Collection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover Mediterranean-inspired recipes that showcase the authentic flavors 
              of our premium olive oils and vinegars.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <RecipesClient initialRecipes={recipes} tags={tags} />
    </div>
  )
}
