import { supabase } from './supabase'

/**
 * Sign in with email and password using Supabase Auth.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object|null, session: object|null, error: Error|null}>}
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { user: data?.user ?? null, session: data?.session ?? null, error }
}

/**
 * Sign out the current user.
 * @returns {Promise<{error: Error|null}>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get current session.
 * @returns {Promise<{session: object|null, error: Error|null}>}
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data?.session ?? null, error }
}

/**
 * Get current user with role from public.users table.
 * @returns {Promise<{user: object|null, error: Error|null}>}
 */
export async function getCurrentUser() {
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
  if (authError || !authUser) {
    return { user: null, error: authError }
  }

  // Fetch additional user data from public.users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role')
    .eq('auth_id', authUser.id)
    .single()

  if (userError) {
    return { user: null, error: userError }
  }

  return {
    user: {
      ...userData,
      firstName: userData.first_name,
      lastName: userData.last_name,
    },
    error: null
  }
}

/**
 * Request password reset email.
 * @param {string} email
 * @returns {Promise<{error: Error|null}>}
 */
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { error }
}
