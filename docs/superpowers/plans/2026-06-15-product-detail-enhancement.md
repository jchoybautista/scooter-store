# Product Detail Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the product detail page with a gallery, color/engine selectors, features checklist, FAQ accordion, contact form, and "Complete Your Ride" recommended section; add helmet and tire brands/products to the seed data.

**Architecture:** Three files change: `src/types.ts` gains 4 optional fields on `Product`; `src/data/seed.ts` gains 8 new brands and 8 new products (6 helmets + 2 tires) plus enriched scooter entries; `src/storefront/pages/ProductDetail.tsx` is rewritten to implement the new layout. No new files, no new routes, no backend.

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS v3, Vite 8, lucide-react, framer-motion. No test suite — verification is `npx tsc --noEmit` (type check) plus `npm run build`.

---

## Task 1: Extend the Product type

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add 4 optional fields to the Product interface**

Open `src/types.ts` and replace the `Product` interface with:

```ts
export interface Product {
  id: string
  name: string
  slug: string
  brandId: string
  categoryId: string
  type: ProductType
  price: number
  /** When set and lower than price, treated as the active sale price. */
  salePrice: number | null
  description: string
  /** Free-form spec sheet, e.g. { Engine: "150cc", "Top speed": "95 km/h" } */
  specs: Record<string, string>
  /** Image URLs. Empty falls back to generated SVG art. */
  images: string[]
  /** Optional transparent-background cutout for the homepage hero slider. */
  heroImage?: string
  stock: number
  featured: boolean
  status: 'active' | 'draft'
  createdAt: string
  /** Available colour options shown as swatches on the detail page. */
  colors?: { name: string; hex: string }[]
  /** Engine / displacement variants (e.g. ['125cc', '300cc HPE']). Hidden when absent or single entry. */
  engineVariants?: string[]
  /** Extended multi-paragraph description for the "About" section. Paragraphs separated by \n\n. */
  longDescription?: string
  /** Feature checklist items shown with orange checkmark badges. */
  features?: string[]
}
```

- [ ] **Step 2: Verify type check passes**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add colors, engineVariants, longDescription, features to Product type"
```

---

## Task 2: Add helmet brands and products to seed data

**Files:**
- Modify: `src/data/seed.ts`

- [ ] **Step 1: Add 6 helmet brands to the `brands` array**

In `src/data/seed.ts`, append the following entries to the `brands` array (after the Honda entry):

```ts
  {
    id: 'b-shoei',
    name: 'Shoei',
    slug: 'shoei',
    country: 'Japan',
    accent: '#1a1a2e',
    description: 'Premium Japanese helmets trusted by MotoGP champions for over six decades.',
  },
  {
    id: 'b-arai',
    name: 'Arai',
    slug: 'arai',
    country: 'Japan',
    accent: '#cc2936',
    description: 'Hand-crafted Japanese helmets, each built and tested to exceed global safety standards.',
  },
  {
    id: 'b-hjc',
    name: 'HJC',
    slug: 'hjc',
    country: 'South Korea',
    accent: '#16a34a',
    description: "The world's best-selling helmet brand — outstanding protection at every price point.",
  },
  {
    id: 'b-agv',
    name: 'AGV',
    slug: 'agv',
    country: 'Italy',
    accent: '#1e293b',
    description: "Valentino Rossi's helmet of choice — Italian craftsmanship and cutting-edge aerodynamics.",
  },
  {
    id: 'b-bell',
    name: 'Bell',
    slug: 'bell',
    country: 'USA',
    accent: '#d97706',
    description: 'American innovators since 1954, pioneers of the full-face helmet and motorsport safety.',
  },
  {
    id: 'b-ls2',
    name: 'LS2',
    slug: 'ls2',
    country: 'Spain',
    accent: '#7c3aed',
    description: 'Spanish-engineered helmets combining lightweight construction with class-leading ventilation.',
  },
