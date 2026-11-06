import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { AppState, CvData } from './types';
import { EMPTY_DATA, initialState, sampleData, suggestFileName } from './sample';
import { detectLang, type Lang } from './i18n';

declare global {
  interface Window {
    cvApi?: {
      closeWindow: () => void;
      exportPdf: (opts: { fileName: string; heightPt: number }) => Promise<{ ok: boolean; canceled?: boolean; filePath?: string; error?: string }>;
      reveal: (filePath: string) => Promise<void>;
      onMenu: (cb: (action: string) => void) => () => void;
      saveFile: (opts: { path?: string; content: string; suggestedName: string }) => Promise<{ ok: boolean; path?: string; name?: string; error?: string }>;
      openFile: () => Promise<{ path: string; name: string; content: string } | null>;
      takePendingFile: () => Promise<{ path: string; name: string; content: string } | null>;
      onOpenFile: (cb: (file: { path: string; name: string; content: string }) => void) => () => void;
      confirmUnsaved: (name: string) => Promise<'save' | 'discard' | 'cancel'>;
      setWindowState: (s: { path: string; name: string; dirty: boolean }) => void;
      setLanguage: (lang: string) => void;
      updates?: {
        getState: () => Promise<import('./components/UpdateToast').UpdateState>;
        check: () => Promise<unknown>;
        download: () => Promise<unknown>;
        install: () => Promise<unknown>;
        later: () => Promise<unknown>;
        setAuto: (auto: boolean) => Promise<unknown>;
        onState: (cb: (s: import('./components/UpdateToast').UpdateState) => void) => () => void;
      };
    };
  }
}

// La app no guarda nada por su cuenta: cada vez que se abre empieza con los
// datos de ejemplo, sin archivo y en el idioma del sistema. El CV solo se
// conserva si lo guardas como archivo .cv.
type ListKey = 'links' | 'experience' | 'education' | 'skills' | 'languages';
type Item<K extends ListKey> = CvData[K][number];

interface Ctx {
  state: AppState;
  ready: boolean;
  set: (patch: Partial<AppState>) => void;
  setData: (patch: Partial<CvData>) => void;
  addItem: <K extends ListKey>(key: K, item: Item<K>) => void;
  updateItem: <K extends ListKey>(key: K, id: string, patch: Partial<Item<K>>) => void;
  removeItem: (key: ListKey, id: string) => void;
  moveItem: (key: ListKey, from: number, to: number) => void;
  startBlank: () => void;
  /** Vuelve a los datos de ejemplo en ese idioma (conserva plantilla y colores). */
  resetSample: (lang: Lang) => void;
  /** Borra todos los datos del CV, incluida la foto. */
  clearAll: () => void;
  /** Reemplaza los datos del CV con los importados (conserva la foto). */
  importData: (data: Partial<CvData>) => void;
  /** Reemplaza todo el estado (al abrir un archivo .cv). */
  replaceState: (next: AppState) => void;
}

const CvContext = createContext<Ctx | null>(null);

export function CvProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => initialState(detectLang()));
  const ready = true;

  const set = useCallback((patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch })), []);

  const setData = useCallback(
    (patch: Partial<CvData>) => setState((s) => ({ ...s, data: { ...s.data, ...patch } })),
    [],
  );

  const addItem = useCallback(<K extends ListKey>(key: K, item: Item<K>) => {
    setState((s) => ({ ...s, data: { ...s.data, [key]: [...s.data[key], item] } }));
  }, []);

  const updateItem = useCallback(<K extends ListKey>(key: K, id: string, patch: Partial<Item<K>>) => {
    setState((s) => ({
      ...s,
      data: {
        ...s.data,
        [key]: (s.data[key] as Item<K>[]).map((it) => (it.id === id ? { ...it, ...patch } : it)),
      },
    }));
  }, []);

  const removeItem = useCallback((key: ListKey, id: string) => {
    setState((s) => ({
      ...s,
      data: { ...s.data, [key]: (s.data[key] as { id: string }[]).filter((it) => it.id !== id) },
    }));
  }, []);

  const moveItem = useCallback((key: ListKey, from: number, to: number) => {
    setState((s) => {
      const list = [...(s.data[key] as { id: string }[])];
      if (to < 0 || to >= list.length) return s;
      const [it] = list.splice(from, 1);
      list.splice(to, 0, it);
      return { ...s, data: { ...s.data, [key]: list } };
    });
  }, []);

  const startBlank = useCallback(() => {
    setState((s) => ({ ...s, data: structuredClone(EMPTY_DATA), isSample: false, fileName: 'Mi-CV.pdf' }));
  }, []);

  const resetSample = useCallback((lang: Lang) => {
    const data = sampleData(lang);
    setState((s) => ({ ...s, data, isSample: true, fileName: suggestFileName(data) }));
  }, []);

  const clearAll = useCallback(() => {
    setState((s) => ({ ...s, data: structuredClone(EMPTY_DATA), isSample: false, fileName: 'Mi-CV.pdf' }));
  }, []);

  const importData = useCallback((data: Partial<CvData>) => {
    setState((s) => {
      const next: CvData = { ...structuredClone(EMPTY_DATA), ...data, photo: s.data.photo };
      return { ...s, data: next, isSample: false, fileName: suggestFileName(next) };
    });
  }, []);

  return (
    <CvContext.Provider
      value={{
        state, ready, set, setData, addItem, updateItem, removeItem, moveItem,
        startBlank, resetSample, clearAll, importData, replaceState: setState,
      }}
    >
      {children}
    </CvContext.Provider>
  );
}

export function useCv() {
  const ctx = useContext(CvContext);
  if (!ctx) throw new Error('useCv debe usarse dentro de CvProvider');
  return ctx;
}
