# ADR-0021: Releases prepared and published by GitHub Actions

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

The website's download button points to the latest GitHub release (`releases/latest`), so every version needs a release with the `.dmg`. Bumping the version, writing the changelog and building the installer by hand is easy to get wrong and makes the installer depend on a personal Mac.

## Decision

A release has two steps, each a workflow:

1. **Prepare** (`.github/workflows/prepare-release.yml`, run by hand from `main` with a `patch`, `minor` or `major` input):
   - Bumps `version` in `apps/desktop/package.json` (semantic versioning).
   - Adds a section `## [X.Y.Z] - date` to the top of `CHANGELOG.md` with GitHub's automatic release notes: the pull requests merged since the previous `v*` tag.
   - Pushes the branch `release/vX.Y.Z` and opens the pull request `release: vX.Y.Z` with that changelog.
2. **Release** (`.github/workflows/release.yml`, runs when a `release/v*` pull request is merged into `main`):
   - **Build job** (`macos-14`, Apple Silicon): checks out the merge commit, checks that the branch matches the version, runs lint and type check for the desktop app and builds the `.dmg` with electron-builder (`--mac --arm64 --publish never`). The app keeps the ad-hoc signature from ADR-0003; there is no Apple certificate or notarization.
   - **Release job**: creates the tag `vX.Y.Z` on the merge commit and the GitHub release with the `.dmg` and a `SHA256SUMS.txt`. The notes are `.github/release-notes.md` (download and first-launch steps) followed by the version's section of `CHANGELOG.md`. Versions with a suffix (`1.0.0-beta.1`) are marked as pre-releases.
   - Run by hand, it only builds the `.dmg` and attaches it to the run, to test a build without publishing.
- The tag is created at release time, on the commit in `main`, so it is correct whatever merge method is used (merge, squash or rebase).
- The installer has a stable name without the version, `CV-Manager-macOS-arm64.dmg` (`mac.artifactName`), so the website links straight to the file in the latest release: `https://github.com/juanmsl/cv-manager/releases/latest/download/CV-Manager-macOS-arm64.dmg`. GitHub resolves `latest` to the newest release that is not a pre-release, so the link never needs updating. The version is in the release title and tag.
- Only the desktop app is versioned; the website has no releases.

## Consequences

- Releasing is: run *Prepare release*, review the pull request (the changelog can be edited there), merge it.
- The repository must allow GitHub Actions to create pull requests (Settings → Actions → General → Workflow permissions).
- Pull requests opened with the default `GITHUB_TOKEN` don't trigger other workflows, so CI doesn't run on the release pull request. Adding a `RELEASE_TOKEN` secret (fine-grained token with *Contents* and *Pull requests* read and write) makes the workflow use it, and CI runs.
- Only Apple Silicon builds are published; an Intel or universal build would need another target.
- macOS runners count more minutes than Linux ones on private repositories; the build runs only for release pull requests or by hand.
- When the app gets a Developer ID certificate, the signing and notarization secrets are added to the build job and ADR-0003 is superseded.
