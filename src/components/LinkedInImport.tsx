import { useEffect, useRef, useState, type DragEvent } from 'react';
import { PiFilePdf, PiLinkedinLogo, PiX } from 'react-icons/pi';
import { useCv } from '../state';
import type { ParsedCv } from '../linkedin/parse';
import { rich, useT } from '../i18n';

type Phase =
  | { kind: 'idle' }
  | { kind: 'reading'; name: string }
  | { kind: 'review'; name: string; data: ParsedCv }
  | { kind: 'error'; message: string };

/** Ventana para importar los datos del CV desde el PDF de perfil de LinkedIn. */
export function LinkedInImport({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { importData } = useCv();
  const { t } = useT();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [over, setOver] = useState(false);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      setPhase({ kind: 'idle' });
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open]);

  const read = async (file?: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setPhase({ kind: 'error', message: t('li.notPdf') });
      return;
    }
    setPhase({ kind: 'reading', name: file.name });
    try {
      const [{ extractLines }, { parseLinkedIn }] = await Promise.all([
        import('../linkedin/extract'),
        import('../linkedin/parse'),
      ]);
      const data = parseLinkedIn(await extractLines(await file.arrayBuffer()), t);
      if (!data) {
        setPhase({ kind: 'error', message: t('li.notLinkedIn') });
        return;
      }
      setPhase({ kind: 'review', name: file.name, data });
    } catch {
      setPhase({ kind: 'error', message: t('li.readError') });
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    read(e.dataTransfer.files[0]);
  };

  const apply = () => {
    if (phase.kind !== 'review') return;
    importData(phase.data);
    onClose();
  };

  const d = phase.kind === 'review' ? phase.data : null;
  const name = d ? [d.firstName, d.lastName].filter(Boolean).join(' ') : '';
  const contact = d ? [d.email, d.phone].filter(Boolean).length + (d.links?.length ?? 0) : 0;
  const rows: [string, string][] = d
    ? [
        [t('li.row.name'), name || '—'],
        [t('li.row.title'), d.title || '—'],
        [t('li.row.city'), d.city || '—'],
        [t('li.row.profile'), d.profile ? t('li.yes') : '—'],
        [t('li.row.contact'), contact ? t.n('li.data', contact) : '—'],
        [t('li.row.experience'), d.experience?.length ? t.n('cards', d.experience.length) : '—'],
        [t('li.row.education'), d.education?.length ? t.n('cards', d.education.length) : '—'],
        [t('li.row.skills'), d.skills?.length ? String(d.skills.length) : '—'],
        [t('li.row.languages'), d.languages?.length ? String(d.languages.length) : '—'],
      ]
    : [];

  return (
    <dialog ref={dialog} className="modal" aria-labelledby="li-title" onClose={onClose} onCancel={onClose}>
      <header className="modal-head">
        <span className="modal-mark" aria-hidden="true">
          <PiLinkedinLogo size={20} />
        </span>
        <h2 id="li-title">{t('li.title')}</h2>
        <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={onClose}>
          <PiX size={14} />
        </button>
      </header>

      {phase.kind === 'review' ? (
        <div className="modal-body">
          <p className="modal-lead">
            {rich(t('li.found', { file: `<b>${phase.name}</b>` }))}
          </p>
          <dl className="import-summary">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd className={v === '—' ? 'is-empty' : ''}>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="modal-note">
            {t('li.replaceNote')}
          </p>
          <footer className="modal-foot">
            <button type="button" className="btn" onClick={() => setPhase({ kind: 'idle' })}>
              {t('li.chooseOther')}
            </button>
            <button type="button" className="btn btn--primary" onClick={apply} autoFocus>
              {t('li.use')}
            </button>
          </footer>
        </div>
      ) : (
        <div className="modal-body">
          <p className="modal-lead">{t('li.lead')}</p>
          <ol className="steps">
            <li>{rich(t('li.step1'))}</li>
            <li>{rich(t('li.step2'))}</li>
            <li>{rich(t('li.step3'))}</li>
            <li>{t('li.step4')}</li>
          </ol>
          <button
            type="button"
            className="btn btn--link"
            onClick={() => window.open('https://www.linkedin.com/', '_blank')}
          >
            {t('li.openLinkedIn')}
          </button>

          <button
            type="button"
            className={'pdf-drop' + (over ? ' is-over' : '')}
            onClick={() => input.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={onDrop}
            disabled={phase.kind === 'reading'}
          >
            <PiFilePdf size={28} aria-hidden="true" />
            {phase.kind === 'reading' ? (
              <span>{t('li.reading', { file: phase.name })}</span>
            ) : (
              <span>
                <strong>{t('li.drop1')}</strong>
                <br />
                {t('li.drop2')}
              </span>
            )}
          </button>
          <input
            ref={input}
            type="file"
            accept="application/pdf,.pdf"
            hidden
            onChange={(e) => {
              read(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          {phase.kind === 'error' && (
            <p className="modal-error" role="alert">
              {phase.message}
            </p>
          )}
          <p className="modal-note">{t('li.note')}</p>
        </div>
      )}
    </dialog>
  );
}
