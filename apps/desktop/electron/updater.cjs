// Actualizaciones de la app (ADR-0025).
//
// La app está firmada ad hoc (ADR-0003), así que electron-updater/Squirrel.Mac no
// sirve: exige un certificado Developer ID. En su lugar:
//   1. Se consulta el último release de GitHub y se compara con la versión actual.
//   2. Se descarga el .dmg del release y se verifica con su SHA256SUMS.txt.
//   3. Se monta el .dmg, se copia "CV Manager.app" a una carpeta temporal y se comprueba
//      que su versión y su firma sean válidas.
//   4. Al salir de la app, un script reemplaza la app instalada por la nueva (y la
//      vuelve a abrir si se pidió reiniciar). Si algo falla, restaura la anterior.
// Solo se consulta GitHub: no se envía ningún dato del CV ni de la persona.
const { app, net, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const crypto = require('node:crypto');
const { execFile, spawn } = require('node:child_process');
const { promisify } = require('node:util');

const run = promisify(execFile);
const REPO = 'juanmsl/cv-manager';
const API = `https://api.github.com/repos/${REPO}/releases/latest`;
const CHECK_EVERY = 6 * 60 * 60 * 1000; // 6 h mientras la app está abierta

let state = { status: 'idle', current: app.getVersion(), auto: false };
let listener = () => {};
let release = null; // { version, url, dmg: { name, url, size }, sums }
let staged = null; // ruta a "CV Manager.app" lista para instalar
let installOnQuit = false;
let relaunch = false;
let timer = null;

// --- Preferencias (solo la opción "Actualizar automáticamente") -------------
const prefsFile = () => path.join(app.getPath('userData'), 'updates.json');
function loadPrefs() {
  try {
    return JSON.parse(fs.readFileSync(prefsFile(), 'utf8'));
  } catch {
    return {};
  }
}
function savePrefs(prefs) {
  try {
    fs.writeFileSync(prefsFile(), JSON.stringify(prefs));
  } catch {
    // Sin poder escribir, la opción dura hasta cerrar la app.
  }
}

function set(patch) {
  state = { ...state, ...patch };
  listener(state);
}

// --- Versiones ----------------------------------------------------------------
function parse(v) {
  const m = /^v?(\d+)\.(\d+)\.(\d+)/.exec(String(v || ''));
  return m ? m.slice(1).map(Number) : null;
}
function newer(a, b) {
  const x = parse(a);
  const y = parse(b);
  if (!x || !y) return false;
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
}

/** Ruta de "CV Manager.app" en ejecución, o null en desarrollo. */
function bundlePath() {
  if (!app.isPackaged) return null;
  const p = path.resolve(process.execPath, '..', '..', '..');
  return p.endsWith('.app') ? p : null;
}

const headers = () => ({ 'User-Agent': `CV-Manager/${app.getVersion()}`, Accept: 'application/vnd.github+json' });

// --- 1. Buscar ----------------------------------------------------------------
async function check({ manual = false } = {}) {
  if (['checking', 'downloading'].includes(state.status)) return state;
  if (state.status === 'ready') {
    if (manual) listener({ ...state, manual: true });
    return state;
  }
  set({ status: 'checking', manual, error: undefined });
  try {
    const res = await net.fetch(API, { headers: headers() });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const json = await res.json();
    const version = String(json.tag_name || '').replace(/^v/, '');
    const assets = json.assets || [];
    const dmg =
      assets.find((a) => a.name === 'CV-Manager-macOS-arm64.dmg') ||
      assets.find((a) => /arm64.*\.dmg$/i.test(a.name)) ||
      assets.find((a) => /\.dmg$/i.test(a.name));
    const sums = assets.find((a) => a.name === 'SHA256SUMS.txt');
    if (!newer(version, app.getVersion()) || !dmg) {
      set({ status: 'up-to-date', manual, latest: version || app.getVersion() });
      return state;
    }
    release = {
      version,
      url: json.html_url,
      dmg: { name: dmg.name, url: dmg.browser_download_url, size: dmg.size },
      sums: sums ? sums.browser_download_url : null,
    };
    set({ status: 'available', manual, version, notesUrl: json.html_url });
    if (state.auto) download();
    return state;
  } catch (err) {
    set({ status: manual ? 'error' : 'idle', manual, error: String(err.message || err) });
    return state;
  }
}

// --- 2 y 3. Descargar, verificar y preparar -------------------------------------
async function download() {
  if (!release || ['downloading', 'ready'].includes(state.status)) return state;
  const dir = path.join(app.getPath('temp'), `cv-manager-update-${release.version}`);
  const dmgPath = path.join(dir, release.dmg.name);
  const mount = path.join(dir, 'mnt');
  set({ status: 'downloading', progress: 0, error: undefined });
  try {
    await fsp.rm(dir, { recursive: true, force: true });
    await fsp.mkdir(mount, { recursive: true });

    // Descarga con progreso
    const res = await net.fetch(release.dmg.url, { headers: { 'User-Agent': headers()['User-Agent'] } });
    if (!res.ok || !res.body) throw new Error(`descarga ${res.status}`);
    const total = Number(res.headers.get('content-length')) || release.dmg.size || 0;
    const out = fs.createWriteStream(dmgPath);
    const hash = crypto.createHash('sha256');
    const reader = res.body.getReader();
    let got = 0;
    let lastPct = -1;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      hash.update(value);
      got += value.length;
      if (!out.write(value)) await new Promise((r) => out.once('drain', r));
      const pct = total ? Math.floor((got / total) * 100) : 0;
      if (pct !== lastPct) {
        lastPct = pct;
        set({ progress: pct });
      }
    }
    await new Promise((resolve, reject) => out.end((err) => (err ? reject(err) : resolve())));
    const digest = hash.digest('hex');

    // Integridad: el hash debe estar en el SHA256SUMS.txt del mismo release
    if (release.sums) {
      const sums = await (await net.fetch(release.sums, { headers: { 'User-Agent': headers()['User-Agent'] } })).text();
      if (!sums.toLowerCase().includes(digest)) throw new Error('checksum');
    }

    // Copiar la app desde el .dmg
    await run('hdiutil', ['attach', '-nobrowse', '-noautoopen', '-readonly', '-mountpoint', mount, dmgPath]);
    let appName;
    try {
      appName = (await fsp.readdir(mount)).find((f) => f.endsWith('.app'));
      if (!appName) throw new Error('no .app');
      await run('ditto', [path.join(mount, appName), path.join(dir, appName)]);
    } finally {
      await run('hdiutil', ['detach', mount, '-force']).catch(() => {});
    }
    const newApp = path.join(dir, appName);
    const { stdout } = await run('/usr/libexec/PlistBuddy', ['-c', 'Print CFBundleShortVersionString', path.join(newApp, 'Contents', 'Info.plist')]);
    if (stdout.trim() !== release.version) throw new Error(`versión ${stdout.trim()}`);
    await run('codesign', ['--verify', '--deep', newApp]);

    staged = newApp;
    release.dmgPath = dmgPath;
    installOnQuit = Boolean(bundlePath());
    set({ status: 'ready', progress: 100, canInstall: Boolean(bundlePath()) });
    return state;
  } catch (err) {
    set({ status: 'error', error: String(err.message || err) });
    return state;
  }
}

