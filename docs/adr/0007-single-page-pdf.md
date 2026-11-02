# ADR-0007: The PDF is always a single Letter-width page

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

Originally there was an A4/Letter option and long content split across pages. It was decided that the CV is always a single sheet.

## Decision

- No page-size selector. The page is **612 pt wide (Letter)** and **at least 792 pt tall (Letter)**; when content doesn't fit, it **grows downward only**.
- Templates are laid out in **pt** on that width; `--page-h` is the minimum height.
- On export, the print copy (`.print-root`) is measured, `@page { size: 612pt <height>pt }` is set and `printToPDF` receives the same size in inches.
- The UI shows the real size (e.g. “1 page · 8.5 × 11.2 in”) and notes when the sheet is taller than Letter.

## Consequences

- There are never page breaks or split content.
- A very long CV produces a non-standard sheet; accepted because the main use is digital.
