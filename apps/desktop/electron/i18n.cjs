// Textos del menú y de los diálogos nativos (español, inglés, portugués).
const STRINGS = {
  es: {
    file: 'Archivo',
    open: 'Abrir…',
    openRecent: 'Abrir recientes',
    clearRecent: 'Borrar menú',
    save: 'Guardar',
    saveAs: 'Guardar como…',
    importLinkedIn: 'Importar desde LinkedIn…',
    exportPdf: 'Exportar PDF…',
    closeWindow: 'Cerrar ventana',
    edit: 'Edición',
    view: 'Ver',
    stepTemplates: 'Plantilla',
    stepEditor: 'Datos',
    stepExport: 'Exportar',
    reload: 'Recargar',
    devTools: 'Herramientas de desarrollo',
    fullScreen: 'Pantalla completa',
    window: 'Ventana',
    language: 'Idioma',
    exportTitle: 'Exportar CV',
    openTitle: 'Abrir CV',
    saveTitle: 'Guardar CV',
    cvFiles: 'Currículum de CV Manager',
    openError: 'No se pudo abrir el archivo',
    confirmSave: '¿Quieres guardar los cambios de {name}?',
    confirmDetail: 'Si no los guardas, se perderán al abrir otro CV.',
    btnSave: 'Guardar',
    btnDontSave: 'No guardar',
    btnCancel: 'Cancelar',
  },
  en: {
    file: 'File',
    open: 'Open…',
    openRecent: 'Open Recent',
    clearRecent: 'Clear Menu',
    save: 'Save',
    saveAs: 'Save As…',
    importLinkedIn: 'Import from LinkedIn…',
    exportPdf: 'Export PDF…',
    closeWindow: 'Close Window',
    edit: 'Edit',
    view: 'View',
    stepTemplates: 'Template',
    stepEditor: 'Details',
    stepExport: 'Export',
    reload: 'Reload',
    devTools: 'Developer Tools',
    fullScreen: 'Full Screen',
    window: 'Window',
    language: 'Language',
    exportTitle: 'Export CV',
    openTitle: 'Open CV',
    saveTitle: 'Save CV',
    cvFiles: 'CV Manager résumé',
    openError: 'Couldn’t open the file',
    confirmSave: 'Do you want to save the changes to {name}?',
    confirmDetail: 'If you don’t save them, they’ll be lost when you open another CV.',
    btnSave: 'Save',
    btnDontSave: 'Don’t Save',
    btnCancel: 'Cancel',
  },
  pt: {
    file: 'Arquivo',
    open: 'Abrir…',
    openRecent: 'Abrir recentes',
    clearRecent: 'Limpar menu',
    save: 'Salvar',
    saveAs: 'Salvar como…',
    importLinkedIn: 'Importar do LinkedIn…',
    exportPdf: 'Exportar PDF…',
    closeWindow: 'Fechar janela',
    edit: 'Editar',
    view: 'Visualizar',
    stepTemplates: 'Modelo',
    stepEditor: 'Dados',
    stepExport: 'Exportar',
    reload: 'Recarregar',
    devTools: 'Ferramentas de desenvolvedor',
    fullScreen: 'Tela cheia',
    window: 'Janela',
    language: 'Idioma',
    exportTitle: 'Exportar currículo',
    openTitle: 'Abrir currículo',
    saveTitle: 'Salvar currículo',
    cvFiles: 'Currículo do CV Manager',
    openError: 'Não foi possível abrir o arquivo',
    confirmSave: 'Deseja salvar as alterações em {name}?',
    confirmDetail: 'Se não salvar, elas serão perdidas ao abrir outro currículo.',
    btnSave: 'Salvar',
    btnDontSave: 'Não salvar',
    btnCancel: 'Cancelar',
  },
};

const LANGS = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Português' },
];

/** Primer idioma soportado (es/en/pt) de la lista del sistema; si no hay ninguno, inglés. */
function pickLang(locales) {
  for (const locale of [].concat(locales || [])) {
    const l = String(locale || '').slice(0, 2).toLowerCase();
    if (l === 'es' || l === 'en' || l === 'pt') return l;
  }
  return 'en';
}

function makeT(lang) {
  const dict = STRINGS[lang] || STRINGS.es;
  return (key, vars) => {
    let s = dict[key] ?? STRINGS.es[key] ?? key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
    return s;
  };
}

module.exports = { LANGS, pickLang, makeT };
