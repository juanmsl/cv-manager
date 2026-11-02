import { period } from '../sample';
import { hl, type TemplateProps } from './shared';
import { Achievements, contactItems, linkItems } from './parts';
import './Lineal.css';

/** 4 · Línea fina: nombre espaciado, filete vertical y dos columnas sobrias. */
export function Lineal({ data: d, highlightId, t }: TemplateProps) {
  const contact = [...contactItems(d, t), ...linkItems(d)];

  return (
    <div className="lin">
      {(d.firstName || d.lastName) && (
        <header className="lin-head">
          <h1>
            {d.firstName && <span className="lin-first">{d.firstName}</span>}
            {d.lastName && <span className="lin-last">{d.lastName}</span>}
          </h1>
        </header>
      )}

      <div className="lin-band">
        <div className="lin-title">{d.title && <span>{d.title}</span>}</div>
        {contact.length > 0 && (
          <ul className="lin-contact">
            {contact.map((c) => (
              <li key={c.id}>
                <i>{c.icon}</i>
                <span>{c.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lin-body">
        {d.profile && (
          <section className="lin-sec">
            <h2 className="lin-h">{t('cv.profile')}</h2>
            <p className="lin-text">{d.profile}</p>
          </section>
        )}

        <div className="lin-cols">
          <main>
            {d.experience.length > 0 && (
              <section className="lin-sec">
                <h2 className="lin-h">{t('cv.experience')}</h2>
                {d.experience.map((e) => (
                  <article key={e.id} className={'lin-job' + hl(e.id, highlightId)}>
                    <h3>{e.company}</h3>
                    <p className="lin-meta">
                      {e.role}
                      {(e.start || e.end || e.current) && <> &nbsp;|&nbsp; {period(e.start, e.end, e.current, t('cv.present'))}</>}
                      {e.city && <> &nbsp;·&nbsp; {e.city}</>}
                    </p>
                    {e.description && <p className="lin-text">{e.description}</p>}
                    <Achievements items={e.achievements} className="lin-text lin-list" />
                  </article>
                ))}
              </section>
            )}
            {d.note && (
              <section className="lin-sec">
                <h2 className="lin-h">{t('cv.note')}</h2>
                <p className="lin-text">{d.note}</p>
              </section>
            )}
          </main>

          <aside>
            {d.skills.length > 0 && (
              <section className="lin-sec">
                <h2 className="lin-h">{t('cv.skills')}</h2>
                <h3 className="lin-sub">{t('cv.professional')}</h3>
                <ul className="lin-bullets">
                  {d.skills.map((s) => (
                    <li key={s.id}>{s.name}</li>
                  ))}
                </ul>
              </section>
            )}
            {d.languages.length > 0 && (
              <section className="lin-sec">
                <h3 className="lin-sub">{t('cv.languages')}</h3>
                <ul className="lin-bullets">
                  {d.languages.map((l) => (
                    <li key={l.id}>
                      {l.name}
                      {l.label && <em> · {l.label}</em>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {d.education.length > 0 && (
              <section className="lin-sec">
                <h2 className="lin-h">{t('cv.education')}</h2>
                <div className="lin-edu">
                  {d.education.map((e) => (
                    <article key={e.id} className={'lin-edu-item' + hl(e.id, highlightId)}>
                      <h3>{e.degree}</h3>
                      <p>
                        {e.institution}
                        {(e.start || e.end) && <> &nbsp;|&nbsp; {period(e.start, e.end)}</>}
                      </p>
                      {e.description && <p className="lin-edu-desc">{e.description}</p>}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
