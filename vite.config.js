import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Nomad AI Trip Planner',
        short_name: 'Nomad',
        description: 'Plan your trips to India with AI',
        theme_color: '#0033A0',
        icons: [
          {
            src: 'https://cdn.iconscout.com/icon/free/png-256/free-compass-1439600-1214227.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://cdn.iconscout.com/icon/free/png-512/free-compass-1439600-1214227.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
