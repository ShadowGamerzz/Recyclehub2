import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface UserPoints {
  userId: string;
  name: string;
  points: number;
  donations: number;
  avatar: string;
}

interface PointsContextType {
  userPoints: UserPoints[];
  addPoints: (userId: string, points: number) => void;
  getUserPoints: (userId: string) => number;
  getLeaderboard: () => UserPoints[];
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

// Mock leaderboard data
const mockLeaderboard: UserPoints[] = [
  { userId: '1', name: 'Priya Sharma', points: 2450, donations: 49, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' },
  { userId: '2', name: 'Rahul Kumar', points: 2100, donations: 42, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul' },
  { userId: '3', name: 'Anita Singh', points: 1850, donations: 37, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anita' },
  { userId: '4', name: 'Vikram Patel', points: 1600, donations: 32, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram' },
  { userId: '5', name: 'Sneha Gupta', points: 1400, donations: 28, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha' },
];

export function PointsProvider({ children }: { children: ReactNode }) {
  const [userPoints, setUserPoints] = useState<UserPoints[]>(mockLeaderboard);

  const addPoints = (userId: string, points: number) => {
    setUserPoints(prev => {
      const existing = prev.find(u => u.userId === userId);
      if (existing) {
        return prev.map(u => 
          u.userId === userId 
            ? { ...u, points: u.points + points, donations: u.donations + 1 }
            : u
        );
      }
      return prev;
    });
  };

  const getUserPoints = (userId: string): number => {
    const user = userPoints.find(u => u.userId === userId);
    return user?.points || 0;
  };

  const getLeaderboard = (): UserPoints[] => {
    return [...userPoints].sort((a, b) => b.points - a.points);
  };

  return (
    <PointsContext.Provider value={{
      userPoints,
      addPoints,
      getUserPoints,
      getLeaderboard
    }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}