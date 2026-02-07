import { supabase } from '../supabase'

/**
 * Get all users.
 * Excludes password_hash for security.
 * @returns {Promise<{users: Array, error: Error|null}>}
 */
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, created_at, auth_id')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return { users: data || [], error }
}

/**
 * Get a single user by ID.
 * Excludes password_hash for security.
 * @param {number} id - User ID
 * @returns {Promise<{user: Object|null, error: Error|null}>}
 */
export async function getUser(id) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, created_at, auth_id')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  return { user: data, error }
}

/**
 * Reset user password.
 * Note: This requires Supabase service role key (server-side only).
 * In client-side app, use the password reset email flow instead.
 * @param {number} id - User ID
 * @param {string} newPassword - New password (unused - see note)
 * @returns {Promise<{error: Error}>}
 */
export async function resetPassword(id, newPassword) {
  // Password changes must go through Supabase Auth email flow
  // Use: import { resetPassword } from '@/lib/auth'
  // Then: await resetPassword(userEmail)
  return {
    error: {
      message: 'Password reset requires email flow. Use auth.resetPassword(email) instead.'
    }
  }
}
