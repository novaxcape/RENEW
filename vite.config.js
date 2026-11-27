import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = (env.VITE_API_URL || '').replace(/\/+$/, '').replace(/\/api\/v1$/, '')

  return {
    plugins: [react()],
    server: {
      // In dev, the browser calls /api/... on localhost and Vite forwards it
      // to the backend. Same-origin from the browser's view, so no CORS error.
      proxy: target
        ? { '/api': { target, changeOrigin: true, secure: true } }
        : undefined,
    },
  }
})
