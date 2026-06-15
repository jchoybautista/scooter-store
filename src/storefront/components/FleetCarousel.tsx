import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Brand, Product } from '../../types'
import ProductCard from './ProductCard'

interface Props {
  products: Product[]
  brands: Brand[]
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(start, start + perPage).map((p) => (
          <ProductCard
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
