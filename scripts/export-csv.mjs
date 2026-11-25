// Exports speaker applications to exports/speaker-applications-<date>.csv. Usage: pnpm db:export
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

// Load .env from the project root when the variables aren't already set (Node 20.12+)
try {
  process.loadEnvFile(path.resolve(import.meta.dirname, '..', '.env'));
} catch {
  // no .env file: rely on the environment
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const columns = ['id', 'created_at', 'full_name', 'job_title', 'expertise', 'company', 'linkedin_url', 'bio', 'locale'];

const client = new pg.Client({ connectionString: url });
await client.connect();
const { rows } = await client.query(`SELECT ${columns.join(', ')} FROM speaker_applications ORDER BY created_at DESC`);
await client.end();

const cell = (v) => {
  if (v === null || v === undefined) return '';
  const s = v instanceof Date ? v.toISOString() : String(v);
  // Quote, escape quotes and neutralise spreadsheet formulas
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};
const lines = [columns.join(',')];
for (const r of rows) lines.push(columns.map((c) => cell(r[c])).join(','));

const outDir = path.resolve(import.meta.dirname, '..', 'exports');
await mkdir(outDir, { recursive: true });
const file = path.join(outDir, `speaker-applications-${new Date().toISOString().slice(0, 10)}.csv`);
// BOM so Excel opens Arabic text correctly
await writeFile(file, '﻿' + lines.join('\r\n'), 'utf8');
console.log(`wrote ${rows.length} rows to ${file}`);
