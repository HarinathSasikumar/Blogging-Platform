import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://blogging-platform-backend-k7gt.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://blogging-platform-backend-k7gt.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
