import React from 'react';
import { Recycle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-green-600 rounded-full">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Recycle Hub</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Join our sustainable marketplace where pre-loved items find new homes. 
              Reduce waste, save money, and help build a circular economy.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>contact@recyclehub.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="/thrift" className="text-gray-300 hover:text-green-400 transition-colors">Thrift Store</a></li>
              <li><a href="/books" className="text-gray-300 hover:text-green-400 transition-colors">Used Books</a></li>
              <li><a href="/reuse" className="text-gray-300 hover:text-green-400 transition-colors">Free Items</a></li>
              <li><a href="/leaderboard" className="text-gray-300 hover:text-green-400 transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Seller Guide</a></li>
              <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Buyer Guide</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Recycle Hub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}