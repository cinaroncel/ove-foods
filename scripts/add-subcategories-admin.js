// This script adds olive oil subcategories directly to Firestore
// Run this in the browser console on the admin panel page while authenticated

const subcategories = [
  {
    name: 'Organic Extra Virgin Olive Oil',
    slug: 'organic-extra-virgin-olive-oil', 
    description: 'Certified organic extra virgin olive oils from sustainably grown olives',
    parentCategoryId: 'olive-oils',
    order: 1,
    heroImage: 'https://placehold.co/1200x600/22c55e/ffffff?text=Organic+Extra+Virgin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Extra Virgin Olive Oil',
    slug: 'extra-virgin-olive-oil',
    description: 'Premium extra virgin olive oils with exceptional flavor and quality', 
    parentCategoryId: 'olive-oils',
    order: 2,
    heroImage: 'https://placehold.co/1200x600/16a34a/ffffff?text=Extra+Virgin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Pure Olive Oil',
    slug: 'pure-olive-oil',
    description: 'Classic pure olive oil perfect for cooking and everyday use',
    parentCategoryId: 'olive-oils', 
    order: 3,
    heroImage: 'https://placehold.co/1200x600/15803d/ffffff?text=Pure+Olive+Oil',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: 'Infused Olive Oils',
    slug: 'infused-olive-oils',
    description: 'Flavorful olive oils infused with herbs, spices, and natural ingredients',
    parentCategoryId: 'olive-oils',
    order: 4, 
    heroImage: 'https://placehold.co/1200x600/166534/ffffff?text=Infused+Olive+Oils',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Use this code in browser console on admin panel:
/*
(async function addSubcategories() {
  const { collection, addDoc } = await import('firebase/firestore');
  const { db } = await import('/lib/firebase/config.js');
  
  for (const subcategory of subcategories) {
    try {
      const docRef = await addDoc(collection(db, 'categories'), subcategory);
      console.log(`✅ Added: ${subcategory.name} (ID: ${docRef.id})`);
    } catch (error) {
      console.error(`❌ Failed to add ${subcategory.name}:`, error);
    }
  }
})();
*/

console.log('Copy the function above and run it in the browser console on the admin panel page.');
console.log('Subcategories to add:', subcategories.map(s => s.name));