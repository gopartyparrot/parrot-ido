import { WalletAdapter, WalletEndpoint } from '@parrotfi/wallets'
import * as anchor from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import produce from 'immer'
import uniqBy from 'lodash/uniqBy'
import create, { SetState, State } from 'zustand'
import { IDO_ENDPOINT } from '../config/constants'
import { findLargestBalanceAccountForMint } from '../hooks/useLargestAccounts'
import poolIdl from '../idls/ido_pool.json'
import { createAssociatedTokenAccount } from '../utils/associated'
import { calculateNativeAmountUnsafe } from '../utils/balance'
import { sendTransaction } from '../utils/send'
import {
  getMint,
  getOwnedTokenAccounts,
  MintAccount,
  parseTokenAccount,
  ProgramAccount,
  TokenAccount,
} from '../utils/tokens'

export interface PoolAccount {
  publicKey: PublicKey
  distributionAuthority: PublicKey
  startIdoTs: anchor.BN
  endDepositsTs: anchor.BN
  endIdoTs: anchor.BN
  withdrawMelonTs: anchor.BN
  nonce: number
  numIdoTokens: anchor.BN
  poolUsdc: PublicKey
  poolWatermelon: PublicKey
  watermelonMint: PublicKey
  redeemableMint: PublicKey
}

interface WalletStore extends State {
  connected: boolean
  programId: PublicKey
  usdcMint: PublicKey
  wallet: WalletAdapter | undefined
  connection: Connection
  provider: anchor.Provider | undefined
  program: anchor.Program | undefined
  pools: PoolAccount[]
  tokenAccounts: ProgramAccount<TokenAccount>[]
  mints: { [pubkey: string]: MintAccount }
  set: SetState<WalletStore>
  actions: WalletStoreActions
}

interface WalletStoreActions {
  connectRpc: (endpoint: WalletEndpoint) => void
  fetchPools: () => Promise<void>
  fetchWalletTokenAccounts: () => Promise<void>
  fetchMints: () => Promise<void>
  fetchVaults: (
    pool: PoolAccount
  ) => Promise<{ usdc: TokenAccount; watermelon: TokenAccount }>
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
  programId: new PublicKey(IDO_ENDPOINT.programId),
  usdcMint: new PublicKey(IDO_ENDPOINT.usdcMint),
  wallet: null,
  connection: null,
  provider: undefined,
  program: undefined,
  pools: [],
  tokenAccounts: [],
  mints: {},
  actions: {
    connectRpc(endpoint: WalletEndpoint) {
      set((state) => {
        state.connection = new Connection(endpoint.rpcURL, {
          commitment: endpoint.commitment,
        })
      })
    },
    async fetchPools() {
      const { wallet, connection, programId, set } = get()

      const provider = new anchor.Provider(
        connection,
        wallet,
        anchor.Provider.defaultOptions()
      )
      const program = new anchor.Program(
        poolIdl as anchor.Idl,
        programId,
        provider
      )

      const pools: PoolAccount[] = []
      for await (const poolAddress of IDO_ENDPOINT.pools) {
        const poolPk = new anchor.web3.PublicKey(poolAddress)
        const pool = (await program.account.poolAccount.fetch(
          poolPk
        )) as PoolAccount
        pool.publicKey = poolPk
        pools.push(pool)
      }

      set((state) => {
        state.provider = provider
        state.program = program
        state.pools = pools
      })
    },
    async fetchMints() {
      const { connection, usdcMint, pools, set } = get()
      const mintKeys = [
        usdcMint,
        ...pools.map((i) => i.watermelonMint),
        ...pools.map((i) => i.redeemableMint),
      ]
      const mints = await Promise.all(
        uniqBy(mintKeys, (i) => i.toBase58()).map((pk) =>
          getMint(connection, pk)
        )
      )
      set((state) => {
        for (const mint of mints) {
          state.mints[mint.publicKey.toBase58()] = mint.account
        }
      })
    },
    async fetchWalletTokenAccounts() {
      const { connection, connected, wallet, set } = get()
      const walletOwner = wallet?.publicKey

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
    async fetchVaults(pool: PoolAccount) {
      const { connection } = get()
      const [accountUsdc, accountWatermelon] =
        await connection.getMultipleAccountsInfo([
          pool.poolUsdc,
          pool.poolWatermelon,
        ])

      const usdc = parseTokenAccount(pool.poolUsdc, accountUsdc)
      const watermelon = parseTokenAccount(
        pool.poolWatermelon,
        accountWatermelon
      )
      return { usdc: usdc.account, watermelon: watermelon.account }
    },
    async fetchRedeemableMint(pool: PoolAccount) {
      const connection = get().connection
      const set = get().set

      const mintKeys = [pool.redeemableMint]
      const mints = await Promise.all(
        mintKeys.map((pk) => getMint(connection, pk))
      )

      set((state) => {
        for (const mint of mints) {
          state.mints[mint.publicKey.toBase58()] = mint.account
          // console.log('mint', pa.publicKey.toBase58(), pa.account)
        }
      })
    },
    async submitDepositContribution(pool: PoolAccount, amount: number) {
      const {
        actions,
        usdcMint,
        program,
        provider,
        tokenAccounts,
        mints,
        wallet,
        connection,
      } = get()

      await actions.fetchWalletTokenAccounts()
      const usdc = findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        usdcMint
      )

      const [poolSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [pool.watermelonMint.toBuffer()],
        program.programId
      )

      const depositAmount = calculateNativeAmountUnsafe(mints, usdcMint, amount)
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
    },
    async submitWithdrawContribution(pool: PoolAccount, amount: number) {
      const {
        actions,
        program,
        provider,
        tokenAccounts,
        mints,
        wallet,
        usdcMint,
        connection,
      } = get()

      await actions.fetchWalletTokenAccounts()
      const redeemable = findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        pool.redeemableMint
      )
      const usdc = findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        usdcMint
      )

      const [poolSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [pool.watermelonMint.toBuffer()],
        program.programId
      )

      const withdrawAmount = calculateNativeAmountUnsafe(
        mints,
        usdcMint,
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
    },
    async submitRedeem(pool: PoolAccount) {
      const { actions, program, tokenAccounts, mints, wallet, connection } =
        get()

      await actions.fetchWalletTokenAccounts()

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

      await actions.fetchWalletTokenAccounts()
    },
  },
  set: (fn: (s: WalletStore) => WalletStore) => set(produce(fn)),
}))

export default useWalletStore
