# ADR-0013: Fictional sample data and placeholders

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The repository may be public. The first sample data belonged to a real person.

## Decision

- The sample data (`src/sample.ts`) and field placeholders (`ph.*` in i18n) use an invented profile: **Jhon Doe**, product designer, email and sites on `example.com`, invented companies and schools.
- The sample data exists in Spanish, English and Portuguese (same person, dates and levels; proper names unchanged). The app starts with the version of the active language, and while the sample is untouched it follows language changes.
- Real personal data (names, phone numbers, emails, photos) is never committed.

## Consequences

- Screenshots and demos can be shared without exposing anyone.
