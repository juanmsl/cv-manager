import { useEffect, useRef, useState } from 'react';
import { PiX } from 'react-icons/pi';
import { useDocument } from './document';
import { LANGS, useT, type Lang } from './i18n';
import { useCv } from './state';
import { TEMPLATES } from './sample';
import type { Step, TemplateId } from './types';
import { Segmented } from './components/ui';
import { CvPage } from './templates/CvPage';
import { TemplateSelector } from './views/TemplateSelector';
import { Editor } from './views/Editor';
import { Export } from './views/Export';

export function App() {
  const { state, ready, set } = useCv();
  const { t, lang, setLang } = useT();
  const STEPS: { value: Step; label: string }[] = [
    { value: 'templates', label: t('step.templates') },
    { value: 'editor', label: t('step.editor') },
    { value: 'export', label: t('step.export') },
  ];
  const [step, setStep] = useState<Step>('templates');

  const [exportTrigger, setExportTrigger] = useState(0);
  const [importTrigger, setImportTrigger] = useState(0);
  const doc = useDocument();
  const docRef = useRef(doc);
  docRef.current = doc;

  // Al abrir un .cv se muestra la vista Datos.
  useEffect(() => {
    doc.onOpened(() => setStep('editor'));
  }, [doc]);

  // Atajos del menú de la app (⌘1, ⌘2, ⌘3, ⌘E).
  useEffect(() => {
    const handle = (action: string) => {
      if (action === 'open') {
        docRef.current.open();
      } else if (action === 'save' || action === 'save-as') {
        docRef.current.save(action === 'save-as');
      } else if (action === 'import') {
        setStep('editor');
        setImportTrigger((n) => n + 1);
      } else if (action === 'export') {
        setStep('export');
        setExportTrigger((n) => n + 1);
      } else if (action.startsWith('step:')) {
        setStep(action.slice(5) as Step);
      }
    };
    if (window.cvApi) return window.cvApi.onMenu(handle);
    // En el navegador (desarrollo) se usan los mismos atajos con el teclado.
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const map: Record<string, string> = { '1': 'step:templates', '2': 'step:editor', '3': 'step:export', e: 'export', i: 'import', o: 'open', s: e.shiftKey ? 'save-as' : 'save' };
      const a = map[e.key.toLowerCase()];
      if (a) {
        e.preventDefault();
        handle(a);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!ready) return null;

  return (
    <>
      <div className="app">
        <header className="toolbar">
          <div className="toolbar-left">
            <span className="toolbar-title">CV Manager</span>
            <span className="doc-name" title={doc.name ?? undefined}>
              {doc.name ? doc.name.replace(/\.cv$/i, '') : t('app.unsaved')}
              {doc.name && doc.dirty && <em> · {t('app.edited')}</em>}
            </span>
          </div>
          <Segmented<Step> label={t('app.steps')} value={step} onChange={setStep} options={STEPS} />
          <div className="toolbar-actions">
            {step === 'templates' && (
              <select
                className="popup"
                aria-label={t('common.appLanguage')}
                title={t('common.appLanguage')}
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
              >
                {LANGS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            )}
            {step === 'editor' && (
              <>
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
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setStep('export')}
                >
                  {t('common.reviewExport')}
                </button>
              </>
            )}
          </div>
        </header>

        {step === 'templates' && <TemplateSelector onContinue={() => setStep('editor')} />}
        {step === 'editor' && <Editor importTrigger={importTrigger} onImportHandled={() => setImportTrigger(0)} />}
        {step === 'export' && <Export onBack={() => setStep('editor')} trigger={exportTrigger} onTriggerHandled={() => setExportTrigger(0)} />}
      </div>

      {doc.notice && (
        <div className={'toast' + (doc.notice.kind === 'error' ? ' is-error' : '')} role="status">
          {doc.notice.text}
          <button type="button" className="icon-btn" style={{ color: 'inherit' }} aria-label={t('common.closeNotice')} onClick={doc.clearNotice}>
            <PiX size={12} />
          </button>
        </div>
      )}

      {/* Copia de la página a tamaño real que solo aparece al imprimir/exportar. */}
      <div className="print-root" aria-hidden="true">
        <CvPage state={state} />
      </div>
    </>
  );
}
