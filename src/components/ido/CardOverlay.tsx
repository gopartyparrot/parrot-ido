import classNames from 'classnames'
import moment from 'moment'
import React, { PropsWithChildren, ReactNode } from 'react'

interface CardOverlayProps {
  startIdo: moment.Moment
  endDeposits: moment.Moment
  endIdo: moment.Moment
  title: string
  children: ReactNode
}

const CardOverlay: React.FC<CardOverlayProps> = ({
  children,
  startIdo,
  endDeposits,
  endIdo,
  title,
}) => {
  console.log(
    'startIdo',
    startIdo.toISOString(),
    moment().toISOString(),
    startIdo.isAfter()
  )

  const notStarted = startIdo.isAfter()
  const noDeposits = endDeposits.isBefore()
  const ended = endIdo.isBefore()
  return (
    <div className="bg-white w-full sm:w-card rounded-3xl shadow-card overflow-hidden relative">
      {notStarted && (
        <div className="absolute z-20 w-full p-12 h-full flex items-center justify-center">
          <div className="bg-white w-full p-6 rounded-3xl">Not starts</div>
        </div>
      )}
      <div className={classNames({ 'filter blur-sm': notStarted })}>
        {notStarted && (
          <div className="absolute rounded-3xl z-10 bg-overlay w-full h-full" />
        )}
        <header className="md:border-b-2 border-brandPrimary px-6 pt-4 pb-2 flex flex-row items-center">
          <h1 className="text-md font-bold flex-1">{title}</h1>
          {!ended && (
            <div className="bg-brandSecondary rounded-3xl px-2 py-1 text-xs font-bold">
              {noDeposits ? 'Grace Period' : 'Sale Period'}
            </div>
          )}
        </header>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

export default CardOverlay
