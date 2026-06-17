export interface AdminSession {
  name: string
  email: string
  role: string
  avatar: string
}

const KEY = 'velocita_admin_session'

export const MOCK_ADMIN: AdminSession = {
  name: 'Jonathan Bautista',
  email: 'jchoybautista@gmail.com',
  role: 'Web Admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format',
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AdminSession) : null
  } catch {
    return null
  }
}

export function adminLogin(): AdminSession {
  localStorage.setItem(KEY, JSON.stringify(MOCK_ADMIN))
  return MOCK_ADMIN
}

export function adminLogout(): void {
  localStorage.removeItem(KEY)
}
