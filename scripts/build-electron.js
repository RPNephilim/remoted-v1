import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = 'dist-electron';

// Only copy preload.js to preload.cjs (required for Electron preload)
const source = join(distDir, 'preload.js');
const target = join(distDir, 'preload.cjs');

if (existsSync(source)) {
  copyFileSync(source, target);
  console.log('✓ Created preload.cjs');
} else {
  console.warn('⚠ Warning: preload.js not found');
}

console.log('✓ Electron build complete');
