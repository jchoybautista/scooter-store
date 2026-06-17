import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Brand, Product } from '../../types'
import ProductCard from './ProductCard'

interface Props {
  products: Product[]
  brands: Brand[]
}

export default function FleetCarousel({ products, brands }: Props) {
  const [page, setPage] = useState(0)
  const perPage = 3
  const total = products.length
  const totalPages = Math.ceil(total / perPage)
  const canPrev = page > 0
  const canNext = page < totalPages - 1

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="mb-14 text-center">
        <p className="eyebrow">— Choose Your Scooter —</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold text-coal">Our Scooter Fleet</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(page * perPage, page * perPage + perPage).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            brand={brands.find((b) => b.id === p.brandId)}
          />
        ))}
      </div>

      <div className="mt-14 flex items-center justify-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={!canPrev}
          aria-label="Previous"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-coal-muted transition-colors hover:border-carrot hover:bg-carrot hover:text-white disabled:opacity-40"
        >
          <ChevronLeft size={17} />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className="relative h-1.5 overflow-hidden rounded-pill transition-all duration-300"
              style={{ width: i === page ? 34 : 10, background: 'rgba(0,0,0,0.15)' }}
            >
              {i === page && (
                <span className="absolute inset-0 rounded-pill bg-carrot" />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={!canNext}
          aria-label="Next"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-paper-line text-coal-muted transition-colors hover:border-carrot hover:bg-carrot hover:text-white disabled:opacity-40"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </section>
  )
}
