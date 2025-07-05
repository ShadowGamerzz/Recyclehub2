import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'normal' | 'scrap_collector' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: 'normal' | 'scrap_collector') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, type: 'normal' | 'scrap_collector'): Promise<boolean> => {
    // Check for admin credentials
    if (email === 'admin@gmail.com' && password === 'admin') {
      setUser({
        id: 'admin-001',
        name: 'Admin',
        email: 'admin@gmail.com',
        type: 'admin',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`
      });
      return true;
    }

    // Mock authentication for regular users
    if (email && password) {
      setUser({
        id: Math.random().toString(36),
        name: email.split('@')[0],
        email,
        type,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}