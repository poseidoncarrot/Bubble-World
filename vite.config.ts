/**
 * Vite Configuration
 * 
 * This file configures the Vite build tool for the Bubble World application:
 * - React plugin for JSX transformation
 * - Path alias (@) for cleaner imports
 * - Manual chunk splitting for better caching
 * - Build optimization settings
 * 
 * Plugins:
 * - @vitejs/plugin-react: Enables React support with Fast Refresh
 * 
 * Path Aliases:
 * - @: Maps to ./src directory
 * - Usage: import { Component } from '@/components/Component'
 * 
 * Manual Chunks:
 * - vendor: React and React DOM (stable, rarely changes)
 * - ui: UI components (@radix-ui, lucide-react)
 * - supabase: Supabase client library
 * - router: React Router
 * - dnd: Drag-and-drop libraries
 * 
 * Build Settings:
 * - chunkSizeWarningLimit: 1000KB (relaxed for larger bundles)
 * - sourcemap: false (disabled for production builds)
 * 
 * TODO: Consider adding PWA support
 * TODO: Add bundle size analysis plugin
 */

import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
          supabase: ['@supabase/supabase-js'],
          router: ['react-router-dom'],
          dnd: ['react-dnd', 'react-dnd-html5-backend']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  }
})
