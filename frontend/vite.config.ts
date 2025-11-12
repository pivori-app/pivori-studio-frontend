import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'public',
  
  server: {
    port: 5173,
    strictPort: false,
    open: false,
    cors: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  build: {
    target: 'ES2020',
    outDir: '../dist',
    minify: 'terser',
    sourcemap: process.env.NODE_ENV === 'development',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['lucide-react'],
          'utils': ['zustand']
        }
      }
    }
  },

  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
      '@stores': '/src/stores',
      '@services': '/src/services',
      '@utils': '/src/utils',
      '@styles': '/src/styles'
    }
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'zustand']
  }
})
