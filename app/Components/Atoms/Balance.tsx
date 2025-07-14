'use client';
import React, { useEffect, useState } from 'react';
import { useWallet } from '@meshsdk/react';

export const Balance: React.FC = () => {
  const { connected, wallet } = useWallet();
  const [lovelace, setLovelace] = useState<string>('0');
  const [assets, setAssets] = useState<any[]>([]);

  const refreshBalance = async () => {
    if (connected && wallet) {
      try {
        const walletAssets = await wallet.getBalance();
        setAssets(walletAssets);
        const ada = walletAssets.find((a: any) => a.unit === 'lovelace');
        setLovelace(ada?.quantity || '0');
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    }
  };

  useEffect(() => {
    refreshBalance(); // initial fetch
    const interval = setInterval(refreshBalance, 10000); // auto-refresh every 10s

    return () => clearInterval(interval); // cleanup on unmount
  }, [connected, wallet]);

  return (
    <div>
      {connected ? (
        <>
          <p>{(parseInt(lovelace) / 1_000_000).toFixed(2)} ₳</p>
          {/* {assets.length > 0 && (
            <div>
              <h4>All Assets:</h4>
              <ul>
                {assets.map((asset, index) => (
                  <li key={index}>
                    {asset.assetName || 'ADA'}: {asset.unit === 'lovelace'
                      ? (asset.quantity / 1_000_000).toFixed(2)
                      : asset.quantity}{' '}
                    {asset.unit === 'lovelace' ? '₳' : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}*/}
        </>
      ) : (
        <p>Please connect your wallet to view balance.</p>
      )} 
    </div>
  );
};
