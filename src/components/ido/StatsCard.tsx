import PoolCountdown from './PoolCountdown'
import useVaults from '../../hooks/useVaults'
import usePool from '../../hooks/usePool'
import 'twin.macro'
import NumberText from '../texts/Number'

const StatsCard = () => {
  const vaults = useVaults()
  const { endIdo, endDeposits } = usePool()

  // const mangoRedeemable = vaults.usdc
  //   ? (redeemableBalance * vaults.mango.balance) / vaults.usdc.balance
  //   : 0

  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-2 gap-2 bg-secondary rounded-xl p-6">
        <div className="text-center">
          <p className="text-sm text-secondary">Sale Period Ends</p>
          <PoolCountdown date={endDeposits} className="justify-center pt-2" />
        </div>

        <div className="text-center">
          <p className="text-sm text-secondary">Grace Period Ends</p>
          <PoolCountdown date={endIdo} className="justify-center pt-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 bg-secondary rounded-xl p-6">
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

      <div className="bg-secondary rounded-xl p-6">
        <div className="text-center">
          <p className="text-sm text-secondary">PRT For Sale</p>
          <div className="flex items-center justify-center pt-2">
            <img className="h-5 mr-2 w-auto" src="/icons/prt.svg" alt="mango" />
            <NumberText
              className="font-bold text-mdx"
              value={vaults.mangoBalance}
              defaultIfNull="N/A"
            />
          </div>
        </div>

        {/* <p>
              Start: {startIdo?.fromNow()} ({startIdo?.format()})
              </p>
            <p>
              End Deposits: {endDeposits?.fromNow()} ({endDeposits?.format()})
            </p>
            <p>
              End Withdraws: {endIdo?.fromNow()} ({endIdo?.format()})
            </p>
            <p>Current USDC in Pool: {vaults.usdc?.balance || 'N/A'}</p>
            <p>Locked MNGO in Pool: {vaults.mango?.balance || 'N/A'}</p> */}
      </div>
    </div>
  )
}

export default StatsCard
