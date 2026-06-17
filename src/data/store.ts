// Data access layer. Components import ONLY from here — never from `seed` or
// `supabase` directly. Today it serves local seed data; when Supabase env vars
// are present it transparently reads from Postgres instead. Same async shape
// either way, so swapping backends never touches the UI.

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  brands as seedBrands,
  categories as seedCategories,
  products as seedProducts,
} from './seed'
import type { Brand, Category, Product } from '../types'

// Simulate a small network delay so loading states are real even on seed data.
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

export async function getBrands(): Promise<Brand[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('brands').select('*').order('name')
    if (error) throw error
    return data as Brand[]
  }
  await delay()
  return seedBrands
}

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('categories').select('*')
    if (error) throw error
    return data as Category[]
  }
  await delay()
  return seedCategories
}

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Product[]
  }
  // Check admin-managed products first (admin writes to this key)
  const stored = localStorage.getItem('velocita_products')
  if (stored) {
    try {
      const list = JSON.parse(stored) as Product[]
      if (Array.isArray(list) && list.length > 0) {
        return list
          .filter((p) => p.status === 'active')
          .map((p) => ({ ...p, images: Array.isArray(p.images) ? p.images : [] }))
      }
    } catch {}
  }
  await delay()
  return seedProducts.filter((p) => p.status === 'active')
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts()
  return all.filter((p) => p.featured)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single()
    if (error) return null
    return data as Product
  }
  const stored = localStorage.getItem('velocita_products')
  if (stored) {
    try {
      const list = JSON.parse(stored) as Product[]
      if (Array.isArray(list)) {
        const found = list.find((p) => p.slug === slug) ?? null
        if (found) return { ...found, images: Array.isArray(found.images) ? found.images : [] }
      }
    } catch {}
  }
  await delay()
  return seedProducts.find((p) => p.slug === slug) ?? null
}

// Synchronous helpers for relating data already in hand (no fetch needed).
export function brandOf(product: Product, brands: Brand[]): Brand | undefined {
  return brands.find((b) => b.id === product.brandId)
}

export function categoryOf(product: Product, categories: Category[]): Category | undefined {
  return categories.find((c) => c.id === product.categoryId)
}
