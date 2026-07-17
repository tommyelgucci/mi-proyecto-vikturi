import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' para que el build funcione en cualquier subruta (p. ej. GitHub Pages)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})
