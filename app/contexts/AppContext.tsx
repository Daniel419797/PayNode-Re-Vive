'use client';
import type { NFT, Proposal, User, Transaction } from '@/app/types/index';
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useWallet } from '@meshsdk/react';
import { IWallet, Asset } from '@meshsdk/core';

// Define types (assumed from ../types)
interface WalletConnection {
  connected: boolean;
  address: string | null;
  balance: number; // Balance in ADA
  revBalance: number; // ReV token balance
  walletName?: string; // Optional wallet name
}

// interface Transaction {
//   id: string;
//   // Add other transaction fields as needed
// }

// interface NFT {
//   id: string;
//   // Add other NFT fields as needed
// }

// interface DAOProposal {
//   id: string;
//   votesFor: number;
//   votesAgainst: number;
//   // Add other proposal fields as needed
// }

// interface User {
//   revTokens?: number;
//   recycledCount?: number;
//   // Add other user fields as needed
// }

interface AppState {
  wallet: WalletConnection;
  user: User | null;
  transactions: Transaction[];
  nfts: NFT[];
  proposals: Proposal[];
  darkMode: boolean;
}

type AppAction =
  | { type: 'CONNECT_WALLET'; payload: WalletConnection }
  | { type: 'DISCONNECT_WALLET' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'RECYCLE_NFT'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'VOTE_PROPOSAL'; payload: { proposalId: string; vote: 'for' | 'against' } };

const initialState: AppState = {
  wallet: {
    connected: false,
    address: null,
    balance: 0,
    revBalance: 0,
  },
  user: null,
  transactions: [],
  nfts: [],
  proposals: [],
  darkMode: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CONNECT_WALLET': {
      const { address, balance = 0, revBalance = 0, walletName } = action.payload;

      if (!address) {
        return {
          ...state,
          wallet: {
            connected: false,
            address: null,
            balance: 0,
            revBalance: 0,
          },
        };
      }

      return {
        ...state,
        wallet: {
          connected: true,
          address,
          balance,
          revBalance,
          walletName,
        },
      };
    }
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        wallet: {
          connected: false,
          address: null,
          balance: 0,
          revBalance: 0,
        },
        user: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'RECYCLE_NFT':
      return {
        ...state,
        nfts: state.nfts.filter(nft => nft.id !== action.payload),
        user: state.user
          ? {
              ...state.user,
              revTokens: (state.user.revTokens ?? 0) + 10,
              recycledCount: (state.user.recycledCount ?? 0) + 1,
            }
          : null,
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case 'VOTE_PROPOSAL':
      return {
        ...state,
        proposals: state.proposals.map(proposal =>
          proposal.id === action.payload.proposalId
            ? {
                ...proposal,
                votesFor:
                  action.payload.vote === 'for'
                    ? proposal.votesFor + 1
                    : proposal.votesFor,
                votesAgainst:
                  action.payload.vote === 'against'
                    ? proposal.votesAgainst + 1
                    : proposal.votesAgainst,
              }
            : proposal
        ),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { connected, wallet, name: walletName } = useWallet();

  useEffect(() => {
    const syncWallet = async () => {
      if (connected && wallet) {
        try {
          // Get the change address
          const address = await wallet.getChangeAddress();

          // Get balance (returns an array of assets)
          const balanceAssets = await wallet.getBalance();

          // Extract ADA balance (in lovelace) from assets
          const adaAsset = balanceAssets.find(
            (asset: Asset) => asset.unit === 'lovelace'
          );
          const balanceLovelace = adaAsset ? parseInt(adaAsset.quantity) : 0;
          const balance = balanceLovelace / 1_000_000; // Convert to ADA

          // Optional: Fetch ReV token balance (replace with actual policy ID)
          const revAsset = balanceAssets.find(
            (asset: Asset) => asset.unit === 'your_rev_token_policy_id'
          );
          const revBalance = revAsset ? parseInt(revAsset.quantity) : 0;

          dispatch({
            type: 'CONNECT_WALLET',
            payload: {
              connected: true,
              address,
              balance,
              revBalance,
              walletName,
            },
          });
        } catch (error) {
          console.error('Error syncing wallet:', error);
          dispatch({ type: 'DISCONNECT_WALLET' });
        }
      } else {
        dispatch({ type: 'DISCONNECT_WALLET' });
      }
    };

    syncWallet();
  }, [connected, wallet, walletName]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}