// --- 4. Instalar ------------------------------------------------------------------
/** ¿Se puede reemplazar la app instalada? (no en desarrollo, ni desde el .dmg, ni sin permisos) */
async function canReplace() {
  return canReplaceSync();
}

/** Reinicia ahora para actualizar. Si no se puede reemplazar, abre el instalador. */
async function installNow() {
  if (state.status !== 'ready' || !staged) return state;
  if (!(await canReplace())) {
    if (release && release.dmgPath) shell.openPath(release.dmgPath);
    installOnQuit = false;
    set({ status: 'manual' });
    return state;
  }
  installOnQuit = true;
  relaunch = true;
  app.quit(); // pasa por la confirmación de cambios sin guardar
  return state;
}

function canReplaceSync() {
  const target = bundlePath();
  if (!target || target.startsWith('/Volumes/')) return false;
  try {
    fs.accessSync(path.dirname(target), fs.constants.W_OK);
    fs.accessSync(target, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

/** Llamado en 'will-quit' (síncrono): deja corriendo un script que reemplaza la app
 *  cuando este proceso termina y, si se pidió, la vuelve a abrir. */
function applyOnQuit() {
  if (!installOnQuit || !staged || !canReplaceSync()) return;
  const target = bundlePath();
  const script = path.join(path.dirname(staged), 'install.sh');
  fs.writeFileSync(
    script,
    `#!/bin/bash
PID="$1"; NEW="$2"; TARGET="$3"; RELAUNCH="$4"
for _ in $(seq 1 120); do kill -0 "$PID" 2>/dev/null || break; sleep 0.5; done
BACKUP="\${TARGET%.app}.previous.app"
rm -rf "$BACKUP"
if mv "$TARGET" "$BACKUP" && ditto "$NEW" "$TARGET"; then
  rm -rf "$BACKUP"
else
  rm -rf "$TARGET"; mv "$BACKUP" "$TARGET"
fi
xattr -dr com.apple.quarantine "$TARGET" 2>/dev/null
rm -rf "$(dirname "$NEW")"
if [ "$RELAUNCH" = "1" ]; then open "$TARGET"; fi
`,
    { mode: 0o755 },
  );
  const child = spawn('/bin/bash', [script, String(process.pid), staged, target, relaunch ? '1' : '0'], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  installOnQuit = false;
}

function later() {
  if (state.status === 'available') set({ status: 'idle', dismissed: release && release.version });
}

function setAuto(auto) {
  savePrefs({ ...loadPrefs(), auto: Boolean(auto) });
  set({ auto: Boolean(auto) });
  if (auto && state.status === 'available') download();
}

/** Arranca: lee la preferencia y busca al abrir y cada 6 h. */
function start(onState) {
  listener = onState;
  state.auto = Boolean(loadPrefs().auto);
  setTimeout(() => check(), 4000);
  timer = setInterval(() => check(), CHECK_EVERY);
}

function stop() {
  if (timer) clearInterval(timer);
}

module.exports = {
  start,
  stop,
  check,
  download,
  installNow,
  applyOnQuit,
  later,
  setAuto,
  getState: () => state,
};
