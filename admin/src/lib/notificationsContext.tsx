import { createContext, useContext, useState, useCallback } from 'react'
import {
  getNotifications,
  clearNotifications as doClear,
  resetNotifications as doReset,
  type Notification,
} from '../data/notifications'

interface NotificationsContextValue {
  notifications: Notification[]
  clear: () => void
  reset: () => void
}

const Ctx = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => getNotifications())

  const clear = useCallback(() => {
    doClear()
    setNotifications([])
  }, [])

  const reset = useCallback(() => {
    doReset()
    setNotifications(getNotifications())
  }, [])

  return <Ctx.Provider value={{ notifications, clear, reset }}>{children}</Ctx.Provider>
}

export function useNotifications() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
