import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Users, Leaf, ShoppingBag, Shirt, Book, Gift, Trash2 } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { getProductsByListingType } = useProducts();
  const { user } = useAuth();
  
  const thriftItems = getProductsByListingType('thrift').slice(0, 3);
  const bookItems = getProductsByListingType('used_books').slice(0, 3);
  const freeItems = getProductsByListingType('reuse').slice(0, 3);

  const categories = [
    { 
      id: 'thrift', 
      name: 'Thrift Store', 
      icon: Shirt, 
      count: getProductsByListingType('thrift').length,
      description: 'Quality second-hand items at great prices',
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      id: 'books', 
      name: 'Used Books', 
      icon: Book, 
      count: getProductsByListingType('used_books').length,
      description: 'Pre-loved books for every reader',
      color: 'bg-purple-100 text-purple-600'
    },
    { 
      id: 'reuse', 
      name: 'Free Items', 
      icon: Gift, 
      count: getProductsByListingType('reuse').length,
      description: 'Items available for free pickup',
      color: 'bg-green-100 text-green-600'
    },
    ...(user?.type === 'scrap_collector' ? [{ 
      id: 'scrap', 
      name: 'Scrap Collection', 
      icon: Trash2, 
      count: getProductsByListingType('scrap').length,
      description: 'Materials for recycling and processing',
      color: 'bg-orange-100 text-orange-600'
    }] : [])
  ];

  const stats = [
    { icon: Recycle, value: '15K+', label: 'Items Recycled' },
    { icon: Users, value: '8K+', label: 'Happy Users' },
    { icon: Leaf, value: '75K+', label: 'CO2 Saved (kg)' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Complete 
                <span className="text-green-600"> Recycling</span>
                <br />Ecosystem
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Thrift quality items, sell used books, give away for reuse, or collect scrap. 
                Join India's most comprehensive recycling platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/login" 
                  className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Start Recycling
                </Link>
                <Link 
                  to="/thrift" 
                  className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-center font-semibold"
                >
                  Browse Items
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl transform rotate-3"></div>
              <img 
                src="https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg" 
                alt="Sustainable Shopping"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Platform</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From thrift shopping to scrap collection, we've got every aspect of recycling covered
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/${category.id}`}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-2"
              >
                <div className="text-center space-y-4">
                  <div className={`${category.color} p-4 rounded-2xl inline-block group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <p className="text-green-600 font-medium">{category.count} items available</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Thrift Items */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Thrift Store</h2>
              <p className="text-gray-600">Quality second-hand items at amazing prices</p>
            </div>
            <Link 
              to="/thrift" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {thriftItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Used Books */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Used Books</h2>
              <p className="text-gray-600">Pre-loved books waiting for new readers</p>
            </div>
            <Link 
              to="/books" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Free Items */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Free Items</h2>
              <p className="text-gray-600">Items available for free pickup and reuse</p>
            </div>
            <Link 
              to="/reuse" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center text-white">
                  <div className="bg-white/20 p-4 rounded-2xl inline-block mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-green-100 text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of people creating a circular economy through our comprehensive recycling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Join as User
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold"
            >
              Join as Collector
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}