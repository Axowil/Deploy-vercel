import { defineConfig } from 'vite'
import vue from '@vitejs/vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api-backend': {
        target: 'https://sisacad-enrollments-backend.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-backend/, '')
      }
    }
  }
})