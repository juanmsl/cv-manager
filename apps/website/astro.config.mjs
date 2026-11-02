// @ts-check
import { defineConfig } from 'astro/config';

// Un solo index.html para es/en/pt: el idioma se elige en el navegador
// (ver src/layouts/Layout.astro y ADR-0020).
// Publicado en GitHub Pages con dominio propio, en la raíz (ADR-0022).
export default defineConfig({
  site: 'https://cv-manager.juanmsl.com',
  output: 'static',
});
