import { web3 } from '@project-serum/anchor'

import useWalletStore, { PoolAccount } from '../stores/useWalletStore'
import { calculateBalance } from '../utils/balance'
import { MintAccount, ProgramAccount, TokenAccount } from '../utils/tokens'

export function findLargestBalanceAccountForMint(
  mints: { [pk: string]: MintAccount },
  tokenAccounts: ProgramAccount<TokenAccount>[],
  mintPk: web3.PublicKey
) {
  const accounts = tokenAccounts.filter((a) => a.account.mint.equals(mintPk))

  if (!accounts.length) return undefined

  const balances = accounts.map((a) => calculateBalance(mints, a.account))
  const maxBalanceAccountIndex = balances.reduce(
    (iMax, bal, iBal) => (bal > balances[iMax] ? iBal : iMax),
    0
  )
  const account = accounts[maxBalanceAccountIndex]
  const balance = balances[maxBalanceAccountIndex]

  return { account, balance }
}

export default function useLargestAccounts(pool: PoolAccount) {
  const { tokenAccounts, mints, usdcMint } = useWalletStore((state) => state)

  const usdc = findLargestBalanceAccountForMint(mints, tokenAccounts, usdcMint)

  const redeemable = pool
    ? findLargestBalanceAccountForMint(
        mints,
        tokenAccounts,
        pool.redeemableMint
      )
    : undefined
  return { usdc, redeemable }
}
