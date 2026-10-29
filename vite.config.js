import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages deployment uses repo name as base path
const isGitHubPages = process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // GitHub Pages base path
  base: isGitHubPages ? '/navigo-campus-navigation/' : '/',

  server: {
    host: true,
    port: 5173,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
