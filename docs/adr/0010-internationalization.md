# ADR-0010: UI in Spanish, English and Portuguese

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The app must work in three languages, and sometimes the UI should be in one language and the CV in another.

## Decision

- Custom i18n, no library: `src/i18n/es.ts` is the base; `en.ts` and `pt.ts` must have exactly the same keys (enforced by the `Dict` type). Native menu and dialog strings live in `electron/i18n.cjs`.
- **UI language: always the system language** on launch (the first of the system's preferred languages that is es/en/pt; if none is, **English**). It can be changed at any time (Template step selector or View → Language) and lasts until the app closes; it is not stored.
- **CV language** (printed section titles) is independent, chosen in Export and saved in the `.cv`; it follows the UI language by default.
- User-written content is never translated.

## Consequences

- Every new UI or template string is added in all three languages in the same change.
