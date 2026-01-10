import { supabase } from '../supabase'

/**
 * Get all packages.
 * Packages are publicly readable via RLS.
 * @returns {Promise<{packages: Array, error: Error|null}>}
 */
export async function getPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .is('deleted_at', null)
    .order('price', { ascending: true })

  return { packages: data || [], error }
}

/**
 * Get a single package by ID.
 * @param {number} id - Package ID
 * @returns {Promise<{package: Object|null, error: Error|null}>}
 */
export async function getPackage(id) {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  // Use 'pkg' to avoid reserved word conflict
  return { package: data, error }
}