```

- [ ] **Step 2: Add 6 helmet products**

Append the following to the `products` array (after the existing accessories section, before the Warranties section):

```ts
  // ── Helmets ───────────────────────────────────────────────
  {
    id: 'p-shoei-x14',
    name: 'Shoei X-14 Marquez Racing Helmet',
    slug: 'shoei-x14-marquez',
    brandId: 'b-shoei',
    categoryId: 'c-accessory',
    type: 'accessory',
    price: 649,
    salePrice: null,
    description:
      'The pinnacle of Shoei engineering. Worn by Marc Márquez in MotoGP, the X-14 delivers elite aerodynamics, an ultra-quiet shell and a ventilation system engineered for race speeds.',
    specs: { Shell: 'AIM+', Weight: '1,350 g', Safety: 'SNELL M2020D', Visor: 'Pinlock EVO lens', Ventilation: '12 intakes' },
    images: [
      'https://e7.pngegg.com/pngimages/180/367/png-clipart-motorcycle-helmets-shoei-x-fourteen-helmet-shoei-x-14-marquez-motegi-2-helmet-shoei-x-14-marquez-4-helmet-motorcycle-helmets-technic-mode-of-transport.png',
    ],
    stock: 8,
    featured: true,
    status: 'active',
    createdAt: daysAgo(3),
  },
  {
    id: 'p-arai-rx7v',
    name: 'Arai RX-7V Evo Helmet',
    slug: 'arai-rx7v-evo',
    brandId: 'b-arai',
    categoryId: 'c-accessory',
    type: 'accessory',
    price: 749,
    salePrice: null,
    description:
      "Hand-built in Japan to standards that exceed every regulation. The RX-7V Evo's round shell deflects impacts rather than absorbing them, delivering unmatched protection for serious riders.",
    specs: { Shell: 'PB-SNC2', Weight: '1,430 g', Safety: 'ECE 22.06 / SNELL', Visor: 'VAS-V Pro Shield', Ventilation: 'Full-face VAS system' },
    images: [
      'https://e7.pngegg.com/pngimages/188/874/png-clipart-ktm-motorcycle-helmet-arai-helmet-limited-safety-helmet-hat-orange.png',
    ],
    stock: 6,
    featured: false,
    status: 'active',
    createdAt: daysAgo(5),
  },
  {
    id: 'p-hjc-rpha11',
    name: 'HJC RPHA 11 Pro Helmet',
    slug: 'hjc-rpha-11-pro',
    brandId: 'b-hjc',
    categoryId: 'c-accessory',
    type: 'accessory',
    price: 429,
    salePrice: null,
    description:
      'The RPHA 11 Pro puts MotoGP-level safety within reach. A premium carbon-composite shell, aggressive aerodynamics and a wide eyeport make it the benchmark in its class.',
    specs: { Shell: 'P.I.M.F Carbon', Weight: '1,250 g', Safety: 'ECE 22.06 / DOT', Visor: 'Pinlock 120 ready', Ventilation: '7 intakes + 4 exhausts' },
    images: [],
    stock: 15,
    featured: false,
    status: 'active',
    createdAt: daysAgo(8),
  },
  {
    id: 'p-agv-k6s',
    name: 'AGV K6 S Full-Face Helmet',
    slug: 'agv-k6-s',
    brandId: 'b-agv',
    categoryId: 'c-accessory',
    type: 'accessory',
    price: 489,
    salePrice: 449,
    description:
      "Valentino Rossi helped design this. The K6 S is AGV's most aerodynamically refined road helmet — ultra-compact, wickedly ventilated and built from a carbon-aramid-fibreglass shell.",
    specs: { Shell: 'Carbon-aramid fibre', Weight: '1,270 g', Safety: 'ECE 22.06 / DOT', Visor: 'Pinlock 120 Max Vision', Ventilation: '4 intakes + 2 exhausts' },
    images: [
      'https://e7.pngegg.com/pngimages/564/331/png-clipart-black-agv-full-face-helmet-motorcycle-helmets-bicycle-helmets-ski-snowboard-helmets-agv-motorcycle-helmets-technic-sports-equipment.png',
    ],
    stock: 12,
    featured: true,
    status: 'active',
    createdAt: daysAgo(1),
  },
  {
    id: 'p-bell-race-star',
    name: 'Bell Race Star Flex DLX',
    slug: 'bell-race-star-flex-dlx',
    brandId: 'b-bell',
    categoryId: 'c-accessory',
    type: 'accessory',
    price: 549,
    salePrice: null,
    description:
      'American innovation at its finest. The Race Star Flex DLX introduces Flex Impact Liner technology — an extra layer that manages rotational energy and linear impact in ways traditional EPS cannot.',
    specs: { Shell: 'Carbon composite', Weight: '1,310 g', Safety: 'ECE 22.06 / SNELL M2020', Visor: 'PhotoChromic lens ready', Ventilation: 'Aero-vac vent system' },
    images: [
      'https://e7.pngegg.com/pngimages/348/17/png-clipart-bell-full-face-helmet-illustration-motorcycle-helmet-bell-sports-motocross-helmet-orange-motorcycle.png',
    ],
    stock: 9,
    featured: false,
    status: 'active',
    createdAt: daysAgo(10),
  },
  {
    id: 'p-ls2-ff324',
    name: 'LS2 FF324 Metro EVO Rapid',
    slug: 'ls2-ff324-metro-evo',
    brandId: 'b-ls2',
    categoryId: 'c-accessory',
    type: 'accessory',
    price: 299,
    salePrice: 269,
    description:
      'Maximum versatility for city and touring riders. The FF324 Metro EVO converts between full-face and modular configurations in seconds, with a sun visor and Pinlock-ready main visor included.',
    specs: { Shell: 'Kinetic Polymer Alloy', Weight: '1,550 g', Safety: 'ECE 22.06', Visor: 'Pinlock 30 included', Type: 'Modular' },
    images: [
      'https://e7.pngegg.com/pngimages/827/442/png-clipart-motorcycle-helmets-ls2-ff324-metro-evo-rapid-matt-black-gloss-yellow-pinlock-visier-motorcycle-helmets-technic-car.png',
    ],
    stock: 20,
    featured: false,
    status: 'active',
    createdAt: daysAgo(13),
  },
```

- [ ] **Step 3: Verify type check passes**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/seed.ts
git commit -m "feat: add Shoei, Arai, HJC, AGV, Bell, LS2 helmet brands and products"
```

---

## Task 3: Add tire brands/products and enrich existing scooters

**Files:**
- Modify: `src/data/seed.ts`

- [ ] **Step 1: Add 2 tire brands to the `brands` array**

