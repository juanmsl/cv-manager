# ADR-0025: In-app updates without Squirrel

- **Status:** Accepted
- **Date:** 2026-11-06

## Context

New versions are published as GitHub releases (ADR-0021) with `CV-Manager-macOS-arm64.dmg` and `SHA256SUMS.txt`. People should be able to update from the app: check on demand, get a notice when there is a new version, install it replacing the current one, and optionally do it all automatically.

The usual tool, `electron-updater` (Squirrel.Mac), only works with apps signed with an Apple Developer ID: it checks that the new version has the same designated requirement as the installed one. CV Manager is signed ad hoc (ADR-0003), so that check always fails.

## Decision

A small updater in the main process (`electron/updater.cjs`):

1. **Check:** GitHub's `releases/latest` API for `juanmsl/cv-manager`, compared with `app.getVersion()` (semver). Pre-releases are not offered. It runs 4 seconds after launch, every 6 hours while the app is open, and from **CV Manager → Check for Updates…**. Only GitHub is contacted; no CV or personal data is sent.
2. **Download:** the release's `.dmg`, with progress, verified against the release's `SHA256SUMS.txt`.
3. **Prepare:** the `.dmg` is mounted read-only (`hdiutil`), `CV Manager.app` is copied to a temporary folder (`ditto`), and its `CFBundleShortVersionString` and signature (`codesign --verify --deep`) are checked.
4. **Install:** when the app quits, a detached shell script waits for the process to end, moves the installed app aside, copies the new one into its place, restores the old one if the copy fails, and reopens it when the person chose **Restart and update**. The new app is not quarantined because the download is made by the app itself, not by a browser.
   - Unsaved changes still go through the usual "Save changes?" dialog before quitting.
   - If the app cannot be replaced (running from the `.dmg`, from a read-only location, or in development), the downloaded installer is opened instead so the person can drag the app to Applications.

In the interface (`components/UpdateToast.tsx`), a notice in the bottom-right corner shows: new version available (with a link to the release notes, **Download and install**, and the automatic-updates checkbox), download progress, ready to install (**Restart and update**, or it installs when the app quits), and errors with **Try again**.

**Update automatically** (menu checkbox and notice checkbox) downloads new versions in the background and installs them when the app quits. It is off by default and is the only setting the app stores: `updates.json` in the app's data folder. This is an exception to ADR-0008, which keeps no CV data or other preferences between launches.

## Consequences

- Updates work without an Apple Developer account. If the app gets a Developer ID later, this can move to `electron-updater`.
- The checksum and signature checks protect against corrupted or tampered downloads. They don't prove who published the release, which the GitHub release itself must guarantee.
- The update check is a network request, so the app now goes online when opened, if a connection is available. Everything else still works offline.
- The installer is named `CV-Manager-macOS-arm64.dmg` in every release, which the updater looks for first.
