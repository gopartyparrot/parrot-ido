import React from 'react'
import 'twin.macro'
import useInterval from '../../hooks/useInterval'
import usePool from '../../hooks/usePool'
import useWalletStore, { PoolAccount } from '../../stores/useWalletStore'
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

  const { startIdo, endIdo, startRedeem, endDeposits } = usePool(pool)

  useInterval(async () => {
    // re-fetch pools once in a while
    await actions.fetchPools()
  }, 120_000)

  return (
    <CardOverlay
      title={`IDO Round ${round}`}
      endIdo={endIdo}
      startIdo={startIdo}
      startRedeem={startRedeem}
      endDeposits={endDeposits}
    >
      {startRedeem.isAfter() && <PoolContribCard pool={pool} />}
      {startRedeem.isBefore() && <PoolRedeemCard pool={pool} />}
      <StatsCard pool={pool} />
    </CardOverlay>
  )
}

export default PoolCard
