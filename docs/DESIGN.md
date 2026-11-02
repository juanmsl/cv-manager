---
name: CV Manager
description: Native macOS app that builds a PDF CV from data cards and interchangeable templates.
colors:
  window-stone: "#f6f5f2"
  sidebar-stone: "#efede8"
  desk-stone: "#e8e5df"
  surface: "#ffffff"
  ink: "#1f1f1c"
  ink-secondary: "#5c5852"
  ink-tertiary: "#67635c"
  line-separator: "#e4e1da"
  line-field: "#d8d4cc"
  ruled-plum: "#d9cfe3"
  plum: "#5b3f73"
  plum-hover: "#4d3463"
  plum-tint: "#ece6f1"
  tab-ochre: "#c8ae7a"
  tab-sage: "#9fb29b"
  tab-sky: "#a3b4c6"
  tab-rose: "#c6a4a6"
  danger: "#a33a32"
typography:
  display:
    fontFamily: "Josefin Sans, -apple-system, sans-serif"
    fontSize: "34px"
    fontWeight: 300
    lineHeight: 1.1
  app-title:
    fontFamily: "Josefin Sans, -apple-system, sans-serif"
    fontSize: "18px"
    fontWeight: 300
    letterSpacing: "0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.35
    fontFeature: "tnum"
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "11px"
    fontWeight: 500
  sidebar-header:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Text, Helvetica Neue, sans-serif"
    fontSize: "10.5px"
    fontWeight: 600
    letterSpacing: "0.1em"
rounded:
  tab: "3px"
  control: "7px"
  row: "10px"
  card: "12px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "20px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.plum}"
    textColor: "{colors.surface}"
    rounded: "8px"
    padding: "0 14px"
    height: "28px"
  button-primary-hover:
    backgroundColor: "{colors.plum-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "8px"
    padding: "0 14px"
    height: "28px"
  button-link:
    textColor: "{colors.plum}"
    padding: "0 4px"
    height: "24px"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "6px 10px"
  sidebar-divider-item:
    textColor: "{colors.ink}"
    rounded: "8px"
    padding: "0 10px 0 8px"
    height: "30px"
  sidebar-divider-item-active:
    backgroundColor: "{colors.surface}"
  entry-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
  banner:
    backgroundColor: "{colors.plum-tint}"
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "10px 12px 10px 14px"
---

# Design System: CV Manager

## Overview

**Creative North Star: "The card catalog"**

The CV data is a drawer of index cards; templates are just ways to print them. The app is Boutique Minimalist on native macOS: warm stone neutrals, hairline rules (0.5px), soft diffuse shadows, and a single color voice, plum, for primary actions and selection. The catalog grammar (a top rule on every card, one icon per section divider) stays quiet: structure, never decoration.

Density is that of a Mac app (13px body, 28px controls), with the CV as the hero on a darker stone desk on the right. The app chrome never competes with the page.

**Key Characteristics:**
- Stone neutrals in tonal layers: window, sidebar, desk.
- Plum as the only accent; section dividers use line icons in secondary ink.
- Cards with a top rule: 2px plum when open, 1.5px light plum at rest.
- Josefin Sans Light only for screen titles and the app name; SF Pro for all UI.
- Native macOS controls and conventions (traffic lights, sidebar, ⌘).

## Colors

Warm stone and near-black ink, with a deep plum as the only voice and four desaturated catalog tab tones.

### Primary
- **Catalog plum** (plum): primary button, selection (radio, checkbox via `accent-color`), focus ring, open-card rule, open-card dates, links.
- **Sunken plum** (plum-hover): primary hover.
- **Plum veil** (plum-tint): info banners, text selection, photo drop zone while dragging.
- **Light plum rule** (ruled-plum): top rule of cards and template cards at rest; header/body divider inside a card.

### Secondary
- **Catalog tones** (tab-ochre, tab-sage, tab-sky, tab-rose): reserved; since v0.1.1 section dividers use icons instead of color tabs. Sage only marks the saved-state icon.

### Neutral
- **Window stone** (window-stone): window and toolbar background; background of editable bullet rows.
- **Sidebar stone** (sidebar-stone): sidebar and template-thumbnail background.
- **Desk stone** (desk-stone): surface the CV page rests on (preview and export).
- **Surface** (surface): cards, panels, fields, secondary buttons, active sidebar item.
- **Ink** (ink), **secondary ink** (ink-secondary), **tertiary ink** (ink-tertiary): main text, subtitles/metadata, and placeholders/counters/resting icons. Both secondary inks meet AA on every stone background.
- **Separator rule** (line-separator) and **field rule** (line-field): structural dividers and control borders.
- **Danger** (danger): delete card and error toasts. Never as an accent.

