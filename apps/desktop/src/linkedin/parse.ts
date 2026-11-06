// Convierte el texto de un PDF de perfil de LinkedIn ("Guardar en PDF") en
// datos del CV. El PDF de LinkedIn tiene una barra lateral (contacto,
// aptitudes, idiomas) y una columna principal (nombre, titular, ubicación,
// extracto, experiencia, educación). Funciona con LinkedIn en español, inglés y portugués.
import type { CvData, Education, Experience, Language, Link, Skill } from '../types';
import { uid } from '../sample';
import { makeT, type T } from '../i18n';

export interface PdfLine {
  text: string;
  x: number;
  y: number; // desde arriba de la página
  size: number; // tamaño de fuente aproximado
  page: number;
  col: 'side' | 'main';
}

export type ParsedCv = Partial<CvData>;

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const SIDE_HEADERS: Record<string, string[]> = {
  contact: ['contact', 'contactar', 'contacto', 'informacion de contacto', 'datos de contacto', 'contato', 'informacoes de contato'],
  skills: ['top skills', 'aptitudes principales', 'principales aptitudes', 'skills', 'aptitudes', 'principais competencias', 'competencias'],
  languages: ['languages', 'idiomas', 'lenguajes'],
  other: [
    'certifications', 'certificaciones', 'licenses & certifications', 'licencias y certificaciones',
    'honors-awards', 'honors & awards', 'reconocimientos y premios', 'premios', 'publications',
    'publicaciones', 'patents', 'patentes', 'certificacoes', 'licencas e certificados', 'premios e reconhecimentos',
    'publicacoes',
  ],
};
const MAIN_HEADERS: Record<string, string[]> = {
  summary: ['summary', 'extracto', 'resumen', 'acerca de', 'about', 'acerca de mi', 'resumo', 'sobre'],
  experience: ['experience', 'experiencia', 'experiencia laboral', 'experiencia profissional'],
  education: ['education', 'educacion', 'formacion', 'formacion academica', 'formacao academica', 'formacao', 'educacao'],
  other: [
    'volunteer experience', 'experiencia de voluntariado', 'voluntariado', 'projects', 'proyectos',
    'courses', 'cursos', 'recommendations', 'recomendaciones', 'publications', 'publicaciones',
    'honors-awards', 'reconocimientos y premios', 'certifications', 'certificaciones',
    'licenses & certifications', 'licencias y certificaciones', 'organizations', 'organizaciones',
    'trabalho voluntario', 'experiencia de voluntariado', 'projetos', 'recomendacoes', 'publicacoes',
    'premios e reconhecimentos', 'certificacoes', 'licencas e certificados', 'organizacoes',
  ],
};

function headerOf(text: string, table: Record<string, string[]>) {
  const t = norm(text);
  for (const [k, words] of Object.entries(table)) if (words.includes(t)) return k;
  return null;
}

const PAGE_FOOTER = /^(page|pagina)\s+\d+\s+(of|de)\s+\d+$/i;
const YEAR = /\b(19|20)\d{2}\b/;
const CURRENT = /present|presente|actualidad|actual|atual|hoy|now|o momento|momento/i;
const DURATION_ONLY = /^\(?\d+\s+(years?|yrs?|anos?|años?|ano|months?|mos?|meses?|mes|mês)\b[^a-z]*((\d+\s+(months?|mos?|meses?|mes|mês))\)?)?$/i;
const EMAIL = /[\w.+-]+@[\w-]+(\.[\w-]+)+/;
const PHONE = /^\+?[\d\s().-]{7,}/;

