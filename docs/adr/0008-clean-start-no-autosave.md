# ADR-0008: Clean start: nothing is saved automatically

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The app used to autosave the CV and reopen it. It was requested that every launch starts from scratch, with the sample data and no file.

## Decision

- No autosave and no browser storage for the CV.
- On launch, the app deletes what earlier versions stored (`cv.json`, `prefs.json`) and clears the session's localStorage, sessionStorage, IndexedDB and caches.
- It always opens on the **Template** step, with the **sample data** and no file loaded.
- The only way to keep a CV is to save it as a `.cv` file (ADR-0009).
- If there are unsaved changes when closing the window or quitting (⌘Q), the app asks Save / Don't Save / Cancel. Untouched sample data does not count as changes.

## Consequences

- Privacy and predictability: no personal data stays on the machine unless the user decides so.
- Closing without saving loses the work; the close prompt mitigates that risk.
