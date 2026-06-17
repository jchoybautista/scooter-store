import { Link } from 'react-router-dom'
import { ArrowUpRight, Gauge, Zap, Weight, Heart } from 'lucide-react'
import type { Brand, Product } from '../../types'
import ScooterArt from '../../components/ScooterArt'
import { formatPrice, effectivePrice } from '../../lib/format'
import { useFavorites } from '../../lib/favoritesContext'

interface Props {
  product: Product
  brand?: Brand
  subtitle?: string
}

const specIcons = [Zap, Gauge, Weight]

export default function ProductCard({ product, brand, subtitle }: Props) {
  const accent = brand?.accent ?? '#F95D0E'
  const onSale = product.salePrice != null && product.salePrice < product.price
  const specs = Object.entries(product.specs).slice(1, 4)
  const { isFav, toggle } = useFavorites()

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-paper-line bg-paper transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative m-2.5 overflow-hidden rounded-2xl">
        <div className="aspect-[4/3] overflow-hidden">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <ScooterArt product={product} accent={accent} />
          </div>
        </div>

        {/* badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.featured && (
            <span className="rounded-pill bg-night px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Featured
            </span>
          )}
          {onSale && (
            <span className="rounded-pill bg-carrot px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Sale
            </span>
          )}
        </div>

        {/* heart toggle */}
        <div className="group/fav absolute right-3 top-3">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.id) }}
            aria-label={isFav(product.id) ? 'Remove from favorites' : 'Add to favorites'}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
          >
            <Heart
              size={15}
              className={isFav(product.id) ? 'fill-carrot text-carrot' : 'text-coal-muted'}
            />
          </button>
          <span className="pointer-events-none absolute right-0 top-full mt-1.5 hidden whitespace-nowrap rounded-lg bg-night px-2 py-1 text-[11px] font-semibold text-white group-hover/fav:block">
            {isFav(product.id) ? 'Remove from favorites' : 'Add to favorites'}
          </span>
        </div>

      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
          {brand?.name}
        </span>
        <h3 className="mt-1 font-display text-lg font-bold leading-tight text-coal">
          {product.name}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs font-medium text-coal-dim">{subtitle}</p>
        )}

        {/* spec row */}
        {specs.length > 0 && (
          <div className="mt-3 flex items-center gap-x-4 overflow-hidden border-t border-paper-line pt-3">
            {specs.map(([k, v], i) => {
              const Icon = specIcons[i] ?? Gauge
              return (
                <span key={k} className="flex min-w-0 shrink items-center gap-1.5 text-xs text-coal-muted" title={`${k}: ${v}`}>
                  <Icon size={15} className="shrink-0 text-carrot" />
                  <span className="truncate">{v}</span>
                </span>
              )
            })}
          </div>
        )}

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onSale && (
              <span className="text-sm text-coal-dim line-through">{formatPrice(product.price)}</span>
            )}
            <span className="font-display text-base font-extrabold text-carrot">
              {formatPrice(effectivePrice(product))}
            </span>
            {!onSale && (
              <span className="text-sm text-coal-muted">
                · {product.stock > 0 ? 'In stock' : 'Sold out'}
              </span>
            )}
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-soft text-coal transition-colors group-hover:bg-carrot group-hover:text-white">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  )
}
