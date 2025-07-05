import React, { useState } from 'react';
import { X, MapPin, Truck, CreditCard, Wallet } from 'lucide-react';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onConfirm: (deliveryOption: string, paymentMethod: string, address?: string) => void;
}

export default function DeliveryModal({ isOpen, onClose, product, onConfirm }: DeliveryModalProps) {
  const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [address, setAddress] = useState('');

  const deliveryFee = deliveryOption === 'delivery' ? 50 : 0;
  const total = product?.price + deliveryFee;

  const handleConfirm = () => {
    onConfirm(deliveryOption, paymentMethod, deliveryOption === 'delivery' ? address : undefined);
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Summary */}
          <div className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">{product.title}</h3>
              <p className="text-green-600 dark:text-green-400 font-bold">₹{product.price}</p>
            </div>
          </div>

          {/* Delivery Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Delivery Option
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setDeliveryOption('pickup')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  deliveryOption === 'pickup'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Self Pickup</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Pick up from seller's location - Free</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setDeliveryOption('delivery')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  deliveryOption === 'delivery'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Home Delivery</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Delivered to your address - ₹50</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Delivery Address */}
          {deliveryOption === 'delivery' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Address *
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your complete address"
                required
              />
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('cod')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Cash on Delivery</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive the item</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('online')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'online'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">Online Payment</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Pay now with UPI/Card/Wallet</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Item Price</span>
                <span className="text-gray-900 dark:text-white">₹{product.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Delivery Fee</span>
                <span className="text-gray-900 dark:text-white">₹{deliveryFee}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-green-600 dark:text-green-400">₹{total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={deliveryOption === 'delivery' && !address.trim()}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentMethod === 'online' ? 'Pay Now' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}