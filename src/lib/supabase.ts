import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// The app runs fully on local seed data until these env vars are set.
// Create a .env file (see .env.example) with your Supabase project values to
// switch the data layer over to the real backend.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null
