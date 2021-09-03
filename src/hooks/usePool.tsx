import moment from 'moment'
import useWalletStore, { PoolAccount } from '../stores/useWalletStore'

export default function usePool(pool: PoolAccount) {
  const startIdo = pool ? moment.unix(pool.startIdoTs.toNumber()) : undefined
  const endIdo = pool ? moment.unix(pool.endIdoTs.toNumber()) : undefined

  const startRedeem = pool
    ? moment.unix(pool.withdrawMelonTs.toNumber())
    : undefined
  const endDeposits = pool
    ? moment.unix(pool.endDepositsTs.toNumber())
    : undefined

  // console.log(`${pool.publicKey.toBase58()} startIdo: ${startIdo}`)
  // console.log(`${pool.publicKey.toBase58()} endDeposits: ${endDeposits}`)
  // console.log(`${pool.publicKey.toBase58()} endIdo: ${endIdo}`)
  // console.log(`${pool.publicKey.toBase58()} withdrawIdo: ${withdrawIdo}`)

  /*
  // override for announcement */
  // const unixTs = 1630628552;
  // const startIdo = moment.unix(unixTs);
  // const endDeposits = moment.unix(unixTs).add(1, 'days');
  // const endIdo = moment.unix(unixTs).add(2, 'days');

  return { pool, startIdo, endIdo, startRedeem, endDeposits }
}
