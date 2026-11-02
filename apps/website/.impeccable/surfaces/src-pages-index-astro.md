---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Surface: website landing page

Scope: the public landing page of the CV Manager website (`src/pages/index.astro`), designed first in the Figma file "CV Manager" on its own page. Visitor mode: Persuade.

Audience and action: people who need a CV, arriving from search, a shared link or GitHub, in Spanish, English or Portuguese. They must understand what the app does and download the macOS build. Secondary action: support the project (planned). Proof: the real app and its ten real templates with the fictional Jhon Doe sample. Constraints: free and open source; Apple Silicon only; ad-hoc signed, so the first-launch step is shown openly; no invented users, counts or reviews.

Visual world: inherited from the desktop app (`apps/desktop/docs/DESIGN.md`); no new palette or type system.

## Direction contract

THESIS: The page is the app's own mechanism told as a ledger: data cards on the left become a CV sheet on the right. It refuses the category default of a headline over a product screenshot and a row of feature cards.

OWN-WORLD: Warm stone grounds (window #F6F5F2, sidebar #EFEDE8, desk #E8E5DF), white catalog cards with a light-plum top rule, one plum #5B3F73 voice for actions and the open card, Josefin Sans Light display, SF Pro body, 0.5px rules, paper shadow only on the CV sheet.

STORY: The visitor sees their messy details become a designed page, learns it's one data set for ten templates with an exact PDF, that it's private and free, then downloads with clear requirements and the first-launch step, and is invited (never required) to support it.

FIRST VIEWPORT: Left 5/12: Josefin headline, one line of subcopy, plum "Download for macOS" with "Free · Apple Silicon · ES/EN/PT" beneath; below, two stacked data cards (Photo and name, Experience open with plum rule). Right 7/12: the Jhon Doe CV sheet on the stone desk, ledger lines linking card fields to the sheet. Top bar: wordmark, section links, language selector.

FORM: Cards ⇄ page ledger, candidate 6 of 7 on the ordered list; seed:71d645aa6cae9466.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
