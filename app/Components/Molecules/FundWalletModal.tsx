'use client'
import React, { useState, useEffect } from 'react';
import { useWallet, useAddress } from '@meshsdk/react';
import { Balance } from '@/app/Components/Atoms/Balance';
import { X, CreditCard, Banknote, ArrowRight, Wallet, Copy, Loader2 } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';

interface FundWalletModalProps {
  onCloseAction: () => void;
}

export function FundWalletModal({ onCloseAction }: FundWalletModalProps) {
  const { connected } = useWallet()
  const address = useAddress()
  const { state, dispatch } = useApp();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave' | 'bank'>('paystack');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  const truncatedAddress = address
    ? `${address.slice(0, 8)}...${address.slice(-8)}`
    : '';

  // Fetch live ADA/NGN exchange rate from CoinGecko
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsLoadingRate(true);
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=ngn'
        );
        if (!response.ok) {
          throw new Error(`CoinGecko API error: ${response.status}`);
        }
        const data = await response.json();
        const rate = data.cardano.ngn;
        if (typeof rate !== 'number' || rate <= 0) {
          throw new Error('Invalid exchange rate received');
        }
        setExchangeRate(rate);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to fetch exchange rate:', errorMessage);
        // Fallback to hardcoded rate if API fails
        setExchangeRate(850);
        alert('Failed to fetch live exchange rate. Using fallback rate of ₦850/ADA.');
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchExchangeRate();
    // Refresh every 5 minutes (300000ms) to stay up-to-date
    const interval = setInterval(fetchExchangeRate, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
        alert('Failed to copy address to clipboard.');
      }
    }
  };

  // FundWalletModal.tsx
  // const handleRefreshBalance = async (retryCount = 0, maxRetries = 2) => {
  //   if (!state.wallet.address) {
  //     alert('No wallet connected.');
  //     return;
  //   }
  //   setIsRefreshing(true);
  //   try {
  //     const isTestnet = state.wallet.address.startsWith('addr_test');
  //     const apiKey = isTestnet
  //       ? import.meta.env.VITE_BLOCKFROST_PREPROD_API_KEY
  //       : import.meta.env.VITE_BLOCKFROST_MAINNET_API_KEY;
  //     const baseUrl = isTestnet
  //       ? 'https://cardano-preprod.blockfrost.io/api/v0'
  //       : 'https://cardano-mainnet.blockfrost.io/api/v0';

  //     const response = await fetch(`${baseUrl}/addresses/${state.wallet.address}`, {
  //       headers: { project_id: apiKey },
  //     });
  //     if (!response.ok) {
  //       const body = await response.text();
  //       if (response.status === 404) {
  //         dispatch({
  //           type: 'CONNECT_WALLET',
  //           payload: { balance: 0, revBalance: 0 },
  //         });
  //       } else if (response.status === 429 && retryCount < maxRetries) {
  //         await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
  //         return handleRefreshBalance(retryCount + 1, maxRetries);
  //       } else {
  //         throw new Error(`Blockfrost API error ${response.status}: ${body}`);
  //       }
  //     } else {
  //       const data = await response.json();
  //       const balanceInLovelace = data.amount?.find((item: any) => item.unit === 'lovelace')?.quantity || '0';
  //       const balance = parseInt(balanceInLovelace) / 1_000_000;
  //       const revBalance = data.amount?.find((item: any) => item.unit.includes('ReV'))?.quantity || 0;
  //       dispatch({
  //         type: 'CONNECT_WALLET',
  //         payload: { balance, revBalance },
  //       });
  //       console.log('Blockfrost balance updated:', balance, 'ADA', revBalance, 'ReV');
  //     }
  //   } catch (err: unknown) {
  //     alert(`Failed to refresh balance: ${err instanceof Error ? err.message : 'Unknown error'}`);
  //   } finally {
  //     setIsRefreshing(false);
  //   }
  // };

  const handleFund = async () => {
    if (!connected) {
      alert('No wallet connected. Please connect a wallet first.');
      return;
    }
    if (!amount || parseFloat(amount) < 1000) {
      alert('Please enter an amount of at least ₦1000.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fund-wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method: paymentMethod, walletAddress: state.wallet.address }),
      });


      const data = await res.json();
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert(data?.message || 'Failed to retrieve payment URL');
      }
    } catch (err: unknown) {
      console.error('Funding error:', err);
      alert('Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black h-[100dvh] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Fund Wallet
          </h3>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6  overflow-y-scroll overflow-x-hidden h-[80dvh]">
          {connected ? (
            <>
              {/* Wallet Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    {truncatedAddress}
                  </span>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 dark:hover:text-purple-500"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                   <Balance/>
                </span>
                   {/*: {state.wallet.balance?.toFixed(4) || '0.0000'} ADA
                 */}
                {/* <button
                  onClick={handleRefreshBalance}
                  disabled={isRefreshing}
                  className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 dark:hover:text-purple-500 disabled:opacity-50"
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Refresh Balance</span>
                  )}
                </button> */}
              </div>

              {/* Funding Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                  Direct Funding
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p>
                    {address?.startsWith('addr_test') ? (
                      <>
                        For testnet, send tADA using the{' '}
                        <a
                          href="https://docs.cardano.org/cardano-testnet/tools/faucet"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-800 dark:hover:text-blue-400"
                        >
                          Cardano Testnet Faucet
                        </a>.
                      </>
                    ) : (
                      'For mainnet, send ADA to the wallet address above from another wallet or exchange.'
                    )}
                  </p>
                  <p>Transactions may take a few minutes to reflect.</p>
                </div>
              </div>

              {/* Payment Gateway Funding */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (NGN)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="100"
                  min="1000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isLoadingRate ? (
                    'Loading exchange rate...'
                  ) : exchangeRate ? (
                    <>
                      ≈ {(parseFloat(amount || '0') / exchangeRate).toFixed(4)} ADA (₦{exchangeRate.toFixed(2)}/ADA)
                    </>
                  ) : (
                    'Unable to fetch exchange rate'
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {['paystack', 'flutterwave', 'bank'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method as typeof paymentMethod)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        paymentMethod === method
                          ? 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {method === 'bank' ? (
                          <Banknote className="w-5 h-5 text-green-600" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {method === 'paystack' ? 'Paystack' : method === 'flutterwave' ? 'Flutterwave' : 'Bank Transfer'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {method === 'paystack' ? 'Card, Bank, USSD' : method === 'flutterwave' ? 'Card, Bank' : 'Direct Transfer'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                  Exchange Rate Information
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p>
                    • Current rate:{' '}
                    {isLoadingRate ? 'Loading...' : exchangeRate ? `₦${exchangeRate.toFixed(2)} per ADA` : 'Unavailable'}
                  </p>
                  <p>• ADA will be purchased and added to your wallet</p>
                  <p>• Transaction may take 5-15 minutes to complete</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onCloseAction}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFund}
                  disabled={!amount || parseFloat(amount) < 1000 || isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Fund Wallet</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">
                No Wallet Connected
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please connect a wallet from the header to fund it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}