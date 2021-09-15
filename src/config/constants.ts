import { WalletEndpoint } from '@parrotfi/wallets'
import { web3 } from '@project-serum/anchor'
import moment from 'moment'

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK
export const VERSION = process.env.NEXT_PUBLIC_VERSION

/**
 * Used after IDO finished, need to set it before withdraw found
 */
export const IDO_TOTAL_RAISED = process.env.NEXT_PUBLIC_IDO_RAISED || 0

/**
 * Used for lending page countdown
 */
export const IDO_STARTS = moment(process.env.NEXT_PUBLIC_IDO_START)

export const RPC_ENDPOINTS: WalletEndpoint[] = [
  {
    id: 'parrot2',
    network: 'mainnet-beta' as web3.Cluster,
    rpcURL: 'https://lokidfxnwlabdq.main.genesysgo.net:8899/',
    rpcName: 'GenesysGo RPC',
    commitment: 'processed' as web3.Commitment,
  },
  {
    id: 'parrot',
    network: 'mainnet-beta' as web3.Cluster,
    rpcURL: 'https://parrot.rpcpool.com',
    rpcName: 'Triton RPC',
    commitment: 'processed' as web3.Commitment,
  },
  {
    id: 'serum',
    network: 'mainnet-beta' as web3.Cluster,
    rpcURL: 'https://solana-api.projectserum.com',
    rpcName: 'Serum RPC',
    commitment: 'processed' as web3.Commitment,
  },
  {
    id: 'custom',
    network: 'mainnet-beta' as web3.Cluster,
    rpcURL: '',
    rpcName: 'Custom RPC',
    commitment: 'processed' as web3.Commitment,
  },
  // {
  //   id: 'devnet',
  //   network: 'devnet' as web3.Cluster,
  //   rpcURL: 'https://api.devnet.solana.com',
  //   rpcName: 'Solana Devnet',
  //   commitment: 'processed' as web3.Commitment,
  // },
]

export const IDO_ENDPOINTS = [
  {
    network: 'mainnet-beta' as web3.Cluster,
    programId: '7r2chJLUU87eaM7T1aBi6f7g9BbtbgnwQ9kPbMGxJQWV',
    usdcMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    pools: [
      '5JGWQPf6zLhuxL4bXa8aWKPxakqVJMWbMf9TBaVWfpXD', //Round 1
      '9U8xzksWyGkKCAdf4yS49VftTKXk5sSurJn8xF1hcdqd', //Round 2
    ],
  },
  {
    network: 'devnet' as web3.Cluster,
    programId: '5s48HdiM1PjxqHDpGvZUVnX6eKbGbvN15rFHJ7RwxCv4',
    usdcMint: 'G1Z261S3B2XQWCZo1qXJkEbeqkrcY1mVW3B3vMj5uqRq',
    pools: [
      '3ah8jT2jkHb3vhKGSxNK4Dm1XDY842vmJaTG8YaFtdyB',
      '4qkLCR7JrkLCqfJ8iPKTBHGSsqvbY2EjVNeHx9iTdDSR',
    ],
  },
]

export const DEFAULT_RPC = RPC_ENDPOINTS.find((i) => i.id === 'parrot2')
