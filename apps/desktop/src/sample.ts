import type { AppState, CvColors, CvData, TemplateId } from './types';
import type { Lang } from './i18n';
import { formatDate, type DateFormat } from './dates';

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Plantillas disponibles (nombre y descripción vienen de i18n: tpl.<id>.name/desc). */
export const TEMPLATES: { id: TemplateId }[] = [
  { id: 'columna' },
  { id: 'retrato' },
  { id: 'editorial' },
  { id: 'lineal' },
  { id: 'marco' },
  { id: 'ejecutivo' },
  { id: 'tarjetas' },
  { id: 'boutique' },
  { id: 'panel' },
  { id: 'sereno' },
];

export const DEFAULT_COLORS: Record<TemplateId, CvColors> = {
  columna: { primary: '#2D3039', text: '#4A4B50', accent: '#FFFFFF' },
  retrato: { primary: '#141414', text: '#333333', accent: '#B5B5B5' },
  editorial: { primary: '#161616', text: '#333333', accent: '#C8DD00' },
  lineal: { primary: '#1A1A1A', text: '#454545', accent: '#1A1A1A' },
  marco: { primary: '#111111', text: '#3A3A3A', accent: '#111111' },
  ejecutivo: { primary: '#1E1E1E', text: '#6B6B6B', accent: '#1E1E1E' },
  tarjetas: { primary: '#141A2E', text: '#3B4256', accent: '#5B3FE0' },
  boutique: { primary: '#2B2B2B', text: '#4A4A4A', accent: '#E39B7B' },
  panel: { primary: '#2E2E2E', text: '#555555', accent: '#E4E4E4' },
  sereno: { primary: '#1F3A68', text: '#36425A', accent: '#DCE7F5' },
};

export const COLOR_PRESETS = ['#2D3039', '#1F3A5F', '#2F5D50', '#7A2E2A', '#5B3F73', '#3A3A3A'];

// Datos de ejemplo (persona ficticia, ADR-0013) para que la primera vista no
// esté vacía. Hay una versión por idioma; la app usa la del idioma activo.
const ES: CvData = {
  photo: null,
  hidePhoto: false,
  firstName: 'Jhon',
  lastName: 'Doe',
  title: 'Diseñador de producto',
  profile:
    'Diseñador de producto con 8 años creando experiencias digitales para fintech y comercio. Me enfoco en investigación con usuarios, sistemas de diseño y prototipos que llegan a producción.',
  email: 'jhon.doe@example.com',
  phone: '+57 300 123 4567',
  city: 'Bogotá, Colombia',
  links: [
    { id: uid(), label: 'LinkedIn', value: 'linkedin.com/in/jhondoe' },
    { id: uid(), label: 'Portafolio', value: 'jhondoe.example.com' },
  ],
  experience: [
    {
      id: uid(),
      role: 'Diseñador de producto senior',
      company: 'Pagos Andinos',
      city: 'Bogotá',
      start: '2021',
      end: '',
      current: true,
      description: 'Lideré el rediseño del flujo de pagos y el sistema de diseño de la app móvil.',
      achievements: ['Reduje en 30 % los pagos abandonados.', 'Creé la librería de componentes usada por 40 diseñadores.'],
    },
    {
      id: uid(),
      role: 'Diseñador de producto',
      company: 'Mercado Ágil',
      city: 'Bogotá',
      start: '2019',
      end: '2021',
      current: false,
      description: 'Diseñé el checkout y coordiné pruebas A/B en seis países.',
      achievements: [],
    },
    {
      id: uid(),
      role: 'Diseñador UI',
      company: 'Estudio Norte',
      city: 'Medellín',
      start: '2017',
      end: '2019',
      current: false,
      description: 'Interfaces para clientes de banca y retail en Latinoamérica.',
      achievements: [],
    },
  ],
  education: [
    {
      id: uid(),
      institution: 'Universidad del Valle Central',
      degree: 'Diseño Industrial',
      start: '2012',
      end: '2017',
      description: 'Énfasis en interacción y ergonomía cognitiva.',
    },
    {
      id: uid(),
      institution: 'Academia Digital',
      degree: 'Diseño de interacción',
      start: '2018',
      end: '2018',
      description: 'Curso profesional de prototipado y pruebas con usuarios.',
    },
  ],
  skills: [
    { id: uid(), name: 'Figma', level: 95 },
    { id: uid(), name: 'Prototipado', level: 85 },
    { id: uid(), name: 'Investigación', level: 80 },
    { id: uid(), name: 'HTML y CSS', level: 70 },
  ],
  languages: [
    { id: uid(), name: 'Español', level: 100, label: 'Nativo' },
    { id: uid(), name: 'Inglés', level: 85, label: 'Avanzado' },
    { id: uid(), name: 'Portugués', level: 50, label: 'Intermedio' },
  ],
  note: 'Disponible para trabajo remoto o híbrido en Bogotá.',
};

/** Misma persona, otros textos: conserva nombres propios, fechas y niveles. */
function translated(
  base: CvData,
  tr: {
    title: string;
    profile: string;
    portfolio: string;
    experience: { role: string; description: string; achievements: string[] }[];
    education: { degree: string; description: string }[];
    skills: string[];
    languages: { name: string; label: string }[];
    note: string;
  },
): CvData {
  return {
    ...base,
    title: tr.title,
    profile: tr.profile,
    links: base.links.map((l, i) => ({ ...l, id: uid(), label: i === 1 ? tr.portfolio : l.label })),
    experience: base.experience.map((e, i) => ({ ...e, id: uid(), ...tr.experience[i] })),
    education: base.education.map((e, i) => ({ ...e, id: uid(), ...tr.education[i] })),
    skills: base.skills.map((s, i) => ({ ...s, id: uid(), name: tr.skills[i] })),
    languages: base.languages.map((l, i) => ({ ...l, id: uid(), ...tr.languages[i] })),
    note: tr.note,
  };
}

