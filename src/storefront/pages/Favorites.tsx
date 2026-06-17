import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import { getProducts, getBrands } from '../../data/store'
import { useAsync } from '../../lib/useAsync'
import { useFavorites } from '../../lib/favoritesContext'
import type { Brand, Product } from '../../types'
import ProductCard from '../components/ProductCard'

export default function Favorites() {
  const { ids } = useFavorites()
  const { data, loading } = useAsync(
    () => Promise.all([getProducts(), getBrands()]),
    [],
  )

  if (loading || !data) return <FavoritesSkeleton />

  const [products, brands] = data as [Product[], Brand[]]
  const favorites = products.filter((p) => ids.has(p.id))

  if (favorites.length === 0) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-5 pt-32 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-paper-soft">
          <Heart size={36} className="text-coal-dim" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-coal">No favorites yet</h1>
        <p className="mt-3 max-w-sm text-coal-muted">
          Browse the shop and tap the heart on any product to save it here.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-pill bg-carrot px-7 py-3.5 font-bold text-white transition-all hover:bg-carrot-deep hover:shadow-glow"
        >
          Browse the collection <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-8">
      <header className="mb-10">
        <p className="eyebrow">Velocità · Favorites</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-coal sm:text-5xl">
          Your Favorites
        </h1>
        <p className="mt-2 text-coal-muted">
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            brand={brands.find((b) => b.id === p.brandId)}
          />
        ))}
      </div>
    </div>
  )
}

function FavoritesSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-8">
      <div className="h-12 w-64 animate-pulse rounded-2xl bg-paper-soft" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-card bg-paper-soft" />
        ))}
      </div>
    </div>
  )
}
