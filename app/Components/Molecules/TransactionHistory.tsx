import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Recycle, 
  Smartphone,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Transaction } from '@/app/types';
import { useApp } from '@/app/contexts/AppContext';

export function TransactionHistory() {
  const { state } = useApp();

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'receive':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'recycling':
        return <Recycle className="w-5 h-5 text-purple-500" />;
      case 'utility':
        return <Smartphone className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const formatAmount = (amount: number, currency: string, type: Transaction['type']) => {
    const sign = type === 'send' ? '-' : '+';
    const color = type === 'send' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
    
    return (
      <span className={`font-semibold ${color}`}>
        {sign}{amount.toLocaleString()} {currency}
      </span>
    );
  };

  if (!state.wallet.connected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Connect Wallet to View History
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Your transaction history will appear here once you connect your wallet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Transaction History
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Recent wallet activity and transactions
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {state.transactions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No transactions yet
            </h4>
            <p className="text-gray-500 dark:text-gray-400">
              Your transactions will appear here as you use the wallet
            </p>
          </div>
        ) : (
          state.transactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {transaction.description || `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Transaction`}
                      </p>
                      {getStatusIcon(transaction.status)}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.timestamp.toLocaleDateString()} {transaction.timestamp.toLocaleTimeString()}
                      </p>
                      {transaction.recipient && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          to {transaction.recipient.slice(0, 8)}...{transaction.recipient.slice(-6)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {formatAmount(transaction.amount, transaction.currency, transaction.type)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}