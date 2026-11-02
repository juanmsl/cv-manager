---
name: CV Manager
description: App nativa de macOS para generar un CV en PDF a partir de fichas de datos y plantillas intercambiables.
colors:
  window-stone: "#f6f5f2"
  sidebar-stone: "#efede8"
  desk-stone: "#e8e5df"
  surface: "#ffffff"
  ink: "#1f1f1c"
  ink-secondary: "#5c5852"
  ink-tertiary: "#67635c"
  line-separator: "#e4e1da"
  line-field: "#d8d4cc"
  ruled-plum: "#d9cfe3"
  plum: "#5b3f73"
  plum-hover: "#4d3463"
  plum-tint: "#ece6f1"
  tab-ochre: "#c8ae7a"
  tab-sage: "#9fb29b"
  tab-sky: "#a3b4c6"
  tab-rose: "#c6a4a6"
  danger: "#a33a32"
typography:
  display:
    fontFamily: "Josefin Sans, -apple-system, sans-serif"
    fontSize: "34px"
    fontWeight: 300
    lineHeight: 1.1
  app-title:
    fontFamily: "Josefin Sans, -apple-system, sans-serif"
    fontSize: "18px"
    fontWeight: 300
    letterSpacing: "0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.35
    fontFeature: "tnum"
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "11px"
    fontWeight: 500
  sidebar-header:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "10.5px"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  tab: "3px"
  control: "7px"
  row: "10px"
  card: "12px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "20px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.plum}"
    textColor: "{colors.surface}"
    rounded: "8px"
    padding: "0 14px"
    height: "28px"
  button-primary-hover:
    backgroundColor: "{colors.plum-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "8px"
    padding: "0 14px"
    height: "28px"
  button-link:
    textColor: "{colors.plum}"
    padding: "0 4px"
    height: "24px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "6px 10px"
  sidebar-divider-item:
    textColor: "{colors.ink}"
    rounded: "8px"
    padding: "0 10px 0 8px"
    height: "30px"
  sidebar-divider-item-active:
    backgroundColor: "{colors.surface}"
  entry-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
  banner:
    backgroundColor: "{colors.plum-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "10px 12px 10px 14px"
---

# Design System: CV Manager

## Overview

**Creative North Star: "El fichero de catálogo"**

Los datos del CV son un fichero de tarjetas; las plantillas son solo maneras de imprimirlas. La app es Boutique Minimalista sobre macOS nativo: neutros de piedra cálidos, filetes finos (0.5px), sombras suaves y difusas, y una única voz de color, el ciruela, para acciones primarias y selección. La gramática de catálogo (filete superior en cada ficha, un icono por separador de sección) se mantiene callada: estructura, nunca decoración.

La densidad es la de una app de Mac (cuerpo de 13px, controles de 28px), con el CV como protagonista en una mesa de piedra más oscura a la derecha. El cromo de la app nunca compite con la página.

**Key Characteristics:**
- Neutros de piedra en capas tonales: ventana, barra lateral, mesa.
- Ciruela como único acento; los separadores de sección usan iconos de línea en tinta secundaria.
- Fichas con filete superior: ciruela 2px cuando está abierta, ciruela claro 1.5px en reposo.
- Josefin Sans Light solo para títulos de pantalla y nombre de la app; SF Pro para toda la UI.
- Controles y convenciones nativas de macOS (semáforos, barra lateral, ⌘).

## Colors

Piedra cálida y tinta casi negra, con un ciruela profundo como única voz y cuatro pestañas de catálogo desaturadas.

### Primary
- **Ciruela de catálogo** (plum): botón primario, selección (radio, checkbox vía `accent-color`), anillo de foco, filete de la ficha abierta, fechas de la ficha abierta, enlaces.
- **Ciruela hundido** (plum-hover): hover del primario.
- **Velo ciruela** (plum-tint): banners informativos, selección de texto, zona de foto al arrastrar.
- **Filete ciruela claro** (ruled-plum): filete superior de fichas y tarjetas de plantilla en reposo; separador cabecera/cuerpo de la ficha.

### Secondary
- **Tonos de catálogo** (tab-ochre, tab-sage, tab-sky, tab-rose): reservados; desde v0.1.1 los separadores usan iconos en lugar de pestañas de color. Sage solo marca el icono de "Guardado".

### Neutral
- **Piedra de ventana** (window-stone): fondo de la ventana y la barra de herramientas; fondo de viñetas editables.
- **Piedra de barra lateral** (sidebar-stone): barra lateral y fondo de miniaturas de plantilla.
- **Piedra de mesa** (desk-stone): superficie donde reposa la página del CV (vista previa y exportación).
- **Superficie** (surface): fichas, paneles, campos, botones secundarios, item activo de la barra lateral.
- **Tinta** (ink), **tinta secundaria** (ink-secondary), **tinta terciaria** (ink-tertiary): texto principal, subtítulos/metadatos, y placeholders/contadores/iconos en reposo. Ambas secundarias cumplen AA sobre todos los fondos de piedra.
- **Filete separador** (line-separator) y **filete de campo** (line-field): divisiones estructurales y bordes de controles.
- **Peligro** (danger): eliminar ficha y toasts de error. Nunca como acento.

