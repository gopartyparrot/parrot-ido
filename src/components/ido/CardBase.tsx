import classNames from 'classnames'
import React, { ReactNode } from 'react'

interface CardEmptyProps {
  title: string
  children: ReactNode
  className?: string
}

const CardEmpty: React.FC<CardEmptyProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div
      className={classNames(
        'bg-white w-full sm:w-card rounded-3xl shadow-card overflow-hidden relative',
        className
      )}
    >
      <header className="md:border-b-2 border-brandPrimary px-6  flex flex-row items-center">
        <h1 className="text-md font-bold flex-1 pt-6 pb-4">{title}</h1>
      </header>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default CardEmpty
