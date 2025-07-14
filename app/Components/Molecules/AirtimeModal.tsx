'use client'
import React, { useState } from 'react';
import { X, Smartphone, CreditCard } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';

interface AirtimeModalProps {
  provider: string;
  onCloseAction: () => void;
}

export function AirtimeModal({ provider, onCloseAction }: AirtimeModalProps) {
  const { dispatch } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ada' | 'ngn'>('ngn');
  const [isProcessing, setIsProcessing] = useState(false);

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate purchase
    setTimeout(() => {
      const transaction = {
        id: Date.now().toString(),
        type: 'utility' as const,
        amount: parseFloat(amount),
        currency: paymentMethod === 'ada' ? 'ADA' as const : 'NGN' as const,
        timestamp: new Date(),
        status: 'completed' as const,
        description: `${provider.toUpperCase()} Airtime - ${phoneNumber}`,
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      setIsProcessing(false);
      onCloseAction();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Buy {provider.toUpperCase()} Airtime
          </h3>
          <button
            onClick={onCloseAction}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08012345678"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Quick Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Amount
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                    amount === quickAmount.toString()
                      ? 'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-600 dark:bg-purple-900/20 dark:text-purple-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                >
                  ₦{quickAmount}
                </button>
              ))}
            </div>
            
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom amount"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setPaymentMethod('ngn')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  paymentMethod === 'ngn'
                    ? 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Naira (NGN)</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Direct payment</span>
              </button>

              <button
                onClick={() => setPaymentMethod('ada')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  paymentMethod === 'ada'
                    ? 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">ADA</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ≈ {(parseFloat(amount || '0') / 850).toFixed(4)} ADA
                </span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onCloseAction}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={!phoneNumber || !amount || isProcessing}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Buy Airtime</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}