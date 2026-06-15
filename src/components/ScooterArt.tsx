import { Wrench, ShieldCheck, Package } from 'lucide-react'
import type { Product } from '../types'

interface Props {
  product: Pick<Product, 'images' | 'type' | 'name'>
  accent: string
  className?: string
}

/**
 * Product visual. If a real image URL exists we use it; otherwise we render a
 * branded, generative SVG scene tinted with the brand accent — on a light
 * backdrop to suit the Carntel-style white cards. Real photos can replace this
 * anytime via the product's `images` field.
 */
export default function ScooterArt({ product, accent, className = '' }: Props) {
  if (product.images.length > 0) {
    return (
      <img
        src={product.images[0]}
        alt={product.name}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  const id = product.name.replace(/\W/g, '')
  const Icon = product.type === 'part' ? Wrench : product.type === 'warranty' ? ShieldCheck : Package

  return (
    <div className={`relative h-full w-full overflow-hidden bg-paper-soft ${className}`}>
      <svg viewBox="0 0 360 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`g-${id}`} cx="35%" cy="28%" r="95%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="55%" stopColor={accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`b-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor={accent} stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <rect width="360" height="240" fill="#f6f6f8" />
        <rect width="360" height="240" fill={`url(#g-${id})`} />

        {/* faint grid */}
        <g stroke="#16161a" strokeOpacity="0.04">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 45} y1="0" x2={i * 45} y2="240" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 48} x2="360" y2={i * 48} />
          ))}
        </g>

        {product.type === 'scooter' ? (
          <ScooterGlyph fill={`url(#b-${id})`} accent={accent} />
        ) : (
          <circle cx="180" cy="120" r="62" fill={accent} fillOpacity="0.12" stroke={accent} strokeOpacity="0.35" strokeWidth="1.5" />
        )}
      </svg>

      {product.type !== 'scooter' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Icon size={52} color={accent} strokeWidth={1.6} />
        </div>
      )}
    </div>
  )
}

function ScooterGlyph({ fill, accent }: { fill: string; accent: string }) {
  return (
    <g transform="translate(18,6)">
      <ellipse cx="170" cy="206" rx="150" ry="12" fill="#16161a" opacity="0.08" />

      {/* body */}
      <path
        d="M52 168
           C46 126 60 96 102 94
           L120 94
           C128 80 140 72 156 72
           L286 72
           C306 72 318 86 320 106
           L322 150
           C322 159 315 166 306 166
           L286 166
           C286 140 266 120 240 120
           C214 120 194 140 194 166
           L132 166
           C132 140 112 120 86 120
           C70 120 56 130 52 168 Z"
        fill={fill}
      />
      {/* leg-shield highlight */}
      <path
        d="M60 160 C56 128 68 104 102 102 L116 102 C104 116 98 140 100 160 Z"
        fill="#ffffff"
        opacity="0.28"
      />
      {/* seat */}
      <path d="M196 78 L300 78 C312 78 314 92 300 92 L210 92 Z" fill="#16161a" opacity="0.5" />
      {/* handlebar */}
      <rect x="120" y="58" width="42" height="9" rx="4.5" fill="#16161a" opacity="0.6" />
      <rect x="150" y="58" width="9" height="40" rx="4.5" fill="#16161a" opacity="0.45" />
      {/* headlight */}
      <circle cx="78" cy="118" r="9" fill="#ffffff" />
      <circle cx="78" cy="118" r="9" fill={accent} opacity="0.4" />

      {/* wheels */}
      {[88, 240].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="166" r="38" fill="#16161a" />
          <circle cx={cx} cy="166" r="38" fill="none" stroke={accent} strokeOpacity="0.6" strokeWidth="2" />
          <circle cx={cx} cy="166" r="18" fill="#2a2a32" stroke="#54545e" strokeWidth="2" />
          <circle cx={cx} cy="166" r="4" fill={accent} />
        </g>
      ))}
    </g>
  )
}
