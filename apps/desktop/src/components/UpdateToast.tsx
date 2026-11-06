// Aviso de actualizaciones (electron/updater.cjs, ADR-0025): nueva versión
// disponible, progreso de descarga, lista para instalar y errores.
import { useEffect, useState, type ReactNode } from 'react';
import { PiX } from 'react-icons/pi';
import { useT } from '../i18n';

export type UpdateStatus = 'idle' | 'checking' | 'up-to-date' | 'available' | 'downloading' | 'ready' | 'manual' | 'error';
export interface UpdateState {
  status: UpdateStatus;
  current: string;
  auto: boolean;
  version?: string;
  latest?: string;
  progress?: number;
  error?: string;
  manual?: boolean;
  notesUrl?: string;
  canInstall?: boolean;
}

export function UpdateToast() {
  const { t } = useT();
  const api = window.cvApi?.updates;
  const [s, setS] = useState<UpdateState | null>(null);
  const [hidden, setHidden] = useState<string | null>(null);

  useEffect(() => {
    if (!api) return;
    api.getState().then(setS);
    return api.onState((next) => {
      setS(next);
      setHidden(null);
    });
  }, [api]);

  // "Ya tienes la última versión" se cierra solo.
  useEffect(() => {
    if (s?.status !== 'up-to-date' || !s.manual) return;
    const id = setTimeout(() => setHidden('up-to-date'), 4000);
    return () => clearTimeout(id);
  }, [s]);

  if (!api || !s) return null;
  const key = `${s.status}:${s.version ?? ''}`;
  if (hidden === key || hidden === s.status) return null;

  const close = () => {
    if (s.status === 'available') api.later();
    setHidden(key);
  };
  const v = { version: s.version ?? '' };

  let body: ReactNode = null;
  let actions: ReactNode = null;
  switch (s.status) {
    case 'checking':
      if (!s.manual) return null;
      body = t('update.checking');
      break;
    case 'up-to-date':
      if (!s.manual) return null;
      body = t('update.upToDate', { version: s.current });
      break;
    case 'available':
      body = (
        <>
          <strong>{t('update.available', v)}</strong>
          {s.notesUrl && (
            <a href={s.notesUrl} target="_blank" rel="noreferrer">
              {t('update.notes')}
            </a>
          )}
        </>
      );
      actions = (
        <>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => api.download()}>
            {t('update.install')}
          </button>
          <label className="check toast-check">
            <input type="checkbox" checked={s.auto} onChange={(e) => api.setAuto(e.target.checked)} />
            {t('update.auto')}
          </label>
        </>
      );
      break;
    case 'downloading':
      body = (
        <>
          <span>{t('update.downloading', { version: s.version ?? '', pct: s.progress ?? 0 })}</span>
          <span className="toast-progress" role="progressbar" aria-valuenow={s.progress ?? 0} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${s.progress ?? 0}%` }} />
          </span>
        </>
      );
      break;
    case 'ready':
      body = (
        <>
          <strong>{t('update.ready', v)}</strong>
          <span>{s.canInstall ? t('update.onQuit') : t('update.devOnly')}</span>
        </>
      );
      actions = (
        <button type="button" className="btn btn--primary btn--sm" onClick={() => api.install()}>
          {s.canInstall ? t('update.restart') : t('update.openInstaller')}
        </button>
      );
      break;
    case 'manual':
      body = t('update.manualInstall');
      break;
    case 'error':
      body = t('update.error', { error: s.error ?? '' });
      actions = (
        <button type="button" className="btn btn--link" onClick={() => (s.version && !s.manual ? api.download() : api.check())}>
          {t('update.retry')}
        </button>
      );
      break;
    default:
      return null;
  }

  return (
    <div className={'toast toast--update' + (s.status === 'error' ? ' is-error' : '')} role="status" aria-live="polite">
      <div className="toast-body">{body}</div>
      {actions && <div className="toast-actions">{actions}</div>}
      {s.status !== 'downloading' && (
        <button type="button" className="icon-btn toast-close" aria-label={t('common.closeNotice')} onClick={close}>
          <PiX size={12} />
        </button>
      )}
    </div>
  );
}
