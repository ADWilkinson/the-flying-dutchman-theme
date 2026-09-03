// Regression: the same defect the vim stock-default audit found, one variable
// over. The port set `g:terminal_color_0..15`, which only Neovim reads. Vim's
// own `:terminal` reads the `g:terminal_ansi_colors` list at term_start, and
// nothing falls back to the other name — so with the theme loaded, Vim 9.1
// still opened every terminal on its built-in row of saturated primaries:
//
//   :terminal  ->  red #e00000, green #00e000, magenta #ff40ff ...
//
// against a palette whose whole rule is that nothing shouts. The bright half
// was worse: #40ff40, #ffff40, #40ffff at full chroma next to a foreground
// tuned to 4.5:1. STOCK is what Vim renders with no colorscheme loaded,
// recorded so a failure shows what the user would actually see.
//
// Neovim was never affected and its variables are untouched.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { ansi, palette } from '../scripts/palette.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 'vim/colors/flying-dutchman.vim';

// Vim's built-in ANSI row, in ANSI order (`vim -u NONE` + term_getansicolors).
const STOCK = [
  '#000000', '#e00000', '#00e000', '#e0e000', '#0000e0', '#e000e0', '#00e0e0', '#e0e0e0',
  '#808080', '#ff4040', '#40ff40', '#ffff40', '#4040ff', '#ff40ff', '#40ffff', '#ffffff',
];

// The row the port is supposed to ship, in ANSI order. The vim port is built
// from the standard variant, like every other terminal port.
function expectedRow() {
  const c = ansi(palette('standard'));
  return [
    c.black, c.red, c.green, c.yellow, c.blue, c.magenta, c.cyan, c.white,
    c.brightBlack, c.brightRed, c.brightGreen, c.brightYellow, c.brightBlue,
    c.brightMagenta, c.brightCyan, c.brightWhite,
  ];
}

// Read `term_getansicolors()` out of a real Vim with the theme loaded — the
// only way to see whether Vim, rather than Neovim, actually picked the row up.
// Needs +terminal (term_start), +eval and +termguicolors; vim-tiny has none.
function vimTerminalRow() {
  const version = spawnSync('vim', ['--version'], { encoding: 'utf8' });
  if (version.status !== 0) return null;
  for (const feature of ['+eval', '+termguicolors', '+terminal']) {
    if (!version.stdout.includes(feature)) return null;
  }

  const dir = mkdtempSync(resolve(tmpdir(), 'fd-vim-term-'));
  const out = resolve(dir, 'ansi.txt');
  try {
    const run = spawnSync(
      'vim',
      [
        '-es', '-u', 'NONE', '-N',
        '--cmd', `set rtp+=${resolve(root, 'vim')}`,
        '-c', 'set termguicolors',
        '-c', 'colorscheme flying-dutchman',
        '-c', 'let g:b = term_start(["cat"], {"hidden": 1})',
        '-c', `redir! > ${out}`,
        '-c', 'silent echo join(term_getansicolors(g:b), " ")',
        '-c', 'redir END',
        '-c', 'qa!',
      ],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    assert.equal(run.status, 0, run.stdout + run.stderr);
    return readFileSync(out, 'utf8').trim().split(/\s+/).map((hex) => hex.toLowerCase());
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('the vim port gives Vim’s :terminal the theme’s ANSI row', async (t) => {
  const committed = readFileSync(resolve(root, PORT), 'utf8');
  const expected = expectedRow();

  await t.test('the port sets the list Vim reads, not just Neovim’s variables', () => {
    const m = /^let g:terminal_ansi_colors = \[(.*)\]$/m.exec(committed);
    assert.ok(m, 'g:terminal_ansi_colors is unset, so Vim opens :terminal on its stock primaries');
    const row = m[1].split(', ').map((hex) => hex.replace(/"/g, '').toLowerCase());
    assert.deepEqual(row, expected, 'the Vim list drifted from the palette’s ANSI row');
  });

  await t.test('Neovim’s per-index variables still carry the same row', () => {
    const row = expected.map((_, i) => {
      const m = new RegExp(`^let g:terminal_color_${i} = "(#[0-9a-f]{6})"$`, 'm').exec(committed);
      return m && m[1].toLowerCase();
    });
    assert.deepEqual(row, expected, 'the two editors would disagree about the terminal palette');
  });

  await t.test('no colour in either row is one of Vim’s built-in primaries', () => {
    const stock = new Set(STOCK);
    assert.deepEqual(expected.filter((hex) => stock.has(hex)), []);
  });

  await t.test('Vim itself opens a terminal on the palette row', (ctx) => {
    const row = vimTerminalRow();
    if (!row) return ctx.skip('no vim with +eval, +termguicolors and +terminal on this machine');
    assert.notDeepEqual(row, STOCK, 'Vim still renders its own built-in ANSI row');
    assert.deepEqual(row, expected);
  });
});
