// Regression: the same defect the workbench and Vim audits found, one port over.
// A .tmTheme carries a fixed, documented set of global settings, and Sublime
// draws every one the scheme omits from its own built-in fallback rather than
// from this palette. The port defined 11 of the 24 colour keys, so:
//
//   match_brackets            -> the matching bracket drew in Sublime's colour
//   match_tags                -> the matching tag drew in Sublime's colour
//   draw_indent_guides        -> inactive and parent guides fell back
//   a second, unfocused pane  -> its selection fell back
//   spell_check               -> the squiggle fell back
//   highlight_modified_tabs   -> the dirty-tab dot fell back
//
// REQUIRED is the documented global colour list from
// sublimetext.com/docs/color_schemes_tmtheme.html, less the two exclusions the
// emitter names (popupCss / phantomCss are CSS blobs, shadowWidth is a length).
//
// Deliberately absent from REQUIRED, and not leaks:
//   invisibles  — a legacy TextMate key Sublime still honours but no longer
//                 documents; the port sets it anyway, so it is checked below

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { palette } from '../scripts/palette.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 'sublime-text/The-Flying-Dutchman.tmTheme';

const REQUIRED = [
  'background', 'foreground', 'caret', 'lineHighlight',
  'misspelling', 'minimapBorder', 'accent',
  'gutter', 'gutterForeground',
  'selection', 'selectionForeground', 'selectionBorder',
  'inactiveSelection', 'inactiveSelectionForeground',
  'highlight', 'findHighlight', 'findHighlightForeground',
  'guide', 'activeGuide', 'stackGuide',
  'bracketsForeground', 'bracketContentsForeground', 'tagsForeground',
  'shadow',
];

// Sublime only paints these foregrounds in the style its sibling *Options key
// asks for, so a foreground without options is set but never drawn.
const NEEDS_OPTIONS = {
  bracketsForeground: 'bracketsOptions',
  bracketContentsForeground: 'bracketContentsOptions',
  tagsForeground: 'tagsOptions',
};

const OPTION_VALUES = new Set(['underline', 'stippled_underline', 'squiggly_underline', 'foreground']);

// Every hex the palette can legitimately produce, across all three variants and
// the terminal row, so the check is "did this come from us" rather than a
// hand-listed set of allowed values.
function paletteHexes() {
  const hexes = new Set();
  for (const variant of ['standard', 'high-contrast', 'soft']) {
    for (const value of Object.values(palette(variant))) {
      if (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)) hexes.add(value.toLowerCase());
    }
  }
  return hexes;
}

// The global settings are the first <dict> in the settings array — the only one
// with no <key>name</key>/<key>scope</key> of its own.
function globalSettings(xml) {
  const start = xml.indexOf('<key>settings</key>');
  const open = xml.indexOf('<dict>', xml.indexOf('<dict>', start) + 1);
  const end = xml.indexOf('</dict>', open);
  assert.ok(open > 0 && end > open, 'could not locate the global settings dict');
  const body = xml.slice(open, end);
  const found = {};
  for (const m of body.matchAll(/<key>([^<]+)<\/key>\s*<string>([^<]*)<\/string>/g)) found[m[1]] = m[2];
  return found;
}

test('the Sublime port sets every documented global setting', async (t) => {
  const settings = globalSettings(readFileSync(resolve(root, PORT), 'utf8'));

  await t.test('no documented colour key falls back to a Sublime default', () => {
    const missing = REQUIRED.filter((key) => !(key in settings));
    assert.deepEqual(missing, [], `${PORT} leaves these to Sublime's own defaults: ${missing.join(', ')}`);
  });

  await t.test('every colour comes from the palette', () => {
    const hexes = paletteHexes();
    const foreign = [];
    for (const key of [...REQUIRED, 'invisibles']) {
      const value = settings[key];
      // A fully transparent shadow is the port's way of saying "no shadow",
      // matching the VS Code theme's own `scrollbar.shadow: #00000000`.
      if (value === '#00000000') continue;
      if (!hexes.has(value.toLowerCase())) foreign.push(`${key}=${value}`);
    }
    assert.deepEqual(foreign, [], `${PORT} sets colours the palette never produces: ${foreign.join(', ')}`);
  });

  await t.test('every conditional foreground has the options that draw it', () => {
    for (const [fg, opts] of Object.entries(NEEDS_OPTIONS)) {
      assert.ok(settings[opts], `${fg} is set but ${opts} is not, so Sublime never draws it`);
      for (const word of settings[opts].split(' ')) {
        assert.ok(OPTION_VALUES.has(word), `${opts} has an undocumented value: ${word}`);
      }
    }
  });
});
