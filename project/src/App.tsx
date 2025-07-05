import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ThriftStore from './pages/ThriftStore';
import UsedBooks from './pages/UsedBooks';
import FreeItems from './pages/FreeItems';
import ScrapCollection from './pages/ScrapCollection';
import ProductDetail from './pages/ProductDetail';
import Leaderboard from './pages/Leaderboard';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PointsProvider } from './contexts/PointsContext';
import { useAuth } from './contexts/AuthContext';
import './index.css';

function AppContent() {
  const { user } = useAuth();

  // Redirect admin users to admin dashboard
  if (user?.type === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  // Restrict scrap collectors to only scrap collection
  if (user?.type === 'scrap_collector') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ScrapCollection />} />
            <Route path="/scrap" element={<ScrapCollection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<ScrapCollection />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
  }

  // Normal users get full access
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/thrift" element={<ThriftStore />} />
          <Route path="/books" element={<UsedBooks />} />
          <Route path="/reuse" element={<FreeItems />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <PointsProvider>
            <Router>
              <AppContent />
            </Router>
          </PointsProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;