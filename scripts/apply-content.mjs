#!/usr/bin/env node
/**
 * Writes the texts edited in the "Textes du portfolio" artifact to the site.
 *
 *   node scripts/apply-content.mjs <file>    check <file> and write src/data/content.json
 *   node scripts/apply-content.mjs restore   put the previous content.json back
 *
 * <file> is the downloaded content.json, or the `content/site` document saved by
 * `ArtifactData get` with `out_dir` (raw body or `{ id, data, ... }`). The file must
 * keep the structure of the current content.json; list lengths may change.
 * Exit codes: 0 ok · 1 bad input.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'src/data/content.json');
const backup = path.join(root, '.publish/content.backup.json');
const [arg] = process.argv.slice(2);

if (arg === 'restore') {
	if (!fs.existsSync(backup)) {
		console.error('No backup to restore');
		process.exit(1);
	}
	fs.copyFileSync(backup, target);
	console.log('restored');
	process.exit(0);
}
if (!arg || !fs.existsSync(arg)) {
	console.error('Usage: node scripts/apply-content.mjs <file> | restore');
	process.exit(1);
}

const current = JSON.parse(fs.readFileSync(target, 'utf8'));
const raw = JSON.parse(fs.readFileSync(arg, 'utf8'));
const body = raw && typeof raw.data === 'object' && raw.data !== null && 'id' in raw ? raw.data : raw;

const problems = [];
function check(value, model, where) {
	if (Array.isArray(model)) {
		if (!Array.isArray(value)) return problems.push(`${where} : liste attendue`);
		return value.forEach((item, i) => check(item, model[0], `${where}[${i}]`));
	}
	if (model && typeof model === 'object') {
		if (!value || typeof value !== 'object') return problems.push(`${where} : bloc attendu`);
		return Object.keys(model).forEach((key) => check(value[key], model[key], `${where}.${key}`));
	}
	if (typeof value !== typeof model) problems.push(`${where} : texte attendu`);
}
Object.keys(current).forEach((key) => check(body[key], current[key], key));
if (!String(body.site?.name ?? '').trim()) problems.push('site.name : le nom est vide');
if (!/^\S+@\S+\.\S+$/.test(body.site?.email ?? '')) problems.push('site.email : adresse invalide');
if (problems.length) {
	console.error(problems.join('\n'));
	process.exit(1);
}

// Only the known blocks are kept; the menu links must keep pointing at their sections
const next = Object.fromEntries(Object.keys(current).map((key) => [key, body[key]]));
next.nav = current.nav.map((item, i) => ({ ...item, label: body.nav[i]?.label || item.label }));

fs.mkdirSync(path.dirname(backup), { recursive: true });
fs.copyFileSync(target, backup);
fs.writeFileSync(target, JSON.stringify(next, null, '\t') + '\n');
console.log('content ok');
