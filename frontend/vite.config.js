import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // API_BASE_URL is intentionally unprefixed so Vercel can use a normal,
  // non-sensitive environment variable. Only this public URL is exposed to
  // the browser bundle; never expose secrets through this define block.
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = process.env.API_BASE_URL ?? env.API_BASE_URL ?? '';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.API_BASE_URL': JSON.stringify(apiBaseUrl),
    },
    server: {
      port: 5173,
      proxy: {
        // Local development only. Point this at the Flask server on port 5000.
        '/api': { target: 'http://127.0.0.1:5000', changeOrigin: true },
        '/health': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      },
    },
  };
});
