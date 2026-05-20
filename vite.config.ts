import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (
            id.includes('react/') ||
            id.includes('react-dom/')
          ) {
            return 'vendor-react'
          }

          if (id.includes('react-router')) {
            return 'vendor-router'
          }

          if (id.includes('@tanstack/react-query')) {
            return 'vendor-query'
          }

          if (
            id.includes('framer-motion') ||
            id.includes('lucide-react') ||
            id.includes('@react-aria') ||
            id.includes('@internationalized')
          ) {
            return 'vendor-ui'
          }

          return undefined
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})