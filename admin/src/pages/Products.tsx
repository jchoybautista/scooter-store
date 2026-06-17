import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Eye, Pencil, Trash2, X, Plus } from 'lucide-react'
import {
  getFullProducts,
  deleteFullProduct,
  BRANDS,
  type FullProduct,
} from '../data/fullProducts'
import { formatPrice } from '../lib/format'

type FilterKey = FullProduct['type'] | 'all'

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'scooter',   label: 'Scooters' },
  { key: 'accessory', label: 'Helmets & Accessories' },
  { key: 'part',      label: 'Parts & Tires' },
]

const TYPE_COLORS: Record<string, string> = {
  scooter:   'bg-carrot-wash text-carrot',
  accessory: 'bg-indigo-50 text-indigo-600',
  part:      'bg-purple-50 text-purple-600',
}

function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${TYPE_COLORS[type] ?? 'bg-paper-soft text-coal-muted'}`}>
      {type === 'accessory' ? 'accessory' : type}
    </span>
  )
}

function ProductImage({ src, name }: { src: string | null; name: string }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-paper-soft">
        <Package size={32} className="text-coal-dim" />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-contain p-3"
      onError={() => setBroken(true)}
    />
  )
}

// ── Modals ──────────────────────────────────────────────────

function Backdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coal/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {children}
    </div>
  )
}

interface DisplayProduct {
  id: string
  name: string
  slug: string
  brand: string
  type: FullProduct['type']
  price: number
  image: string | null
  inStock: boolean
  status: 'active' | 'draft'
  featured: boolean
}

function ViewModal({ product, onClose }: { product: DisplayProduct; onClose: () => void }) {
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-paper-line">
          <h2 className="font-semibold text-coal text-[15px]">Product Details</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl text-coal-muted hover:bg-paper-soft transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="h-52 bg-paper-soft flex items-center justify-center overflow-hidden">
          <ProductImage src={product.image} name={product.name} />
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-coal text-[15px] leading-snug">{product.name}</h3>
            <TypeBadge type={product.type} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div className="bg-paper-soft rounded-xl p-3">
              <div className="text-coal-dim text-[10px] uppercase tracking-widest font-semibold mb-1">Brand</div>
              <div className="font-semibold text-coal">{product.brand}</div>
            </div>
            <div className="bg-paper-soft rounded-xl p-3">
              <div className="text-coal-dim text-[10px] uppercase tracking-widest font-semibold mb-1">Price</div>
              <div className="font-bold text-carrot">{formatPrice(product.price)}</div>
            </div>
            <div className="bg-paper-soft rounded-xl p-3">
              <div className="text-coal-dim text-[10px] uppercase tracking-widest font-semibold mb-1">Stock</div>
              <div className={`font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>
            <div className="bg-paper-soft rounded-xl p-3">
              <div className="text-coal-dim text-[10px] uppercase tracking-widest font-semibold mb-1">Status</div>
              <div className={`font-semibold capitalize ${product.status === 'active' ? 'text-green-600' : 'text-coal-muted'}`}>
                {product.status}
              </div>
            </div>
          </div>
          <div className="bg-paper-soft rounded-xl p-3">
            <div className="text-coal-dim text-[10px] uppercase tracking-widest font-semibold mb-1">Slug</div>
            <div className="font-mono text-[11px] text-coal-muted truncate">{product.slug}</div>
          </div>
        </div>
      </div>
    </Backdrop>
  )
}

function DeleteModal({ product, onConfirm, onClose }: { product: DisplayProduct; onConfirm: () => void; onClose: () => void }) {
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-red-500" />
        </div>
        <h2 className="font-bold text-coal text-[16px] mb-2">Delete Product?</h2>
        <p className="text-[13px] text-coal-muted mb-6 leading-relaxed">
          <span className="font-semibold text-coal">"{product.name}"</span> will be removed. Use Reset to restore all products.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-paper-line text-[13px] font-semibold text-coal-muted hover:bg-paper-soft transition-colors">
            Keep
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </Backdrop>
  )
}

// ── Main Page ────────────────────────────────────────────────

