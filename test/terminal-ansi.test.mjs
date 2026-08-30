// Regression: the integrated terminal's ANSI row has to come from the variant
// the user actually picked. `ansi()` used to take a variant name and every one
// of its six call sites passed the literal 'standard', so High Contrast and
// Soft shipped Standard's bright row. The palette had an authored Soft bright
// row that was therefore dead code, and no High Contrast row at all.
//
// The visible failure was an inversion: in High Contrast, bright green
// (#84d2b4), yellow (#e5d49e) and cyan (#86cfd5) were *darker* than their own
// normal counterparts (#7fd7b5, #f6db88, #86dee4). Bold terminal output went
// duller than plain text, in the variant chosen for maximum contrast.
//
// `ansi()` now takes only a palette, so no caller can pass a wrong variant, and
// each variant's bright row lives in palette.mjs beside its other roles.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { palette, variants } from '../scripts/palette.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const THEMES = {
  standard: 'themes/flying-dutchman-color-theme.json',
  'high-contrast': 'themes/flying-dutchman-high-contrast.json',
  soft: 'themes/flying-dutchman-soft.json',
};

// The six chromatic pairs. Black/white are excluded: ansiBlack is a background
// tone and ansiWhite/BrightWhite are the fg roles, already covered elsewhere.
const CHROMATIC = ['Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan'];

const lin = (v) => {
  v /= 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = (hex) =>
  0.2126 * lin(parseInt(hex.slice(1, 3), 16)) +
  0.7152 * lin(parseInt(hex.slice(3, 5), 16)) +
  0.0722 * lin(parseInt(hex.slice(5, 7), 16));
const contrast = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

const colorsFor = (rel) => JSON.parse(readFileSync(resolve(root, rel), 'utf8')).colors;

test('every variant ships its own terminal ANSI row', async (t) => {
  assert.deepEqual(Object.keys(THEMES), variants, 'every variant needs checking');

  await t.test('bright is brighter than normal, in each variant', () => {
    for (const [variant, rel] of Object.entries(THEMES)) {
      const colors = colorsFor(rel);
      for (const name of CHROMATIC) {
        const normal = colors[`terminal.ansi${name}`];
        const bright = colors[`terminal.ansiBright${name}`];
        assert.ok(
          lum(bright) > lum(normal),
          `${variant}: ansiBright${name} ${bright} (${lum(bright).toFixed(3)}) is not brighter than ansi${name} ${normal} (${lum(normal).toFixed(3)})`,
        );
      }
    }
  });

  await t.test('no variant borrows another variant’s bright row', () => {
    const rows = Object.entries(THEMES).map(([variant, rel]) => {
      const colors = colorsFor(rel);
      return [variant, CHROMATIC.map((n) => colors[`terminal.ansiBright${n}`]).join(' ')];
    });
    for (const [a, rowA] of rows) {
      for (const [b, rowB] of rows) {
        if (a >= b) continue;
        assert.notEqual(rowA, rowB, `${a} and ${b} ship an identical bright row: ${rowA}`);
      }
    }
  });

  await t.test('the bright row is a palette role, not a literal', () => {
    for (const [variant, rel] of Object.entries(THEMES)) {
      const colors = colorsFor(rel);
      const roles = new Set(Object.values(palette(variant)));
      for (const name of CHROMATIC) {
        const key = `terminal.ansiBright${name}`;
        assert.ok(roles.has(colors[key]), `${variant}: ${key} ${colors[key]} is not a palette role`);
      }
    }
  });

  // ansiBlack is a background tone by design and is deliberately not held to
  // this; every other ANSI colour is text on the terminal background.
  await t.test('every ANSI colour but black clears AA on its own terminal background', () => {
    for (const [variant, rel] of Object.entries(THEMES)) {
      const colors = colorsFor(rel);
      const bg = colors['terminal.background'];
      const keys = Object.keys(colors).filter((k) => k.startsWith('terminal.ansi') && k !== 'terminal.ansiBlack');
      assert.equal(keys.length, 15, `${variant}: expected 15 non-black ANSI colours`);
      for (const key of keys) {
        const ratio = contrast(colors[key], bg);
        assert.ok(ratio >= 4.5, `${variant}: ${key} ${colors[key]} is ${ratio.toFixed(2)}:1 on ${bg} (min 4.5)`);
      }
    }
  });
});
