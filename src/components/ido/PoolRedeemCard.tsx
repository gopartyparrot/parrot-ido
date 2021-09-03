import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useLargestAccounts from '../../hooks/useLargestAccounts'
import useVaults from '../../hooks/useVaults'
import { notify } from '../../stores/useNotificationStore'
import useWalletStore, { PoolAccount } from '../../stores/useWalletStore'
import { calculateSupply } from '../../utils/balance'
import { Button } from '../button'
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
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const contributeBalance = largestAccounts.redeemable?.balance || 0

  const redeemableAmount = useMemo(() => {
    const redeemableSupply = calculateSupply(mints, pool.redeemableMint)
    return vaults.prtBalance && redeemableSupply
      ? (contributeBalance * vaults.prtBalance) / redeemableSupply
      : 0
  }, [vaults.prtBalance, contributeBalance, mints, pool.redeemableMint])

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

  const disableSubmit = !connected || loading || redeemableAmount < 0

  return (
    <div className="space-y-2">
      <div className="bg-secondary rounded-xl p-6 text-center">
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
      <div className="bg-secondary rounded-xl p-6 text-center">
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
            value={contributeBalance}
            defaultIfNull="N/A"
          />
        </div>
      </div>
      <div className="bg-secondary rounded-xl p-6 text-center">
        <p className="text-sm text-secondary">Token Price</p>
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
            value={vaults.estimatedPrice}
            defaultIfNull="N/A"
          />
        </div>
      </div>
      <div className="bg-secondary rounded-xl p-6 text-center">
        <p className="text-sm text-secondary">Redeemable amount</p>
        <div className="flex items-center justify-center pt-2">
          <img
            alt=""
            width="20"
            height="20"
            src="/icons/prt.svg"
            className="mr-2"
          />
          <NumberText
            className="font-bold text-mdx"
            value={redeemableAmount}
            defaultIfNull="N/A"
          />
        </div>
      </div>

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
