import path from "path";

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      "framer-motion": path.resolve(__dirname, "src/lib/framer-motion-shim.tsx"),
    },
  },
  plugins: [react()],
});
