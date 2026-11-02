# ADR-0000: Record decisions as ADRs

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The project grew through iterations (Figma design, Electron, .cv files, i18n, templates…) and the reasons behind each decision only lived in conversations. Without a record it is easy to undo something that was deliberate or to reopen a discussion that was already settled.

## Decision

Every architecture, product or process decision is documented as an ADR (Architecture Decision Record) in `docs/adr/`.

- One file per decision: `NNNN-short-title.md`, numbered in order and never renumbered.
- ADRs are written in English and follow `template.md`: Context, Decision, Consequences.
- Statuses: **Proposed**, **Accepted**, **Superseded by ADR-NNNN**, **Deprecated**.
- An accepted ADR is not rewritten: if the decision changes, a new ADR is created and the old one is marked as superseded.
- Any change that alters a rule in these ADRs ships the new ADR (or the status change) in the same commit.
- `docs/adr/README.md` keeps the index.

## Consequences

- Anyone (person or assistant) can understand why the project is the way it is before changing it.
- It costs a few extra minutes per decision; in exchange, iterations stay traceable.
