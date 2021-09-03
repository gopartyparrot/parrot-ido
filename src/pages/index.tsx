import usePool from '../hooks/usePool'
import React from 'react'
import { Header } from '../components/header'
import ContributionCard from '../components/ido/PoolCard'
import useWalletStore from '../stores/useWalletStore'
import PoolCard from '../components/ido/PoolCard'

const Main = () => {
  const pools = useWalletStore((s) => s.pools)

  return (
    <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 my-6 mx-auto">
      {pools.map((pool, index) => (
        <PoolCard
          key={pool.publicKey.toBase58()}
          pool={pool}
          round={`${index + 1}`}
        />
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
