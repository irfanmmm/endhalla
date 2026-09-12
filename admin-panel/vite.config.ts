import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API calls to the admin backend during development
      '/api': {
        target: process.env.VITE_ADMIN_API || 'http://localhost:5003',
        changeOrigin: true,
      },
    },
  },
})
