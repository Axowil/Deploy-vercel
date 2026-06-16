import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Detecta el prefijo que pusiste en tu Vue
      '/api-backend': {
        target: 'https://sisacad-enrollments-backend.vercel.app',
        changeOrigin: true,
        secure: false,
        // Esto elimina '/api-backend' al pasar la petición al backend original
        rewrite: (path) => path.replace(/^\/api-backend/, '')
      }
    }
  }
})