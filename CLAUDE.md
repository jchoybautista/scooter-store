# Velocità Scooter Store — Project Context

## What This Is

A fictional premium scooter storefront called **Velocità**. Built as a React 19 + TypeScript + Vite + Tailwind CSS v3 SPA. No backend — all product data is seeded in-memory. The visual identity is Italian-premium: orange (`#F95D0E` = `carrot`) as the accent color, dark navy (`night`) as secondary.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v3** — custom tokens in `tailwind.config.js`
- **React Router v6** for client-side routing
- **Lucide React** for icons
- **localStorage** for cart and favorites persistence

## Design Tokens (Tailwind)

Key custom colors defined in `tailwind.config.js`:

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

## Project Structure

```
src/
  App.tsx                  — Routes + context providers (FavoritesProvider > CartProvider)
  types.ts                 — Product, Brand, CartItem interfaces
  data/
    seed.ts                — All product/brand data (in-memory)
    store.ts               — Async wrappers (getProducts, getBrands, getProductBySlug)
  lib/
    branches.ts            — Metro Manila pickup branch list (used in Cart + ProductDetail)
    cartContext.tsx         — CartProvider with localStorage; addItem, removeItem, updateQty, clearCart
    favoritesContext.tsx    — FavoritesProvider with localStorage; toggle, isFav, ids (Set<string>)
    format.ts              — formatPrice, effectivePrice helpers
    useAsync.ts            — Generic async data hook
  components/
    Logo.tsx               — SVG logo
    ScooterArt.tsx         — Renders product image or fallback art
  storefront/
    StorefrontLayout.tsx   — Navbar + Outlet + Footer wrapper
    components/
      Navbar.tsx           — Fixed navbar: Logo + nav links left, phone + heart + cart right
      ProductCard.tsx      — Reusable card used in Shop, Favorites, FleetCarousel
      FleetCarousel.tsx    — "Choose Your Scooter" carousel on Home — uses ProductCard
      HeroSection.tsx
      TestimonialsSection.tsx
    pages/
      Home.tsx             — Landing page: Hero, Fleet carousel, Testimonials
      Shop.tsx             — Product grid with type + brand filters
      ProductDetail.tsx    — Full product page with gallery, color selector, specs, cart CTA
      Cart.tsx             — Cart page with qty stepper, branch picker, order summary
      Favorites.tsx        — Saved products grid
```

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
- "Add to favorites" toggle button (replaces "Keep browsing")

### Favorites
- Heart icon in top-right of every ProductCard thumbnail (toggle)
- Tooltip: "Add to favorites" / "Remove from favorites"
- Navbar heart icon fills orange (`fill-carrot`) when any favorites exist — no badge count
- `/favorites` route shows saved items grid

### Testimonials (Home.tsx) — "Editorial Spotlight"
- Full-width dark band (`#0E0E12`), matching the "How it works" section
- One testimonial shown at a time: large rider portrait (rounded `28px`, `4/5` aspect) on the left, pull-quote on the right
- Pull-quote in `font-display` `text-2xl` white; orange filled Lucide `Quote` icon above it; 5 carrot stars; name + `tag` sub-label (e.g. "Vespa GTS owner")
- Navigation: avatar rail centered at bottom (active avatar gets `ring-carrot`) flanked by prev/next arrows
- Each testimonial has a `tag` field — a short descriptor derived from its review text

## Routes

| Path | Component |
|---|---|
| `/` | Home |
| `/shop` | Shop (all products) |
| `/shop/:type` | Shop filtered by type (scooters, parts, accessories) |
| `/product/:slug` | ProductDetail |
| `/cart` | Cart |
| `/favorites` | Favorites |
| `*` | Home (fallback) |

## Pickup Branches (branches.ts)

Five Metro Manila branches: Pasig, Makati, BGC, Quezon City, Mandaluyong.

## What NOT to Do

- Don't add a badge count to the favorites heart in the navbar (user explicitly does not want it)
- Don't show the pickup branch select on non-scooter products
