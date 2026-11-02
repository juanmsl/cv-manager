# ADR-0006: One data model for every template

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

Switching templates must never lose information, and adding templates must not require changing the form.

## Decision

- `CvData` (`src/types.ts`) is the only model: photo, name, title, profile, contact, links, experience (with achievements), education, skills (level 0–100), languages (level and label) and a note.
- Templates only **read** `CvData`; they never store data of their own.
- Colors are per template (`colors[templateId]`: `primary`, `text`, `accent`) with defaults in `DEFAULT_COLORS`.
- Anything a template cannot show is omitted; sections a mockup has but the model lacks (references, interests, certifications…) are covered by **Note**, or need an ADR that extends the model.
- Extending `CvData` means updating the form, the LinkedIn import, `.cv` files (backward compatible) and every template.

## Consequences

- Switching templates is instant and lossless.
- The model is deliberately small; growing it is an explicit decision.
