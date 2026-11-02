# ADR-0012: Single window: closing it quits the app

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

On macOS, apps usually stay open in the Dock after the window closes, which was confusing here.

## Decision

- The app has a single window. Closing it quits the app on macOS too (`window-all-closed` → `app.quit()`), after the unsaved-changes prompt when it applies.

## Consequences

- Simple behavior, consistent with the clean start (ADR-0008).
