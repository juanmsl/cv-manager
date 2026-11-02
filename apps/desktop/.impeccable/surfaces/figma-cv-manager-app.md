---
version: 1
slug: "figma-cv-manager-app"
primary_target: "figma/cv-manager-app"
related_targets: []
---

Scope: CV Manager macOS app shell, three views (template selector, data configuration, preview + PDF export), designed in Figma first. Mode: Operate.
Audience/job: people building or updating their CV; pick template, enter data once, tune colors, export PDF. Constraints: native macOS controls and conventions (traffic lights, sidebar, toolbar, ⌘ shortcuts). Light appearance shipped in v0.1; dark appearance pending its own design pass (not designed in Figma yet).
Unresolved: multiple saved CVs; UI languages (designs in Spanish).

## Direction contract
THESIS: The CV's data is a card file; templates are just ways of printing the cards. Refuses the generic "wizard with a long form" and the Pages-style inspector clone.
OWN-WORLD: Boutique Minimalist on native macOS: stone neutrals (#F6F5F2 window, #EFEDE8 sidebar), hairline borders, soft diffuse shadows, 12px card radii. Catalog-card grammar kept quiet: plum (#5B3F73) 2px top rule on the active card, light-plum rule on the rest, muted divider tabs (ochre, sage, sky, rose). Josefin Sans Light for screen titles and app name; SF Pro for all UI. Accent = plum for primary actions and selection.
STORY: The visitor sees their CV as a set of cards, fills each card, watches the live page update, exports with confidence.
FIRST VIEWPORT: Editor view: left sidebar of section dividers (colored tab + count), center column of entry cards for the selected section, right live A4 preview with template switcher and Export PDF in the toolbar.
FORM: Index card catalog, position 6 of 7 grounded list. seed:6bc00b84470e4685 (roll degraded: no challengers).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
