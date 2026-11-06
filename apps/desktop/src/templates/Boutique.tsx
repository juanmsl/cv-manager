import type { ReactNode } from 'react';
import { period } from '../sample';
import { CvPhoto, hl, type TemplateProps, dateFormat, Rich } from './shared';
import { formatDate, type DateFormat } from '../dates';
import { Achievements, contactItems, linkItems } from './parts';
import './Boutique.css';

/** 8 · Boutique: hoja sobre fondo de dos tonos, foto redonda y líneas de tiempo con años. */
export function Boutique({ data: d, highlightId, t }: TemplateProps) {
  // Fechas: estilo 'year' (ver dates.ts)
  const F = dateFormat(t, 'year');
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

          {d.profile && <Rich text={d.profile} className="bou-text bou-profile" />}

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
                  <Years start={e.start} end={e.end} format={F} />
                  <div className="bou-body">
                    <h3>{e.degree}</h3>
                    {e.institution && <p className="bou-place">{e.institution}</p>}
                    {e.description && <Rich text={e.description} className="bou-text" />}
                  </div>
                </article>
              ))}
            </Section>
          )}

          {d.experience.length > 0 && (
            <Section title={t('cv.experience')}>
              {d.experience.map((e) => (
                <article key={e.id} className={'bou-item' + hl(e.id, highlightId)}>
                  <Years start={e.start} end={e.end} current={e.current} present={t('cv.today')} format={F} />
                  <div className="bou-body">
                    <h3>{e.role}</h3>
                    {(e.company || e.city) && <p className="bou-place">{[e.company, e.city].filter(Boolean).join(', ')}</p>}
                    {e.description && <Rich text={e.description} className="bou-text" />}
                    <Achievements items={e.achievements} className="bou-text bou-list" />
                  </div>
                </article>
              ))}
            </Section>
          )}

          {d.note && (
            <Section title={t('cv.note')}>
              <Rich text={d.note} className="bou-text" />
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

function Years({ start, end, current = false, present = '', format }: { start: string; end: string; current?: boolean; present?: string; format: DateFormat }) {
  const s = start ? formatDate(start, format.lang, format.style) : '';
  const e = current ? present : end ? formatDate(end, format.lang, format.style) : '';
  return (
    <div className="bou-years">
      {s && e && s !== e ? (
        <>
          <span>{s}</span>
          <i>-</i>
          <span>{e}</span>
        </>
      ) : (
        <span>{period(start, end, current, present, format)}</span>
      )}
    </div>
  );
}
