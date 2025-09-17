const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc } = require('firebase/firestore');
const { getStorage, ref, listAll, getDownloadURL } = require('firebase/storage');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCuM8UIRP1vxvu5F2aEoG9GaPtWJ80xKi4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ove-foods.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ove-foods",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ove-foods.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "402049052326",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:402049052326:web:81934fb0b78e522e7b0e67",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-PWYG73C90T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Subcategory mapping for smart categorization
const subcategoryMapping = {
  'organic': 'organic-extra-virgin-olive-oil',
  'extra-virgin': 'extra-virgin-olive-oil', 
  'pure': 'pure-olive-oil',
  'infused': 'infused-olive-oils',
  'lemon': 'infused-olive-oils',
  'herb': 'infused-olive-oils',
  'garlic': 'infused-olive-oils',
  'rosemary': 'infused-olive-oils',
  'basil': 'infused-olive-oils'
};

async function getUnusedImages() {
  try {
    console.log('🔍 Analyzing Firebase storage for unused images...\n');
    
    // Get all products to see which images are already in use
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const usedImages = new Set();
    
    productsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.images && Array.isArray(data.images)) {
        data.images.forEach(imageUrl => {
          // Extract image name from URL
          const imageName = imageUrl.split('/').pop()?.split('?')[0];
          if (imageName) usedImages.add(imageName);
        });
      }
    });
    
    console.log(`📊 Found ${usedImages.size} images currently in use`);
    
    // Get all images from Firebase Storage
    const imagesRef = ref(storage, 'products');
    const imagesList = await listAll(imagesRef);
    
    console.log(`📁 Found ${imagesList.items.length} total images in storage`);
    
    // Find unused images
    const unusedImages = [];
    for (const imageRef of imagesList.items) {
      const imageName = imageRef.name;
      if (!usedImages.has(imageName)) {
        const url = await getDownloadURL(imageRef);
        unusedImages.push({
          name: imageName,
          url: url,
          path: imageRef.fullPath
        });
      }
    }
    
    console.log(`✨ Found ${unusedImages.length} unused images\n`);
    
    return unusedImages;
    
  } catch (error) {
    console.error('❌ Error getting unused images:', error);
    return [];
  }
}

