import moment from 'moment'

import { PoolAccount } from '../stores/useWalletStore'
import { useRefresh } from './useRefresh'

export default function usePool(pool: PoolAccount) {
  const { manual: updated } = useRefresh()
  const startIdo = pool ? moment.unix(pool.startIdoTs.toNumber()) : undefined
  const endIdo = pool ? moment.unix(pool.endIdoTs.toNumber()) : undefined

  const startRedeem = pool
    ? moment.unix(pool.withdrawMelonTs.toNumber())
    : undefined
  const endDeposits = pool
    ? moment.unix(pool.endDepositsTs.toNumber())
    : undefined

  // override for test
  // const unixTs = moment().unix()
  // const startIdo = moment.unix(unixTs).add(10, 'seconds')
  // const endDeposits = moment.unix(unixTs).add(30, 'seconds')
  // const endIdo = moment.unix(unixTs).add(60, 'seconds')
  // const startRedeem = moment.unix(unixTs).add(90, 'seconds')

  const poolStatus =
    endDeposits?.isBefore() && endIdo?.isAfter()
      ? 'Deposits are closed'
      : endIdo?.isBefore()
      ? 'The IDO has ended'
      : 'The IDO is starting...'

  return {
    updated,
    pool,
    startIdo,
    endIdo,
    startRedeem,
    endDeposits,
    poolStatus,
  }
}
