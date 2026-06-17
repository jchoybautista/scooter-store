export interface Customer {
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

const KEY = 'velocita-customers'

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()

const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    name: 'Juan dela Cruz',
    email: 'juan.delacruz@gmail.com',
    phone: '+63 917 123 4567',
    createdAt: '2024-03-10T08:00:00Z',
    lastLogin: daysAgo(1),
    totalOrders: 4,
    status: 'active',
    avatarColor: '#F95D0E',
  },
  {
    id: 'c-2',
    name: 'Maria Garcia',
    email: 'maria.garcia@yahoo.com',
    phone: '+63 918 234 5678',
    createdAt: '2024-04-05T09:30:00Z',
    lastLogin: daysAgo(3),
    totalOrders: 2,
    status: 'active',
    avatarColor: '#7C3AED',
  },
  {
    id: 'c-3',
    name: 'Roberto Reyes',
    email: 'roberto.reyes@gmail.com',
    phone: '+63 919 345 6789',
    createdAt: '2024-05-20T11:00:00Z',
    lastLogin: daysAgo(7),
    totalOrders: 1,
    status: 'active',
    avatarColor: '#0891B2',
  },
  {
    id: 'c-4',
    name: 'Ana Lim',
    email: 'ana.lim@gmail.com',
    phone: '+63 920 456 7890',
    createdAt: '2024-06-12T14:00:00Z',
    lastLogin: daysAgo(14),
    totalOrders: 3,
    status: 'active',
    avatarColor: '#DB2777',
  },
  {
    id: 'c-5',
    name: 'Carlos Santos',
    email: 'carlos.santos@gmail.com',
    phone: '',
    createdAt: '2024-07-01T08:00:00Z',
    lastLogin: daysAgo(30),
    totalOrders: 1,
    status: 'inactive',
    avatarColor: '#059669',
  },
  {
    id: 'c-6',
    name: 'Isabella Cruz',
    email: 'isabella.cruz@outlook.com',
    phone: '+63 921 567 8901',
    createdAt: '2024-08-15T10:00:00Z',
    lastLogin: daysAgo(5),
    totalOrders: 2,
    status: 'active',
    avatarColor: '#DC2626',
  },
  {
    id: 'c-7',
    name: 'Miguel Torres',
    email: 'miguel.torres@gmail.com',
    phone: '+63 922 678 9012',
    createdAt: '2024-09-22T09:00:00Z',
    lastLogin: daysAgo(2),
    totalOrders: 5,
    status: 'active',
    avatarColor: '#D97706',
  },
  {
    id: 'c-8',
    name: 'Sofia Villanueva',
    email: 'sofia.villanueva@gmail.com',
    phone: '+63 923 789 0123',
    createdAt: '2025-01-10T08:00:00Z',
    lastLogin: 'Never',
    totalOrders: 0,
    status: 'active',
    avatarColor: '#0284C7',
  },
]

export function getCustomers(): Customer[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return SEED_CUSTOMERS.map(c => ({ ...c }))

  try {
    const stored = JSON.parse(raw) as Customer[]
    // Prepend any seed customers not yet in the stored list
    const storedIds = new Set(stored.map(c => c.id))
    const missingSeeds = SEED_CUSTOMERS.filter(s => !storedIds.has(s.id))
    return [...missingSeeds.map(c => ({ ...c })), ...stored]
  } catch {
    return SEED_CUSTOMERS.map(c => ({ ...c }))
  }
}

export function saveCustomers(list: Customer[]): void {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function resetCustomers(): void {
  localStorage.removeItem(KEY)
}
