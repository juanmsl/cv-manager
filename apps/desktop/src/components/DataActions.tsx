import { useState } from 'react';
import { PiFloppyDisk, PiFolderOpen, PiLinkedinLogo } from 'react-icons/pi';
import { useCv } from '../state';
import { useDocument } from '../document';
import { useT } from '../i18n';

type Confirm = null | 'sample' | 'clear';

/** Acciones sobre todos los datos: importar de LinkedIn, restaurar ejemplo, borrar todo. */
export function DataActions({ onImport, onDone }: { onImport: () => void; onDone: () => void }) {
  const { resetSample, clearAll } = useCv();
  const [confirm, setConfirm] = useState<Confirm>(null);
  const doc = useDocument();
  const { t, lang } = useT();

  return (
    <div className="data-actions">
      <button type="button" className="btn btn--block" onClick={() => doc.save()} title={t('doc.saveTitle')}>
        <PiFloppyDisk size={15} aria-hidden="true" />
        {doc.name ? (doc.dirty ? t('doc.saveChanges') : t('doc.save')) : t('doc.saveAsFile')}
      </button>
      <button type="button" className="btn btn--block" onClick={() => doc.open()} title={t('doc.openTitle')}>
        <PiFolderOpen size={15} aria-hidden="true" />
        {t('doc.open')}
      </button>
      <button type="button" className="btn btn--block" onClick={onImport}>
        <PiLinkedinLogo size={15} aria-hidden="true" />
        {t('data.importLinkedIn')}
      </button>

      {confirm ? (
        <div className="data-confirm" role="alert">
          <p>
            {confirm === 'sample' ? t('data.confirmSample') : t('data.confirmClear')} {t('data.noUndo')}
          </p>
          <div>
            <button type="button" className="btn" onClick={() => setConfirm(null)}>
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="btn btn--danger-solid"
              onClick={() => {
                if (confirm === 'sample') resetSample(lang);
                else clearAll();
                setConfirm(null);
                onDone();
              }}
            >
              {confirm === 'sample' ? t('data.restoreSample') : t('data.clearAll')}
            </button>
          </div>
        </div>
      ) : (
        <div className="data-links">
          <button type="button" className="btn btn--link" onClick={() => setConfirm('sample')}>
            {t('data.restoreSample')}
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" className="btn btn--link btn--danger" onClick={() => setConfirm('clear')}>
            {t('data.clearAll')}
          </button>
        </div>
      )}
    </div>
  );
}
