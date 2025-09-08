import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// import tailwindcss from '@tailwindcss/vite';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vue()],
  resolve: {
    alias: {
      // '@': path.resolve(__dirname, 'src'), // 将 @ 映射到 src 目录
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/api/, '');
        },
      },
    },
  },
});
