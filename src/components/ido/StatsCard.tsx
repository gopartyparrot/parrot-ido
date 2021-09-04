import PoolCountdown from './PoolCountdown'
import useVaults from '../../hooks/useVaults'
import usePool from '../../hooks/usePool'
import NumberText from '../texts/Number'
import { PoolAccount } from '../../stores/useWalletStore'
import { QuestionMarkCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import { useTooltip } from '../tooltip'

interface StatsCardProps {
  pool: PoolAccount
}

const StatsCard: React.FC<StatsCardProps> = ({ pool }) => {
  const { endIdo, endDeposits } = usePool(pool)
  const vaults = useVaults(pool)

  const {
    targetRef: targetSaleRef,
    tooltip: tooltipSale,
    tooltipVisible: tooltipSaleVisible,
  } = useTooltip(
    `In the first 24 hours, you may deposit or withdraw your USDC from the vault. During the sale period, the PRT price can fluctuate.`,
    {
      placement: 'bottom-start',
      trigger: 'hover',
    }
  )

  const {
    targetRef: targetGraceRef,
    tooltip: tooltipGrace,
    tooltipVisible: tooltipGraceVisible,
  } = useTooltip(
    `After 24 hours, deposits will be restricted and only withdrawals allowed. During the grace period, the PRT price can only go down.`,
    {
      placement: 'bottom-start',
      trigger: 'hover',
    }
  )

  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-secondary rounded-xl p-6 grid grid-cols-2 gap-2">
        <div>
          <div className="text-sm text-secondary flex flex-row items-center justify-center">
            <span className="mr-1">Sale Period Ends</span>
            <span ref={targetSaleRef}>
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </span>
            {tooltipSaleVisible && tooltipSale}
          </div>
          <PoolCountdown
            pool={pool}
            date={endDeposits}
            className="justify-center pt-2"
          />
        </div>
        <div>
          <div className="text-sm text-secondary flex flex-row items-center justify-center">
            <span className="mr-1">Grace Period Ends</span>
            <span ref={targetGraceRef}>
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </span>
            {tooltipGraceVisible && tooltipGrace}
          </div>
          <PoolCountdown
            pool={pool}
            date={endIdo}
            className="justify-center pt-2"
          />
        </div>
      </div>
      <div className="bg-secondary rounded-xl p-6 grid grid-cols-2 gap-2">
        <div className="text-center">
          <p className="text-sm text-secondary">USDC Contributed</p>
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

        <div className="text-center">
          <p className="text-sm text-secondary">Estimated Token Price</p>
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
              displayDecimals={6}
            />
          </div>
        </div>
      </div>
      <div className="bg-secondary rounded-xl p-6">
        <div className="text-center">
          <p className="text-sm text-secondary">PRT For Sale</p>
          <div className="flex items-center justify-center pt-2">
            <img className="h-5 mr-2 w-auto" src="/icons/prt.svg" alt="mango" />
            <NumberText
              className="font-bold text-mdx"
              value={vaults.prtBalance}
              defaultIfNull="N/A"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsCard
