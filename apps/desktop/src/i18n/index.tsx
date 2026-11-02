// Internacionalización: español, inglés y portugués.
// - Idioma de la app (uiLang): preferencia del usuario, se guarda con la app.
// - Idioma del CV (cvLang): títulos de las secciones del CV impreso; se guarda
//   en el documento y por defecto sigue al idioma de la app.
import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { useCv } from '../state';
import { es } from './es';
import { en } from './en';
import { pt } from './pt';

export type Lang = 'es' | 'en' | 'pt';
export type TKey = keyof typeof es;
type Vars = Record<string, string | number>;

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Português' },
];

const DICTS: Record<Lang, Record<TKey, string>> = { es, en, pt };

export function translate(lang: Lang, key: TKey, vars?: Vars) {
  const s = DICTS[lang]?.[key] ?? es[key] ?? key;
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
}

export function makeT(lang: Lang) {
  const t = (key: TKey, vars?: Vars) => translate(lang, key, vars);
  /** Plural simple: busca `${base}_one` o `${base}_other`. */
  t.n = (base: string, n: number, vars?: Vars) =>
    translate(lang, `${base}_${n === 1 ? 'one' : 'other'}` as TKey, { n, ...vars });
  t.lang = lang;
  return t;
}
export type T = ReturnType<typeof makeT>;

export function detectLang(): Lang {
  const l = (typeof navigator !== 'undefined' ? navigator.language : 'es').slice(0, 2).toLowerCase();
  return l === 'en' || l === 'pt' ? l : 'es';
}

export const isLang = (v: unknown): v is Lang => v === 'es' || v === 'en' || v === 'pt';

/** Convierte <b>…</b> e <i>…</i> de un texto traducido en elementos. */
export function rich(text: string): ReactNode[] {
  return text.split(/(<b>.*?<\/b>|<i>.*?<\/i>)/g).map((part, i) => {
    const b = part.match(/^<b>(.*)<\/b>$/);
    if (b) return <strong key={i}>{b[1]}</strong>;
    const it = part.match(/^<i>(.*)<\/i>$/);
    if (it) return <em key={i}>{it[1]}</em>;
    return part;
  });
}

interface I18nCtx {
  lang: Lang;
  t: T;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<I18nCtx>({ lang: 'es', t: makeT('es'), setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const { state, set } = useCv();
  const lang: Lang = isLang(state.uiLang) ? state.uiLang : detectLang();
  const t = useMemo(() => makeT(lang), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.cvApi?.setLanguage(lang); // menú y diálogos nativos
  }, [lang]);

  // Idioma elegido desde el menú de la app.
  useEffect(() => {
    if (!window.cvApi) return;
    return window.cvApi.onMenu((action) => {
      const l = action.startsWith('lang:') ? action.slice(5) : '';
      if (isLang(l)) set({ uiLang: l });
    });
  }, [set]);

  return <Ctx.Provider value={{ lang, t, setLang: (l) => set({ uiLang: l }) }}>{children}</Ctx.Provider>;
}

export const useT = () => useContext(Ctx);

/** Idioma del CV impreso: el elegido para el documento o, si no, el de la app. */
export function cvLangOf(state: { cvLang?: Lang | null; uiLang?: Lang | null }): Lang {
  if (isLang(state.cvLang)) return state.cvLang;
  if (isLang(state.uiLang)) return state.uiLang;
  return detectLang();
}
