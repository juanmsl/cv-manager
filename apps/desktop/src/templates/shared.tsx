import { Marked } from 'marked';
import DOMPurify from 'dompurify';
import type { CvData } from '../types';
import type { DateFormat, DateStyle } from '../dates';
import type { T } from '../i18n';

export interface TemplateProps {
  data: CvData;
  highlightId: string | null;
  /** Traductor con el idioma del CV. */
  t: T;
}

/** Foto del CV, o una silueta neutra si aún no se ha cargado ninguna. Nada con "Sin foto". */
export function CvPhoto({ data, className }: { data: CvData; className?: string }) {
  if (data.hidePhoto) return null;
  const p = data.photo;
  if (!p) {
    return (
      <div className={`cv-photo cv-photo--empty ${className ?? ''}`} aria-hidden="true">
        <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
          <circle cx="50" cy="46" r="20" />
          <path d="M14 120c0-26 16-36 36-36s36 10 36 36z" />
        </svg>
      </div>
    );
  }
  return (
    <div className={`cv-photo ${className ?? ''}`}>
      <img
        src={p.dataUrl}
        alt=""
        style={{
          filter: p.grayscale ? 'grayscale(1)' : undefined,
          transform: `scale(${p.zoom})`,
          objectPosition: `50% ${50 + p.offsetY}%`,
        }}
      />
    </div>
  );
}

export const hl = (id: string, highlightId: string | null) => (id === highlightId ? ' is-highlight' : '');

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter((w, i, all) => i === 0 || w.length > 2 || all.length === 1);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name.slice(0, 1).toUpperCase() + name.slice(1, 2).toLowerCase()) || '·';
}

/** Formato de fechas de una plantilla, en el idioma del CV. */
export const dateFormat = (t: T, style: DateStyle): DateFormat => ({ lang: t.lang, style });

// Textos con formato (perfil, descripciones, nota): se escriben en Markdown con
// el editor de la app y aquí se convierten a HTML limitado y saneado.
const md = new Marked({ gfm: true, breaks: true });
const ALLOWED = { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 's', 'del', 'ul', 'ol', 'li', 'a'], ALLOWED_ATTR: ['href'] };

/** Texto con formato de un campo del CV. Vacío → no renderiza nada. */
export function Rich({ text, className }: { text: string; className?: string }) {
  if (!text?.trim()) return null;
  const html = DOMPurify.sanitize(md.parse(text, { async: false }) as string, ALLOWED)
    .replace(/<li>\s*<\/li>/g, '') // viñetas vacías que deja el editor al final de una lista
    .replace(/<(ul|ol)>\s*<\/\1>/g, '');
  return <div className={`cv-rich ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