Append to the `brands` array (after the LS2 entry added in Task 2):

```ts
  {
    id: 'b-pirelli',
    name: 'Pirelli',
    slug: 'pirelli',
    country: 'Italy',
    accent: '#1e293b',
    description: "Italian performance tires from the brand that defines grip on the world's greatest circuits.",
  },
  {
    id: 'b-michelin',
    name: 'Michelin',
    slug: 'michelin',
    country: 'France',
    accent: '#ef4444',
    description: 'French engineering excellence — the tyre of choice for MotoGP, touring and city riding alike.',
  },
```

- [ ] **Step 2: Add 2 tire products**

Append to the `products` array (after the helmet products, before Warranties):

```ts
  // ── Tires ─────────────────────────────────────────────────
  {
    id: 'p-pirelli-angel-gt',
    name: 'Pirelli Angel GT II Tire Set',
    slug: 'pirelli-angel-gt-ii',
    brandId: 'b-pirelli',
    categoryId: 'c-part',
    type: 'part',
    price: 239,
    salePrice: null,
    description:
      "Grand touring performance with all-season confidence. The Angel GT II delivers Pirelli's sport-touring expertise in a compound optimised for mileage, wet grip and stability on long rides.",
    specs: { Type: 'Sport touring', Front: '120/70-ZR17', Rear: '180/55-ZR17', 'Wet grip': 'Class A', Compound: 'Dual compound' },
    images: [
      'https://e7.pngegg.com/pngimages/348/643/png-clipart-pirelli-motorcycle-tires-touring-motorcycle-motorcycle-bicycle-motorcycle.png',
    ],
    stock: 25,
    featured: false,
    status: 'active',
    createdAt: daysAgo(16),
  },
  {
    id: 'p-michelin-city-grip2',
    name: 'Michelin City Grip 2 Tire Set',
    slug: 'michelin-city-grip-2',
    brandId: 'b-michelin',
    categoryId: 'c-part',
    type: 'part',
    price: 189,
    salePrice: null,
    description:
      "The urban grip specialist. Michelin's City Grip 2 formula excels on wet cobblestones and road markings — the most treacherous surfaces a city rider faces — with a tread pattern engineered for scooter geometry.",
    specs: { Type: 'Urban / scooter', Front: '110/70-12', Rear: '130/70-12', 'Wet grip': 'Class A', Compound: 'Silica compound' },
    images: [
      'https://e7.pngegg.com/pngimages/863/341/png-clipart-motorcycle-tires-michelin-motorcycle-tires-sirac-motorcycle-bicycle-motorcycle.png',
    ],
    stock: 30,
    featured: false,
    status: 'active',
    createdAt: daysAgo(19),
  },
```

- [ ] **Step 3: Enrich the 3 Vespa scooter entries with new fields**

Find `id: 'p-vespa-gts300'` and add these fields inside that product object:

```ts
    colors: [
      { name: 'Racing Green', hex: '#2d5a3d' },
      { name: 'Midnight Navy', hex: '#1a1a2e' },
      { name: 'Grigio Titanio', hex: '#c8b8a2' },
      { name: 'Rosso Dragon', hex: '#cc2936' },
      { name: 'Bianco Innocenza', hex: '#f5f0e8' },
    ],
    engineVariants: ['278cc HPE', '300cc Sport'],
    longDescription:
      "The Vespa GTS 300 Super is the definitive expression of the Vespa ideal — an icon that has never stopped evolving. Born in 1946 in postwar Italy, Vespa has always represented freedom, elegance and effortless style on two wheels. The GTS 300 Super carries that legacy forward with uncompromising engineering and timeless design cues that are instantly recognisable from any angle.\n\nAt the heart of the GTS Super lies a 278cc HPE (High Performance Engine) single-cylinder unit delivering 23.5 hp of spirited, smooth power. Coupled with a die-cast aluminium monocoque frame and fully adjustable suspension, the ride feel is supple and confidence-inspiring whether you're threading through city traffic or cruising along a coastal road.",
    features: [
      'ABS Dual-Channel Braking',
      'Full LED Lighting',
      'Traction Control (ASR)',
      'Keyless Start System',
      'Colour TFT Instrument Cluster',
      'USB-C Charging Port',
      'Under-Seat Helmet Storage',
      'Bluetooth Connectivity',
      'Hand-Welded Steel Body',
      'Adjustable Rear Suspension',
      'Aluminium Monocoque Frame',
      'Euro 5 Compliant Engine',
    ],
```

Find `id: 'p-vespa-primavera'` and add:

```ts
    colors: [
      { name: 'Bianco Puro', hex: '#f5f0e8' },
      { name: 'Rosa Chiaro', hex: '#e8a0a0' },
      { name: 'Azzurro Metallizzato', hex: '#6ab0c8' },
      { name: 'Verde Relax', hex: '#4FB286' },
    ],
    engineVariants: ['50cc', '125cc', '150cc i-get'],
    longDescription:
      "The Vespa Primavera is the scooter that launched a thousand adventures. Since 1968, its fluid, organic silhouette and nimble handling have made it the favourite of style-conscious urban riders across the world. The current Primavera 150 honours that heritage while adding the modern comforts and safety features today's riders expect.\n\nThe peppy 155cc i-get engine delivers 13 hp with outstanding fuel efficiency — perfect for daily commutes and weekend rides alike. Weighing just 117 kg and fitted with a wide turning radius, the Primavera threads through city traffic with ease and grace.",
    features: [
      'ABS Front Disc Brake',
      'Full LED Lighting',
      'i-get Engine Technology',
      'Keyless Start System',
      'USB Charging Port',
      'Under-Seat Helmet Storage',
      'Adjustable Rear Shock',
      'Chrome Exhaust Trim',
      'Aluminium Footboards',
      'Euro 5 Compliant',
    ],
```

