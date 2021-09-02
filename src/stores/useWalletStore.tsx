import create, { State } from 'zustand'
import produce from 'immer'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'

// @ts-ignore
import poolIdl from '../idls/ido_pool'

import {
  getOwnedTokenAccounts,
  getMint,
  ProgramAccount,
  TokenAccount,
  MintAccount,
  getTokenAccount,
} from '../utils/tokens'
import { findLargestBalanceAccountForMint } from '../hooks/useLargestAccounts'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { createAssociatedTokenAccount } from '../utils/associated'
import { sendTransaction } from '../utils/send'
import { calculateNativeAmountUnsafe } from '../utils/balance'
import { BN } from '@project-serum/anchor'
import { WalletAdapter } from '@parrotfi/wallets'
import { SOLANA_NETWORK } from '../config/constants'

export const ENDPOINTS: any[] = [
  {
    name: 'mainnet',
    url: 'https://parrot.rpcpool.com',
    programId: '6QXNNAPkPsWjd1j3qQJTvRFgSNPARMhF2tE8g1WeGyrM',
    pools: ['AHBj9LAjxStT2YQHN6QdfHKpZLtEVr8ACqeFgYcPsTnr'],
  },
  {
    name: 'devnet',
    url: 'https://api.devnet.solana.com',
    programId: '5s48HdiM1PjxqHDpGvZUVnX6eKbGbvN15rFHJ7RwxCv4',
    pools: [
      '3LF3P35APZEVBbmYRmRz83oaW5rKNRFqC62r863ujUeZ',
      '9Rjif7icpFwoKT35odhwH4jxxz1YmRjE8YBjM1u2bysH',
      '5vYiGgXRJs1HwkYZkgnWPKxjgDR9ypLREeFPgarXqV8L',
    ],
  },
  {
    name: 'localnet',
    url: 'http://localhost:8899',
    programId: 'FF8zcQ1aEmyXeBt99hohoyYprgpEVmWsRK44qta3emno',
    pools: ['8gswb9g1JdYEVj662KXr9p6p9SMgR77NryyqvWn9GPXJ'],
  },
]

const ENDPOINT = ENDPOINTS.find((e) => e.name === SOLANA_NETWORK)
const DEFAULT_CONNECTION = new Connection(ENDPOINT.url, 'recent')
const PROGRAM_ID = new PublicKey(ENDPOINT.programId)
const POOLS_PKS = ENDPOINT.pools.map((i) => new PublicKey(i))

export interface PoolAccount {
  publicKey: PublicKey
  distributionAuthority: PublicKey
  endDepositsTs: anchor.BN
  endIdoTs: anchor.BN
  withdrawMelonTs: anchor.BN
  nonce: number
  numIdoTokens: anchor.BN
  poolUsdc: PublicKey
  poolWatermelon: PublicKey
  redeemableMint: PublicKey
  startIdoTs: anchor.BN
  watermelonMint: PublicKey
}

interface WalletStore extends State {
  connected: boolean
  connection: {
    cluster: string
    current: Connection
    endpoint: string
    programId: PublicKey
  }
  current: WalletAdapter | undefined
  providerUrl: string
  provider: anchor.Provider | undefined
  program: anchor.Program | undefined
  pools: PoolAccount[]
  mangoVault: TokenAccount | undefined
  usdcVault: TokenAccount | undefined
  tokenAccounts: ProgramAccount<TokenAccount>[]
  mints: { [pubkey: string]: MintAccount }
  set: (x: any) => void
  actions: WalletStoreActions
}

interface WalletStoreActions {
  fetchPools: () => Promise<void>
  fetchWalletTokenAccounts: () => Promise<void>
  fetchMints: () => Promise<void>
  fetchUsdcVault: (pool: PoolAccount) => Promise<void>
  fetchPrtVault: (pool: PoolAccount) => Promise<void>
  fetchRedeemableMint: (pool: PoolAccount) => Promise<void>
  submitDepositContribution: (
    pool: PoolAccount,
    amount: number
  ) => Promise<void>
  submitWithdrawContribution: (
    pool: PoolAccount,
    amount: number
  ) => Promise<void>
  submitRedeem: (pool: PoolAccount) => Promise<void>
}

