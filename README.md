# CV Manager

A macOS desktop app that builds your CV from a template and exports it as a PDF.
Built with Electron + React + Vite, following the design approved in Figma
(https://www.figma.com/design/q1QwAG3r9TZonK53v5IXFv).

## Requirements

- macOS
- Node.js 18 or later (check with `node -v`; install from https://nodejs.org)
- pnpm (`corepack enable` activates the version pinned in `package.json`)

## Getting started

```bash
pnpm install       # first time only
pnpm dev           # runs the app in development mode (reloads on save)
```

`pnpm install` and `pnpm dev` check that Electron is installed correctly and repair it if needed
(`scripts/instalar-electron.mjs`, which unzips with macOS `ditto` and re-signs it ad-hoc). To force a
clean reinstall: `pnpm reparar:electron`.

Other scripts: `pnpm typecheck` (TypeScript) and `pnpm build` (Vite production build).

## Building the app (Dock / Applications)

```bash
pnpm dist
```

Creates a `.dmg` installer in `release/`. Open it and drag **CV Manager** to Applications.

The app is signed ad-hoc (no Apple certificate), which is enough to use it on your own Mac.
If macOS says it can't verify the app is free of malware:

1. Try to open it once and dismiss the warning.
2. Go to **System Settings → Privacy & Security**, scroll to the message about
   “CV Manager” and click **Open Anyway**.

Or, from Terminal (removes the quarantine flag):

```bash
xattr -dr com.apple.quarantine "/Applications/CV Manager.app"
```

### Distributing it to other people

Opening without warnings on any Mac requires an Apple Developer Program account, a
**Developer ID Application** certificate and notarizing the app with Apple. Once you have them,
remove `"identity": null` and `afterPack` from `package.json` and set the electron-builder
environment variables (`CSC_LINK`, `CSC_KEY_PASSWORD`, `APPLE_ID`,
`APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`). See ADR-0003.

## How it works

Three steps — **Template**, **Details** and **Export** — with a live preview. Every template reads
the same data, so switching templates never loses content. The exported PDF is always a **single
page**: Letter width, at least Letter height, growing downward when the content needs it.

There are ten templates (`src/templates/`), based on the mockups in `cv-templates/`.

## Shortcuts

| Shortcut | Action |
| --- | --- |
| ⌘1 / ⌘2 / ⌘3 | Go to Template / Details / Export |
| ⌘O | Open a .cv file |
| ⌘S / ⇧⌘S | Save / Save As… |
| ⌘I | Import from LinkedIn |
| ⌘E | Export PDF |

## Import from LinkedIn

In **Details**, **Import from LinkedIn** (or ⌘I) opens a dialog that explains how to download your
profile as a PDF (**More → Save to PDF** on your LinkedIn profile) and lets you upload it right there.
The PDF is read on your Mac with pdf.js (`src/linkedin/`); you see a summary of what was found and,
after confirming, it replaces the CV data (photo, template and colors are kept). Works with
LinkedIn profiles in Spanish, English and Portuguese.

Below it are **Restore sample** (back to the sample data) and **Clear all**; both ask for confirmation.

## .cv files

**Save as .cv file** (⌘S) stores the whole CV (data, photo, template, colors and CV language) in a
`.cv` file wherever you want. It's readable JSON.

- Double-clicking a `.cv` in Finder opens CV Manager with that CV (dropping it on the Dock icon and
  **File → Open Recent** also work).
- The file name shows in the toolbar; with unsaved changes it says “Edited” and the window's red
  button shows a dot.
- Opening another `.cv` with unsaved changes asks whether to save them first.
- Double-click works with the installed app (`pnpm dist`), not with `pnpm dev`, because macOS
  registers the extension when the app is installed.
- `.cv` files have their own icon in Finder (a page with the app icon and a “CV” label). If they
  still show a generic icon after installing, open the app once from Applications; if it still
  doesn't change, relaunch Finder (⌥ + right-click its Dock icon → Relaunch).
- Icons live in `build/`: `icon.*` (app) and `cv-document.*` (.cv files). The `.svg` files are the
  source; macOS uses the `.icns` files.

## Languages

The app UI is available in **Spanish, English and Portuguese** (`src/i18n/`).

- **App language:** always starts in the system language (Spanish, English or Portuguese; any
  other opens in Spanish). Change it anytime from the **Template** step (selector at the top right)
  or **View → Language**; the change lasts until the app closes.
- **CV language:** **Export → CV language** sets the printed section titles
  (Perfil/Profile/Perfil, Experiencia/Experience/Experiência…). It's saved in the `.cv` file and
  follows the app language by default, so you can use the app in Spanish and produce an English CV.
- Your own content (titles, descriptions…) is never translated.
- To add or fix strings: `src/i18n/es.ts` is the base; `en.ts` and `pt.ts` must have the same keys
  (TypeScript flags any missing one). Native menu and dialog strings are in `electron/i18n.cjs`.

## Where your data is stored

Nowhere, unless you save it: every launch starts from scratch, on the template selector, with the
sample data and no file loaded. To keep a CV, save it as a `.cv` file (⌘S). If you close the window
or quit (⌘Q) with unsaved changes, the app asks whether to save them.

The language isn't remembered either: it always starts in the system language. On launch the app
deletes what earlier versions stored (`cv.json`, `prefs.json`) and any data in the embedded browser
(localStorage, sessionStorage, IndexedDB). Nothing leaves your Mac.

## Project structure

- `electron/` — native window, menu, `.cv` files and PDF export (`printToPDF`).
- `src/views/` — the three views: template selector, details (cards) and export.
- `src/templates/` — the CV templates (measured in pt, identical to the PDF).
- `src/styles/app.css` — app tokens and styles (Boutique Minimalist, plum accent).
- `cv-templates/` — reference mockups for the templates.
- `build/` — app and document icons used for packaging.
- `docs/DESIGN.md` — design system.
- `docs/PRODUCT.md` — product context.
- `docs/adr/` — Architecture Decision Records: the rules and definitions that guide each iteration.
  Read them before changing something they cover; a new decision goes in a new ADR.

Repository documentation is written in English; the app UI is localized.

## Roadmap

- Dark appearance (needs its own design pass).
