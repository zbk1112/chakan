import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  // 生产环境（GitHub Pages）使用 /chakan/ 前缀，开发环境使用相对路径
  base: mode === 'production' ? '/chakan/' : './',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    sourcemap: 'hidden',
    assetsInlineLimit: 0,
  },
  plugins: [
    react(),
    tsconfigPaths()
  ],
}))