function isDateLine(t: string) {
  return YEAR.test(t) && (/[-–—]/.test(t) || /\(/.test(t) || CURRENT.test(t)) && t.length < 90;
}

function years(t: string) {
  return t.match(/\b(19|20)\d{2}\b/g) ?? [];
}

// Meses en español, inglés y portugués (sin tildes, completos y abreviados).
const MONTHS: Record<string, number> = {};
[
  ['enero', 'ene', 'january', 'jan', 'janeiro'],
  ['febrero', 'feb', 'february', 'fevereiro', 'fev'],
  ['marzo', 'mar', 'march', 'marco'],
  ['abril', 'abr', 'april', 'apr'],
  ['mayo', 'may', 'maio', 'mai'],
  ['junio', 'jun', 'june', 'junho'],
  ['julio', 'jul', 'july', 'julho'],
  ['agosto', 'ago', 'august', 'aug'],
  ['septiembre', 'setiembre', 'sep', 'sept', 'september', 'setembro', 'set'],
  ['octubre', 'oct', 'october', 'outubro', 'out'],
  ['noviembre', 'nov', 'november', 'novembro'],
  ['diciembre', 'dic', 'december', 'dec', 'dezembro', 'dez'],
].forEach((names, i) => names.forEach((n) => (MONTHS[n] = i + 1)));

/** Fechas de una línea de LinkedIn como ISO parcial: "marzo de 2021" → "2021-03", "2019" → "2019". */
function isoDates(t: string): string[] {
  const out: string[] = [];
  for (const m of t.matchAll(/(?:([a-zA-ZÀ-ÿ]+)\.?\s+(?:de\s+)?)?\b((?:19|20)\d{2})\b/g)) {
    const name = m[1]?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const month = name ? MONTHS[name] : undefined;
    out.push(month ? `${m[2]}-${String(month).padStart(2, '0')}` : m[2]);
  }
  return out;
}

function bodySize(lines: PdfLine[]) {
  const count = new Map<number, number>();
  for (const l of lines) {
    const k = Math.round(l.size * 2) / 2;
    count.set(k, (count.get(k) ?? 0) + l.text.length);
  }
  let best = 0;
  let max = -1;
  for (const [k, n] of count) if (n > max) [best, max] = [k, n];
  return best;
}

const bigger = (l: PdfLine, size: number) => l.size > size + 0.3;

function splitName(full: string) {
  const w = full.trim().split(/\s+/);
  if (w.length <= 1) return { firstName: full.trim(), lastName: '' };
  const cut = w.length >= 4 ? 2 : 1;
  return { firstName: w.slice(0, cut).join(' '), lastName: w.slice(cut).join(' ') };
}

function looksLikeLocation(t: string) {
  return (
    t.length < 70 &&
    !/[.:;]$/.test(t) &&
    !YEAR.test(t) &&
    (/,/.test(t) || /remot|h[ií]brid|hybrid|area|área|metropolitan|on-site|presencial|regiao|região/i.test(t))
  );
}

function languageLevel(label: string) {
  const l = norm(label);
  if (/native|bilingual|nativ|bilingu/.test(l)) return 100;
  if (/full professional|profesional completa|profissional completa/.test(l)) return 85;
  if (/limited|limitada/.test(l)) return 50;
  if (/professional working|profesional|profissional/.test(l)) return 70;
  if (/elementary|elemental|elementar|basica|basico/.test(l)) return 30;
  return 70;
}

function joinParagraph(lines: PdfLine[]) {
  let out = '';
  let prev: PdfLine | null = null;
  for (const l of lines) {
    if (!prev) out = l.text;
    else {
      const gap = l.page === prev.page ? l.y - prev.y : 0;
      const sep = gap > prev.size * 2.1 ? '\n' : out.endsWith('-') ? '' : ' ';
      out += sep + l.text;
    }
    prev = l;
  }
  return out.replace(/[ \t]+/g, ' ').trim();
}

/** Agrupa las líneas por sección según los encabezados conocidos. */
function sections(lines: PdfLine[], table: Record<string, string[]>) {
  const out: Record<string, PdfLine[]> = {};
  let current = '_intro';
  for (const l of lines) {
    const h = headerOf(l.text, table);
    if (h) {
      current = h === 'other' ? `other:${norm(l.text)}` : h;
      out[current] ??= [];
      continue;
    }
    (out[current] ??= []).push(l);
  }
  return out;
}

function parseExperience(lines: PdfLine[], body: number): Experience[] {
  const dateIdx = lines.map((l, i) => (isDateLine(l.text) ? i : -1)).filter((i) => i > 0);
  // Cabecera de cada entrada: [empresa] [duración total] cargo, seguida de la línea de fechas.
  const heads = dateIdx.map((di, k) => {
    const prevDate = k > 0 ? dateIdx[k - 1] : -1;
    const role = di - 1;
    let j = role - 1;
    while (j > prevDate && DURATION_ONLY.test(norm(lines[j].text))) j--;
    const hasCompany = j > prevDate && bigger(lines[j], body) && !isDateLine(lines[j].text);
    return { di, role, company: hasCompany ? j : -1, start: hasCompany ? j : role };
  });

  const result: Experience[] = [];
  let company = '';
  heads.forEach((h, k) => {
    if (h.company >= 0) company = lines[h.company].text;
    const dates = lines[h.di].text;
    const ys = isoDates(dates);
    const current = CURRENT.test(dates);
    const end = k + 1 < heads.length ? heads[k + 1].start : lines.length;
    let bodyLines = lines.slice(h.di + 1, end).filter((l) => !DURATION_ONLY.test(norm(l.text)));
    let city = '';
    if (bodyLines[0] && looksLikeLocation(bodyLines[0].text)) {
      city = bodyLines[0].text;
      bodyLines = bodyLines.slice(1);
    }
    const achievements: string[] = [];
    const desc: PdfLine[] = [];
    let inBullet = false;
    for (const l of bodyLines) {
      const m = l.text.match(/^\s*[•·▪◦\-–*]\s*(.+)$/);
      if (m) {
        achievements.push(m[1].trim());
        inBullet = true;
      } else if (inBullet && !/[.!?]$/.test(achievements[achievements.length - 1])) {
        achievements[achievements.length - 1] += ' ' + l.text.trim();
      } else {
        inBullet = false;
        desc.push(l);
      }
    }
    result.push({
      id: uid(),
      role: lines[h.role].text.trim(),
      company: company.trim(),
      city: city.split(',')[0].trim(),
      start: ys[0] ?? '',
      end: current ? '' : ys[1] ?? ys[0] ?? '',
      current,
      description: joinParagraph(desc),
      achievements,
    });
  });
  return result;
}

function parseEducation(lines: PdfLine[], body: number): Education[] {
  const out: Education[] = [];
  let i = 0;
  while (i < lines.length) {
    // Institución: líneas más grandes que el cuerpo (o línea sin años antes de una con años).
    const school: string[] = [];
    while (i < lines.length && (bigger(lines[i], body) || (!YEAR.test(lines[i].text) && !/·/.test(lines[i].text) && lines[i + 1] && (YEAR.test(lines[i + 1].text) || /·/.test(lines[i + 1].text)) && school.length === 0))) {
      school.push(lines[i].text);
      i++;
    }
    const detail: string[] = [];
    while (i < lines.length && !bigger(lines[i], body)) {
      detail.push(lines[i].text);
      i++;
      if (YEAR.test(detail.join(' ')) && /\)\s*$/.test(detail[detail.length - 1])) break;
    }
    if (!school.length && !detail.length) {
      i++;
      continue;
    }
    const d = detail.join(' ').replace(/\s+/g, ' ').trim();
    const ys = years(d);
    const degree = d
      .replace(/\s*·?\s*\(?[^()]*\b(19|20)\d{2}\b[^()]*\)?\s*$/, '')
      .replace(/[,·\s]+$/, '')
      .trim();
    out.push({
      id: uid(),
      institution: school.join(' ').trim(),
      degree,
      start: ys[0] ?? '',
      end: ys[ys.length - 1] ?? '',
      description: '',
    });
  }
  return out.filter((e) => e.institution || e.degree);
}

