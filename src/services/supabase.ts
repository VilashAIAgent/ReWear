import { supabase } from '../config/supabase';
import { ClothingItem, SwapRequest, User } from '../types';

// PHASE 1: User Management
export const getUserProfile = async (uid: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', uid)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return {
    uid: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    points: data.points,
    avatarUrl: data.avatar_url,
    createdAt: new Date(data.created_at)
  };
};

export const updateUserProfile = async (uid: string, updates: Partial<User>) => {
  const { error } = await supabase
    .from('users')
    .update({
      name: updates.name,
      points: updates.points,
      avatar_url: updates.avatarUrl
    })
    .eq('id', uid);

  if (error) throw error;
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(user => ({
    uid: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    points: user.points,
    avatarUrl: user.avatar_url,
    createdAt: new Date(user.created_at)
  }));
};

// PHASE 2: Clothing Items
export const createClothingItem = async (item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('items')
    .insert([{
      title: item.title,
      description: item.description,
      images: item.images,
      category: item.category,
      size: item.size,
      condition: item.condition,
      tags: item.tags,
      status: item.status,
      uploader_id: item.uploaderId,
      uploader_name: item.uploaderName,
      point_value: item.pointValue
    }])
    .select()
    .single();

  if (error) throw error;
  return data.id;
};

export const getClothingItems = async (filters?: {
  category?: string;
  size?: string;
  status?: string;
}): Promise<ClothingItem[]> => {
  let query = supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    images: item.images,
    category: item.category,
    size: item.size,
    condition: item.condition,
    tags: item.tags,
    status: item.status,
    uploaderId: item.uploader_id,
    uploaderName: item.uploader_name,
    pointValue: item.point_value,
    createdAt: new Date(item.created_at)
  }));
};

export const getClothingItem = async (id: string): Promise<ClothingItem | null> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching item:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    images: data.images,
    category: data.category,
    size: data.size,
    condition: data.condition,
    tags: data.tags,
    status: data.status,
    uploaderId: data.uploader_id,
    uploaderName: data.uploader_name,
    pointValue: data.point_value,
    createdAt: new Date(data.created_at)
  };
};

export const updateClothingItem = async (id: string, updates: Partial<ClothingItem>) => {
  const { error } = await supabase
    .from('items')
    .update({
      title: updates.title,
      description: updates.description,
      status: updates.status,
      point_value: updates.pointValue
    })
    .eq('id', id);

  if (error) throw error;
};

export const deleteClothingItem = async (id: string) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// PHASE 3: Swaps and Redemptions
export const createSwapRequest = async (swapData: Omit<SwapRequest, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('swaps')
    .insert([{
      item_id: swapData.itemId,
      requester_id: swapData.requesterId,
      uploader_id: swapData.uploaderId,
      requester_item_id: swapData.requesterItemId,
      type: swapData.type,
      status: swapData.status,
      message: swapData.message
    }])
    .select()
    .single();

  if (error) throw error;
  return data.id;
};

export const getSwapRequests = async (userId?: string): Promise<SwapRequest[]> => {
  let query = supabase
    .from('swaps')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('requester_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map(swap => ({
    id: swap.id,
    itemId: swap.item_id,
    requesterId: swap.requester_id,
    uploaderId: swap.uploader_id,
    requesterItemId: swap.requester_item_id,
    type: swap.type,
    status: swap.status,
    message: swap.message,
    createdAt: new Date(swap.created_at)
  }));
};

export const updateSwapRequest = async (id: string, updates: Partial<SwapRequest>) => {
  const { error } = await supabase
    .from('swaps')
    .update({
      status: updates.status
    })
    .eq('id', id);

  if (error) throw error;
};

export const redeemWithPoints = async (itemId: string, userId: string, pointsCost: number) => {
  try {
    // Start a transaction-like operation
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    if (user.points < pointsCost) {
      throw new Error('Insufficient points');
    }

    // Update user points
    const { error: pointsError } = await supabase
      .from('users')
      .update({ points: user.points - pointsCost })
      .eq('id', userId);

    if (pointsError) throw pointsError;

    // Update item status
    const { error: itemError } = await supabase
      .from('items')
      .update({ status: 'redeemed' })
      .eq('id', itemId);

    if (itemError) throw itemError;

    // Create redemption record
    await createSwapRequest({
      itemId,
      requesterId: userId,
      uploaderId: '',
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
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
};

// AI Image Generation (placeholder implementation)
export const generateAIImage = async (prompt: string): Promise<string> => {
  // Placeholder images for demo
  const placeholderImages = [
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  return placeholderImages[randomIndex];
};