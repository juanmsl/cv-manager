// Campo de fecha con selector propio: año, año y mes, o fecha completa.
// Guarda texto ISO parcial ("2021", "2021-03", "2021-03-15", ver dates.ts);
// cada plantilla decide cómo mostrarlo.
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useT } from '../i18n';
import {
  daysInMonth,
  firstDayOfWeek,
  formatDate,
  monthNames,
  parseDate,
  precisionOf,
  toISO,
  weekdayNames,
  type DatePrecision,
  type PartialDate,
} from '../dates';
import { Icon, Segmented } from './ui';

type View = 'years' | 'months' | 'days';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const viewFor = (p: DatePrecision): View => (p === 'year' ? 'years' : p === 'month' ? 'months' : 'days');

export function DateField({ label, value, onChange, placeholder, disabled }: Props) {
  const { t, lang } = useT();
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const parsed = parseDate(value);
  const shown = value ? formatDate(value, lang, 'long') : '';

  const close = (focus = true) => {
    setOpen(false);
    if (focus) button.current?.focus();
  };

  return (
    <div className="field">
      <span id={`${id}-label`}>{label}</span>
      <button
        ref={button}
        type="button"
        className={'date-input' + (shown ? '' : ' is-empty')}
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
      >
        <span id={`${id}-value`}>{shown || placeholder || t('date.pick')}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <rect x="1.75" y="2.75" width="10.5" height="9.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1.75 5.75h10.5M4.5 1.5v2.5M9.5 1.5v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>
      {open &&
        createPortal(
          <Picker
            anchor={button.current}
            value={parsed}
            label={label}
            onChange={onChange}
            onPick={(v) => {
              onChange(v);
              close();
            }}
            onClose={close}
          />,
          document.body,
        )}
    </div>
  );
}

