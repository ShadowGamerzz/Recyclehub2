import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'clothing' | 'furniture' | 'electronics' | 'books';
  listingType: 'thrift' | 'used_books' | 'reuse' | 'scrap';
  condition: 'excellent' | 'good' | 'fair';
  images: string[];
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  location: string;
  createdAt: Date;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  getProductsByCategory: (category: string) => Product[];
  getProductsByListingType: (listingType: string) => Product[];
  getProduct: (id: string) => Product | undefined;
  getScrapItems: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock data with different listing types
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'cap.',
    price: 2500,
    category: 'clothing',
    listingType: 'thrift',
    condition: 'excellent',
    images: ['https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg'],
    seller: { id: 'seller1', name: 'Sarah M.', rating: 4.8 },
    location: 'Mumbai, Maharashtra',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Programming Books Collection',
    description: 'Set of 5 programming books including JavaScript, Python, and React guides.',
    price: 1200,
    category: 'books',
    listingType: 'used_books',
    condition: 'good',
    images: ['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'],
    seller: { id: 'seller2', name: 'Rahul K.', rating: 4.6 },
    location: 'Delhi, Delhi',
    createdAt: new Date()
  },
  {
    id: '3',
    title: 'Study Table - Free to Good Home',
    description: 'Wooden study table, slightly worn but functional. Perfect for students.',
    price: 0,
    category: 'furniture',
    listingType: 'reuse',
    condition: 'fair',
    images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
    seller: { id: 'seller3', name: 'Priya S.', rating: 4.9 },
    location: 'Bangalore, Karnataka',
    createdAt: new Date()
  },
  {
    id: '4',
    title: 'Old Mobile Phones - Scrap',
    description: 'Collection of old mobile phones for parts and recycling.',
    price: 500,
    category: 'electronics',
    listingType: 'scrap',
    condition: 'fair',
    images: ['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'],
    seller: { id: 'seller4', name: 'Amit P.', rating: 4.5 },
    location: 'Pune, Maharashtra',
    createdAt: new Date()
  },
  {
    id: '5',
    title: 'Designer Jeans',
    description: 'High-quality designer jeans, size 32. Barely worn, excellent condition.',
    price: 1800,
    category: 'clothing',
    listingType: 'thrift',
    condition: 'excellent',
    images: ['https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg'],
    seller: { id: 'seller5', name: 'Neha R.', rating: 4.7 },
    location: 'Chennai, Tamil Nadu',
    createdAt: new Date()
  },
  {
    id: '6',
    title: 'Children\'s Story Books',
    description: 'Collection of children\'s story books in Hindi and English.',
    price: 800,
    category: 'books',
    listingType: 'used_books',
    condition: 'good',
    images: ['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg'],
    seller: { id: 'seller6', name: 'Kavita M.', rating: 4.8 },
    location: 'Kolkata, West Bengal',
    createdAt: new Date()
  },
  {
    id: '7',
    title: 'Free Plastic Chairs',
    description: 'Set of 4 plastic chairs, good for outdoor use. Free pickup.',
    price: 0,
    category: 'furniture',
    listingType: 'reuse',
    condition: 'good',
    images: ['https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg'],
    seller: { id: 'seller7', name: 'Ravi T.', rating: 4.6 },
    location: 'Hyderabad, Telangana',
    createdAt: new Date()
  },
  {
    id: '8',
    title: 'Electronic Waste - Cables & Parts',
    description: 'Various electronic cables, adapters, and small parts for recycling.',
    price: 200,
    category: 'electronics',
    listingType: 'scrap',
    condition: 'fair',
    images: ['https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg'],
    seller: { id: 'seller8', name: 'Suresh L.', rating: 4.4 },
    location: 'Ahmedabad, Gujarat',
    createdAt: new Date()
  }
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36),
      createdAt: new Date()
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'all') return products.filter(p => p.listingType !== 'scrap');
    return products.filter(product => product.category === category && product.listingType !== 'scrap');
  };

  const getProductsByListingType = (listingType: string) => {
    return products.filter(product => product.listingType === listingType);
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getScrapItems = () => {
    return products.filter(product => product.listingType === 'scrap');
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      getProductsByCategory,
      getProductsByListingType,
      getProduct,
      getScrapItems
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}