import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useCv } from '../state';
import { TEMPLATES } from '../sample';
import { ScaledPage } from '../templates/CvPage';
import { Icon } from '../components/ui';
import { useT } from '../i18n';

export function TemplateSelector({ onContinue }: { onContinue: () => void }) {
  const { state, set } = useCv();
  const { t } = useT();
  const gridRef = useRef<HTMLDivElement>(null);
  const [thumbW, setThumbW] = useState(250);

  // La miniatura se adapta al ancho de cada tarjeta.
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const card = el.querySelector('.tpl-card') as HTMLElement | null;
      if (card) setThumbW(Math.min(300, Math.round(card.clientWidth * 0.72)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const current = TEMPLATES.find((x) => x.id === state.template)!;

  const onKey = (e: KeyboardEvent) => {
    const i = TEMPLATES.findIndex((x) => x.id === state.template);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = TEMPLATES[(i + 1) % TEMPLATES.length];
      set({ template: next.id });
      (gridRef.current?.children[(i + 1) % TEMPLATES.length] as HTMLElement)?.focus();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const j = (i - 1 + TEMPLATES.length) % TEMPLATES.length;
      set({ template: TEMPLATES[j].id });
      (gridRef.current?.children[j] as HTMLElement)?.focus();
    }
    if (e.key === 'Enter') onContinue();
  };

  return (
    <div className="view">
      <div className="chooser">
        <h1 className="page-title">{t('chooser.title')}</h1>
        <p className="page-sub">{t('chooser.sub')}</p>

        <div className="tpl-grid" role="radiogroup" aria-label={t('chooser.templates')} ref={gridRef} onKeyDown={onKey}>
          {TEMPLATES.map((tp) => {
            const selected = tp.id === state.template;
            return (
              // div y no <button>: el layout de los botones en Chromium/Electron
              // no estira su contenido y la miniatura quedaba pegada a la izquierda.
              <div
                key={tp.id}
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                className="tpl-card"
                onClick={() => set({ template: tp.id })}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault();
                    set({ template: tp.id });
                  }
                }}
                onDoubleClick={() => {
                  set({ template: tp.id });
                  onContinue();
                }}
              >
                <div className="tpl-thumb">
                  <ScaledPage state={state} template={tp.id} width={thumbW} />
                </div>
                <div className="tpl-meta">
                  <div>
                    <strong>{t(`tpl.${tp.id}.name`)}</strong>
                    <p>{t(`tpl.${tp.id}.desc`)}</p>
                  </div>
                  <span className="radio-dot">{selected && Icon.check(11)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="footer-bar">
        <span>{t('chooser.selected', { name: t(`tpl.${current.id}.name`) })}</span>
        <button type="button" className="btn btn--primary" onClick={onContinue}>
          {t('chooser.continue')}
        </button>
      </div>
    </div>
  );
}
