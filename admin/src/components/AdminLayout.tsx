import { useRef, useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Package, Bell, Search,
  ChevronRight, Settings2, LogOut, ShoppingBag, AlertTriangle,
  MapPin, MessageSquare, X, Users, UserCheck, Menu,
} from 'lucide-react'
import { getAdminSession, adminLogout } from '../lib/adminAuth'
import { NotificationsProvider, useNotifications } from '../lib/notificationsContext'
import type { Notification } from '../data/notifications'

const MAIN_NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders',    label: 'Orders',    icon: ClipboardList },
  { to: '/products',  label: 'Products',  icon: Package },
]

const ACCOUNT_NAV = [
  { to: '/settings', label: 'Settings', icon: Settings2 },
]

function getTitle(pathname: string, search: string) {
  if (pathname.startsWith('/orders/'))      return 'Order Detail'
  if (pathname.startsWith('/products/new')) return 'Add Product'
  if (pathname.includes('/edit'))           return 'Edit Product'
  if (pathname === '/settings' && search === '?tab=users')     return 'Users'
  if (pathname === '/settings' && search === '?tab=customers') return 'Customers'
  const map: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/orders':    'Orders',
    '/products':  'Products',
    '/settings':  'Settings',
  }
  return map[pathname] ?? 'Admin'
}

