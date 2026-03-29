/**
 * UI Store
 *
 * Manages UI-related state like theme, modals, and notifications.
 * Compatible with Astro SSR.
 */
import { writable, derived, get } from 'svelte/store';

type Theme = 'light' | 'dark' | 'system';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  toasts: Toast[];
}

function createUIStore() {
  const initialState: UIState = {
    theme: 'system',
    sidebarOpen: false,
    toasts: [],
  };

  const { subscribe, set, update } = writable<UIState>(initialState);

  // Initialize theme from localStorage on client
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) {
      update(state => ({ ...state, theme: saved }));
    }
  }

  return {
    subscribe,

    /**
     * Set the color theme
     */
    setTheme(theme: Theme) {
      update(state => ({ ...state, theme }));

      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
        this.applyTheme();
      }
    },

    /**
     * Apply the current theme to the document
     */
    applyTheme() {
      if (typeof window === 'undefined') return;

      const state = get({ subscribe });
      const root = document.documentElement;
      const isDark =
        state.theme === 'dark' ||
        (state.theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      root.classList.toggle('dark', isDark);
    },

    /**
     * Toggle sidebar
     */
    toggleSidebar() {
      update(state => ({ ...state, sidebarOpen: !state.sidebarOpen }));
    },

    /**
     * Show a toast notification
     */
    toast(type: Toast['type'], message: string, duration = 5000) {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = { id, type, message, duration };

      update(state => ({ ...state, toasts: [...state.toasts, toast] }));

      if (duration > 0) {
        setTimeout(() => {
          this.dismissToast(id);
        }, duration);
      }

      return id;
    },

    /**
     * Dismiss a toast
     */
    dismissToast(id: string) {
      update(state => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    },

    /**
     * Clear all toasts
     */
    clearToasts() {
      update(state => ({ ...state, toasts: [] }));
    },
  };
}

export const uiStore = createUIStore();

// Derived stores for easy access
export const theme = derived(uiStore, $ui => $ui.theme);
export const sidebarOpen = derived(uiStore, $ui => $ui.sidebarOpen);
export const toasts = derived(uiStore, $ui => $ui.toasts);
