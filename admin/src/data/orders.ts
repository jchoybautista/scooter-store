export interface AdminOrder {
  orderNumber: string
  date: string
  name: string
  email: string
  phone: string
  items: {
    productId: string
    name: string
    slug: string
    image?: string
    price: number
    qty: number
    type: string
  }[]
  subtotal: number
  method: 'card' | 'gcash'
  hasScooter: boolean
  needsShipping: boolean
  branch?: { id: string; name: string; address: string; hours: string }
  shipping?: { street: string; city: string; province: string; zip: string }
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled'
}

const KEY = 'velocita_orders'

const SEED_ORDERS: AdminOrder[] = [
  {
    orderNumber: 'VLT-VESPA1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    name: 'Jonathan Bautista',
    email: 'jchoybautista@gmail.com',
    phone: '9171234567',
    items: [
      {
        productId: 'vespa-gts-300',
        name: 'Vespa GTS 300 Super',
        slug: 'vespa-gts-300-super',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        price: 398000,
        qty: 1,
        type: 'scooter',
      },
    ],
    subtotal: 398000,
    method: 'card',
    hasScooter: true,
    needsShipping: false,
    branch: {
      id: 'bgc',
      name: 'BGC Branch',
      address: '5th Ave corner 26th St, BGC, Taguig',
      hours: 'Mon–Sat 9am–7pm',
    },
    status: 'processing',
  },
  {
    orderNumber: 'VLT-TIRE01',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '9181234567',
    items: [
      {
        productId: 'pirelli-angel',
        name: 'Pirelli Angel GT II',
        slug: 'pirelli-angel-gt-ii',
        image: undefined,
        price: 4800,
        qty: 2,
        type: 'tire',
      },
    ],
    subtotal: 9600,
    method: 'gcash',
    hasScooter: false,
    needsShipping: true,
    shipping: { street: '123 Main St', city: 'Quezon City', province: 'Metro Manila', zip: '1100' },
    status: 'ready',
  },
  {
    orderNumber: 'VLT-HELM1',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    name: 'Carlo Reyes',
    email: 'carlo@example.com',
    phone: '9191234567',
    items: [
      {
        productId: 'hjc-rpha',
        name: 'HJC RPHA 12N Helmet',
        slug: 'hjc-rpha-12n',
        image: undefined,
        price: 18500,
        qty: 1,
        type: 'helmet',
      },
    ],
    subtotal: 18500,
    method: 'card',
    hasScooter: false,
    needsShipping: true,
    shipping: { street: '456 Rizal Ave', city: 'Makati', province: 'Metro Manila', zip: '1200' },
    status: 'completed',
  },
  {
    orderNumber: 'VLT-ACCS1',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    name: 'Ana Reyes',
    email: 'ana.reyes@example.com',
    phone: '9171112222',
    items: [
      {
        productId: 'agv-k6',
        name: 'AGV K6 Full Face Helmet',
        slug: 'agv-k6-full-face',
        image: undefined,
        price: 22000,
        qty: 1,
        type: 'accessory',
      },
    ],
    subtotal: 22000,
    method: 'gcash',
    hasScooter: false,
    needsShipping: true,
    shipping: { street: '789 Santos Ave', city: 'Makati', province: 'Metro Manila', zip: '1210' },
    status: 'pending',
  },
  {
    orderNumber: 'VLT-SCOT2',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    name: 'Miguel Cruz',
    email: 'miguel.cruz@example.com',
    phone: '9209876543',
    items: [
      {
        productId: 'honda-adv-160',
        name: 'Honda ADV 160',
        slug: 'honda-adv-160',
        image: undefined,
        price: 175000,
        qty: 1,
        type: 'scooter',
      },
    ],
    subtotal: 175000,
    method: 'card',
    hasScooter: true,
    needsShipping: false,
    branch: {
      id: 'pasig',
      name: 'Pasig Branch',
      address: 'Ortigas Ave, Pasig City',
      hours: 'Mon–Sat 9am–7pm',
    },
    status: 'processing',
  },
  {
    orderNumber: 'VLT-PART1',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    name: 'Sofia Dela Cruz',
    email: 'sofia.delacruz@example.com',
    phone: '9155556666',
    items: [
      {
        productId: 'ngk-spark-plug',
        name: 'NGK CR8E Spark Plug',
        slug: 'ngk-cr8e-spark-plug',
        image: undefined,
        price: 350,
        qty: 4,
        type: 'part',
      },
    ],
    subtotal: 1400,
    method: 'gcash',
    hasScooter: false,
    needsShipping: true,
    shipping: { street: '22 Taft Ave', city: 'Manila', province: 'Metro Manila', zip: '1000' },
    status: 'completed',
  },
]

export function getOrders(): AdminOrder[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(SEED_ORDERS))
    return SEED_ORDERS
  }
  return JSON.parse(raw) as AdminOrder[]
}

export function updateOrderStatus(orderNumber: string, status: AdminOrder['status']): AdminOrder[] {
  const orders = getOrders()
  const updated = orders.map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o))
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export function resetOrders(): AdminOrder[] {
  localStorage.removeItem(KEY)
  return SEED_ORDERS.map((o) => ({ ...o }))
}
