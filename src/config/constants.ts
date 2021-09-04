import { web3 } from '@project-serum/anchor'
import { WalletEndpoint } from '../../../parrot-wallets/lib/esm'

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK
export const VERSION = process.env.NEXT_PUBLIC_VERSION

export const RPC_ENDPOINTS: WalletEndpoint[] = [
  {
    id: 'parrot',
    network: 'mainnet-beta' as web3.Cluster,
    rpcURL: 'https://parrot.rpcpool.com',
    rpcName: 'Parrot',
    commitment: 'processed' as web3.Commitment,
  },
  {
    id: 'solana',
    network: 'mainnet-beta' as web3.Cluster,
    rpcURL: 'https://api.mainnet-beta.solana.com',
    rpcName: 'Solana',
    commitment: 'processed' as web3.Commitment,
  },
  {
    id: 'serum',
    network: 'mainnet-beta' as web3.Cluster,
    rpcURL: 'https://solana-api.projectserum.com/',
    rpcName: 'Project Serum',
    commitment: 'processed' as web3.Commitment,
  },
  {
    id: 'devnet',
    network: 'devnet' as web3.Cluster,
    rpcURL: 'http://api.devnet.solana.com',
    rpcName: 'Solana Devnet',
    commitment: 'processed' as web3.Commitment,
  },
]

export const IDO_ENDPOINTS = [
  {
    network: 'mainnet-beta' as web3.Cluster,
    programId: 'xxx',
    usdcMint: 'xxx',
    pools: ['AHBj9LAjxStT2YQHN6QdfHKpZLtEVr8ACqeFgYcPsTnr'],
  },
  {
    network: 'devnet' as web3.Cluster,
    programId: '5s48HdiM1PjxqHDpGvZUVnX6eKbGbvN15rFHJ7RwxCv4',
    usdcMint: 'G1Z261S3B2XQWCZo1qXJkEbeqkrcY1mVW3B3vMj5uqRq',
    pools: [
      '7px9N7ZouesntaHbfsCTYZh3x9HM83adbYWujYGsZfbu',
      '9kMaNLhDyx34jzpneMu2PCKxKd6JwSTfVeQLnmXqXJih',
    ],
  },
]

export const RPC_ENDPOINT = RPC_ENDPOINTS.find((i) => i.network === NETWORK)
export const IDO_ENDPOINT = IDO_ENDPOINTS.find((i) => i.network === NETWORK)
