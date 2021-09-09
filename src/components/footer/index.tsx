import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="px-2 sm:px-6 text-center mb-2 sm:mb-6 mt-4">
      <h5 className="text-md sm:text-lg font-bold">Backed by</h5>
      <div className="hidden sm:block">
        <div className="mt-6 flex flex-row items-end justify-center space-x-6">
          <img src="/images/backed/alameda.svg" width={216} height={44} />
          <img src="/images/backed/qtum.svg" width={100} height={32} />
          <img src="/images/backed/ngc.svg" width={178} height={20} />
        </div>
        <div className="mt-6 flex flex-row items-center justify-center space-x-6">
          <img src="/images/backed/sino.svg" width={80} height={24} />
          <img src="/images/backed/petrock.svg" width={98} height={24} />
          <img src="/images/backed/svc.svg" width={68} height={24} />
          <img src="/images/backed/rock.svg" width={74} height={24} />
          <img src="/images/backed/mgnr.svg" width={105} height={24} />
          <img src="/images/backed/coin98.svg" width={82} height={24} />
          <img src="/images/backed/solana.svg" width={98} height={24} />
        </div>
      </div>
      <div className="sm:hidden my-2 mx-2">
        <img src="/images/backed/all.png" width="100%" />
      </div>
    </footer>
  )
}
