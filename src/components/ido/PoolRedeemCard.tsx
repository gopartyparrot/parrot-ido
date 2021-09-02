import React, { useEffect, useState } from 'react'
import useWalletStore, { PoolAccount } from '../../stores/useWalletStore'
import { Button } from '../button'
import Loading from '../Loading'
import useLargestAccounts from '../../hooks/useLargestAccounts'
import useVaults from '../../hooks/useVaults'
import { calculateSupply } from '../../utils/balance'
import { AmountInput } from '../input/AmountInput'
import CardOverlay from './CardOverlay'

interface PoolRedeemCardProps {
  pool: PoolAccount
  round?: string
}

const PoolRedeemCard = ({ pool }) => {
  const actions = useWalletStore((s) => s.actions)
  const connected = useWalletStore((s) => s.connected)
  const mints = useWalletStore((s) => s.mints)
  const largestAccounts = useLargestAccounts(pool)
  const vaults = useVaults()

  const numberFormat = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const totalRaised = 70462383.600012
  const redeemableBalance = largestAccounts.redeemable?.balance || 0
  const redeemableSupply = calculateSupply(mints, pool.redeemableMint)
  const mangoAvailable =
    vaults.mango && redeemableSupply
      ? (redeemableBalance * vaults.mango.balance) / redeemableSupply
      : 0

  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleRedeem = () => {
    setSubmitting(true)
  }

  useEffect(() => {
    if (pool.redeemableMint) {
      actions.fetchMints()
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    if (largestAccounts.redeemable) {
      setLoading(false)
    }
  }, [largestAccounts])

  useEffect(() => {
    if (submitting) {
      const handleSubmit = async () => {
        await actions.submitRedeem(pool)
        setSubmitting(false)
      }
      handleSubmit()
    }
  }, [submitting])

  const disableFormInputs = !connected || loading
  const disableSubmit = disableFormInputs || redeemableBalance < 0

  return (
    <>
      <AmountInput
        title="Total raised"
        placeholder="0"
        tokenSymbol="USDC"
        tokenIcon="usdc.svg"
        value={totalRaised.toString()}
        valueRound="ceil"
        decimals={6}
        readOnly
      />
      <AmountInput
        title="Your contribution"
        placeholder="0"
        tokenSymbol="USDC"
        tokenIcon="usdc.svg"
        value={numberFormat.format(redeemableBalance)}
        valueRound="ceil"
        decimals={6}
        readOnly
      />
      <AmountInput
        title="Redeemable amount"
        placeholder="0"
        tokenSymbol="PRT"
        tokenIcon="prt.svg"
        value={numberFormat.format(mangoAvailable)}
        valueRound="ceil"
        decimals={6}
        readOnly
      />
      <Button
        onClick={() => handleRedeem()}
        className="w-full mt-6 mb-2"
        disabled={disableSubmit}
      >
        Go PRT
      </Button>
    </>
  )
}

export default PoolRedeemCard