function generateProductFromImage(image) {
  const imageName = image.name.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  
  // Smart naming based on image name patterns
  let productTitle = '';
  let categoryId = 'olive-oils'; // Default
  let description = '';
  
  // Detect product type from image name
  if (imageName.toLowerCase().includes('organic')) {
    productTitle = generateSmartTitle(imageName, 'Organic Extra Virgin Olive Oil');
    categoryId = 'organic-extra-virgin-olive-oil';
    description = 'Premium organic extra virgin olive oil certified for purity and sustainability';
  } else if (imageName.toLowerCase().includes('extra') || imageName.toLowerCase().includes('virgin')) {
    productTitle = generateSmartTitle(imageName, 'Extra Virgin Olive Oil');
    categoryId = 'extra-virgin-olive-oil';  
    description = 'Premium extra virgin olive oil with exceptional flavor and quality';
  } else if (imageName.toLowerCase().includes('pure')) {
    productTitle = generateSmartTitle(imageName, 'Pure Olive Oil');
    categoryId = 'pure-olive-oil';
    description = 'Classic pure olive oil perfect for cooking and everyday use';
  } else if (imageName.toLowerCase().match(/(lemon|herb|garlic|rosemary|basil|infused)/)) {
    productTitle = generateSmartTitle(imageName, 'Infused Olive Oil');
    categoryId = 'infused-olive-oils';
    description = 'Flavorful olive oil infused with natural ingredients for enhanced taste';
  } else {
    // Default to extra virgin
    productTitle = generateSmartTitle(imageName, 'Extra Virgin Olive Oil');
    categoryId = 'extra-virgin-olive-oil';
    description = 'Premium extra virgin olive oil with exceptional flavor and quality';
  }
  
  // Generate optimized slug
  const slug = productTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^(organic|extra|virgin|olive|oil|pure|infused)-?/, '') // Remove redundant category words
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return {
    title: productTitle,
    slug: slug || imageName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    categoryId,
    shortCopy: description,
    longCopy: `${description}. Crafted with care using traditional Mediterranean methods, this premium product represents our commitment to quality and authenticity.`,
    images: [image.url],
    specs: {
      volume: detectVolume(imageName),
      variety: 'Mediterranean',
      origin: 'Turkey',
      acidity: '< 0.8%'
    },
    certifications: categoryId.includes('organic') ? [
      { label: 'Organic Certified' },
      { label: 'Non-GMO' }
    ] : [
      { label: 'Premium Quality' }
    ],
    awards: [],
    retailerLinks: [
      { label: 'Contact for Purchase', url: '/contact' }
    ],
    relatedRecipeIds: [],
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function generateSmartTitle(imageName, baseTitle) {
  // Extract meaningful parts from image name
  const nameParts = imageName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
  
  // Look for numbers that might indicate variants
  const numberMatch = imageName.match(/(\d+(?:\.\d+)?)/);
  const number = numberMatch ? numberMatch[1] : null;
  
  // Look for volume indicators
  const volumeMatch = imageName.match(/(\d+)(ml|l|oz)/i);
  
  if (number && !volumeMatch) {
    return `${baseTitle} ${number}`;
  } else if (volumeMatch) {
    return `${baseTitle} ${volumeMatch[0]}`;
  } else {
    // Find unique descriptors
    const descriptors = nameParts.filter(part => 
      !['organic', 'extra', 'virgin', 'olive', 'oil', 'pure', 'infused'].includes(part) &&
      part.length > 2 && 
      !/^\d+$/.test(part)
    );
    
    if (descriptors.length > 0) {
      const descriptor = descriptors[0].charAt(0).toUpperCase() + descriptors[0].slice(1);
      return `${descriptor} ${baseTitle}`;
    }
  }
  
  return baseTitle;
}

function detectVolume(imageName) {
  const volumeMatch = imageName.match(/(\d+)(ml|l|oz)/i);
  return volumeMatch ? volumeMatch[0] : '500ml';
}

async function createProductsFromUnusedImages() {
  try {
    console.log('🚀 Starting automatic product creation from unused images...\n');
    
    const unusedImages = await getUnusedImages();
    
    if (unusedImages.length === 0) {
      console.log('✅ No unused images found. All images are already assigned to products!');
      return;
    }
    
    console.log('📝 Generated product previews:');
    console.log('=' .repeat(50));
    
    const productsToCreate = [];
    
    for (const image of unusedImages) {
      const product = generateProductFromImage(image);
      productsToCreate.push(product);
      
      console.log(`📦 ${product.title}`);
      console.log(`   Category: ${product.categoryId}`);
      console.log(`   Slug: ${product.slug}`);
      console.log(`   Image: ${image.name}`);
      console.log('');
    }
    
    console.log('=' .repeat(50));
    console.log(`\n🔄 Creating ${productsToCreate.length} products...\n`);
    
    const results = [];
    
    for (const product of productsToCreate) {
      try {
        const docRef = await addDoc(collection(db, 'products'), product);
        const success = `✅ Created: ${product.title} (ID: ${docRef.id})`;
        console.log(success);
        results.push(success);
      } catch (error) {
        const failure = `❌ Failed to create ${product.title}: ${error.message}`;
        console.error(failure);
        results.push(failure);
      }
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('📊 SUMMARY:');
    console.log('=' .repeat(50));
    
    const successes = results.filter(r => r.startsWith('✅')).length;
    const failures = results.filter(r => r.startsWith('❌')).length;
    
    console.log(`✅ Successfully created: ${successes} products`);
    console.log(`❌ Failed to create: ${failures} products`);
    console.log(`📁 Total unused images processed: ${unusedImages.length}`);
    
    if (successes > 0) {
      console.log('\n🎉 Products have been automatically created and assigned to appropriate subcategories!');
      console.log('💡 You can now find them in the admin panel and assign them to specific retailers.');
    }
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
  }
}

// Run the script
createProductsFromUnusedImages();