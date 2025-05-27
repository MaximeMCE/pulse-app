import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import postcss from './postcss.config.cjs';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
  },
});
