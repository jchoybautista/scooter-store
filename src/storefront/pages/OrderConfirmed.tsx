import { useEffect, useRef } from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom'
import {
  CheckCircle,
  MapPin,
  Truck,
  CreditCard,
  Smartphone,
  Package,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { formatPrice } from '../../lib/format'
import type { CartItem } from '../../lib/cartContext'
import { useOrders } from '../../lib/ordersContext'

interface OrderState {
  orderNumber: string
  name: string
  email: string
  phone: string
  items: CartItem[]
  subtotal: number
  method: 'card' | 'gcash'
  hasScooter: boolean
  needsShipping: boolean
  branch: { id: string; name: string; address: string; hours: string }
  shipping: { street: string; city: string; province: string; zip: string }
}

export default function OrderConfirmed() {
  const location = useLocation()
  const state = location.state as OrderState | null
  const { addOrder } = useOrders()
  const saved = useRef(false)

  useEffect(() => {
    if (state && !saved.current) {
      saved.current = true
      addOrder(state)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!state) return <Navigate to="/" replace />

  const {
    orderNumber,
    name,
    email,
    items,
    subtotal,
    method,
    hasScooter,
    needsShipping,
    branch,
    shipping,
  } = state

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-32 lg:px-8">

      {/* ── Header ── */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
          <CheckCircle size={40} className="text-green-500" strokeWidth={1.5} />
        </div>
        <p className="eyebrow mb-2">— Order Confirmed —</p>
        <h1 className="font-display text-4xl font-extrabold text-coal sm:text-5xl">Thank you, {name.split(' ')[0]}!</h1>
        <p className="mt-3 text-coal-muted">
          {method === 'gcash'
            ? 'A GCash payment request has been sent to your wallet.'
            : 'Your payment was processed successfully.'}
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-pill bg-paper-soft px-5 py-2">
          <span className="text-sm text-coal-muted">Order number</span>
          <span className="font-display text-sm font-extrabold tracking-widest text-carrot">{orderNumber}</span>
        </div>
      </div>

      <div className="space-y-5">

        {/* ── Items ── */}
        <Card title="Items Ordered">
          <div className="divide-y divide-paper-line">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-paper-soft">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package size={20} className="text-coal-dim" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-coal">{item.name}</p>
                  <p className="text-sm text-coal-muted">Qty {item.qty}</p>
                </div>
                <span className="font-display font-extrabold text-coal">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-paper-line pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-coal-muted">Subtotal</span>
              <span className="font-semibold text-coal">{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm text-coal-muted">Taxes & fees</span>
              <span className="text-sm text-coal-dim">Included</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-paper-line pt-3">
              <span className="font-bold text-coal">Total Paid</span>
              <span className="font-display text-xl font-extrabold text-coal">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </Card>

        {/* ── Delivery / Pickup ── */}
        <Card title={hasScooter ? 'Pickup Details' : 'Delivery Details'}>
          {hasScooter ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-carrot" />
                <div>
                  <p className="font-semibold text-coal">{branch.name}</p>
                  <p className="mt-0.5 text-sm text-coal-muted">{branch.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 flex-shrink-0 text-coal-dim" />
                <p className="text-sm text-coal-muted">{branch.hours}</p>
              </div>
              <div className="mt-2 rounded-2xl bg-carrot-wash px-4 py-3 text-sm text-coal-muted">
                Please bring a valid government ID and proof of payment when collecting your scooter.
              </div>
            </div>
          ) : needsShipping ? (
            <div className="flex items-start gap-3">
              <Truck size={18} className="mt-0.5 flex-shrink-0 text-carrot" />
              <div>
                <p className="font-semibold text-coal">Shipping to</p>
                <p className="mt-0.5 text-sm text-coal-muted">
                  {shipping.street}, {shipping.city}, {shipping.province} {shipping.zip}
                </p>
                <p className="mt-1 text-xs text-coal-dim">Estimated delivery: 3–5 business days</p>
              </div>
            </div>
          ) : null}
        </Card>

        {/* ── Payment ── */}
        <Card title="Payment Method">
          <div className="flex items-center gap-3">
            {method === 'card' ? (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-soft">
                  <CreditCard size={20} className="text-coal-muted" />
                </div>
                <div>
                  <p className="font-semibold text-coal">Credit / Debit Card</p>
                  <p className="text-sm text-coal-muted">Payment processed successfully</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007DFF]">
                  <Smartphone size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-coal">GCash</p>
                  <p className="text-sm text-coal-muted">Payment request sent to your wallet</p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* ── Confirmation sent to ── */}
        <Card title="Confirmation Sent To">
          <p className="font-semibold text-coal">{email}</p>
          <p className="mt-0.5 text-sm text-coal-muted">A copy of this order has been sent to your email.</p>
        </Card>

      </div>

      {/* ── CTAs ── */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-pill bg-carrot px-8 py-3.5 font-bold text-white transition-all hover:bg-carrot-deep hover:shadow-glow"
        >
          Continue shopping <ArrowRight size={18} />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-pill border-2 border-paper-line px-8 py-3.5 font-bold text-coal transition-colors hover:border-coal-dim"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-paper-line bg-paper p-6">
      <h2 className="mb-4 font-display text-base font-extrabold uppercase tracking-widest text-coal-dim">{title}</h2>
      {children}
    </div>
  )
}
