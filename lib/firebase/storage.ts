import { 
  ref, 
  uploadBytes, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  StorageReference,
  UploadResult
} from 'firebase/storage';
import { storage } from './config';

// Storage service for file uploads
export class StorageService {
  constructor(private basePath: string) {}

  // Upload a file and get the download URL
  async uploadFile(file: File, fileName?: string): Promise<string> {
    const name = fileName || `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${this.basePath}/${name}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  // Upload with progress tracking
  uploadFileWithProgress(
    file: File, 
    fileName?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const name = fileName || `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${this.basePath}/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  // Delete a file
  async deleteFile(fileName: string): Promise<void> {
    const storageRef = ref(storage, `${this.basePath}/${fileName}`);
    await deleteObject(storageRef);
  }

  // List all files in the directory
  async listFiles(): Promise<string[]> {
    const storageRef = ref(storage, this.basePath);
    const result = await listAll(storageRef);
    
    const urls = await Promise.all(
      result.items.map(async (itemRef) => {
        return await getDownloadURL(itemRef);
      })
    );
    
    return urls;
  }

  // Get download URL for existing file
  async getFileURL(fileName: string): Promise<string> {
    const storageRef = ref(storage, `${this.basePath}/${fileName}`);
    return await getDownloadURL(storageRef);
  }
}

// Specific storage services
export const productImagesStorage = new StorageService('products');
export const recipeImagesStorage = new StorageService('recipes');
export const categoryImagesStorage = new StorageService('categories');
export const generalImagesStorage = new StorageService('images');

// Helper functions
export const uploadProductImage = (file: File, fileName?: string) => {
  return productImagesStorage.uploadFile(file, fileName);
};

export const uploadRecipeImage = (file: File, fileName?: string) => {
  return recipeImagesStorage.uploadFile(file, fileName);
};

export const uploadCategoryImage = (file: File, fileName?: string) => {
  return categoryImagesStorage.uploadFile(file, fileName);
};