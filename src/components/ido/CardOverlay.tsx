import classNames from 'classnames'
import React, { PropsWithChildren, ReactNode } from 'react'

interface Props {
  ended?: boolean
  endTime?: number
  title: string
  children: ReactNode
}

const CardOverlay: React.FC<Props> = ({ children, ended = false, title }) => {
  const showOverlay = ended
  return (
    <div className="bg-white min-w-card rounded-3xl shadow-card m-3 overflow-hidden relative">
      {showOverlay && (
        <div className="absolute z-20 w-full p-12 h-full flex items-center justify-center">
          <div className="bg-white w-full p-6 rounded-3xl">Ended</div>
        </div>
      )}
      <div className={classNames({ 'filter blur-sm': showOverlay })}>
        {showOverlay && (
          <div className="absolute rounded-3xl z-10 bg-overlay w-full h-full" />
        )}
        <header className="md:border-b-2 border-brandPrimary px-6 pt-6 pb-3">
          <h1 className="text-md font-bold">{title}</h1>
        </header>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

export default CardOverlay
