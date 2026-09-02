import sharp from 'sharp';
import { copyFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(root, 'static', 'icon-source.svg');
const outDir = path.join(root, 'static', 'icons');
const staticDir = path.join(root, 'static');
const assetFavicon = path.join(root, 'src', 'lib', 'assets', 'favicon.svg');

await mkdir(outDir, { recursive: true });

// Copy vector favicon to static root and lib assets
await copyFile(source, path.join(staticDir, 'favicon.svg'));
await copyFile(source, assetFavicon);
console.log('Synchronized favicon.svg');

// Icon targets
const targets = [
	{ dest: path.join(outDir, 'icon-192.png'), size: 192 },
	{ dest: path.join(outDir, 'icon-512.png'), size: 512 },
	{ dest: path.join(outDir, 'icon-maskable-512.png'), size: 512 },
	{ dest: path.join(staticDir, 'favicon.png'), size: 48 },
	{ dest: path.join(staticDir, 'apple-touch-icon.png'), size: 180 }
];

for (const { dest, size } of targets) {
	await sharp(source, { density: 384 }).resize(size, size).png().toFile(dest);
	console.log(`Generated ${path.relative(root, dest)}`);
}
