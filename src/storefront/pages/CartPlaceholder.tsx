import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'

/**
 * Placeholder for Phase 1. The full cart + checkout (with warranty add-ons and
 * real Supabase orders) is built in Phase 2.
 */
export default function CartPlaceholder() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 pt-32 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-carrot-wash text-carrot">
        <ShoppingBag size={28} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold text-coal">Your cart</h1>
      <p className="mt-3 max-w-md text-coal-muted">
        The shopping cart, warranty add-ons and checkout flow arrive in{' '}
        <span className="font-semibold text-coal">Phase 2</span>. For now, explore the showroom.
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
