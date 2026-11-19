import { readFile, writeFile } from 'node:fs/promises';
const base = new URL('../', import.meta.url);
const {version} = JSON.parse(await readFile(new URL('package.json', base), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('Invalid app version');
const filename = `index_v${version}.html`;
const source = await readFile(new URL(`public/${filename}`, base),'utf8');
await writeFile(new URL('public/index.html', base),source.replace('<!doctype html>',`<!doctype html>\n<!-- GENERATED from ${filename} (v${version}) -->`));
