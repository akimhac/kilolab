import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Force la racine du site
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    host: true
  }
});