### Named Rules
**The One Voice Rule.** El ciruela es el único color de acción y selección. Si algo es interactivo y primario, es ciruela; si no lo es, no lo es.
**The Section Icon Rule.** Cada sección de la barra lateral se identifica con un icono Phosphor (react-icons/pi, peso regular, 17px) en tinta secundaria; el icono de la sección activa pasa a ciruela. Iconos: Foto y datos PiUserCircle, Perfil PiQuotes, Contacto y redes PiAddressBook, Experiencia PiBriefcase, Educación PiGraduationCap, Habilidades PiWrench, Idiomas PiTranslate, Colores PiPalette.

## Typography

**Display Font:** Josefin Sans 300 (con -apple-system)
**Body Font:** SF Pro vía -apple-system

**Character:** Un display geométrico ligero, de rótulo de catálogo, sobre la voz nativa de macOS. El contraste es de peso y tamaño, no de color.

### Hierarchy
- **Display** (300, 34px, 1.1): título de cada pantalla ("Elige una plantilla", nombre de la sección en el editor). Lleva 4px de compensación óptica arriba.
- **App title** (300, 18px, 0.02em): "CV Manager" en la barra de herramientas.
- **Title** (600, 14px): nombre de plantilla, título de estado vacío; 600/13px para títulos de panel e inspector.
- **Body** (400, 13px, 1.35, cifras tabulares): toda la UI y campos.
- **Caption** (12px): subtítulos, descripciones, segmentado, banners, pie de vista previa.
- **Label** (500, 11px): etiquetas de campo; 400/11px para contadores, pistas y fechas (0.02em).
- **Sidebar header** (600, 10.5px, 0.1em, mayúsculas): solo el encabezado de grupo de la barra lateral ("Secciones"), convención nativa de macOS.

### Named Rules
**The Light Display Rule.** Josefin Sans aparece solo en 300 y solo en el título de pantalla y el nombre de la app. Nunca en botones, etiquetas ni cuerpo.

## Layout

Ventana en columna: barra de herramientas de 52px (rejilla 1fr/auto/1fr, 84px a la izquierda para los semáforos; título, segmentado Plantilla/Datos/Exportar centrado, acciones a la derecha), luego la vista.

- **Selector:** rejilla de 3 columnas con 32px de separación, padding 48/64px; barra inferior de 60px.
- **Editor:** 220px barra lateral / centro fluido / 404px vista previa. Por debajo de 1240px: 200 / fluido / 336px y padding central de 28px.
- **Exportar:** mesa fluida / inspector de 320px en grupos separados por filetes, acciones fijas abajo.

Ritmo: 14px entre fichas y campos, 20px entre bloques, 10–12px de gap en filas de control, 32px de padding de pantalla. La transición de vista es un fundido de 260ms con 4px de subida; con `prefers-reduced-motion` desaparece.

## Elevation & Depth

Plano por defecto, con profundidad por capas tonales de piedra y filetes de 0.5px. La sombra aparece solo como respuesta al estado (ficha abierta, plantilla elegida) o para objetos que flotan (página del CV, toasts, pista sobre la página vacía).

### Shadow Vocabulary
- **Suave** (`0 12px 32px rgb(61 41 77 / 0.1)`): ficha abierta, plantilla seleccionada, pista de vista previa vacía.
- **Control** (`0 1px 1px rgb(0 0 0 / 0.04)`): botones secundarios y menús emergentes.
- **Papel** (`0 3px 12px rgb(0 0 0 / 0.16)`): la página del CV sobre la mesa (0 3px 10px / 0.14 en miniaturas).

### Named Rules
**The Flat-At-Rest Rule.** Fichas y tarjetas no tienen sombra en reposo; la ganan al abrirse o seleccionarse, junto con el borde ciruela al 35%.

## Shapes

Esquinas suaves y escalonadas por tamaño: 3px en pestañas (3 3 1 1, forma de pestaña), 5–8px en controles (7px es el token), 10px en filas, banners y toasts, 12px en fichas y tarjetas. Bordes de 0.5px. Círculos solo para radios, muestras de color y puntos de viñeta (4px, ciruela). Estados vacíos y zona de foto usan borde discontinuo de 1px.

## Components

### Buttons
Discretos y nativos.
- **Shape:** 28px de alto, esquinas suaves (8px en el build), padding 0 14px.
- **Primary:** fondo ciruela, texto blanco 600, sin sombra. Uno por vista ("Revisar y exportar", "Exportar PDF").
- **Hover / Focus:** hover ciruela hundido; active baja 0.5px; foco con anillo ciruela de 2px y 2px de separación.
- **Secondary:** superficie blanca, filete de campo, sombra de control, 500.
- **Link:** texto ciruela sin caja, subrayado al hover. **Danger:** texto rojo; sólido rojo solo en confirmación.
- **Icon button:** 24×24, transparente, icono terciario; hover con velo negro al 5%.

