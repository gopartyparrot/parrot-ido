import React from 'react'

export const Logo: React.FC = () => {
  return (
    <>
      <div className="select-none hidden dark:block">
        <img
          src="/icons/parrot-logo-d.svg"
          alt="Parrot"
          width="152"
          height="40"
        />
      </div>
      <div className="select-none dark:hidden">
        <img
          src="/icons/parrot-logo.svg"
          alt="Parrot"
          width="152"
          height="40"
        />
      </div>
    </>
  )
}
