'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/admin-auth';

export default function UpdateRecipeImagesPage() {
  const { user, loading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p>Please log in to access this page.</p>
          <Button asChild className="mt-4">
            <a href="/admin">Go to Admin Login</a>
          </Button>
        </div>
      </div>
    );
  }

  const updateRecipeImages = async () => {
    setIsUpdating(true);
    setUpdateStatus([]);
    
    try {
      // Update Mediterranean Stuffed Bell Peppers
      setUpdateStatus(prev => [...prev, 'Updating Mediterranean Stuffed Bell Peppers...']);
      
      await updateDoc(doc(db, 'recipes', 'mediterranean-stuffed-peppers'), {
        heroImage: 'https://firebasestorage.googleapis.com/v0/b/ove-foods.firebasestorage.app/o/assets%2Fmediterranean-stuffed-bell-peppers.webp?alt=media'
      });
      
      setUpdateStatus(prev => {
        const newStatus = [...prev];
        newStatus[newStatus.length - 1] = '✅ Updated: Mediterranean Stuffed Bell Peppers';
        return newStatus;
      });

      // Update Classic Spaghetti Aglio e Olio
      setUpdateStatus(prev => [...prev, 'Updating Classic Spaghetti Aglio e Olio...']);
      
      await updateDoc(doc(db, 'recipes', 'classic-spaghetti-aglio-olio'), {
        heroImage: 'https://firebasestorage.googleapis.com/v0/b/ove-foods.firebasestorage.app/o/assets%2Fpasta-puttanesca.jpeg?alt=media'
      });
      
      setUpdateStatus(prev => {
        const newStatus = [...prev];
        newStatus[newStatus.length - 1] = '✅ Updated: Classic Spaghetti Aglio e Olio';
        return newStatus;
      });
      
      setIsComplete(true);
      setUpdateStatus(prev => [...prev, '', '🎉 Both recipe images updated successfully!', '🔄 The live site should now show the new images!']);
    } catch (error) {
      console.error('Error updating recipes:', error);
      setUpdateStatus(prev => [...prev, `❌ Error: ${error.message}`]);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Update Recipe Images</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">2 Recipes to Update with Firebase Storage Images:</h2>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                <span>Mediterranean Stuffed Bell Peppers → Firebase .webp image</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                <span>Classic Spaghetti Aglio e Olio → Firebase .jpeg image</span>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <Button 
              onClick={updateRecipeImages} 
              disabled={isUpdating || isComplete}
              size="lg"
              className="w-full"
            >
              {isUpdating ? 'Updating Images...' : isComplete ? 'Update Complete!' : 'Update Recipe Images in Firebase'}
            </Button>
          </div>

          {updateStatus.length > 0 && (
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Update Status:</h3>
              <div className="space-y-1 font-mono text-sm">
                {updateStatus.map((status, index) => (
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