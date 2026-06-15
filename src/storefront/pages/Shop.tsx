import { useMemo, useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { getProducts, getBrands, getCategories } from '../../data/store'
import { useAsync } from '../../lib/useAsync'
import { effectivePrice } from '../../lib/format'
import type { Brand, Category, Product, ProductType } from '../../types'
import ProductCard from '../components/ProductCard'

type SortKey = 'featured' | 'price-asc' | 'price-desc'

const typeBySlug: Record<string, ProductType> = {
  scooters: 'scooter',
  parts: 'part',
  accessories: 'accessory',
  warranties: 'warranty',
}

export default function Shop() {
  const { type: typeSlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const brandParam = searchParams.get('brand')

  const { data, loading } = useAsync(
    () => Promise.all([getProducts(), getBrands(), getCategories()]),
    [],
  )

  const [activeBrand, setActiveBrand] = useState<string | null>(brandParam)
  const [sort, setSort] = useState<SortKey>('featured')

  useEffect(() => setActiveBrand(brandParam), [brandParam])

  const activeType = typeSlug ? typeBySlug[typeSlug] : null

  const filtered = useMemo(() => {
    if (!data) return []
    const [products, brands] = data as [Product[], Brand[], Category[]]
    const brandId = brands.find((b) => b.slug === activeBrand)?.id ?? null

    const list = products.filter((p) => {
      if (activeType && p.type !== activeType) return false
      if (brandId && p.brandId !== brandId) return false
      return true
    })

    return [...list].sort((a, b) => {
      if (sort === 'price-asc') return effectivePrice(a) - effectivePrice(b)
      if (sort === 'price-desc') return effectivePrice(b) - effectivePrice(a)
      return Number(b.featured) - Number(a.featured)
    })
  }, [data, activeType, activeBrand, sort])

  if (loading || !data) return <ShopSkeleton />
  const [, brands, categories] = data as [Product[], Brand[], Category[]]

  const heading = activeType
    ? categories.find((c) => c.type === activeType)?.name ?? 'Shop'
    : 'All products'

  const setBrand = (slug: string | null) => {
    setActiveBrand(slug)
    const next = new URLSearchParams(searchParams)
    if (slug) next.set('brand', slug)
    else next.delete('brand')
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-8">
      <header className="mb-10">
        <p className="eyebrow">Velocità · Shop</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-coal sm:text-5xl">{heading}</h1>
        <p className="mt-2 text-coal-muted">{filtered.length} products available</p>
      </header>

      {/* filter bar */}
      <div className="mb-10 flex flex-col gap-4 rounded-card border border-paper-line bg-paper p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 hidden items-center gap-1.5 text-sm font-semibold text-coal-dim sm:flex">
            <SlidersHorizontal size={15} /> Brand
          </span>
          <FilterChip active={!activeBrand} onClick={() => setBrand(null)}>
            All
          </FilterChip>
          {brands.map((b) => (
            <FilterChip key={b.id} active={activeBrand === b.slug} onClick={() => setBrand(b.slug)}>
              {b.name}
            </FilterChip>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-pill border border-paper-line bg-paper-soft px-4 py-2 text-sm font-semibold text-coal outline-none focus:border-carrot"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-paper-line py-24 text-center text-coal-muted">
          No products match these filters.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} brand={brands.find((b) => b.id === p.brandId)} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-pill px-4 py-2 text-sm font-semibold transition-all ${
        active ? 'bg-carrot text-white' : 'bg-paper-soft text-coal hover:bg-paper-mute'
      }`}
    >
      {children}
    </button>
  )
}

function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-8">
      <div className="h-12 w-64 animate-pulse rounded-2xl bg-paper-soft" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-card bg-paper-soft" />
        ))}
      </div>
    </div>
  )
}
