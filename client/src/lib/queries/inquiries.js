import { supabase } from '../supabase'

/**
 * Get all inquiries with pagination and status filtering.
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status
 * @returns {Promise<{inquiries: Array, total: number, error: Error|null}>}
 */
export async function getInquiries(params = {}) {
  const { page = 1, limit = 10, status } = params

  let query = supabase
    .from('inquiries')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  return {
    inquiries: data || [],
    total: count || 0,
    error
  }
}

/**
 * Get a single inquiry by ID.
 * @param {number} id - Inquiry ID
 * @returns {Promise<{inquiry: Object|null, error: Error|null}>}
 */
export async function getInquiry(id) {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  return { inquiry: data, error }
}

/**
 * Submit a new inquiry (public contact form).
 * Anonymous users can INSERT but not SELECT, so we don't return the row.
 * @param {Object} data - Inquiry data (name, email, message, etc.)
 * @returns {Promise<{error: Error|null}>}
 */
export async function submitInquiry(data) {
  const { error } = await supabase
    .from('inquiries')
    .insert(data)

  return { error }
}

/**
 * Update an existing inquiry.
 * @param {number} id - Inquiry ID
 * @param {Object} data - Updated inquiry data
 * @returns {Promise<{inquiry: Object|null, error: Error|null}>}
 */
export async function updateInquiry(id, data) {
  const { data: inquiry, error } = await supabase
    .from('inquiries')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  return { inquiry, error }
}

/**
 * Soft delete an inquiry.
 * @param {number} id - Inquiry ID
 * @returns {Promise<{error: Error|null}>}
 */
export async function deleteInquiry(id) {
  const { error } = await supabase
    .from('inquiries')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  return { error }
}
