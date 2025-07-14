import React, { useState } from 'react';
import { X, CheckCircle, XCircle, Vote } from 'lucide-react';
import { Proposal } from '@/app/types';
import { useApp } from '@/app/contexts/AppContext';

interface VoteModalProps {
  proposal: Proposal;
  onVote: (proposalId: string, vote: 'for' | 'against') => void;
  onClose: () => void;
}

export function VoteModal({ proposal, onVote, onClose }: VoteModalProps) {
  const { state } = useApp();
  const [selectedVote, setSelectedVote] = useState<'for' | 'against' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    if (!selectedVote) return;
    
    setIsVoting(true);
    
    // Simulate voting
    setTimeout(() => {
      onVote(proposal.id, selectedVote);
      setIsVoting(false);
    }, 1500);
  };

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Vote on Proposal
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Proposal Info */}
          <div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {proposal.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {proposal.description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Proposed by {proposal.proposer}</span>
              <span>Ends {proposal.endDate.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Current Results */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-white mb-3">Current Results</h5>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Total Votes</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {totalVotes.toLocaleString()}
                </span>
              </div>
              
              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${forPercentage}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    For: {proposal.votesFor.toLocaleString()} ({forPercentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Against: {proposal.votesAgainst.toLocaleString()} ({(100 - forPercentage).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Power */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-purple-900 dark:text-purple-200">
                Your Voting Power
              </span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {state.user?.revTokens || 0} ReV
              </span>
            </div>
          </div>

          {/* Vote Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Cast Your Vote
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedVote('for')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedVote === 'for'
                    ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="font-semibold text-green-700 dark:text-green-300">Vote For</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Support this proposal
                </p>
              </button>

              <button
                onClick={() => setSelectedVote('against')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedVote === 'against'
                    ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
                }`}
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Vote Against</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Oppose this proposal
                </p>
              </button>
            </div>
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
              onClick={handleVote}
              disabled={!selectedVote || isVoting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {isVoting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Vote className="w-4 h-4" />
                  <span>Cast Vote</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}