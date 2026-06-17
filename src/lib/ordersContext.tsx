import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { CartItem } from './cartContext'

export type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled'

export interface Order {
  orderNumber: string
  date: string
  name: string
  email: string
  phone: string
  items: CartItem[]
  subtotal: number
  method: 'card' | 'gcash'
  hasScooter: boolean
  needsShipping: boolean
  branch?: { id: string; name: string; address: string; hours: string }
  shipping?: { street: string; city: string; province: string; zip: string }
  status: OrderStatus
}

interface OrdersContextValue {
  orders: Order[]
  addOrder: (order: Omit<Order, 'status' | 'date'>) => void
  cancelOrder: (orderNumber: string) => void
}

const OrdersContext = createContext<OrdersContextValue | null>(null)

const STORAGE_KEY = 'velocita-orders'

const SEED_ORDERS: Order[] = [
  {
    orderNumber: 'VLT-VESPA1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    name: 'Alex Reyes',
    email: 'alex.reyes@velocita.ph',
    phone: '9171234567',
    items: [
      {
        productId: 'vespa-gts-300-super',
        name: 'Vespa GTS 300 Super',
        price: 7899,
        image: '/images/products/Vespa GTS SUPER 300 RED PASSIONE 1.png',
        type: 'scooter',
        slug: 'vespa-gts-300-super',
        qty: 1,
      },
    ],
    subtotal: 7899,
    method: 'card',
    hasScooter: true,
    needsShipping: false,
    branch: { id: 'bgc', name: 'BGC Branch', address: '32nd St., Bonifacio Global City, Taguig', hours: 'Mon–Sat 9am–7pm' },
    status: 'processing',
  },
  {
    orderNumber: 'VLT-TIRE01',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    name: 'Alex Reyes',
    email: 'alex.reyes@velocita.ph',
    phone: '9171234567',
    items: [
      {
        productId: 'pirelli-angel-gt-ii',
        name: 'Pirelli Angel GT II Tire Set',
        price: 239,
        image: '/images/products/pirelli angel gt 2 1.webp',
        type: 'part',
        slug: 'pirelli-angel-gt-ii',
        qty: 2,
      },
    ],
    subtotal: 478,
    method: 'gcash',
    hasScooter: false,
    needsShipping: true,
    shipping: { street: '123 Ayala Ave.', city: 'Makati', province: 'Metro Manila', zip: '1226' },
    status: 'ready',
  },
  {
    orderNumber: 'VLT-HELM1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 days ago
    name: 'Alex Reyes',
    email: 'alex.reyes@velocita.ph',
    phone: '9171234567',
    items: [
      {
        productId: 'hjc-rpha-11-pro',
        name: 'HJC RPHA 12N Helmet',
        price: 429,
        image: '/images/products/hjc helmet RPHA 12N 1.webp',
        type: 'accessory',
        slug: 'hjc-rpha-11-pro',
        qty: 1,
      },
    ],
    subtotal: 429,
    method: 'card',
    hasScooter: false,
    needsShipping: true,
    shipping: { street: '123 Ayala Ave.', city: 'Makati', province: 'Metro Manila', zip: '1226' },
    status: 'completed',
  },
]

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Order[]) : SEED_ORDERS
    } catch {
      return SEED_ORDERS
    }
  })

  function persist(next: Order[]) {
    setOrders(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const addOrder = useCallback((order: Omit<Order, 'status' | 'date'>) => {
    const newOrder: Order = {
      ...order,
      date: new Date().toISOString(),
      status: 'pending',
    }
    persist([newOrder, ...orders])
  }, [orders])

  const cancelOrder = useCallback((orderNumber: string) => {
    persist(orders.map((o) => o.orderNumber === orderNumber ? { ...o, status: 'cancelled' } : o))
  }, [orders])

  return (
    <OrdersContext.Provider value={{ orders, addOrder, cancelOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  ready: 'Ready for Pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  processing: 'bg-blue-50 text-blue-700',
  ready: 'bg-green-50 text-green-700',
  completed: 'bg-paper-soft text-coal-muted',
  cancelled: 'bg-red-50 text-red-600',
}
