'use client';

import React, { useState, useEffect } from 'react';
import { Recycle, Trophy, Star, Zap, Trash2, Sparkles } from 'lucide-react';
import { useWallet } from '@meshsdk/react';
import { BlockfrostProvider } from '@meshsdk/core';
import { useApp } from '../../contexts/AppContext';
import { NFTRecycleModal } from '@/app/Components/Molecules/NFTRecycleModal';
import { NFT } from '@/app/types';

// Define the useNFTs hook within the component or in a separate file
const useNFTs = () => {
  const { wallet, connected } = useWallet();

  const fetchNFTs = async (): Promise<NFT[]> => {
    if (!connected || !wallet) {
      return [];
    }

    try {
      const isTestnet = (await wallet.getUsedAddresses())[0]?.startsWith('addr_test') ?? true;
      const blockfrostProvider = new BlockfrostProvider(
        isTestnet
          ? process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_API_KEY!
          : process.env.NEXT_PUBLIC_BLOCKFROST_MAINNET_API_KEY!
      );

      const assets = await wallet.getAssets();
      const nfts: NFT[] = [];

      for (const asset of assets) {
        const unit = asset.unit;
        const policyId = unit.slice(0, 56);
        const assetName = unit.slice(56);

        let metadata: any = {};
        try {
          const assetInfo = await blockfrostProvider.fetchAssetMetadata(unit);
          metadata = assetInfo.onchain_metadata || {};
        } catch (err) {
          console.warn(`Failed to fetch metadata for asset ${unit}:`, err);
        }

        nfts.push({
          id: unit,
          name: metadata.name || assetName || 'Unknown NFT',
          image: metadata.image || '/fallback-nft-image.png',
          collection: metadata.collection || 'Unknown Collection',
          recycleValue: metadata.recycleValue || '0',
          policyId,
          assetName,
          attributes: metadata.attributes || {},
          rarity: metadata.rarity || 'common', // Add rarity or fetch from metadata/backend
        });
      }

      return nfts;
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  };

  return { fetchNFTs };
};

interface NFTRecycleModalProps {
  nft: NFT;
  onCloseAction: () => void;
}

const NFTRecycle: React.FC = () => {
  const { state, dispatch } = useApp();
  const { connected } = useWallet();
  const { fetchNFTs } = useNFTs();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showRecycleModal, setShowRecycleModal] = useState(false);

  // Fetch NFTs when wallet connects
  useEffect(() => {
    const loadNFTs = async () => {
      const fetchedNFTs = await fetchNFTs();
      setNfts(fetchedNFTs);
    };
    if (connected) {
      loadNFTs();
    } else {
      setNfts([]);
    }
  }, [connected, fetchNFTs]);

  const handleRecycleNFT = (nft: NFT) => {
    setSelectedNFT(nft);
    setShowRecycleModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Recycle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">NFT Recycling</h1>
            <p className="text-purple-100">Turn unused NFTs into valuable ReV tokens</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Your Rank</span>
            </div>
            <div className="text-2xl font-bold">#{state.user?.rank || 0}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Star className="w-5 h-5" />
              <span className="font-medium">Total Recycled</span>
            </div>
            <div className="text-2xl font-bold">{state.user?.recycledCount || 0}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5" />
              <span className="font-medium">ReV Tokens</span>
            </div>
            <div className="text-2xl font-bold">{state.user?.revTokens || 0}</div>
          </div>
        </div>
      </div>

      {/* Recycling Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Recycle NFTs</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Burn unused NFTs and earn ReV tokens based on their rarity and value
          </p>
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            +5-50 ReV per NFT
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Recycle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Token Recycling</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Clean up dust tokens and dead projects from your wallet
          </p>
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            +1-10 ReV per token
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">NFT Fusion</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Combine multiple NFTs to create new, valuable collections
          </p>
          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
            Coming Soon
          </div>
        </div>
      </div>

      {/* Your NFTs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your NFTs
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select NFTs to recycle and earn ReV tokens
          </p>
        </div>

        <div className="p-6">
          {!connected ? (
            <div className="text-center py-12">
              <Recycle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Connect Your Wallet
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                Connect your Cardano wallet to view and recycle your NFTs
              </p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-12">
              <Recycle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No NFTs Found
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                You don&apos;t have any NFTs in your wallet to recycle.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 group hover:shadow-lg transition-all duration-200"
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-200 dark:bg-gray-600">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.src = '/fallback-nft-image.png';
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{nft.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{nft.collection}</p>

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          nft.rarity === 'legendary'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : nft.rarity === 'rare'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {nft.rarity}
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        +{nft.recycleValue} ReV
                      </span>
                    </div>

                    <button
                      onClick={() => handleRecycleNFT(nft)}
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      disabled={!connected}
                    >
                      Recycle for {nft.recycleValue} ReV
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recycling Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recycling Leaderboard
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Top recyclers this month
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {[
              { rank: 1, name: 'EcoWarrior', recycled: 156, reward: '🏆' },
              { rank: 2, name: 'GreenMachine', recycled: 143, reward: '🥈' },
              { rank: 3, name: 'ReV_Master', recycled: 128, reward: '🥉' },
              {
                rank: state.user?.rank || 47,
                name: 'You',
                recycled: state.user?.recycledCount || 12,
                reward: '',
              },
            ].map((user) => (
              <div
                key={user.rank}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  user.name === 'You'
                    ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-500 dark:text-gray-400 w-8">
                    {user.rank <= 3 ? user.reward : `#${user.rank}`}
                  </span>
                  <span
                    className={`font-medium ${
                      user.name === 'You'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {user.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {user.recycled} NFTs recycled
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recycle Modal */}
      {showRecycleModal && selectedNFT && (
        <NFTRecycleModal
          nft={selectedNFT}
          onCloseAction={() => {
            setShowRecycleModal(false);
            setSelectedNFT(null);
          }}
        />
      )}
    </div>
  );
};

export default NFTRecycle;