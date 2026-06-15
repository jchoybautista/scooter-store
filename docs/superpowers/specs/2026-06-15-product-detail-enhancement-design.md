# Product Detail Page Enhancement — Design Spec

**Date:** 2026-06-15  
**Status:** Approved

---

## Overview

Enhance the existing `ProductDetail` page with a richer shopping experience: multi-image gallery with thumbnails, color and engine selectors, full description, features checklist, FAQ accordion, a "Complete Your Ride" recommended products section, and a contact/inquiry form. Also add new helmet and tire brands and products to the seed data.

---

## Layout

### Top section — 60/40 grid
- **Left (60%):** Photo gallery with thumbnail strip
- **Right (40%):** Brand badge, product name, price, short description, color swatches, engine selector, stock status, CTA buttons, trust badges

### Below top grid — 60/40 grid (aligned with above)
- **Left (60%):** Technical Specifications card
- **Right (40%):** "Inquire with Velocità" contact form card

### Full-width sections (in order below)
1. About This Scooter — extended description paragraphs
2. Features — 3-column checklist with orange checkmark badges
3. General Questions — FAQ accordion (5 questions, store-wide, hardcoded)
4. Complete Your Ride — 4-card recommended products row (helmets + tires)
5. More from [Brand] — existing related products row (unchanged)

**Background:** white, consistent with the rest of the app. No gray page background.

---

## Components

### Photo Gallery
- Main image area renders `product.images[0]` if present, falls back to `<ScooterArt>` SVG
- Thumbnail strip renders each entry in `product.images` + `product.heroImage` (if set)
- Clicking a thumbnail swaps the main image
- Active thumbnail gets an orange border ring

### Color Selector
- Reads `product.colors?: { name: string; hex: string }[]`
- Renders filled circles; selected circle gets an orange outline ring
- Selected color name shown inline: `Color: Midnight Navy`
- If `colors` is undefined or empty, the selector is hidden

### Engine Selector
- Reads `product.engineVariants?: string[]` (e.g. `['125cc', '300cc HPE']`)
- Renders pill buttons; active pill gets orange border + tinted background
- If `engineVariants` is undefined or has one entry, selector is hidden

### Technical Specifications
- Renders all entries in `product.specs` as a 2-column card grid
- Same data as before, just restyled into a dedicated card section below the top grid

### Full Description (`product.longDescription?: string`)
- Optional field; if present, rendered as the "About This Scooter" section
- Supports multiple paragraphs (split on `\n\n`)
- If absent, section is hidden

### Features Checklist (`product.features?: string[]`)
- 3-column grid of items, each with an orange `✓` badge on the left
- If absent, section is hidden

### FAQ Accordion
- **Hardcoded in the component** — same 5 questions on every product page
- Questions:
  1. How do I choose the right scooter for my needs?
  2. Is this scooter available for a test ride?
  3. What warranty does this scooter come with?
  4. Can I trade in my current scooter or motorcycle?
  5. Do you offer financing options?
- First item open by default; clicking toggles open/close with a chevron indicator
- Implemented with local React state (`openIndex`)

### "Complete Your Ride" Recommended Section
- Queries all products, filters to `type === 'accessory' || type === 'part'`, excludes the current product, shuffles or sorts by `createdAt desc`, takes first 4
- Shows brand name, product name, price
- "See all accessories →" link goes to `/shop?type=accessory`
- Only shown when viewing a `type === 'scooter'` product

### Contact / Inquiry Form
- Fields: Name *, Email *, Subject (pre-filled with product name), Message
- Sends `mailto:` link on submit for now (no backend)
- Dark "Send Message →" button

---

## Data Model Changes

### `src/types.ts` — additions to `Product`

```ts
/** Available colour options for this product. */
colors?: { name: string; hex: string }[]

/** Engine / displacement variants available. */
engineVariants?: string[]

/** Extended multi-paragraph description shown in the "About" section. */
longDescription?: string

/** Feature checklist items shown with checkmark badges. */
features?: string[]
```

All fields are optional — existing products without them render gracefully (sections simply hidden).

---

## New Seed Data

### New Brands (`src/data/seed.ts`)

| id | name | country | accent |
|----|------|---------|--------|
| `b-shoei` | Shoei | Japan | `#1a1a2e` |
| `b-arai` | Arai | Japan | `#cc2936` |
| `b-hjc` | HJC | South Korea | `#16a34a` |
| `b-agv` | AGV | Italy | `#1e293b` |
| `b-bell` | Bell | USA | `#d97706` |
| `b-ls2` | LS2 | Spain | `#7c3aed` |
| `b-pirelli` | Pirelli | Italy | `#1e293b` |
| `b-michelin` | Michelin | France | `#ef4444` |

### New Products

**Helmets** (category: `c-accessory`, type: `accessory`) — one per brand, realistic price/specs, transparent PNG image from pngegg CDN as placeholder (to be replaced with licensed assets).

| Name | Brand | Price | Image placeholder |
|------|-------|-------|-------------------|
| Shoei X-14 Marquez Racing Helmet | Shoei | $649 | `https://e7.pngegg.com/…shoei-x-fourteen…png` |
| Arai RX-7V Evo Helmet | Arai | $749 | `https://e7.pngegg.com/…arai-helmet…png` |
| HJC RPHA 11 Pro Helmet | HJC | $429 | generic full-face placeholder |
| AGV K6 Full-Face Helmet | AGV | $489 | `https://e7.pngegg.com/…agv-full-face…png` |
| Bell Race Star Flex DLX | Bell | $549 | `https://e7.pngegg.com/…bell-full-face…png` |
| LS2 FF324 Metro EVO | LS2 | $299 | `https://e7.pngegg.com/…ls2-ff324…png` |

**Tires** (category: `c-part`, type: `part`) — one per brand.

| Name | Brand | Price | Image placeholder |
|------|-------|-------|-------------------|
| Pirelli Angel GT II Tire Set | Pirelli | $239 | `https://e7.pngegg.com/…pirelli-motorcycle-tires…png` |
| Michelin City Grip 2 Tire Set | Michelin | $189 | `https://e7.pngegg.com/…michelin-motorcycle-tires…png` |

### Existing Scooter Updates
Add `colors`, `engineVariants`, `longDescription`, and `features` fields to scooter products in seed data. Each scooter gets:
- 4–5 color options (name + hex)
- 1–2 engine variants where applicable (e.g. Vespa Primavera: `['50cc', '125cc', '150cc']`)
- A 2-paragraph `longDescription`
- 8–12 feature strings

---

## Files Changed

| File | Change |
|------|--------|
| `src/types.ts` | Add 4 optional fields to `Product` |
| `src/data/seed.ts` | Add 8 new brands, 8 new products; enrich existing scooters |
| `src/storefront/pages/ProductDetail.tsx` | Full page rework per layout above |

No new routes, no new files needed beyond these three.

---

## Out of Scope

- Backend for the contact form (mailto for now)
- Real licensed product images (placeholders used)
- Filtering/sorting the recommended section beyond "take first 4 accessories/parts"
- Admin UI for managing colors / variants
