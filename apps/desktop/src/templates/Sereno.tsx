import type { ReactNode } from 'react';
import { PiBriefcaseFill, PiGraduationCapFill, PiInfoFill, PiTargetBold } from 'react-icons/pi';
import { period } from '../sample';
import { CvPhoto, hl, type TemplateProps } from './shared';
import { Achievements, contactItems, linkItems } from './parts';
import './Sereno.css';

/** 10 · Sereno: columna clara con foto redonda, nombre caligráfico e insignias en los títulos. */
export function Sereno({ data: d, highlightId, t }: TemplateProps) {
  const contact = [...contactItems(d, t), ...linkItems(d)];

  return (
    <div className="ser">
      <aside className="ser-side">
        <div className="ser-photo-wrap">
          <CvPhoto data={d} className="ser-photo" />
        </div>

        {contact.length > 0 && (
          <section className="ser-sec">
            <h2 className="ser-side-h">{t('cv.contact')}</h2>
            <ul className="ser-contact">
              {contact.map((c) => (
                <li key={c.id}>
                  <i>{c.icon}</i>
                  <span>{c.value}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {d.skills.length > 0 && (
          <section className="ser-sec">
            <h2 className="ser-side-h">{t('cv.skills')}</h2>
            <ul className="ser-bullets">
              {d.skills.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </section>
        )}

        {d.languages.length > 0 && (
          <section className="ser-sec">
            <h2 className="ser-side-h">{t('cv.languages')}</h2>
            <ul className="ser-bars">
              {d.languages.map((l) => (
                <li key={l.id}>
                  <span>{l.name}</span>
                  <i>
                    <b style={{ width: `${l.level}%` }} />
                  </i>
                  <em>{l.level}%</em>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      <main className="ser-main">
        <header className="ser-head">
          {(d.firstName || d.lastName) && <h1>{[d.firstName, d.lastName].filter(Boolean).join(' ')}</h1>}
          {d.title && <p>{d.title}</p>}
        </header>

        {d.profile && (
          <Section icon={<PiTargetBold />} title={t('cv.profile')}>
            <p className="ser-text">{d.profile}</p>
          </Section>
        )}

        {d.education.length > 0 && (
          <Section icon={<PiGraduationCapFill />} title={t('cv.education')}>
            <div className="ser-timeline">
              {d.education.map((e) => (
                <article key={e.id} className={'ser-item' + hl(e.id, highlightId)}>
                  <div className="ser-item-head">
                    <h3>{e.degree}</h3>
                    <span>{period(e.start, e.end)}</span>
                  </div>
                  {e.institution && <p className="ser-place">{e.institution}</p>}
                  {e.description && <p className="ser-text">{e.description}</p>}
                </article>
              ))}
            </div>
          </Section>
        )}

        {d.experience.length > 0 && (
          <Section icon={<PiBriefcaseFill />} title={t('cv.experience')}>
            <div className="ser-timeline">
              {d.experience.map((e) => (
                <article key={e.id} className={'ser-item' + hl(e.id, highlightId)}>
                  <div className="ser-item-head">
                    <h3>{e.role}</h3>
                    <span>{period(e.start, e.end, e.current, t('cv.present'))}</span>
                  </div>
                  {(e.company || e.city) && <p className="ser-place">{[e.company, e.city].filter(Boolean).join(', ')}</p>}
                  {e.description && <p className="ser-text">{e.description}</p>}
                  <Achievements items={e.achievements} className="ser-text ser-list" />
                </article>
              ))}
            </div>
          </Section>
        )}

        {d.note && (
          <Section icon={<PiInfoFill />} title={t('cv.note')}>
            <p className="ser-text">{d.note}</p>
          </Section>
        )}
      </main>
    </div>
  );
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="ser-block">
      <h2 className="ser-h">
        <i>{icon}</i>
        <span>{title}</span>
      </h2>
      {children}
    </section>
  );
}