### Cards / Containers (Fichas)
Firma del sistema.
- **Corner Style:** 12px.
- **Background:** superficie con filete separador de 0.5px.
- **Filete superior:** 1.5px ciruela claro en reposo; 2px ciruela al abrir. La misma regla marca las tarjetas de plantilla (miniatura sobre piedra de barra lateral).
- **Cabecera:** asa de arrastre, título 600 con subtítulo 12px, fechas a la derecha, chevron que rota 90° (200ms).
- **Cuerpo:** separado por filete ciruela claro de 1px, padding 16/20/18/38px, gap 14px; pie con flechas de orden y "Eliminar ficha".
- **Arrastre:** origen al 45% de opacidad; destino marcado con línea ciruela de 3px arriba.

### Inputs / Fields
- **Style:** fondo blanco, filete de campo 0.5px, 7px, padding 6/10px, etiqueta 11px/500 arriba.
- **Focus:** borde ciruela y halo `0 0 0 3px rgb(91 63 115 / 0.16)`; cursor ciruela.
- **Viñetas:** filas sobre piedra de ventana con punto ciruela; foco con halo de 2px.
- **Segmentado:** pista negra al 6%, opción activa blanca 600 con sombra mínima.

### Navigation
- **Barra lateral:** piedra de barra lateral, encabezado de grupo pequeño en mayúsculas, items de 30px con icono (17px) + nombre + contador terciario. Hover: blanco al 50% e icono en tinta primaria; activo: blanco, 600, sombra mínima, icono ciruela. Al abrir la vista Datos la sección seleccionada es "Foto y datos". Estado de guardado anclado abajo.
- **Pasos:** segmentado centrado en la barra de herramientas.

### Vista previa en vivo
La página del CV a escala sobre la mesa, con cabecera (nombre de plantilla, tamaño de papel), pie de paginación (ciruela si desborda) y salto de página marcado con línea discontinua ciruela. La ficha en edición se resalta en la página con contorno discontinuo ciruela que nunca se imprime.

## CV templates

Las plantillas son maquetas de impresión del contenido del usuario, no parte del sistema de la app; los tokens de arriba no se aplican dentro de la página.

- **Medidas en pt:** una sola página de ancho Carta (612pt) y alto mínimo Carta (792pt) que crece hacia abajo con el contenido; cuerpo 9pt/1.4, pila SF Pro / Helvetica Neue / Arial.
- **Color configurable:** tres variables por plantilla (`--cv-primary`, `--cv-text`, `--cv-accent`), con valores por defecto:
  - **Columna oscura:** primario #2D3039, texto #4A4B50, acento #FFFFFF. Columna lateral oscura de 214pt.
  - **Retrato:** primario #141414, texto #333333, acento #B5B5B5. Lateral de 250pt sobre gris #EDEDED, foto con diagonal, anillos de nivel.
  - **Editorial:** primario #161616, texto #333333, acento #C8DD00. Banda de acento lima y texto vertical.
- **Impresión:** `print-color-adjust: exact`; artículos y elementos de lista no se parten entre páginas; el resaltado de edición se anula al imprimir. La página es la misma en vista previa y PDF.

## Do's and Don'ts

### Do:
- **Do** usar el ciruela solo para la acción primaria, selección y foco.
- **Do** marcar cada ficha o tarjeta de catálogo con su filete superior: 1.5px ciruela claro en reposo, 2px ciruela activa.
- **Do** expresar profundidad con las tres piedras (ventana, barra lateral, mesa) y filetes de 0.5px antes que con sombras.
- **Do** usar iconos SVG de un solo trazo de 1.5px, `currentColor`.
- **Do** respetar controles nativos de macOS: 28px de alto, cuerpo de 13px, ⌘ en las pistas de teclado.

### Don't:
- **Don't** mezclar familias de iconos: solo Phosphor peso regular en la barra lateral.
- **Don't** usar Josefin Sans fuera del título de pantalla y el nombre de la app, ni en pesos distintos de 300.
- **Don't** poner etiquetas pequeñas en mayúsculas sobre títulos de contenido; el estilo en mayúsculas existe solo como encabezado de grupo de la barra lateral.
- **Don't** dar sombra a fichas o tarjetas en reposo.
- **Don't** aplicar tokens de la app dentro de las plantillas del CV.

## Open items

- **Apariencia oscura:** pendiente. No está diseñada (ni en Figma ni en el build); la app fija `color-scheme: light`. No hay tokens oscuros; no inventarlos hasta su propio pase de diseño.
- **Varios CV guardados** e **idioma(s) de la UI**: sin resolver.
