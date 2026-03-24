import { supabase } from '../supabase'

/**
 * Get all users.
 * Excludes password for security.
 * @returns {Promise<{users: Array, error: Error|null}>}
 */
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, created_at, auth_id')
    .order('created_at', { ascending: false })

  // Transform snake_case to camelCase for frontend compatibility
  const users = data?.map(user => ({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    createdAt: user.created_at,
    authId: user.auth_id
  })) || []

  return { users, error }
}

/**
 * Get a single user by ID.
 * Excludes password for security.
 * @param {number} id - User ID
 * @returns {Promise<{user: Object|null, error: Error|null}>}
 */
export async function getUser(id) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, created_at, auth_id')
    .eq('id', id)
    .single()

  // Transform snake_case to camelCase for frontend compatibility
  const user = data ? {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    createdAt: data.created_at,
    authId: data.auth_id
  } : null

  return { user, error }
}

/**
 * Reset user password.
 * Note: This requires Supabase service role key (server-side only).
 * In client-side app, use the password reset email flow instead.
 * @param {number} id - User ID
 * @param {string} newPassword - New password (unused - see note)
 * @returns {Promise<{error: Error}>}
 */
export async function resetPassword(_id, _newPassword) {
  // Password changes must go through Supabase Auth email flow
  // Use: import { resetPassword } from '@/lib/auth'
  // Then: await resetPassword(userEmail)
  return {
    error: {
      message: 'Password reset requires email flow. Use auth.resetPassword(email) instead.'
    }
  }
}
