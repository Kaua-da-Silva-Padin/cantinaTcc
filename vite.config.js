import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { reactRouter } from '@react-router/dev/vite'
import { vercelPreset } from '@vercel/react-router/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter({
    presets: [vercelPreset()],
  })],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
