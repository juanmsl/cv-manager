import { useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from 'react';
import { useCv } from '../state';
import {
  COLOR_PRESETS,
  DEFAULT_COLORS,
  blankEducation,
  blankExperience,
  blankLanguage,
  blankLink,
  blankSkill,
  period,
} from '../sample';
import type { Experience } from '../types';
import { Area, Empty, Field, Icon } from '../components/ui';
import { EntryCard } from '../components/EntryCard';
import { useReorder } from '../components/Reorder';
import { useT } from '../i18n';

interface SectionProps {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

function Head({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return (
    <div className="center-head">
      <div>
        <h1 className="page-title">{title}</h1>
        <p>{sub}</p>
      </div>
      {action}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="btn" onClick={onClick}>
      {Icon.plus()}
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Foto y datos
// ---------------------------------------------------------------------------

/** Reduce la foto a 900 px como máximo para que el archivo guardado sea liviano. */
function readPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('imagen'));
      img.onload = () => {
        const max = 900;
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * k);
        canvas.height = Math.round(img.height * k);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function PersonalSection() {
  const { state, setData } = useCv();
  const { t } = useT();
  const d = state.data;
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState('');

  const load = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('photo.notImage'));
      return;
    }
    try {
      const dataUrl = await readPhoto(file);
      setData({ photo: { dataUrl, grayscale: d.photo?.grayscale ?? true, zoom: 1, offsetY: 0 } });
      setError('');
    } catch {
      setError(t('photo.readError'));
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    load(e.dataTransfer.files[0]);
  };

  const photo = d.photo;
  const setPhoto = (patch: Partial<NonNullable<typeof photo>>) => photo && setData({ photo: { ...photo, ...patch } });

  return (
    <>
      <Head title={t('section.personal')} sub={t('personal.sub')} />
      <div className="stack">
        <section className="panel">
          <h2 className="panel-title">{t('photo.title')}</h2>
          <div className="photo-editor">
            <button
              type="button"
              className={'photo-drop' + (photo ? ' has-photo' : '') + (over ? ' is-over' : '')}
              onClick={() => input.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={onDrop}
              aria-label={photo ? t('photo.change') : t('photo.choose')}
            >
              {photo ? (
                <img
                  src={photo.dataUrl}
                  alt=""
                  style={{
                    filter: photo.grayscale ? 'grayscale(1)' : undefined,
                    transform: `scale(${photo.zoom})`,
                    objectPosition: `50% ${50 + photo.offsetY}%`,
                  }}
                />
              ) : (
                <span>
                  {t('photo.drop1')}
                  <br />
                  {t('photo.drop2')}
                </span>
              )}
            </button>
            <input
              ref={input}
              type="file"
              accept="image/*"
              hidden
              onChange={(e: ChangeEvent<HTMLInputElement>) => load(e.target.files?.[0])}
            />
            <div className="photo-controls">
              {photo ? (
                <>
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={photo.grayscale}
                      onChange={(e) => setPhoto({ grayscale: e.target.checked })}
                    />
                    {t('photo.grayscale')}
                  </label>
                  <label className="field">
                    <span>{t('photo.zoom')}</span>
                    <input
                      type="range"
                      min={1}
                      max={2}
                      step={0.05}
                      value={photo.zoom}
                      onChange={(e) => setPhoto({ zoom: Number(e.target.value) })}
                    />
                  </label>
                  <label className="field">
                    <span>{t('photo.offset')}</span>
                    <input
                      type="range"
                      min={-50}
                      max={50}
                      value={photo.offsetY}
                      onChange={(e) => setPhoto({ offsetY: Number(e.target.value) })}
                    />
                  </label>
                  <div>
                    <button type="button" className="btn" onClick={() => input.current?.click()}>
                      {t('photo.changeBtn')}
                    </button>{' '}
                    <button type="button" className="btn btn--link btn--danger" onClick={() => setData({ photo: null })}>
                      {t('photo.remove')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="field-hint" style={{ margin: 0 }}>
                    {t('photo.hint')}
                  </p>
                  <div>
                    <button type="button" className="btn" onClick={() => input.current?.click()}>
                      {t('photo.chooseBtn')}
                    </button>
                  </div>
                </>
              )}
              {error && (
                <p className="field-hint" role="alert" style={{ color: 'var(--danger)', margin: 0 }}>
                  {error}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="panel">
          <h2 className="panel-title">{t('personal.nameTitle')}</h2>
          <div className="row">
            <Field label={t('field.firstName')} value={d.firstName} placeholder={t('ph.firstName')} onChange={(e) => setData({ firstName: e.target.value })} />
            <Field label={t('field.lastName')} value={d.lastName} placeholder={t('ph.lastName')} onChange={(e) => setData({ lastName: e.target.value })} />
          </div>
          <Field
            label={t('field.title')}
            value={d.title}
            placeholder={t('ph.title')}
            onChange={(e) => setData({ title: e.target.value })}
          />
        </section>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Perfil
// ---------------------------------------------------------------------------
export function ProfileSection() {
  const { state, setData } = useCv();
  const { t } = useT();
  const d = state.data;
  return (
    <>
      <Head title={t('section.profile')} sub={t('profile.sub')} />
      <div className="stack">
        <section className="panel">
          <Area
            label={t('field.profile')}
            rows={5}
            value={d.profile}
            placeholder={t('ph.profile')}
            hint={t('profile.hint', { n: d.profile.length })}
            onChange={(e) => setData({ profile: e.target.value })}
          />
          <Area
            label={t('field.note')}
            rows={2}
            value={d.note}
            placeholder={t('ph.note')}
            onChange={(e) => setData({ note: e.target.value })}
          />
        </section>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Contacto y redes
// ---------------------------------------------------------------------------
export function ContactSection() {
  const { state, setData, addItem, updateItem, removeItem } = useCv();
  const { t } = useT();
  const d = state.data;
  return (
    <>
      <Head title={t('section.contact')} sub={t('contact.sub')} />
      <div className="stack">
        <section className="panel">
          <div className="row">
            <Field label={t('field.email')} type="email" value={d.email} placeholder={t('ph.email')} onChange={(e) => setData({ email: e.target.value })} />
            <Field label={t('field.phone')} type="tel" value={d.phone} placeholder={t('ph.phone')} onChange={(e) => setData({ phone: e.target.value })} />
          </div>
          <Field label={t('field.city')} value={d.city} placeholder={t('ph.city')} onChange={(e) => setData({ city: e.target.value })} />
        </section>

        <section className="panel">
          <h2 className="panel-title">{t('links.title')}</h2>
          {d.links.length === 0 && <p className="field-hint" style={{ margin: 0 }}>{t('links.empty')}</p>}
          {d.links.map((l) => (
            <div className="row" key={l.id}>
              <Field label={t('field.network')} value={l.label} placeholder="LinkedIn" onChange={(e) => updateItem('links', l.id, { label: e.target.value })} />
              <Field label={t('field.handle')} value={l.value} placeholder={t('ph.handle')} onChange={(e) => updateItem('links', l.id, { value: e.target.value })} />
              <button
                type="button"
                className="icon-btn"
                style={{ flex: 'none', marginBottom: 2 }}
                aria-label={t('links.remove', { name: l.label || t('links.link') })}
                title={t('links.removeTitle')}
                onClick={() => removeItem('links', l.id)}
              >
                {Icon.x()}
              </button>
            </div>
          ))}
          <div>
            <AddButton label={t('links.add')} onClick={() => addItem('links', blankLink())} />
          </div>
        </section>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Experiencia
// ---------------------------------------------------------------------------
export function ExperienceSection({ activeId, setActiveId }: SectionProps) {
  const { state, addItem, updateItem, removeItem, moveItem } = useCv();
  const { t } = useT();
  const list = state.data.experience;
  const reorder = useReorder((a, b) => moveItem('experience', a, b));

  const add = () => {
    const e = blankExperience();
    addItem('experience', e);
    setActiveId(e.id);
  };
  const up = (id: string, patch: Partial<Experience>) => updateItem('experience', id, patch);

  return (
    <>
      <Head
        title={t('section.experience')}
        sub={list.length ? t('cards.drag', { count: t.n('cards', list.length) }) : t('exp.sub')}
        action={list.length > 0 && <AddButton label={t('card.new')} onClick={add} />}
      />
      {list.length === 0 ? (
        <Empty
          title={t('exp.emptyTitle')}
          text={t('exp.emptyText')}
          action={<AddButton label={t('card.new')} onClick={add} />}
        />
      ) : (
        <div className="stack">
          {list.map((e, i) => (
            <EntryCard
              key={e.id}
              index={i}
              total={list.length}
              open={activeId === e.id}
              onToggle={() => setActiveId(activeId === e.id ? null : e.id)}
              title={e.role}
              emptyTitle={t('exp.newRole')}
              subtitle={[e.company, e.city].filter(Boolean).join(' · ')}
              dates={period(e.start, e.end, e.current, t('cv.present'))}
              onMove={(a, b) => moveItem('experience', a, b)}
              onDelete={() => removeItem('experience', e.id)}
              reorder={reorder}
            >
              <div className="row">
                <Field label={t('field.role')} value={e.role} autoFocus={!e.role} onChange={(ev) => up(e.id, { role: ev.target.value })} />
                <Field label={t('field.company')} value={e.company} onChange={(ev) => up(e.id, { company: ev.target.value })} />
              </div>
              <div className="row">
                <Field label={t('field.start')} value={e.start} placeholder="2021" onChange={(ev) => up(e.id, { start: ev.target.value })} />
                <Field label={t('field.end')} value={e.current ? '' : e.end} placeholder={e.current ? t('ph.current') : '2023'} disabled={e.current} onChange={(ev) => up(e.id, { end: ev.target.value })} />
                <Field label={t('field.city')} value={e.city} onChange={(ev) => up(e.id, { city: ev.target.value })} />
              </div>
              <label className="check">
                <input type="checkbox" checked={e.current} onChange={(ev) => up(e.id, { current: ev.target.checked })} />
                {t('exp.current')}
              </label>
              <Area label={t('field.description')} rows={3} value={e.description} onChange={(ev) => up(e.id, { description: ev.target.value })} />
              <div className="field">
                <span>{t('exp.achievements')}</span>
                <div className="bullets">
                  {e.achievements.map((a, k) => (
                    <div className="bullet" key={k}>
                      <input
                        value={a}
                        aria-label={t('exp.achievement', { n: k + 1 })}
                        placeholder={t('ph.achievement')}
                        onChange={(ev) =>
                          up(e.id, { achievements: e.achievements.map((x, j) => (j === k ? ev.target.value : x)) })
                        }
                      />
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label={t('exp.removeAchievement', { n: k + 1 })}
                        title={t('exp.removeAchievementTitle')}
                        onClick={() => up(e.id, { achievements: e.achievements.filter((_, j) => j !== k) })}
                      >
                        {Icon.x()}
                      </button>
                    </div>
                  ))}
                  <div>
                    <button
                      type="button"
                      className="btn btn--link"
                      onClick={() => up(e.id, { achievements: [...e.achievements, ''] })}
                    >
                      {Icon.plus()} {t('exp.addAchievement')}
                    </button>
                  </div>
                </div>
              </div>
            </EntryCard>
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Educación
// ---------------------------------------------------------------------------
export function EducationSection({ activeId, setActiveId }: SectionProps) {
  const { state, addItem, updateItem, removeItem, moveItem } = useCv();
  const { t } = useT();
  const list = state.data.education;
  const reorder = useReorder((a, b) => moveItem('education', a, b));
  const add = () => {
    const e = blankEducation();
    addItem('education', e);
    setActiveId(e.id);
  };

  return (
    <>
      <Head
        title={t('section.education')}
        sub={list.length ? t('cards.drag', { count: t.n('cards', list.length) }) : t('edu.sub')}
        action={list.length > 0 && <AddButton label={t('card.new')} onClick={add} />}
      />
      {list.length === 0 ? (
        <Empty title={t('edu.emptyTitle')} text={t('edu.emptyText')} action={<AddButton label={t('card.new')} onClick={add} />} />
      ) : (
        <div className="stack">
          {list.map((e, i) => (
            <EntryCard
              key={e.id}
              index={i}
              total={list.length}
              open={activeId === e.id}
              onToggle={() => setActiveId(activeId === e.id ? null : e.id)}
              title={e.degree}
              emptyTitle={t('edu.new')}
              subtitle={e.institution}
              dates={period(e.start, e.end)}
              onMove={(a, b) => moveItem('education', a, b)}
              onDelete={() => removeItem('education', e.id)}
              reorder={reorder}
            >
              <div className="row">
                <Field label={t('field.degree')} value={e.degree} autoFocus={!e.degree} onChange={(ev) => updateItem('education', e.id, { degree: ev.target.value })} />
                <Field label={t('field.institution')} value={e.institution} onChange={(ev) => updateItem('education', e.id, { institution: ev.target.value })} />
              </div>
              <div className="row">
                <Field label={t('field.start')} value={e.start} placeholder="2012" onChange={(ev) => updateItem('education', e.id, { start: ev.target.value })} />
                <Field label={t('field.end')} value={e.end} placeholder="2017" onChange={(ev) => updateItem('education', e.id, { end: ev.target.value })} />
              </div>
              <Area label={t('field.descriptionOpt')} rows={2} value={e.description} onChange={(ev) => updateItem('education', e.id, { description: ev.target.value })} />
            </EntryCard>
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Habilidades e idiomas (filas con nivel)
// ---------------------------------------------------------------------------
export function SkillsSection() {
  const { state, addItem, updateItem, removeItem, moveItem } = useCv();
  const { t } = useT();
  const list = state.data.skills;
  const reorder = useReorder((a, b) => moveItem('skills', a, b));
  const add = () => addItem('skills', blankSkill());
  return (
    <>
      <Head
        title={t('section.skills')}
        sub={t('skills.sub')}
        action={list.length > 0 && <AddButton label={t('skills.add')} onClick={add} />}
      />
      {list.length === 0 ? (
        <Empty title={t('skills.emptyTitle')} text={t('skills.emptyText')} action={<AddButton label={t('skills.add')} onClick={add} />} />
      ) : (
        <div className="stack" style={{ gap: 8 }}>
          {list.map((s, i) => (
            <div key={s.id} className={'level-row' + reorder.cls(i)} {...reorder.itemProps(i)}>
              <span className="card-grip" title={t('common.dragToReorder')} {...reorder.gripProps(i)}>
                {Icon.grip()}
              </span>
              <input className="input" value={s.name} placeholder="Figma" aria-label={t('skills.skill')} autoFocus={!s.name} onChange={(e) => updateItem('skills', s.id, { name: e.target.value })} />
              <input type="range" min={0} max={100} step={5} value={s.level} aria-label={t('skills.levelOf', { name: s.name || t('skills.fallback') })} onChange={(e) => updateItem('skills', s.id, { level: Number(e.target.value) })} />
              <span className="level-value">{s.level} %</span>
              <button type="button" className="icon-btn" aria-label={t('links.remove', { name: s.name || t('skills.fallback') })} title={t('common.remove')} onClick={() => removeItem('skills', s.id)}>
                {Icon.x()}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export function LanguagesSection() {
  const { state, addItem, updateItem, removeItem, moveItem } = useCv();
  const { t } = useT();
  const list = state.data.languages;
  const reorder = useReorder((a, b) => moveItem('languages', a, b));
  const add = () => addItem('languages', blankLanguage());
  return (
    <>
      <Head title={t('section.languages')} sub={t('langs.sub')} action={list.length > 0 && <AddButton label={t('langs.add')} onClick={add} />} />
      {list.length === 0 ? (
        <Empty title={t('langs.emptyTitle')} text={t('langs.emptyText')} action={<AddButton label={t('langs.add')} onClick={add} />} />
      ) : (
        <div className="stack" style={{ gap: 8 }}>
          {list.map((l, i) => (
            <div key={l.id} className={'level-row level-row--lang' + reorder.cls(i)} {...reorder.itemProps(i)}>
              <span className="card-grip" title={t('common.dragToReorder')} {...reorder.gripProps(i)}>
                {Icon.grip()}
              </span>
              <input className="input" value={l.name} placeholder={t('ph.language')} aria-label={t('langs.language')} autoFocus={!l.name} onChange={(e) => updateItem('languages', l.id, { name: e.target.value })} />
              <input className="input" value={l.label} placeholder={t('ph.languageLevel')} aria-label={t('langs.levelWords')} onChange={(e) => updateItem('languages', l.id, { label: e.target.value })} />
              <input type="range" min={0} max={100} step={5} value={l.level} aria-label={t('skills.levelOf', { name: l.name || t('langs.fallback') })} onChange={(e) => updateItem('languages', l.id, { level: Number(e.target.value) })} />
              <span className="level-value">{l.level} %</span>
              <button type="button" className="icon-btn" aria-label={t('links.remove', { name: l.name || t('langs.fallback') })} title={t('common.remove')} onClick={() => removeItem('languages', l.id)}>
                {Icon.x()}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Colores (compartido con la vista Exportar)
// ---------------------------------------------------------------------------
export function ColorControls() {
  const { state, set } = useCv();
  const { t } = useT();
  const tpl = state.template;
  const c = state.colors[tpl];
  const setColor = (k: keyof typeof c, v: string) => set({ colors: { ...state.colors, [tpl]: { ...c, [k]: v } } });
  const rows: [keyof typeof c, string][] = [
    ['primary', t('colors.primary')],
    ['text', t('colors.text')],
    ['accent', t('colors.accent')],
  ];
  return (
    <>
      {rows.map(([k, label]) => (
        <div className="swatch-row" key={k}>
          <span className="swatch" style={{ background: c[k] }}>
            <input type="color" value={c[k]} aria-label={t('colors.colorOf', { name: label.toLowerCase() })} onChange={(e) => setColor(k, e.target.value)} />
          </span>
          <label>{label}</label>
          <span className="hex">{c[k]}</span>
        </div>
      ))}
      <div className="presets" role="group" aria-label={t('colors.presets')}>
        {COLOR_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className="preset"
            style={{ background: p }}
            aria-label={t('colors.usePreset', { hex: p })}
            aria-pressed={c.primary.toLowerCase() === p.toLowerCase()}
            onClick={() => setColor('primary', p)}
          />
        ))}
      </div>
      <div>
        <button type="button" className="btn btn--link" onClick={() => set({ colors: { ...state.colors, [tpl]: { ...DEFAULT_COLORS[tpl] } } })}>
          {t('colors.reset')}
        </button>
      </div>
    </>
  );
}

export function ColorsSection() {
  const { t } = useT();
  return (
    <>
      <Head title={t('section.colors')} sub={t('colors.sub')} />
      <section className="panel" style={{ maxWidth: 420 }}>
        <ColorControls />
      </section>
    </>
  );
}
