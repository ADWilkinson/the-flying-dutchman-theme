#!/usr/bin/env node
// Build every editor theme from the master palette.
// Usage: node scripts/build-themes.mjs [--check]
//   --check  print a WCAG contrast report and verify committed outputs match
//            the palette/emitters. Read-only: never writes or repairs files.
//            Exits non-zero on AA failures or stale/missing generated files.

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { palette, variants } from './palette.mjs';
import { vscodeTheme, ghostty, warp, windowsTerminal, iterm, vim, sublime } from './emitters.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const write = (rel, contents) => {
  const path = resolve(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  return rel;
};
const json = (obj) => JSON.stringify(obj, null, 2) + '\n';

const DISPLAY = {
  standard: 'The Flying Dutchman',
  'high-contrast': 'The Flying Dutchman High Contrast',
  soft: 'The Flying Dutchman Soft',
};
const FILE = {
  standard: 'themes/flying-dutchman-color-theme.json',
  'high-contrast': 'themes/flying-dutchman-high-contrast.json',
  soft: 'themes/flying-dutchman-soft.json',
};

// --- WCAG contrast ------------------------------------------------------
const lin = (v) => {
  v /= 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = (hex) => {
  const r = lin(parseInt(hex.slice(1, 3), 16));
  const g = lin(parseInt(hex.slice(3, 5), 16));
  const b = lin(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const l1 = lum(a);
  const l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

function report() {
  const roles = ['fg', 'fgBright', 'fgMuted', 'fgDim', 'keyword', 'string', 'func', 'type', 'constant', 'property', 'coral', 'error', 'warn', 'info', 'green'];
  let failures = 0;
  for (const v of variants) {
    const p = palette(v);
    console.log(`\n  ${DISPLAY[v]}  (editor bg ${p.bg})`);
    for (const role of roles) {
      const ratio = contrast(p[role], p.bg);
      // Comments/punctuation are held to AA-large (3:1); body text & syntax to AA (4.5:1).
      const large = role === 'fgDim' || role === 'fgFaint';
      const min = large ? 3 : 4.5;
      const ok = ratio >= min;
      if (!ok) failures++;
      const tag = ok ? 'ok  ' : 'FAIL';
      console.log(`    ${tag} ${role.padEnd(9)} ${p[role]}  ${ratio.toFixed(2)}:1  (min ${min})`);
    }
  }
  return failures;
}

// --- artifacts ----------------------------------------------------------
// One in-memory list drives both write and check so they cannot diverge.
function artifacts() {
  const out = [];
  for (const v of variants) {
    out.push([FILE[v], json(vscodeTheme(DISPLAY[v], palette(v)))]);
  }
  const std = palette('standard');
  const name = 'The Flying Dutchman';
  out.push(['ghostty/The-Flying-Dutchman', ghostty(std)]);
  out.push(['warp/the-flying-dutchman.yaml', warp(name, std)]);
  out.push(['windows-terminal/The-Flying-Dutchman.json', json(windowsTerminal(name, std))]);
  out.push(['iterm/The-Flying-Dutchman.itermcolors', iterm(std)]);
  out.push(['vim/colors/flying-dutchman.vim', vim(std)]);
  out.push(['sublime-text/The-Flying-Dutchman.tmTheme', sublime(name, std)]);
  return out;
}

function build() {
  return artifacts().map(([rel, contents]) => write(rel, contents));
}

// Read-only: compare committed files to the in-memory expected output.
// Never creates, overwrites, or repairs anything on disk.
function checkArtifacts() {
  const missing = [];
  const stale = [];
  for (const [rel, contents] of artifacts()) {
    const path = resolve(root, rel);
    if (!existsSync(path)) {
      missing.push(rel);
      continue;
    }
    let actual;
    try {
      actual = readFileSync(path);
    } catch {
      stale.push(rel);
      continue;
    }
    if (!actual.equals(Buffer.from(contents))) stale.push(rel);
  }
  return { missing, stale };
}

const checkOnly = process.argv.includes('--check');
if (!checkOnly) {
  const written = build();
  console.log('Wrote:');
  for (const f of written) console.log(`  ${f}`);
}

let drift = 0;
if (checkOnly) {
  const { missing, stale } = checkArtifacts();
  if (missing.length || stale.length) {
    drift = 1;
    console.log('Generated outputs do not match the palette and emitters:');
    for (const f of missing) console.log(`  missing  ${f}`);
    for (const f of stale) console.log(`  stale    ${f}`);
    console.log('\nRun `npm run build:themes` to regenerate, then commit the result.');
  } else {
    console.log(`All ${artifacts().length} generated file(s) match the palette and emitters.`);
  }
}

console.log('\nWCAG contrast (syntax & text vs editor background):');
const failures = report();
console.log(`\n${failures === 0 ? 'All roles pass their WCAG target.' : `${failures} role(s) below target.`}`);
process.exit(checkOnly && (failures || drift) ? 1 : 0);
