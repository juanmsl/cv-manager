// Proceso principal de Electron: ventana nativa de macOS, menú,
// archivos .cv y exportación a PDF.
const { app, BrowserWindow, ipcMain, dialog, Menu, shell, session } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
const { LANGS, pickLang, makeT } = require('./i18n.cjs');

// La app no guarda nada por su cuenta: cada vez que se abre empieza con los
// datos de ejemplo y en el idioma del sistema. Estos archivos son de versiones
// anteriores y se borran al arrancar.
const OLD_FILES = () => ['cv.json', 'cv.json.tmp', 'prefs.json'].map((f) => path.join(app.getPath('userData'), f));
let win;
// Cambios sin guardar en la interfaz (para preguntar antes de cerrar).
let docDirty = false;
let allowClose = false;
let quitting = false;
let pendingQuit = false;
// Idioma del menú y los diálogos: el del sistema hasta que la interfaz avise.
let lang = 'es';
let t = makeT(lang);
let rendererReady = false;
// Archivo .cv recibido antes de que la interfaz esté lista (p. ej. al abrir la
// app con doble clic sobre el archivo).
let pendingFile = process.argv.find((a) => a.toLowerCase().endsWith('.cv')) || null;

async function readCvFile(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  app.addRecentDocument(filePath);
  return { path: filePath, name: path.basename(filePath), content };
}

async function deliverFile(filePath) {
  try {
    const file = await readCvFile(filePath);
    send('file:open', file);
    if (win.isMinimized()) win.restore();
    win.focus();
  } catch (err) {
    dialog.showErrorBox(t('openError'), `${path.basename(filePath)}: ${err.message}`);
  }
}

// macOS: doble clic en un .cv, arrastrarlo al ícono o "Abrir recientes".
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (win && !win.isDestroyed() && rendererReady) deliverFile(filePath);
  else {
    pendingFile = filePath;
    if (app.isReady() && (!win || win.isDestroyed())) createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1100,
    minHeight: 680,
    title: 'CV Manager',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 19 },
    backgroundColor: '#F6F5F2',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.once('ready-to-show', () => win.show());
  docDirty = false;
  allowClose = false;
  // Con cambios sin guardar, la interfaz pregunta antes de cerrar.
  win.on('close', (e) => {
    if (!docDirty || allowClose) return;
    e.preventDefault();
    pendingQuit = quitting; // ⌘Q: si se confirma, después se sale de la app
    quitting = false;
    send('menu', 'close-request');
  });
  win.on('closed', () => {
    rendererReady = false;
  });

  // Los enlaces externos se abren en el navegador, nunca dentro de la app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

function send(channel, payload) {
  if (win && !win.isDestroyed()) win.webContents.send(channel, payload);
}

function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
      label: t('file'),
      submenu: [
        { label: t('open'), accelerator: 'CmdOrCtrl+O', click: () => send('menu', 'open') },
        ...(isMac ? [{ role: 'recentDocuments', label: t('openRecent'), submenu: [{ role: 'clearRecentDocuments', label: t('clearRecent') }] }] : []),
        { type: 'separator' },
        { label: t('save'), accelerator: 'CmdOrCtrl+S', click: () => send('menu', 'save') },
        { label: t('saveAs'), accelerator: 'Shift+CmdOrCtrl+S', click: () => send('menu', 'save-as') },
        { type: 'separator' },
        { label: t('importLinkedIn'), accelerator: 'CmdOrCtrl+I', click: () => send('menu', 'import') },
        { label: t('exportPdf'), accelerator: 'CmdOrCtrl+E', click: () => send('menu', 'export') },
        { type: 'separator' },
        isMac ? { role: 'close', label: t('closeWindow') } : { role: 'quit' },
      ],
    },
    { role: 'editMenu', label: t('edit') },
    {
      label: t('view'),
      submenu: [
        { label: t('stepTemplates'), accelerator: 'CmdOrCtrl+1', click: () => send('menu', 'step:templates') },
        { label: t('stepEditor'), accelerator: 'CmdOrCtrl+2', click: () => send('menu', 'step:editor') },
        { label: t('stepExport'), accelerator: 'CmdOrCtrl+3', click: () => send('menu', 'step:export') },
        { type: 'separator' },
        { role: 'reload', label: t('reload') },
        { role: 'toggleDevTools', label: t('devTools') },
        { type: 'separator' },
        { role: 'togglefullscreen', label: t('fullScreen') },
        { type: 'separator' },
        {
          label: t('language'),
          submenu: LANGS.map((l) => ({
            label: l.label,
            type: 'radio',
            checked: l.id === lang,
            click: () => send('menu', `lang:${l.id}`),
          })),
        },
      ],
    },
    { role: 'windowMenu', label: t('window') },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

/** Arranque limpio: borra lo que guardaban versiones anteriores (CV e idioma) y cualquier
 *  dato del navegador (localStorage, sessionStorage, IndexedDB, caché). */
