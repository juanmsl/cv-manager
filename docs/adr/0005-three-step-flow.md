# ADR-0005: Three-step flow with live preview

- **Status:** Accepted
- **Date:** 2026-10-31

## Context

The goal is to produce a CV without friction: choose how it looks, fill in the data, export.

## Decision

- Three views: **Template** (gallery), **Details** (form by sections with live preview) and **Export** (large preview, options and PDF).
- Users can always move between steps and switch templates without losing data.
- The Details sidebar uses one icon per section and opens on “Photo and name” by default.
- Shortcuts: ⌘1/⌘2/⌘3 switch steps, ⌘E exports, ⌘I imports from LinkedIn, ⌘S/⇧⌘S save, ⌘O opens.
- Data actions: import from LinkedIn, restore the sample data and clear everything.

## Consequences

- Every new feature must live in one of the three steps; no standalone screens without an ADR.
