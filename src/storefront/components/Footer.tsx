import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import Logo from '../../components/Logo'

// Lucide dropped brand glyphs (trademark), so we ship our own minimal marks.
const socials: { label: string; path: string }[] = [
  {
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.6 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38Zm6.95-11.4a1.58 1.58 0 1 1-1.57-1.58 1.58 1.58 0 0 1 1.57 1.58Z',
  },
  {
    label: 'YouTube',
    path: 'M23 12s0-3.2-.4-4.74a2.5 2.5 0 0 0-1.76-1.77C19.3 5.1 12 5.1 12 5.1s-7.3 0-8.84.4A2.5 2.5 0 0 0 1.4 7.26C1 8.8 1 12 1 12s0 3.2.4 4.74a2.5 2.5 0 0 0 1.76 1.77c1.54.39 8.84.39 8.84.39s7.3 0 8.84-.4a2.5 2.5 0 0 0 1.76-1.76C23 15.2 23 12 23 12ZM9.75 15.02V8.98L15 12Z',
  },
  {
    label: 'X',
    path: 'M18.9 2H22l-7.6 8.7L23.2 22h-6.9l-5.4-7-6.2 7H1.6l8.1-9.3L1 2h7l4.9 6.5L18.9 2Zm-1.2 18h1.9L7.1 4H5.1Z',
  },
]

const columns = [
  {
    title: 'Shop',
    links: [
      { to: '/shop/scooters', label: 'Scooters' },
      { to: '/shop/parts', label: 'Parts' },
      { to: '/shop/accessories', label: 'Accessories' },
      { to: '/shop/warranties', label: 'Warranties' },
    ],
  },
  {
    title: 'Brands',
    links: [
      { to: '/shop?brand=vespa', label: 'Vespa' },
      { to: '/shop?brand=lambretta', label: 'Lambretta' },
      { to: '/shop?brand=italjet', label: 'Italjet' },
      { to: '/shop?brand=honda', label: 'Honda' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/shop', label: 'About' },
      { to: '/shop', label: 'Showrooms' },
      { to: '/shop', label: 'Financing' },
      { to: '/shop', label: 'Contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-night text-white" style={{ backgroundColor: '#0E0E12' }}>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              Curated luxury scooters, genuine parts, and accessories — delivered with concierge
              service across the city.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-colors hover:bg-carrot hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l, i) => (
                  <li key={i}>
                    <Link to={l.to} className="text-sm text-white/55 transition-colors hover:text-carrot-soft">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* contact / newsletter */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/55">
              <li className="flex items-center gap-2"><Phone size={15} className="text-carrot" /> +1 202 102 2124</li>
              <li className="flex items-center gap-2"><Mail size={15} className="text-carrot" /> hello@velocita.shop</li>
              <li className="flex items-center gap-2"><MapPin size={15} className="text-carrot" /> 24 Via Roma, City</li>
            </ul>
            <form className="mt-5 flex overflow-hidden rounded-pill bg-white/5" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Newsletter email"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <button className="flex items-center justify-center bg-carrot px-4 text-white" aria-label="Subscribe">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-night-line pt-8 sm:flex-row">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} Velocità. A portfolio concept by a UI developer.</p>
          <p className="text-xs text-white/40">Built with React · Tailwind · Supabase · Claude</p>
        </div>
      </div>
    </footer>
  )
}
