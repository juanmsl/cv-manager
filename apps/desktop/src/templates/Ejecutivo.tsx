import type { ReactNode } from 'react';
import { period } from '../sample';
import { hl, type TemplateProps, dateFormat, Rich } from './shared';
import { Achievements, contactItems } from './parts';
import './Ejecutivo.css';

/** 6 · Ejecutivo: nombre grande, pestaña oscura de contacto y filete vertical. */
export function Ejecutivo({ data: d, highlightId, t }: TemplateProps) {
  // Fechas: estilo 'numeric' (ver dates.ts)
  const F = dateFormat(t, 'numeric');
  const contact = contactItems(d, t);
  const links = d.links.filter((l) => l.value);

  return (
    <div className="eje">
      <div className="eje-grid">
        <main className="eje-main">
          {(d.firstName || d.lastName) && (
            <h1 className="eje-name">
              {d.firstName}
              {d.lastName && <br />}
              {d.lastName}
            </h1>
          )}
          {d.title && <p className="eje-title">{d.title}</p>}

          {d.profile && (
            <Section title={t('cv.profile')}>
              <Rich text={d.profile} className="eje-text" />
            </Section>
          )}

          {d.experience.length > 0 && (
            <Section title={t('cv.experience')}>
              {d.experience.map((e) => (
                <article key={e.id} className={'eje-job' + hl(e.id, highlightId)}>
                  <div className="eje-job-head">
                    <h3>{e.role}</h3>
                    <span>{period(e.start, e.end, e.current, t('cv.present'), F)}</span>
                  </div>
                  <p className="eje-job-place">{[e.company, e.city].filter(Boolean).join(' / ')}</p>
                  {e.description && <Rich text={e.description} className="eje-text" />}
                  <Achievements items={e.achievements} className="eje-text eje-bullets" />
                </article>
              ))}
            </Section>
          )}

          {d.note && (
            <Section title={t('cv.note')}>
              <Rich text={d.note} className="eje-text" />
            </Section>
          )}
        </main>

        {contact.length > 0 && (
          <ul className="eje-contact">
            {contact.map((c) => (
              <li key={c.id}>
                <i>{c.icon}</i>
                <div>
                  <strong>{c.label}</strong>
                  <span>{c.value}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="eje-line" aria-hidden="true" />

        <aside className="eje-side">
          {d.education.length > 0 && (
            <Section title={t('cv.education')}>
              {d.education.map((e) => (
                <article key={e.id} className={'eje-edu' + hl(e.id, highlightId)}>
                  <h3>{e.degree}</h3>
                  <p>{[e.institution, period(e.start, e.end, false, '', F)].filter(Boolean).join(' | ')}</p>
                </article>
              ))}
            </Section>
          )}
          {d.skills.length > 0 && (
            <Section title={t('cv.expertise')}>
              <ul className="eje-bullets eje-list">
                {d.skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </Section>
          )}
          {d.languages.length > 0 && (
            <Section title={t('cv.languages')}>
              {d.languages.map((l) => (
                <p key={l.id} className="eje-lang">
                  <strong>{l.name}</strong>
                  {l.label && <span>{l.label}</span>}
                </p>
              ))}
            </Section>
          )}
        </aside>
      </div>

      {links.length > 0 && (
        <footer className="eje-foot">
          {links.map((l) => (
            <span key={l.id}>
              {l.label && <strong>{l.label}: </strong>}
              {l.value}
            </span>
          ))}
        </footer>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="eje-sec">
      <h2 className="eje-h">{title}</h2>
      {children}
    </section>
  );
}
