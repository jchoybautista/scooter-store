import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Phone, Menu, X } from 'lucide-react'
import Logo from '../../components/Logo'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop/scooters', label: 'Scooters' },
  { to: '/shop/parts', label: 'Parts' },
  { to: '/shop/accessories', label: 'Accessories' },
  { to: '/shop/warranties', label: 'Warranties' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-paper/90 shadow-soft backdrop-blur-xl' : 'bg-paper'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-pill px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'text-carrot' : 'text-coal hover:text-carrot'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="tel:+12021022124"
            className="hidden h-11 items-center gap-2 rounded-pill bg-carrot-wash px-4 text-sm font-bold text-carrot transition-colors hover:bg-carrot hover:text-white md:flex"
          >
            <Phone size={16} />
            +1 202 102 2124
          </a>
          <Link
            to="/cart"
            className="flex h-11 items-center gap-2 rounded-pill bg-night px-4 text-sm font-bold text-white transition-transform hover:scale-105"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Cart</span>
          </Link>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-pill bg-paper-soft text-coal lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-paper-line bg-paper px-5 py-4 lg:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-base font-semibold ${
                  isActive ? 'bg-carrot-wash text-carrot' : 'text-coal'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
