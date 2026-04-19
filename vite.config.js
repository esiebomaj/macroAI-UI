import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // heic-to is imported dynamically (only when a HEIC is attached).
  // Vite's pre-bundler doesn't follow dynamic imports, so without this hint
  // it can fail at runtime with "Failed to fetch dynamically imported module".
  optimizeDeps: {
    include: ['heic-to'],
  },
})
