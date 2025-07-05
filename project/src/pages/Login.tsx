import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle, Mail, Lock, User, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [userType, setUserType] = useState<'normal' | 'scrap_collector'>('normal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password, userType);
    if (success) {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
              <Recycle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Recycle Hub</h1>
            <p className="text-gray-600">Sign in to start your sustainable journey</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('normal')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === 'normal'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Normal User</div>
                <div className="text-sm text-gray-500">Buy, sell, reuse</div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('scrap_collector')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === 'scrap_collector'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Trash2 className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Scrap Collector</div>
                <div className="text-sm text-gray-500">Collect scrap items</div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? 'Signing In...' : `Sign In as ${userType === 'scrap_collector' ? 'Scrap Collector' : 'Normal User'}`}
            </button>
          </form>

          {/* Demo Note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800 text-center">
              <strong>Demo:</strong> Use any email and password to sign in
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}