# ADR-0020: Website language chosen in the browser, not in the URL

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The website is available in Spanish, English and Portuguese. The first build used one route per language (`/`, `/en/`, `/pt/`). We prefer a single URL that always opens in the visitor's language, consistent with the desktop app, which follows the system language (ADR-0010).

The site is static (ADR-0018), so there is no server that can read `Accept-Language` or a cookie.

## Decision

- **One page, three versions.** `src/pages/index.astro` renders the full landing once per language, each inside `<div data-lang="…">`. CSS shows only the version that matches `<html lang>`; the others are `display: none`, so they are hidden from assistive technology too.
- **Language resolution**, done by a small inline script in `<head>` before the first paint:
  1. The language the visitor picked before, stored in `localStorage` (`cv-manager:lang`).
  2. Otherwise the first browser language (`navigator.languages`) that is `es`, `en` or `pt`.
  3. Otherwise **English**.
- **Switching** with the language buttons (header and footer) updates `<html lang>`, the document title and `localStorage`, without reloading. Focus moves to the equivalent button in the newly visible version.
- `localStorage` over a cookie: nothing on the server needs it, and it is never sent with requests.
- Element ids must be unique across the three versions: section anchors use per-language slugs (`SLUGS` in `src/i18n/ui.ts`), and other ids get a `-<lang>` suffix.
- Sample content (sheet images and template thumbnails) is exported from the desktop app with the sample data of each language, so every version reads fully translated.

## Consequences

- One shareable URL; visitors land in their language with no redirect and no flash of another language.
- Without JavaScript the page shows English.
- The HTML carries the three versions (about three times the text). Images of hidden versions are lazy-loaded, so they are not downloaded.
- Search engines index a single URL, mainly in English. If per-language indexing becomes important, revisit this decision (for example, add `?lang=` variants with `hreflang`).
