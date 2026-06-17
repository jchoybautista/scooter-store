const KEY = 'velocita-customers'

const AVATAR_COLORS = [
  '#F95D0E', '#7C3AED', '#0891B2', '#DB2777',
  '#059669', '#DC2626', '#D97706', '#0284C7',
]

function colorFromId(id: string): string {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

interface StoredCustomer {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
  lastLogin: string
  totalOrders: number
  status: 'active' | 'inactive'
  avatarColor: string
}

function readAll(): StoredCustomer[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StoredCustomer[]) : []
  } catch {
    return []
  }
}

export function registerCustomer(name: string, email: string, phone = ''): void {
  const existing = readAll()
  if (existing.some(c => c.email === email)) return
  const id = `c-sf-${Date.now()}`
  const customer: StoredCustomer = {
    id,
    name,
    email,
    phone,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    totalOrders: 0,
    status: 'active',
    avatarColor: colorFromId(id),
  }
  localStorage.setItem(KEY, JSON.stringify([customer, ...existing]))
}
