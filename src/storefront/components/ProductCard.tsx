import { Link } from 'react-router-dom'
import { ArrowUpRight, Gauge, Zap, Weight } from 'lucide-react'
import type { Brand, Product } from '../../types'
import ScooterArt from '../../components/ScooterArt'
import { formatPrice, effectivePrice } from '../../lib/format'

interface Props {
  product: Product
  brand?: Brand
}

const specIcons = [Zap, Gauge, Weight]

export default function ProductCard({ product, brand }: Props) {
  const accent = brand?.accent ?? '#F95D0E'
  const onSale = product.salePrice != null && product.salePrice < product.price
  const specs = Object.entries(product.specs).slice(1, 4)

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-paper-line bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
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

        {/* price tag */}
        <span className="absolute bottom-3 right-3 rounded-pill bg-carrot px-3.5 py-1.5 font-display text-sm font-extrabold text-white shadow-glow">
          {formatPrice(effectivePrice(product))}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-2">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
          {brand?.name}
        </span>
        <h3 className="mt-1 font-display text-lg font-bold leading-tight text-coal">
          {product.name}
        </h3>

        {/* spec row */}
        {specs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-paper-line pt-4">
            {specs.map(([k, v], i) => {
              const Icon = specIcons[i] ?? Gauge
              return (
                <span key={k} className="flex items-center gap-1.5 text-xs text-coal-muted" title={k}>
                  <Icon size={15} className="text-carrot" />
                  {v}
                </span>
              )
            })}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          {onSale ? (
            <span className="text-sm text-coal-dim line-through">{formatPrice(product.price)}</span>
          ) : (
            <span className="text-sm text-coal-muted">
              {product.stock > 0 ? 'In stock' : 'Sold out'}
            </span>
          )}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-soft text-coal transition-colors group-hover:bg-carrot group-hover:text-white">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  )
}