const useWalletStore = create<WalletStore>((set, get) => ({
  connected: false,
  connection: {
    cluster: SOLANA_NETWORK,
    current: DEFAULT_CONNECTION,
    endpoint: ENDPOINT.url,
    programId: PROGRAM_ID,
  },
  current: null,
  providerUrl: '',
  provider: undefined,
  program: undefined,
  pools: [],
  mangoVault: undefined,
  usdcVault: undefined,
  tokenAccounts: [],
  mints: {},
  actions: {
    async fetchPools() {
      const connection = get().connection.current
      const wallet = get().current
      const programId = get().connection.programId
      const set = get().set

      // console.log('fetchPool', connection, poolIdl)
      if (connection) {
        const provider = new anchor.Provider(
          connection,
          wallet,
          anchor.Provider.defaultOptions()
        )
        const program = new anchor.Program(poolIdl, programId, provider)
        console.log('pool', SOLANA_NETWORK)

        const pools: PoolAccount[] = []
        for await (const poolPk of POOLS_PKS) {
          const pool = (await program.account.poolAccount.fetch(
            poolPk
          )) as PoolAccount

          pool.publicKey = poolPk
          pools.push(pool)
        }

        // console.log('fetchPool', { program, pool, usdcVault, mangoVault })
        // const now = Date.now() / 1000;
        // pool.startIdoTs = new BN(now + 1000);
        // pool.endDepositsTs = new BN(now + 1500);
        // pool.endIdoTs = new BN(now + 2000);

        const [usdcVault, mangoVault] = await Promise.all([
          getTokenAccount(connection, pools[0].poolUsdc),
          getTokenAccount(connection, pools[0].poolWatermelon),
        ])

        set((state) => {
          state.provider = provider
          state.program = program
          state.pools = pools
          state.usdcVault = usdcVault.account
          state.mangoVault = mangoVault.account
        })
      }
    },
    async fetchWalletTokenAccounts() {
      const connection = get().connection.current
      const connected = get().connected
      const wallet = get().current
      const walletOwner = wallet?.publicKey
      const set = get().set

      console.log(
        'fetchWalletTokenAccounts',
        connected,
        walletOwner?.toString()
      )

      if (connected && walletOwner) {
        const ownedTokenAccounts = await getOwnedTokenAccounts(
          connection,
          walletOwner
        )

        set((state) => {
          state.tokenAccounts = ownedTokenAccounts
        })
      } else {
        set((state) => {
          state.tokenAccounts = []
        })
      }
    },
    async fetchUsdcVault(pool: PoolAccount) {
      const connection = get().connection.current
      const set = get().set

      if (!pool) return

      const { account: vault } = await getTokenAccount(
        connection,
        pool.poolUsdc
      )
      // console.log('fetchUsdcVault', vault)

      set((state) => {
        state.usdcVault = vault
      })
    },
    async fetchMints() {
      const connection = get().connection.current
      const mangoVault = get().mangoVault
      const usdcVault = get().usdcVault
      const pools = get().pools
      const set = get().set

      const mintKeys = [
        mangoVault.mint,
        usdcVault.mint,
        ...pools.map((i) => i.redeemableMint),
      ]
      const mints = await Promise.all(
        mintKeys.map((pk) => getMint(connection, pk))
      )
      // console.log('fetchMints', mints)

      set((state) => {
        for (const pa of mints) {
          state.mints[pa.publicKey.toBase58()] = pa.account
          // console.log('mint', pa.publicKey.toBase58(), pa.account)
        }
      })
    },
    async fetchPrtVault(pool: PoolAccount) {
      const connection = get().connection.current
      const set = get().set

      if (!pool) return

      const { account: vault } = await getTokenAccount(
        connection,
        pool.poolWatermelon
      )
      // console.log('fetchMNGOVault', vault)

      set((state) => {
        state.mangoVault = vault
      })
    },
    async fetchRedeemableMint(pool: PoolAccount) {
      const connection = get().connection.current
      const set = get().set

      const mintKeys = [pool.redeemableMint]
      const mints = await Promise.all(
        mintKeys.map((pk) => getMint(connection, pk))
      )
      // console.log('fetchMints', mints)

      set((state) => {
        for (const pa of mints) {
          state.mints[pa.publicKey.toBase58()] = pa.account
          // console.log('mint', pa.publicKey.toBase58(), pa.account)
        }
      })
    },
    async submitDepositContribution(pool: PoolAccount, amount: number) {
      const actions = get().actions
      await actions.fetchWalletTokenAccounts()
      const {
        program,
        provider,
        tokenAccounts,
        mints,
        usdcVault,
        current: wallet,
        connection: { current: connection },
      } = get()

      const usdc = findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        usdcVault.mint
      )

      const [poolSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [pool.watermelonMint.toBuffer()],
        program.programId
      )

      const depositAmount = calculateNativeAmountUnsafe(
        mints,
        usdcVault.mint,
        amount
      )
      console.log(
        'submitDepositContribution',
        amount,
        depositAmount.toString(),
        'exchangeUsdcForRedeemable'
      )

      const redeemableAcc = findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        pool.redeemableMint
      )
      let redeemableAccPk = redeemableAcc?.account?.publicKey
      const transaction = new Transaction()
      if (!redeemableAccPk) {
        const [ins, pk] = await createAssociatedTokenAccount(
          wallet.publicKey,
          wallet.publicKey,
          pool.redeemableMint
        )
        transaction.add(ins)
        redeemableAccPk = pk
      }
      transaction.add(
        program.instruction.exchangeUsdcForRedeemable(depositAmount, {
          accounts: {
            poolAccount: pool.publicKey,
            poolSigner: poolSigner,
            redeemableMint: pool.redeemableMint,
            poolUsdc: pool.poolUsdc,
            userAuthority: provider.wallet.publicKey,
            userUsdc: usdc.account.publicKey,
            userRedeemable: redeemableAccPk,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          },
        })
      )
      await sendTransaction({ transaction, wallet, connection })

      await actions.fetchWalletTokenAccounts()
      actions.fetchUsdcVault(pool)
    },
    async submitWithdrawContribution(pool: PoolAccount, amount: number) {
      const actions = get().actions
      await actions.fetchWalletTokenAccounts()

      const {
        program,
        provider,
        tokenAccounts,
        mints,
        usdcVault,
        current: wallet,
        connection: { current: connection },
      } = get()
      const redeemable = findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        pool.redeemableMint
      )
      const usdc = findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        usdcVault.mint
      )

      const [poolSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [pool.watermelonMint.toBuffer()],
        program.programId
      )

      const withdrawAmount = calculateNativeAmountUnsafe(
        mints,
        usdcVault.mint,
        amount
      )
      console.log(
        'submitDepositContribution',
        amount,
        withdrawAmount.toString(),
        'exchangeRedeemableForUsdc'
      )
      const transaction = new Transaction()
      transaction.add(
        program.instruction.exchangeRedeemableForUsdc(withdrawAmount, {
          accounts: {
            poolAccount: pool.publicKey,
            poolSigner: poolSigner,
            redeemableMint: pool.redeemableMint,
            poolUsdc: pool.poolUsdc,
            userAuthority: provider.wallet.publicKey,
            userUsdc: usdc.account.publicKey,
            userRedeemable: redeemable.account.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          },
        })
      )

      await sendTransaction({ transaction, wallet, connection })

      await actions.fetchWalletTokenAccounts()
      actions.fetchUsdcVault(pool)
    },
    async submitRedeem(pool: PoolAccount) {
      const actions = get().actions
      await actions.fetchWalletTokenAccounts()

      const {
        program,
        tokenAccounts,
        mints,
        current: wallet,
        connection: { current: connection },
      } = get()

      const redeemable = findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        pool.redeemableMint
      )
      const watermelon = findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        pool.watermelonMint
      )

      console.log('exchangeRedeemableForMango', redeemable, watermelon)

      const [poolSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [pool.watermelonMint.toBuffer()],
        program.programId
      )

      const transaction = new Transaction()

      let watermelonAccount = watermelon?.account?.publicKey
      if (!watermelonAccount) {
        const [ins, pk] = await createAssociatedTokenAccount(
          wallet.publicKey,
          wallet.publicKey,
          pool.watermelonMint
        )
        transaction.add(ins)
        watermelonAccount = pk
      }

      transaction.add(
        program.instruction.exchangeRedeemableForWatermelon(
          redeemable.account.account.amount,
          {
            accounts: {
              poolAccount: pool.publicKey,
              poolSigner,
              redeemableMint: pool.redeemableMint,
              poolWatermelon: pool.poolWatermelon,
              userAuthority: wallet.publicKey,
              userWatermelon: watermelonAccount,
              userRedeemable: redeemable.account.publicKey,
              tokenProgram: TOKEN_PROGRAM_ID,
              clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
            },
          }
        )
      )

      await sendTransaction({
        transaction,
        wallet,
        connection,
        sendingMessage: 'Sending redeem transaction...',
        successMessage: 'PRT redeemed successfully!',
      })

      await Promise.all([
        actions.fetchPools(),
        actions.fetchWalletTokenAccounts(),
      ])
    },
  },
  set: (fn) => set(produce(fn)),
}))

export default useWalletStore
