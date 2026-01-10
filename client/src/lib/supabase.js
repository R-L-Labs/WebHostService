import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Supabase client instance for database access.
 *
 * Uses the anon key which is safe for client-side usage.
 * Data access is controlled via Row Level Security (RLS) policies.
 *
 * @example
 * import { supabase } from '@/lib/supabase'
 *
 * // Query data
 * const { data, error } = await supabase
 *   .from('clients')
 *   .select('*')
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