### Named Rules
**The One Voice Rule.** Plum is the only action and selection color. If something is interactive and primary, it is plum; if not, it isn't.
**The Section Icon Rule.** Each sidebar section is identified by a Phosphor icon (react-icons/pi, regular weight, 17px) in secondary ink; the active section's icon turns plum. Icons: Photo and name PiUserCircle, Profile PiQuotes, Contact and links PiAddressBook, Experience PiBriefcase, Education PiGraduationCap, Skills PiWrench, Languages PiTranslate, Colors PiPalette.

## Typography

**Display Font:** Josefin Sans 300 (with -apple-system)
**Body Font:** SF Pro via -apple-system

**Character:** A light geometric display, like catalog lettering, over the native macOS voice. Contrast comes from weight and size, not color.

### Hierarchy
- **Display** (300, 34px, 1.1): each screen's title ("Choose a template", the section name in the editor). Carries 4px of optical offset on top.
- **App title** (300, 18px, 0.02em): "CV Manager" in the toolbar.
- **Title** (600, 14px): template name, empty-state title; 600/13px for panel and inspector titles.
- **Body** (400, 13px, 1.35, tabular figures): all UI and fields.
- **Caption** (12px): subtitles, descriptions, segmented control, banners, preview footer.
- **Label** (500, 11px): field labels; 400/11px for counters, hints and dates (0.02em).
- **Sidebar header** (600, 10.5px, 0.1em, uppercase): only the sidebar group header ("Sections"), a native macOS convention.

### Named Rules
**The Light Display Rule.** Josefin Sans appears only at 300 and only in the screen title and the app name. Never in buttons, labels or body text.

## Layout

The window is a column: a 52px toolbar (1fr/auto/1fr grid, 84px on the left for the traffic lights; title, centered Template/Details/Export segmented control, actions on the right), then the view.

- **Selector:** 3-column grid with 32px gaps, 48/64px padding; each card spans two subgrid rows (thumbnail and text) so cards in a row stay aligned; 60px bottom bar.
- **Editor:** 220px sidebar / fluid center / 404px preview. Below 1240px: 200 / fluid / 336px and 28px center padding.
- **Export:** fluid desk / 320px inspector in rule-separated groups, actions pinned to the bottom.

Rhythm: 14px between cards and fields, 20px between blocks, 10–12px gaps in control rows, 32px screen padding. The view transition is a 260ms fade with a 4px rise; it disappears with `prefers-reduced-motion`.

## Elevation & Depth

Flat by default, with depth from tonal stone layers and 0.5px rules. Shadows appear only in response to state (open card, selected template) or for floating objects (the CV page, toasts, the hint over an empty page).

### Shadow Vocabulary
- **Soft** (`0 12px 32px rgb(61 41 77 / 0.1)`): open card, selected template, empty-preview hint.
- **Control** (`0 1px 1px rgb(0 0 0 / 0.04)`): secondary buttons and pop-up menus.
- **Paper** (`0 3px 12px rgb(0 0 0 / 0.16)`): the CV page on the desk (0 3px 10px / 0.14 on thumbnails).

### Named Rules
**The Flat-At-Rest Rule.** Cards and template cards have no shadow at rest; they gain it when opened or selected, along with a 35% plum border.

## Shapes

Soft corners stepped by size: 3px on tabs (3 3 1 1, tab shape), 5–8px on controls (7px is the token), 10px on rows, banners and toasts, 12px on cards. 0.5px borders. Circles only for radios, color swatches and bullet dots (4px, plum). Empty states and the photo zone use a 1px dashed border.

## Components

### Buttons
Quiet and native.
- **Shape:** 28px tall, soft corners (8px in the build), 0 14px padding.
- **Primary:** plum background, white 600 text, no shadow. One per view ("Review and export", "Export PDF").
- **Hover / Focus:** hover is sunken plum; active drops 0.5px; focus is a 2px plum ring with 2px offset.
- **Secondary:** white surface, field rule, control shadow, 500.
- **Link:** plum text without a box, underline on hover. **Danger:** red text; solid red only in confirmations.
- **Icon button:** 24×24, transparent, tertiary icon; hover with a 5% black veil.

