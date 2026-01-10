import { supabase } from '../supabase'

/**
 * Get all payments for a specific client.
 * @param {number} clientId - Client ID
 * @returns {Promise<{payments: Array, error: Error|null}>}
 */
export async function getPaymentsByClient(clientId) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('client_id', clientId)
    .is('deleted_at', null)
    .order('payment_date', { ascending: false })

  return { payments: data || [], error }
}

/**
 * Get a single payment by ID.
 * @param {number} id - Payment ID
 * @returns {Promise<{payment: Object|null, error: Error|null}>}
 */
export async function getPayment(id) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  return { payment: data, error }
}

/**
 * Create a new payment.
 * @param {Object} data - Payment data (client_id, amount, payment_date, description, status)
 * @returns {Promise<{payment: Object|null, error: Error|null}>}
 */
export async function createPayment(data) {
  const { data: payment, error } = await supabase
    .from('payments')
    .insert(data)
    .select()
    .single()

  return { payment, error }
}

/**
 * Update an existing payment.
 * @param {number} id - Payment ID
 * @param {Object} data - Updated payment data
 * @returns {Promise<{payment: Object|null, error: Error|null}>}
 */
export async function updatePayment(id, data) {
  const { data: payment, error } = await supabase
    .from('payments')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  return { payment, error }
}

/**
 * Soft delete a payment.
 * @param {number} id - Payment ID
 * @returns {Promise<{error: Error|null}>}
 */
export async function deletePayment(id) {
  const { error } = await supabase
    .from('payments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  return { error }
}