function parseContact(lines: PdfLine[], tr: T) {
  let email = '';
  let phone = '';
  const links: Link[] = [];
  let buf = '';
  const flush = () => {
    const t = buf.trim();
    buf = '';
    if (!t) return;
    const em = t.match(EMAIL);
    if (em && !email) {
      email = em[0];
      return;
    }
    const label = t.match(/\(([^()]+)\)\s*$/)?.[1] ?? '';
    const value = t.replace(/\s*\([^()]+\)\s*$/, '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\s+/g, '');
    if (/linkedin\.com/i.test(value)) {
      links.push({ id: uid(), label: 'LinkedIn', value: value.replace(/^.*?linkedin\.com/i, 'linkedin.com') });
    } else if (PHONE.test(t) && !/[a-z]{3,}\./i.test(value)) {
      phone ||= value ? t.replace(/\s*\([^()]+\)\s*$/, '').trim() : t;
    } else if (/\.[a-z]{2,}/i.test(value)) {
      const map: Record<string, string> = {
        company: tr('link.company'), empresa: tr('link.company'), personal: tr('link.website'), other: tr('link.other'),
        otro: tr('link.other'), outro: tr('link.other'), blog: tr('link.blog'), portfolio: tr('link.portfolio'),
        portafolio: tr('link.portfolio'), portfolio_pt: tr('link.portfolio'), portifolio: tr('link.portfolio'),
      };
      links.push({ id: uid(), label: map[norm(label)] ?? (label || tr('link.other')), value });
    }
  };
  for (const l of lines) {
    const t = l.text.trim();
    if (EMAIL.test(t)) {
      flush();
      buf = t;
      flush();
      continue;
    }
    const urlish = buf && !/\s/.test(buf.replace(/\s*\([^()]*$/, ''));
    buf = buf ? buf + (urlish && !/^\(/.test(t) ? '' : ' ') + t : t;
    if (/\)\s*$/.test(buf) || (PHONE.test(buf) && !/[a-z]/i.test(buf))) flush();
  }
  flush();
  return { email, phone, links };
}

function parseLanguages(lines: PdfLine[], tr: T): Language[] {
  const merged: string[] = [];
  for (const l of lines) {
    const last = merged[merged.length - 1];
    if (last && /\([^)]*$/.test(last)) merged[merged.length - 1] = last + ' ' + l.text.trim();
    else merged.push(l.text.trim());
  }
  return merged
    .filter(Boolean)
    .map((t) => {
      const name = t.replace(/\s*\(.*$/, '').trim();
      const label = t.match(/\(([^)]*)\)?/)?.[1]?.trim() ?? '';
      return { id: uid(), name, label: shortLanguageLabel(label, tr), level: languageLevel(label) };
    })
    .filter((l) => l.name);
}

function shortLanguageLabel(label: string, t: T) {
  const l = norm(label);
  if (!l) return '';
  if (/native|bilingual|nativ|bilingu/.test(l)) return t('lang.native');
  if (/full professional|profesional completa|profissional completa/.test(l)) return t('lang.advanced');
  if (/limited|limitada/.test(l)) return t('lang.intermediate');
  if (/professional working|profesional|profissional/.test(l)) return t('lang.professional');
  if (/elementary|elemental|elementar|basica|basico/.test(l)) return t('lang.basic');
  return label;
}

export function parseLinkedIn(all: PdfLine[], t: T = makeT('es')): ParsedCv | null {
  const lines = all.filter((l) => l.text.trim() && !PAGE_FOOTER.test(norm(l.text)));
  const side = lines.filter((l) => l.col === 'side');
  const main = lines.filter((l) => l.col === 'main');
  if (!main.length) return null;

  const mainSec = sections(main, MAIN_HEADERS);
  const sideSec = sections(side, SIDE_HEADERS);
  const looksLinkedIn = Boolean(mainSec.experience || mainSec.education || mainSec.summary);
  if (!looksLinkedIn) return null;

  const body = bodySize(main);
  const result: ParsedCv = {};

  // Encabezado: nombre (fuente más grande), titular y ubicación.
  const intro = (mainSec._intro ?? []).filter((l) => l.page === 1);
  if (intro.length) {
    const maxSize = Math.max(...intro.map((l) => l.size));
    const nameLines = intro.filter((l) => l.size >= maxSize - 0.3);
    const rest = intro.filter((l) => l.size < maxSize - 0.3);
    Object.assign(result, splitName(nameLines.map((l) => l.text).join(' ')));
    if (rest.length) {
      const last = rest[rest.length - 1];
      const hasLocation = rest.length > 1 && (last.size < rest[0].size - 0.3 || looksLikeLocation(last.text));
      const headline = hasLocation ? rest.slice(0, -1) : rest;
      result.title = headline.map((l) => l.text).join(' ').trim();
      if (hasLocation) result.city = last.text.trim();
    }
  }

  if (mainSec.summary?.length) result.profile = joinParagraph(mainSec.summary);
  if (mainSec.experience?.length) result.experience = parseExperience(mainSec.experience, body);
  if (mainSec.education?.length) result.education = parseEducation(mainSec.education, body);

  if (sideSec.contact?.length) Object.assign(result, parseContact(sideSec.contact, t));
  if (sideSec.skills?.length) {
    result.skills = sideSec.skills.map((l): Skill => ({ id: uid(), name: l.text.trim(), level: 80 })).filter((s) => s.name);
  }
  if (sideSec.languages?.length) result.languages = parseLanguages(sideSec.languages, t);

  return result;
}
