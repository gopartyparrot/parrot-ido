import { web3 } from '@project-serum/anchor';

export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL;
export const SOLANA_NETWORK: web3.Cluster =
  (process.env.NEXT_PUBLIC_NETWORK as web3.Cluster) || 'devnet';
export const SOLANA_COMMITMENT: web3.Commitment = 'processed';
export const VERSION = process.env.NEXT_PUBLIC_VERSION;
export const CHANNEL = process.env.NEXT_PUBLIC_CHANNEL;
export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com';

export const TOKEN_COIN_DISPLAY_DECIMALS = 4;
export const TOKEN_STABLE_DISPLAY_DECIMALS = 2;
export const NUMBER_DISPLAY_DECIMALS = 2;
