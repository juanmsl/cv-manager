// Fechas del CV. Se guardan como texto ISO parcial, con la precisión que la
// persona eligió: "2021" (año), "2021-03" (año y mes) o "2021-03-15" (día).
// Cada plantilla decide cómo mostrarlas con formatDate/period (ADR-0024).
// Un texto que no sea ISO (archivos .cv antiguos) se muestra tal cual.
import type { Lang } from './i18n';

export type DatePrecision = 'year' | 'month' | 'day';
export interface PartialDate {
  y: number;
  m?: number; // 1–12
  d?: number; // 1–31
}

const ISO = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/;

export function parseDate(value: string | undefined | null): PartialDate | null {
  const match = ISO.exec((value ?? '').trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = match[2] ? Number(match[2]) : undefined;
  const d = match[3] ? Number(match[3]) : undefined;
  if (m !== undefined && (m < 1 || m > 12)) return null;
  if (d !== undefined && (d < 1 || d > daysInMonth(y, m ?? 1))) return null;
  return { y, m, d };
}

export function toISO(p: PartialDate, precision: DatePrecision = precisionOf(p)): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  if (precision === 'year' || p.m === undefined) return String(p.y);
  if (precision === 'month' || p.d === undefined) return `${p.y}-${pad(p.m)}`;
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

export const precisionOf = (p: PartialDate): DatePrecision => (p.d !== undefined ? 'day' : p.m !== undefined ? 'month' : 'year');

export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/**
 * Estilos de fecha que usan las plantillas. Con menos precisión guardada se
 * muestra lo que haya (un año siempre se ve como "2021").
 * - year:    2021
 * - short:   mar 2021 · 15 mar 2021
 * - long:    marzo de 2021 · 15 de marzo de 2021
 * - numeric: 03/2021 · 15/03/2021
 */
export type DateStyle = 'year' | 'short' | 'long' | 'numeric';

export interface DateFormat {
  lang: Lang;
  style: DateStyle;
}

const cache = new Map<string, Intl.DateTimeFormat>();
function fmt(lang: Lang, opts: Intl.DateTimeFormatOptions) {
  const key = lang + JSON.stringify(opts);
  let f = cache.get(key);
  if (!f) cache.set(key, (f = new Intl.DateTimeFormat(lang, { timeZone: 'UTC', ...opts })));
  return f;
}

export function formatDate(value: string, lang: Lang, style: DateStyle = 'short'): string {
  const p = parseDate(value);
  if (!p) return value.trim();
  if (style === 'year' || p.m === undefined) return String(p.y);
  const date = new Date(Date.UTC(p.y, p.m - 1, p.d ?? 1));
  const day = p.d !== undefined ? { day: style === 'numeric' ? ('2-digit' as const) : ('numeric' as const) } : {};
  const month = style === 'numeric' ? ('2-digit' as const) : style === 'long' ? ('long' as const) : ('short' as const);
  return fmt(lang, { year: 'numeric', month, ...day }).format(date);
}

/** Nombres de los meses para el selector (enero… o Jan…). */
export function monthNames(lang: Lang, width: 'long' | 'short' = 'short') {
  const f = fmt(lang, { month: width });
  return Array.from({ length: 12 }, (_, i) => f.format(new Date(Date.UTC(2021, i, 1))));
}

/** Iniciales de los días de la semana, empezando en `firstDay` (0 = domingo). */
export function weekdayNames(lang: Lang, firstDay: number) {
  const f = fmt(lang, { weekday: 'narrow' });
  // 2021-08-01 fue domingo
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(Date.UTC(2021, 7, 1 + ((firstDay + i) % 7)))));
}

export const firstDayOfWeek = (lang: Lang) => (lang === 'en' ? 0 : 1);
