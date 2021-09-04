import { useWallet } from '@parrotfi/wallets'
import React, { useCallback } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Button } from '../components/button'
import { Header } from '../components/header'
import CardBase from '../components/ido/CardBase'
import PoolCard from '../components/ido/PoolCard'
import { useIDOProvider } from '../contexts/IDOContext'
import useWalletStore from '../stores/useWalletStore'

const Main = () => {
  const { endpoint } = useWallet()
  const { loadIDO, loadingIDO, loadingError } = useIDOProvider()
  const pools = useWalletStore((s) => s.pools)

  const handleReload = useCallback(() => {
    loadIDO(endpoint)
  }, [endpoint, loadIDO])

  return (
    <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-6 mx-auto">
      {pools.map((pool, index) => (
        <PoolCard
          key={pool.publicKey.toBase58()}
          pool={pool}
          round={`${index + 1}`}
        />
      ))}
      {!!loadingError && (
        <CardBase title="Error" className="col-span-2">
          <p className="leading-snug pb-6">{loadingError}</p>
          <Button size="sm" onClick={handleReload}>
            Retry
          </Button>
        </CardBase>
      )}
      {loadingIDO &&
        [1, 2].map((key) => (
          <CardBase key={key} title="Loading...">
            <Skeleton count={3} height={90} className="my-1" />
          </CardBase>
        ))}
    </main>
  )
}

const Page: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-scaffold">
      <Header />
      <Main />
    </div>
  )
}

export default Page
