import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  build: {
    outDir: 'dist/client',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom'
    }
  }
})