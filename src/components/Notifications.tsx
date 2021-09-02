import React, { useCallback } from 'react'
import { ToastContainer } from './toast'
import { useNotificationStore } from '../stores/useNotificationStore'

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
