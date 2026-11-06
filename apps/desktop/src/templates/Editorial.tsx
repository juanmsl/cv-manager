import { period } from '../sample';
import { CvPhoto, hl, type TemplateProps, dateFormat, Rich } from './shared';

export function Editorial({ data: d, highlightId, t }: TemplateProps) {
  // Fechas: estilo 'numeric' (ver dates.ts)
  const F = dateFormat(t, 'numeric');
  const contact = [
    d.email && [t('cv.emailShort'), d.email],
    d.phone && [t('cv.phoneShort'), d.phone],
    d.city && ['', d.city],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="edi">
      <header className={'edi-head' + (d.hidePhoto ? ' edi-head--nophoto' : '')}>
        <div className="edi-vertical">
          <span>{t('cv.resume')}</span>
        </div>
        <div className="edi-band" />
        {!d.hidePhoto && (
          <div className="edi-photo-back">
            <CvPhoto data={d} className="edi-photo" />
          </div>
        )}
        <div className="edi-id">
          <h1 className="edi-name">
            <span>{d.firstName}</span> <strong>{d.lastName}</strong>
          </h1>
          {d.title && <p className="edi-title">{d.title}</p>}
          {contact.length > 0 && (
            <p className="edi-contact">
              {contact.map(([k, v], i) => (
                <span key={i}>
                  {k && <b>{k} </b>}
                  {v}
                </span>
              ))}
            </p>
          )}
        </div>
      </header>

      {d.profile && <Rich text={d.profile} className="edi-profile" />}

      <div className="edi-cols">
        <aside>
          {d.skills.length > 0 && (
            <section>
              <h2 className="edi-h">{t('cv.skills')}</h2>
              <h3 className="edi-sub">{t('cv.professional')}</h3>
              <ul className="edi-bullets">
                {d.skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </section>
          )}
          {d.languages.length > 0 && (
            <section>
              <h3 className="edi-sub">{t('cv.languages')}</h3>
              <ul className="edi-bullets">
                {d.languages.map((l) => (
                  <li key={l.id}>
                    {l.name}
                    {l.label && ` · ${l.label}`}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {d.education.length > 0 && (
            <section>
              <h2 className="edi-h">{t('cv.education')}</h2>
              <ol className="edi-tl">
                {d.education.map((e) => (
                  <li key={e.id} className={hl(e.id, highlightId).trim()}>
                    <span>{period(e.start, e.end, false, '', F)}</span>
                    <strong>{e.degree}</strong>
                    <span>{e.institution}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
          {d.links.length > 0 && (
            <section>
              <h3 className="edi-sub">{t('cv.links')}</h3>
              <ul className="edi-plain">
                {d.links.map((l) => (
                  <li key={l.id}>{l.value}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main>
          {d.experience.length > 0 && (
            <section>
              <h2 className="edi-h">{t('cv.experience')}</h2>
              {d.experience.map((e) => (
                <article key={e.id} className={'edi-job' + hl(e.id, highlightId)}>
                  <span className="edi-date">{period(e.start, e.end, e.current, t('cv.present'), F)}</span>
                  <strong className="edi-role">
                    {[e.role, e.company].filter(Boolean).join(' — ')}
                  </strong>
                  {e.description && <Rich text={e.description} />}
                  {e.achievements.filter(Boolean).length > 0 && (
                    <ul>
                      {e.achievements.filter(Boolean).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </section>
          )}
          {d.note && <Rich text={d.note} className="edi-note" />}
        </main>
      </div>
    </div>
  );
}
