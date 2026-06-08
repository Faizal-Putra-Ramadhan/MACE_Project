import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    // KITA HAPUS manualChunks yang kemarin bikin file pecah banyak.
    // Sebagai gantinya, kita cuma menaikkan batas warning agar Vercel tidak protes.
    chunkSizeWarningLimit: 1000, 
  },
})
