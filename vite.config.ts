import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: '/chakan/',
  build: {
    sourcemap: 'hidden',
    assetsInlineLimit: 0,
  },
  plugins: [
    react(),
    tsconfigPaths()
  ],
})
