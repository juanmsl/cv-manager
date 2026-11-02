import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';

// Iconos dibujados a mano en un solo trazo (1.5) para mantener coherencia.
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
export const Icon = {
  plus: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5v9M1.5 6h9" {...P} /></svg>
  ),
  check: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3l2.2 2.2L9.5 3.6" {...P} strokeWidth={1.7} /></svg>
  ),
  x: (s = 10) => (
    <svg width={s} height={s} viewBox="0 0 10 10" aria-hidden="true"><path d="M2 2l6 6M8 2 2 8" {...P} strokeWidth={1.4} /></svg>
  ),
  chevron: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 12 12" aria-hidden="true"><path d="M4.5 2.5 8 6l-3.5 3.5" {...P} /></svg>
  ),
  up: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 12 12" aria-hidden="true"><path d="M6 9.5v-7M3 5.5l3-3 3 3" {...P} /></svg>
  ),
  down: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 12 12" aria-hidden="true"><path d="M6 2.5v7M3 6.5l3 3 3-3" {...P} /></svg>
  ),
  grip: () => (
    <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true" fill="currentColor">
      <circle cx="2.5" cy="3" r="1.3" /><circle cx="7.5" cy="3" r="1.3" />
      <circle cx="2.5" cy="8" r="1.3" /><circle cx="7.5" cy="8" r="1.3" />
      <circle cx="2.5" cy="13" r="1.3" /><circle cx="7.5" cy="13" r="1.3" />
    </svg>
  ),
  alert: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.75" {...P} /><path d="M6 3.6v2.8M6 8.3v.1" {...P} /></svg>
  ),
};

type FieldProps = { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>;
export function Field({ label, hint, ...input }: FieldProps) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...input} />
      {hint && <em className="field-hint">{hint}</em>}
    </label>
  );
}

type AreaProps = { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Area({ label, hint, ...area }: AreaProps) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <textarea id={id} {...area} />
      {hint && <em className="field-hint">{hint}</em>}
    </label>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  fill,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  fill?: boolean;
}) {
  return (
    <div className={'segmented' + (fill ? ' segmented--fill' : '')} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Empty({ title, text, action }: { title: string; text: string; action: ReactNode }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      <p>{text}</p>
      {action}
    </div>
  );
}
