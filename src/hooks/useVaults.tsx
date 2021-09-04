import { AccountInfo, TokenAmount } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { notify } from '../stores/useNotificationStore'
import useWalletStore, { PoolAccount } from '../stores/useWalletStore'
import { calculateBalance, calculateSupply } from '../utils/balance'
import { TokenAccount } from '../utils/tokens'
import useInterval from './useInterval'
import usePool from './usePool'

export default function useVaults(pool: PoolAccount) {
  const { mints, actions } = useWalletStore((s) => s)
  const { endIdo } = usePool(pool)
  const [usdcVault, setUsdcVault] = useState<TokenAccount | undefined>()
  const [prtVault, setPrtVault] = useState<TokenAccount | undefined>()

  const fetchVaults = useCallback(async () => {
    const { usdc, watermelon } = await actions.fetchVaults(pool)
    setUsdcVault(usdc)
    setPrtVault(watermelon)
  }, [actions, endIdo, setUsdcVault, setPrtVault])

  useEffect(() => {
    fetchVaults().catch((e) => {
      notify({
        type: 'warn',
        title: 'Update vaults failed',
        message: e.message,
      })
    })
  }, [])

  // refresh usdc vault regularly
  useInterval(async () => {
    await fetchVaults()
    await actions.fetchRedeemableMint(pool)
  }, 10_000)

  const usdcBalance = useMemo(
    () => calculateBalance(mints, usdcVault),
    [mints, usdcVault]
  )
  const prtBalance = useMemo(
    () => calculateBalance(mints, prtVault),
    [mints, prtVault]
  )

  const estimatedPrice = useMemo(
    () =>
      usdcBalance && prtBalance
        ? new BigNumber(usdcBalance).dividedBy(prtBalance)
        : undefined,
    [usdcBalance, prtBalance]
  )

  return { usdcBalance, prtBalance, estimatedPrice }
}
