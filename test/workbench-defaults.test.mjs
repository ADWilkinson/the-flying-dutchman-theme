// Regression: a workbench colour the theme never sets does not fall back to the
// palette — it falls back to VS Code's own registry default, and 29 of those
// defaults are hard-coded literals rather than derivations of the theme. Until
// this list was set, the Command Palette drew its group labels in stock
// `#3794FF`, the code-action bulb in stock `#FFCC00`, and the error activity
// badge in stock `#F14C4C`, straight through a palette whose whole rule is that
// nothing shouts.
//
// KEYS is the audit of `src/vs/platform/theme/common/colors/*.ts` on
// microsoft/vscode: every colour whose *dark* default is hard-coded rather than
// resolved from another colour. It is a fixture, not a live fetch, so the check
// stays offline and deterministic; refresh it when VS Code adds a colour.
//
// Deliberately absent, and not leaks:
//   listFilterWidget.outline   — defaults to transparent, so no colour appears
//   minimap.foregroundOpacity  — an opacity control, not a palette colour

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

// key -> the VS Code dark default it would otherwise inherit (recorded so a
// failure shows what would appear, not just which key went missing).
const KEYS = {
  'activityErrorBadge.background': '#f14c4c',
  'activityErrorBadge.foreground': '#000000',
  'activityWarningBadge.background': '#b27c00',
  'activityWarningBadge.foreground': '#ffffff',
  'chart.axis': '#bfbfbf66',
  'chart.guide': '#bfbfbf33',
  'chart.line': '#236b8e',
  'diffEditor.diagonalFill': '#cccccc33',
  'diffEditor.unchangedCodeBackground': '#74747429',
  'editor.compositionBorder': '#ffffff',
  'editor.snippetFinalTabstopHighlightBorder': '#525252',
  'editor.snippetTabstopHighlightBackground': '#7c7c7c4d',
  'editorInlayHint.foreground': '#969696',
  'editorLightBulb.foreground': '#ffcc00',
  'editorLightBulbAutoFix.foreground': '#75beff',
  'editorOverviewRuler.selectionHighlightForeground': '#a0a0a0cc',
  'inputOption.hoverBackground': '#5a5d5e80',
  'list.deemphasizedForeground': '#8c8c8c',
  'list.invalidItemForeground': '#b89500',
  'listFilterWidget.noMatchesOutline': '#be1100',
  'minimap.errorHighlight': '#ff1212b3',
  'pickerGroup.border': '#3f3f46',
  'pickerGroup.foreground': '#3794ff',
  'quickInputTitle.background': '#ffffff1b',
  'strongForeground': '#ffffff',
  'textBlockQuote.border': '#007acc80',
  'textPreformat.background': '#ffffff1a',
  'textSeparator.foreground': '#ffffff2e',
  'tree.tableColumnsBorder': '#cccccc20',
};

test('no workbench colour falls back to a VS Code stock default', async (t) => {
  assert.deepEqual(Object.keys(THEMES), variants, 'every variant needs checking');

  for (const [variant, rel] of Object.entries(THEMES)) {
    await t.test(rel, () => {
      const { colors } = JSON.parse(readFileSync(resolve(root, rel), 'utf8'));

      const unset = Object.keys(KEYS).filter((key) => !(key in colors));
      assert.deepEqual(unset, [], `unset, so VS Code's stock default shows through: ${unset.join(', ')}`);

      // Present is not enough: the value has to come from a palette role, or a
      // future edit could silently pin the stock literal it was meant to replace.
      // Compared on the role set rather than the literal, because high-contrast's
      // fgBright legitimately is #ffffff — the same hex as strongForeground's default.
      const roles = new Set(Object.values(palette(variant)));
      const offPalette = Object.keys(KEYS).filter((key) => !roles.has(colors[key].slice(0, 7)));
      assert.deepEqual(offPalette, [], `not a palette role: ${offPalette.join(', ')}`);

      for (const key of Object.keys(KEYS)) {
        assert.match(colors[key], /^#[0-9a-f]{6}([0-9a-f]{2})?$/, `${key} is not a lowercase hex colour`);
      }
    });
  }
});
