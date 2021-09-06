import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/solid'
import classNames from 'classnames'
import React, { useCallback } from 'react'

import { ToastContentProps, ToastTypes } from './types'

let globalId = 0

const nextId = () => {
  return `${new Date().valueOf()}_${globalId++}`
}

const getIcon = (type: ToastTypes = ToastTypes.INFO) => {
  switch (type) {
    case ToastTypes.FAILURE:
      return <XCircleIcon />
    case ToastTypes.WARNING:
      return <ExclamationCircleIcon />
    case ToastTypes.SUCCESS:
      return <CheckCircleIcon />
    case ToastTypes.INFO:
    default:
      return <InformationCircleIcon />
  }
}

const ToastContent: React.FC<ToastContentProps> = ({
  toast,
  children,
  onRemove,
}) => {
  const { id, type, title, message, action } = toast
  const Icon = getIcon(type)

  const handleClose = useCallback(() => {
    onRemove(id)
  }, [onRemove, id])

  return (
    <div
      className="toast-shadow rounded bg-white p-4 text-sm flex flex-col"
      key={nextId()}
    >
      <div className="absolute -right-2 -top-2">
        <button
          onClick={handleClose}
          className="bg-brandPrimary p-1 text-white rounded-full inline-flex outline-none focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-row items-center">
        <div
          className={classNames(
            'text-white text-xs h-7 w-7 mr-3 rounded-full flex-grow-0 flex-shrink-0 flex items-center justify-center',
            {
              'bg-success': type === ToastTypes.SUCCESS,
              'bg-failure': type === ToastTypes.FAILURE,
              'bg-warning': type === ToastTypes.WARNING,
              'bg-brandSecondary': type === ToastTypes.INFO,
            }
          )}
        >
          {Icon}
        </div>
        <h5 className="font-bold text-md">{title}</h5>
      </div>
      {!!message && (
        <div className="mt-1 space-y-1 leading-snug w-full overflow-hidden break-words">
          {message.split('\n').map((i, key) => {
            return <div key={key}>{i}</div>
          })}
          {children}
        </div>
      )}
      {action && (
        <a
          href={action.url}
          target="_blank"
          rel="noreferrer"
          className="text-brandPrimary mt-2"
        >
          {action.text}
        </a>
      )}
    </div>
  )
}

export default ToastContent
