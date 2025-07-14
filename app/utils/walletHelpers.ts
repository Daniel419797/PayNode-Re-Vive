import { WalletConnection } from '../types';

export function createConnectedWallet(
  address: string,
  walletType: 'nami' | 'eternl' | 'lace',
  balance: number = 0,
  revBalance: number = 0
): WalletConnection {
  return {
    connected: true,
    address,
    balance,
    revBalance,
    walletType,
  };
}
