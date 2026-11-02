# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Desktop app for macOS built with web technologies. It must feel native to macOS: window with traffic lights, sidebar, ⌘ shortcuts, familiar Apple controls and conventions.

## Stack

Electron + React. PDF export via Electron `printToPDF` from the same HTML preview.

## Users

People who need to create or update a professional CV and want a polished, designed result without using a layout tool. The app is a product for distribution: other people will download and install it on their Macs.

## Product Purpose

Generate a designed CV as a PDF in minutes: pick a template, enter the data once, adjust colors, export. Success = a person goes from opening the app to a ready-to-send PDF without fighting the layout, and can come back later to update it.

## Positioning

Data entered once, rendered into interchangeable designed templates; the template is a view of the data, so switching designs never loses content. Offline, local, native macOS app.

## Operating Context

Three-step flow: 1) template selector (gallery), 2) data configuration (form by sections, ideally with live preview), 3) preview + PDF export (always a single page: Letter width, at least Letter height, growing vertically to fit the content), with the ability to go back and edit or switch template at any step.

## Capabilities and Constraints

- Data model: photo (crop, B/W option), name, job title, profile summary, contact (email, phone, city), social links[], experience[] (role, company, dates or "current", description, bullet achievements; reorderable), education[] (institution, degree, dates), skills[] (name, category, optional level 0–100), languages[] (language, level), free note, template colors (primary, text, accent).
- Works offline; nothing is stored automatically. Every launch starts clean with fictional sample data; CVs are kept only as `.cv` files the user saves (see `docs/adr/0008`, `0009`).
- The PDF is always a single page: Letter width, at least Letter height, growing downward to fit long content (see `docs/adr/0007`).
- PDF must match the preview exactly (fonts, colors, sharp images).
- UI in Spanish, English and Portuguese, always starting in the system language; the CV's section titles can use a different language (see `docs/adr/0010`). Multiple CVs are handled as separate `.cv` files.

## Brand Commitments

Name: CV Manager (working name).

## Evidence on Hand

Ten CV template mockups in `cv-templates/` (Template 1–10.jpg), implemented in `src/templates/` as: 1 Columna (dark sidebar), 2 Retrato (portrait + timeline), 3 Editorial (lime accent), 4 Lineal (fine vertical rule), 5 Marco (framed page), 6 Ejecutivo (dark contact tab), 7 Tarjetas (soft cards), 8 Boutique (round photo, two-tone background), 9 Panel (gray side panel, vertical year pills), 10 Sereno (light-blue column, script name). An app icon and a `.cv` document icon exist in `build/`. No logo or real user testimonials exist; do not fabricate them.

## Product Principles

1. The CV is the hero; the app chrome stays out of its way.
2. Enter once, reuse everywhere: no data loss when switching templates.
3. What you see is exactly what exports.
4. Behave like a good Mac app: native conventions over invented ones.
