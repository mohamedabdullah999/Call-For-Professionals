// Builds the production bundle into release/ for the company server. Usage: pnpm release
//
// release/ = .next/standalone (server.js + traced node_modules) + public + .next/static
//          + db/migrations + scripts/migrate.mjs
// No .env, no source, no dev dependencies. On the server, ~/apps/speakerreg/ctl.sh runs it with
// the env from ~/apps/speakerreg/speakerreg.env:  node scripts/migrate.mjs, then node server.js
import { execFileSync } from 'node:child_process';
import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'release');

// Public URL and base path are baked in at build time. These win over anything in .env.
const SITE_URL = process.env.RELEASE_SITE_URL ?? 'https://global.expertslive.sa/speakerreg';
const BASE_PATH = process.env.RELEASE_BASE_PATH ?? '/speakerreg';

const fail = (msg) => {
  console.error(`\nrelease failed: ${msg}`);
  process.exit(1);
};

console.log(`building for ${SITE_URL} (basePath "${BASE_PATH}")…`);
execFileSync('pnpm', ['exec', 'next', 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production', NEXT_PUBLIC_SITE_URL: SITE_URL, NEXT_PUBLIC_BASE_PATH: BASE_PATH },
});

await rm(out, { recursive: true, force: true });
// verbatimSymlinks keeps pnpm's relative node_modules links working after the move
await cp(path.join(root, '.next/standalone'), out, { recursive: true, verbatimSymlinks: true });
await cp(path.join(root, 'public'), path.join(out, 'public'), { recursive: true });
await cp(path.join(root, '.next/static'), path.join(out, '.next/static'), { recursive: true });
await mkdir(path.join(out, 'db'), { recursive: true });
await cp(path.join(root, 'db/migrations'), path.join(out, 'db/migrations'), { recursive: true });
await mkdir(path.join(out, 'scripts'), { recursive: true });
await cp(path.join(root, 'scripts/migrate.mjs'), path.join(out, 'scripts/migrate.mjs'));
await rm(path.join(out, '.next/cache'), { recursive: true, force: true });

// Next copies the local .env into standalone output. It holds local secrets: never ship it.
for (const name of await readdir(out)) {
  if (name.startsWith('.env')) await rm(path.join(out, name), { force: true });
}

// What exactly is deployed (on the server: cat ~/apps/speakerreg/app/release.json)
let commit = 'unknown';
try {
  commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root }).toString().trim();
  if (execFileSync('git', ['status', '--porcelain'], { cwd: root }).toString().trim()) commit += '-dirty';
} catch {
  // not a git checkout
}
await writeFile(
  path.join(out, 'release.json'),
  JSON.stringify({ commit, builtAt: new Date().toISOString(), siteUrl: SITE_URL, basePath: BASE_PATH }, null, 2) + '\n',
);

// ---- sanity checks ----
const leftovers = (await readdir(out, { recursive: true })).filter((f) => /(^|\/)\.env/.test(f) && !f.includes('node_modules'));
if (leftovers.length) fail(`env files in release/: ${leftovers.join(', ')}`);
for (const f of ['server.js', 'scripts/migrate.mjs', 'db/migrations', 'public/favicon.png', '.next/static']) {
  await stat(path.join(out, f)).catch(() => fail(`missing ${f}`));
}
if ((await readdir(path.join(out, 'db/migrations'))).filter((f) => f.endsWith('.sql')).length === 0) fail('no migrations');
try {
  createRequire(path.join(out, 'scripts/migrate.mjs')).resolve('pg');
} catch {
  fail('pg is not resolvable from release/scripts/migrate.mjs');
}
for (const dir of ['src', 'node_modules/.bin', 'node_modules/typescript', 'node_modules/eslint']) {
  if (await stat(path.join(out, dir)).catch(() => null)) fail(`unexpected ${dir} in release/`);
}

console.log(`\nrelease/ ready (commit ${commit}). Deploy with: scripts/deploy.sh`);
