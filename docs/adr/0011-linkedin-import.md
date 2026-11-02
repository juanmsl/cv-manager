# ADR-0011: Local import from the LinkedIn PDF

- **Status:** Accepted
- **Date:** 2026-11-01

## Context

Filling the form from scratch is tedious; LinkedIn can export a profile as a PDF.

## Decision

- A modal explains how to download the profile PDF and lets the user upload it right there.
- Text is extracted with **pdfjs-dist** (lazy-loaded) and interpreted by a custom parser (`src/linkedin/`) that recognizes headings in Spanish, English and Portuguese.
- Everything happens on the device; the PDF is never sent to any service.
- The import replaces the CV data but keeps the photo.

## Consequences

- It depends on LinkedIn's PDF layout; if that changes, `parse.ts` is adjusted.
