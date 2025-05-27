import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.cjs',
  },
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
    allowedHosts: ['d09146a5-33b1-4824-94db-f1a469c64709-00-2x4h9hl0iw10c.picard.replit.dev'], // ✅ add this
  },
});
