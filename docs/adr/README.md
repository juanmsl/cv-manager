# Architecture Decision Records

This folder documents the rules, decisions and definitions behind CV Manager, so development stays iterative and traceable.

## How to use them

1. Before changing something covered by a rule in this list, read the related ADR.
2. For a new decision, copy `template.md` to `NNNN-short-title.md` using the next free number.
3. If a decision changes, **don't edit** the accepted ADR: write a new one and mark the old one as “Superseded by ADR-NNNN”.
4. Add the row to the index and commit the ADR together with the code change.

Statuses: **Proposed**, **Accepted**, **Superseded**, **Deprecated**.

## Index

| ADR | Decision | Status | Date |
|---|---|---|---|
| [0000](0000-use-adrs.md) | Record decisions as ADRs | Accepted | 2026-11-02 |
| [0001](0001-electron-react-vite-stack.md) | Desktop app built with Electron, React, Vite and TypeScript | Accepted | 2026-10-31 |
| [0002](0002-pnpm-and-electron-install.md) | pnpm and a controlled Electron install | Accepted | 2026-10-31 |
| [0003](0003-unsigned-local-distribution.md) | Local distribution with ad-hoc signing | Accepted | 2026-10-31 |
| [0004](0004-design-system.md) | Figma-first design in a Boutique Minimalist style | Accepted | 2026-10-31 |
| [0005](0005-three-step-flow.md) | Three-step flow with live preview | Accepted | 2026-10-31 |
| [0006](0006-single-data-model.md) | One data model for every template | Accepted | 2026-10-31 |
| [0007](0007-single-page-pdf.md) | The PDF is always a single Letter-width page | Accepted | 2026-11-02 |
| [0008](0008-clean-start-no-autosave.md) | Clean start: nothing is saved automatically | Accepted | 2026-11-02 |
| [0009](0009-cv-files.md) | `.cv` files associated with the app | Accepted | 2026-11-02 |
| [0010](0010-internationalization.md) | UI in Spanish, English and Portuguese | Accepted | 2026-11-02 |
| [0011](0011-linkedin-import.md) | Local import from the LinkedIn PDF | Accepted | 2026-11-01 |
| [0012](0012-single-window-close-quits.md) | Single window: closing it quits the app | Accepted | 2026-11-02 |
| [0013](0013-fictional-sample-data.md) | Fictional sample data and placeholders | Accepted | 2026-11-02 |
| [0014](0014-cv-templates.md) | How CV templates are built and added | Accepted | 2026-11-02 |
| [0015](0015-repository-layout.md) | Repository layout and conventions | Superseded by 0017 | 2026-11-02 |
| [0016](0016-lint-and-typecheck-ci.md) | Lint and type checks in CI | Accepted | 2026-11-02 |
| [0017](0017-turborepo-monorepo.md) | Turborepo monorepo with desktop and website apps | Accepted | 2026-11-02 |
| [0018](0018-astro-website.md) | Promotional website built with Astro | Accepted | 2026-11-02 |
| [0019](0019-pnpm-10-workspace-settings.md) | pnpm 10 with settings in pnpm-workspace.yaml | Superseded by 0023 | 2026-11-02 |
| [0020](0020-website-language-without-url-paths.md) | Website language chosen in the browser, not in the URL | Accepted | 2026-11-02 |
| [0021](0021-release-workflow.md) | Releases prepared and published by GitHub Actions | Accepted | 2026-11-02 |
| [0022](0022-website-on-github-pages.md) | Website hosted on GitHub Pages with a custom domain | Accepted | 2026-11-02 |
| [0023](0023-node-24-and-pnpm-11.md) | Node.js 24 and pnpm 11, enforced with engines | Accepted | 2026-11-02 |
