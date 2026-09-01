// Regression: the same defect the workbench audit found, one port over. The
// colorscheme opens with `highlight clear`, which does not blank the highlight
// table — it restores Vim's *built-in* defaults. Every group the port never
// sets then draws in a hard-coded stock colour, straight through a palette
// whose whole rule is that nothing shouts:
//
//   :set wildmenu wildoptions=pum  -> the completion row was black on Yellow
//   :set foldcolumn=2              -> the fold gutter was Cyan on Grey
//   :terminal                      -> the status line sat on LightGreen
//   :set spell                     -> misspellings undercurled in pure Red
//
// STOCK is what Vim 9.1 renders for each of these with no colorscheme loaded
// (`vim -u NONE -c 'set termguicolors' -c highlight`), recorded so a failure
// shows what the user would actually see rather than just naming a key.
//
// Deliberately absent, and not leaks:
//   VisualNOS, LineNrAbove/Below  — cleared, so they inherit rather than
//                                   render a colour of their own
//   CurSearch, QuickFixLine,      — link into groups the port already sets
//   CursorLineSign, EndOfBuffer,
//   Pmenu{Kind,Extra}{,Sel}
//   ModeMsg                       — bold only, no colour

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { palette } from '../scripts/palette.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 'vim/colors/flying-dutchman.vim';

// group -> the Vim built-in gui default it would otherwise render.
const STOCK = {
  Conceal: 'guifg=LightGrey guibg=DarkGrey',
  CursorColumn: 'guibg=Grey40',
  FoldColumn: 'guifg=Cyan guibg=Grey',
  MoreMsg: 'guifg=SeaGreen',
  Question: 'guifg=Green',
  SpellBad: 'guisp=Red',
  SpellCap: 'guisp=Blue',
  SpellLocal: 'guisp=Cyan',
  SpellRare: 'guisp=Magenta',
  StatusLineTerm: 'guibg=LightGreen',
  StatusLineTermNC: 'guibg=LightGreen',
  ToolbarButton: 'guifg=Black guibg=LightGrey',
  ToolbarLine: 'guibg=Grey50',
  WildMenu: 'guifg=Black guibg=Yellow',
};

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

// `highlight <group> guifg=X guibg=Y gui=Z [guisp=S]`, indented inside a guard.
function guiColours(source) {
  const found = [];
  for (const line of source.split('\n')) {
    const m = /^ *highlight (\S+) (.*)$/.exec(line);
    if (!m || m[1] === 'clear') continue;
    for (const attr of m[2].matchAll(/gui(fg|bg|sp)=(\S+)/g)) {
      found.push({ group: m[1], attr: `gui${attr[1]}`, value: attr[2] });
    }
  }
  return found;
}

// Vim renders the whole table, not just what the colorscheme sets, so this is
// the only way to see the defaults leaking. Needs +eval (the `has('nvim')`
// guard) and +termguicolors (gui colours at all); vim-tiny has neither.
function vimHighlightDump() {
  const version = spawnSync('vim', ['--version'], { encoding: 'utf8' });
  if (version.status !== 0) return null;
  if (!/\+eval/.test(version.stdout) || !/\+termguicolors/.test(version.stdout)) return null;

  const dir = mkdtempSync(resolve(tmpdir(), 'fd-vim-'));
  const out = resolve(dir, 'highlight.txt');
  try {
    const run = spawnSync(
      'vim',
      [
        '-es', '-u', 'NONE', '-N',
        '--cmd', `set rtp+=${resolve(root, 'vim')}`,
        '-c', 'set termguicolors',
        '-c', 'colorscheme flying-dutchman',
        '-c', `redir! > ${out}`,
        '-c', 'silent highlight',
        '-c', 'redir END',
        '-c', 'qa!',
      ],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    assert.equal(run.status, 0, run.stdout + run.stderr);
    const raw = readFileSync(out, 'utf8');
    // `:highlight` wraps long entries onto indented continuation lines.
    const entries = [];
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue;
      if (line.startsWith('  ') && entries.length) entries[entries.length - 1] += ` ${line.trim()}`;
      else entries.push(line.trim());
    }
    return entries;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('the vim port sets every group Vim would otherwise draw from a stock default', async (t) => {
  const committed = readFileSync(resolve(root, PORT), 'utf8');
  const hexes = paletteHexes();

  await t.test('each recorded stock default is overridden', () => {
    const colours = guiColours(committed);
    const missing = Object.keys(STOCK).filter(
      (group) => !colours.some((c) => c.group === group && c.value !== 'NONE'),
    );
    assert.deepEqual(
      missing,
      [],
      missing.map((g) => `${g} still renders Vim's ${STOCK[g]}`).join('; '),
    );
  });

  await t.test('no gui colour in the port comes from outside the palette', () => {
    const foreign = guiColours(committed).filter(
      (c) => c.value !== 'NONE' && !hexes.has(c.value.toLowerCase()),
    );
    assert.deepEqual(foreign, [], 'a named or hand-typed colour bypassed palette.mjs');
  });

  await t.test('Vim itself renders no stock colour with the theme loaded', (ctx) => {
    const entries = vimHighlightDump();
    if (!entries) return ctx.skip('no vim with +eval and +termguicolors on this machine');

    const leaks = [];
    for (const entry of entries) {
      if (/ links to /.test(entry) || / cleared$/.test(entry)) continue;
      const group = entry.split(/\s+/)[0];
      for (const attr of entry.matchAll(/gui(fg|bg|sp)=(\S+)/g)) {
        const value = attr[2];
        if (value === 'NONE' || hexes.has(value.toLowerCase())) continue;
        leaks.push(`${group} gui${attr[1]}=${value}`);
      }
    }
    assert.deepEqual(leaks, [], 'these groups still render Vim built-in colours');
    assert.ok(entries.length > 50, 'the highlight dump looks truncated');
  });
});
