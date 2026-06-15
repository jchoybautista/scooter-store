// Shared domain types — mirror the Supabase schema so the data layer can swap
// from local seed data to Supabase without touching components.

export type ProductType = 'scooter' | 'part' | 'accessory' | 'warranty'

export interface Brand {
  id: string
  name: string
  slug: string
  country: string
  description: string
  /** Brand accent color, used for tinted SVG product art. */
  accent: string
}

export interface Category {
  id: string
  name: string
  slug: string
  type: ProductType
}

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

export interface WarrantyPlan {
  id: string
  name: string
  durationMonths: number
  price: number
  coverage: string
}

export interface OrderItem {
  productId: string
  nameSnapshot: string
  qty: number
  unitPrice: number
  warrantyPlanId: string | null
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  total: number
  items: OrderItem[]
  createdAt: string
}
