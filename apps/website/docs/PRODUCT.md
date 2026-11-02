# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who need to create or update a professional CV, find CV Manager (search, a shared link, GitHub) and want to know quickly what it is, whether it fits them and how to get it. They browse in Spanish, English or Portuguese. Developers who land from GitHub are a secondary audience.

## Product Purpose

The website presents CV Manager, a macOS desktop app, and gets visitors to download it. Success = a visitor understands in seconds what the app does and why it's different, downloads the right build, and can open it on their Mac the first time.

## Positioning

The product it promotes: a native, offline macOS app where you enter your data once and render it into interchangeable designed templates, exporting a single-page PDF that matches the preview exactly. Free, open source, and private by design (nothing leaves the Mac; nothing is stored unless the user saves a `.cv` file).

## Operating Context

- Download: the `.dmg` from the latest GitHub release (`https://github.com/juanmsl/cv-manager/releases/latest`).
- Requirements: macOS on Apple Silicon (arm64). There is no Intel build yet.
- The app is signed ad-hoc, not notarized by Apple: on first launch macOS asks the user to allow it in System Settings → Privacy & Security → "Open Anyway". The site states this openly with a short first-launch guide.
- App flow being promoted: 1) pick a template, 2) fill in details (with live preview, LinkedIn PDF import), 3) export a single-page PDF. Ten templates; UI in Spanish, English and Portuguese; `.cv` files to save and reopen.

## Capabilities and Constraints

- Static site built with Astro in `apps/website` (monorepo, see `docs/adr/0017`, `0018`).
- Content in Spanish, English and Portuguese, with a language selector.
- Free download; the source code is public on GitHub. Donations to support the project are planned: the site reserves a place to invite support, but the donation method is undecided (hosted option such as Stripe Payment Links, GitHub Sponsors or Ko-fi first).
- Open decisions: license, domain and hosting, donation provider.

## Brand Commitments

- Name: CV Manager.
- Must feel like the same product as the desktop app (see `apps/desktop/docs/DESIGN.md`): the app's identity carries over to the site.
- App icon and `.cv` document icon exist in `apps/desktop/build/`.

## Evidence on Hand

- The real app UI (Figma file "CV Manager" and the running app) and ten real templates (`apps/desktop/src/templates/`, mockups in `apps/desktop/cv-templates/`) can be shown.
- Sample CV content uses the fictional profile "Jhon Doe"; never show real people's data.
- No users, testimonials, download counts, press or ratings exist; do not fabricate them.

## Product Principles

1. Show the real product: real screens and real templates over abstract claims.
2. Be honest about the download: requirements and the first-launch step are part of the page, not fine print.
3. Free first; support is an invitation, never a gate.
4. Private and local is a feature worth stating plainly.
5. The site is as calm and precise as the app.
