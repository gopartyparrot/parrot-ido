import { useWallet } from '@parrotfi/wallets'
import React, { useCallback } from 'react'
import Skeleton from 'react-loading-skeleton'

import { Button } from '../components/button'
import { Footer } from '../components/footer'
import { Header } from '../components/header'
import BigCountdown from '../components/ido/BigCountdown'
import CardBase from '../components/ido/CardBase'
import PoolCard from '../components/ido/PoolCard'
import { IDO_STARTS } from '../config/constants'
import { useIDO } from '../hooks/useIDO'
import useWalletStore from '../stores/useWalletStore'

const Main = () => {
  const pools = useWalletStore((s) => s.pools)
  const { endpoint } = useWallet()
  const { loadIDO, loadingIDO, loadingError } = useIDO()

  const handleReload = useCallback(() => {
    loadIDO(endpoint)
  }, [endpoint.rpcURL, loadIDO])

  return (
    <main className="w-full flex flex-col items-center md:items-start justify-center my-4 space-y-4 sm:my-6 md:space-x-6 md:flex-row md:space-y-0">
      {pools.map((pool, index) => (
        <PoolCard
          key={pool.publicKey.toBase58()}
          pool={pool}
          round={`${index + 1}`}
        />
      ))}
      {!!loadingError && (
        <CardBase title="Error" className="md:col-span-2">
          <p className="leading-snug mb-6">{loadingError}</p>
          <Button size="sm" onClick={handleReload}>
            Retry to load
          </Button>
        </CardBase>
      )}
      {loadingIDO &&
        [1, 2].map((key) => (
          <CardBase key={key} title="Loading...">
            <Skeleton count={3} height={90} className="mt-2" />
          </CardBase>
        ))}
    </main>
  )
}

const Page: React.FC = () => {
  const isStared = IDO_STARTS.isBefore()

  return (
    <div className="min-h-screen flex flex-col bg-scaffold">
      <Header />
      <img
        srcSet="/images/bg/1.png 2880px, /images/bg/2.png 1440px"
        src="/images/bg/2.png"
        alt=""
      />
      <div className="-mt-20">
        {!isStared && <BigCountdown date={IDO_STARTS} />}
        {isStared && <Main />}
      </div>
      <Footer />
    </div>
  )
}

export default Page
