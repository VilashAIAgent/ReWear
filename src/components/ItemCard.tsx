import React from 'react';
import { Link } from 'react-router-dom';
import { ClothingItem } from '../types';
import { Heart, Eye, MapPin, Star } from 'lucide-react';

interface ItemCardProps {
  item: ClothingItem;
  viewMode?: 'grid' | 'list';
}

export default function ItemCard({ item, viewMode = 'grid' }: ItemCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex gap-6">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {item.pointValue} points
              </span>
            </div>
            <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm text-gray-500">{item.category}</span>
              <span className="text-sm text-gray-500">Size {item.size}</span>
              <span className="text-sm text-gray-500">{item.condition}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">by {item.uploaderName}</span>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <Link
                  to={`/item/${item.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="relative">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white hover:text-red-600 transition-colors">
          <Heart className="h-5 w-5" />
        </button>
        <div className="absolute bottom-4 left-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {item.pointValue} points
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
            {item.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{item.category}</span>
          <span>Size {item.size}</span>
          <span>{item.condition}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs font-semibold">
                {item.uploaderName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-600">{item.uploaderName}</span>
          </div>
          
          <Link
            to={`/item/${item.id}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}