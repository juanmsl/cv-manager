// Piezas comunes de las plantillas 4–10: iconos de contacto y listas.
import type { ReactNode } from 'react';
import {
  PiBehanceLogo,
  PiDribbbleLogo,
  PiEnvelopeSimpleFill,
  PiGithubLogo,
  PiGlobeSimple,
  PiInstagramLogo,
  PiLinkSimpleBold,
  PiLinkedinLogo,
  PiMapPinFill,
  PiPhoneFill,
  PiXLogo,
} from 'react-icons/pi';
import type { CvData, Link } from '../types';
import type { T } from '../i18n';

export type ContactKind = 'phone' | 'email' | 'city';

export interface ContactItem {
  id: string;
  kind: ContactKind | 'link';
  label: string;
  value: string;
  icon: ReactNode;
}

/** Icono según la red (LinkedIn, GitHub…) o un enlace genérico. */
export function linkIcon(l: Link) {
  const s = `${l.label} ${l.value}`.toLowerCase();
  if (s.includes('linkedin')) return <PiLinkedinLogo />;
  if (s.includes('github')) return <PiGithubLogo />;
  if (s.includes('instagram')) return <PiInstagramLogo />;
  if (s.includes('behance')) return <PiBehanceLogo />;
  if (s.includes('dribbble')) return <PiDribbbleLogo />;
  if (s.includes('twitter') || s.includes('x.com')) return <PiXLogo />;
  if (s.includes('.') && !s.includes('@')) return <PiGlobeSimple />;
  return <PiLinkSimpleBold />;
}

/** Teléfono, correo y ciudad (solo los que tienen valor). */
export function contactItems(d: CvData, t: T): ContactItem[] {
  const all: ContactItem[] = [
    { id: 'phone', kind: 'phone', label: t('cv.phone'), value: d.phone, icon: <PiPhoneFill /> },
    { id: 'email', kind: 'email', label: t('cv.email'), value: d.email, icon: <PiEnvelopeSimpleFill /> },
    { id: 'city', kind: 'city', label: t('cv.city'), value: d.city, icon: <PiMapPinFill /> },
  ];
  return all.filter((c) => c.value);
}

/** Enlaces (redes, portafolio) como elementos de contacto. */
export function linkItems(d: CvData): ContactItem[] {
  return d.links
    .filter((l) => l.value)
    .map((l) => ({ id: l.id, kind: 'link', label: l.label, value: l.value, icon: linkIcon(l) }));
}

/** Logros de una experiencia (sin vacíos). */
export function Achievements({ items, className }: { items: string[]; className?: string }) {
  const list = items.filter(Boolean);
  if (!list.length) return null;
  return (
    <ul className={className}>
      {list.map((a, i) => (
        <li key={i}>{a}</li>
      ))}
    </ul>
  );
}

export const hasName = (d: CvData) => Boolean(d.firstName || d.lastName);
