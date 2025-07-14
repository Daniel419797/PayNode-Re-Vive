import { Transaction, NFT, DAOProposal, Agent } from '@/app/types';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: 150,
    currency: 'ADA',
    timestamp: new Date('2024-01-15'),
    status: 'completed',
    description: 'Received from friend',
  },
  {
    id: '2',
    type: 'send',
    amount: 50,
    currency: 'ADA',
    timestamp: new Date('2024-01-14'),
    status: 'completed',
    recipient: 'addr1q9x...abc123',
    description: 'Payment to merchant',
  },
  {
    id: '3',
    type: 'utility',
    amount: 2500,
    currency: 'NGN',
    timestamp: new Date('2024-01-13'),
    status: 'completed',
    description: 'MTN Airtime Purchase',
  },
  {
    id: '4',
    type: 'recycling',
    amount: 25,
    currency: 'ADA',
    timestamp: new Date('2024-01-12'),
    status: 'completed',
    description: 'NFT Recycling Reward',
  },
];

export const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Cardano Ape #123',
    image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=400',
    collection: 'Cardano Apes',
    rarity: 'common',
    recycleValue: 5,
  },
  {
    id: '2',
    name: 'Space Cat #456',
    image: 'https://images.pexels.com/photos/2194261/pexels-photo-2194261.jpeg?auto=compress&cs=tinysrgb&w=400',
    collection: 'Space Cats',
    rarity: 'rare',
    recycleValue: 15,
  },
  {
    id: '3',
    name: 'Digital Punk #789',
    image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=400',
    collection: 'Digital Punks',
    rarity: 'legendary',
    recycleValue: 50,
  },
];

export const mockProposals: DAOProposal[] = [
  {
    id: '1',
    title: 'Fund New Recycling Initiative',
    description: 'Proposal to allocate 10,000 ADA for developing advanced NFT recycling algorithms',
    proposer: 'alice.ada',
    votesFor: 2450,
    votesAgainst: 150,
    status: 'active',
    endDate: new Date('2024-02-01'),
    category: 'funding',
  },
  {
    id: '2',
    title: 'Governance Token Economics Update',
    description: 'Modify ReV token distribution to reward long-term holders',
    proposer: 'bob.cardano',
    votesFor: 1800,
    votesAgainst: 300,
    status: 'active',
    endDate: new Date('2024-01-25'),
    category: 'governance',
  },
];

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Lagos Central Agent',
    location: 'Victoria Island, Lagos',
    rating: 4.8,
    cashAvailable: 500000,
    exchangeRate: 850,
  },
  {
    id: '2',
    name: 'Abuja Main Agent',
    location: 'Wuse 2, Abuja',
    rating: 4.9,
    cashAvailable: 750000,
    exchangeRate: 845,
  },
];