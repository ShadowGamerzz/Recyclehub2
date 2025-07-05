import React, { useState } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { addProduct } = useProducts();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'clothing' as 'clothing' | 'furniture' | 'electronics' | 'books',
    listingType: 'thrift' as 'thrift' | 'used_books' | 'reuse' | 'scrap',
    condition: 'good' as 'excellent' | 'good' | 'fair',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addProduct({
      title: formData.title,
      description: formData.description,
      price: formData.listingType === 'reuse' ? 0 : Number(formData.price),
      category: formData.category,
      listingType: formData.listingType,
      condition: formData.condition,
      images: ['https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg'], // Placeholder image
      seller: {
        id: user.id,
        name: user.name,
        rating: 4.8
      },
      location: formData.location
    });

    setFormData({
      title: '',
      description: '',
      price: '',
      category: 'clothing',
      listingType: 'thrift',
      condition: 'good',
      location: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">List New Item</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Listing Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, listingType: 'thrift' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.listingType === 'thrift'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Thrift Store</div>
                <div className="text-sm text-gray-500">Sell second-hand items</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, listingType: 'used_books' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.listingType === 'used_books'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Used Books</div>
                <div className="text-sm text-gray-500">Sell pre-loved books</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, listingType: 'reuse' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.listingType === 'reuse'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Free Items</div>
                <div className="text-sm text-gray-500">Give away for reuse</div>
              </button>
              {user?.type === 'scrap_collector' && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, listingType: 'scrap' })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.listingType === 'scrap'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">Scrap</div>
                  <div className="text-sm text-gray-500">List for recycling</div>
                </button>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag & drop images here, or click to select</p>
              <p className="text-sm text-gray-500">Support: JPG, PNG, GIF (max 5MB each)</p>
              <button
                type="button"
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Choose Files
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter product title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your item in detail"
              required
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.listingType === 'reuse' ? 'Price (Free)' : 'Price (₹) *'}
              </label>
              <input
                type="number"
                value={formData.listingType === 'reuse' ? '0' : formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="1"
                disabled={formData.listingType === 'reuse'}
                required={formData.listingType !== 'reuse'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
              </select>
            </div>
          </div>

          {/* Condition and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="City, State"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>List Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}