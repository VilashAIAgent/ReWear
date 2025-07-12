import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getClothingItems, getSwapRequests } from '../services/firestore';
import { ClothingItem, SwapRequest } from '../types';
import { Package, Users, TrendingUp, Award, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userItems, setUserItems] = useState<ClothingItem[]>([]);
  const [userSwaps, setUserSwaps] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        // Get user's items
        const items = await getClothingItems();
        setUserItems(items.filter(item => item.uploaderId === currentUser.uid));
        
        // Get user's swaps
        const swaps = await getSwapRequests(currentUser.uid);
        setUserSwaps(swaps);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const stats = [
    {
      label: 'My Items',
      value: userItems.length,
      icon: Package,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Active Swaps',
      value: userSwaps.filter(swap => swap.status === 'pending').length,
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Completed Swaps',
      value: userSwaps.filter(swap => swap.status === 'completed').length,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      label: 'Points Balance',
      value: currentUser?.points || 0,
      icon: Award,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {currentUser?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your items, track swaps, and grow your sustainable wardrobe.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">My Listed Items</h2>
                <Link
                  to="/upload"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {userItems.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No items listed yet</p>
                  <Link
                    to="/upload"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    List your first item
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.category} • {item.size}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          item.status === 'available' ? 'bg-green-100 text-green-800' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {userItems.length > 3 && (
                    <div className="text-center pt-4">
                      <Link
                        to="/my-items"
                        className="text-green-600 hover:text-green-700 font-medium"
                      >
                        View all {userItems.length} items
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recent Swaps */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Recent Swap Activity</h2>
            </div>
            
            <div className="p-6">
              {userSwaps.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No swap activity yet</p>
                  <Link
                    to="/browse"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Browse items to swap
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSwaps.slice(0, 4).map((swap) => (
                    <div key={swap.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {swap.type === 'swap' ? 'Item Swap' : 'Points Redemption'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(swap.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        swap.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        swap.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {swap.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}