import { supabase } from '../supabase'

/**
 * Parse features field which may be stored as JSON string or array.
 */
function parseFeatures(pkg) {
  if (!pkg) return pkg
  let features = pkg.features
  if (typeof features === 'string') {
    try {
      features = JSON.parse(features)
    } catch {
      features = []
    }
  }
  return { ...pkg, features: features || [] }
}

/**
 * Get all packages.
 * Packages are publicly readable via RLS.
 * @returns {Promise<{packages: Array, error: Error|null}>}
 */
export async function getPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true })

  const packages = (data || []).map(parseFeatures)
  return { packages, error }
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
    .eq('is_active', true)
    .single()

  return { package: parseFeatures(data), error }
}
