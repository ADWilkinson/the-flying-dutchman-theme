#!/usr/bin/env node
// Build every editor theme from the master palette.
// Usage: node scripts/build-themes.mjs [--check]
//   --check  print a WCAG contrast report and exit non-zero on AA failures

import { writeFileSync, mkdirSync } from 'node:fs';
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

// --- build --------------------------------------------------------------
function build() {
  const written = [];
  for (const v of variants) {
    written.push(write(FILE[v], json(vscodeTheme(DISPLAY[v], palette(v)))));
  }
  const std = palette('standard');
  const name = 'The Flying Dutchman';
  written.push(write('ghostty/The-Flying-Dutchman', ghostty(std)));
  written.push(write('warp/the-flying-dutchman.yaml', warp(name, std)));
  written.push(write('windows-terminal/The-Flying-Dutchman.json', json(windowsTerminal(name, std))));
  written.push(write('iterm/The-Flying-Dutchman.itermcolors', iterm(std)));
  written.push(write('vim/colors/flying-dutchman.vim', vim(std)));
  written.push(write('sublime-text/The-Flying-Dutchman.tmTheme', sublime(name, std)));
  return written;
}

const checkOnly = process.argv.includes('--check');
if (!checkOnly) {
  const written = build();
  console.log('Wrote:');
  for (const f of written) console.log(`  ${f}`);
}
console.log('\nWCAG contrast (syntax & text vs editor background):');
const failures = report();
console.log(`\n${failures === 0 ? 'All roles pass their WCAG target.' : `${failures} role(s) below target.`}`);
process.exit(checkOnly && failures ? 1 : 0);
