import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@engine': resolve(__dirname, './src/engine'),
      '@game': resolve(__dirname, './src/game'),
      '@ui': resolve(__dirname, './src/ui'),
      '@api': resolve(__dirname, './src/api'),
    },
  },
  server: {
    port: 5174, // ✅ porta que o KRATOS usa em window.open(http://localhost:5174/...)
    open: false, // não abre automaticamente — é aberto pelo KRATOS
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
})