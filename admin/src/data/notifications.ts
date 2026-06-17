export interface Notification {
  id: string
  type: 'order' | 'stock' | 'pickup' | 'inquiry'
  title: string
  subtitle: string
  time: string
}

const KEY = 'velocita_notifications_cleared'

const SEED: Notification[] = [
  { id: 'n-1', type: 'order',   title: 'New order placed',    subtitle: 'Maria Santos · Vespa Primavera', time: '2 min ago' },
  { id: 'n-2', type: 'stock',   title: 'Low stock alert',     subtitle: 'AGV K6 Helmet · 3 units left',   time: '18 min ago' },
  { id: 'n-3', type: 'pickup',  title: 'Ready for pickup',    subtitle: '#VLT-00121 · BGC Branch',         time: '1 hr ago' },
]

export function getNotifications(): Notification[] {
  return localStorage.getItem(KEY) === 'true' ? [] : [...SEED]
}

export function clearNotifications(): void {
  localStorage.setItem(KEY, 'true')
}

export function resetNotifications(): void {
  localStorage.removeItem(KEY)
}
