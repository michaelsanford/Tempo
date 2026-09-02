import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const source = path.join(root, 'static', 'icon-source.svg');
const outDir = path.join(root, 'static', 'icons');

await mkdir(outDir, { recursive: true });

const targets = [
	{ file: 'icon-192.png', size: 192 },
	{ file: 'icon-512.png', size: 512 },
	{ file: 'icon-maskable-512.png', size: 512 }
];

for (const { file, size } of targets) {
	await sharp(source, { density: 384 }).resize(size, size).png().toFile(path.join(outDir, file));
	console.log(`Generated ${file}`);
}
