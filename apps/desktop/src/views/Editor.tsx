import { useEffect, useState } from 'react';
import { useCv } from '../state';
import { useDocument } from '../document';
import type { SectionId } from '../types';
import { PAGE_MIN_H_PT, ScaledPage, isTaller, pageDims } from '../templates/CvPage';
import type { IconType } from 'react-icons';
import {
  PiAddressBook,
  PiBriefcase,
  PiGraduationCap,
  PiPalette,
  PiQuotes,
  PiTranslate,
  PiUserCircle,
  PiWrench,
} from 'react-icons/pi';
import { Icon } from '../components/ui';
import { useT } from '../i18n';
import { DataActions } from '../components/DataActions';
import { LinkedInImport } from '../components/LinkedInImport';
import {
  ColorsSection,
  ContactSection,
  EducationSection,
  ExperienceSection,
  LanguagesSection,
  PersonalSection,
  ProfileSection,
  SkillsSection,
} from './sections';

// Iconos Phosphor (react-icons/pi), peso regular, uno por sección.
const ICONS: Record<SectionId, IconType> = {
  personal: PiUserCircle,
  profile: PiQuotes,
  contact: PiAddressBook,
  experience: PiBriefcase,
  education: PiGraduationCap,
  skills: PiWrench,
  languages: PiTranslate,
  colors: PiPalette,
};

export function Editor({
  importTrigger = 0,
  onImportHandled,
}: {
  importTrigger?: number;
  onImportHandled?: () => void;
}) {
  const { state, startBlank, set } = useCv();
  const doc = useDocument();
  const { t } = useT();
  const d = state.data;
  const [section, setSection] = useState<SectionId>('personal');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pageH, setPageH] = useState(PAGE_MIN_H_PT);
  const [importOpen, setImportOpen] = useState(false);
  useEffect(() => {
    if (importTrigger > 0) {
      setImportOpen(true);
      onImportHandled?.(); // consumir el aviso para que no se repita al volver a esta vista
    }
  }, [importTrigger, onImportHandled]);
  const [wide, setWide] = useState(() => window.innerWidth >= 1240);
  useEffect(() => {
    const onResize = () => setWide(window.innerWidth >= 1240);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sections: { id: SectionId; label: string; count: number }[] = [
    { id: 'personal', label: t('section.personal'), count: [d.photo, d.firstName || d.lastName, d.title].filter(Boolean).length },
    { id: 'profile', label: t('section.profile'), count: [d.profile, d.note].filter(Boolean).length },
    { id: 'contact', label: t('section.contact'), count: [d.email, d.phone, d.city].filter(Boolean).length + d.links.length },
    { id: 'experience', label: t('section.experience'), count: d.experience.length },
    { id: 'education', label: t('section.education'), count: d.education.length },
    { id: 'skills', label: t('section.skills'), count: d.skills.length },
    { id: 'languages', label: t('section.languages'), count: d.languages.length },
    { id: 'colors', label: t('section.colors'), count: 3 },
  ];

  const go = (id: SectionId) => {
    setSection(id);
    if (id === 'experience') setActiveId(d.experience[0]?.id ?? null);
    else if (id === 'education') setActiveId(d.education[0]?.id ?? null);
    else setActiveId(null);
  };

  const props = { activeId, setActiveId };
  const isEmpty =
    !d.firstName && !d.lastName && !d.title && !d.profile && !d.photo &&
    d.experience.length + d.education.length + d.skills.length + d.languages.length + d.links.length === 0;

  return (
    <div className="view">
      <div className="editor">
        <nav className="sidebar" aria-label={t('editor.sectionsAria')}>
          <div className="sidebar-label">{t('editor.sections')}</div>
          {sections.map((s) => {
            const SectionIcon = ICONS[s.id];
            return (
            <button
              key={s.id}
              type="button"
              className="divider-item"
              aria-current={section === s.id}
              onClick={() => go(s.id)}
            >
              <SectionIcon className="divider-icon" size={17} aria-hidden="true" />
              <span>{s.label}</span>
              <span className="divider-count">{s.count}</span>
            </button>
            );
          })}
          <DataActions
            onImport={() => setImportOpen(true)}
            onDone={() => {
              setSection('personal');
              setActiveId(null);
            }}
          />
          <div className="save-state" aria-live="polite">
            {doc.name && !doc.dirty ? (
              <>
                {Icon.check(12)} {t('save.inFile', { name: doc.name.replace(/\.cv$/i, '') })}
              </>
            ) : doc.dirty ? (
              <>{t('save.unsaved')}</>
            ) : (
              <>{t('save.noFile')}</>
            )}
          </div>
        </nav>

        <main className="center">
          {state.isSample && (
            <div className="banner" role="status">
              <p>{t('sample.banner')}</p>
              <button type="button" className="btn btn--link" onClick={() => set({ isSample: false })}>
                {t('sample.keep')}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  startBlank();
                  setSection('personal');
                  setActiveId(null);
                }}
              >
                {t('sample.blank')}
              </button>
            </div>
          )}
          {section === 'personal' && <PersonalSection />}
          {section === 'profile' && <ProfileSection />}
          {section === 'contact' && <ContactSection />}
          {section === 'experience' && <ExperienceSection {...props} />}
          {section === 'education' && <EducationSection {...props} />}
          {section === 'skills' && <SkillsSection />}
          {section === 'languages' && <LanguagesSection />}
          {section === 'colors' && <ColorsSection />}
        </main>

        <aside className="preview" aria-label={t('preview.title')}>
          <div className="preview-head">
            <strong>{t('preview.title')}</strong>
            <span>{t('page.size', pageDims(pageH))}</span>
          </div>
          <div className="preview-scroll">
            <div className="preview-page">
              <ScaledPage state={state} width={wide ? 339 : 280} highlightId={activeId} onHeight={setPageH} />
              {isEmpty && <p className="preview-empty">{t('preview.empty')}</p>}
            </div>
            <p className="preview-foot">
              {isTaller(pageH) ? t('preview.taller') : t('preview.letter')}
            </p>
          </div>
        </aside>
      </div>
      <LinkedInImport
        open={importOpen}
        onClose={() => setImportOpen(false)}
      />
    </div>
  );
}