const NOTIF_ICON: Record<Notification['type'], { icon: typeof ShoppingBag; bg: string; color: string }> = {
  order:   { icon: ShoppingBag,    bg: 'bg-blue-50',    color: 'text-blue-500' },
  stock:   { icon: AlertTriangle,  bg: 'bg-carrot-wash', color: 'text-carrot' },
  pickup:  { icon: MapPin,         bg: 'bg-green-50',   color: 'text-green-500' },
  inquiry: { icon: MessageSquare,  bg: 'bg-purple-50',  color: 'text-purple-500' },
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, clear } = useNotifications()

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-paper-line z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-paper-line">
        <span className="text-[13px] font-bold text-coal">Notifications</span>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={clear}
              className="text-[11px] font-semibold text-coal-muted hover:text-carrot transition-colors"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-coal-dim hover:bg-paper-soft transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 gap-3">
          <div className="w-12 h-12 rounded-full bg-paper-soft flex items-center justify-center">
            <Bell size={20} className="text-coal-dim" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-semibold text-coal">All caught up</p>
            <p className="text-[12px] text-coal-muted mt-0.5">No new notifications right now.</p>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-paper-line">
          {notifications.map((n) => {
            const { icon: Icon, bg, color } = NOTIF_ICON[n.type]
            return (
              <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-paper-soft/60 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${bg}`}>
                  <Icon size={14} className={color} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-coal leading-tight">{n.title}</p>
                  <p className="text-[11px] text-coal-muted mt-0.5">{n.subtitle}</p>
                </div>
                <span className="text-[10px] text-coal-dim flex-shrink-0 mt-0.5">{n.time}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function BellButton() {
  const { notifications } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#F0F1F5] text-coal-muted hover:text-coal transition-colors"
      >
        <Bell size={16} />
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-carrot text-white text-[9px] font-bold flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  )
}

function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = getTitle(location.pathname, location.search)
  const session = getAdminSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile nav tap)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname, location.search])

  function handleLogout() {
    adminLogout()
    navigate('/login', { replace: true })
  }

  const closeNav = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-[#F0F1F5]">

      {/* ── Mobile backdrop ──────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeNav}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────── */}
      <aside
        className={`fixed top-0 left-0 h-full w-[220px] bg-[#0F1117] flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-carrot to-carrot-deep flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-black text-lg leading-none">V</span>
            </div>
            <div>
              <div className="text-white font-bold text-[15px] leading-tight tracking-tight">Velocità</div>
              <div className="text-white/30 text-[9px] uppercase tracking-[0.15em] font-semibold">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-white/[0.07]" />

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5 flex flex-col">
          <p className="text-white/25 text-[9px] uppercase tracking-[0.15em] font-bold px-3 mb-3">Main</p>
          {MAIN_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeNav}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'bg-carrot' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon size={14} className={isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'} />
                    </div>
                    {label}
                  </div>
                  {isActive && <ChevronRight size={13} className="text-white/40" />}
                </>
              )}
            </NavLink>
          ))}

          {/* People section */}
          <div className="pt-4">
            <p className="text-white/25 text-[9px] uppercase tracking-[0.15em] font-bold px-3 mb-3">People</p>
            {[
              { to: '/settings?tab=users',     label: 'Users',     icon: Users,      search: '?tab=users' },
              { to: '/settings?tab=customers', label: 'Customers', icon: UserCheck,  search: '?tab=customers' },
            ].map(({ to, label, icon: Icon, search }) => {
              const isActive = location.pathname === '/settings' && location.search === search
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={closeNav}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'bg-carrot' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      <Icon size={14} className={isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'} />
                    </div>
                    {label}
                  </div>
                  {isActive && <ChevronRight size={13} className="text-white/40" />}
                </Link>
              )
            })}
          </div>

          <div className="pt-4 mt-auto">
            <p className="text-white/25 text-[9px] uppercase tracking-[0.15em] font-bold px-3 mb-3">Account</p>
            {ACCOUNT_NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeNav}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isActive ? 'bg-carrot' : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        <Icon size={14} className={isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'} />
                      </div>
                      {label}
                    </div>
                    {isActive && <ChevronRight size={13} className="text-white/40" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom user card */}
        <div className="mx-3 mb-5 rounded-xl bg-white/5 border border-white/[0.07] p-3 flex items-center gap-3">
          <img
            src={session?.avatar ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format'}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-white text-xs font-semibold truncate">
              {session ? `${session.name.split(' ')[0]} ${session.name.split(' ').slice(-1)[0][0]}.` : 'Admin'}
            </div>
            <div className="text-white/35 text-[10px]">{session?.role ?? 'Admin'}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <LogOut size={13} />
          </button>
        </div>
      </aside>

      {/* ── Topbar ──────────────────────────────── */}
      <header className="fixed top-0 left-0 lg:left-[220px] right-0 h-[60px] bg-white/80 backdrop-blur-md border-b border-paper-line flex items-center justify-between px-4 lg:px-6 z-20">
        {/* Left: hamburger (mobile) + breadcrumb */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-coal-muted hover:text-coal hover:bg-[#F0F1F5] transition-colors mr-1"
          >
            <Menu size={18} />
          </button>
          <span className="text-coal-dim text-sm hidden sm:inline">Velocità</span>
          <ChevronRight size={13} className="text-coal-dim hidden sm:inline" />
          <span className="text-coal text-sm font-semibold">{title}</span>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Search — hidden on small mobile */}
          <div className="hidden sm:flex items-center gap-2 bg-[#F0F1F5] rounded-xl px-3 py-2 w-36 lg:w-44">
            <Search size={13} className="text-coal-dim flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-[13px] text-coal placeholder-coal-dim outline-none w-full"
            />
          </div>

          {/* Bell */}
          <BellButton />

          {/* Avatar */}
          <div className="flex items-center gap-2.5 pl-1">
            <img
              src={session?.avatar ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format'}
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-carrot/30"
            />
            <div className="hidden sm:block">
              <div className="text-coal text-[13px] font-semibold leading-tight">
                {session ? `${session.name.split(' ')[0]} ${session.name.split(' ').slice(-1)[0][0]}.` : 'Admin'}
              </div>
              <div className="text-coal-dim text-[10px]">{session?.role ?? 'Admin'}</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ─────────────────────────────── */}
      <main className="ml-0 lg:ml-[220px] mt-[60px] p-4 lg:p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <NotificationsProvider>
      <Layout />
    </NotificationsProvider>
  )
}
