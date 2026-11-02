import type { ReactNode } from 'react';
import { PiBookOpenText, PiBriefcase, PiGlobeSimple, PiNotePencil, PiSparkle, PiUser } from 'react-icons/pi';
import { period } from '../sample';
import { hl, type TemplateProps } from './shared';
import { Achievements, contactItems, linkItems } from './parts';
import './Tarjetas.css';

/** 7 · Tarjetas suaves: fondo degradado y secciones en tarjetas blancas. */
export function Tarjetas({ data: d, highlightId, t }: TemplateProps) {
  const contact = [...contactItems(d, t), ...linkItems(d)];

  return (
    <div className="tar">
      <header className="tar-card tar-head">
        <div>
          {(d.firstName || d.lastName) && <h1>{[d.firstName, d.lastName].filter(Boolean).join(' ')}</h1>}
          {d.title && <p className="tar-title">{d.title}</p>}
        </div>
        {contact.length > 0 && (
          <ul className="tar-contact">
            {contact.map((c) => (
              <li key={c.id}>{c.value}</li>
            ))}
          </ul>
        )}
      </header>

      <div className="tar-cols">
        <div className="tar-col">
          {d.profile && (
            <Card icon={<PiUser />} title={t('cv.aboutMe')}>
              <p className="tar-text">{d.profile}</p>
            </Card>
          )}
          {d.experience.length > 0 && (
            <Card icon={<PiBriefcase />} title={t('cv.experience')}>
              <div className="tar-timeline">
                {d.experience.map((e) => (
                  <article key={e.id} className={'tar-job' + hl(e.id, highlightId)}>
                    <div className="tar-job-head">
                      <h3>{e.role}</h3>
                      {(e.start || e.end || e.current) && <span className="tar-pill">{period(e.start, e.end, e.current, t('cv.present'))}</span>}
                    </div>
                    <p className="tar-company">{[e.company, e.city].filter(Boolean).join(' · ')}</p>
                    {e.description && <p className="tar-text">{e.description}</p>}
                    <Achievements items={e.achievements} className="tar-text tar-bullets" />
                  </article>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="tar-col">
          {d.skills.length > 0 && (
            <Card icon={<PiSparkle />} title={t('cv.skills')}>
              <ul className="tar-chips">
                {d.skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </Card>
          )}
          {d.education.length > 0 && (
            <Card icon={<PiBookOpenText />} title={t('cv.education')}>
              {d.education.map((e) => (
                <article key={e.id} className={'tar-edu' + hl(e.id, highlightId)}>
                  <h3>{e.degree}</h3>
                  <p>{e.institution}</p>
                  {(e.start || e.end) && <strong>{period(e.start, e.end)}</strong>}
                </article>
              ))}
            </Card>
          )}
          {d.languages.length > 0 && (
            <Card icon={<PiGlobeSimple />} title={t('cv.languages')}>
              {d.languages.map((l) => (
                <p key={l.id} className="tar-lang">
                  <strong>{l.name}</strong>
                  {l.label && <>: {l.label}</>}
                </p>
              ))}
            </Card>
          )}
          {d.note && (
            <Card icon={<PiNotePencil />} title={t('cv.note')}>
              <p className="tar-text">{d.note}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="tar-card">
      <h2 className="tar-h">
        <i>{icon}</i>
        {title}
      </h2>
      {children}
    </section>
  );
}
