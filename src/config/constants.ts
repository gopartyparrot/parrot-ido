import { WalletEndpoint } from '@parrotfi/wallets'
import { web3 } from '@project-serum/anchor'

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK
export const VERSION = process.env.NEXT_PUBLIC_VERSION

export const RPC_ENDPOINTS: WalletEndpoint[] = [
  {
    id: 'parrot',
    network: 'mainnet-beta' as web3.Cluster,
    rpcURL: 'https://parrot.rpcpool.com',
    rpcName: 'Parrot RPC',
    commitment: 'processed' as web3.Commitment,
  },
  {
    id: 'solana',
    network: 'mainnet-beta' as web3.Cluster,
    rpcURL: 'https://api.mainnet-beta.solana.com',
    rpcName: 'Solana RPC',
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
      'FoBi5bfmuPHDoi74UANBG34Hg8uamv6exVHG9vwEkK6D',
      '5r9Wk4cwCR2caJiB9E76XpcXsjQuFYJK71N3nwZJhVUH',
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

export const DEFAULT_RPC = RPC_ENDPOINTS.find((i) => i.network === NETWORK)
