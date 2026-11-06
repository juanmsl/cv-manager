# ADR-0024: Date pickers and formatted text in the CV data

- **Status:** Accepted
- **Date:** 2026-11-06

## Context

Start and end dates were free text ("2021"), so every template printed whatever was typed and none could choose its own format. Descriptions (profile, experience, education, note) were plain textareas: no bold, no lists.

## Decision

### Dates

- Dates are stored as **partial ISO 8601 text** with the precision the person chose: `"2021"` (year), `"2021-03"` (year and month) or `"2021-03-15"` (full date). Existing `.cv` files keep working: a year is already valid, and any other text is shown as it was typed.
- The editor uses a custom picker (`components/DateField.tsx`): a Year / Month / Day switch, then a grid of years, months or days. It follows the app's language (month names, first day of the week) and can clear the date. "I currently work here" still replaces the end date.
- **Each template decides how to show dates** with `period(start, end, current, present, dateFormat(t, style))` and `formatDate` (`src/dates.ts`), in the CV language. Styles: `year` (2021), `short` (mar 2021 · 15 mar 2021), `long` (marzo de 2021) and `numeric` (03/2021). A date with less precision than the style shows what it has. Current choices: Columna, Marco, Tarjetas, Sereno → short; Lineal, Panel → long; Editorial, Ejecutivo → numeric; Retrato, Boutique → year.
- The LinkedIn import keeps the month when the PDF has it ("marzo de 2021" → `2021-03`).

### Formatted text

- Profile, note and the experience and education descriptions use a Notion-style editor (`components/RichField.tsx`, Tiptap with the Markdown extension): Markdown shortcuts are formatted as you type (`**bold**`, `*italic*`, `- ` and `1. ` lists), and selecting text shows a small toolbar. Headings, quotes, code and rules are turned off; links are kept.
- The value is stored as **Markdown text**, so the data model and `.cv` files don't change shape, and old plain text is still valid.
- Templates render it with `<Rich>` (`templates/shared.tsx`): `marked` (with line breaks kept) and `DOMPurify` limited to paragraphs, emphasis, lists and links. List styles come from `.cv-rich` in `templates.css`, not from each template's own bullet styles.
- The "Achievements" list of each experience stays as it is.

## Consequences

- Templates can format dates per design without changing the data, and a new template only picks a style.
- New dependencies in the desktop app: `@tiptap/*` (editor), `marked` and `dompurify` (rendering).
- Text typed with Markdown characters (for example `*`) in old files can now render as formatting.
