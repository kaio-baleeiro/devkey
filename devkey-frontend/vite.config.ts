// devkey-frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite' // Importe o plugin do Vite

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Adicione o plugin aqui
  ],
})