async function clearStoredData() {
  for (const f of OLD_FILES()) await fs.rm(f, { force: true }).catch(() => {});
  await session.defaultSession
    .clearStorageData({ storages: ['localstorage', 'indexdb', 'websql', 'cachestorage', 'serviceworkers', 'filesystem', 'shadercache'] })
    .catch(() => {});
}

// --- Exportar PDF -----------------------------------------------------------
// El renderer pone la página del CV en modo impresión (CSS @media print);
// aquí se imprime la ventana a PDF en una sola hoja: ancho Carta y el alto
// del contenido (mínimo Carta).
ipcMain.handle('pdf:export', async (_e, { fileName, heightPt }) => {
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    title: t('exportTitle'),
    defaultPath: path.join(app.getPath('documents'), fileName || 'CV.pdf'),
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  });
  if (canceled || !filePath) return { ok: false, canceled: true };

  try {
    const pdf = await win.webContents.printToPDF({
      pageSize: { width: 8.5, height: Math.max(11, Number(heightPt) / 72 || 11) }, // pulgadas
      printBackground: true,
      margins: { marginType: 'none' },
      preferCSSPageSize: true,
    });
    await fs.writeFile(filePath, pdf);
    return { ok: true, filePath };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
});

// --- Archivos .cv ------------------------------------------------------------
const cvFilters = () => [{ name: t('cvFiles'), extensions: ['cv'] }];

ipcMain.handle('file:take-pending', async () => {
  rendererReady = true;
  if (!pendingFile) return null;
  const filePath = pendingFile;
  pendingFile = null;
  try {
    return await readCvFile(filePath);
  } catch (err) {
    dialog.showErrorBox(t('openError'), `${path.basename(filePath)}: ${err.message}`);
    return null;
  }
});

ipcMain.handle('file:open-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    title: t('openTitle'),
    filters: cvFilters(),
    properties: ['openFile'],
  });
  if (canceled || !filePaths[0]) return null;
  return readCvFile(filePaths[0]);
});

ipcMain.handle('file:save', async (_e, { path: target, content, suggestedName }) => {
  let filePath = target;
  if (!filePath) {
    const res = await dialog.showSaveDialog(win, {
      title: t('saveTitle'),
      defaultPath: path.join(app.getPath('documents'), suggestedName || 'Mi-CV.cv'),
      filters: cvFilters(),
    });
    if (res.canceled || !res.filePath) return { ok: false };
    filePath = res.filePath.toLowerCase().endsWith('.cv') ? res.filePath : `${res.filePath}.cv`;
  }
  try {
    const tmp = `${filePath}.tmp`;
    await fs.writeFile(tmp, content);
    await fs.rename(tmp, filePath);
    app.addRecentDocument(filePath);
    return { ok: true, path: filePath, name: path.basename(filePath) };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  }
});

ipcMain.handle('file:confirm-unsaved', async (_e, name) => {
  const { response } = await dialog.showMessageBox(win, {
    type: 'warning',
    buttons: [t('btnSave'), t('btnDontSave'), t('btnCancel')],
    defaultId: 0,
    cancelId: 2,
    message: t('confirmSave', { name }),
    detail: t('confirmDetail'),
  });
  return ['save', 'discard', 'cancel'][response];
});

// Título de la ventana, archivo representado (icono en la barra) y punto de
// "editado" en el botón rojo de macOS.
ipcMain.on('win:state', (_e, { path: filePath, name, dirty }) => {
  docDirty = Boolean(dirty);
  if (!win || win.isDestroyed()) return;
  win.setTitle(name ? `${name} — CV Manager` : 'CV Manager');
  if (process.platform === 'darwin') {
    win.setRepresentedFilename(filePath && path.isAbsolute(filePath) ? filePath : '');
    win.setDocumentEdited(Boolean(dirty));
  }
});

// La interfaz ya preguntó (o no había cambios): cerrar de verdad.
ipcMain.on('win:close', () => {
  if (!win || win.isDestroyed()) return;
  allowClose = true;
  win.close();
  if (pendingQuit) app.quit();
});

app.on('before-quit', () => {
  quitting = true;
});

ipcMain.handle('pdf:reveal', (_e, filePath) => shell.showItemInFolder(filePath));

// La interfaz avisa el idioma elegido: se reconstruye el menú.
ipcMain.on('app:set-lang', (_e, l) => {
  const next = pickLang(l);
  if (next === lang) return;
  lang = next;
  t = makeT(lang);
  buildMenu();
});

app.whenReady().then(async () => {
  await clearStoredData();
  // En desarrollo (pnpm dev) el Dock muestra el icono de Electron; usamos el nuestro.
  if (!app.isPackaged && process.platform === 'darwin') {
    try {
      app.dock.setIcon(path.join(__dirname, '..', 'build', 'icon.png'));
    } catch {
      // Sin el PNG (o fuera de macOS) se deja el icono por defecto.
    }
  }
  lang = pickLang(app.getLocale());
  t = makeT(lang);
  buildMenu();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// La app tiene una sola ventana: al cerrarla se sale por completo, también en
// macOS (sin quedar abierta en el Dock).
app.on('window-all-closed', () => {
  app.quit();
});
