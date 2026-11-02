import { useState, type ReactNode } from 'react';
import { Icon } from './ui';
import { useT } from '../i18n';
import type { useReorder } from './Reorder';

interface Props {
  index: number;
  total: number;
  open: boolean;
  onToggle: () => void;
  title: string;
  subtitle: string;
  dates: string;
  emptyTitle: string;
  children: ReactNode;
  onMove: (from: number, to: number) => void;
  onDelete: () => void;
  reorder: ReturnType<typeof useReorder>;
}

/** Ficha de catálogo: cerrada muestra el resumen; abierta, el formulario. */
export function EntryCard(p: Props) {
  const [confirming, setConfirming] = useState(false);
  const { t } = useT();
  const name = p.title || p.emptyTitle;

  return (
    <div className={'card' + (p.open ? ' is-open' : '') + p.reorder.cls(p.index)} {...p.reorder.itemProps(p.index)}>
      <div className="card-head">
        <span className="card-grip" title={t('common.dragToReorder')} {...p.reorder.gripProps(p.index)}>
          {Icon.grip()}
        </span>
        <button
          type="button"
          className="card-toggle"
          aria-expanded={p.open}
          onClick={p.onToggle}
        >
          <span className="card-text">
            <strong className={p.title ? '' : 'is-empty'}>{name}</strong>
            {p.subtitle && <span>{p.subtitle}</span>}
          </span>
          {p.dates && <span className="card-dates">{p.dates}</span>}
          <span className="card-chevron">{Icon.chevron()}</span>
        </button>
      </div>

      {p.open && (
        <div className="card-body">
          {p.children}
          <div className="card-foot">
            <button
              type="button"
              className="icon-btn"
              title={t('card.moveUp')}
              aria-label={t('card.moveUpAria')}
              disabled={p.index === 0}
              onClick={() => p.onMove(p.index, p.index - 1)}
            >
              {Icon.up()}
            </button>
            <button
              type="button"
              className="icon-btn"
              title={t('card.moveDown')}
              aria-label={t('card.moveDownAria')}
              disabled={p.index === p.total - 1}
              onClick={() => p.onMove(p.index, p.index + 1)}
            >
              {Icon.down()}
            </button>
            <span className="spacer" />
            {confirming ? (
              <span className="confirm" role="alert">
                {t('card.deleteConfirm', { name })}
                <button type="button" className="btn" onClick={() => setConfirming(false)}>
                  {t('card.keep')}
                </button>
                <button type="button" className="btn btn--danger-solid" onClick={p.onDelete}>
                  {t('card.delete')}
                </button>
              </span>
            ) : (
              <button type="button" className="btn btn--link btn--danger" onClick={() => setConfirming(true)}>
                {t('card.delete')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