type ModalState =
  | { kind: 'none' }
  | { kind: 'view'; product: DisplayProduct }
  | { kind: 'delete'; product: DisplayProduct }

function toDisplay(p: FullProduct): DisplayProduct {
  const brand = BRANDS.find((b) => b.id === p.brandId)?.name ?? p.brandId
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand,
    type: p.type,
    price: p.price,
    image: p.images[0] ?? null,
    inStock: p.stock > 0,
    status: p.status,
    featured: p.featured,
  }
}

export default function Products() {
  const navigate = useNavigate()
  const [prods, setProds] = useState<DisplayProduct[]>([])
  const [filter, setFilter] = useState<FilterKey>('all')
  const [modal, setModal] = useState<ModalState>({ kind: 'none' })

  function load() {
    setProds(getFullProducts().map(toDisplay))
  }

  useEffect(() => { load() }, [])

  const filtered = prods.filter((p) => filter === 'all' || p.type === filter)

  function handleDelete(id: string) {
    deleteFullProduct(id)
    load()
    setModal({ kind: 'none' })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-coal">Products</h1>
          <p className="text-[13px] text-coal-muted mt-0.5">{filtered.length} of {prods.length} products</p>
        </div>
        <button
          onClick={() => navigate('/products/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-carrot text-white text-[13px] font-semibold hover:bg-carrot-deep transition-colors shadow-sm"
        >
          <Plus size={14} />
          Add Product
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-paper-line p-1 w-fit shadow-sm">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
              filter === key
                ? 'bg-carrot text-white shadow-sm'
                : 'text-coal-muted hover:text-coal hover:bg-paper-soft'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl border border-paper-line overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-square bg-paper-soft overflow-hidden">
              <ProductImage src={product.image} name={product.name} />

              {/* Draft badge */}
              {product.status === 'draft' && (
                <div className="absolute top-2 right-2 bg-coal-muted text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Draft
                </div>
              )}

              {/* Hover action overlay */}
              <div className="absolute inset-0 bg-coal/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setModal({ kind: 'view', product })}
                  className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-coal hover:bg-paper-soft transition-colors shadow"
                  title="View"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={() => navigate(`/products/${product.id}/edit`)}
                  className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-coal hover:bg-paper-soft transition-colors shadow"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setModal({ kind: 'delete', product })}
                  className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Out of stock badge */}
              {!product.inStock && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Out of stock
                </div>
              )}
            </div>

            {/* Card body */}
            <div className="p-3">
              <div className="text-[11px] text-coal-dim mb-0.5 font-medium">{product.brand}</div>
              <div className="text-[13px] font-semibold text-coal leading-snug line-clamp-2 mb-2">{product.name}</div>
              <div className="flex items-center justify-between gap-1">
                <TypeBadge type={product.type} />
                <span className="text-[13px] font-bold text-carrot">{formatPrice(product.price)}</span>
              </div>
            </div>

            {/* Bottom action row */}
            <div className="border-t border-paper-line flex divide-x divide-paper-line">
              <button
                onClick={() => setModal({ kind: 'view', product })}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-coal-muted hover:text-coal hover:bg-paper-soft transition-colors"
              >
                <Eye size={12} /> View
              </button>
              <button
                onClick={() => navigate(`/products/${product.id}/edit`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-coal-muted hover:text-carrot hover:bg-carrot-wash transition-colors"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => setModal({ kind: 'delete', product })}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold text-coal-muted hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-paper-soft flex items-center justify-center mb-4">
            <Package size={28} className="text-coal-dim" />
          </div>
          <p className="font-semibold text-coal mb-1">No products found</p>
          <p className="text-[13px] text-coal-muted mb-4">
            {prods.length === 0 ? 'All products have been deleted. Go to Settings → Reset to Default to restore everything.' : 'No products match this filter.'}
          </p>
        </div>
      )}

      {/* Modals */}
      {modal.kind === 'view'   && <ViewModal   product={modal.product} onClose={() => setModal({ kind: 'none' })} />}
      {modal.kind === 'delete' && <DeleteModal product={modal.product} onConfirm={() => handleDelete(modal.product.id)} onClose={() => setModal({ kind: 'none' })} />}
    </div>
  )
}
