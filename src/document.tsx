// Archivos .cv: guardar el CV en un archivo, abrirlo (también con doble clic
// desde el Finder) y saber si hay cambios sin guardar.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useCv } from './state';
import { SAMPLE_DATA, TEMPLATES, fullName, initialState } from './sample';
import type { AppState } from './types';
import { useT } from './i18n';

export interface CvFilePayload {
  path: string;
  name: string;
  content: string;
}

const FORMAT = 'cv-manager';

/** Lo que se guarda en el archivo: el documento, no el estado de la ventana. */
const docPayload = (s: AppState) => ({
  template: s.template,
  colors: s.colors,
  data: s.data,
  fileName: s.fileName,
  cvLang: s.cvLang ?? null,
});

/** Huella del documento para saber si cambió desde el último guardado. */
export function hashDoc(s: AppState) {
  const str = JSON.stringify(docPayload(s));
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return `${h >>> 0}:${str.length}`;
}

export function serialize(s: AppState) {
  return JSON.stringify({ format: FORMAT, version: 1, savedAt: new Date().toISOString(), document: docPayload(s) }, null, 2);
}

function deserialize(content: string): ReturnType<typeof docPayload> {
  const json = JSON.parse(content);
  if (json?.format !== FORMAT || !json.document?.data) throw new Error('formato');
  return json.document;
}

function hasContent(s: AppState) {
  const d = s.data;
  return Boolean(
    d.firstName || d.lastName || d.title || d.profile || d.photo || d.experience.length || d.education.length || d.skills.length,
  );
}

const SAMPLE_JSON = JSON.stringify(SAMPLE_DATA);

/** Hay trabajo que se perdería al cerrar: cambios sin guardar en el .cv, o
 *  (sin archivo) datos distintos de los de ejemplo. */
export function isDirty(s: AppState) {
  if (s.doc) return hashDoc(s) !== s.doc.savedHash;
  return hasContent(s) && JSON.stringify(s.data) !== SAMPLE_JSON;
}

