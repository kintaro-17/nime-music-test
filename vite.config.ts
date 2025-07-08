import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/nime-music-test/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
