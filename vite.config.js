import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    proxy: {
      '/api': {
        target: mode === 'production' ? 'https://grabitedit-1.onrender.com' : 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}))
