import { useCallback, useEffect, useState } from 'react';
import { useCv } from '../state';
import { TEMPLATES, suggestFileName } from '../sample';
import type { TemplateId } from '../types';
import { PAGE_MIN_H_PT, PAGE_W_PT, PT_TO_PX, ScaledPage, isTaller, pageDims } from '../templates/CvPage';
import { Field, Icon } from '../components/ui';
import { ColorControls } from './sections';
import { LANGS, cvLangOf, useT, type Lang } from '../i18n';

/** Mide la copia de impresión del CV y fija el tamaño de la hoja (@page) a su alto. */
function setPrintPageSize(): number {
  const page = document.querySelector('.print-root .cv-page') as HTMLElement | null;
  const measured = page ? page.offsetHeight / PT_TO_PX : PAGE_MIN_H_PT;
  const heightPt = Math.ceil(Math.max(PAGE_MIN_H_PT, measured));
  let tag = document.getElementById('print-page-size');
  if (!tag) {
    tag = document.createElement('style');
    tag.id = 'print-page-size';
    document.head.appendChild(tag);
  }
  tag.textContent =
    `@page { size: ${PAGE_W_PT}pt ${heightPt}pt; margin: 0; }` +
    `@media print { .print-root .cv-page { height: ${heightPt}pt; overflow: hidden; } }`;
  return heightPt;
}

export type ExportResult = { kind: 'ok'; filePath?: string } | { kind: 'error'; message: string } | null;

/**
 * Ajusta la hoja al contenido y genera el PDF: siempre una sola página de
 * ancho Carta, con alto mínimo Carta que crece si el contenido no cabe.
 */
export async function exportPdf(fileName: string, errorMessage: string): Promise<ExportResult> {
  const name = fileName.trim().replace(/[/\\:]/g, '-') || 'CV.pdf';
  const finalName = name.toLowerCase().endsWith('.pdf') ? name : `${name}.pdf`;
  const heightPt = setPrintPageSize();
  if (!window.cvApi) {
    window.print(); // modo navegador (desarrollo): diálogo de impresión del sistema
    return null;
  }
  const res = await window.cvApi.exportPdf({ fileName: finalName, heightPt });
  if (res.ok) return { kind: 'ok', filePath: res.filePath };
  if (res.canceled) return null;
  return { kind: 'error', message: errorMessage };
}

export function Export({
  onBack,
  trigger,
  onTriggerHandled,
}: {
  onBack: () => void;
  trigger: number;
  onTriggerHandled?: () => void;
}) {
  const { state, set } = useCv();
  const { t } = useT();
  const [pageH, setPageH] = useState(PAGE_MIN_H_PT);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ExportResult>(null);
  const [deskW, setDeskW] = useState(476);
  const dims = pageDims(pageH);

  // La página completa cabe en el alto disponible de la mesa.
  useEffect(() => {
    const fit = () => {
      const h = window.innerHeight - 52 - 110; // barra + márgenes + pie de página
      const ratio = PAGE_W_PT / pageH;
      setDeskW(Math.max(300, Math.min(620, Math.round(h * ratio))));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [pageH]);

  const run = useCallback(async () => {
    setBusy(true);
    setResult(await exportPdf(state.fileName, t('export.error')));
    setBusy(false);
  }, [state.fileName, t]);

  // ⌘E desde el menú de la app.
  useEffect(() => {
    if (trigger > 0) {
      onTriggerHandled?.(); // consumir el aviso para que no se repita al volver a esta vista
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  useEffect(() => {
    if (!result) return;
    const t = window.setTimeout(() => setResult(null), 6000);
    return () => window.clearTimeout(t);
  }, [result]);

  return (
    <div className="view">
      <div className="export">
        <div className="desk">
          <ScaledPage state={state} width={deskW} onHeight={setPageH} />
          <p className="desk-foot">{t('page.size', dims)}</p>
        </div>

        <aside className="inspector" aria-label={t('export.optionsAria')}>
          <section className="inspector-group">
            <h2>{t('common.template')}</h2>
            <select
              className="popup"
              aria-label={t('common.template')}
              value={state.template}
              onChange={(e) => set({ template: e.target.value as TemplateId })}
            >
              {TEMPLATES.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {t(`tpl.${tp.id}.name`)}
                </option>
              ))}
            </select>
          </section>

          <section className="inspector-group">
            <h2>{t('export.cvLanguage')}</h2>
            <select
              className="popup"
              aria-label={t('export.cvLanguage')}
              value={cvLangOf(state)}
              onChange={(e) => set({ cvLang: e.target.value as Lang })}
            >
              {LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
            <p className="field-hint" style={{ margin: 0 }}>{t('export.cvLanguageHint')}</p>
          </section>

          <section className="inspector-group">
            <h2>{t('export.colors')}</h2>
            <ColorControls />
          </section>

          <section className="inspector-group">
            <h2>{t('export.file')}</h2>
            <Field
              label={t('export.fileName')}
              value={state.fileName}
              onChange={(e) => set({ fileName: e.target.value })}
              onBlur={(e) => !e.target.value.trim() && set({ fileName: suggestFileName(state.data) })}
            />
            <p className="status">
              {Icon.check(12)}
              {isTaller(pageH) ? t('export.taller', dims) : t('export.fits')}
            </p>
          </section>

          <div className="inspector-actions">
            <button type="button" className="btn btn--primary btn--block" onClick={run} disabled={busy}>
              {busy ? t('export.exporting') : t('export.export')}
            </button>
            <button type="button" className="btn btn--block" onClick={onBack}>
              {t('export.back')}
            </button>
            <p className="kbd-hint">{t('export.kbd')}</p>
          </div>
        </aside>
      </div>

      {result && (
        <div className={'toast' + (result.kind === 'error' ? ' is-error' : '')} role="status">
          {result.kind === 'ok' ? (
            <>
              {t('export.saved')}
              {result.filePath && window.cvApi && (
                <button type="button" className="btn btn--link" onClick={() => window.cvApi!.reveal(result.filePath!)}>
                  {t('export.reveal')}
                </button>
              )}
            </>
          ) : (
            result.message
          )}
          <button type="button" className="icon-btn" style={{ color: 'inherit' }} aria-label={t('common.closeNotice')} onClick={() => setResult(null)}>
            {Icon.x()}
          </button>
        </div>
      )}
    </div>
  );
}
