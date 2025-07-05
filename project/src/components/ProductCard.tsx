import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart, Gift } from 'lucide-react';
import { Product } from '../contexts/ProductContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const conditionColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-yellow-100 text-yellow-800',
    fair: 'bg-orange-100 text-orange-800'
  };

  const listingTypeColors = {
    thrift: 'bg-blue-100 text-blue-800',
    used_books: 'bg-purple-100 text-purple-800',
    reuse: 'bg-green-100 text-green-800',
    scrap: 'bg-orange-100 text-orange-800'
  };

  const listingTypeLabels = {
    thrift: 'Thrift',
    used_books: 'Used Book',
    reuse: 'Free',
    scrap: 'Scrap'
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex">
          <div className="relative w-48 h-32">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
            {product.price === 0 && (
              <div className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full">
                <Gift className="h-3 w-3" />
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex space-x-2 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${listingTypeColors[product.listingType]}`}>
                    {listingTypeLabels[product.listingType]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[product.condition]}`}>
                    {product.condition}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors">
                  <Link to={`/product/${product.id}`}>{product.title}</Link>
                </h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-green-600">
                  {product.price === 0 ? 'FREE' : `₹${product.price}`}
                </span>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{product.seller.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{product.location}</span>
                  </div>
                </div>
              </div>
              <Link
                to={`/product/${product.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      <div className="relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
        {product.price === 0 && (
          <div className="absolute top-3 left-3 bg-green-500 text-white p-2 rounded-full">
            <Gift className="h-4 w-4" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${listingTypeColors[product.listingType]}`}>
            {listingTypeLabels[product.listingType]}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[product.condition]}`}>
            {product.condition}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {product.category}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
            <Link to={`/product/${product.id}`}>{product.title}</Link>
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-600">
            {product.price === 0 ? 'FREE' : `₹${product.price}`}
          </span>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{product.seller.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{product.location}</span>
          </div>
          <span className="text-xs text-gray-400">
            {product.createdAt.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}