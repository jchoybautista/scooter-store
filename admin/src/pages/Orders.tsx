import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Trash2 } from 'lucide-react'
import { getOrders, updateOrderStatus, type AdminOrder } from '../data/orders'
import { formatPrice } from '../lib/format'
import SelectField from '../components/SelectField'

type StatusKey = AdminOrder['status']
type FilterKey = StatusKey | 'all'

const STATUS_COLORS: Record<StatusKey, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  ready: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

const STATUS_OPTIONS: StatusKey[] = ['pending', 'processing', 'ready', 'completed', 'cancelled']

function StatusBadge({ status }: { status: StatusKey }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Orders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [filter, setFilter] = useState<FilterKey>('all')
  const navigate = useNavigate()

  useEffect(() => {
    setOrders(getOrders())
  }, [])

  const filtered = [...orders]
    .filter((o) => filter === 'all' || o.status === filter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  function handleStatusChange(orderNumber: string, status: StatusKey) {
    const updated = updateOrderStatus(orderNumber, status)
    setOrders(updated)
  }

  function handleCancel(orderNumber: string) {
    if (window.confirm(`Cancel order ${orderNumber}?`)) {
      handleStatusChange(orderNumber, 'cancelled')
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-white rounded-xl border border-paper-line p-1 w-fit">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-carrot text-white shadow-sm'
                : 'text-coal-muted hover:text-coal hover:bg-paper-soft'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-paper-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-paper-line">
                <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Order #</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Items</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-coal-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, idx) => (
                <tr key={order.orderNumber} className="border-b border-paper-line last:border-0 hover:bg-paper-soft transition-colors">
                  <td className="px-5 py-3.5 text-coal-dim text-xs">{idx + 1}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-coal font-medium">{order.orderNumber}</td>
                  <td className="px-5 py-3.5 font-medium text-coal">{order.name}</td>
                  <td className="px-5 py-3.5 text-coal-muted text-xs">{order.email}</td>
                  <td className="px-5 py-3.5 text-coal-muted">{order.items.reduce((sum, i) => sum + i.qty, 0)}</td>
                  <td className="px-5 py-3.5 font-semibold text-coal">{formatPrice(order.subtotal)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 text-coal-muted text-xs">{formatDate(order.date)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/orders/${order.orderNumber}`)}
                        className="p-1.5 rounded-lg text-coal-muted hover:text-carrot hover:bg-carrot-wash transition-colors"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <>
                          <SelectField
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.orderNumber, e.target.value as StatusKey)}
                            className="text-xs border border-paper-line rounded-lg pl-2 py-1 text-coal bg-white focus:outline-none focus:ring-1 focus:ring-carrot"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </SelectField>
                          <button
                            onClick={() => handleCancel(order.orderNumber)}
                            className="p-1.5 rounded-lg text-coal-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Cancel"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-coal-muted text-sm">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
