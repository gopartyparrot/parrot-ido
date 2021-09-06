import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { useWallet, WalletEndpoint } from '@parrotfi/wallets'
import classNames from 'classnames'
import React, { Fragment, useCallback } from 'react'
import { RPC_ENDPOINTS } from '../../config/constants'
import { useIDO } from '../../hooks/useIDO'

export const RpcSwitcher: React.FC = () => {
  const { loadIDO } = useIDO()
  const { setEndpoint, endpoint } = useWallet()

  const handleChange = useCallback(
    (endpoint: WalletEndpoint) => () => {
      setEndpoint(endpoint)
      loadIDO(endpoint)
    },
    [loadIDO, setEndpoint]
  )

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="h-10 px-4 text-sm rounded-xl border outline-none focus:outline-none flex flex-row items-center justify-center border-black space-x-2 hover:bg-lightgray sm:min-w-rpc">
        <svg
          className="w-5 h-5"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.4061 16.6799C15.509 15.836 15.4747 14.9788 15.3903 14.1693C15.807 13.9894 16.0707 13.6984 16.1656 13.2857C16.788 13.2963 17.3892 13.2566 18.0274 13.0529C17.4921 14.537 16.6087 15.6508 15.48 16.619C15.4061 16.6799 15.4061 16.6799 15.4061 16.6799ZM8.28323 18.4206C9.97363 16.4127 12.1598 14.8466 13.5944 13.955C13.7975 14.1296 14.0876 14.291 14.3592 14.3466C14.4594 15.3307 14.3882 16.3333 14.2801 17.4524C12.8877 18.2434 11.5876 18.6058 9.99736 18.6058C9.35654 18.6058 8.95042 18.5767 8.34916 18.4418L8.28323 18.4206ZM2.96677 14.9418C3.11445 13.9444 3.48892 12.2751 4.55432 10.4339C4.67036 10.4603 4.87869 10.4947 5.00264 10.4947C5.26108 10.4947 5.50897 10.463 5.72257 10.3148C7.48945 11.6243 9.83913 12.6746 12.8903 13.0503C11.0232 13.955 8.70781 15.6746 7.03323 18.0635C5.34283 17.4365 4.0981 16.5026 3.04852 15.037L2.96677 14.9418ZM2.16508 6.48413C2.42352 7.01058 2.78481 7.62169 3.43091 8.16402C3.34916 8.41005 3.3096 8.62434 3.3096 8.82275C3.3096 9.19577 3.4019 9.59524 3.65506 9.8545C2.80854 11.0794 2.36287 12.4577 2.16772 13.5397C1.65348 12.4762 1.4135 11.2249 1.4135 9.99206C1.4135 8.75926 1.67721 7.5873 2.14662 6.52646C2.14399 6.5291 2.11498 6.57407 2.16508 6.48413ZM6.33966 2.21693C6.88555 2.51058 7.65295 2.97619 8.51266 3.64815C8.423 3.84656 8.37289 4.06878 8.37289 4.29894C8.37289 4.42857 8.39135 4.55291 8.423 4.67725C7.26793 5.48413 6.34494 6.33069 5.55116 7.24339C5.38766 7.18518 5.12395 7.12434 4.93935 7.12434C4.64662 7.12434 4.34335 7.2037 4.10865 7.34127C3.5654 6.81217 3.02479 5.93122 2.75844 5.39153C3.62605 3.99471 4.84705 2.92593 6.33966 2.21693ZM13.6181 2.19841C12.7136 2.47619 11.8697 2.79365 11.097 3.15079C10.807 2.86772 10.414 2.69048 9.97626 2.69048C9.71519 2.69048 9.53059 2.7328 9.31171 2.84392C8.72099 2.37566 8.1962 1.99735 7.71624 1.70106C8.47046 1.48413 9.17458 1.38624 9.99736 1.38624C11.2948 1.38624 12.5185 1.68254 13.6181 2.19841ZM6.47152 7.90741C7.202 7.07672 8.01688 6.35714 9.06909 5.6164C9.33808 5.82011 9.61498 5.90741 9.9789 5.90741C10.24 5.90741 10.4325 5.86243 10.6514 5.75132C11.875 7.15873 13.1171 8.94709 13.8027 11.2831C13.4889 11.418 13.2648 11.672 13.1619 11.9788C10.3165 11.6508 8.18038 10.6138 6.52162 9.41534C6.62447 9.22222 6.65348 9.05556 6.65348 8.82275C6.65348 8.51323 6.57964 8.23545 6.42933 7.98942L6.47152 7.90741ZM18.5865 9.99471C18.5865 10.619 18.5733 11.2143 18.4045 11.7698C17.7426 11.9815 16.9673 12.1667 16.1814 12.1667C16.01 11.5794 15.4668 11.0979 14.9024 11.0873C14.4066 8.54762 12.8903 6.36508 11.461 4.90741C11.548 4.70899 11.5823 4.5291 11.5823 4.29894C11.5823 4.23545 11.5717 4.17725 11.5638 4.1164C12.5607 3.65344 13.6709 3.25397 14.9077 2.93915C17.1282 4.49735 18.5865 7.07672 18.5865 9.99471ZM10 0C4.48576 0 0 4.48677 0 10C0 15.5132 4.48576 20 10 20C15.5142 20 20 15.5132 20 10C20 4.48677 15.5142 0 10 0Z" />
        </svg>
        <span className="flex-1">{endpoint?.rpcName}</span>
        <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-40 absolute bg-default w-full mt-1 right-0 origin-top-right rounded-lg shadow-lg outline-none focus:outline-none border border-secondary">
          {RPC_ENDPOINTS.map((item, index) => (
            <Menu.Item key={item.id}>
              {({ active }) => (
                <button
                  onClick={handleChange(item)}
                  className={classNames(
                    'group flex items-center justify-center w-full px-2 py-4',
                    {
                      'text-brandPrimary': active,
                      'border-t border-gray': index > 0,
                    }
                  )}
                >
                  {item.rpcName}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
