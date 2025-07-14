'use client';
import React from 'react';
import { useWallet } from '@meshsdk/react';
import Link from 'next/link';
import {
  Recycle,
  Vote,
  Users,
  Smartphone,
  TrendingUp,
  Trophy,
  Coins,
  ArrowUpRight,
  Star
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import ConnectButton from '@/app/Components/Atoms/WalletConnectButton';

export default function HomePage() {
  const { connected, wallet } = useWallet();
  const { state } = useApp();

  const quickActions = [
    { name: 'Send ADA', path: '/wallet', icon: ArrowUpRight, color: 'bg-blue-500' },
    { name: 'Buy Airtime', path: '/utilities', icon: Smartphone, color: 'bg-green-500' },
    { name: 'Recycle NFTs', path: '/recycle', icon: Recycle, color: 'bg-purple-500' },
    { name: 'DAO Voting', path: '/dao', icon: Vote, color: 'bg-orange-500' },
  ];

  const stats = [
    { label: 'Total Recycled', value: state.user?.recycledCount || 0, icon: Recycle, color: 'text-purple-600' },
    { label: 'ReV Tokens', value: state.user?.revTokens || 0, icon: Coins, color: 'text-yellow-600' },
    { label: 'Referrals', value: state.user?.referralCount || 0, icon: Users, color: 'text-blue-600' },
    { label: 'Leaderboard Rank', value: state.user?.rank || '-', icon: Trophy, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {!connected ? (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-teal-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold mb-4">Welcome to PayMint Re:Vive</h1>
              <p className="text-xl opacity-90 mb-6">
                Your gateway to Cardano payments, NFT recycling, and decentralized governance
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Get Started
                </button>
                <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>

          <ConnectButton />
        </>
      ) : (
        <>
          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.name}
                    href={action.path}
                    className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-200"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {action.name}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                <Link
                  href="/wallet"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="p-6">
              {state.transactions.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No recent activity. Start by connecting your wallet!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                          <Recycle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        +{transaction.amount} {transaction.currency}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Featured Section */}
          <div className="bg-gradient-to-br from-teal-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Star className="w-6 h-6" />
              <h3 className="text-xl font-semibold">Earn More ReV Tokens</h3>
            </div>
            <p className="text-teal-100 mb-6">
              Recycle your unused NFTs and earn ReV tokens. Vote on DAO proposals and help shape the future of the
              platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/recycle"
                className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Recycling
              </Link>
              <Link
                href="/dao"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
              >
                View Proposals
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
