import { supabase } from '../supabase'

// Transform snake_case DB row to camelCase for frontend
function transformClient(row) {
  if (!row) return null
  return {
    id: row.id,
    businessName: row.business_name,
    contactName: row.contact_name,
    email: row.email,
    phone: row.phone,
    website: row.website,
    status: row.status,
    interestedPackages: row.interested_packages,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  }
}

/**
 * Get all clients with pagination, search, and status filtering.
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term for business_name or contact_name
 * @param {string} params.status - Filter by status (ACTIVE, PROSPECT, etc.)
 * @returns {Promise<{clients: Array, total: number, error: Error|null}>}
 */
export async function getClients(params = {}) {
  const { page = 1, limit = 10, search, status } = params

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`business_name.ilike.%${search}%,contact_name.ilike.%${search}%`)
  }

  if (status) {
    query = query.eq('status', status)
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  return {
    clients: (data || []).map(transformClient),
    total: count || 0,
    error
  }
}

/**
 * Get a single client by ID.
 * @param {number} id - Client ID
 * @returns {Promise<{client: Object|null, error: Error|null}>}
 */
export async function getClient(id) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  return { client: transformClient(data), error }
}

/**
 * Create a new client.
 * @param {Object} data - Client data
 * @returns {Promise<{client: Object|null, error: Error|null}>}
 */
export async function createClient(data) {
  const { data: client, error } = await supabase
    .from('clients')
    .insert(data)
    .select()
    .single()

  return { client: transformClient(client), error }
}

/**
 * Update an existing client.
 * @param {number} id - Client ID
 * @param {Object} data - Updated client data
 * @returns {Promise<{client: Object|null, error: Error|null}>}
 */
export async function updateClient(id, data) {
  const { data: client, error } = await supabase
    .from('clients')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  return { client: transformClient(client), error }
}

/**
 * Soft delete a client.
 * @param {number} id - Client ID
 * @returns {Promise<{error: Error|null}>}
 */
export async function deleteClient(id) {
  const { error } = await supabase
    .from('clients')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  return { error }
}

/**
 * Get client statistics.
 * @returns {Promise<{stats: Object, error: Error|null}>}
 */
export async function getClientStats() {
  // Get total count
  const { count: totalClients, error: totalError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)

  if (totalError) {
    return { stats: null, error: totalError }
  }

  // Get active count
  const { count: activeClients, error: activeError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)
    .eq('status', 'ACTIVE')

  if (activeError) {
    return { stats: null, error: activeError }
  }

  // Get prospect count
  const { count: prospectClients, error: prospectError } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .is('deleted_at', null)
    .eq('status', 'PROSPECT')

  if (prospectError) {
    return { stats: null, error: prospectError }
  }

  return {
    stats: {
      totalClients: totalClients || 0,
      activeClients: activeClients || 0,
      prospectClients: prospectClients || 0
    },
    error: null
  }
}
