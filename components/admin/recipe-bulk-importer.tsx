'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { recipesService } from '@/lib/firebase/firestore'
import { ChefHat, Upload } from 'lucide-react'

const sampleRecipes = [
  {
    title: "Mediterranean Grilled Vegetables",
    slug: "mediterranean-grilled-vegetables",
    description: "Fresh seasonal vegetables grilled to perfection with OVE extra virgin olive oil and aromatic herbs.",
    heroImage: "https://picsum.photos/800/600?random=1",
    ingredients: [
      { item: "Extra Virgin Olive Oil", quantity: 4, unit: "tbsp", notes: "OVE Classic" },
      { item: "Zucchini", quantity: 2, unit: "pieces", notes: "sliced" },
      { item: "Bell Peppers", quantity: 2, unit: "pieces", notes: "mixed colors" },
      { item: "Eggplant", quantity: 1, unit: "piece", notes: "medium sized" },
      { item: "Cherry Tomatoes", quantity: 200, unit: "g", notes: "" },
      { item: "Fresh Herbs", quantity: 2, unit: "tbsp", notes: "rosemary, thyme" },
      { item: "Sea Salt", quantity: 1, unit: "tsp", notes: "" },
      { item: "Black Pepper", quantity: 0.5, unit: "tsp", notes: "freshly ground" }
    ],
    steps: [
      "Preheat your grill or grill pan to medium-high heat.",
      "Slice all vegetables into uniform pieces for even cooking.",
      "In a large bowl, toss vegetables with OVE extra virgin olive oil, ensuring all pieces are well coated.",
      "Season with salt, pepper, and fresh herbs.",
      "Grill vegetables for 8-12 minutes, turning once, until tender and lightly charred.",
      "Arrange on a platter and drizzle with additional olive oil before serving."
    ],
    servings: 4,
    difficulty: "easy" as const,
    times: { prep: 15, cook: 12 },
    tags: ["vegetarian", "healthy", "mediterranean", "grilled", "summer"],
    featured: true,
    relatedProductIds: []
  },
  {
    title: "Herb-Crusted Salmon with Lemon Oil",
    slug: "herb-crusted-salmon-lemon-oil",
    description: "Tender salmon fillet with a fragrant herb crust, finished with OVE lemon-infused olive oil.",
    heroImage: "https://picsum.photos/800/600?random=2",
    ingredients: [
      { item: "Salmon Fillets", quantity: 4, unit: "pieces", notes: "150g each" },
      { item: "Extra Virgin Olive Oil", quantity: 3, unit: "tbsp", notes: "OVE Classic" },
      { item: "Lemon Infused Olive Oil", quantity: 2, unit: "tbsp", notes: "OVE Lemon" },
      { item: "Fresh Dill", quantity: 2, unit: "tbsp", notes: "chopped" },
      { item: "Fresh Parsley", quantity: 2, unit: "tbsp", notes: "chopped" },
      { item: "Breadcrumbs", quantity: 100, unit: "g", notes: "panko" },
      { item: "Lemon Zest", quantity: 1, unit: "lemon", notes: "" },
      { item: "Garlic", quantity: 2, unit: "cloves", notes: "minced" }
    ],
    steps: [
      "Preheat oven to 200°C (180°C fan).",
      "Pat salmon fillets dry and season with salt and pepper.",
      "Mix breadcrumbs, herbs, garlic, and lemon zest in a bowl.",
      "Brush salmon with classic olive oil, then press herb mixture on top.",
      "Heat an oven-safe pan with olive oil over medium-high heat.",
      "Sear salmon skin-side up for 2 minutes, then flip and transfer to oven.",
      "Bake for 8-10 minutes until fish flakes easily.",
      "Drizzle with lemon-infused olive oil before serving."
    ],
    servings: 4,
    difficulty: "medium" as const,
    times: { prep: 20, cook: 15 },
    tags: ["seafood", "healthy", "protein", "herbs", "gourmet"],
    featured: true,
    relatedProductIds: []
  },
  {
    title: "Classic Greek Salad with Aged Balsamic",
    slug: "classic-greek-salad-aged-balsamic",
    description: "Traditional Greek salad elevated with OVE aged balsamic vinegar and premium extra virgin olive oil.",
    heroImage: "https://picsum.photos/800/600?random=3",
    ingredients: [
      { item: "Extra Virgin Olive Oil", quantity: 4, unit: "tbsp", notes: "OVE Classic" },
      { item: "Aged Balsamic Vinegar", quantity: 2, unit: "tbsp", notes: "OVE Aged" },
      { item: "Tomatoes", quantity: 4, unit: "pieces", notes: "large, ripe" },
      { item: "Cucumber", quantity: 1, unit: "piece", notes: "large" },
      { item: "Red Onion", quantity: 0.5, unit: "piece", notes: "thinly sliced" },
      { item: "Feta Cheese", quantity: 200, unit: "g", notes: "block, not crumbled" },
      { item: "Kalamata Olives", quantity: 100, unit: "g", notes: "" },
      { item: "Dried Oregano", quantity: 1, unit: "tsp", notes: "" }
    ],
    steps: [
      "Cut tomatoes into wedges and cucumber into thick slices.",
      "Arrange vegetables on a large platter with red onion slices.",
      "Add chunks of feta cheese and scatter olives around.",
      "Whisk together olive oil and aged balsamic vinegar.",
      "Drizzle dressing over salad just before serving.",
      "Sprinkle with oregano and let sit for 10 minutes to allow flavors to meld.",
      "Serve with warm pita bread."
    ],
    servings: 6,
    difficulty: "easy" as const,
    times: { prep: 15, cook: 0 },
    tags: ["vegetarian", "greek", "salad", "fresh", "no-cook"],
    featured: false,
    relatedProductIds: []
  },
  {
    title: "Truffle Oil Risotto",
    slug: "truffle-oil-risotto",
    description: "Creamy arborio rice risotto finished with luxurious OVE truffle-infused olive oil.",
    heroImage: "https://picsum.photos/800/600?random=4",
    ingredients: [
      { item: "Arborio Rice", quantity: 300, unit: "g", notes: "" },
      { item: "Chicken Stock", quantity: 1000, unit: "ml", notes: "warm" },
      { item: "Extra Virgin Olive Oil", quantity: 2, unit: "tbsp", notes: "OVE Classic" },
      { item: "Truffle Oil", quantity: 2, unit: "tbsp", notes: "OVE Truffle" },
      { item: "White Wine", quantity: 125, unit: "ml", notes: "dry" },
      { item: "Onion", quantity: 1, unit: "piece", notes: "finely diced" },
      { item: "Parmesan", quantity: 100, unit: "g", notes: "grated" },
      { item: "Butter", quantity: 2, unit: "tbsp", notes: "" }
    ],
    steps: [
      "Heat stock in a separate pan and keep warm.",
      "Heat olive oil in a heavy-bottomed pan over medium heat.",
      "Sauté onion until translucent, about 5 minutes.",
      "Add rice and stir to coat with oil, toasting for 2 minutes.",
      "Pour in wine and stir until absorbed.",
      "Add warm stock one ladle at a time, stirring constantly.",
      "Continue for 18-20 minutes until rice is creamy but still has bite.",
      "Stir in butter, parmesan, and finish with truffle oil.",
      "Serve immediately with extra parmesan."
    ],
    servings: 4,
    difficulty: "medium" as const,
    times: { prep: 10, cook: 25 },
    tags: ["italian", "rice", "truffle", "creamy", "comfort"],
    featured: false,
    relatedProductIds: []
  },
  {
    title: "Balsamic Glazed Roasted Chicken",
    slug: "balsamic-glazed-roasted-chicken",
    description: "Succulent roasted chicken with a rich balsamic glaze made with OVE premium balsamic vinegar.",
    heroImage: "https://picsum.photos/800/600?random=5",
    ingredients: [
      { item: "Whole Chicken", quantity: 1.5, unit: "kg", notes: "" },
      { item: "Extra Virgin Olive Oil", quantity: 3, unit: "tbsp", notes: "OVE Classic" },
      { item: "Balsamic Vinegar", quantity: 4, unit: "tbsp", notes: "OVE Premium" },
      { item: "Honey", quantity: 2, unit: "tbsp", notes: "" },
      { item: "Garlic", quantity: 4, unit: "cloves", notes: "minced" },
      { item: "Fresh Rosemary", quantity: 2, unit: "sprigs", notes: "" },
      { item: "Fresh Thyme", quantity: 2, unit: "sprigs", notes: "" },
      { item: "Salt", quantity: 1, unit: "tsp", notes: "" },
      { item: "Black Pepper", quantity: 0.5, unit: "tsp", notes: "" }
    ],
    steps: [
      "Preheat oven to 190°C (170°C fan).",
      "Pat chicken dry and season inside and out with salt and pepper.",
      "Rub olive oil all over the chicken skin.",
      "Place herbs and 2 garlic cloves inside the cavity.",
      "Roast for 60-70 minutes until internal temperature reaches 75°C.",
      "Meanwhile, mix balsamic vinegar, honey, and remaining garlic for glaze.",
      "In the last 15 minutes, brush chicken with glaze every 5 minutes.",
      "Rest for 10 minutes before carving.",
      "Serve with pan juices and extra glaze."
    ],
    servings: 4,
    difficulty: "medium" as const,
    times: { prep: 15, cook: 75 },
    tags: ["chicken", "roasted", "balsamic", "herbs", "main-course"],
    featured: true,
    relatedProductIds: []
  },
  {
    title: "Mediterranean Pasta Puttanesca",
    slug: "mediterranean-pasta-puttanesca",
    description: "Bold and flavorful pasta with olives, capers, and tomatoes, finished with OVE extra virgin olive oil.",
    heroImage: "https://picsum.photos/800/600?random=6",
    ingredients: [
      { item: "Spaghetti", quantity: 400, unit: "g", notes: "" },
      { item: "Extra Virgin Olive Oil", quantity: 4, unit: "tbsp", notes: "OVE Classic" },
      { item: "Canned Tomatoes", quantity: 400, unit: "g", notes: "crushed" },
      { item: "Black Olives", quantity: 100, unit: "g", notes: "pitted" },
      { item: "Capers", quantity: 2, unit: "tbsp", notes: "" },
      { item: "Anchovies", quantity: 4, unit: "fillets", notes: "optional" },
      { item: "Garlic", quantity: 4, unit: "cloves", notes: "sliced" },
      { item: "Red Chili Flakes", quantity: 0.5, unit: "tsp", notes: "" },
      { item: "Fresh Parsley", quantity: 3, unit: "tbsp", notes: "chopped" }
    ],
    steps: [
      "Bring a large pot of salted water to boil for pasta.",
      "Heat olive oil in a large pan over medium heat.",
      "Add garlic and chili flakes, cook for 1 minute until fragrant.",
      "Add anchovies (if using) and mash into the oil.",
      "Add tomatoes, olives, and capers. Simmer for 10 minutes.",
      "Cook spaghetti according to package instructions until al dente.",
      "Reserve 1 cup pasta water, then drain pasta.",
      "Toss pasta with sauce, adding pasta water if needed.",
      "Garnish with parsley and extra olive oil before serving."
    ],
    servings: 4,
    difficulty: "easy" as const,
    times: { prep: 15, cook: 20 },
    tags: ["pasta", "italian", "olives", "tomatoes", "quick"],
    featured: false,
    relatedProductIds: []
  }
]

