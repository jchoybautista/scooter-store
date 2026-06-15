import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  MapPin,
  Clock,
  ChevronDown,
  Check,
  Package,
} from 'lucide-react'
import { useCart } from '../../lib/cartContext'
import { formatPrice } from '../../lib/format'
import { BRANCHES } from '../../lib/branches'

export default function Cart() {
  const { items, removeItem, updateQty, subtotal, count } = useCart()
  const [branch, setBranch] = useState(BRANCHES[0].id)
  const [branchOpen, setBranchOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const hasScooter = items.some((i) => i.type === 'scooter')
  const selectedBranch = BRANCHES.find((b) => b.id === branch)!

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-5 pt-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-paper-soft">
          <ShoppingBag size={36} className="text-coal-dim" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-coal">Your cart is empty</h1>
        <p className="mt-3 max-w-sm text-coal-muted">
          Browse our collection of premium scooters, parts, and accessories to find your perfect ride.
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

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-5 pt-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
          <Check size={36} className="text-green-600" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold text-coal">Inquiry submitted!</h1>
        <p className="mt-3 max-w-sm text-coal-muted">
          Our team will reach out within 24 hours to confirm your order and arrange details
          {hasScooter ? ` at the ${selectedBranch.name}` : ''}.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-pill bg-carrot px-7 py-3.5 font-bold text-white transition-all hover:bg-carrot-deep hover:shadow-glow"
        >
          Continue shopping <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-8">
      <header className="mb-10">
        <p className="eyebrow">Velocità · Cart</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-coal sm:text-5xl">Your cart</h1>
        <p className="mt-2 text-coal-muted">
          {count} {count === 1 ? 'item' : 'items'} selected
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Items list */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-xl2 border border-paper-line bg-paper p-4 sm:gap-6 sm:p-5"
            >
              <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                <div className="h-20 w-20 overflow-hidden rounded-2xl bg-paper-soft sm:h-24 sm:w-24">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package size={28} className="text-coal-dim" />
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {item.type === 'scooter' && (
                      <span className="mb-1.5 inline-block rounded-pill bg-carrot-wash px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-carrot">
                        Pickup required
                      </span>
                    )}
                    <Link to={`/product/${item.slug}`}>
                      <h3 className="font-display text-base font-bold leading-snug text-coal transition-colors hover:text-carrot sm:text-lg">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="mt-0.5 text-sm font-semibold text-carrot">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-coal-dim transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center overflow-hidden rounded-xl border border-paper-line bg-paper-soft">
                    <button
                      onClick={() =>
                        item.qty === 1
                          ? removeItem(item.productId)
                          : updateQty(item.productId, item.qty - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-coal-muted transition-colors hover:text-coal"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-coal">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center text-coal-muted transition-colors hover:text-coal"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-display text-base font-extrabold text-coal">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Scooter pickup notice */}
          {hasScooter && (
            <div className="rounded-xl2 border border-carrot/20 bg-carrot-wash p-5">
              <div className="flex gap-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-carrot" />
                <div>
                  <p className="text-sm font-bold text-coal">In-branch pickup required for scooters</p>
                  <p className="mt-1 text-sm leading-relaxed text-coal-muted">
                    Scooter purchases require an in-person visit to process LTO registration paperwork
                    and complete vehicle documentation. Please bring a valid government ID and proof of
                    payment to your chosen branch.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-xl2 border border-paper-line bg-paper p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl font-extrabold text-coal">Order Summary</h2>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-coal-muted">
                Subtotal ({count} {count === 1 ? 'item' : 'items'})
              </span>
              <span className="font-semibold text-coal">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-coal-muted">Taxes & fees</span>
              <span className="font-semibold text-coal-dim">Calculated at pickup</span>
            </div>
          </div>

          <div className="my-5 border-t border-paper-line" />

          <div className="flex items-center justify-between">
            <span className="font-semibold text-coal">Estimated Total</span>
            <span className="font-display text-xl font-extrabold text-coal">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Branch selector — only when cart has a scooter */}
          {hasScooter && (
            <div className="mt-6 rounded-2xl border border-paper-line bg-paper-soft p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-coal-dim">
                Pickup Branch
              </p>
              <div className="relative">
                <button
                  onClick={() => setBranchOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-xl border border-paper-line bg-paper px-4 py-3 text-left text-sm font-semibold text-coal transition-colors hover:border-coal-dim"
                >
                  <span>{selectedBranch.name}</span>
                  <ChevronDown
                    size={15}
                    className={`text-coal-dim transition-transform duration-200 ${branchOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {branchOpen && (
                  <div className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-paper-line bg-paper shadow-lift">
                    {BRANCHES.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setBranch(b.id)
                          setBranchOpen(false)
                        }}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-paper-soft"
                      >
                        <span
                          className={`font-semibold ${branch === b.id ? 'text-carrot' : 'text-coal'}`}
                        >
                          {b.name}
                        </span>
                        {branch === b.id && <Check size={13} className="text-carrot" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs text-coal-muted">
                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-coal-dim" />
                {selectedBranch.address}
              </div>
              <div className="mt-1.5 flex items-start gap-2 text-xs text-coal-muted">
                <Clock size={13} className="mt-0.5 flex-shrink-0 text-coal-dim" />
                {selectedBranch.hours}
              </div>
            </div>
          )}

          <button
            onClick={() => setSubmitted(true)}
            className="mt-5 w-full rounded-pill bg-carrot py-4 font-bold text-white transition-all hover:bg-carrot-deep hover:shadow-glow"
          >
            {hasScooter ? 'Submit Inquiry' : 'Place Order'}
          </button>
          <Link
            to="/shop"
            className="mt-3 block text-center text-sm font-semibold text-coal-muted transition-colors hover:text-carrot"
          >
            ← Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
