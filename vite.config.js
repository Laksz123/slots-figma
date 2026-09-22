import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel auto-detects Vite (build: `vite build`, output: `dist`).
export default defineConfig({
  plugins: [react()],
})
