# ADR-0001: Desktop app built with Electron, React, Vite and TypeScript

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

The goal is a macOS app that opens from an icon like any native app, built with web technologies (HTML, CSS, JS/React), and able to produce PDFs that match the design exactly.

## Decision

- **Electron** (31.x) as the native shell: window with `titleBarStyle: hiddenInset`, native menu and system dialogs.
- **React 18 + TypeScript** for the UI; **Vite 5** for development and builds (`base: './'` so it loads from disk).
- Strict process separation: the renderer has no Node access (`contextIsolation: true`, `nodeIntegration: false`); everything goes through `electron/preload.cjs` (`window.cvApi`) and IPC channels in `electron/main.cjs`.
- The PDF is produced with `webContents.printToPDF` (see ADR-0007), so what you see is what prints.
- No state or styling libraries: state lives in React Context (`src/state.tsx`, `src/document.tsx`) and styles are plain CSS.

## Consequences

- One language across the whole app, and templates are regular React components.
- The app is as heavy as Electron (~200 MB installed); accepted in exchange for PDF fidelity.
- Any system access (files, dialogs) needs a new channel in preload + main.