### Cards / Containers
The system's signature.
- **Corner Style:** 12px.
- **Background:** surface with a 0.5px separator rule.
- **Top rule:** 1.5px light plum at rest; 2px plum when open. The same rule marks template cards (thumbnail on sidebar stone).
- **Header:** drag handle, 600 title with a 12px subtitle, dates on the right, chevron that rotates 90° (200ms).
- **Body:** separated by a 1px light plum rule, 16/20/18/38px padding, 14px gap; footer with reorder arrows and "Delete card".
- **Drag:** source at 45% opacity; target marked with a 3px plum line on top.

### Inputs / Fields
- **Style:** white background, 0.5px field rule, 7px radius, 6/10px padding, 11px/500 label on top.
- **Focus:** plum border and `0 0 0 3px rgb(91 63 115 / 0.16)` halo; plum caret.
- **Bullets:** rows on window stone with a plum dot; focus with a 2px halo.
- **Segmented control:** 6% black track, active option white 600 with a minimal shadow.

### Navigation
- **Sidebar:** sidebar stone, small uppercase group header, 30px items with icon (17px) + name + tertiary counter. Hover: 50% white and primary-ink icon; active: white, 600, minimal shadow, plum icon. When the Details view opens, "Photo and name" is selected. Document status pinned at the bottom (saved in a file, unsaved changes, or cleared on close).
- **Steps:** segmented control centered in the toolbar.

### Live preview
The CV page scaled on the desk, with a header (preview title and page size) and a footer that says whether the page is Letter size or taller to fit everything. The page grows downward instead of breaking; there are no page breaks. The card being edited is highlighted on the page with a dashed plum outline that never prints.

## CV templates

Templates are print layouts of the user's content, not part of the app's system; the tokens above do not apply inside the page.

- **Measured in pt:** a single page, Letter width (612pt) and at least Letter height (792pt), growing downward with the content; 9pt/1.4 body, SF Pro / Helvetica Neue / Arial stack.
- **Configurable color:** three variables per template (`--cv-primary`, `--cv-text`, `--cv-accent`), with defaults:
  - **Dark column:** primary #2D3039, text #4A4B50, accent #FFFFFF. 214pt dark side column.
  - **Portrait with timeline:** primary #141414, text #333333, accent #B5B5B5. 250pt side over #EDEDED gray, photo with a diagonal, level rings.
  - **Editorial accent:** primary #161616, text #333333, accent #C8DD00. Lime accent band and vertical text.
  - **Fine line:** primary #1A1A1A, text #454545, accent #1A1A1A. Letter-spaced name, vertical rule, boxed title. No photo.
  - **Classic frame:** primary #111111, text #3A3A3A, accent #111111. Framed page, name over the frame line, three-column rows.
  - **Executive:** primary #1E1E1E, text #6B6B6B, accent #1E1E1E. Large name, dark contact tab, vertical rule, links footer.
  - **Soft cards:** primary #141A2E, text #3B4256, accent #5B3FE0. Tinted gradient background, white cards, skill chips.
  - **Boutique:** primary #2B2B2B, text #4A4A4A, accent #E39B7B. Two-tone background, round photo, year timelines, serif italic details.
  - **Gray panel:** primary #2E2E2E, text #555555, accent #E4E4E4 (side panel). Profile band, vertical year pills, level bars.
  - **Serene:** primary #1F3A68, text #36425A, accent #DCE7F5 (side column). Round photo, script name, round section badges.
- **Print:** `print-color-adjust: exact`; the editing highlight is removed when printing. The page is identical in preview and PDF.

## Do's and Don'ts

### Do:
- **Do** use plum only for the primary action, selection and focus.
- **Do** mark every catalog card with its top rule: 1.5px light plum at rest, 2px plum when active.
- **Do** express depth with the three stones (window, sidebar, desk) and 0.5px rules before shadows.
- **Do** use single-stroke 1.5px SVG icons, `currentColor`.
- **Do** respect native macOS controls: 28px tall, 13px body, ⌘ in keyboard hints.

### Don't:
- **Don't** mix icon families: only Phosphor regular weight in the sidebar.
- **Don't** use Josefin Sans outside the screen title and the app name, or at weights other than 300.
- **Don't** put small uppercase labels above content titles; the uppercase style exists only as the sidebar group header.
- **Don't** give cards a shadow at rest.
- **Don't** apply app tokens inside CV templates.

## Open items

- **Dark appearance:** pending. Not designed (neither in Figma nor in the build); the app forces `color-scheme: light`. There are no dark tokens; don't invent them before their own design pass.
