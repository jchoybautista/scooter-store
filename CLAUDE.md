# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Velocità Scooter Store — Project Context

## What This Is

A fictional premium scooter storefront called **Velocità** with a companion admin panel. The storefront is a React 19 + TypeScript + Vite + Tailwind CSS v3 SPA. There is no real backend — product data is seeded in-memory and all state (cart, favorites, orders, auth) lives in localStorage. A Supabase integration exists but is optional (see Data Layer below). The visual identity is Italian-premium: orange (`#F95D0E` = `carrot`) as the accent color, dark navy (`night`) as secondary.

## Commands

Run these from the repo root (storefront) or from `admin/` (admin panel):

```bash
# Storefront
npm run dev        # Start dev server (Vite, port 5173)
npm run build      # Type-check + production build
npm run lint       # ESLint
npm run preview    # Serve the production build

# Admin (cd admin/ first)
npm run dev        # Start admin dev server (port 5174 by default)
npm run build
npm run lint
```

There are no tests in this project.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v3** — custom tokens in `tailwind.config.js`
- **React Router v7** for client-side routing
- **Lucide React** for icons
- **Framer Motion** for animations
- **Recharts** for charts (admin dashboard)
- **@supabase/supabase-js** — optional data layer
- **localStorage** for all client-side persistence (cart, favorites, orders, auth)

## Monorepo Layout

```
/                  — Storefront (main app)
admin/             — Admin panel (separate Vite app, basename="/admin")
supabase/          — schema.sql + seed.sql (reference only)
```

## Design Tokens (Tailwind)

Defined in `tailwind.config.js`:

| Token | Value | Use |
|---|---|---|
| `carrot` | `#F95D0E` | Primary accent (CTAs, prices, highlights) |
| `carrot-wash` | `#FFF0E8` | Light orange tint background |
| `carrot-deep` | `#D94E08` | Hover state for carrot buttons |
| `night` | `#0F1117` | Dark navy — secondary buttons, text |
| `coal` | `#1A1D23` | Primary text |
| `coal-muted` | `#6B7280` | Secondary text |
| `coal-dim` | `#9CA3AF` | Tertiary text |
| `paper` | `#FFFFFF` | Card/page background |
| `paper-soft` | `#F8F8F8` | Subtle background |
| `paper-line` | `#E5E7EB` | Borders |
| `shadow-soft` | box-shadow utility | Navbar shadow |
| `shadow-glow` | orange glow | CTA hover |

Custom border radius: `rounded-card`, `rounded-pill`.

## Storefront Structure

```
src/
  App.tsx                    — Routes + context providers (Auth > Orders > Favorites > Cart)
  types.ts                   — Product, Brand, CartItem interfaces
  data/
    seed.ts                  — All product/brand data (in-memory)
    store.ts                 — Async wrappers (getProducts, getBrands, getProductBySlug)
  lib/
    authContext.tsx           — AuthProvider: mocked login/logout, persisted to localStorage
    cartContext.tsx           — CartProvider: addItem, removeItem, updateQty, clearCart
    favoritesContext.tsx      — FavoritesProvider: toggle, isFav, ids (Set<string>)
    ordersContext.tsx         — OrdersProvider: addOrder, cancelOrder; seeds 3 demo orders
    branches.ts              — Metro Manila pickup branch list
    customers.ts             — Customer helper utilities
    supabase.ts              — Supabase client (null when env vars absent)
    format.ts                — formatPrice, effectivePrice helpers
    useAsync.ts              — Generic async data hook
  components/
    Logo.tsx                 — SVG logo
    ScooterArt.tsx           — Renders product image or fallback art
  storefront/
    StorefrontLayout.tsx     — Navbar + TopBar + Outlet + Footer wrapper
    components/
      Navbar.tsx             — Fixed navbar: Logo + nav links left, phone + heart + cart right
      TopBar.tsx             — Announcement bar above navbar
      ProductCard.tsx        — Reusable card used in Shop, Favorites, FleetCarousel
      FleetCarousel.tsx      — "Choose Your Scooter" carousel on Home
      HeroSlider.tsx         — Hero slideshow on Home
      Footer.tsx
      BranchSelect.tsx       — Branch picker dropdown (shared between Cart + ProductDetail)
      CancelOrderModal.tsx   — Confirmation modal for order cancellation
    pages/
      Home.tsx               — Landing page: HeroSlider, FleetCarousel, Testimonials
      Shop.tsx               — Product grid with type + brand filters
      ProductDetail.tsx      — Full product page with gallery, color selector, specs, cart CTA
      Cart.tsx               — Cart with qty stepper, branch picker, order summary
      Checkout.tsx           — Checkout form (name, email, phone, payment method)
      OrderConfirmed.tsx     — Post-checkout confirmation screen
      ManageOrders.tsx       — Order history list
      OrderDetail.tsx        — Single order detail + cancel action
      Favorites.tsx          — Saved products grid
      SignIn.tsx             — Sign-in page (outside StorefrontLayout)
      CartPlaceholder.tsx    — Empty cart state
```

