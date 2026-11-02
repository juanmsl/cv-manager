# CV Manager

App de escritorio para macOS que crea tu CV a partir de una plantilla y lo exporta a PDF.
Construida con Electron + React + Vite, según el diseño aprobado en Figma
(https://www.figma.com/design/q1QwAG3r9TZonK53v5IXFv).

## Requisitos

- macOS
- Node.js 18 o superior (`node -v` para comprobarlo; se instala desde https://nodejs.org)
- pnpm (`corepack enable` lo activa con la versión fijada en `package.json`)

## Primeros pasos

```bash
cd ~/Desktop/CV
pnpm install       # solo la primera vez
pnpm dev           # abre la app en modo desarrollo (se recarga al guardar cambios)
```

`pnpm install` y `pnpm dev` revisan que Electron esté completo y lo reparan solos
(`scripts/instalar-electron.mjs`, que descomprime con `ditto` de macOS). Para forzar
una reinstalación limpia: `pnpm reparar:electron`.


## Crear la app con ícono (para el Dock / Aplicaciones)

```bash
pnpm dist
```

Genera un instalador `.dmg` en la carpeta `release/`. Ábrelo y arrastra **CV Manager** a Aplicaciones.

La app se firma "ad-hoc" (sin certificado de Apple), suficiente para usarla en tu propio Mac.
Si macOS dice que no puede verificar que la app esté libre de malware:

1. Intenta abrirla una vez y cierra el aviso.
2. Ve a **Configuración del Sistema → Privacidad y seguridad**, baja hasta el mensaje sobre
   "CV Manager" y pulsa **Abrir de todos modos**.

O, desde Terminal (quita la marca de cuarentena):

```bash
xattr -dr com.apple.quarantine "/Applications/CV Manager.app"
```

### Para distribuirla a otras personas

Que abra sin avisos en cualquier Mac requiere una cuenta del Apple Developer Program,
un certificado **Developer ID Application** y notarizar la app con Apple. Cuando lo tengas,
quita `"identity": null` y `afterPack` de `package.json` y configura las variables de
entorno de electron-builder (`CSC_LINK`, `CSC_KEY_PASSWORD`, `APPLE_ID`,
`APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`).

## Atajos

| Atajo | Acción |
| --- | --- |
| ⌘1 / ⌘2 / ⌘3 | Ir a Plantilla / Datos / Exportar |
| ⌘O | Abrir un archivo .cv |
| ⌘S / ⇧⌘S | Guardar / Guardar como… |
| ⌘I | Importar desde LinkedIn |
| ⌘E | Exportar PDF |

## Importar desde LinkedIn

En **Datos**, el botón **Importar de LinkedIn** (o ⌘I) abre una ventana que explica cómo
descargar tu perfil en PDF (**Más → Guardar en PDF** en tu perfil de LinkedIn) y permite
subirlo ahí mismo. El PDF se lee en tu Mac con pdf.js (`src/linkedin/`), se muestra un
resumen de lo encontrado y, al confirmar, reemplaza los datos del CV (la foto, la plantilla
y los colores se conservan). Funciona con LinkedIn en español e inglés.

Debajo están **Restaurar ejemplo** (vuelve a los datos de muestra) y **Borrar todo**;
ambos piden confirmación.

## Archivos .cv

Con **Guardar como archivo .cv** (⌘S) el CV completo (datos, foto, plantilla, colores e
idioma) se guarda en un archivo `.cv` donde quieras. Es un JSON legible.

- Doble clic sobre un `.cv` en el Finder abre CV Manager con ese CV (también funciona
  arrastrarlo al ícono del Dock y **Archivo → Abrir recientes**).
- El nombre del archivo aparece en la barra superior; si hay cambios sin guardar dice
  "Editado" y el botón rojo de la ventana muestra un punto.
- Si abres otro `.cv` con cambios sin guardar, la app pregunta si quieres guardarlos.
- El doble clic funciona con la app instalada (`pnpm dist`), no con `pnpm dev`, porque macOS
  asocia la extensión al instalar la app.
- Los `.cv` se ven en el Finder con su propio ícono (una hoja con el ícono de la app y la
  etiqueta "CV"). Si después de instalar siguen con el ícono genérico, abre la app una vez
  desde Aplicaciones; si aún así no cambia, reinicia el Finder (⌥ + clic derecho en su
  ícono del Dock → Reiniciar).
- Los íconos están en `build/`: `icon.*` (app) y `cv-document.*` (archivos .cv). Los `.svg`
  son la fuente; los `.icns` son los que usa macOS.

## Idiomas

La app está en **español, inglés y portugués** (`src/i18n/`).

- **Idioma de la app:** siempre arranca en el idioma del sistema (español, inglés o portugués;
  cualquier otro abre en español). Se puede cambiar cuando quieras en el paso **Plantilla**
  (selector arriba a la derecha) o en **Ver → Idioma**; el cambio dura hasta cerrar la app.
- **Idioma del CV:** en **Exportar → Idioma del CV** se eligen los títulos del CV impreso
  (Perfil/Profile/Perfil, Experiencia/Experience/Experiência…). Se guarda en el archivo `.cv`;
  si no se elige, sigue al idioma de la app. Así puedes usar la app en español y sacar un CV en inglés.
- Tu contenido (cargos, descripciones…) no se traduce: se escribe en el idioma que quieras.
- Para agregar o corregir textos: `src/i18n/es.ts` es la base; `en.ts` y `pt.ts` deben tener
  las mismas claves (TypeScript avisa si falta alguna). El menú y los diálogos nativos están en
  `electron/i18n.cjs`.

## Dónde se guardan tus datos

En ningún lado, a menos que tú lo guardes: cada vez que abres la app empieza de cero, con los
datos de ejemplo, en el selector de plantillas y sin ningún archivo cargado. Para conservar un
CV guárdalo como archivo `.cv` (⌘S). Si cierras la ventana o sales (⌘Q) con cambios sin
guardar, la app pregunta si quieres guardarlos.

Tampoco se recuerda el idioma: siempre arranca en el del sistema. Al arrancar, la app borra
lo que guardaban versiones anteriores (`cv.json`, `prefs.json`) y cualquier dato del navegador
interno (localStorage, sessionStorage, IndexedDB). Nada sale de tu Mac.

## Estructura

- `electron/` — ventana nativa, menú, guardado y exportación a PDF (`printToPDF`).
- `src/views/` — las tres vistas: selector de plantillas, datos (fichas) y exportar.
- `src/templates/` — las plantillas de CV (medidas en pt, iguales al PDF).
- `src/styles/app.css` — tokens y estilos de la app (Boutique Minimalist, acento ciruela).
- `docs/DESIGN.md` — sistema de diseño documentado.
- `docs/PRODUCT.md` — contexto del producto.

## Pendiente

- Modo oscuro (necesita su propio diseño).
