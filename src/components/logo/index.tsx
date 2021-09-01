import Image from 'next/image'
import React from 'react'

export const Logo: React.FC = () => {
  return (
    <>
      <span className="select-none light-hidden">
        <Image
          src="/icons/parrot-logo-d.svg"
          alt="Parrot"
          width="152"
          height="40"
        />
      </span>
      <span className="select-none dark-hidden">
        <Image
          src="/icons/parrot-logo.svg"
          alt="Parrot"
          width="152"
          height="40"
        />
      </span>
    </>
  )
}
