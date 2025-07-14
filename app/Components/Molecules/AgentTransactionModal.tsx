import React, { useState } from 'react';
import { X, MapPin, Star, Shield, ArrowRight } from 'lucide-react';
import { Agent } from '@/app/types';
import { useApp } from '@/app/contexts/AppContext';

interface AgentTransactionModalProps {
  agent: Agent;
  onClose: () => void;
}

export function AgentTransactionModal({ agent, onClose }: AgentTransactionModalProps) {
  const { dispatch } = useApp();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransaction = async () => {
    setIsProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      const transaction = {
        id: Date.now().toString(),
        type: 'send' as const,
        amount: parseFloat(amount),
        currency: 'ADA' as const,
        timestamp: new Date(),
        status: 'pending' as const,
        recipient: agent.name,
        description: `Cash-out via ${agent.name}`,
      };
      
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      setIsProcessing(false);
      onClose();
    }, 3000);
  };

  const nairaAmount = parseFloat(amount || '0') * agent.exchangeRate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cash-Out Transaction
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Agent Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {agent.name}
              </h4>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {agent.rating}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{agent.location}</span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Exchange Rate: ₦{agent.exchangeRate}/ADA
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount to Cash Out (ADA)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              You will receive: ₦{nairaAmount.toLocaleString()}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
              Transaction Process
            </h5>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>1. Your ADA will be locked in escrow</p>
              <p>2. Agent will be notified of the transaction</p>
              <p>3. Meet agent at agreed location</p>
              <p>4. Receive cash and confirm transaction</p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="font-medium text-yellow-800 dark:text-yellow-200">
                Security Reminder
              </span>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Always meet in public places and verify agent identity before proceeding.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleTransaction}
              disabled={!amount || parseFloat(amount) < 1 || isProcessing}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Initiate Cash-Out</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}