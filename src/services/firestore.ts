import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { ClothingItem, SwapRequest, User } from '../types';

// PHASE 1: User Management
export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() as User : null;
};

export const updateUserProfile = async (uid: string, updates: Partial<User>) => {
  await updateDoc(doc(db, 'users', uid), updates);
};

export const getAllUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as User));
};

// PHASE 2: Clothing Items
export const createClothingItem = async (item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'items'), {
    ...item,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getClothingItems = async (filters?: {
  category?: string;
  size?: string;
  status?: string;
}): Promise<ClothingItem[]> => {
  let q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
  
  if (filters?.category) {
    q = query(q, where('category', '==', filters.category));
  }
  if (filters?.status) {
    q = query(q, where('status', '==', filters.status));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ClothingItem));
};

export const getClothingItem = async (id: string): Promise<ClothingItem | null> => {
  const itemDoc = await getDoc(doc(db, 'items', id));
  if (itemDoc.exists()) {
    const data = itemDoc.data();
    return {
      ...data,
      id,
      createdAt: data.createdAt?.toDate() || new Date()
    } as ClothingItem;
  }
  return null;
};

export const updateClothingItem = async (id: string, updates: Partial<ClothingItem>) => {
  await updateDoc(doc(db, 'items', id), updates);
};

export const deleteClothingItem = async (id: string) => {
  await deleteDoc(doc(db, 'items', id));
};

// PHASE 3: Swaps and Redemptions
export const createSwapRequest = async (swapData: Omit<SwapRequest, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'swaps'), {
    ...swapData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getSwapRequests = async (userId?: string): Promise<SwapRequest[]> => {
  let q = query(collection(db, 'swaps'), orderBy('createdAt', 'desc'));
  
  if (userId) {
    q = query(q, where('requesterId', '==', userId));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate() || new Date()
    } as SwapRequest;
  });
};

export const updateSwapRequest = async (id: string, updates: Partial<SwapRequest>) => {
  await updateDoc(doc(db, 'swaps', id), updates);
};

export const redeemWithPoints = async (itemId: string, userId: string, pointsCost: number) => {
  try {
    // Update user points
    await updateDoc(doc(db, 'users', userId), {
      points: increment(-pointsCost)
    });
    
    // Update item status
    await updateDoc(doc(db, 'items', itemId), {
      status: 'redeemed'
    });
    
    // Create redemption record
    await createSwapRequest({
      itemId,
      requesterId: userId,
      uploaderId: '', // Will be filled from item data
      type: 'points',
      status: 'completed'
    });
  } catch (error) {
    console.error('Error redeeming item:', error);
    throw error;
  }
};

// PHASE 5: File Upload
export const uploadImages = async (files: File[], folder: string = 'items'): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  });
  
  return Promise.all(uploadPromises);
};

// AI Image Generation (placeholder implementation)
export const generateAIImage = async (prompt: string): Promise<string> => {
  // This would integrate with OpenAI DALL-E or similar service
  // For now, return a placeholder
  const placeholderImages = [
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];
  
  // Return a random placeholder image
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return placeholderImages[randomIndex];
};