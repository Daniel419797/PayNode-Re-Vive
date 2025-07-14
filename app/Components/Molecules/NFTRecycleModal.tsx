'use client';

import { useState } from 'react';
import { X, Recycle, AlertTriangle } from 'lucide-react';
import { useWallet, useAddress } from '@meshsdk/react';
import { Transaction, BlockfrostProvider } from '@meshsdk/core';
import { useApp } from '@/app/contexts/AppContext';
import { NFT } from '@/app/types';

interface NFTRecycleModalProps {
  nft: NFT;
  onCloseAction: () => void;
}

export function NFTRecycleModal({ nft, onCloseAction }: NFTRecycleModalProps) {
  const { state, dispatch } = useApp();
  const { connected, wallet } = useWallet();
  const address = useAddress();
  const [isRecycling, setIsRecycling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTMetadata = async (assetId: string): Promise<{ policyId: string; assetName: string }> => {
    const isTestnet = address?.startsWith('addr_test') ?? true;
    const apiKey = isTestnet
      ? process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_API_KEY
      : process.env.NEXT_PUBLIC_BLOCKFROST_MAINNET_API_KEY;

    if (!apiKey) {
      throw new Error('Blockfrost API key is not configured');
    }

    const blockfrostProvider = new BlockfrostProvider(apiKey);
    const assetInfo = await blockfrostProvider.fetchAssetMetadata(assetId);

    return {
      policyId: assetInfo.policy_id || assetId.slice(0, 56),
      assetName: assetInfo.asset_name || assetId.slice(56),
    };
  };

  const handleConfirm = async () => {
    if (!connected || !address || !wallet) {
      setError('Please connect your wallet first.');
      return;
    }

    setIsRecycling(true);
    setError(null);

    try {
      // Ensure policyId and assetName are available
      let policyId = nft.policyId;
      let assetName = nft.assetName;

      if (!policyId || !assetName) {
        const metadata = await fetchNFTMetadata(nft.id);
        policyId = metadata.policyId;
        assetName = metadata.assetName;
      }

      const isTestnet = address.startsWith('addr_test');
      const blockfrostProvider = new BlockfrostProvider(
        isTestnet
          ? process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_API_KEY!
          : process.env.NEXT_PUBLIC_BLOCKFROST_MAINNET_API_KEY!
      );

      // Create transaction to burn NFT
      const tx = new Transaction({ initiator: wallet });
      // tx.burnAsset(
      //   myPolicyScript, // 🔁 Replace this with the actual script object used to mint/burn
      //   [
      //     {
      //       unit: `${policyId}${assetName}`,
      //       quantity: '1',
      //     },
      //   ]
      // );


      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      // Notify backend of successful burn
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recycle-nft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${
            isTestnet
              ? process.env.NEXT_PUBLIC_BLOCKFROST_PREPROD_API_KEY
              : process.env.NEXT_PUBLIC_BLOCKFROST_MAINNET_API_KEY
          }`,
        },
        body: JSON.stringify({
          nftId: nft.id,
          walletAddress: address,
          assetName,
          policyId,
          txHash,
        }),
      });

      const data = await backendResponse.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to process NFT recycling');
      }

      // Update local state
      dispatch({
        type: 'RECYCLE_NFT',
        payload: nft.id,
      });

      // Fetch updated balance using Mesh SDK
      const balance = await wallet.getBalance();
      const lovelace = balance.find((asset: any) => asset.unit === 'lovelace')?.quantity || '0';
      const adaBalance = parseInt(lovelace) / 1_000_000;
      const revBalance = balance.find((asset: any) => asset.unit.includes('ReV'))?.quantity || '0';

      // Update wallet state
      // dispatch({
      //   type: 'UPDATE_WALLET_BALANCE',
      //   payload: {
      //     address,
      //     walletType: state.wallet.walletType || 'nami',
      //     balance: adaBalance,
      //     revBalance: parseInt(revBalance),
      //   },
      // });

      console.log('Balance updated:', {
        ada: adaBalance,
        rev: revBalance,
        txHash,
        timestamp: new Date().toISOString(),
      });

      onCloseAction();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error('NFT recycle error:', {
        error: errorMessage,
        nftId: nft.id,
        timestamp: new Date().toISOString(),
      });
      setError(`Failed to recycle NFT: ${errorMessage}`);
    } finally {
      setIsRecycling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recycle {nft.name}
          </h3>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isRecycling}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden mb-4 relative">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/fallback-nft-image.png';
                }}
              />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{nft.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{nft.collection}</p>
            {nft.attributes && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {Object.entries(nft.attributes).map(([key, value]) => (
                  <p key={key}>
                    {key}: {value}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="font-medium text-red-900 dark:text-red-200">Warning</span>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">
              Recycling will permanently burn this NFT. This action cannot be reversed.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-green-900 dark:text-green-200">Reward:</span>
                <p className="text-sm text-green-700 dark:text-green-300">ReV tokens for recycling</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{nft.recycleValue || 'TBD'} ReV
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">Tokens</div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onCloseAction}
              disabled={isRecycling}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isRecycling || !connected}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Recycle className={`w-4 h-4 ${isRecycling ? 'animate-spin' : ''}`} />
              <span>{isRecycling ? 'Processing...' : 'Recycle NFT'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}