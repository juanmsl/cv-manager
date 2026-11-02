import { fullName, period } from '../sample';
import { CvPhoto, hl, initials, type TemplateProps } from './shared';

function Ring({ level }: { level: number }) {
  const r = 24;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 56 56" className="ret-ring" aria-hidden="true">
      <circle cx="28" cy="28" r={r} className="ret-ring-track" />
      <circle
        cx="28"
        cy="28"
        r={r}
        className="ret-ring-bar"
        strokeDasharray={`${(c * level) / 100} ${c}`}
        transform="rotate(-90 28 28)"
      />
    </svg>
  );
}

export function Retrato({ data: d, highlightId, t }: TemplateProps) {
  const name = fullName(d);
  const lines = [d.phone, ...d.links.map((l) => l.value), d.email].filter(Boolean);

  return (
    <div className="ret-grid">
      <aside className="ret-side">
        <h1 className="ret-name">{name.toUpperCase()}</h1>
        <div className="ret-photo-wrap">
          <CvPhoto data={d} className="ret-photo" />
          <div className="ret-diagonal" />
        </div>
        <div className="ret-dark">
          {d.profile && (
            <section>
              <h2 className="ret-h-light">{t('cv.aboutMe')}</h2>
              <p>{d.profile}</p>
            </section>
          )}
          {(d.city || lines.length > 0) && (
            <section>
              <h2 className="ret-h-light">{t('cv.contact')}</h2>
              {d.city && (
                <p className="ret-city">
                  <strong>{t('cv.city')}</strong>
                  <br />
                  {d.city}
                </p>
              )}
              <ul className="ret-contact">
                {lines.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </section>
          )}
          {d.languages.length > 0 && (
            <section>
              <h2 className="ret-h-light">{t('cv.languages')}</h2>
              <ul className="ret-contact">
                {d.languages.map((l) => (
                  <li key={l.id}>
                    {l.name}
                    {l.label && <em> · {l.label}</em>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>

      <main className="ret-main">
        {d.education.length > 0 && (
          <section>
            <div className="ret-bar" />
            <h2 className="ret-h">{t('cv.education')}</h2>
            <ol className="ret-tl">
              {d.education.map((e) => (
                <li key={e.id} className={hl(e.id, highlightId).trim()}>
                  <span className="ret-date">{period(e.start, e.end)}</span>
                  <div>
                    <strong>{e.degree}</strong>
                    <span>{e.institution}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {d.experience.length > 0 && (
          <section>
            <div className="ret-bar" />
            <h2 className="ret-h">{t('cv.experience')}</h2>
            <ol className="ret-tl">
              {d.experience.map((e) => (
                <li key={e.id} className={hl(e.id, highlightId).trim()}>
                  <span className="ret-date">{period(e.start, e.end, e.current, t('cv.today'))}</span>
                  <div>
                    <strong>{e.role}</strong>
                    <span>{e.company}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {d.skills.length > 0 && (
          <section>
            <div className="ret-bar" />
            <h2 className="ret-h">{t('cv.skills')}</h2>
            <ul className="ret-skills">
              {d.skills.map((s) => (
                <li key={s.id}>
                  <div className="ret-ring-box">
                    <Ring level={s.level} />
                    <b>{initials(s.name)}</b>
                  </div>
                  <span>{s.name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {d.note && (
          <section className="ret-note">
            <strong>{t('cv.note')}:</strong>
            <p>{d.note}</p>
          </section>
        )}
      </main>
    </div>
  );
}