Find `id: 'p-vespa-sprint50'` and add:

```ts
    colors: [
      { name: 'Nero Vulcano', hex: '#1a1a1a' },
      { name: 'Rosso Dragon', hex: '#cc2936' },
      { name: 'Bianco Assoluto', hex: '#f5f0e8' },
    ],
    engineVariants: ['50cc', '125cc'],
    longDescription:
      "The Vespa Sprint wears its sporty attitude in every line — the square headlight, the wide handlebar cowl, the racing-inspired stance. Yet underneath the bold styling lies the same hand-welded steel monocoque frame that has made Vespa the gold standard of durability for eight decades.\n\nThe frugal 50cc i-get engine makes the Sprint the ideal choice for urban riders who want maximum fuel economy without compromising on style or character. A 125cc version is also available for those who need a little more pace on mixed city and suburban routes.",
    features: [
      'Front Disc Brake',
      'Full LED Headlight',
      'i-get Engine Technology',
      'Under-Seat Storage',
      'USB Charging Port',
      'Steel Monocoque Frame',
      'Wide Turning Radius',
      'Euro 5 Compliant',
    ],
```

- [ ] **Step 4: Enrich the 2 Lambretta scooter entries**

Find `id: 'p-lambretta-v200'` and add:

```ts
    colors: [
      { name: 'Rosso Milano', hex: '#cc2936' },
      { name: 'Grigio Urban', hex: '#6b7280' },
      { name: 'Bianco Ghiaccio', hex: '#f0eeea' },
      { name: 'Nero Opaco', hex: '#1a1a1a' },
    ],
    engineVariants: ['125cc', '200cc'],
    longDescription:
      "Tailored in Milan. The Lambretta V200 Special revives the spirit of the mod era — those colour-matched side panels and clean, purposeful proportions are unmistakably Lambretta, yet the engineering beneath is thoroughly modern.\n\nA smooth 169cc fuel-injected engine delivers 12.4 hp with linear, confidence-inspiring power delivery. CBS braking, twin rear shock absorbers and a steel trellis frame ensure the V200 is as composed on fast A-roads as it is stylish on city streets.",
    features: [
      'CBS Disc Braking System',
      'Full LED Lighting',
      'Colour-Matched Side Panels',
      'Fuel Injection System',
      'Under-Seat Helmet Storage',
      'Chrome Detailing',
      'Twin Rear Shock Absorbers',
      'Steel Trellis Frame',
      'Euro 5 Compliant',
    ],
```

Find `id: 'p-lambretta-g350'` and add:

```ts
    colors: [
      { name: 'Grigio Granito', hex: '#6b7280' },
      { name: 'Blu Cobalto', hex: '#1e40af' },
      { name: 'Nero Elegante', hex: '#1a1a1a' },
    ],
    engineVariants: ['350cc'],
    longDescription:
      "The Lambretta G350 is the grand tourer of the range — a machine built for riders who want to go farther and arrive in style. The torquey 330cc engine produces 28.6 hp and pulls strongly from low revs, making it equally at home on motorway stretches as on twisting country roads.\n\nSculpted bodywork, premium finish panels and a long, plush seat make long-distance comfort a priority. ABS dual-disc braking, a full TFT instrument cluster and optional heated grips complete the touring package.",
    features: [
      'ABS Dual-Disc Braking',
      'Full LED Lighting',
      'TFT Instrument Cluster',
      '330cc Torque Engine',
      'Long-Distance Seat',
      'Under-Seat Storage',
      'USB-C Charging Port',
      'Adjustable Suspension',
      'Euro 5 Compliant',
    ],
```

- [ ] **Step 5: Enrich the 2 Italjet and 2 Honda scooter entries**

Find `id: 'p-italjet-dragster'` and add:

```ts
    colors: [
      { name: 'Carbonio Nero', hex: '#1a1a1a' },
      { name: 'Rosso Fuoco', hex: '#cc2936' },
      { name: 'Argento Racing', hex: '#c0c0c0' },
    ],
    engineVariants: ['125cc', '200cc'],
    longDescription:
      "A two-wheeled supercar. The Italjet Dragster's exposed trellis frame and patented front hub-centre suspension are engineering statements as much as they are functional choices — this is a scooter designed to challenge conventions and dominate every corner.\n\nThe 181cc single-cylinder engine delivers 20.5 hp through a CVT transmission optimised for snap-response throttle. Radial ABS monobloc brake callipers and 300mm discs provide stopping power that matches the Dragster's aggressive performance.",
    features: [
      'Radial ABS Monobloc Brakes',
      'Exposed Trellis Frame',
      'Hub-Centre Front Suspension',
      'Full LED Lighting',
      'TFT Digital Instrument Cluster',
      'USB Charging Port',
      'Quick-Release Seat',
      'Adjustable Rear Monoshock',
      'Euro 5 Compliant',
    ],
```

