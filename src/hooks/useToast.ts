import { useContext } from 'react'

import { ToastContext } from '../contexts/ToastContext'

const useToast = () => {
  const toastContext = useContext(ToastContext)

  if (toastContext === undefined) {
    throw new Error('Toasts context undefined')
  }

  return toastContext
}

export { useToast }
