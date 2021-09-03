import classNames from 'classnames'
import moment from 'moment'
import React, { PropsWithChildren, ReactNode } from 'react'
import PoolCountdown from './PoolCountdown'

interface CardOverlayProps {
  startIdo: moment.Moment
  endDeposits: moment.Moment
  endIdo: moment.Moment
  startRedeem: moment.Moment
  title: string
  children: ReactNode
}

const CardOverlay: React.FC<CardOverlayProps> = ({
  children,
  startIdo,
  endDeposits,
  startRedeem,
  endIdo,
  title,
}) => {
  const notStarted = startIdo.isAfter()
  const noDeposits = endDeposits.isBefore()
  const notRedeem = endIdo.isBefore() && startRedeem.isAfter()

  const hasEnded = endIdo.isBefore()
  const hasOverlay = notStarted || notRedeem

  return (
    <div className="bg-white w-full sm:w-card rounded-3xl shadow-card overflow-hidden relative">
      {hasOverlay && (
        <div className="absolute z-20 w-full px-8 h-full flex items-center justify-center">
          <div className="bg-white w-full p-6 rounded-3xl flex flex-col items-center space-y-2">
            {notStarted && <h3>Entry Starts</h3>}
            {notRedeem && <h3>Redeem Starts</h3>}
            <PoolCountdown date={notStarted ? startIdo : startRedeem} />
          </div>
        </div>
      )}
      <div
        className={classNames({
          'w-full h-full filter blur-sm': hasOverlay,
        })}
      >
        {hasOverlay && (
          <div className="absolute rounded-3xl z-10 bg-overlay top-0 bottom-0 left-0 right-0" />
        )}
        <header className="md:border-b-2 border-brandPrimary px-6  flex flex-row items-center">
          <h1 className="text-md font-bold flex-1 pt-6 pb-4">{title}</h1>
          {!hasEnded && (
            <div className="bg-brandSecondary rounded-3xl mt-3 px-3 py-2 text-xs font-bold">
              {noDeposits ? 'Grace Period' : 'Sale Period'}
            </div>
          )}
        </header>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default CardOverlay
