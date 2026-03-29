/**
 * Auth Store
 *
 * Manages authentication state using Svelte writable stores.
 * Compatible with Astro SSR.
 */
import { writable, derived } from 'svelte/store';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isLoading: false,
  });

  return {
    subscribe,

    /**
     * Login with email and password
     */
    async login(email: string, password: string) {
      update(state => ({ ...state, isLoading: true }));

      try {
        // TODO: Implement actual API call
        // const response = await api.login({ email, password });
        // set({ user: response.data.user, isLoading: false });
        // localStorage.setItem('accessToken', response.data.tokens.accessToken);
        // localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        
        throw new Error('Not implemented - configure API client first');
      } finally {
        update(state => ({ ...state, isLoading: false }));
      }
    },

    /**
     * Logout and clear tokens
     */
    logout() {
      set({ user: null, isLoading: false });

      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },

    /**
     * Check current auth status
     */
    async checkAuth() {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('accessToken');
      if (!token) {
        set({ user: null, isLoading: false });
        return;
      }

      update(state => ({ ...state, isLoading: true }));

      try {
        // TODO: Implement actual API call
        // const response = await api.getMe();
        // set({ user: response.data, isLoading: false });
        
        throw new Error('Not implemented - configure API client first');
      } catch {
        this.logout();
      }
    },

    /**
     * Set user data (for SSR hydration)
     */
    setUser(user: User | null) {
      set({ user, isLoading: false });
    },
  };
}

export const authStore = createAuthStore();

// Derived store for authentication status
export const isAuthenticated = derived(
  authStore,
  $auth => $auth.user !== null
);
