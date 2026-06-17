import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion'
import { ChevronDown, User, ClipboardList, LogOut, LogIn, Check } from 'lucide-react'
import { useAuth } from '../../lib/authContext'

/* Brand marks — lucide dropped its brand icons, so these are inline SVGs. */
const BRAND_PATHS = {
  facebook:
    'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  twitter:
    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  youtube:
    'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
} as const

function BrandIcon({ name, size = 15 }: { name: keyof typeof BRAND_PATHS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={BRAND_PATHS[name]} />
    </svg>
  )
}

const SOCIALS = [
  { name: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
  { name: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
  { name: 'twitter', label: 'X', href: 'https://x.com' },
  { name: 'youtube', label: 'YouTube', href: 'https://youtube.com' },
] as const

const ANNOUNCEMENTS = [
  'Free nationwide delivery on orders over $1,000',
  'Use code VELOCITA at checkout for 15% off',
]

const LANGUAGES = ['English', 'Italiano', 'Español']
const CURRENCIES = ['USD', 'EUR', 'GBP']

const ROLL_MS = 4000

export default function TopBar() {
  return (
    <div className="relative mx-auto flex h-12 max-w-7xl items-center justify-between px-5 text-xs lg:px-8">
      {/* left — socials */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        {SOCIALS.map(({ name, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/55 transition-colors hover:text-carrot"
          >
            <BrandIcon name={name} />
          </a>
        ))}
      </div>

      {/* center — rolling announcement */}
      <AnnouncementTicker />

      {/* right — language · currency · account */}
      <div className="ml-auto flex items-center gap-1">
        <PickerMenu items={LANGUAGES} initial="English" className="hidden lg:block" />
        <PickerMenu items={CURRENCIES} initial="USD" className="hidden lg:block" />
        <AccountMenu />
      </div>
    </div>
  )
}

/* ── center rolling announcement ─────────────────────────── */

function AnnouncementTicker() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((n) => (n + 1) % ANNOUNCEMENTS.length), ROLL_MS)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-5 w-[34rem] max-w-[60vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden sm:block">
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          initial={reduce ? { opacity: 0 } : { y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '-110%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-x-0 whitespace-nowrap text-center font-semibold tracking-wide text-white/85"
        >
          {ANNOUNCEMENTS[i].split('VELOCITA').map((part, idx, arr) => (
            <span key={idx}>
              {part}
              {idx < arr.length - 1 && <span className="text-carrot">VELOCITA</span>}
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/* ── generic dropdown shell ──────────────────────────────── */

function Dropdown({
  trigger,
  align = 'right',
  width = 'w-44',
  children,
}: {
  trigger: React.ReactNode
  align?: 'left' | 'right'
  width?: string
  children: (close: () => void) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-pill px-2.5 py-1.5 font-semibold text-white/70 transition-colors hover:text-white"
      >
        {trigger}
        <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className={`absolute top-full z-50 mt-2 ${align === 'right' ? 'right-0' : 'left-0'} ${width} overflow-hidden rounded-2xl border border-paper-line bg-paper text-coal shadow-lift`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

/* ── language / currency picker ──────────────────────────── */

function PickerMenu({
  items,
  initial,
  className = '',
}: {
  items: string[]
  initial: string
  className?: string
}) {
  const [value, setValue] = useState(initial)
  return (
    <div className={className}>
      <Dropdown trigger={<span>{value}</span>} width="w-36">
        {(close) =>
          items.map((item) => (
            <button
              key={item}
              onClick={() => {
                setValue(item)
                close()
              }}
              className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-paper-soft"
            >
              {item}
              {value === item && <Check size={15} className="text-carrot" />}
            </button>
          ))
        }
      </Dropdown>
    </div>
  )
}

/* ── account menu (moved out of the navbar) ──────────────── */

function AccountMenu() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const triggerLabel = isLoggedIn && user ? user.name.split(' ')[0] : 'Account'

  return (
    <Dropdown
      trigger={
        <span className="flex items-center gap-1.5">
          <User size={15} />
          <span className="hidden sm:inline">{triggerLabel}</span>
        </span>
      }
      width="w-56"
    >
      {(close) =>
        isLoggedIn && user ? (
          <>
            <div className="border-b border-paper-line px-4 py-3">
              <p className="truncate text-sm font-semibold text-coal">{user.name}</p>
              <p className="truncate text-xs text-coal-muted">{user.email}</p>
            </div>
            <Link
              to="/orders"
              onClick={close}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-coal transition-colors hover:bg-paper-soft"
            >
              <ClipboardList size={16} className="text-coal-dim" />
              Manage Orders
            </Link>
            <button
              onClick={() => {
                logout()
                close()
                navigate('/')
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-coal transition-colors hover:bg-paper-soft"
            >
              <LogOut size={16} className="text-coal-dim" />
              Log Out
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              navigate('/sign-in')
              close()
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-coal transition-colors hover:bg-paper-soft"
          >
            <LogIn size={16} className="text-coal-dim" />
            Sign In
          </button>
        )
      }
    </Dropdown>
  )
}
