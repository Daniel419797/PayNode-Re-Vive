'use client'
import React, { useState, useEffect } from 'react';
import { Send, QrCode, History, Plus, Download, Loader2 } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';
import { TransactionHistory } from '@/app/Components/Molecules/TransactionHistory';
import { SendADAModal } from '@/app/Components/Molecules/SendADAModal'; 
import { ReceiveModal } from '@/app/Components/Molecules/ReceiveModal';
// import SendAda from '@/app/Components/Atoms/sendAda'
import { FundWalletModal } from '@/app/Components/Molecules/FundWalletModal';
import { NFTRecycleModal } from '@/app/Components/Molecules/NFTRecycleModal';
import axios from 'axios';
import { useWallet } from '@meshsdk/react';
import { Balance } from '@/app/Components/Atoms/Balance';

const Wallet = () => {
  const { state } = useApp();
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [rateError, setRateError] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showRecycleModal, setShowRecycleModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { connected, wallet } = useWallet();

  // const handleRefreshBalance = async () => {
  //   try {
  //     setIsRefreshing(true);
  //     // call your refresh balance logic here
  //   } finally {
  //     setIsRefreshing(false);
  //   }
  // };

  const handleRecycleNFT = (nft: any) => {
    setSelectedNFT(nft);
    setShowRecycleModal(true);
  };

  const fetchExchangeRate = async () => {
    setIsLoadingRate(true);
    setRateError('');
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: { ids: 'cardano', vs_currencies: 'ngn' },
      });
      setExchangeRate(res.data.cardano.ngn);
    } catch (err) {
      console.error('Error fetching ADA->NGN:', err);
      setRateError('Unable to load rate');
    } finally {
      setIsLoadingRate(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
    const interval = setInterval(fetchExchangeRate, 60000);
    return () => clearInterval(interval);
  }, []);

  

  return (

    <div className="space-y-8">

      {!connected ? (
        <div className="space-y-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400">Connect your Cardano wallet to get started</p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Wallet</h1>
                <p className="text-purple-100">
                  {state.wallet.address?.slice(0, 20)}...{state.wallet.address?.slice(-10)}
                </p>
              </div>
              <div className="text-right">
                <Balance/>
                {/* <div className="flex items-center space-x-2">
                  <div className="text-3xl font-bold">
                    {isRefreshing ? 'Loading...' : (state.wallet.balance?.toFixed(2) || '0.00')} ADA
                  </div>
                  <button
                    onClick={handleRefreshBalance}
                    disabled={isRefreshing}
                    className="text-purple-100 hover:text-white disabled:opacity-50"
                  >
                    <Loader2 className={`w-6 h-6 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="text-purple-100">
                  ReV: {isRefreshing ? 'Loading...' : (state.wallet.revBalance || 0)} tokens
                </div>
                <div className="text-purple-100">
                  {isLoadingRate
                    ? 'Loading exchange rate...'
                    : rateError
                    ? rateError
                    : exchangeRate
                    ? `≈ ₦${((state.wallet.balance || 0) * exchangeRate).toLocaleString()}`
                    : '≈ ₦0'}
                </div>*/}
              </div> 
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => setShowSendModal(true)} className="wallet-btn flex flex-col items-center">
                <Send className="wallet-icon" />
                <span>Send</span>
              </button>
              <button onClick={() => setShowReceiveModal(true)} className="wallet-btn flex flex-col items-center">
                <QrCode className="wallet-icon" />
                <span>Receive</span>
              </button>
              <button onClick={() => setShowFundModal(true)} className="wallet-btn flex flex-col items-center">
                <Plus className="wallet-icon" />
                <span>Add Funds</span>
              </button>
              <button className="wallet-btn flex flex-col items-center">
                <Download className="wallet-icon" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your NFTs</h2>
            {state.nfts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No NFTs found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {state.nfts.map(nft => (
                  <div key={nft.id} className="border rounded-lg p-4">
                    <img src={nft.image} alt={nft.name} className="w-full h-32 object-cover rounded mb-2" />
                    <p className="font-semibold">{nft.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{nft.collection}</p>
                    <button
                      onClick={() => handleRecycleNFT(nft)}
                      className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Recycle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: 'Total Sent',
                icon: <Send className="w-8 h-8 text-red-500" />,
                value: state.transactions.filter(t => t.type === 'send').reduce((sum, t) => sum + t.amount, 0),
              },
              {
                label: 'Total Received',
                icon: <Download className="w-8 h-8 text-green-500" />,
                value: state.transactions.filter(t => t.type === 'receive').reduce((sum, t) => sum + t.amount, 0),
              },
              {
                label: 'Transactions',
                icon: <History className="w-8 h-8 text-blue-500" />,
                value: state.transactions.length,
              },
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
                    </p>
                  </div>
                  {item.icon}
                </div>
              </div>
            ))}
          </div>

          <TransactionHistory />

          {showSendModal && <SendADAModal onClose={() => setShowSendModal(false)} exchangeRate={exchangeRate} />}
          {showReceiveModal && <ReceiveModal onCloseAction={() => setShowReceiveModal(false)} />}
          {showFundModal && <FundWalletModal onCloseAction={() => setShowFundModal(false)} />}
          {showRecycleModal && selectedNFT && (
            <NFTRecycleModal nft={selectedNFT} onCloseAction={() => setShowRecycleModal(false)} />
          )}
        </>
        
      )}

    </div>  
  );  
  
}
export default Wallet;
