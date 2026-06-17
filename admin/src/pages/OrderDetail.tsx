import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Truck, CreditCard, Smartphone, Package } from 'lucide-react'
import { getOrders, updateOrderStatus, type AdminOrder } from '../data/orders'
import { formatPrice } from '../lib/format'
import SelectField from '../components/SelectField'

type StatusKey = AdminOrder['status']

const STATUS_COLORS: Record<StatusKey, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  ready: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STEPPER_STEPS: StatusKey[] = ['pending', 'processing', 'ready', 'completed']

const STATUS_OPTIONS: StatusKey[] = ['pending', 'processing', 'ready', 'completed', 'cancelled']

function StatusBadge({ status }: { status: StatusKey }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PH', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OrderDetail() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<AdminOrder | null>(null)

  useEffect(() => {
    const orders = getOrders()
    const found = orders.find((o) => o.orderNumber === orderNumber)
    setOrder(found ?? null)
  }, [orderNumber])

  function handleStatusChange(status: StatusKey) {
    if (!order) return
    updateOrderStatus(order.orderNumber, status)
    setOrder({ ...order, status })
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-coal-muted">Order not found.</div>
      </div>
    )
  }

  const isFinal = order.status === 'completed' || order.status === 'cancelled'
  const currentStepIndex = STEPPER_STEPS.indexOf(order.status)

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 rounded-lg text-coal-muted hover:text-coal hover:bg-white border border-paper-line transition-colors"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-coal">{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <div className="text-coal-muted text-sm mt-0.5">{formatDate(order.date)}</div>
          </div>
        </div>

        {!isFinal && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-coal-muted font-medium">Update Status:</label>
            <SelectField
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as StatusKey)}
              className="border border-paper-line rounded-lg pl-3 py-2 text-sm text-coal bg-white focus:outline-none focus:ring-2 focus:ring-carrot"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </SelectField>
          </div>
        )}
      </div>

      {/* Status stepper / cancelled banner */}
      {order.status === 'cancelled' ? (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700 font-medium">
          This order has been cancelled.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-paper-line px-6 py-5">
          <div className="flex items-center">
            {STEPPER_STEPS.map((step, idx) => {
              const isCompleted = currentStepIndex > idx
              const isCurrent = currentStepIndex === idx
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                        isCompleted
                          ? 'bg-carrot border-carrot text-white'
                          : isCurrent
                          ? 'border-carrot text-carrot bg-carrot-wash'
                          : 'border-paper-line text-coal-dim bg-white'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-xs font-medium capitalize whitespace-nowrap ${
                        isCurrent ? 'text-carrot' : isCompleted ? 'text-coal' : 'text-coal-dim'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {idx < STEPPER_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-3 mb-5 ${
                        currentStepIndex > idx ? 'bg-carrot' : 'bg-paper-line'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-5">
        {/* Items — spans 2 cols */}
        <div className="col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-paper-line overflow-hidden">
            <div className="px-5 py-4 border-b border-paper-line">
              <h2 className="text-sm font-semibold text-coal">Order Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-paper-line">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Product</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Qty</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Unit Price</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.productId} className="border-b border-paper-line last:border-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-paper-soft border border-paper-line flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <Package size={16} className="text-coal-dim" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-coal">{item.name}</div>
                          <div className="text-xs text-coal-muted capitalize">{item.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-coal">{item.qty}</td>
                    <td className="px-5 py-4 text-right text-coal-muted">{formatPrice(item.price)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-coal">{formatPrice(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Summary rows */}
            <div className="border-t border-paper-line px-5 py-4 space-y-2">
              <div className="flex justify-between text-sm text-coal-muted">
                <span>Subtotal</span>
                <span className="text-coal">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-coal-muted">
                <span>Taxes</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-base font-bold text-coal border-t border-paper-line pt-2 mt-2">
                <span>Total</span>
                <span className="text-carrot">{formatPrice(order.subtotal)}</span>
              </div>
            </div>
          </div>

          {/* Delivery / Pickup */}
          <div className="bg-white rounded-xl border border-paper-line p-5">
            <div className="flex items-center gap-2 mb-4">
              {order.hasScooter ? (
                <MapPin size={16} className="text-carrot" />
              ) : (
                <Truck size={16} className="text-blue-500" />
              )}
              <h2 className="text-sm font-semibold text-coal">
                {order.hasScooter ? 'Pickup Branch' : 'Shipping Address'}
              </h2>
            </div>
            {order.hasScooter && order.branch ? (
              <div className="space-y-1">
                <div className="font-medium text-coal">{order.branch.name}</div>
                <div className="text-sm text-coal-muted">{order.branch.address}</div>
                <div className="text-xs text-coal-dim">{order.branch.hours}</div>
              </div>
            ) : order.shipping ? (
              <div className="space-y-1">
                <div className="font-medium text-coal">{order.shipping.street}</div>
                <div className="text-sm text-coal-muted">
                  {order.shipping.city}, {order.shipping.province} {order.shipping.zip}
                </div>
              </div>
            ) : (
              <div className="text-sm text-coal-muted">No delivery information.</div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Contact */}
          <div className="bg-white rounded-xl border border-paper-line p-5">
            <h2 className="text-sm font-semibold text-coal mb-3">Customer</h2>
            <div className="space-y-2.5">
              <div>
                <div className="text-xs text-coal-muted mb-0.5">Name</div>
                <div className="text-sm font-medium text-coal">{order.name}</div>
              </div>
              <div>
                <div className="text-xs text-coal-muted mb-0.5">Email</div>
                <div className="text-sm text-coal break-all">{order.email}</div>
              </div>
              <div>
                <div className="text-xs text-coal-muted mb-0.5">Phone</div>
                <div className="text-sm text-coal">+63 {order.phone}</div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-paper-line p-5">
            <h2 className="text-sm font-semibold text-coal mb-3">Payment</h2>
            <div className="flex items-center gap-2">
              {order.method === 'card' ? (
                <>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CreditCard size={15} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-coal">Credit / Debit Card</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Smartphone size={15} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-coal">GCash</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
