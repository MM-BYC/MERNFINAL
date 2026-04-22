import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendPort = process.env.PORT || 3000;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': `http://localhost:${backendPort}`,
      '/notes': `http://localhost:${backendPort}`,
    }
  }
})
