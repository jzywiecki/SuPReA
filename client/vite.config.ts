import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    watch: {
       usePolling: true,
    },
    proxy: {
        '/cat-api': {
            target: 'https://cat-avatars.vercel.app',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/cat-api/, ''),
        },
        '/no-photo': {
          target: 'https://static.vecteezy.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/no-photo/, ''),
        },
  },
}})
