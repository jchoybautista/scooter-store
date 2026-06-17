import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  MapPin,
  Truck,
  CreditCard,
  Smartphone,
  Package,
  Clock,
  ChevronLeft,
  X,
  User,
  Mail,
  Phone,
} from 'lucide-react'
import { useOrders, STATUS_LABEL, STATUS_COLOR, type OrderStatus } from '../../lib/ordersContext'
import { formatPrice } from '../../lib/format'
import CancelOrderModal from '../components/CancelOrderModal'

const STATUS_STEPS: OrderStatus[] = ['pending', 'processing', 'ready', 'completed']

export default function OrderDetail() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { orders, cancelOrder } = useOrders()
  const order = orders.find((o) => o.orderNumber === orderNumber)

  if (!order) return <Navigate to="/orders" replace />

  const canCancel = order.status !== 'cancelled' && order.status !== 'completed'
  const isCancelled = order.status === 'cancelled'
  const activeStep = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status)
  const [showCancel, setShowCancel] = useState(false)

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8">

      {/* Back */}
      <Link
        to="/orders"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-coal-muted transition-colors hover:text-carrot"
      >
        <ChevronLeft size={16} /> Back to orders
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Order</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-wide text-coal sm:text-4xl">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-coal-muted">
            Placed on{' '}
            {new Date(order.date).toLocaleDateString('en-PH', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-pill px-4 py-1.5 text-sm font-bold uppercase tracking-wide ${STATUS_COLOR[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
          {canCancel && (
            <button
              onClick={() => setShowCancel(true)}
              className="flex items-center gap-1.5 rounded-pill border-2 border-paper-line px-4 py-1.5 text-sm font-bold text-coal-muted transition-colors hover:border-red-300 hover:text-red-500"
            >
              <X size={14} /> Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Status tracker */}
      {!isCancelled && (
        <div className="mb-8 rounded-xl2 border border-paper-line bg-paper p-6">
          <h2 className="mb-5 font-display text-sm font-extrabold uppercase tracking-widest text-coal-dim">Order Status</h2>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= activeStep
              const last = i === STATUS_STEPS.length - 1
              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold transition-colors ${
                      done ? 'bg-carrot text-white' : 'bg-paper-mute text-coal-dim'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-center text-[10px] font-bold uppercase tracking-wide leading-tight ${done ? 'text-carrot' : 'text-coal-dim'}`}>
                      {STATUS_LABEL[step]}
                    </span>
                  </div>
                  {!last && (
                    <div className={`mx-1 mb-5 h-0.5 flex-1 transition-colors ${i < activeStep ? 'bg-carrot' : 'bg-paper-mute'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="mb-8 rounded-xl2 border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-600">This order has been cancelled.</p>
          <p className="mt-1 text-sm text-red-500">If you paid online, a refund will be processed within 5–7 business days.</p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

        {/* Left column */}
        <div className="space-y-5">

          {/* Items */}
          <Section title="Items Ordered">
            <div className="divide-y divide-paper-line">
              {order.items.map((item) => (
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
                    <Link to={`/product/${item.slug}`} className="truncate font-semibold text-coal hover:text-carrot">
                      {item.name}
                    </Link>
                    <p className="text-sm text-coal-muted">Qty {item.qty} · {formatPrice(item.price)} each</p>
                  </div>
                  <span className="font-display font-extrabold text-coal">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-paper-line pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-coal-muted">Subtotal</span>
                <span className="font-semibold text-coal">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-coal-muted">Taxes & fees</span>
                <span className="text-coal-dim">Included</span>
              </div>
              <div className="flex justify-between border-t border-paper-line pt-2">
                <span className="font-bold text-coal">Total</span>
                <span className="font-display text-lg font-extrabold text-coal">{formatPrice(order.subtotal)}</span>
              </div>
            </div>
          </Section>

          {/* Delivery / Pickup */}
          <Section title={order.hasScooter ? 'Pickup Details' : 'Delivery Details'}>
            {order.hasScooter && order.branch ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0 text-carrot" />
                  <div>
                    <p className="font-semibold text-coal">{order.branch.name}</p>
                    <p className="mt-0.5 text-sm text-coal-muted">{order.branch.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 flex-shrink-0 text-coal-dim" />
                  <p className="text-sm text-coal-muted">{order.branch.hours}</p>
                </div>
                {!isCancelled && (
                  <div className="rounded-2xl bg-carrot-wash px-4 py-3 text-sm text-coal-muted">
                    Please bring a valid government ID and proof of payment when collecting your scooter.
                  </div>
                )}
              </div>
            ) : order.needsShipping && order.shipping ? (
              <div className="flex items-start gap-3">
                <Truck size={18} className="mt-0.5 flex-shrink-0 text-carrot" />
                <div>
                  <p className="font-semibold text-coal">Shipping to</p>
                  <p className="mt-0.5 text-sm text-coal-muted">
                    {order.shipping.street}, {order.shipping.city}, {order.shipping.province} {order.shipping.zip}
                  </p>
                  {!isCancelled && (
                    <p className="mt-1 text-xs text-coal-dim">Estimated delivery: 3–5 business days</p>
                  )}
                </div>
              </div>
            ) : null}
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Contact */}
          <Section title="Contact">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User size={15} className="flex-shrink-0 text-coal-dim" />
                <span className="font-semibold text-coal">{order.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} className="flex-shrink-0 text-coal-dim" />
                <span className="text-coal-muted">{order.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} className="flex-shrink-0 text-coal-dim" />
                <span className="text-coal-muted">+63 {order.phone}</span>
              </div>
            </div>
          </Section>

          {/* Payment */}
          <Section title="Payment">
            <div className="flex items-center gap-3">
              {order.method === 'card' ? (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-soft">
                    <CreditCard size={18} className="text-coal-muted" />
                  </div>
                  <div>
                    <p className="font-semibold text-coal">Credit / Debit Card</p>
                    <p className="text-xs text-coal-muted">Payment processed</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#007DFF]">
                    <Smartphone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-coal">GCash</p>
                    <p className="text-xs text-coal-muted">Payment via wallet</p>
                  </div>
                </>
              )}
            </div>
          </Section>

        </div>
      </div>

      {showCancel && (
        <CancelOrderModal
          orderNumber={order.orderNumber}
          onConfirm={() => cancelOrder(order.orderNumber)}
          onClose={() => setShowCancel(false)}
        />
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-paper-line bg-paper p-6">
      <h2 className="mb-4 font-display text-sm font-extrabold uppercase tracking-widest text-coal-dim">{title}</h2>
      {children}
    </div>
  )
}
