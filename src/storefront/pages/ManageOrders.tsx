import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ChevronRight, X, Package } from 'lucide-react'
import { useOrders, STATUS_LABEL, STATUS_COLOR } from '../../lib/ordersContext'
import { formatPrice } from '../../lib/format'
import CancelOrderModal from '../components/CancelOrderModal'

export default function ManageOrders() {
  const { orders, cancelOrder } = useOrders()
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-32 lg:px-8">
      <header className="mb-10">
        <p className="eyebrow">Velocità · Account</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-coal sm:text-5xl">My Orders</h1>
        <p className="mt-2 text-coal-muted">{orders.length} {orders.length === 1 ? 'order' : 'orders'} placed</p>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-paper-soft">
            <ShoppingBag size={36} className="text-coal-dim" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-extrabold text-coal">No orders yet</h2>
          <p className="mt-2 max-w-sm text-coal-muted">
            Once you place an order it will appear here. Start browsing our collection!
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-pill bg-carrot px-7 py-3.5 font-bold text-white transition-all hover:bg-carrot-deep hover:shadow-glow"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const canCancel = order.status !== 'cancelled' && order.status !== 'completed'
            const previewItems = order.items.slice(0, 3)
            const extra = order.items.length - 3

            return (
              <div
                key={order.orderNumber}
                className="rounded-xl2 border border-paper-line bg-paper p-5 transition-shadow hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: order meta */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-extrabold tracking-widest text-carrot">
                        {order.orderNumber}
                      </span>
                      <span className={`rounded-pill px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${STATUS_COLOR[order.status]}`}>
                        {STATUS_LABEL[order.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-coal-muted">
                      {new Date(order.date).toLocaleDateString('en-PH', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                      {' · '}
                      {order.items.reduce((s, i) => s + i.qty, 0)} {order.items.reduce((s, i) => s + i.qty, 0) === 1 ? 'item' : 'items'}
                      {' · '}
                      <span className="font-semibold text-coal">{formatPrice(order.subtotal)}</span>
                    </p>
                  </div>

                  {/* Right: actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    {canCancel && (
                      <button
                        onClick={(e) => { e.preventDefault(); setCancelTarget(order.orderNumber) }}
                        className="flex h-9 items-center gap-1.5 rounded-pill border border-paper-line px-3 text-xs font-bold text-coal-muted transition-colors hover:border-red-300 hover:text-red-500"
                      >
                        <X size={13} /> Cancel
                      </button>
                    )}
                    <Link
                      to={`/orders/${order.orderNumber}`}
                      className="flex h-9 items-center gap-1 rounded-pill bg-paper-soft px-3 text-xs font-bold text-coal transition-colors hover:bg-paper-mute"
                    >
                      View <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Item thumbnails */}
                <div className="mt-4 flex items-center gap-2">
                  {previewItems.map((item) => (
                    <div
                      key={item.productId}
                      className="h-12 w-12 overflow-hidden rounded-xl bg-paper-soft"
                      title={item.name}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package size={16} className="text-coal-dim" />
                        </div>
                      )}
                    </div>
                  ))}
                  {extra > 0 && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-paper-soft text-xs font-bold text-coal-muted">
                      +{extra}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {cancelTarget && (
        <CancelOrderModal
          orderNumber={cancelTarget}
          onConfirm={() => cancelOrder(cancelTarget)}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </div>
  )
}
