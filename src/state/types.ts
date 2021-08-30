import { web3 } from '@project-serum/anchor';

export interface Transaction {
  type: 'mint' | 'repay' | 'stake_deposit' | 'stake_withdraw';
  txId: string;
  network: web3.Cluster;
  owner: string;
}

// States
export interface TransactionState {
  lastUpdated?: number;
  transactions: Transaction[];
}

// Global state
export interface AppState {
  transaction: TransactionState;
}
