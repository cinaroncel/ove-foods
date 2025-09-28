'use client';

import { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';

const newRecipes = [
  {
    "id": "grilled-lemon-herb-salmon",
    "slug": "grilled-lemon-herb-salmon",
    "title": "Grilled Lemon Herb Salmon with Balsamic Glaze",
    "heroImage": "salmon-balsamic-hero.jpg",
    "description": "Tender grilled salmon with fresh herbs, finished with our premium balsamic vinegar glaze.",
    "ingredients": [
      { "item": "Salmon fillets", "quantity": 4, "unit": "pieces", "notes": "6 oz each" },
      { "item": "OVE Premium Extra Virgin Olive Oil", "quantity": 3, "unit": "tbsp" },
      { "item": "Fresh lemon", "quantity": 2, "unit": "whole", "notes": "juiced and zested" },
      { "item": "Fresh dill", "quantity": 2, "unit": "tbsp", "notes": "chopped" },
      { "item": "Fresh parsley", "quantity": 2, "unit": "tbsp", "notes": "chopped" },
      { "item": "Garlic", "quantity": 3, "unit": "cloves", "notes": "minced" },
      { "item": "OVE 18-Year Aged Balsamic Vinegar", "quantity": 3, "unit": "tbsp" },
      { "item": "Honey", "quantity": 1, "unit": "tbsp" },
      { "item": "Salt and pepper", "quantity": 1, "unit": "to taste" }
    ],
    "steps": [
      "Preheat grill to medium-high heat.",
      "In a bowl, mix olive oil, lemon juice, lemon zest, dill, parsley, and garlic.",
      "Season salmon fillets with salt and pepper, then brush with herb mixture.",
      "Let marinate for 15 minutes.",
      "Meanwhile, in a small saucepan, reduce balsamic vinegar and honey until syrupy.",
      "Grill salmon for 4-5 minutes per side until cooked through.",
      "Drizzle with balsamic glaze before serving."
    ],
    "times": {
      "prep": 20,
      "cook": 15
    },
    "servings": 4,
    "tags": ["healthy", "protein", "mediterranean", "grilled", "omega-3"],
    "relatedProductIds": ["extra-virgin-olive-oil-premium", "aged-balsamic-vinegar"],
    "difficulty": "medium",
    "featured": true
  },
  {
    "id": "mediterranean-stuffed-peppers",
    "slug": "mediterranean-stuffed-peppers",
    "title": "Mediterranean Stuffed Bell Peppers",
    "heroImage": "roasted-veggies-hero.jpg",
    "description": "Colorful bell peppers stuffed with a flavorful mixture of rice, vegetables, and Mediterranean herbs.",
    "ingredients": [
      { "item": "Large bell peppers", "quantity": 6, "unit": "whole", "notes": "mixed colors" },
      { "item": "Brown rice", "quantity": 1, "unit": "cup", "notes": "cooked" },
      { "item": "OVE Premium Extra Virgin Olive Oil", "quantity": 4, "unit": "tbsp" },
      { "item": "Red onion", "quantity": 1, "unit": "medium", "notes": "diced" },
      { "item": "Zucchini", "quantity": 1, "unit": "medium", "notes": "diced" },
      { "item": "Cherry tomatoes", "quantity": 1, "unit": "cup", "notes": "halved" },
      { "item": "Feta cheese", "quantity": 0.5, "unit": "cup", "notes": "crumbled" },
      { "item": "Pine nuts", "quantity": 0.25, "unit": "cup" },
      { "item": "Fresh oregano", "quantity": 2, "unit": "tbsp" },
      { "item": "Fresh basil", "quantity": 2, "unit": "tbsp", "notes": "chopped" }
    ],
    "steps": [
      "Preheat oven to 375°F (190°C).",
      "Cut tops off peppers and remove seeds and membranes.",
      "Heat 2 tbsp olive oil in a large skillet over medium heat.",
      "Sauté onion and zucchini until tender, about 5 minutes.",
      "Add tomatoes, oregano, and basil. Cook for 3 minutes.",
      "Stir in cooked rice, feta, and pine nuts.",
      "Stuff peppers with the mixture and place in baking dish.",
      "Drizzle with remaining olive oil and bake for 30-35 minutes."
    ],
    "times": {
      "prep": 25,
      "cook": 35
    },
    "servings": 6,
    "tags": ["vegetarian", "mediterranean", "stuffed", "healthy", "rice"],
    "relatedProductIds": ["extra-virgin-olive-oil-premium"],
    "difficulty": "medium",
    "featured": false
  },
  {
    "id": "classic-spaghetti-aglio-olio",
    "slug": "classic-spaghetti-aglio-olio",
    "title": "Classic Spaghetti Aglio e Olio",
    "heroImage": "aglio-olio-hero.jpg",
    "description": "The ultimate Italian comfort food - spaghetti with garlic and olive oil, simple yet incredibly flavorful.",
    "ingredients": [
      { "item": "Spaghetti", "quantity": 1, "unit": "lb" },
      { "item": "OVE Premium Extra Virgin Olive Oil", "quantity": 0.5, "unit": "cup" },
      { "item": "Garlic", "quantity": 8, "unit": "cloves", "notes": "thinly sliced" },
      { "item": "Red pepper flakes", "quantity": 1, "unit": "tsp" },
      { "item": "Fresh parsley", "quantity": 0.5, "unit": "cup", "notes": "chopped" },
      { "item": "Parmigiano-Reggiano", "quantity": 0.5, "unit": "cup", "notes": "grated" },
      { "item": "Sea salt", "quantity": 1, "unit": "to taste" },
      { "item": "Black pepper", "quantity": 1, "unit": "to taste" }
    ],
    "steps": [
      "Bring a large pot of salted water to boil and cook spaghetti al dente.",
      "While pasta cooks, heat olive oil in a large skillet over medium-low heat.",
      "Add sliced garlic and red pepper flakes, cook until garlic is golden.",
      "Reserve 1 cup pasta water before draining spaghetti.",
      "Add drained pasta to the skillet with garlic oil.",
      "Toss with pasta water to create a silky sauce.",
      "Remove from heat, add parsley and half the cheese.",
      "Serve immediately with remaining cheese and black pepper."
    ],
    "times": {
      "prep": 10,
      "cook": 15
    },
    "servings": 4,
    "tags": ["italian", "pasta", "vegetarian", "simple", "classic"],
    "relatedProductIds": ["extra-virgin-olive-oil-premium"],
    "difficulty": "easy",
    "featured": true
  },
  {
    "id": "mediterranean-quinoa-bowl",
    "slug": "mediterranean-quinoa-bowl",
    "title": "Mediterranean Quinoa Power Bowl",
    "heroImage": "mediterranean-salad-hero.jpg",
    "description": "A nutritious and colorful quinoa bowl packed with Mediterranean flavors and our premium olive oil.",
    "ingredients": [
      { "item": "Quinoa", "quantity": 1, "unit": "cup", "notes": "rinsed" },
      { "item": "Chickpeas", "quantity": 1, "unit": "can", "notes": "15 oz, drained" },
      { "item": "OVE Premium Extra Virgin Olive Oil", "quantity": 4, "unit": "tbsp" },
      { "item": "Cucumber", "quantity": 1, "unit": "large", "notes": "diced" },
      { "item": "Cherry tomatoes", "quantity": 2, "unit": "cups", "notes": "halved" },
      { "item": "Red onion", "quantity": 0.25, "unit": "medium", "notes": "thinly sliced" },
      { "item": "Kalamata olives", "quantity": 0.5, "unit": "cup" },
      { "item": "Feta cheese", "quantity": 4, "unit": "oz", "notes": "crumbled" },
      { "item": "Fresh lemon juice", "quantity": 3, "unit": "tbsp" },
      { "item": "Fresh oregano", "quantity": 1, "unit": "tbsp" },
      { "item": "Fresh mint", "quantity": 2, "unit": "tbsp", "notes": "chopped" }
    ],
    "steps": [
      "Cook quinoa according to package instructions and let cool.",
      "In a large bowl, combine cooked quinoa, chickpeas, cucumber, tomatoes, and red onion.",
      "Add Kalamata olives and crumbled feta cheese.",
      "In a small bowl, whisk together olive oil, lemon juice, oregano, and mint.",
      "Pour dressing over quinoa mixture and toss well.",
      "Season with salt and pepper to taste.",
      "Let marinate for 15 minutes before serving.",
      "Serve chilled or at room temperature."
    ],
    "times": {
      "prep": 20,
      "cook": 15
    },
    "servings": 4,
    "tags": ["vegetarian", "healthy", "protein", "quinoa", "mediterranean", "meal-prep"],
    "relatedProductIds": ["extra-virgin-olive-oil-premium"],
    "difficulty": "easy",
    "featured": false
  },
  {
    "id": "honey-balsamic-chicken",
    "slug": "honey-balsamic-chicken",
    "title": "Honey Balsamic Glazed Chicken Thighs",
    "heroImage": "herb-chicken-hero.jpg",
    "description": "Succulent chicken thighs glazed with honey and our aged balsamic vinegar, roasted to perfection.",
    "ingredients": [
      { "item": "Chicken thighs", "quantity": 8, "unit": "pieces", "notes": "bone-in, skin-on" },
      { "item": "OVE Premium Extra Virgin Olive Oil", "quantity": 3, "unit": "tbsp" },
      { "item": "OVE 18-Year Aged Balsamic Vinegar", "quantity": 0.25, "unit": "cup" },
      { "item": "Honey", "quantity": 3, "unit": "tbsp" },
      { "item": "Garlic", "quantity": 4, "unit": "cloves", "notes": "minced" },
      { "item": "Fresh thyme", "quantity": 2, "unit": "tbsp" },
      { "item": "Fresh rosemary", "quantity": 1, "unit": "tbsp", "notes": "chopped" },
      { "item": "Dijon mustard", "quantity": 1, "unit": "tbsp" },
      { "item": "Salt and pepper", "quantity": 1, "unit": "to taste" }
    ],
    "steps": [
      "Preheat oven to 425°F (220°C).",
      "Pat chicken thighs dry and season with salt and pepper.",
      "Heat olive oil in a large oven-safe skillet over medium-high heat.",
      "Sear chicken thighs skin-side down for 5 minutes until golden.",
      "Flip chicken and cook for 3 more minutes.",
      "In a bowl, whisk together balsamic vinegar, honey, garlic, thyme, rosemary, and mustard.",
      "Pour glaze over chicken and transfer skillet to oven.",
      "Roast for 20-25 minutes until chicken reaches 165°F internal temperature."
    ],
    "times": {
      "prep": 15,
      "cook": 35
    },
    "servings": 4,
    "tags": ["protein", "roasted", "glazed", "mediterranean", "dinner"],
    "relatedProductIds": ["extra-virgin-olive-oil-premium", "aged-balsamic-vinegar"],
    "difficulty": "medium",
    "featured": true
  },
  {
    "id": "italian-bruschetta",
    "slug": "italian-bruschetta",
    "title": "Classic Italian Bruschetta",
    "heroImage": "caprese-hero.jpg",
    "description": "Fresh tomato and basil bruschetta drizzled with premium olive oil on toasted artisan bread.",
    "ingredients": [
      { "item": "Artisan bread", "quantity": 1, "unit": "loaf", "notes": "sliced thick" },
      { "item": "Ripe tomatoes", "quantity": 6, "unit": "large", "notes": "diced" },
      { "item": "Fresh basil", "quantity": 0.5, "unit": "cup", "notes": "chiffonade" },
      { "item": "OVE Premium Extra Virgin Olive Oil", "quantity": 0.25, "unit": "cup" },
      { "item": "Garlic", "quantity": 3, "unit": "cloves", "notes": "minced" },
      { "item": "OVE 18-Year Aged Balsamic Vinegar", "quantity": 1, "unit": "tbsp" },
      { "item": "Fresh mozzarella", "quantity": 4, "unit": "oz", "notes": "diced (optional)" },
      { "item": "Sea salt", "quantity": 1, "unit": "to taste" },
      { "item": "Black pepper", "quantity": 1, "unit": "to taste" }
    ],
    "steps": [
      "Preheat oven to 400°F (200°C).",
      "Brush bread slices with olive oil and toast until golden.",
      "Rub warm toast with a garlic clove for extra flavor.",
      "In a bowl, combine diced tomatoes, basil, minced garlic, and balsamic vinegar.",
      "Season with salt and pepper, let stand for 10 minutes.",
      "Add mozzarella if using and gently mix.",
      "Top each toast slice with tomato mixture.",
      "Drizzle with additional olive oil before serving."
    ],
    "times": {
      "prep": 20,
      "cook": 10
    },
    "servings": 6,
    "tags": ["appetizer", "italian", "fresh", "vegetarian", "no-cook"],
    "relatedProductIds": ["extra-virgin-olive-oil-premium", "aged-balsamic-vinegar"],
    "difficulty": "easy",
    "featured": false
  }
];

export default function BulkUploadRecipesPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const uploadRecipes = async () => {
    setIsUploading(true);
    setUploadStatus([]);
    
    try {
      for (let i = 0; i < newRecipes.length; i++) {
        const recipe = newRecipes[i];
        setUploadStatus(prev => [...prev, `Uploading: ${recipe.title}...`]);
        
        await setDoc(doc(db, 'recipes', recipe.id), recipe);
        
        setUploadStatus(prev => {
          const newStatus = [...prev];
          newStatus[newStatus.length - 1] = `✅ Uploaded: ${recipe.title}`;
          return newStatus;
        });
      }
      
      setIsComplete(true);
      setUploadStatus(prev => [...prev, '', '🎉 All 6 recipes uploaded successfully!']);
    } catch (error) {
      console.error('Error uploading recipes:', error);
      setUploadStatus(prev => [...prev, `❌ Error: ${error.message}`]);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Bulk Upload New Recipes</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">6 New Recipes Ready to Upload:</h2>
            <ul className="space-y-2">
              {newRecipes.map((recipe, index) => (
                <li key={recipe.id} className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <span>{recipe.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <Button 
              onClick={uploadRecipes} 
              disabled={isUploading || isComplete}
              size="lg"
              className="w-full"
            >
              {isUploading ? 'Uploading...' : isComplete ? 'Upload Complete!' : 'Upload All Recipes to Firebase'}
            </Button>
          </div>

          {uploadStatus.length > 0 && (
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Upload Status:</h3>
              <div className="space-y-1 font-mono text-sm">
                {uploadStatus.map((status, index) => (
                  <div key={index}>{status}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}