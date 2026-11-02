import type { ReactNode } from 'react';
import { period } from '../sample';
import { CvPhoto, hl, type TemplateProps } from './shared';
import { Achievements, contactItems, linkItems } from './parts';
import './Boutique.css';

/** 8 · Boutique: hoja sobre fondo de dos tonos, foto redonda y líneas de tiempo con años. */
export function Boutique({ data: d, highlightId, t }: TemplateProps) {
  const contact = [...contactItems(d, t), ...linkItems(d)];

  return (
    <div className="bou">
      <div className="bou-sheet">
        <aside className="bou-side">
          {(d.firstName || d.lastName) && <h1 className="bou-name">{[d.firstName, d.lastName].filter(Boolean).join(' ')}</h1>}
          {d.title && <p className="bou-title">{d.title}</p>}
          <CvPhoto data={d} className="bou-photo" />

          {contact.length > 0 && (
            <Section title={t('cv.contact')}>
              <ul className="bou-contact">
                {contact.map((c) => (
                  <li key={c.id}>
                    <i>{c.icon}</i>
                    <span>{c.value}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {d.profile && <p className="bou-text bou-profile">{d.profile}</p>}

          {(d.skills.length > 0 || d.languages.length > 0) && (
            <Section title={t('cv.skills')}>
              <div className="bou-skills">
                {d.skills.length > 0 && (
                  <div>
                    <h3>{t('cv.professional')}</h3>
                    <ul>
                      {d.skills.map((s) => (
                        <li key={s.id}>{s.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {d.languages.length > 0 && (
                  <div>
                    <h3>{t('cv.languages')}</h3>
                    <ul>
                      {d.languages.map((l) => (
                        <li key={l.id}>
                          {l.name}
                          {l.label && <em> · {l.label}</em>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Section>
          )}
        </aside>

        <main className="bou-main">
          {d.education.length > 0 && (
            <Section title={t('cv.education')}>
              {d.education.map((e) => (
                <article key={e.id} className={'bou-item' + hl(e.id, highlightId)}>
                  <Years start={e.start} end={e.end} />
                  <div className="bou-body">
                    <h3>{e.degree}</h3>
                    {e.institution && <p className="bou-place">{e.institution}</p>}
                    {e.description && <p className="bou-text">{e.description}</p>}
                  </div>
                </article>
              ))}
            </Section>
          )}

          {d.experience.length > 0 && (
            <Section title={t('cv.experience')}>
              {d.experience.map((e) => (
                <article key={e.id} className={'bou-item' + hl(e.id, highlightId)}>
                  <Years start={e.start} end={e.current ? t('cv.today') : e.end} />
                  <div className="bou-body">
                    <h3>{e.role}</h3>
                    {(e.company || e.city) && <p className="bou-place">{[e.company, e.city].filter(Boolean).join(', ')}</p>}
                    {e.description && <p className="bou-text">{e.description}</p>}
                    <Achievements items={e.achievements} className="bou-text bou-list" />
                  </div>
                </article>
              ))}
            </Section>
          )}

          {d.note && (
            <Section title={t('cv.note')}>
              <p className="bou-text">{d.note}</p>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bou-sec">
      <h2 className="bou-h">{title}</h2>
      {children}
    </section>
  );
}

function Years({ start, end }: { start: string; end: string }) {
  const one = period(start, end);
  return (
    <div className="bou-years">
      {start && end && start !== end ? (
        <>
          <span>{start}</span>
          <i>-</i>
          <span>{end}</span>
        </>
      ) : (
        <span>{one}</span>
      )}
    </div>
  );
}