function Picker({
  anchor,
  value,
  label,
  onChange,
  onPick,
  onClose,
}: {
  anchor: HTMLElement | null;
  value: PartialDate | null;
  label: string;
  /** Cambia el valor sin cerrar el selector. */
  onChange: (value: string) => void;
  /** Elige el valor y cierra. */
  onPick: (value: string) => void;
  onClose: (focus?: boolean) => void;
}) {
  const { t, lang } = useT();
  const now = new Date();
  const [precision, setPrecision] = useState<DatePrecision>(value ? precisionOf(value) : 'month');
  const [view, setView] = useState<View>(viewFor(value ? precisionOf(value) : 'month'));
  const [y, setY] = useState(value?.y ?? now.getFullYear());
  const [m, setM] = useState(value?.m ?? now.getMonth() + 1);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);

  // Debajo del campo; arriba si no cabe. Fijo en la ventana para no recortarse dentro de la ficha.
  useLayoutEffect(() => {
    if (!anchor || !box.current) return;
    const a = anchor.getBoundingClientRect();
    const b = box.current.getBoundingClientRect();
    const below = a.bottom + 6 + b.height <= window.innerHeight - 8;
    setPos({
      top: below ? a.bottom + 6 : Math.max(8, a.top - 6 - b.height),
      left: Math.min(Math.max(8, a.left), window.innerWidth - b.width - 8),
    });
  }, [anchor, view]);

  // Clic fuera o scroll del editor: cerrar sin robar el foco.
  useEffect(() => {
    const down = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!box.current?.contains(target) && !anchor?.contains(target)) onClose(false);
    };
    const scroll = (e: Event) => {
      if (!box.current?.contains(e.target as Node)) onClose(false);
    };
    document.addEventListener('mousedown', down);
    window.addEventListener('scroll', scroll, true);
    return () => {
      document.removeEventListener('mousedown', down);
      window.removeEventListener('scroll', scroll, true);
    };
  }, [anchor, onClose]);

  // Foco inicial en el elemento elegido (o el primero).
  useEffect(() => {
    const el = box.current?.querySelector<HTMLButtonElement>('.dp-grid [aria-pressed="true"]') ?? box.current?.querySelector<HTMLButtonElement>('.dp-grid button');
    el?.focus({ preventScroll: true });
  }, [view]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  };

  const rank: Record<DatePrecision, number> = { year: 0, month: 1, day: 2 };
  const changePrecision = (p: DatePrecision) => {
    setPrecision(p);
    // Más precisión que la fecha elegida: seguir desde lo que falta (el mes antes que el día).
    if (value && rank[p] > rank[precisionOf(value)]) setView(value.m === undefined ? 'months' : 'days');
    else setView(viewFor(p));
    // Menos precisión que la fecha elegida: se recorta enseguida (p. ej. 2021-03 → 2021).
    if (value && rank[p] < rank[precisionOf(value)]) onChange(toISO(value, p));
  };

  const pickYear = (year: number) => {
    setY(year);
    if (precision === 'year') onPick(toISO({ y: year }, 'year'));
    else setView('months');
  };
  const pickMonth = (month: number) => {
    setM(month);
    if (precision === 'month') onPick(toISO({ y, m: month }, 'month'));
    else setView('days');
  };
  const pickDay = (day: number) => onPick(toISO({ y, m, d: day }, 'day'));

  const months = monthNames(lang, 'short');
  const monthLong = monthNames(lang, 'long');
  const pageStart = Math.floor(y / 12) * 12;

  const nav = (dir: -1 | 1) => {
    if (view === 'years') setY(y + dir * 12);
    else if (view === 'months') setY(y + dir);
    else {
      const next = m + dir;
      if (next < 1) {
        setM(12);
        setY(y - 1);
      } else if (next > 12) {
        setM(1);
        setY(y + 1);
      } else setM(next);
    }
  };

  const title =
    view === 'years' ? `${pageStart} – ${pageStart + 11}` : view === 'months' ? String(y) : `${monthLong[m - 1]} ${y}`;

  return (
    <div
      ref={box}
      className="dp"
      role="dialog"
      aria-label={label}
      style={pos ? { top: pos.top, left: pos.left } : { visibility: 'hidden', top: 0, left: 0 }}
      onKeyDown={onKey}
    >
      <Segmented
        fill
        label={t('date.precision')}
        value={precision}
        onChange={changePrecision}
        options={[
          { value: 'year', label: t('date.year') },
          { value: 'month', label: t('date.month') },
          { value: 'day', label: t('date.day') },
        ]}
      />
      <div className="dp-head">
        <button type="button" className="icon-btn" aria-label={t('date.prev')} onClick={() => nav(-1)}>
          <span className="dp-flip">{Icon.chevron()}</span>
        </button>
        <button
          type="button"
          className="dp-title"
          disabled={view === 'years'}
          onClick={() => setView(view === 'days' ? 'months' : 'years')}
        >
          {title}
        </button>
        <button type="button" className="icon-btn" aria-label={t('date.next')} onClick={() => nav(1)}>
          {Icon.chevron()}
        </button>
      </div>

      {view === 'years' && (
        <div className="dp-grid dp-grid--3">
          {Array.from({ length: 12 }, (_, i) => pageStart + i).map((year) => (
            <button
              key={year}
              type="button"
              aria-pressed={value?.y === year}
              className={year === now.getFullYear() ? 'is-today' : undefined}
              onClick={() => pickYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      {view === 'months' && (
        <div className="dp-grid dp-grid--3">
          {months.map((name, i) => (
            <button
              key={name}
              type="button"
              aria-label={`${monthLong[i]} ${y}`}
              aria-pressed={value?.y === y && value?.m === i + 1}
              className={y === now.getFullYear() && i === now.getMonth() ? 'is-today' : undefined}
              onClick={() => pickMonth(i + 1)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {view === 'days' && <Days y={y} m={m} value={value} onPick={pickDay} />}

      <div className="dp-foot">
        <button type="button" className="btn btn--link" onClick={() => onPick('')}>
          {t('date.clear')}
        </button>
      </div>
    </div>
  );
}

function Days({ y, m, value, onPick }: { y: number; m: number; value: PartialDate | null; onPick: (d: number) => void }) {
  const { lang } = useT();
  const first = firstDayOfWeek(lang);
  const offset = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() - first + 7) % 7;
  const total = daysInMonth(y, m);
  const now = new Date();
  const isToday = (d: number) => now.getFullYear() === y && now.getMonth() + 1 === m && now.getDate() === d;
  const long = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' });
  return (
    <div className="dp-days">
      <div className="dp-week" aria-hidden="true">
        {weekdayNames(lang, first).map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="dp-grid dp-grid--7">
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: total }, (_, i) => i + 1).map((d) => (
          <button
            key={d}
            type="button"
            aria-label={long.format(new Date(Date.UTC(y, m - 1, d)))}
            aria-pressed={value?.y === y && value?.m === m && value?.d === d}
            className={isToday(d) ? 'is-today' : undefined}
            onClick={() => onPick(d)}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
