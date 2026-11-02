# ADR-0014: How CV templates are built and added

- **Status:** Accepted
- **Date:** 2026-11-02

## Context

Templates are based on mockups (`cv-templates/Template N.jpg`) and must look the same in the preview and in the PDF. There are ten so far.

## Decision

- Each template is its own React component in `src/templates/<Name>.tsx` with its CSS in `<Name>.css`, its own class prefix (`lin-`, `mar-`…), measurements in **pt**, and colors only through `--cv-primary`, `--cv-text` and `--cv-accent`.
- Page backgrounds use `.cv-page.cv-<id>` (the base `.cv-page` sets a white background).
- Shared pieces live in `shared.tsx` (photo, highlight) and `parts.tsx` (contact items with icons, achievements).
- Adding a template means:
  1. Save the mockup in `cv-templates/`.
  2. Add the id to `TemplateId` (`src/types.ts`), to `TEMPLATES` and `DEFAULT_COLORS` (`src/sample.ts`) and to `COMPONENTS` (`src/templates/CvPage.tsx`).
  3. Add `tpl.<id>.name/desc` in all three languages.
  4. Check with the sample data, with and without a photo, that the PDF is a single page.
- The mockup's **style** is reproduced, not its content; sections the model lacks are omitted or covered by Note (ADR-0006).
- Fonts: system fonts and Josefin Sans; script styles use macOS fonts with fallbacks (`Snell Roundhand`, `Apple Chancery`, `cursive`).

## Consequences

- Templates are independent; changing one doesn't break another.
- Current templates: 1 Dark column, 2 Portrait with timeline, 3 Editorial accent, 4 Fine line, 5 Classic frame, 6 Executive, 7 Soft cards, 8 Boutique, 9 Gray panel, 10 Serene.
