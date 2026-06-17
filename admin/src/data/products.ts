export interface AdminProduct {
  id: string
  name: string
  slug: string
  brand: string
  type: 'scooter' | 'helmet' | 'tire' | 'accessory' | 'part'
  price: number
  image: string | null
  inStock: boolean
}

const KEY = 'velocita_admin_products'

export function getProducts(): AdminProduct[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return SEED_PRODUCTS.map((p) => ({ ...p }))
  try { return JSON.parse(raw) } catch { return SEED_PRODUCTS.map((p) => ({ ...p })) }
}

export function saveProducts(list: AdminProduct[]): void {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function resetProducts(): AdminProduct[] {
  localStorage.removeItem(KEY)
  return SEED_PRODUCTS.map((p) => ({ ...p }))
}

// Static export used by Dashboard stat card
export const products: AdminProduct[] = []  // filled below after SEED_PRODUCTS

const SEED_PRODUCTS: AdminProduct[] = [
  // Scooters
  {
    id: 'p-vespa-gts300',
    name: 'Vespa GTS 300 Super',
    slug: 'vespa-gts-300-super',
    brand: 'Vespa',
    type: 'scooter',
    price: 7899,
    image: '/images/products/Vespa GTS SUPER 300 RED PASSIONE 1.png',
    inStock: true,
  },
  {
    id: 'p-vespa-primavera',
    name: 'Vespa Primavera 150',
    slug: 'vespa-primavera-150',
    brand: 'Vespa',
    type: 'scooter',
    price: 5499,
    image: '/images/products/Vespa Primavera S 125 – Green Amabile 1.png',
    inStock: true,
  },
  {
    id: 'p-vespa-sprint50',
    name: 'Vespa Sprint 50',
    slug: 'vespa-sprint-50',
    brand: 'Vespa',
    type: 'scooter',
    price: 4299,
    image: '/images/products/Vespa Sprint 125 – Yellow Curioso 1.png',
    inStock: true,
  },
  {
    id: 'p-lambretta-v200',
    name: 'Lambretta V200 Special',
    slug: 'lambretta-v200-special',
    brand: 'Lambretta',
    type: 'scooter',
    price: 5199,
    image: '/images/products/Lambretta-X125-SALMON-PINK.png',
    inStock: true,
  },
  {
    id: 'p-lambretta-g350',
    name: 'Lambretta G350',
    slug: 'lambretta-g350',
    brand: 'Lambretta',
    type: 'scooter',
    price: 6499,
    image: '/images/products/X300-special-red.png',
    inStock: true,
  },
  {
    id: 'p-italjet-dragster',
    name: 'Italjet Dragster 200',
    slug: 'italjet-dragster-200',
    brand: 'Italjet',
    type: 'scooter',
    price: 7299,
    image: '/images/products/italiajet 200 dragster 1.webp',
    inStock: true,
  },
  {
    id: 'p-honda-giorno',
    name: 'Honda Giorno+',
    slug: 'honda-giorno-plus',
    brand: 'Honda',
    type: 'scooter',
    price: 3499,
    image: '/images/products/Honda Giorno red.png',
    inStock: true,
  },
  // Parts
  {
    id: 'p-part-exhaust',
    name: 'Akra Sport Exhaust — Vespa',
    slug: 'akra-sport-exhaust-vespa',
    brand: 'Vespa',
    type: 'part',
    price: 389,
    image: '/images/products/akrapovic 1.png',
    inStock: true,
  },
  {
    id: 'p-part-exhaust-lambretta',
    name: 'Akra Sport Exhaust — Lambretta',
    slug: 'akra-sport-exhaust-lambretta',
    brand: 'Lambretta',
    type: 'part',
    price: 389,
    image: '/images/products/akrapovic 1.png',
    inStock: true,
  },
  {
    id: 'p-part-exhaust-italjet',
    name: 'Akra Sport Exhaust — Italjet',
    slug: 'akra-sport-exhaust-italjet',
    brand: 'Italjet',
    type: 'part',
    price: 419,
    image: '/images/products/akrapovic 1.png',
    inStock: true,
  },
  {
    id: 'p-part-exhaust-honda',
    name: 'Akra Sport Exhaust — Honda',
    slug: 'akra-sport-exhaust-honda',
    brand: 'Honda',
    type: 'part',
    price: 359,
    image: '/images/products/akrapovic 1.png',
    inStock: true,
  },
  {
    id: 'p-part-brembo-vespa',
    name: 'Brembo Toothless II — Vespa',
    slug: 'brembo-toothless-ii-vespa',
    brand: 'Vespa',
    type: 'part',
    price: 279,
    image: '/images/products/brembo brake.png',
    inStock: true,
  },
  {
    id: 'p-part-brembo-lambretta',
    name: 'Brembo Toothless II — Lambretta',
    slug: 'brembo-toothless-ii-lambretta',
    brand: 'Lambretta',
    type: 'part',
    price: 279,
    image: '/images/products/brembo brake.png',
    inStock: true,
  },
  {
    id: 'p-part-brembo-italjet',
    name: 'Brembo Toothless II — Italjet',
    slug: 'brembo-toothless-ii-italjet',
    brand: 'Italjet',
    type: 'part',
    price: 279,
    image: '/images/products/brembo brake.png',
    inStock: true,
  },
  {
    id: 'p-part-brembo-honda',
    name: 'Brembo Toothless II — Honda',
    slug: 'brembo-toothless-ii-honda',
    brand: 'Honda',
    type: 'part',
    price: 259,
    image: '/images/products/brembo brake.png',
    inStock: true,
  },
  {
    id: 'p-part-airfilter-vespa',
    name: 'Uno Minda Air Filter — Vespa',
    slug: 'uno-minda-air-filter-vespa',
    brand: 'Vespa',
    type: 'part',
    price: 129,
    image: '/images/products/Uno Minda AF2101PM Engine Air Filter.png',
    inStock: true,
  },
  {
    id: 'p-part-airfilter-lambretta',
    name: 'Uno Minda Air Filter — Lambretta',
    slug: 'uno-minda-air-filter-lambretta',
    brand: 'Lambretta',
    type: 'part',
    price: 129,
    image: '/images/products/Uno Minda AF2101PM Engine Air Filter.png',
    inStock: true,
  },
  {
    id: 'p-part-airfilter-italjet',
    name: 'Uno Minda Air Filter — Italjet',
    slug: 'uno-minda-air-filter-italjet',
    brand: 'Italjet',
    type: 'part',
    price: 129,
    image: '/images/products/Uno Minda AF2101PM Engine Air Filter.png',
    inStock: true,
  },
  {
    id: 'p-part-airfilter-honda',
    name: 'Uno Minda Air Filter — Honda',
    slug: 'uno-minda-air-filter-honda',
    brand: 'Honda',
    type: 'part',
    price: 119,
    image: '/images/products/Uno Minda AF2101PM Engine Air Filter.png',
    inStock: true,
  },
  // Helmets (stored as type: 'accessory' in storefront but displayed as helmets)
  {
    id: 'p-shoei-glamster',
    name: 'Shoei Glamster Helmet',
    slug: 'shoei-x14-marquez',
    brand: 'Shoei',
    type: 'accessory',
    price: 649,
    image: '/images/products/shoei glamster black 1.webp',
    inStock: true,
  },
  {
    id: 'p-shoei-vfx-evo',
    name: 'Shoei VFX-EVO Helmet',
    slug: 'shoei-vfx-evo',
    brand: 'Shoei',
    type: 'accessory',
    price: 729,
    image: '/images/products/SHOEI VFX-EVO 1.jpg',
    inStock: true,
  },
  {
    id: 'p-arai-rx7v',
    name: 'Arai Ram-X Helmet',
    slug: 'arai-rx7v-evo',
    brand: 'Arai',
    type: 'accessory',
    price: 749,
    image: '/images/products/Arai Helmets - Ram-X Helmet - Diamond White 1.webp',
    inStock: true,
  },
  {
    id: 'p-hjc-rpha11',
    name: 'HJC RPHA 12N Helmet',
    slug: 'hjc-rpha-11-pro',
    brand: 'HJC',
    type: 'accessory',
    price: 429,
    image: '/images/products/hjc helmet RPHA 12N 1.webp',
    inStock: true,
  },
  {
    id: 'p-agv-k6s',
    name: 'AGU Pista GP RR Helmet',
    slug: 'agv-k6-s',
    brand: 'AGV',
    type: 'accessory',
    price: 489,
    image: '/images/products/agu helmet PISTA GP RR MONO MATT CARBON 1.webp',
    inStock: true,
  },
  {
    id: 'p-bell-race-star',
    name: 'Bell Eliminator Helmet',
    slug: 'bell-race-star-flex-dlx',
    brand: 'Bell',
    type: 'accessory',
    price: 549,
    image: '/images/products/bell helmet eliminator 1.webp',
    inStock: true,
  },
  {
    id: 'p-bell-lithium',
    name: 'Bell Lithium Helmet',
    slug: 'bell-lithium',
    brand: 'Bell',
    type: 'accessory',
    price: 699,
    image: '/images/products/bell helmet lithium 1.webp',
    inStock: true,
  },
  {
    id: 'p-hjc-respon',
    name: 'HJC RESPON Helmet',
    slug: 'hjc-respon',
    brand: 'HJC',
    type: 'accessory',
    price: 349,
    image: '/images/products/hjc helmet RESPON 1.webp',
    inStock: true,
  },
  // Tires
  {
    id: 'p-pirelli-angel-gt',
    name: 'Pirelli Angel GT II Tire Set',
    slug: 'pirelli-angel-gt-ii',
    brand: 'Pirelli',
    type: 'part',
    price: 239,
    image: '/images/products/pirelli angel 1.png',
    inStock: true,
  },
  {
    id: 'p-pirelli-diablo-rosso',
    name: 'Pirelli Diablo Rosso Tire Set',
    slug: 'pirelli-diablo-rosso',
    brand: 'Pirelli',
    type: 'part',
    price: 279,
    image: '/images/products/pirelli diablo rosso 1.png',
    inStock: true,
  },
  {
    id: 'p-michelin-city-grip2',
    name: 'Michelin City Grip Saver Tire Set',
    slug: 'michelin-city-grip-2',
    brand: 'Michelin',
    type: 'part',
    price: 189,
    image: '/images/products/Michelin city grip saver 1.webp',
    inStock: true,
  },
  {
    id: 'p-michelin-power-shift',
    name: 'Michelin Power Shift Tire Set',
    slug: 'michelin-power-shift',
    brand: 'Michelin',
    type: 'part',
    price: 229,
    image: '/images/products/Michelin power shift 1.webp',
    inStock: true,
  },
]

// Fill static export after SEED_PRODUCTS is defined
products.push(...SEED_PRODUCTS)