const suggestedName = (s: AppState) => {
  const base = fullName(s.data)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'Mi-CV'}.cv`;
};

type Notice = { kind: 'ok' | 'error'; text: string } | null;

interface DocCtx {
  name: string | null;
  dirty: boolean;
  save: (asNew?: boolean) => Promise<boolean>;
  open: () => Promise<void>;
  notice: Notice;
  clearNotice: () => void;
  /** Avisa cuando se abrió un archivo (para mostrar la vista Datos). */
  onOpened: (cb: () => void) => void;
}

const DocContext = createContext<DocCtx | null>(null);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const { state, ready, replaceState, set } = useCv();
  const [notice, setNotice] = useState<Notice>(null);
  const { t } = useT();
  const tRef = useRef(t);
  tRef.current = t;
  const latest = useRef(state);
  latest.current = state;
  const openedCb = useRef<() => void>();
  const dirty = isDirty(state);

  const save = useCallback(
    async (asNew = false): Promise<boolean> => {
      const s = latest.current;
      const content = serialize(s);
      const savedHash = hashDoc(s);
      if (!window.cvApi) {
        // Modo navegador (desarrollo): descarga el archivo.
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
        a.download = s.doc?.name ?? suggestedName(s);
        a.click();
        URL.revokeObjectURL(a.href);
        set({ doc: { path: a.download, name: a.download, savedHash } });
        return true;
      }
      const res = await window.cvApi.saveFile({
        path: asNew ? undefined : s.doc?.path,
        content,
        suggestedName: s.doc?.name ?? suggestedName(s),
      });
      if (res.ok && res.path && res.name) {
        set({ doc: { path: res.path, name: res.name, savedHash } });
        setNotice({ kind: 'ok', text: tRef.current('doc.savedAs', { name: res.name }) });
        return true;
      }
      if (res.error) setNotice({ kind: 'error', text: tRef.current('doc.saveError') });
      return false;
    },
    [set],
  );

  /** Pregunta qué hacer si hay cambios sin guardar. true = se puede continuar. */
  const confirmUnsaved = useCallback(async () => {
    const s = latest.current;
    if (!isDirty(s)) return true;
    const name = s.doc?.name ?? tRef.current('doc.currentCv');
    let choice: 'save' | 'discard' | 'cancel';
    if (window.cvApi) choice = await window.cvApi.confirmUnsaved(name);
    else choice = window.confirm(tRef.current('doc.confirmBrowser', { name })) ? 'discard' : 'cancel';
    if (choice === 'cancel') return false;
    if (choice === 'save') return save();
    return true;
  }, [save]);

  const load = useCallback(
    (file: CvFilePayload) => {
      try {
        const payload = deserialize(file.content);
        const base = initialState();
        const next: AppState = {
          ...base,
          ...payload,
          // Archivos de versiones con menos plantillas: completar colores y validar la plantilla.
          colors: { ...base.colors, ...payload.colors },
          template: TEMPLATES.some((x) => x.id === payload.template) ? payload.template : base.template,
          uiLang: latest.current.uiLang,
          isSample: false,
          version: 1,
          doc: null,
        };
        next.doc = { path: file.path, name: file.name, savedHash: hashDoc(next) };
        replaceState(next);
        setNotice({ kind: 'ok', text: tRef.current('doc.opened', { name: file.name }) });
        openedCb.current?.();
      } catch {
        setNotice({ kind: 'error', text: tRef.current('doc.openError', { name: file.name }) });
      }
    },
    [replaceState],
  );

  const open = useCallback(async () => {
    if (!(await confirmUnsaved())) return;
    if (window.cvApi) {
      const file = await window.cvApi.openFile();
      if (file) load(file);
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.cv';
    input.onchange = async () => {
      const f = input.files?.[0];
      if (f) load({ path: f.name, name: f.name, content: await f.text() });
    };
    input.click();
  }, [confirmUnsaved, load]);

  // Archivos abiertos desde el Finder (doble clic) o desde "Abrir recientes".
  useEffect(() => {
    if (!ready || !window.cvApi) return;
    const api = window.cvApi;
    const handle = async (file: CvFilePayload) => {
      if (latest.current.doc?.path === file.path && !isDirty(latest.current)) {
        openedCb.current?.();
        return;
      }
      if (await confirmUnsaved()) load(file);
    };
    const off = api.onOpenFile(handle);
    api.takePendingFile().then((file) => file && load(file)); // la app se abrió con doble clic
    return off;
  }, [ready, confirmUnsaved, load]);

  // Al cerrar la ventana (o salir con ⌘Q) con cambios sin guardar, preguntar.
  useEffect(() => {
    const api = window.cvApi;
    if (!api) return;
    return api.onMenu(async (action) => {
      if (action !== 'close-request') return;
      if (await confirmUnsaved()) api.closeWindow();
    });
  }, [confirmUnsaved]);

  // En modo navegador (desarrollo) el navegador avisa al cerrar la pestaña.
  useEffect(() => {
    if (window.cvApi) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty(latest.current)) e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  // Título de la ventana, icono del documento y punto de "editado" en macOS.
  useEffect(() => {
    window.cvApi?.setWindowState({ path: state.doc?.path ?? '', name: state.doc?.name ?? '', dirty });
  }, [state.doc?.path, state.doc?.name, dirty]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(t);
  }, [notice]);

  return (
    <DocContext.Provider
      value={{
        name: state.doc?.name ?? null,
        dirty,
        save,
        open,
        notice,
        clearNotice: () => setNotice(null),
        onOpened: (cb) => (openedCb.current = cb),
      }}
    >
      {children}
    </DocContext.Provider>
  );
}

export function useDocument() {
  const ctx = useContext(DocContext);
  if (!ctx) throw new Error('useDocument debe usarse dentro de DocumentProvider');
  return ctx;
}
