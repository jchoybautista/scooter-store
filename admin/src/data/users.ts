export type UserRole = 'admin' | 'editor' | 'viewer'
export type UserStatus = 'active' | 'inactive' | 'pending'

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  jobTitle: string
  role: UserRole
  status: UserStatus
  lastLogin: string
  createdAt: string
  avatarColor: string
}

const KEY = 'velocita_admin_users'

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()

const SEED_USERS: AdminUser[] = [
  // Admins
  {
    id: 'u-1',
    firstName: 'Alex',
    lastName: 'Reyes',
    email: 'alex.reyes@velocita.ph',
    phone: '+63 917 000 0000',
    department: 'IT',
    jobTitle: 'System Administrator',
    role: 'admin',
    status: 'active',
    lastLogin: daysAgo(0),
    createdAt: '2024-01-15T08:00:00Z',
    avatarColor: '#F95D0E',
  },
  {
    id: 'u-2',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@velocita.ph',
    phone: '+63 918 234 5678',
    department: 'Operations',
    jobTitle: 'Operations Manager',
    role: 'admin',
    status: 'active',
    lastLogin: daysAgo(1),
    createdAt: '2024-01-20T09:00:00Z',
    avatarColor: '#7C3AED',
  },
  {
    id: 'u-3',
    firstName: 'Carlo',
    lastName: 'Reyes',
    email: 'carlo.reyes@velocita.ph',
    phone: '+63 919 345 6789',
    department: 'IT',
    jobTitle: 'IT Manager',
    role: 'admin',
    status: 'active',
    lastLogin: daysAgo(2),
    createdAt: '2024-02-01T08:30:00Z',
    avatarColor: '#0891B2',
  },
  // Editors
  {
    id: 'u-4',
    firstName: 'Ana',
    lastName: 'Cruz',
    email: 'ana.cruz@velocita.ph',
    phone: '+63 920 456 7890',
    department: 'Marketing',
    jobTitle: 'Marketing Specialist',
    role: 'editor',
    status: 'active',
    lastLogin: daysAgo(3),
    createdAt: '2024-02-10T10:00:00Z',
    avatarColor: '#DB2777',
  },
  {
    id: 'u-5',
    firstName: 'Mark',
    lastName: 'Dela Torre',
    email: 'mark.delatorre@velocita.ph',
    phone: '+63 921 567 8901',
    department: 'Sales',
    jobTitle: 'Sales Executive',
    role: 'editor',
    status: 'active',
    lastLogin: daysAgo(1),
    createdAt: '2024-02-15T09:30:00Z',
    avatarColor: '#059669',
  },
  {
    id: 'u-6',
    firstName: 'Jasmine',
    lastName: 'Villanueva',
    email: 'jasmine.villanueva@velocita.ph',
    phone: '+63 922 678 9012',
    department: 'Marketing',
    jobTitle: 'Content Manager',
    role: 'editor',
    status: 'active',
    lastLogin: daysAgo(5),
    createdAt: '2024-03-01T08:00:00Z',
    avatarColor: '#DC2626',
  },
  {
    id: 'u-7',
    firstName: 'Ryan',
    lastName: 'Espiritu',
    email: 'ryan.espiritu@velocita.ph',
    phone: '+63 923 789 0123',
    department: 'Sales',
    jobTitle: 'Sales Manager',
    role: 'editor',
    status: 'inactive',
    lastLogin: daysAgo(45),
    createdAt: '2024-03-10T10:30:00Z',
    avatarColor: '#D97706',
  },
  {
    id: 'u-8',
    firstName: 'Carla',
    lastName: 'Magno',
    email: 'carla.magno@velocita.ph',
    phone: '+63 924 890 1234',
    department: 'Customer Support',
    jobTitle: 'Support Lead',
    role: 'editor',
    status: 'active',
    lastLogin: daysAgo(2),
    createdAt: '2024-03-20T09:00:00Z',
    avatarColor: '#0284C7',
  },
  // Viewers
  {
    id: 'u-9',
    firstName: 'Kevin',
    lastName: 'Lim',
    email: 'kevin.lim@velocita.ph',
    phone: '+63 925 901 2345',
    department: 'Customer Support',
    jobTitle: 'Support Agent',
    role: 'viewer',
    status: 'active',
    lastLogin: daysAgo(4),
    createdAt: '2024-04-01T09:00:00Z',
    avatarColor: '#16A34A',
  },
  {
    id: 'u-10',
    firstName: 'Tricia',
    lastName: 'Ocampo',
    email: 'tricia.ocampo@velocita.ph',
    phone: '+63 926 012 3456',
    department: 'Sales',
    jobTitle: 'Sales Associate',
    role: 'viewer',
    status: 'active',
    lastLogin: daysAgo(7),
    createdAt: '2024-04-10T08:00:00Z',
    avatarColor: '#9333EA',
  },
  {
    id: 'u-11',
    firstName: 'Paolo',
    lastName: 'Fernando',
    email: 'paolo.fernando@velocita.ph',
    phone: '+63 927 123 4567',
    department: 'Operations',
    jobTitle: 'Operations Assistant',
    role: 'viewer',
    status: 'active',
    lastLogin: daysAgo(10),
    createdAt: '2024-04-20T10:00:00Z',
    avatarColor: '#0F172A',
  },
  {
    id: 'u-12',
    firstName: 'Diana',
    lastName: 'Soriano',
    email: 'diana.soriano@velocita.ph',
    phone: '+63 928 234 5678',
    department: 'Marketing',
    jobTitle: 'Marketing Associate',
    role: 'viewer',
    status: 'inactive',
    lastLogin: daysAgo(60),
    createdAt: '2024-05-01T09:00:00Z',
    avatarColor: '#BE185D',
  },
  {
    id: 'u-13',
    firstName: 'Angelo',
    lastName: 'Tan',
    email: 'angelo.tan@velocita.ph',
    phone: '+63 929 345 6789',
    department: 'IT',
    jobTitle: 'IT Support',
    role: 'viewer',
    status: 'active',
    lastLogin: daysAgo(3),
    createdAt: '2024-05-10T08:30:00Z',
    avatarColor: '#1D4ED8',
  },
  {
    id: 'u-14',
    firstName: 'Sophia',
    lastName: 'Ramos',
    email: 'sophia.ramos@velocita.ph',
    phone: '+63 930 456 7890',
    department: 'Sales',
    jobTitle: 'Sales Associate',
    role: 'viewer',
    status: 'pending',
    lastLogin: 'Never',
    createdAt: '2024-06-01T09:00:00Z',
    avatarColor: '#7C3AED',
  },
  {
    id: 'u-15',
    firstName: 'Marco',
    lastName: 'Aguilar',
    email: 'marco.aguilar@velocita.ph',
    phone: '+63 931 567 8901',
    department: 'Customer Support',
    jobTitle: 'Support Agent',
    role: 'viewer',
    status: 'active',
    lastLogin: daysAgo(6),
    createdAt: '2024-06-10T10:00:00Z',
    avatarColor: '#0891B2',
  },
]

export function getUsers(): AdminUser[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return SEED_USERS.map((u) => ({ ...u }))
  try { return JSON.parse(raw) } catch { return SEED_USERS.map((u) => ({ ...u })) }
}

export function saveUsers(list: AdminUser[]): void {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function resetUsers(): AdminUser[] {
  localStorage.removeItem(KEY)
  return SEED_USERS.map((u) => ({ ...u }))
}
