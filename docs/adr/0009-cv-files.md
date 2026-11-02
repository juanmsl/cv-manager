# ADR-0009: `.cv` files associated with the app

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

CVs need to be saved and reopened, and opened by double-clicking in Finder.

## Decision

- **`.cv`** extension with readable JSON: `{ format: "cv-manager", version: 1, savedAt, document: { template, colors, data, fileName, cvLang } }`. It doesn't include window state or the UI language.
- On open, colors for templates missing from the file are filled in and the template id is validated, so files from earlier versions still open.
- macOS: `fileAssociations` (Editor role, Owner rank) and an exported UTI `com.juanmsl.cvmanager.cv` with its own icon (`build/cv-document.icns`). Double-click, dropping on the Dock icon and “Open Recent” open the file.
- The window reflects the file: title, `setRepresentedFilename` and the “edited” dot (`setDocumentEdited`).

## Consequences

- Files are portable and can be versioned or inspected by hand.
- Incompatible format changes require bumping `version` and migrating on open.
