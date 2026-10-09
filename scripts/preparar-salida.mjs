/**
 * Copia la página estática a dist/ para que Railway pueda publicarla.
 * Railpack espera esa carpeta al armar la imagen.
 */
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const destino = join(raiz, 'dist');
const piezas = ['index.html', 'proyecto.html', 'config.js', 'favicon.svg', 'css', 'js', 'assets'];

rmSync(destino, { recursive: true, force: true });
mkdirSync(destino, { recursive: true });
for (const pieza of piezas) {
  cpSync(join(raiz, pieza), join(destino, pieza), { recursive: true });
}
