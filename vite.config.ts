import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/FlipMaster-7/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
