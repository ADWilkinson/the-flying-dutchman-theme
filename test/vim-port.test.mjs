// Regression: check:themes only proves the committed vim file matches the
// emitter, so a wrong mapping round-trips clean forever. 2.0.0 shipped a vim
// port whose `" this / self"` section re-emitted `Boolean` — the this/self
// role was silently missing, and one group was defined twice. The fix then
// emitted the Neovim treesitter group `@variable.builtin` unguarded, and Vim
// rejects `@` and `.` in a group name: `:colorscheme flying-dutchman` raised
// `W18: Invalid character in group name` for every Vim user.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { sublime, vim, vscodeTheme } from '../scripts/emitters.mjs';
import { palette } from '../scripts/palette.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 'vim/colors/flying-dutchman.vim';

// `highlight <group> guifg=... guibg=... gui=...` — one line per group, indented
// when it sits inside an `if has('nvim')` block.
function highlights(source) {
  const groups = new Map();
  for (const line of source.split('\n')) {
    const m = /^ *highlight (\S+) guifg=(\S+) guibg=(\S+) gui=(\S+)$/.exec(line);
    if (m) groups.set(m[1], { fg: m[2], bg: m[3], gui: m[4] });
  }
  return groups;
}

// Vim only accepts `[A-Za-z0-9_]` in a highlight group name. Neovim's treesitter
// groups (`@variable.builtin`) are legal there and nowhere else, so every one of
// them has to sit inside an `if has('nvim')` block. Returns the group names Vim
// itself would have to parse.
function unguardedGroups(source) {
  const names = [];
  let guarded = 0;
  for (const line of source.split('\n')) {
    if (/^if has\('nvim'\)$/.test(line)) guarded += 1;
    else if (/^endif$/.test(line)) guarded = Math.max(0, guarded - 1);
    else if (guarded === 0) {
      const m = /^ *highlight (\S+)/.exec(line);
      if (m && m[1] !== 'clear') names.push(m[1]);
    }
  }
  return names;
}

test('vim port', async (t) => {
  const p = palette('standard');
  const committed = readFileSync(resolve(root, PORT), 'utf8');

  await t.test('no highlight group is defined twice', () => {
    const names = [...committed.matchAll(/^ *highlight (\S+)/gm)].map((m) => m[1]);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    assert.deepEqual([...new Set(dupes)], [], 'a later definition silently overrides the first');
  });

  await t.test('every highlight line is well-formed', () => {
    const lines = committed.split('\n').filter((l) => /^ *highlight /.test(l) && l !== 'highlight clear');
    assert.ok(lines.length > 0);
    for (const line of lines) {
      assert.match(line, /^ *highlight \S+ guifg=(NONE|#[0-9a-f]{6}) guibg=(NONE|#[0-9a-f]{6}) gui=\S+$/, line);
    }
  });

  await t.test('every group Vim parses is a name Vim accepts', () => {
    const illegal = unguardedGroups(committed).filter((n) => !/^[A-Za-z0-9_]+$/.test(n));
    assert.deepEqual(illegal, [], 'Vim raises W18: Invalid character in group name');
  });

  await t.test('this / self carries the coral role, as in VS Code and Sublime', () => {
    const group = highlights(committed).get('@variable.builtin');
    assert.ok(group, 'the vim port defines no this/self group');
    assert.equal(group.fg, p.coral);
    assert.equal(group.gui, 'italic');

    // Neovim-only, so Vim never parses the name it would reject.
    assert.match(committed, /^if has\('nvim'\)\n  highlight @variable\.builtin .*\nendif$/m);

    // The other two ports that colour this/self must agree on the role.
    const rule = vscodeTheme('x', p).tokenColors.find((r) => r.scope?.includes?.('variable.language'));
    assert.equal(rule.settings.foreground, p.coral);
    assert.equal(rule.settings.fontStyle, 'italic');
    const sublimeThis = new RegExp(`<string>This</string>[\\s\\S]*?<string>variable\\.language</string>[\\s\\S]*?<string>${p.coral}</string>[\\s\\S]*?<string>italic</string>`);
    assert.match(sublime('x', p), sublimeThis);
  });

  await t.test('the detector would have caught the 2.0.0 break', () => {
    const broken = 'highlight Boolean guifg=#e0c471 guibg=NONE gui=NONE\nhighlight Boolean guifg=#e0c471 guibg=NONE gui=NONE';
    const names = [...broken.matchAll(/^ *highlight (\S+)/gm)].map((m) => m[1]);
    assert.deepEqual(names.filter((n, i) => names.indexOf(n) !== i), ['Boolean']);
    assert.equal(highlights(vim(p)).get('Boolean').fg, p.constant);
  });

  await t.test('the detector would have caught the unguarded treesitter group', () => {
    const broken = '" this / self\nhighlight @variable.builtin guifg=#e09585 guibg=NONE gui=italic';
    assert.deepEqual(unguardedGroups(broken), ['@variable.builtin']);
    assert.deepEqual(unguardedGroups(vim(p)).filter((n) => !/^[A-Za-z0-9_]+$/.test(n)), []);
  });
});
