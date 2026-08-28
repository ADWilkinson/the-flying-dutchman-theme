// Regression: check:themes only proves the committed vim file matches the
// emitter, so a wrong mapping round-trips clean forever. 2.0.0 shipped a vim
// port whose `" this / self"` section re-emitted `Boolean` — the this/self
// role was silently missing, and one group was defined twice.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { sublime, vim, vscodeTheme } from '../scripts/emitters.mjs';
import { palette } from '../scripts/palette.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 'vim/colors/flying-dutchman.vim';

// `highlight <group> guifg=... guibg=... gui=...` — one line per group.
function highlights(source) {
  const groups = new Map();
  for (const line of source.split('\n')) {
    const m = /^highlight (\S+) guifg=(\S+) guibg=(\S+) gui=(\S+)$/.exec(line);
    if (m) groups.set(m[1], { fg: m[2], bg: m[3], gui: m[4] });
  }
  return groups;
}

test('vim port', async (t) => {
  const p = palette('standard');
  const committed = readFileSync(resolve(root, PORT), 'utf8');

  await t.test('no highlight group is defined twice', () => {
    const names = [...committed.matchAll(/^highlight (\S+)/gm)].map((m) => m[1]);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    assert.deepEqual([...new Set(dupes)], [], 'a later definition silently overrides the first');
  });

  await t.test('every highlight line is well-formed', () => {
    const lines = committed.split('\n').filter((l) => l.startsWith('highlight ') && l !== 'highlight clear');
    assert.ok(lines.length > 0);
    for (const line of lines) {
      assert.match(line, /^highlight \S+ guifg=(NONE|#[0-9a-f]{6}) guibg=(NONE|#[0-9a-f]{6}) gui=\S+$/, line);
    }
  });

  await t.test('this / self carries the coral role, as in VS Code and Sublime', () => {
    const group = highlights(committed).get('@variable.builtin');
    assert.ok(group, 'the vim port defines no this/self group');
    assert.equal(group.fg, p.coral);
    assert.equal(group.gui, 'italic');

    // The other two ports that colour this/self must agree on the role.
    const rule = vscodeTheme('x', p).tokenColors.find((r) => r.scope?.includes?.('variable.language'));
    assert.equal(rule.settings.foreground, p.coral);
    assert.equal(rule.settings.fontStyle, 'italic');
    const sublimeThis = new RegExp(`<string>This</string>[\\s\\S]*?<string>variable\\.language</string>[\\s\\S]*?<string>${p.coral}</string>[\\s\\S]*?<string>italic</string>`);
    assert.match(sublime('x', p), sublimeThis);
  });

  await t.test('the detector would have caught the 2.0.0 break', () => {
    const broken = 'highlight Boolean guifg=#e0c471 guibg=NONE gui=NONE\nhighlight Boolean guifg=#e0c471 guibg=NONE gui=NONE';
    const names = [...broken.matchAll(/^highlight (\S+)/gm)].map((m) => m[1]);
    assert.deepEqual(names.filter((n, i) => names.indexOf(n) !== i), ['Boolean']);
    assert.equal(highlights(vim(p)).get('Boolean').fg, p.constant);
  });
});
