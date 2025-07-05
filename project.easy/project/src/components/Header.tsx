import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Recycle, Menu, X, User, LogOut, Plus, Moon, Sun, Trophy, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePoints } from '../contexts/PointsContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { getUserPoints } = usePoints();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const userPoints = user ? getUserPoints(user.id) : 0;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b-2 border-green-100 dark:border-green-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-700 transition-colors">
              <Recycle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Recycle Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/thrift" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
              Thrift Store
            </Link>
            <Link to="/books" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Used Books
            </Link>
            <Link to="/reuse" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Free Items
            </Link>
            <Link to="/leaderboard" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Link>
            {user?.type === 'scrap_collector' && (
              <Link to="/scrap" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Scrap Collection
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/add-listing')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>List Item</span>
                </button>
                
                {/* Points Display */}
                <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium">{userPoints}</span>
                </div>

                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <img 
                      src={user?.avatar} 
                      alt={user?.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{user?.name}</span>
                    <span className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                      {user?.type === 'scrap_collector' ? 'Collector' : 'User'}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-gray-900 dark:text-white" /> : <Menu className="h-6 w-6 text-gray-900 dark:text-white" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <Link to="/thrift" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Thrift Store
              </Link>
              <Link to="/books" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Used Books
              </Link>
              <Link to="/reuse" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                Free Items
              </Link>
              <Link to="/leaderboard" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
              {user?.type === 'scrap_collector' && (
                <Link to="/scrap" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  Scrap Collection
                </Link>
              )}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full w-fit">
                    <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-200 font-medium">{userPoints} points</span>
                  </div>
                  <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-lg text-center">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}