import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // rutas relativas para cargar dist/index.html desde Electron
  server: { host: '127.0.0.1', port: 5173, strictPort: false },
  // pdf.js (importar de LinkedIn) se carga aparte y solo cuando se usa.
  build: { chunkSizeWarningLimit: 1500 },
});
