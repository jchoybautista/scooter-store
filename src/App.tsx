import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import StorefrontLayout from './storefront/StorefrontLayout'
import Home from './storefront/pages/Home'
import Shop from './storefront/pages/Shop'
import ProductDetail from './storefront/pages/ProductDetail'
import CartPlaceholder from './storefront/pages/CartPlaceholder'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:type" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPlaceholder />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </>
  )
}
