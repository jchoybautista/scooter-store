import { AlertTriangle, X } from 'lucide-react'

interface Props {
  orderNumber: string
  onConfirm: () => void
  onClose: () => void
}

export default function CancelOrderModal({ orderNumber, onConfirm, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-coal/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-paper shadow-lift">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-coal-dim transition-colors hover:bg-paper-soft hover:text-coal"
        >
          <X size={16} />
        </button>

        <div className="p-8">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <AlertTriangle size={28} className="text-red-500" />
          </div>

          <h2 className="text-center font-display text-xl font-extrabold text-coal">
            Cancel Order?
          </h2>
          <p className="mt-2 text-center text-sm leading-relaxed text-coal-muted">
            Are you sure you want to cancel order{' '}
            <span className="font-bold text-coal">{orderNumber}</span>?
            This action cannot be undone.
          </p>

          <div className="mt-7 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-pill border-2 border-paper-line py-3 text-sm font-bold text-coal transition-colors hover:border-coal-dim"
            >
              Keep Order
            </button>
            <button
              onClick={() => { onConfirm(); onClose() }}
              className="flex-1 rounded-pill bg-red-500 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
