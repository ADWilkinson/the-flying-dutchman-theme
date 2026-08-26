#!/usr/bin/env node
// Compare the version in package.json against what the Marketplace actually serves.
// Usage: node scripts/check-published.mjs [--strict]
//   default  report only. Exits 0 whatever it finds, so a warning never blocks a merge.
//   --strict exits non-zero unless the served version equals package.json. Use this as
//            the readback after `npm run publish`.
//
// Nothing else in the repo notices when a merged fix is never published: main sat two
// releases ahead of the listing for six weeks with no signal. This is that signal.

import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GALLERY = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery';
const TIMEOUT_MS = 15000;

// --- pure logic ---------------------------------------------------------
// Kept free of fs and network so test/check-published.test.mjs never touches either.

// Returns an array of numbers, or null when the tag is not a plain x.y.z we can
// order. Prerelease and build suffixes are deliberately unparseable: this repo
// only ships plain releases, and guessing at ordering would be worse than saying
// so out loud.
export function parseVersion(tag) {
  if (typeof tag !== 'string' || !/^\d+(\.\d+)*$/.test(tag.trim())) return null;
  return tag.trim().split('.').map(Number);
}

// -1 | 0 | 1, or null when either side is unparseable.
export function compareVersions(a, b) {
  const x = parseVersion(a);
  const y = parseVersion(b);
  if (!x || !y) return null;
  for (let i = 0; i < Math.max(x.length, y.length); i += 1) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

// Highest parseable version in the gallery's list. The API returns newest-first
// today, but ordering is not part of its contract, so pick the max explicitly.
export function latestVersion(versions) {
  let best = null;
  for (const entry of versions ?? []) {
    const tag = typeof entry === 'string' ? entry : entry?.version;
    if (!parseVersion(tag)) continue;
    if (best === null || compareVersions(tag, best) === 1) best = tag;
  }
  return best;
}

// One place decides what every caller reports: status drives the exit code, the
// annotation level, and the wording.
export function assess({ local, published, error }) {
  if (error) {
    return {
      status: 'unreachable',
      ok: false,
      level: 'warning',
      message: `Could not read the Marketplace gallery API (${error}). Publish state is unknown, not healthy.`,
    };
  }
  if (!published) {
    return {
      status: 'unknown',
      ok: false,
      level: 'warning',
      message: 'The gallery returned no orderable version for this extension. Publish state is unknown, not healthy.',
    };
  }
  const cmp = compareVersions(local, published);
  if (cmp === null) {
    return {
      status: 'unknown',
      ok: false,
      level: 'warning',
      message: `Cannot order package.json ${local} against the served ${published}.`,
    };
  }
  if (cmp === 0) {
    return {
      status: 'in-sync',
      ok: true,
      level: 'notice',
      message: `Marketplace serves ${published}, matching package.json.`,
    };
  }
  if (cmp === 1) {
    return {
      status: 'unpublished',
      ok: false,
      level: 'warning',
      message:
        `package.json is ${local} but the Marketplace still serves ${published}. ` +
        'Every change since that release is unshipped. Run `npm run publish` (needs the publisher PAT).',
    };
  }
  return {
    status: 'ahead-of-source',
    ok: false,
    level: 'warning',
    message: `The Marketplace serves ${published}, ahead of package.json ${local}. Something published outside this repo.`,
  };
}

// --- io -----------------------------------------------------------------
export async function fetchPublished(extensionId, fetchImpl = fetch) {
  const response = await fetchImpl(GALLERY, {
    method: 'POST',
    headers: {
      Accept: 'application/json;api-version=3.0-preview.1',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filters: [{ criteria: [{ filterType: 7, value: extensionId }], pageSize: 1, pageNumber: 1 }],
      flags: 1,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = await response.json();
  return latestVersion(body?.results?.[0]?.extensions?.[0]?.versions);
}

function annotate({ level, message, status }) {
  if (!process.env.GITHUB_ACTIONS) return;
  const escaped = message.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  console.log(`::${level} title=Release drift (${status})::${escaped}`);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `**Release drift: ${status}** — ${message}\n`);
  }
}

// Only run when invoked directly, so importing for tests stays side-effect free.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const extensionId = `${pkg.publisher}.${pkg.name}`;

  let published = null;
  let error = null;
  try {
    published = await fetchPublished(extensionId);
  } catch (err) {
    error = err?.message ?? String(err);
  }

  const result = assess({ local: pkg.version, published, error });
  console.log(`Extension:   ${extensionId}`);
  console.log(`package.json ${pkg.version}`);
  console.log(`Marketplace  ${published ?? '(unknown)'}`);
  console.log(`\n${result.status}: ${result.message}`);
  annotate(result);

  process.exit(process.argv.includes('--strict') && !result.ok ? 1 : 0);
}
