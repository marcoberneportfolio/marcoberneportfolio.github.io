import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // .publish only holds working files: watching them can crash the server on Windows
  server: { watch: { ignored: ['**/.publish/**'] } },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
