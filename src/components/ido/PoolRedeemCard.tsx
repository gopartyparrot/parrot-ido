import React, { useCallback, useEffect, useState } from 'react'
import useWalletStore, { PoolAccount } from '../../stores/useWalletStore'
import { Button } from '../button'
import useLargestAccounts from '../../hooks/useLargestAccounts'
import useVaults from '../../hooks/useVaults'
import { calculateSupply } from '../../utils/balance'
import { AmountInput } from '../input/AmountInput'
import { notify } from '../../stores/useNotificationStore'
import { TOTAL_RAISED } from '../../config/constants'
import NumberText from '../texts/Number'

interface PoolRedeemCardProps {
  pool: PoolAccount
}

const PoolRedeemCard: React.FC<PoolRedeemCardProps> = ({ pool }) => {
  const actions = useWalletStore((s) => s.actions)
  const connected = useWalletStore((s) => s.connected)
  const mints = useWalletStore((s) => s.mints)
  const largestAccounts = useLargestAccounts(pool)
  const vaults = useVaults(pool)

  const redeemableBalance = largestAccounts.redeemable?.balance || 0
  const redeemableSupply = calculateSupply(mints, pool.redeemableMint)
  const mangoAvailable =
    vaults.prtBalance && redeemableSupply
      ? (redeemableBalance * vaults.prtBalance) / redeemableSupply
      : 0

  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleRedeem = useCallback(() => {
    setSubmitting(true)
  }, [])

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
        try {
          await actions.submitRedeem(pool)
          setSubmitting(false)
        } catch (e) {
          notify({
            type: 'error',
            title: 'Redeem error',
            message: e.message,
          })
          setSubmitting(false)
        }
      }
      handleSubmit()
    }
  }, [submitting])

  const disableFormInputs = !connected || loading
  const disableSubmit = disableFormInputs || redeemableBalance < 0

  return (
    <div className="space-y-2">
      <div className="bg-tertiary rounded-xl p-6 text-center">
        <p className="text-sm text-secondary">Total raised</p>
        <div className="flex items-center justify-center pt-2">
          <img
            alt=""
            width="20"
            height="20"
            src="/icons/usdc.svg"
            className="mr-2"
          />
          <NumberText
            className="font-bold text-mdx"
            value={vaults.usdcBalance}
            defaultIfNull="N/A"
          />
        </div>
      </div>
      <div className="bg-tertiary rounded-xl p-6 text-center">
        <p className="text-sm text-secondary">Your contribution</p>
        <div className="flex items-center justify-center pt-2">
          <img
            alt=""
            width="20"
            height="20"
            src="/icons/usdc.svg"
            className="mr-2"
          />
          <NumberText
            className="font-bold text-mdx"
            value={redeemableBalance}
            defaultIfNull="N/A"
          />
        </div>
      </div>
      <AmountInput
        title="Redeemable amount"
        placeholder="0"
        tokenSymbol="PRT"
        tokenIcon="prt.svg"
        value={mangoAvailable.toString()}
        valueRound="ceil"
        decimals={6}
        readOnly
      />
      <Button
        onClick={handleRedeem}
        className="w-full mt-6 mb-4"
        disabled={disableSubmit}
        isLoading={submitting}
      >
        {submitting ? 'Waiting approval' : 'Get PRT'}
      </Button>
    </div>
  )
}

export default PoolRedeemCard
