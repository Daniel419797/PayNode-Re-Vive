'use client'
import React, { useState, useEffect } from 'react';
import { Vote, Plus, TrendingUp, Users, Coins, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Proposal } from '@/app/types';
import { CreateProposalModal } from '@/app/Components/Molecules/CreateProposalModal';
import { VoteModal } from '@/app/Components/Molecules/VoteModal';

const dao = () => {
  const { state, dispatch } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reviveProposals');
      return saved
        ? JSON.parse(saved).map((p: any) => ({
            ...p,
            endDate: new Date(p.endDate),
          }))
        : [];
    }
    return [];
  });



  // Save to localStorage when proposals change
  useEffect(() => {
    localStorage.setItem('reviveProposals', JSON.stringify(proposals));
  }, [proposals]);


  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    const updated = proposals.map((p: any) =>
      p.id === proposalId
        ? {
            ...p,
            votesFor: vote === 'for' ? p.votesFor + state.user.revTokens : p.votesFor,
            votesAgainst: vote === 'against' ? p.votesAgainst + state.user.revTokens : p.votesAgainst,
          }
        : p
    );
    setProposals(updated);
    setShowVoteModal(false);
    setSelectedProposal(null);
  };



  const treasuryStats = [
    { label: 'Total ADA', value: '1,250,000', icon: Coins, color: 'text-blue-600' },
    { label: 'Active Proposals', value: proposals.filter(p => p.status === 'active').length, icon: Vote, color: 'text-purple-600' },
    { label: 'Total Voters', value: '3,247', icon: Users, color: 'text-green-600' },
    { label: 'Projects Funded', value: '23', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">DAO Governance</h1>
            <p className="text-purple-100">
              Shape the future of PayMint Re:Vive through decentralized governance
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Proposal</span>
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Coins className="w-5 h-5" />
            <span className="font-medium">Your Voting Power</span>
          </div>
          <div className="text-2xl font-bold">{state.user?.revTokens || 0} ReV</div>
          <div className="text-sm text-purple-100">
            Earn more ReV tokens by recycling NFTs and participating in governance
          </div>
        </div>
      </div>

      {/* Treasury Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {treasuryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Proposals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active Proposals
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Vote on proposals to guide the platform's development
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {proposals.filter(p => p.status === 'active').map((proposal) => {
            const totalVotes = proposal.votesFor + proposal.votesAgainst;
            const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
            
            return (
              <div key={proposal.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {proposal.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        proposal.category === 'funding' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : proposal.category === 'governance'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {proposal.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {proposal.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <span>Proposed by {proposal.proposer}</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Ends {proposal.endDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedProposal(proposal.id);
                      setShowVoteModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Vote
                  </button>
                </div>

                {/* Voting Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Voting Progress</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {totalVotes.toLocaleString()} votes
                    </span>
                  </div>
                  
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
            );
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            How DAO Governance Works
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Coins className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Earn ReV Tokens
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recycle NFTs, refer friends, and participate in the ecosystem to earn ReV tokens
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Vote className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Vote on Proposals
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use your ReV tokens to vote on funding proposals and governance decisions
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Shape the Future
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Help decide which projects get funded and how the platform evolves
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProposalModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(newProposal) => {
            setProposals([...proposals, newProposal]);
            setShowCreateModal(false);
          }}
        />

      )}
      
      {showVoteModal && selectedProposal && (
        <VoteModal 
          proposal={proposals.find(p => p.id === selectedProposal)!}
          onVote={handleVote}
          onClose={() => setShowVoteModal(false)}
        />
      )}
    </div>
  );
}
export default dao