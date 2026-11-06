// Puente seguro entre la interfaz (React) y el proceso principal.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cvApi', {
  closeWindow: () => ipcRenderer.send('win:close'),
  exportPdf: (opts) => ipcRenderer.invoke('pdf:export', opts),
  reveal: (filePath) => ipcRenderer.invoke('pdf:reveal', filePath),
  saveFile: (opts) => ipcRenderer.invoke('file:save', opts),
  openFile: () => ipcRenderer.invoke('file:open-dialog'),
  takePendingFile: () => ipcRenderer.invoke('file:take-pending'),
  onOpenFile: (cb) => {
    const listener = (_e, file) => cb(file);
    ipcRenderer.on('file:open', listener);
    return () => ipcRenderer.removeListener('file:open', listener);
  },
  confirmUnsaved: (name) => ipcRenderer.invoke('file:confirm-unsaved', name),
  setWindowState: (s) => ipcRenderer.send('win:state', s),
  setLanguage: (lang) => ipcRenderer.send('app:set-lang', lang),
  updates: {
    getState: () => ipcRenderer.invoke('update:state'),
    check: () => ipcRenderer.invoke('update:check'),
    download: () => ipcRenderer.invoke('update:download'),
    install: () => ipcRenderer.invoke('update:install'),
    later: () => ipcRenderer.invoke('update:later'),
    setAuto: (auto) => ipcRenderer.invoke('update:auto', auto),
    onState: (cb) => {
      const listener = (_e, s) => cb(s);
      ipcRenderer.on('update:state', listener);
      return () => ipcRenderer.removeListener('update:state', listener);
    },
  },
  onMenu: (cb) => {
    const listener = (_e, action) => cb(action);
    ipcRenderer.on('menu', listener);
    return () => ipcRenderer.removeListener('menu', listener);
  },
});
