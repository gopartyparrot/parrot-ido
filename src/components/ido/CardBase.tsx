import classNames from 'classnames'
import React, { ReactNode } from 'react'

interface CardBaseProps {
  title: string
  titleRight?: ReactNode
  overlayContent?: ReactNode
  className?: string
  children: ReactNode
}

const CardBase: React.FC<CardBaseProps> = ({
  title,
  titleRight,
  overlayContent,
  children,
  className,
}) => {
  return (
    <div
      className={classNames(
        'bg-white w-full max-w-card rounded-3xl shadow-card overflow-hidden relative',
        className
      )}
    >
      {overlayContent}
      <div
        className={classNames({
          'w-full h-full filter blur-sm': !!overlayContent,
        })}
      >
        {!!overlayContent && (
          <div className="absolute rounded-3xl z-10 bg-overlay top-0 bottom-0 left-0 right-0" />
        )}
        <header className="border-b-2 border-brandPrimary px-4 sm:px-6 flex flex-row items-center">
          <h1 className="text-md font-bold flex-1 pt-6 pb-4">{title}</h1>
          {titleRight}
        </header>
        <div className="p-4 sm:p-6 break-words">{children}</div>
      </div>
    </div>
  )
}

export default CardBase
