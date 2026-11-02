import type { ReactNode } from 'react';
import { period } from '../sample';
import { CvPhoto, hl, type TemplateProps } from './shared';
import { Achievements, contactItems, linkItems } from './parts';
import './Marco.css';

/** 5 · Marco clásico: página enmarcada, nombre sobre el filete y filas en tres columnas. */
export function Marco({ data: d, highlightId, t }: TemplateProps) {
  const contact = [...contactItems(d, t), ...linkItems(d)];

  return (
    <div className="mar">
      <div className="mar-frame">
        <header className="mar-head">
          <div className="mar-id">
            {(d.firstName || d.lastName) && (
              <h1>
                {d.firstName && <span>{d.firstName}</span>}
                {d.lastName && <span>{d.lastName}</span>}
              </h1>
            )}
            {d.title && <p className="mar-title">{d.title}</p>}
          </div>
          {d.photo && <CvPhoto data={d} className="mar-photo" />}
        </header>

        {contact.length > 0 && (
          <ul className="mar-contact">
            {contact.map((c) => (
              <li key={c.id}>
                <i>{c.icon}</i>
                {c.value}
              </li>
            ))}
          </ul>
        )}

        {d.profile && (
          <section className="mar-sec">
            <Heading>{t('cv.profile')}</Heading>
            <p className="mar-text">{d.profile}</p>
          </section>
        )}

        {d.experience.length > 0 && (
          <section className="mar-sec">
            <Heading>{t('cv.experience')}</Heading>
            {d.experience.map((e) => (
              <article key={e.id} className={'mar-row' + hl(e.id, highlightId)}>
                <div className="mar-meta">
                  <strong>{e.company}</strong>
                  {e.city && <span>{e.city}</span>}
                </div>
                <div className="mar-what">
                  <strong>{e.role}</strong>
                  <span>{period(e.start, e.end, e.current, t('cv.present'))}</span>
                </div>
                <div className="mar-text">
                  {e.description && <p className="mar-dot">{e.description}</p>}
                  <Achievements items={e.achievements} className="mar-dots" />
                </div>
              </article>
            ))}
          </section>
        )}

        {d.education.length > 0 && (
          <section className="mar-sec">
            <Heading>{t('cv.education')}</Heading>
            {d.education.map((e) => (
              <article key={e.id} className={'mar-row' + hl(e.id, highlightId)}>
                <div className="mar-meta">
                  <strong>{e.degree}</strong>
                </div>
                <div className="mar-what">
                  <strong>{e.institution}</strong>
                  <span>{period(e.start, e.end)}</span>
                </div>
                <div className="mar-text">{e.description && <p className="mar-dot">{e.description}</p>}</div>
              </article>
            ))}
          </section>
        )}

        {(d.skills.length > 0 || d.languages.length > 0) && (
          <div className="mar-pair">
            {d.skills.length > 0 && (
              <section className="mar-sec">
                <Heading>{t('cv.skills')}</Heading>
                <div className="mar-row mar-row--two">
                  <div className="mar-meta">
                    <strong>{t('cv.professional')}</strong>
                  </div>
                  <ul className="mar-dots">
                    {d.skills.map((s) => (
                      <li key={s.id}>{s.name}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}
            {d.languages.length > 0 && (
              <section className="mar-sec">
                <Heading>{t('cv.languages')}</Heading>
                {d.languages.map((l) => (
                  <div key={l.id} className="mar-row mar-row--two">
                    <div className="mar-meta">
                      <strong>{l.name}</strong>
                    </div>
                    <div className="mar-what">
                      <span>{l.label}</span>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        )}

        {d.note && (
          <section className="mar-sec">
            <Heading>{t('cv.note')}</Heading>
            <p className="mar-text">{d.note}</p>
          </section>
        )}
      </div>
    </div>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return (
    <div className="mar-h">
      <i />
      <h2>{children}</h2>
    </div>
  );
}
