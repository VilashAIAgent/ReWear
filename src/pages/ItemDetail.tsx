import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClothingItem, createSwapRequest, redeemWithPoints } from '../services/supabase';
import { ClothingItem } from '../types';
import { ArrowLeft, Heart, Share2, Star, MapPin, Calendar, Package, Users, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        const itemData = await getClothingItem(id);
        setItem(itemData);
      } catch (error) {
        console.error('Error fetching item:', error);
        toast.error('Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSwapRequest = async () => {
    if (!currentUser || !item) {
      toast.error('Please log in to request swaps');
      return;
    }

    if (currentUser.uid === item.uploaderId) {
      toast.error('You cannot swap with your own item');
      return;
    }

    try {
      await createSwapRequest({
        itemId: item.id,
        requesterId: currentUser.uid,
        uploaderId: item.uploaderId,
        type: 'swap',
        status: 'pending',
        message: swapMessage
      });
      
      toast.success('Swap request sent!');
      setShowSwapModal(false);
      setSwapMessage('');
    } catch (error) {
      console.error('Error creating swap request:', error);
      toast.error('Failed to send swap request');
    }
  };

  const handleRedeemWithPoints = async () => {
    if (!currentUser || !item) {
      toast.error('Please log in to redeem items');
      return;
    }

    if (currentUser.uid === item.uploaderId) {
      toast.error('You cannot redeem your own item');
      return;
    }

    if (currentUser.points < item.pointValue) {
      toast.error(`You need ${item.pointValue - currentUser.points} more points to redeem this item`);
      return;
    }

    try {
      await redeemWithPoints(item.id, currentUser.uid, item.pointValue);
      toast.success('Item redeemed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error redeeming item:', error);
      toast.error('Failed to redeem item');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <button
            onClick={() => navigate('/browse')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              <img
                src={item.images[currentImageIndex]}
                alt={item.title}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${item.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>by {item.uploaderName}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Heart className="h-6 w-6" />
                  </button>
                  <button className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Item Details Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <p className="text-lg text-gray-900">{item.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Size</span>
                    <p className="text-lg text-gray-900">{item.size}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Condition</span>
                    <p className="text-lg text-gray-900">{item.condition}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Point Value</span>
                    <p className="text-lg font-bold text-green-600">{item.pointValue} points</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {currentUser && currentUser.uid !== item.uploaderId && (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <Users className="h-5 w-5" />
                    <span>Propose Swap</span>
                  </button>
                  
                  <button
                    onClick={handleRedeemWithPoints}
                    disabled={currentUser.points < item.pointValue}
                    className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <Zap className="h-5 w-5" />
                    <span>
                      {currentUser.points < item.pointValue 
                        ? `Need ${item.pointValue - currentUser.points} more points`
                        : `Redeem for ${item.pointValue} points`
                      }
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Propose a Swap</h3>
            <p className="text-gray-600 mb-4">
              Send a message to {item.uploaderName} about swapping for this item.
            </p>
            
            <textarea
              value={swapMessage}
              onChange={(e) => setSwapMessage(e.target.value)}
              placeholder="Hi! I'm interested in swapping for your item. I have..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSwapRequest}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}