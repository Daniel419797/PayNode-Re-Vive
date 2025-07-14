import React, { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';
import { CardanoWallet } from '@meshsdk/react';
import { X, Send, User, Hash, Phone } from 'lucide-react';
import { sendAda } from '../Atoms/SendAda';

interface SendADAModalProps {
  onClose: () => void;
  exchangeRate: number | null;
}

export function SendADAModal({ onClose, exchangeRate }: SendADAModalProps) {
  const { wallet, connected } = useWallet();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>(''); // Amount in ADA
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recipientType, setRecipientType] = useState<'address' | 'username' | 'phone'>('address');
  const [loading, setLoading] = useState<boolean>(false);
  const [estimatedFee, setEstimatedFee] = useState<string | null>(null);

  // Estimate transaction fee when amount or recipient changes
  useEffect(() => {
    const estimateFee = async () => {
      if (!connected || !recipient || !amount || recipientType !== 'address') {
        setEstimatedFee(null);
        return;
      }

      try {
        const tx = new Transaction({ initiator: wallet });
        const amountLovelace = (parseFloat(amount) * 1_000_000).toString();
        tx.sendLovelace(recipient, amountLovelace);

        // Build the transaction to estimate the fee
        const unsignedTx = await tx.build();

        // Since Mesh SDK doesn't provide direct fee access, assume a typical fee
        // Alternatively, use cardano-serialization-lib to parse the fee (see note below)
        setEstimatedFee('170000'); // Placeholder: ~0.17 ADA, adjust based on network
      } catch (err) {
        console.error('Error estimating fee:', err);
        setEstimatedFee(null);
      }
    };

    estimateFee();
  }, [amount, recipient, connected, wallet, recipientType]);

  const resolveRecipient = async (
    input: string,
    type: 'username' | 'phone'
  ): Promise<string> => {
    try {
      const res = await fetch('/api/resolve-recipient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value: input }),
      });

      if (!res.ok) {
        throw new Error(`Failed to resolve ${type}: ${res.statusText}`);
      }

      const data = await res.json();

      if (!data.address) {
        throw new Error(`Could not resolve ${type} to a wallet address.`);
      }

      return data.address;
    } catch (err: any) {
      throw new Error(`Failed to resolve ${type}: ${err.message}`);
    }
  };

  const handleSendAda = async () => {
    if (!connected) {
      setError('Please connect your wallet first.');
      return;
    }

    if (!recipient || !amount) {
      setError('Recipient address and amount are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let recipientAddress = recipient;

      // Resolve username or phone number to wallet address
      if (recipientType !== 'address') {
        recipientAddress = await resolveRecipient(recipient, recipientType);
      }

      // Validate recipient address (basic check for Cardano address format)
      if (!recipientAddress.startsWith('addr1') && !recipientAddress.startsWith('addr_test1')) {
        throw new Error('Invalid Cardano wallet address.');
      }

      // Convert ADA to lovelace (1 ADA = 1,000,000 lovelace)
      const amountLovelace = (parseFloat(amount) * 1_000_000).toString();
      const hash = await sendAda({
        recipientAddress,
        amountLovelace,
        wallet,
      });
      setTxHash(hash);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {connected ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Send ADA
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {txHash && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-700 dark:text-green-300">
                Transaction successful! Hash: {txHash}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Send to
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setRecipientType('address')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    recipientType === 'address'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span>Address</span>
                </button>
                <button
                  onClick={() => setRecipientType('username')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    recipientType === 'username'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Username</span>
                </button>
                <button
                  onClick={() => setRecipientType('phone')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    recipientType === 'phone'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {recipientType === 'address'
                  ? 'Wallet Address'
                  : recipientType === 'username'
                  ? 'Username'
                  : 'Phone Number'}
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={
                  recipientType === 'address'
                    ? 'addr1q9x2vzx8strd6h8w7c3xm4...'
                    : recipientType === 'username'
                    ? '@username'
                    : '+234 123 456 7890'
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (ADA)
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ≈ ₦{(parseFloat(amount || '0') * (exchangeRate || 850)).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Transaction Fee</span>
                <span className="text-gray-900 dark:text-white">
                  {estimatedFee ? (parseInt(estimatedFee) / 1_000_000).toFixed(6) : 'Calculating...'} ADA
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-300">Total</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(parseFloat(amount || '0') + (estimatedFee ? parseInt(estimatedFee) / 1_000_000 : 0)).toFixed(6)} ADA
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAda}
                disabled={!recipient || !amount || !connected || loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send ADA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
          <p className="text-gray-600 dark:text-gray-300">
            Please connect a wallet to send a transaction.
          </p>
          <CardanoWallet />
        </div>
      )}
    </div>
  );
}