// Datos de ejemplo de Jhon Doe que se ven en el sitio (ficticios, ADR-0013).
// Coinciden con los datos de ejemplo de la app en cada idioma y con las hojas
// exportadas de src/assets/sheets y src/assets/templates.
import type { Lang } from './ui';

export const SAMPLE: Record<Lang, { senior: string; role: string; win1: string; win2: string }> = {
  es: {
    senior: 'Diseñador de producto senior',
    role: 'Diseñador de producto',
    win1: 'Reduje en 30 % los pagos abandonados.',
    win2: 'Diseñé el checkout y coordiné pruebas A/B en seis países.',
  },
  en: {
    senior: 'Senior Product Designer',
    role: 'Product Designer',
    win1: 'Cut abandoned payments by 30%.',
    win2: 'Designed the checkout and ran A/B tests in six countries.',
  },
  pt: {
    senior: 'Designer de produto sênior',
    role: 'Designer de produto',
    win1: 'Reduzi em 30% os pagamentos abandonados.',
    win2: 'Desenhei o checkout e coordenei testes A/B em seis países.',
  },
};

/** Caja de la primera experiencia en la hoja Columna, en % de la página. */
export const EXP1_BOX = { left: 38.7, top: 23.5, width: 56.9, height: 10.8 };
