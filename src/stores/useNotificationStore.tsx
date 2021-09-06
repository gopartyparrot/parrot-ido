import produce from 'immer'
import create, { State } from 'zustand'

import { Toast, ToastTypes } from '../components/toast'
import { ToastAction } from '../components/toast/types'

interface NotificationStore extends State {
  notifications: Toast[]
  set: (x: any) => void
}

let globalId = 0

const nextId = () => {
  return `${new Date().valueOf()}_${globalId++}`
}

export const useNotificationStore = create<NotificationStore>((set, _get) => ({
  notifications: [],
  set: (fn) => set(produce(fn)),
}))

export function notify(newNotification: {
  type?: 'info' | 'error' | 'success' | 'warn'
  title: string
  message?: string
  duration?: number
  txid?: string
}) {
  const { notifications, set: setNotificationStore } =
    useNotificationStore.getState()

  // Add Actions if have txid
  let toastAction: ToastAction | undefined
  const txid = newNotification.txid
  if (txid) {
    toastAction = {
      text: `View transaction ${txid.slice(0, 8)}...${txid.slice(
        txid.length - 8
      )}`,
      url: `https://explorer.solana.com/tx/${txid}`,
    }
  }

  let type = ToastTypes.INFO
  switch (newNotification.type) {
    case 'error':
      type = ToastTypes.FAILURE
      break
    case 'success':
      type = ToastTypes.SUCCESS
      break
    case 'warn':
      type = ToastTypes.WARNING
      break
    case 'info':
    default:
      type = ToastTypes.INFO
      break
  }

  setNotificationStore((state) => {
    state.notifications = [
      ...notifications,
      { id: nextId(), toastAction, ...newNotification, type },
    ]
  })
}
