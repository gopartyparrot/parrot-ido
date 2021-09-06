import React, { useCallback } from 'react'

import { useNotificationStore } from '../stores/useNotificationStore'
import { ToastContainer } from './toast'

const Notifications = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore(
    (s) => s
  )

  const reversedNotifications = [...notifications].reverse()

  const handleRemove = useCallback((id: string) => {
    setNotificationStore((state) => {
      state.notifications = state.notifications.filter((i) => i.id !== id)
    })
  }, [])

  return (
    <ToastContainer toasts={reversedNotifications} onRemove={handleRemove} />
  )
}

export default Notifications
