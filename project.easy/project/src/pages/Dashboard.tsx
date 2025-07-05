import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { Plus, Package, DollarSign, Eye, Star, Edit, Trash2, Gift, Shirt, Book, Recycle } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';

export default function Dashboard() {
  const { user } = useAuth();
  const { products, getProductsByListingType } = useProducts();
  const [showAddModal, setShowAddModal] = useState(false);

  const userProducts = products.filter(product => product.seller.id === user?.id);
  const totalEarnings = userProducts.reduce((sum, product) => sum + product.price, 0);
  const averageRating = userProducts.length > 0 ? 4.8 : 0;

  const thriftItems = getProductsByListingType('thrift').filter(p => p.seller.id === user?.id);
  const bookItems = getProductsByListingType('used_books').filter(p => p.seller.id === user?.id);
  const freeItems = getProductsByListingType('reuse').filter(p => p.seller.id === user?.id);
  const scrapItems = getProductsByListingType('scrap').filter(p => p.seller.id === user?.id);

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          {user.type === 'scrap_collector' 
            ? 'Manage your scrap collection and track your recycling activities' 
            : 'Manage your listings and track your sustainable impact'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900">{userProducts.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalEarnings}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Item</span>
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            View Analytics
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Promote Listings
          </button>
        </div>
      </div>

      {/* Listing Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Thrift Items */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Shirt className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Thrift Items ({thriftItems.length})</h3>
            </div>
          </div>
          <div className="p-6">
            {thriftItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No thrift items listed</p>
            ) : (
              <div className="space-y-3">
                {thriftItems.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <p className="text-blue-600 font-semibold">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Used Books */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Book className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Used Books ({bookItems.length})</h3>
            </div>
          </div>
          <div className="p-6">
            {bookItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No books listed</p>
            ) : (
              <div className="space-y-3">
                {bookItems.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <p className="text-purple-600 font-semibold">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Free Items */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Gift className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Free Items ({freeItems.length})</h3>
            </div>
          </div>
          <div className="p-6">
            {freeItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No free items listed</p>
            ) : (
              <div className="space-y-3">
                {freeItems.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <p className="text-green-600 font-semibold">FREE</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrap Items (only for scrap collectors) */}
        {user.type === 'scrap_collector' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Recycle className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Scrap Items ({scrapItems.length})</h3>
              </div>
            </div>
            <div className="p-6">
              {scrapItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No scrap items listed</p>
              ) : (
                <div className="space-y-3">
                  {scrapItems.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.title}</h4>
                        <p className="text-orange-600 font-semibold">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}