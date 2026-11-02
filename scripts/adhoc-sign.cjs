// Firma "ad-hoc" la app de macOS después de empaquetarla.
// Sin una firma válida, macOS (sobre todo en Apple Silicon) dice que la app
// está dañada o que no puede verificar que esté libre de malware.
// Esta firma basta para usarla en tu propio Mac; para distribuirla a otras
// personas hace falta un certificado Developer ID y notarización (ver README).
const { execFileSync } = require('node:child_process');
const path = require('node:path');

exports.default = async function adhocSign(context) {
  if (context.electronPlatformName !== 'darwin') return;
  const app = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
  console.log(`  • firmando ad-hoc ${app}`);
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' });
};
