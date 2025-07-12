export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  points: number;
  avatarUrl?: string;
  createdAt: Date;
}

export interface ClothingItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: 'Men' | 'Women' | 'Unisex' | 'Kids';
  size: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  tags: string[];
  status: 'available' | 'pending' | 'swapped' | 'redeemed';
  uploaderId: string;
  uploaderName: string;
  pointValue: number;
  createdAt: Date;
}

export interface SwapRequest {
  id: string;
  itemId: string;
  requesterId: string;
  uploaderId: string;
  requesterItemId?: string; // For direct swaps
  type: 'swap' | 'points';
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  message?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'swap' | 'redeem' | 'admin';
  read: boolean;
  createdAt: Date;
}