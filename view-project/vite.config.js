import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api-backend': {
        target: 'https://sisacad-enrollments-backend.vercel.app',
        changeOrigin: true,
        secure: false,
        // Elimina el prefijo '/api-backend' para que al backend real le llegue solo '/restful/...'
        rewrite: (path) => path.replace(/^\/api-backend/, '')
      }
    }
  }
})