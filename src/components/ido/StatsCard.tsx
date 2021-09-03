import PoolCountdown from './PoolCountdown'
import useVaults from '../../hooks/useVaults'
import usePool from '../../hooks/usePool'
import 'twin.macro'
import NumberText from '../texts/Number'
import { PoolAccount } from '../../stores/useWalletStore'

interface StatsCardProps {
  pool: PoolAccount
}

const StatsCard: React.FC<StatsCardProps> = ({ pool }) => {
  const { startIdo, endIdo, endDeposits, startRedeem } = usePool(pool)
  const vaults = useVaults(pool)

  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-2 gap-2 bg-tertiary rounded-xl p-6">
        <div className="text-center">
          <p className="text-sm text-secondary">Sale Period Ends</p>
          <PoolCountdown
            pool={pool}
            date={endDeposits}
            className="justify-center pt-2"
          />
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary">Grace Period Ends</p>
          <PoolCountdown
            pool={pool}
            date={endIdo}
            className="justify-center pt-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 bg-tertiary rounded-xl p-6">
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
            />
          </div>
        </div>
      </div>

      <div className=" bg-tertiary rounded-xl p-6">
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
      <div className="bg-tertiary p-4 space-y-3 font-mono text-xs">
        <p>
          Start Ido: {startIdo?.fromNow()} ({startIdo?.format()})
        </p>
        <p>
          End Deposits: {endDeposits?.fromNow()} ({endDeposits?.format()})
        </p>
        <p>
          End Withdraws/Ido: {endIdo?.fromNow()} ({endIdo?.format()})
        </p>
        <p>
          Start Redeem: {startRedeem?.fromNow()} ({startRedeem?.format()})
        </p>
        <p>Current USDC in Pool: {vaults.usdcBalance || 'N/A'}</p>
        <p>Locked PRT in Pool: {vaults.prtBalance || 'N/A'}</p>
      </div>
    </div>
  )
}

export default StatsCard
