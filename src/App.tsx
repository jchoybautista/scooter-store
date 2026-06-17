import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './lib/authContext'
import { CartProvider } from './lib/cartContext'
import { FavoritesProvider } from './lib/favoritesContext'
import { OrdersProvider } from './lib/ordersContext'
import StorefrontLayout from './storefront/StorefrontLayout'
import Home from './storefront/pages/Home'
import Shop from './storefront/pages/Shop'
import ProductDetail from './storefront/pages/ProductDetail'
import Cart from './storefront/pages/Cart'
import Checkout from './storefront/pages/Checkout'
import OrderConfirmed from './storefront/pages/OrderConfirmed'
import ManageOrders from './storefront/pages/ManageOrders'
import OrderDetail from './storefront/pages/OrderDetail'
import Favorites from './storefront/pages/Favorites'
import SignIn from './storefront/pages/SignIn'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <FavoritesProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/sign-in" element={<SignIn />} />
              <Route element={<StorefrontLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:type" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmed" element={<OrderConfirmed />} />
                <Route path="/orders" element={<ManageOrders />} />
                <Route path="/orders/:orderNumber" element={<OrderDetail />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="*" element={<Home />} />
              </Route>
            </Routes>
          </CartProvider>
        </FavoritesProvider>
      </OrdersProvider>
    </AuthProvider>
  )
}
