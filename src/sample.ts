import type { AppState, CvColors, CvData, TemplateId } from './types';

export const uid = () => Math.random().toString(36).slice(2, 10);

/** Plantillas disponibles (nombre y descripción vienen de i18n: tpl.<id>.name/desc). */
export const TEMPLATES: { id: TemplateId }[] = [{ id: 'columna' }, { id: 'retrato' }, { id: 'editorial' }];

export const DEFAULT_COLORS: Record<TemplateId, CvColors> = {
  columna: { primary: '#2D3039', text: '#4A4B50', accent: '#FFFFFF' },
  retrato: { primary: '#141414', text: '#333333', accent: '#B5B5B5' },
  editorial: { primary: '#161616', text: '#333333', accent: '#C8DD00' },
};

export const COLOR_PRESETS = ['#2D3039', '#1F3A5F', '#2F5D50', '#7A2E2A', '#5B3F73', '#3A3A3A'];

// Datos de ejemplo (persona ficticia) para que la primera vista no esté vacía.
export const SAMPLE_DATA: CvData = {
  photo: null,
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

export const EMPTY_DATA: CvData = {
  photo: null,
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

export const initialState = (): AppState => ({
  version: 1,
  template: 'columna',
  colors: structuredClone(DEFAULT_COLORS),
  data: structuredClone(SAMPLE_DATA),
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

/** "2021 — actual", "2019 — 2021" o un solo año. `present` = palabra para "actual". */
export function period(start: string, end: string, current = false, present = 'actual') {
  const e = current ? present : end;
  if (start && e && start !== e) return `${start} — ${e}`;
  return start || e || '';
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
