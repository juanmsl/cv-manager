// Instala el ejecutable de Electron en macOS usando `ditto` (la herramienta
// nativa de Apple para descomprimir). El instalador oficial de Electron usa
// extract-zip, que en algunas versiones recientes de Node termina antes de
// tiempo y deja Electron.app a medias: sin path.txt y sin firma válida
// (macOS lo marca como software malicioso). Después se firma ad-hoc.
//
//   node scripts/instalar-electron.mjs           repara solo si hace falta
//   node scripts/instalar-electron.mjs --force   descarga de nuevo sin caché
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

if (process.platform !== 'darwin') process.exit(0); // en otros sistemas basta el instalador oficial

// En el monorepo pnpm instala las dependencias en el node_modules de la raíz
// (node-linker=hoisted), así que Electron se busca con la resolución de Node.
let eDir;
try {
  eDir = path.dirname(createRequire(import.meta.url).resolve('electron/package.json'));
} catch {
  console.error('✖ Electron is not installed. Run first: pnpm install');
  process.exit(1);
}

const req = createRequire(path.join(eDir, 'package.json'));
const { version } = req('./package.json');
const dist = path.join(eDir, 'dist');
const exe = 'Electron.app/Contents/MacOS/Electron';
const force = process.argv.includes('--force');

const pathTxt = path.join(eDir, 'path.txt');
const complete = () =>
  fs.existsSync(path.join(dist, exe)) &&
  fs.existsSync(path.join(dist, 'Electron.app/Contents/Frameworks/Electron Framework.framework')) &&
  fs.existsSync(path.join(dist, 'Electron.app/Contents/Info.plist')) &&
  fs.existsSync(pathTxt) &&
  fs.readFileSync(pathTxt, 'utf8') === exe;

if (complete() && !force) process.exit(0);

console.log(`\n• Instalando Electron ${version} para macOS (${process.arch})…`);
const { downloadArtifact } = req('@electron/get');
const zip = await downloadArtifact({
  version,
  artifactName: 'electron',
  platform: 'darwin',
  arch: process.arch,
  force,
  checksums: req('./checksums.json'),
});

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);
execFileSync('ditto', ['-x', '-k', zip, dist], { stdio: 'inherit' });
execFileSync('xattr', ['-cr', path.join(dist, 'Electron.app')]); // sin cuarentena
fs.writeFileSync(pathTxt, exe);

// El zip oficial no trae el sello de recursos (_CodeSignature), así que la
// firma original no se puede verificar. Se vuelve a firmar "ad-hoc" en este
// Mac: es lo que macOS necesita para abrir Electron en modo desarrollo.
const app = path.join(dist, 'Electron.app');
try {
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'pipe' });
  execFileSync('codesign', ['--verify', '--deep', '--strict', app], { stdio: 'pipe' });
  console.log('✔ Electron instalado y firmado\n');
} catch (e) {
  console.error('✖ No se pudo firmar Electron:\n' + String(e.stderr || e.message));
  process.exit(1);
}