Find `id: 'p-italjet-scooop'` and add:

```ts
    colors: [
      { name: 'Giallo Lime', hex: '#d4e52e' },
      { name: 'Azzurro Cielo', hex: '#6ab0c8' },
      { name: 'Rosa Bubble', hex: '#e8a0a0' },
      { name: 'Bianco Panna', hex: '#f5f0e8' },
    ],
    engineVariants: ['125cc'],
    longDescription:
      "Retro-futurist design meets city practicality. The Italjet Scooop 125 turns heads wherever it goes with its bubble proportions, playful colour palette and distinctive round headlight cluster — proof that a scooter can be personality-forward without sacrificing daily usability.\n\nThe punchy 125cc engine delivers spirited performance in urban traffic, while the step-through frame and wide footboards make it approachable for new riders and veterans alike. Lightweight at 119 kg, the Scooop is one of the easiest machines to manoeuvre in tight city parking.",
    features: [
      'CBS Front Disc Brake',
      'Full LED Lighting',
      'Step-Through Frame',
      'Wide Footboards',
      'Under-Seat Helmet Storage',
      'Retro Instrument Cluster',
      'USB Charging Port',
      'Lightweight 119 kg',
      'Euro 5 Compliant',
    ],
```

Find `id: 'p-honda-giorno'` and add:

```ts
    colors: [
      { name: 'Rosso Pastello', hex: '#e8a0a0' },
      { name: 'Blu Pastello', hex: '#6ab0c8' },
      { name: 'Bianco Crema', hex: '#f5f0e8' },
      { name: 'Verde Menta', hex: '#4FB286' },
    ],
    engineVariants: ['50cc', '125cc'],
    longDescription:
      "Retro pastel charm meets Honda dependability. The Giorno+ carries the spirit of the classic 1992 Honda Giorno into the present — same charming proportions, same approachable step-through layout, but now powered by a modern 124cc eSP engine with Honda's legendary fuel efficiency and reliability.\n\nAt just 95 kg it's one of the lightest scooters in its class, making it genuinely easy to handle for riders of all experience levels. The Giorno+ is the friendliest, most characterful way to glide through the city in style.",
    features: [
      'CBS Front Disc Brake',
      'Full LED Lighting',
      'eSP Engine Technology',
      'Step-Through Frame',
      'Under-Seat Storage',
      'USB Charging Port',
      'Lightweight 95 kg',
      'Retro Chrome Accents',
      'Euro 5 Compliant',
    ],
```

Find `id: 'p-honda-forza350'` and add:

```ts
    colors: [
      { name: 'Nero Graphite', hex: '#374151' },
      { name: 'Grigio Mat', hex: '#6b7280' },
      { name: 'Bianco Pearl', hex: '#f5f0e8' },
    ],
    engineVariants: ['350cc eSP+'],
    longDescription:
      "The maxi-scooter benchmark. Honda's Forza 350 sets the standard every rival is measured against — a 330cc eSP+ parallel-twin engine, Honda Smart Key, an electrically adjustable windscreen and a dual-level under-seat storage compartment that swallows a full-face helmet with room for gloves.\n\nWith 28.8 hp and 31.5 Nm of torque, the Forza 350 effortlessly handles motorway speeds and loaded two-up touring. Honda's Selectable Torque Control (HSTC) and dual ABS disc brakes ensure the confidence to match the performance.",
    features: [
      'Dual ABS Disc Brakes',
      'Honda Smart Key System',
      'Electric Windscreen Adjustment',
      'eSP+ Twin-Cylinder Engine',
      'Honda Selectable Torque Control',
      'Dual-Level Under-Seat Storage',
      'Colour TFT Instrument Cluster',
      'USB-A + USB-C Ports',
      'Heated Grips Ready',
      'Euro 5 Compliant',
    ],
```

