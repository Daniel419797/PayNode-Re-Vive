'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@meshsdk/react';

export const Balance: React.FC = () => {
  const { connected, wallet } = useWallet();
  const [lovelace, setLovelace] = useState<string>('0');
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoized balance fetcher
  const refreshBalance = useCallback(async () => {
    if (!connected || !wallet) return;

    try {
      const walletAssets = await wallet.getBalance();
      setAssets(walletAssets);

      const ada = walletAssets.find((a: any) => a.unit === 'lovelace');
      setLovelace(ada?.quantity || '0');
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setLovelace('0');
    } finally {
      setLoading(false);
    }
  }, [connected, wallet]);

  // Auto-refresh every 10s
  useEffect(() => {
    if (!connected || !wallet) return;

    // Initial fetch
    refreshBalance();

    // Start 10s interval
    const interval = setInterval(() => {
      refreshBalance();
    }, 10000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [connected, wallet, refreshBalance]);

  if (!connected) return <p>Please connect your wallet to view balance.</p>;

  return (
    <div>
      {/* {loading ? (
        <p>Loading balance...</p>
      ) : ( */}
      <p>{(parseInt(lovelace) / 1_000_000).toFixed(2)} ₳</p>
      {/* )} */}
    </div>
  );
};
