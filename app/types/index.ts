export type WalletConnection =
| {
  connected: false;
  address: null;
  balance?: number;
  revBalance?: number;
  walletName?: undefined;
  // walletType?: 'nami' | 'eternl' | 'lace';
}
| {
  connected: true;
  address: string;
  balance?: number;
  revBalance?: number;
  walletName?: string;
  // walletType?: 'nami' | 'eternl' | 'lace';
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'utility' | 'recycling';
  amount: number;
  currency: 'ADA' | 'NGN';
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  description?: string;
}

// @/app/types.ts
export interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  recycleValue: string;
  policyId?: string;
  assetName?: string;
  attributes?: Record<string, string>;
  rarity?: 'common' | 'rare' | 'legendary'; // Added for display
}

// export interface DAOProposal {
//   id: string;
//   title: string;
//   description: string;
//   proposer: string;
//   votesFor: number;
//   votesAgainst: number;
//   status: 'active' | 'passed' | 'rejected';
//   endDate: Date;
//   category: 'funding' | 'governance' | 'technical';
// }

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: 'funding' | 'governance' | 'other';
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  status: 'active' | 'closed';
  endDate: Date;
}


export interface User {
  id: string;
  username: string;
  walletAddress?: string;
  revTokens: number;
  recycledCount: number;
  referralCount: number;
  rank: number;
}

export interface Agent {
  id: string;
  name: string;
  location: string;
  rating: number;
  cashAvailable: number;
  exchangeRate: number;
}