- [ ] **Step 6: Verify type check passes**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/data/seed.ts
git commit -m "feat: add Pirelli, Michelin tire products; enrich all scooters with colors, variants, features"
```

---

## Task 4: Rewrite ProductDetail — top section (60/40 grid, gallery, selectors)

**Files:**
- Modify: `src/storefront/pages/ProductDetail.tsx`

This task replaces the entire file. Subsequent tasks build on it incrementally.

- [ ] **Step 1: Replace the full file with the new top-section structure**

Replace the entire contents of `src/storefront/pages/ProductDetail.tsx` with:

```tsx
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ShoppingBag, ShieldCheck, Truck, RotateCcw, ChevronDown } from 'lucide-react'
import { getProductBySlug, getProducts, getBrands } from '../../data/store'
import { useAsync } from '../../lib/useAsync'
import { formatPrice, effectivePrice } from '../../lib/format'
import type { Brand, Product } from '../../types'
import ScooterArt from '../../components/ScooterArt'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { slug } = useParams()
  const { data, loading } = useAsync(
    () => Promise.all([getProductBySlug(slug!), getProducts(), getBrands()]),
    [slug],
  )
  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedEngine, setSelectedEngine] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  if (loading || !data) return <DetailSkeleton />
  const [product, all, brands] = data as [Product | null, Product[], Brand[]]

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-40 text-center">
        <h1 className="font-display text-3xl font-extrabold text-coal">Product not found</h1>
        <Link to="/shop" className="mt-6 inline-block font-semibold text-carrot">← Back to shop</Link>
      </div>
    )
  }

  const brand = brands.find((b) => b.id === product.brandId)
  const accent = brand?.accent ?? '#F95D0E'
  const onSale = product.salePrice != null && product.salePrice < product.price

  const galleryImages = [
    ...product.images,
    ...(product.heroImage ? [product.heroImage] : []),
  ]

  const related = all
    .filter((p) => p.id !== product.id && p.brandId === product.brandId)
    .slice(0, 3)

  const recommended = product.type === 'scooter'
    ? all
        .filter((p) => (p.type === 'accessory' || p.type === 'part') && p.images.length > 0)
        .slice(0, 4)
    : []

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 lg:px-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-coal-muted transition-colors hover:text-carrot"
      >
        <ArrowLeft size={16} /> Back to shop
      </Link>

      {/* TOP: 60/40 grid */}
      <div className="mt-6 grid gap-10 lg:grid-cols-[3fr_2fr]">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-xl2 border border-paper-line bg-paper p-3 shadow-soft"
        >
          <div className="overflow-hidden rounded-2xl bg-paper-soft">
            <div className="flex aspect-square items-center justify-center p-4">
              {galleryImages.length > 0 ? (
                <img
                  key={activeImg}
                  src={galleryImages[activeImg]}
                  alt={product.name}
                  className="h-full max-h-[440px] w-auto object-contain drop-shadow-xl"
                />
              ) : (
                <ScooterArt product={product} accent={accent} className="h-full w-full" />
              )}
            </div>
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-paper-soft transition-all ${
                    activeImg === i ? 'border-carrot shadow-glow' : 'border-paper-line hover:border-coal-dim'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span
              className="rounded-pill px-3 py-1 text-xs font-bold uppercase tracking-wide"
              style={{ background: `${accent}1F`, color: accent }}
            >
              {brand?.name}{brand?.country ? ` · ${brand.country}` : ''}
            </span>
            {product.featured && (
              <span className="rounded-pill bg-night px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-coal sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold text-coal">
              {formatPrice(effectivePrice(product))}
            </span>
            {onSale && (
              <span className="text-lg text-coal-dim line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-coal-muted">{product.description}</p>

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coal-dim">
                Color: <span className="text-coal">{product.colors[selectedColor].name}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    title={c.name}
                    onClick={() => setSelectedColor(i)}
                    className={`h-7 w-7 rounded-full transition-all ${
                      selectedColor === i
                        ? 'ring-2 ring-carrot ring-offset-2'
                        : 'hover:ring-2 hover:ring-coal-dim hover:ring-offset-1'
                    }`}
                    style={{ background: c.hex, border: c.hex === '#f5f0e8' ? '1px solid #e0ddd6' : undefined }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Engine selector */}
          {product.engineVariants && product.engineVariants.length > 1 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-coal-dim">Engine</p>
              <div className="flex flex-wrap gap-2">
                {product.engineVariants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedEngine(i)}
                    className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                      selectedEngine === i
                        ? 'border-carrot bg-carrot/5 text-carrot'
                        : 'border-paper-line bg-paper text-coal-muted hover:border-coal-dim'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className={`flex items-center gap-1.5 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-carrot'}`}>
              <Check size={16} /> {product.stock > 0 ? 'In stock' : 'Sold out'}
            </span>
            {product.stock > 0 && product.stock <= 6 && (
              <span className="text-coal-dim">· only {product.stock} remaining</span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/cart"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-pill bg-carrot px-7 py-4 font-bold text-white transition-all hover:bg-carrot-deep hover:shadow-glow"
            >
              <ShoppingBag size={18} /> Add to cart
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-pill border border-paper-line bg-paper px-7 py-4 font-bold text-coal transition-colors hover:border-coal"
            >
              Keep browsing
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-paper-line pt-6">
            {[
              { icon: Truck, label: 'Free delivery' },
              { icon: ShieldCheck, label: 'Warranty ready' },
              { icon: RotateCcw, label: '14-day returns' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <Icon size={20} className="text-carrot" />
                <span className="text-xs text-coal-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* placeholder — remaining sections added in Tasks 5–8 */}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-2xl font-extrabold text-coal">
            More from {brand?.name}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} brand={brand} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[3fr_2fr]">
        <div className="aspect-square animate-pulse rounded-xl2 bg-paper-soft" />
        <div className="space-y-4">
          <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-paper-soft" />
          <div className="h-8 w-32 animate-pulse rounded-2xl bg-paper-soft" />
          <div className="h-24 animate-pulse rounded-2xl bg-paper-soft" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev
```

Open a product detail page (e.g. `/shop/vespa-gts-300-super`). Verify:
- 60/40 grid renders correctly
- Gallery shows the product image; transparent hero PNG appears as a second thumbnail for Vespa GTS
- Clicking a thumbnail swaps the main image
- Color swatches appear and the selected color name updates
- Engine variant pills appear for products with multiple variants
- No TypeScript errors in the terminal

- [ ] **Step 4: Commit**

```bash
git add src/storefront/pages/ProductDetail.tsx
git commit -m "feat: product detail — 60/40 gallery grid with thumbnail strip, color and engine selectors"
```

---

## Task 5: Add specs + contact form sections

**Files:**
- Modify: `src/storefront/pages/ProductDetail.tsx`

- [ ] **Step 1: Replace the `{/* placeholder */}` comment with the two sections**

Find this comment in `ProductDetail.tsx`:

```tsx
      {/* placeholder — remaining sections added in Tasks 5–8 */}
```

Replace it with:

```tsx
      {/* SPECS + CONTACT: 60/40 grid */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* Technical Specifications */}
        <div className="rounded-xl2 border border-paper-line bg-paper p-7 shadow-soft">
          <h2 className="mb-5 font-display text-xl font-extrabold text-coal">Technical Specifications</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-paper-line bg-paper-soft p-4">
                <div className="text-xs uppercase tracking-wider text-coal-dim">{k}</div>
                <div className="mt-1 font-display text-lg font-bold text-coal">{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquire with Velocità */}
        <div className="rounded-xl2 border border-paper-line bg-paper p-7 shadow-soft">
          <h2 className="mb-1 font-display text-xl font-extrabold text-coal">Inquire with Velocità</h2>
          <p className="mb-5 text-xs uppercase tracking-widest text-coal-dim">Our team replies within 24 hours</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.currentTarget
              const name = (form.elements.namedItem('name') as HTMLInputElement).value
              const email = (form.elements.namedItem('email') as HTMLInputElement).value
              const subject = (form.elements.namedItem('subject') as HTMLInputElement).value
              const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value
              window.location.href = `mailto:hello@velocita.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\n\n${message}`)}&cc=${encodeURIComponent(email)}`
            }}
            className="flex flex-col gap-3"
          >
            <input
              name="name"
              required
              placeholder="Your name *"
              className="rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-coal placeholder-coal-dim outline-none focus:border-carrot focus:ring-1 focus:ring-carrot"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address *"
              className="rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-coal placeholder-coal-dim outline-none focus:border-carrot focus:ring-1 focus:ring-carrot"
            />
            <input
              name="subject"
              placeholder="Subject"
              defaultValue={`I'm interested in the ${product.name}`}
              className="rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-coal placeholder-coal-dim outline-none focus:border-carrot focus:ring-1 focus:ring-carrot"
            />
            <textarea
              name="message"
              rows={4}
              placeholder="Your message…"
              className="resize-none rounded-xl border border-paper-line bg-paper-soft px-4 py-3 text-sm text-coal placeholder-coal-dim outline-none focus:border-carrot focus:ring-1 focus:ring-carrot"
            />
            <button
              type="submit"
              className="rounded-pill bg-night px-6 py-3 font-bold text-white transition-colors hover:bg-coal"
            >
              Send Message →
            </button>
          </form>
        </div>
      </div>
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify in browser**

Reload the product detail page. Verify:
- Specs and contact form render side-by-side (60/40) below the gallery
- Contact form subject field is pre-filled with the product name
- Submitting the form triggers `mailto:` with correct params

- [ ] **Step 4: Commit**

```bash
git add src/storefront/pages/ProductDetail.tsx
git commit -m "feat: product detail — specs and contact inquiry form sections"
```

---

## Task 6: Add full description and features sections

**Files:**
- Modify: `src/storefront/pages/ProductDetail.tsx`

- [ ] **Step 1: Add the two full-width sections after the specs/contact grid**

Find this comment in `ProductDetail.tsx`:

```tsx
      {/* Related */}
```

Insert the following immediately before it:

```tsx
      {/* Full description */}
      {product.longDescription && (
        <div className="mt-8 rounded-xl2 border border-paper-line bg-paper p-8 shadow-soft">
          <h2 className="mb-5 font-display text-xl font-extrabold text-coal">About This {product.type === 'scooter' ? 'Scooter' : 'Product'}</h2>
          <div className="space-y-4">
            {product.longDescription.split('\n\n').map((para, i) => (
              <p key={i} className="leading-relaxed text-coal-muted">{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div className="mt-6 rounded-xl2 border border-paper-line bg-paper p-8 shadow-soft">
          <h2 className="mb-5 font-display text-xl font-extrabold text-coal">Features</h2>
          <div className="grid grid-cols-2 gap-x-8 sm:grid-cols-3">
            {product.features.map((f) => (
              <div key={f} className="flex items-center gap-3 border-b border-paper-line py-3 last:border-0">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-carrot/10 text-carrot">
                  <Check size={11} strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-coal">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify in browser**

Reload. Verify:
- "About This Scooter" section shows both paragraphs for a Vespa GTS
- "Features" section shows a 3-column checklist with orange checkmarks
- Neither section renders for products without `longDescription` / `features` (check helmet or tire product pages)

- [ ] **Step 4: Commit**

```bash
git add src/storefront/pages/ProductDetail.tsx
git commit -m "feat: product detail — about description and features checklist sections"
```

---

## Task 7: Add FAQ accordion

**Files:**
- Modify: `src/storefront/pages/ProductDetail.tsx`

- [ ] **Step 1: Add the FAQ data constant and section**

At the top of the file, just before `export default function ProductDetail()`, add:

```tsx
const FAQS = [
  {
    q: 'How do I choose the right scooter for my needs?',
    a: 'Our team is happy to help. Consider your daily commute distance, city vs highway riding, and whether you carry a passenger. As a guide: 50cc suits short urban trips; 125–155cc handles mixed traffic; 278–330cc is ideal for longer commutes or touring. Use the contact form above and we\'ll advise you personally.',
  },
  {
    q: 'Is this product available for a test ride or in-store viewing?',
    a: 'Yes — we offer test rides at our showroom by appointment. Send us a message via the form above and our team will schedule a session at your convenience. Test rides are free with no obligation to purchase.',
  },
  {
    q: 'What warranty does this come with?',
    a: 'Every new scooter from Velocità includes the manufacturer\'s standard warranty. We also offer extended Velocità Care plans (1, 2 and 3-year options) covering engine, transmission, electrical faults and roadside assistance. Browse warranty options in our shop.',
  },
  {
    q: 'Can I trade in my current scooter or motorcycle?',
    a: 'Absolutely. We accept trade-ins on all brands and models, subject to condition assessment. Bring your current ride to our showroom or send us photos and details via the form — we\'ll provide a valuation within 48 hours.',
  },
  {
    q: 'Do you offer financing options?',
    a: 'Yes — flexible financing is available on all scooters over $2,000. We work with trusted lending partners to offer low-interest plans from 12 to 60 months. Ask us about current rates when you get in touch.',
  },
]
```

Then, after the Features section (before the `{/* Related */}` comment), insert:

```tsx
      {/* FAQ accordion */}
      <div className="mt-6 rounded-xl2 border border-paper-line bg-paper p-8 shadow-soft">
        <h2 className="mb-5 font-display text-xl font-extrabold text-coal">General Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-paper-line"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-coal transition-colors hover:bg-paper-soft"
              >
                {faq.q}
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 text-coal-dim transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="border-t border-paper-line bg-paper-soft px-5 py-4">
                  <p className="text-sm leading-relaxed text-coal-muted">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify in browser**

Reload. Verify:
- 5 FAQ items render; first one is open (state initialised to `0`)
- Clicking a question closes/opens it
- Clicking the open question collapses it to null
- Chevron rotates on open/close

- [ ] **Step 4: Commit**

```bash
git add src/storefront/pages/ProductDetail.tsx
git commit -m "feat: product detail — FAQ accordion with 5 store-wide questions"
```

---

## Task 8: Add "Complete Your Ride" recommended products section

**Files:**
- Modify: `src/storefront/pages/ProductDetail.tsx`

- [ ] **Step 1: Add the recommended section before related products**

Find the `{/* Related */}` comment and insert the following immediately before it:

```tsx
      {/* Complete Your Ride */}
      {recommended.length > 0 && (
        <section className="mt-16">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-extrabold text-coal">Complete Your Ride</h2>
            <Link
              to="/shop"
              className="text-sm font-semibold text-carrot transition-colors hover:text-carrot-deep"
            >
              See all accessories →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((p) => {
              const b = brands.find((br) => br.id === p.brandId)
              return <ProductCard key={p.id} product={p} brand={b} />
            })}
          </div>
        </section>
      )}

```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Full build check**

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 4: Verify in browser**

Navigate to a scooter detail page (e.g. `/shop/vespa-gts-300-super`). Verify:
- "Complete Your Ride" section shows 4 cards (helmets + tires with images)
- Each card shows brand, product name and price
- "See all accessories →" link is visible
- Navigate to a helmet detail page (e.g. `/shop/shoei-x14-marquez`) — the section should NOT appear (non-scooter product)
- "More from [Brand]" related section still renders below
- Page background is white throughout (no gray canvas)

- [ ] **Step 5: Commit**

```bash
git add src/storefront/pages/ProductDetail.tsx
git commit -m "feat: product detail — 'Complete Your Ride' recommended helmets and tires section"
```

---

## Self-Review

**Spec coverage:**
- ✅ 60/40 grid top + bottom — Task 4 & 5
- ✅ Gallery with thumbnails, image swap — Task 4
- ✅ Color swatches with name label — Task 4
- ✅ Engine variant selector — Task 4
- ✅ Contact form with mailto fallback — Task 5
- ✅ Technical specs card — Task 5
- ✅ Full description ("About") — Task 6
- ✅ Features 3-column checklist — Task 6
- ✅ FAQ accordion, first open by default — Task 7
- ✅ "Complete Your Ride" 4-card section, scooters only — Task 8
- ✅ 6 helmet brands + products — Task 2
- ✅ 2 tire brands + products — Task 3
- ✅ Existing scooters enriched with colors/variants/longDescription/features — Task 3
- ✅ White background (inherits app default — no override added) — Task 4

**Placeholder scan:** No TBDs. All code blocks are complete. `mailto:` approach is intentional and documented.

**Type consistency:**
- `product.colors`, `product.engineVariants`, `product.longDescription`, `product.features` — defined in Task 1, consumed in Task 4 & 6. Names match exactly.
- `galleryImages`, `related`, `recommended` — defined in Task 4, `recommended` consumed in Task 8.
- `openFaq` state — defined in Task 4, consumed in Task 7.
- `FAQS` constant — defined in Task 7 at module scope, consumed in same task.
- `ChevronDown` — imported in Task 4's full file replacement, used in Task 7.
