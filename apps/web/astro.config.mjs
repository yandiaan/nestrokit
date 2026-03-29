import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Static output (default in Astro 5.x)
  // Use `export const prerender = false` in pages for SSR opt-in
  output: 'static',

  // Svelte integration for islands
  integrations: [svelte()],

  // Vite configuration
  vite: {
    plugins: [tailwindcss()],
    // Optimize workspace dependencies
    optimizeDeps: {
      include: ['@repo/ui', '@repo/api-client'],
    },
  },

  // Development server
  server: {
    port: 4321,
    host: true,
  },

  // Build options
  build: {
    // Enable source maps in production
    sourcemap: true,
  },
});
