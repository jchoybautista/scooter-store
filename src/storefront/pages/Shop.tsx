import { useMemo, useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react'
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
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => setActiveBrand(brandParam), [brandParam])

  const activeType = typeSlug ? typeBySlug[typeSlug] : null

  const filtered = useMemo(() => {
    if (!data) return []
    const [products, brands] = data as [Product[], Brand[], Category[]]
    const brandId = brands.find((b) => b.slug === activeBrand)?.id ?? null

    // Brands that own at least one scooter — used to distinguish scooter brands
    // (Vespa, Lambretta…) from accessory brands (AGV, Pirelli…)
    const scooterBrandIds = new Set(
      products.filter((p) => p.type === 'scooter').map((p) => p.brandId),
    )
    const selectedIsScooterBrand = brandId ? scooterBrandIds.has(brandId) : false

    const list = products.filter((p) => {
      if (activeType && p.type !== activeType) return false
      if (brandId) {
        if (p.brandId === brandId) return true
        // Scooter brand tab: also show universal accessories (helmets, tires)
        // that belong to non-scooter brands so they're always visible
        if (selectedIsScooterBrand && !scooterBrandIds.has(p.brandId) && p.type === 'accessory') return true
        return false
      }
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
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
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

        <div ref={sortRef} className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className={`flex items-center gap-1.5 rounded-pill px-3 py-2 text-sm font-semibold transition-colors ${sortOpen ? 'bg-carrot text-white' : 'bg-paper-soft text-coal hover:bg-paper-mute'}`}
          >
            <ArrowUpDown size={15} />
            Sort
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full z-20 mt-1.5 min-w-[180px] overflow-hidden rounded-xl border border-paper-line bg-paper shadow-lift">
              {([
                ['featured', 'Featured'],
                ['price-asc', 'Price: Low to High'],
                ['price-desc', 'Price: High to Low'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setSort(key); setSortOpen(false) }}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-coal transition-colors hover:bg-paper-soft"
                >
                  {label}
                  {sort === key && <Check size={14} className="text-carrot" />}
                </button>
              ))}
            </div>
          )}
        </div>
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
