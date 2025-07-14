'use client'
import React, { useState } from 'react';
import { MapPin, Star, Banknote, Clock, Shield, Phone } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';
import { mockAgents } from '@/app/services/mockData';
import { AgentTransactionModal } from '@/app/Components/Molecules/AgentTransactionModal';

export function Agents() {
  const { state } = useApp();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    setShowTransactionModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Cash-Out Agents</h1>
            <p className="text-purple-100">Convert your ADA to cash through verified local agents</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Secure Transactions</span>
          </div>
          <p className="text-sm text-purple-100">
            All transactions are secured by smart contracts. Funds are held in escrow until confirmed.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            How Agent Cash-Out Works
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Select Agent
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose a nearby agent with good ratings and available cash
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Lock ADA
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your ADA is locked in a smart contract for security
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Meet Agent
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Meet the agent at the agreed location to receive cash
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-orange-600 dark:text-orange-400">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Transaction
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Agent confirms the transaction and ADA is released
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Agents */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Agents
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Verified agents ready to provide cash-out services
          </p>
        </div>

        <div className="p-6">
          {!state.wallet.connected ? (
            <div className="text-center py-12">
              <Banknote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Connect Your Wallet
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                Connect your Cardano wallet to view available agents
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockAgents.map((agent) => (
                <div key={agent.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {agent.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{agent.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {agent.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Exchange Rate</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₦{agent.exchangeRate}/ADA
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Available Cash</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₦{agent.cashAvailable.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Response Time</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 dark:text-green-400">Usually within 30 min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAgentSelect(agent.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Select Agent
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            Safety Tips
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700 dark:text-yellow-300">
          <div className="space-y-2">
            <p>• Always meet agents in public, well-lit locations</p>
            <p>• Verify agent identity before proceeding</p>
            <p>• Never share your wallet private keys</p>
          </div>
          <div className="space-y-2">
            <p>• Check exchange rates before confirming</p>
            <p>• Keep transaction receipts for records</p>
            <p>• Report any suspicious activity immediately</p>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && selectedAgent && (
        <AgentTransactionModal 
          agent={mockAgents.find(a => a.id === selectedAgent)!}
          onClose={() => setShowTransactionModal(false)}
        />
      )}
    </div>
  );
}