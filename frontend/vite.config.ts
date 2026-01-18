import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'shaniqua-restricted-chartographically.ngrok-free.dev',
    ],
    watch: {
      usePolling: true,
      interval: 300,
    },
    hmr: false,
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
      },
    },
  },
})
