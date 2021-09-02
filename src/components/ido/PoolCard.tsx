import React, { useCallback, useEffect, useState } from 'react'
import 'twin.macro'
import useInterval from '../../hooks/useInterval'
import useIpAddress from '../../hooks/useIpAddress'
import useLargestAccounts from '../../hooks/useLargestAccounts'
import usePool from '../../hooks/usePool'
import { notify } from '../../stores/useNotificationStore'
import useWalletStore, { PoolAccount } from '../../stores/useWalletStore'
import { Button } from '../button'
import { AmountInput } from '../input/AmountInput'
import Loading from '../Loading'
import { ButtonMenu, ButtonMenuItem } from '../menu'
import CardOverlay from './CardOverlay'
import PoolContribCard from './PoolContribCard'
import PoolRedeemCard from './PoolRedeemCard'
import StatsCard from './StatsCard'

interface PoolCardProps {
  pool: PoolAccount
  round?: string
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, round }) => {
  const actions = useWalletStore((s) => s.actions)

  const { startIdo, endIdo, withdrawIdo, endDeposits } = usePool(pool)

  // refresh usdc vault regularly
  useInterval(async () => {
    if (endIdo.isAfter()) {
      // await actions.fetchUsdcVault(pool)
    } else {
      // await actions.fetchPrtVault(pool)
      await actions.fetchRedeemableMint(pool)
    }
  }, 10_000)

  useInterval(async () => {
    // re-fetch pools once in a while
    await actions.fetchPools()
  }, 120_000)

  return (
    <CardOverlay
      title={`IDO Round ${round}`}
      endIdo={endIdo}
      startIdo={startIdo}
      endDeposits={endDeposits}
    >
      {withdrawIdo.isAfter() && <PoolContribCard pool={pool} />}
      {withdrawIdo.isBefore() && <PoolRedeemCard pool={pool} />}
      <StatsCard pool={pool} />
    </CardOverlay>
  )
}

export default PoolCard
