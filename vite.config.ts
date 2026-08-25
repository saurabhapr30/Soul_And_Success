import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
      '@components': resolve(import.meta.dirname, './src/components'),
      '@layouts': resolve(import.meta.dirname, './src/layouts'),
      '@pages': resolve(import.meta.dirname, './src/pages'),
      '@styles': resolve(import.meta.dirname, './src/styles'),
      '@utils': resolve(import.meta.dirname, './src/utils'),
      '@hooks': resolve(import.meta.dirname, './src/hooks'),
      '@assets': resolve(import.meta.dirname, './src/assets'),
      '@constants': resolve(import.meta.dirname, './src/constants'),
      '@types': resolve(import.meta.dirname, './src/types'),
    },
  },
})
