import type { ReactNode } from 'react';
import { period } from '../sample';
import { hl, type TemplateProps } from './shared';
import { Achievements, linkItems } from './parts';
import './Panel.css';

/** 9 · Panel gris: columna lateral gris, franja de perfil y años en cápsulas verticales. */
export function Panel({ data: d, highlightId, t }: TemplateProps) {
  const contact = [
    d.phone && ['P', d.phone],
    d.email && ['E', d.email],
    ...linkItems(d).map((l) => ['W', l.value]),
    d.city && ['A', d.city],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="pan">
      <header className="pan-head">
        <div className="pan-id">
          {(d.firstName || d.lastName) && <h1>{[d.firstName, d.lastName].filter(Boolean).join(' ')}</h1>}
          {d.title && <p>{d.title}</p>}
        </div>
        <div className="pan-head-side" />
      </header>

      {d.profile && (
        <section className="pan-band">
          <h2 className="pan-h">{t('cv.profile')}</h2>
          <p className="pan-text">{d.profile}</p>
        </section>
      )}

      <div className="pan-cols">
        <main className="pan-main">
          {d.experience.length > 0 && (
            <Section title={t('cv.experience')}>
              <div className="pan-timeline">
                {d.experience.map((e) => (
                  <article key={e.id} className={'pan-job' + hl(e.id, highlightId)}>
                    <div className="pan-when">
                      {(e.start || e.end || e.current) && <span>{period(e.start, e.end, e.current, t('cv.today'))}</span>}
                    </div>
                    <div className="pan-job-body">
                      <h3>{e.role}</h3>
                      {(e.company || e.city) && <p className="pan-place">{[e.company, e.city].filter(Boolean).join('  |  ')}</p>}
                      {e.description && <p className="pan-text">{e.description}</p>}
                      <Achievements items={e.achievements} className="pan-text pan-list" />
                    </div>
                  </article>
                ))}
              </div>
            </Section>
          )}
          {d.note && (
            <Section title={t('cv.note')}>
              <p className="pan-text">{d.note}</p>
            </Section>
          )}
        </main>

        <aside className="pan-side">
          {contact.length > 0 && (
            <Section title={t('cv.contact')}>
              <ul className="pan-contact">
                {contact.map(([k, v], i) => (
                  <li key={i}>
                    <b>{k} :</b> {v}
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {d.skills.length > 0 && (
            <Section title={t('cv.skills')}>
              <Bars items={d.skills.map((s) => ({ id: s.id, name: s.name, level: s.level }))} />
            </Section>
          )}
          {d.languages.length > 0 && (
            <Section title={t('cv.languages')}>
              <Bars items={d.languages.map((l) => ({ id: l.id, name: l.label ? `${l.name} · ${l.label}` : l.name, level: l.level }))} />
            </Section>
          )}
          {d.education.length > 0 && (
            <Section title={t('cv.education')}>
              {d.education.map((e) => (
                <article key={e.id} className={'pan-edu' + hl(e.id, highlightId)}>
                  {(e.start || e.end) && <span>{period(e.start, e.end)}</span>}
                  <h3>{e.degree}</h3>
                  <p>{e.institution}</p>
                </article>
              ))}
            </Section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="pan-sec">
      <h2 className="pan-h">{title}</h2>
      {children}
    </section>
  );
}

function Bars({ items }: { items: { id: string; name: string; level: number }[] }) {
  return (
    <ul className="pan-bars">
      {items.map((s) => (
        <li key={s.id}>
          <span>{s.name}</span>
          <i>
            <b style={{ width: `${s.level}%` }} />
          </i>
        </li>
      ))}
    </ul>
  );
}
