import { Link } from 'react-router-dom'

interface Props {
  className?: string
  /** Use light text for dark backgrounds (footer, hero panel). */
  light?: boolean
}

/** Velocità wordmark with a custom speed-mark glyph. */
export default function Logo({ className = '', light = false }: Props) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-carrot text-white transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M4 14h10" opacity="0.55" />
          <path d="M3 18h7" opacity="0.3" />
          <path d="M6 10c4-5 11-5 15 0" />
          <circle cx="18" cy="15" r="2.4" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className={`font-display text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-coal'}`}>
        Veloc<span className="text-carrot">ità</span>
      </span>
    </Link>
  )
}
