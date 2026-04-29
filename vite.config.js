import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow ngrok / other tunnels (Host header is not localhost).
    allowedHosts: true,
  },
  // heic-to is imported dynamically (only when a HEIC is attached).
  // Vite's pre-bundler doesn't follow dynamic imports, so without this hint
  // it can fail at runtime with "Failed to fetch dynamically imported module".
  optimizeDeps: {
    include: ['heic-to'],
  },
})
