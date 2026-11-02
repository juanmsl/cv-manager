import { period } from '../sample';
import { CvPhoto, hl, type TemplateProps } from './shared';

export function Columna({ data: d, highlightId, t }: TemplateProps) {
  const contact = [
    [t('cv.email'), d.email],
    [t('cv.phone'), d.phone],
    [t('cv.city'), d.city],
  ].filter(([, v]) => v);

  return (
    <div className="col-grid">
      <aside className="col-side">
        <CvPhoto data={d} className="col-photo" />
        <div className="col-side-body">
          {(d.firstName || d.lastName) && (
            <h1 className="col-name">
              {d.firstName}
              {d.lastName && <br />}
              {d.lastName}
            </h1>
          )}
          {d.title && <p className="col-title">{d.title}</p>}
          {(d.firstName || d.lastName || d.title) && <hr className="col-rule col-rule--wide" />}
          {d.links.length > 0 && (
            <ul className="col-links">
              {d.links.map((l) => (
                <li key={l.id}>{l.value}</li>
              ))}
            </ul>
          )}

          {contact.length > 0 && (
            <section className="col-side-sec">
              <h2>{t('cv.contact')}</h2>
              <hr className="col-rule" />
              <dl>
                {contact.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {d.languages.length > 0 && (
            <section className="col-side-sec">
              <h2>{t('cv.languages')}</h2>
              <hr className="col-rule" />
              <ul className="col-bars">
                {d.languages.map((l) => (
                  <li key={l.id}>
                    <span>{l.name}</span>
                    <i>
                      <b style={{ width: `${l.level}%` }} />
                    </i>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>

      <main className="col-main">
        {d.profile && (
          <section>
            <h2 className="col-h">{t('cv.profile')}</h2>
            <p className="col-profile">{d.profile}</p>
          </section>
        )}

        {d.experience.length > 0 && (
          <section>
            <h2 className="col-h">{t('cv.experience')}</h2>
            {d.experience.map((e) => (
              <article key={e.id} className={'col-row' + hl(e.id, highlightId)}>
                <div className="col-row-meta">
                  <strong>{e.role}</strong>
                  <span>{period(e.start, e.end, e.current, t('cv.present'))}</span>
                  <span>{e.company}</span>
                </div>
                <div className="col-row-desc">
                  {e.description && <p>{e.description}</p>}
                  {e.achievements.filter(Boolean).length > 0 && (
                    <ul>
                      {e.achievements.filter(Boolean).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        {d.education.length > 0 && (
          <section>
            <h2 className="col-h">{t('cv.education')}</h2>
            {d.education.map((e) => (
              <article key={e.id} className={'col-row' + hl(e.id, highlightId)}>
                <div className="col-row-meta">
                  <strong>{e.institution}</strong>
                  <span>{period(e.start, e.end)}</span>
                  <span>{e.degree}</span>
                </div>
                <div className="col-row-desc">{e.description && <p>{e.description}</p>}</div>
              </article>
            ))}
          </section>
        )}

        {d.skills.length > 0 && (
          <section>
            <h2 className="col-h">{t('cv.expertise')}</h2>
            <ul className="col-skills">
              {d.skills.map((s) => (
                <li key={s.id}>
                  <span>{s.name}</span>
                  <i>
                    <b style={{ width: `${s.level}%` }} />
                  </i>
                </li>
              ))}
            </ul>
          </section>
        )}

        {d.note && (
          <section>
            <h2 className="col-h">{t('cv.note')}</h2>
            <p className="col-profile">{d.note}</p>
          </section>
        )}
      </main>
    </div>
  );
}
