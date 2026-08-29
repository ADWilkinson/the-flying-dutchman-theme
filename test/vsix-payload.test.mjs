// Regression: `vsce` decides what users download from `.vscodeignore` alone —
// it never reads `.gitignore`. Anything sitting in the tree at publish time and
// not named there ships.
//
// That bit here: agent worktrees under `.worktrees/` are ignored by a
// machine-local global gitignore, so `git status` stays clean and nothing looks
// wrong, while `vsce package` swept a whole second copy of the repo — CLAUDE.md,
// .github/, scripts/, every port — into the vsix. 9 files / 30 KB became
// 35 files / 340 KB, and the only signal was a number nobody re-reads.
//
// So assert the payload itself rather than the ignore file: this is the exact
// list of what a user receives.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const vsce = resolve(root, 'node_modules/.bin/vsce');

const PAYLOAD = [
  'LICENSE',
  'README.md',
  'icon.png',
  'package.json',
  'themes/flying-dutchman-color-theme.json',
  'themes/flying-dutchman-high-contrast.json',
  'themes/flying-dutchman-soft.json',
];

function payload() {
  const result = spawnSync(vsce, ['ls'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .sort();
}

test('the vsix ships only the extension', async (t) => {
  await t.test('a clean tree packages exactly the theme payload', () => {
    assert.deepEqual(payload(), PAYLOAD);
  });

  await t.test('an agent worktree in the tree is not published', () => {
    const scratch = resolve(root, '.worktrees/scratch-vsix-payload-test');
    mkdirSync(resolve(scratch, 'themes'), { recursive: true });
    writeFileSync(resolve(scratch, 'package.json'), '{"name":"scratch"}\n');
    writeFileSync(resolve(scratch, 'themes/leaked.json'), '{}\n');
    try {
      assert.deepEqual(payload(), PAYLOAD, 'a scratch worktree leaked into the vsix');
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  });
});
