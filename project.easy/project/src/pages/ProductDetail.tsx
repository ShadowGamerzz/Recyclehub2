import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, MessageCircle, Heart, Share2, Calendar, Truck, Gift } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { usePoints } from '../contexts/PointsContext';
import { useAuth } from '../contexts/AuthContext';
import DeliveryModal from '../components/DeliveryModal';
import PaymentModal from '../components/PaymentModal';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProduct } = useProducts();
  const { addPoints } = usePoints();
  const { user } = useAuth();
  const product = getProduct(id!);
  
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
          <Link to="/products" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  const conditionColors = {
    excellent: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    good: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    fair: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
  };

  const handleOrderConfirm = (deliveryOption: string, paymentMethod: string, address?: string) => {
    const deliveryFee = deliveryOption === 'delivery' ? 50 : 0;
    const total = product.price + deliveryFee;
    
    setOrderDetails({
      deliveryOption,
      paymentMethod,
      address,
      total
    });

    if (paymentMethod === 'online') {
      setShowPaymentModal(true);
    } else {
      handleOrderSuccess();
    }
  };

  const handleOrderSuccess = () => {
    // Award points for free items
    if (product.price === 0 && user && product.seller.id !== user.id) {
      addPoints(product.seller.id, 50);
    }
    
    alert('Order confirmed successfully! 🎉');
    setShowPaymentModal(false);
    setShowDeliveryModal(false);
  };

  const isFreeItem = product.price === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/products" 
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to products</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
            />
            <button className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            {isFreeItem && (
              <div className="absolute top-4 left-4 bg-green-500 text-white p-2 rounded-full">
                <Gift className="h-5 w-5" />
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 2}`}
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                {product.category}
              </span>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {isFreeItem ? 'FREE' : `₹${product.price}`}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${conditionColors[product.condition]}`}>
                {product.condition}
              </span>
            </div>
            {isFreeItem && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-green-800 dark:text-green-200">Free Item</span>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  This item is available for free! The seller will earn 50 eco-points for this donation.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h3>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.seller.name}`}
                alt={product.seller.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{product.seller.name}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{product.seller.rating} rating</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
              <Calendar className="h-4 w-4" />
              <span>Listed {product.createdAt.toLocaleDateString()}</span>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => setShowDeliveryModal(true)}
                className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <Truck className="h-5 w-5" />
                <span>{isFreeItem ? 'Get This Item' : 'Buy Now'}</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 border-2 border-green-600 text-green-600 dark:text-green-400 py-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-semibold">
                <MessageCircle className="h-5 w-5" />
                <span>Contact Seller</span>
              </button>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Safety Tips</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Meet in a public place</li>
              <li>• Inspect the item before purchasing</li>
              <li>• Use secure payment methods</li>
              <li>• Trust your instincts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeliveryModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        product={product}
        onConfirm={handleOrderConfirm}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={orderDetails?.total || 0}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}