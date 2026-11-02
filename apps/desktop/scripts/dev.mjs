// Modo desarrollo: arranca Vite y abre Electron apuntando al servidor.
// Si el puerto 5173 está ocupado, Vite usa el siguiente libre.
import { createRequire } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'vite';

const require = createRequire(import.meta.url);

// Repara Electron automáticamente si quedó instalado a medias.
const fix = spawnSync(process.execPath, ['scripts/instalar-electron.mjs'], { stdio: 'inherit' });
if (fix.status !== 0) process.exit(fix.status ?? 1);

let electronBin;
try {
  electronBin = require('electron'); // ruta al ejecutable de Electron
} catch {
  console.error('\n✖ Electron no está instalado. Ejecuta:  pnpm reparar:electron\n');
  process.exit(1);
}

const server = await createServer({
  server: { host: '127.0.0.1', port: 5173, strictPort: false },
});
await server.listen();
server.printUrls();

const url = server.resolvedUrls.local[0];
const child = spawn(electronBin, ['.', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, VITE_DEV_SERVER_URL: url },
});

const stop = async (code = 0) => {
  await server.close();
  process.exit(code);
};
child.on('exit', (code) => stop(code ?? 0));
child.on('error', (err) => {
  console.error('\n✖ No se pudo abrir Electron:', err.message);
  stop(1);
});
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
