import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';
import type { Product, Category, Recipe, Location } from '@/lib/cms/types';

// Generic Firestore operations
export class FirestoreService<T> {
  constructor(private collectionName: string) {}

  async getAll(): Promise<T[]> {
    if (!db) return [];
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }

  async getById(id: string): Promise<T | null> {
    if (!db) return null;
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as T;
    }
    return null;
  }

  async getBySlug(slug: string): Promise<T | null> {
    if (!db) return null;
    const q = query(
      collection(db, this.collectionName), 
      where("slug", "==", slug),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as T;
    }
    return null;
  }

  async create(data: Omit<T, 'id'>): Promise<string> {
    if (!db) throw new Error('Database not available');
    const docRef = await addDoc(collection(db, this.collectionName), data);
    return docRef.id;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    if (!db) throw new Error('Database not available');
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, data as any);
  }

  async delete(id: string): Promise<void> {
    if (!db) throw new Error('Database not available');
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async getWhere(field: string, operator: any, value: any): Promise<T[]> {
    if (!db) return [];
    const q = query(
      collection(db, this.collectionName),
      where(field, operator, value)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }

  async getOrdered(orderField: string, direction: 'asc' | 'desc' = 'asc'): Promise<T[]> {
    if (!db) return [];
    const q = query(
      collection(db, this.collectionName),
      orderBy(orderField, direction)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as T));
  }
}

// Specific services for each collection
export const productsService = new FirestoreService<Product>('products');
export const categoriesService = new FirestoreService<Category>('categories');
export const recipesService = new FirestoreService<Recipe>('recipes');
export const locationsService = new FirestoreService<Location>('locations');

// Specialized queries
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return productsService.getWhere('categoryId', '==', categoryId);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  return productsService.getWhere('featured', '==', true);
};

export const getFeaturedRecipes = async (): Promise<Recipe[]> => {
  return recipesService.getWhere('featured', '==', true);
};

export const getRecipesByProductId = async (productId: string): Promise<Recipe[]> => {
  return recipesService.getWhere('relatedProductIds', 'array-contains', productId);
};

export const getCategoriesOrdered = async (): Promise<Category[]> => {
  return categoriesService.getOrdered('order', 'asc');
};