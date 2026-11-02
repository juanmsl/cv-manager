import type { Lang } from './i18n';

// Modelo de datos del CV. Todas las plantillas leen de este mismo modelo,
// así que cambiar de plantilla nunca pierde información.

export type TemplateId =
  | 'columna'
  | 'retrato'
  | 'editorial'
  | 'lineal'
  | 'marco'
  | 'ejecutivo'
  | 'tarjetas'
  | 'boutique'
  | 'panel'
  | 'sereno';
export type Step = 'templates' | 'editor' | 'export';

export type SectionId =
  | 'personal'
  | 'profile'
  | 'contact'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'colors';

export interface Photo {
  dataUrl: string; // imagen guardada localmente como data URL
  grayscale: boolean;
  zoom: number; // 1 – 2
  offsetY: number; // -50 – 50 (% de desplazamiento vertical)
}

export interface Link {
  id: string;
  label: string; // LinkedIn, Behance, GitHub…
  value: string; // URL o usuario
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  city: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  start: string;
  end: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 – 100
}

export interface Language {
  id: string;
  name: string;
  level: number; // 0 – 100
  label: string; // Nativo, Avanzado…
}

export interface CvColors {
  primary: string;
  text: string;
  accent: string;
}

export interface CvData {
  photo: Photo | null;
  firstName: string;
  lastName: string;
  title: string;
  profile: string;
  email: string;
  phone: string;
  city: string;
  links: Link[];
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  note: string;
}

export interface AppState {
  version: 1;
  template: TemplateId;
  colors: Record<TemplateId, CvColors>;
  data: CvData;
  isSample: boolean;
  fileName: string;
  /** Archivo .cv abierto o guardado (si lo hay) y huella del último guardado. */
  doc?: { path: string; name: string; savedHash: string } | null;
  /** Idioma de la interfaz (si no se ha elegido, el del sistema). */
  uiLang?: Lang | null;
  /** Idioma de los títulos del CV impreso (si no, el de la interfaz). */
  cvLang?: Lang | null;
}
