import { create } from 'zustand';
import { signIn, signOut, getSession, getCurrentUser } from '../lib/auth';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start true for initial auth check
  error: null,

  /**
   * Initialize auth state from Supabase session.
   * Call this on app startup.
   */
  initializeAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const { session } = await getSession();
      if (session) {
        const { user, error } = await getCurrentUser();
        if (error) throw error;
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false, error: error.message });
    }
  },

  /**
   * Login with email and password.
   */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;

      // Fetch full user data with role
      const { user, error: userError } = await getCurrentUser();
      if (userError) throw userError;

      set({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  /**
   * Logout current user.
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  /**
   * Update user in state (for auth state changes).
   */
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  /**
   * Clear any error.
   */
  clearError: () => set({ error: null }),
}));