const EN = translated(ES, {
  title: 'Product Designer',
  profile:
    'Product designer with 8 years of experience creating digital products for fintech and commerce. I focus on user research, design systems and prototypes that make it to production.',
  portfolio: 'Portfolio',
  experience: [
    {
      role: 'Senior Product Designer',
      description: 'Led the redesign of the payment flow and the design system of the mobile app.',
      achievements: ['Cut abandoned payments by 30%.', 'Built the component library used by 40 designers.'],
    },
    { role: 'Product Designer', description: 'Designed the checkout and ran A/B tests in six countries.', achievements: [] },
    { role: 'UI Designer', description: 'Interfaces for banking and retail clients across Latin America.', achievements: [] },
  ],
  education: [
    { degree: 'Industrial Design', description: 'Focus on interaction and cognitive ergonomics.' },
    { degree: 'Interaction Design', description: 'Professional course in prototyping and user testing.' },
  ],
  skills: ['Figma', 'Prototyping', 'User research', 'HTML & CSS'],
  languages: [
    { name: 'Spanish', label: 'Native' },
    { name: 'English', label: 'Advanced' },
    { name: 'Portuguese', label: 'Intermediate' },
  ],
  note: 'Open to remote or hybrid work in Bogotá.',
});

const PT = translated(ES, {
  title: 'Designer de produto',
  profile:
    'Designer de produto com 8 anos criando experiências digitais para fintech e comércio. Meu foco é pesquisa com usuários, sistemas de design e protótipos que chegam à produção.',
  portfolio: 'Portfólio',
  experience: [
    {
      role: 'Designer de produto sênior',
      description: 'Liderei o redesenho do fluxo de pagamentos e o sistema de design do app móvel.',
      achievements: ['Reduzi em 30% os pagamentos abandonados.', 'Criei a biblioteca de componentes usada por 40 designers.'],
    },
    { role: 'Designer de produto', description: 'Desenhei o checkout e coordenei testes A/B em seis países.', achievements: [] },
    { role: 'Designer de UI', description: 'Interfaces para clientes de bancos e varejo na América Latina.', achievements: [] },
  ],
  education: [
    { degree: 'Desenho Industrial', description: 'Ênfase em interação e ergonomia cognitiva.' },
    { degree: 'Design de interação', description: 'Curso profissional de prototipagem e testes com usuários.' },
  ],
  skills: ['Figma', 'Prototipagem', 'Pesquisa', 'HTML e CSS'],
  languages: [
    { name: 'Espanhol', label: 'Nativo' },
    { name: 'Inglês', label: 'Avançado' },
    { name: 'Português', label: 'Intermediário' },
  ],
  note: 'Disponível para trabalho remoto ou híbrido em Bogotá.',
});

const SAMPLES: Record<Lang, CvData> = { es: ES, en: EN, pt: PT };
const SAMPLE_JSON: Record<Lang, string> = { es: JSON.stringify(ES), en: JSON.stringify(EN), pt: JSON.stringify(PT) };

/** Copia de los datos de ejemplo en ese idioma. */
export const sampleData = (lang: Lang): CvData => structuredClone(SAMPLES[lang]);

/** Idioma de los datos de ejemplo si `data` es exactamente uno de ellos (sin tocar). */
export function sampleLangOf(data: CvData): Lang | null {
  const json = JSON.stringify(data);
  return (Object.keys(SAMPLE_JSON) as Lang[]).find((l) => SAMPLE_JSON[l] === json) ?? null;
}

export const EMPTY_DATA: CvData = {
  photo: null,
  hidePhoto: false,
  firstName: '',
  lastName: '',
  title: '',
  profile: '',
  email: '',
  phone: '',
  city: '',
  links: [],
  experience: [],
  education: [],
  skills: [],
  languages: [],
  note: '',
};

export const initialState = (lang: Lang): AppState => ({
  version: 1,
  template: 'columna',
  colors: structuredClone(DEFAULT_COLORS),
  data: sampleData(lang),
  isSample: true,
  fileName: 'my-CV.pdf',
});

export const blankExperience = () => ({
  id: uid(), role: '', company: '', city: '', start: '', end: '', current: false, description: '', achievements: [] as string[],
});
export const blankEducation = () => ({ id: uid(), institution: '', degree: '', start: '', end: '', description: '' });
export const blankSkill = () => ({ id: uid(), name: '', level: 70 });
export const blankLanguage = () => ({ id: uid(), name: '', level: 70, label: '' });
export const blankLink = () => ({ id: uid(), label: '', value: '' });

/**
 * Periodo "inicio — fin" de una experiencia o estudio: "2021 — actual",
 * "mar 2019 — dic 2021" o una sola fecha. `present` = palabra para "actual";
 * `format` = cómo muestra las fechas la plantilla (ver dates.ts).
 */
export function period(start: string, end: string, current = false, present = 'actual', format?: DateFormat) {
  const f = (v: string) => (format ? formatDate(v, format.lang, format.style) : v.trim());
  const s = start ? f(start) : '';
  const e = current ? present : end ? f(end) : '';
  if (s && e && s !== e) return `${s} — ${e}`;
  return s || e || '';
}

export function fullName(d: CvData) {
  return [d.firstName, d.lastName].filter(Boolean).join(' ');
}

export function suggestFileName(d: CvData) {
  const base = fullName(d)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'Mi'}-CV.pdf`;
}
