// @ts-check
import { defineConfig } from 'astro/config';

// Un solo index.html para es/en/pt: el idioma se elige en el navegador
// (ver src/layouts/Layout.astro y ADR-0020).
export default defineConfig({
  output: 'static',
});
