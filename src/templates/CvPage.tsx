import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { AppState, TemplateId } from '../types';
import { Columna } from './Columna';
import { Retrato } from './Retrato';
import { Editorial } from './Editorial';
import './templates.css';
import { cvLangOf, makeT } from '../i18n';

// El CV siempre es una sola página: ancho Carta (8,5 in) y alto mínimo Carta
// (11 in) que crece hacia abajo si el contenido no cabe. Medidas en puntos
// tipográficos (1pt = 1/72 in), las mismas que usa el PDF.
export const PAGE_W_PT = 612;
export const PAGE_MIN_H_PT = 792;
export const PT_TO_PX = 96 / 72;

/** Medidas legibles de una página de alto `hPt`. */
export function pageDims(hPt: number) {
  return {
    mm: Math.round((hPt / 72) * 25.4),
    in: Math.round((hPt / 72) * 10) / 10,
  };
}

/** ¿El contenido no cabe en Carta y la hoja se alarga? */
export const isTaller = (hPt: number) => hPt > PAGE_MIN_H_PT + 0.5;

const COMPONENTS: Record<TemplateId, typeof Columna> = {
  columna: Columna,
  retrato: Retrato,
  editorial: Editorial,
};

interface Props {
  state: AppState;
  template?: TemplateId;
  /** Ficha resaltada en la vista previa en vivo (id de experiencia o educación). */
  highlightId?: string | null;
  /** Alto real de la página en pt (mínimo Carta). */
  onHeight?: (hPt: number) => void;
  className?: string;
}

export function CvPage({ state, template, highlightId, onHeight, className }: Props) {
  const tpl = template ?? state.template;
  const Comp = COMPONENTS[tpl];
  const c = state.colors[tpl];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onHeight || !ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver(() => onHeight(Math.max(PAGE_MIN_H_PT, el.offsetHeight / PT_TO_PX)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeight]);

  const style = {
    '--page-w': `${PAGE_W_PT}pt`,
    '--page-h': `${PAGE_MIN_H_PT}pt`,
    '--cv-primary': c.primary,
    '--cv-text': c.text,
    '--cv-accent': c.accent,
  } as CSSProperties;

  return (
    <div ref={ref} lang={cvLangOf(state)} className={`cv-page cv-${tpl} ${className ?? ''}`} style={style} data-highlight={highlightId ?? undefined}>
      <Comp data={state.data} highlightId={highlightId ?? null} t={makeT(cvLangOf(state))} />
    </div>
  );
}

/** Página escalada para miniaturas y vista previa; su alto sigue al contenido. */
export function ScaledPage({ state, template, width, highlightId, onHeight }: Props & { width: number }) {
  const [hPt, setHPt] = useState<number>(PAGE_MIN_H_PT);
  const report = useCallback(
    (h: number) => {
      setHPt(h);
      onHeight?.(h);
    },
    [onHeight],
  );
  const nativeW = PAGE_W_PT * PT_TO_PX;
  const scale = width / nativeW;
  return (
    <div className="scaled-page" style={{ width, height: hPt * PT_TO_PX * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: nativeW }}>
        <CvPage state={state} template={template} highlightId={highlightId} onHeight={report} />
      </div>
    </div>
  );
}
