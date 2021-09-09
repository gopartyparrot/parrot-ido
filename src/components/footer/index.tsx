import Image from 'next/image'
import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="px-2 sm:px-6 text-center mb-2 sm:mb-6">
      <h5 className="text-md sm:text-lg font-bold">Backed by</h5>
      <div className="mt-6 flex flex-row items-end justify-center space-x-6">
        <div>
          <Image src="/images/backed/alameda.svg" width={216} height={44} />
        </div>
        <div>
          <Image src="/images/backed/qtum.svg" width={100} height={32} />
        </div>
        <div>
          <Image src="/images/backed/ngc.svg" width={178} height={20} />
        </div>
      </div>
      <div className="mt-3 sm:mt-6 flex flex-row flex-wrap items-center justify-center m-auto space-x-6 space-y-3">
        <div>
          <Image src="/images/backed/sino.svg" width={80} height={24} />
        </div>
        <div>
          <Image src="/images/backed/petrock.svg" width={98} height={24} />
        </div>
        <div>
          <Image src="/images/backed/svc.svg" width={68} height={24} />
        </div>
        <div>
          <Image src="/images/backed/rock.svg" width={74} height={24} />
        </div>
        <div>
          <Image src="/images/backed/mgnr.svg" width={105} height={24} />
        </div>
        <div>
          <Image src="/images/backed/coin98.svg" width={82} height={24} />
        </div>
        <div>
          <Image src="/images/backed/solana.svg" width={98} height={24} />
        </div>
      </div>
    </footer>
  )
}