interface RecipeBulkImporterProps {
  onImportComplete?: () => void
}

export function RecipeBulkImporter({ onImportComplete }: RecipeBulkImporterProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [importedCount, setImportedCount] = useState(0)

  const handleBulkImport = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setImportedCount(0)
    
    try {
      for (const recipe of sampleRecipes) {
        await recipesService.create(recipe)
        setImportedCount(prev => prev + 1)
      }
      
      setSuccess(`Successfully imported ${sampleRecipes.length} recipes with beautiful images!`)
      onImportComplete?.()
    } catch (error: any) {
      console.error('Bulk import error:', error)
      setError(`Failed to import recipes: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          Recipe Bulk Importer
        </CardTitle>
        <CardDescription>
          Import {sampleRecipes.length} sample recipes with professional food images to populate your recipes section
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

        {loading && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Importing recipes... ({importedCount}/{sampleRecipes.length})
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(importedCount / sampleRecipes.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Recipes to Import:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto text-sm">
            {sampleRecipes.map((recipe, index) => (
              <div 
                key={index} 
                className={`p-2 border rounded text-xs ${
                  importedCount > index ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                }`}
              >
                <div className="font-medium">{recipe.title}</div>
                <div className="text-muted-foreground capitalize">
                  {recipe.difficulty} • {recipe.servings} servings • {recipe.tags.slice(0, 2).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleBulkImport}
          disabled={loading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {loading ? `Importing... (${importedCount}/${sampleRecipes.length})` : `Import ${sampleRecipes.length} Sample Recipes`}
        </Button>
      </CardContent>
    </Card>
  )
}