## Admin Panel Structure

Separate Vite app at `admin/`, served under `/admin` basename.

```
admin/src/
  App.tsx          — Routes (login → RequireAuth → AdminLayout)
  pages/
    Login.tsx      — Admin login (session stored in localStorage via adminAuth)
    Dashboard.tsx  — Stats, charts, Philippines map with branch markers
    Orders.tsx     — Order list with status filters
    OrderDetail.tsx
    Products.tsx   — Product list with search
    ProductForm.tsx — Add/edit product form (with image upload)
    Settings.tsx
  components/
    AdminLayout.tsx — Sidebar + Outlet
  lib/
    adminAuth.ts   — getAdminSession / setAdminSession helpers
```

## Routes (Storefront)

| Path | Component |
|---|---|
| `/sign-in` | SignIn (standalone, no layout) |
| `/` | Home |
| `/shop` | Shop (all products) |
| `/shop/:type` | Shop filtered by type |
| `/product/:slug` | ProductDetail |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/order-confirmed` | OrderConfirmed |
| `/orders` | ManageOrders |
| `/orders/:orderNumber` | OrderDetail |
| `/favorites` | Favorites |
| `*` | Home (fallback) |

## Data Layer

The app runs fully on in-memory seed data by default. To enable Supabase, create a `.env` file:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

`src/lib/supabase.ts` exports `isSupabaseConfigured` (boolean) and `supabase` (client or null). Check `isSupabaseConfigured` before using the client.

## Auth

Auth is fully mocked — `authContext.tsx` hardcodes a single user (`MOCK_USER`) and persists login state to localStorage under `velocita-auth`. No real auth provider is wired up.

## Orders

`ordersContext.tsx` seeds 3 demo orders on first load (persisted to `velocita-orders` in localStorage). `OrderStatus` values: `pending | processing | ready | completed | cancelled`. `STATUS_LABEL` and `STATUS_COLOR` maps are exported from the same file.

## Key Conventions

### Product Types
Products have a `type` field: `'scooter' | 'helmet' | 'tire' | 'accessory' | 'part'`.

### Brand Filter Logic (Shop.tsx)
When a scooter brand tab is selected (e.g. Vespa), accessories/helmets/tires from non-scooter brands are also shown — because those brands (AGV, Pirelli, etc.) don't have scooter products of their own. Implemented via `scooterBrandIds` Set.

### Cart
- Scooter items show a "Pickup required" badge
- When a scooter is in the cart, a branch dropdown appears in the order summary
- CTA says "Submit Inquiry" if scooters present, "Place Order" otherwise

### ProductDetail — Scooter-only features
- Color variant selector
- Pickup branch `<select>` dropdown (from `branches.ts`)
- "Add to favorites" toggle button

### Favorites
- Heart icon in top-right of every ProductCard thumbnail (toggle)
- Tooltip: "Add to favorites" / "Remove from favorites"
- Navbar heart icon fills orange (`fill-carrot`) when any favorites exist — no badge count
- `/favorites` route shows saved items grid

### Testimonials (Home.tsx) — "Editorial Spotlight"
- Full-width dark band (`#0E0E12`)
- One testimonial shown at a time: large rider portrait on the left, pull-quote on the right
- Pull-quote in `font-display` `text-2xl` white; orange filled Lucide `Quote` icon above it; 5 carrot stars; name + `tag` sub-label
- Navigation: avatar rail centered at bottom (active avatar gets `ring-carrot`) flanked by prev/next arrows

## Pickup Branches (branches.ts)

Five Metro Manila branches: Pasig, Makati, BGC, Quezon City, Mandaluyong.

## What NOT to Do

- Don't add a badge count to the favorites heart in the navbar (user explicitly does not want it)
- Don't show the pickup branch select on non-scooter products
