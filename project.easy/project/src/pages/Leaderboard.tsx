import React from 'react';
import { Trophy, Star, Gift, Medal, Crown } from 'lucide-react';
import { usePoints } from '../contexts/PointsContext';
import { useAuth } from '../contexts/AuthContext';

export default function Leaderboard() {
  const { getLeaderboard } = usePoints();
  const { user } = useAuth();
  const leaderboard = getLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500 dark:text-gray-400">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
            <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Eco Warriors Leaderboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Top contributors making a difference through recycling</p>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="font-medium text-green-800 dark:text-green-200">How to Earn Points</span>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm">
            Earn 50 points for every free item you donate! Help others while building a sustainable community.
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {leaderboard.slice(0, 3).map((userEntry, index) => {
          const rank = index + 1;
          const isCurrentUser = user?.id === userEntry.userId;
          
          return (
            <div
              key={userEntry.userId}
              className={`${getRankBg(rank)} ${rank === 1 ? 'md:order-2' : rank === 2 ? 'md:order-1' : 'md:order-3'} 
                         ${isCurrentUser ? 'ring-4 ring-blue-500' : ''} 
                         rounded-xl p-6 text-center shadow-lg transform hover:scale-105 transition-all duration-300`}
            >
              <div className="flex justify-center mb-4">
                {getRankIcon(rank)}
              </div>
              
              <img
                src={userEntry.avatar}
                alt={userEntry.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
              />
              
              <h3 className={`font-bold text-lg mb-2 ${rank <= 3 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {userEntry.name}
                {isCurrentUser && <span className="text-blue-300 ml-2">(You)</span>}
              </h3>
              
              <div className={`space-y-1 ${rank <= 3 ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                <div className="flex items-center justify-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold">{userEntry.points} points</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <Gift className="h-4 w-4" />
                  <span>{userEntry.donations} donations</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Complete Rankings</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {leaderboard.map((userEntry, index) => {
            const rank = index + 1;
            const isCurrentUser = user?.id === userEntry.userId;
            
            return (
              <div
                key={userEntry.userId}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 flex justify-center">
                    {rank <= 3 ? getRankIcon(rank) : (
                      <span className="text-lg font-bold text-gray-500 dark:text-gray-400">#{rank}</span>
                    )}
                  </div>
                  
                  <img
                    src={userEntry.avatar}
                    alt={userEntry.name}
                    className="w-12 h-12 rounded-full"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {userEntry.name}
                      {isCurrentUser && <span className="text-blue-600 dark:text-blue-400 ml-2">(You)</span>}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userEntry.donations} donations made
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                      {userEntry.points}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
          Achievement Milestones
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-bronze-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Medal className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Eco Starter</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">100 points</p>
          </div>
          <div className="text-center">
            <div className="bg-gray-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Medal className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Green Guardian</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">500 points</p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Crown className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Eco Champion</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">1000 points</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Planet Hero</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">2000 points</p>
          </div>
        </div>
      </div>
    </div>
  );
}