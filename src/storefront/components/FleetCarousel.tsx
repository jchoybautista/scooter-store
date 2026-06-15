import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Users, Gauge, Zap } from 'lucide-react'
import type { Brand, Product } from '../../types'
import { formatPrice, effectivePrice } from '../../lib/format'
import ScooterArt from '../../components/ScooterArt'

interface Props {
  products: Product[]
  brands: Brand[]
}

function FleetCard({ product, brand }: { product: Product; brand?: Brand }) {
  const price = effectivePrice(product)
  const image = product.images[0]

  const specs = [
    { icon: Users, label: '2 Seat' },
    { icon: Gauge, label: product.specs['Engine'] ?? '—' },
    { icon: Zap, label: product.specs['Top speed'] ?? '—' },
  ]

  return (
    <div className="flex flex-col">
      {/* image — rounded top only */}
      <div className="relative overflow-hidden" style={{ borderRadius: '36px 36px 0 0' }}>
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="aspect-[4/3] w-full bg-paper-soft">
            <ScooterArt product={product} accent={brand?.accent ?? '#F95D0E'} />
          </div>
        )}
      </div>

      {/* orange accent line */}
      <div className="h-[3px] bg-carrot" />

      {/* card body — relative so badge can sit on the orange line */}
      <div className="relative rounded-b-[20px] bg-[#F5F5F5] px-6 pb-8 pt-16">
        {/* price badge — straddles the orange line */}
        <div className="absolute right-6 top-0 z-10 -translate-y-1/2 rounded-2xl bg-white px-5 py-4 text-center shadow-lift">
          <div className="font-display text-3xl font-extrabold leading-none text-carrot">
            {formatPrice(price)}
          </div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-coal-muted">
            / unit
          </div>
          <Link
            to={`/product/${product.slug}`}
            className="mt-3 block px-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#0E0E12' }}
          >
            Detail
          </Link>
        </div>

        <h3 className="font-display text-xl font-bold text-coal">{product.name}</h3>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <s.icon size={17} className="text-carrot" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-coal-dim">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
          <span className="text-carrot">Gasoline</span>
          <span className="text-coal-muted">—</span>
          <span className="text-coal-muted line-through">Electric</span>
          <span className="text-coal-muted">—</span>
          <span className="text-coal-muted line-through">Hybrid</span>
        </div>
      </div>
    </div>
  )
}

export default function FleetCarousel({ products, brands }: Props) {
  const [start, setStart] = useState(0)
  const perPage = 3
  const total = products.length
  const canPrev = start > 0
  const canNext = start + perPage < total

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="mb-14 text-center">
        <p className="eyebrow">— Choose Your Scooter —</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold text-coal">Our Scooter Fleet</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(start, start + perPage).map((p) => (
          <FleetCard
            key={p.id}
            product={p}
            brand={brands.find((b) => b.id === p.brandId)}
          />
        ))}
      </div>

      <div className="mt-14 flex justify-center gap-3">
        <button
          onClick={() => setStart((s) => Math.max(0, s - 1))}
          disabled={!canPrev}
          aria-label="Previous"
          className="flex h-11 w-11 items-center justify-center bg-carrot text-white transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setStart((s) => Math.min(total - perPage, s + 1))}
          disabled={!canNext}
          aria-label="Next"
          className="flex h-11 w-11 items-center justify-center bg-carrot text-white transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}
