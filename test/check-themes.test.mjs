// Regression: --check is read-only and fails on stale or missing outputs.
// Subtests are awaited so they stay sequential if the runner is concurrent.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const script = resolve(root, 'scripts/build-themes.mjs');

const GENERATED = [
  'themes/flying-dutchman-color-theme.json',
  'themes/flying-dutchman-high-contrast.json',
  'themes/flying-dutchman-soft.json',
  'ghostty/The-Flying-Dutchman',
  'warp/the-flying-dutchman.yaml',
  'windows-terminal/The-Flying-Dutchman.json',
  'iterm/The-Flying-Dutchman.itermcolors',
  'vim/colors/flying-dutchman.vim',
  'sublime-text/The-Flying-Dutchman.tmTheme',
];

function snapshot() {
  const files = {};
  for (const rel of GENERATED) {
    const path = resolve(root, rel);
    files[rel] = existsSync(path) ? readFileSync(path) : null;
  }
  return files;
}

function assertSnapshotEqual(before, after, message) {
  assert.deepEqual(Object.keys(after), Object.keys(before), message);
  for (const rel of Object.keys(before)) {
    if (before[rel] === null) {
      assert.equal(after[rel], null, `${rel} should still be missing`);
    } else {
      assert.ok(after[rel] && before[rel].equals(after[rel]), `${rel} was modified`);
    }
  }
}

function runCheck() {
  return spawnSync(process.execPath, [script, '--check'], {
    cwd: root,
    encoding: 'utf8',
  });
}

test('generated-artifact check', async (t) => {
  await t.test('clean tree passes and writes nothing', () => {
    const before = snapshot();
    const result = runCheck();
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /match the palette and emitters/);
    assert.match(result.stdout, /WCAG contrast/);
    assertSnapshotEqual(before, snapshot(), 'check mode must not rewrite a clean tree');
  });

  await t.test('stale generated file fails without being repaired', () => {
    const targetRel = 'ghostty/The-Flying-Dutchman';
    const target = resolve(root, targetRel);
    const original = readFileSync(target);
    const drifted = Buffer.concat([original, Buffer.from('\n# drifted\n')]);
    writeFileSync(target, drifted);
    try {
      const before = snapshot();
      const result = runCheck();
      assert.notEqual(result.status, 0);
      assert.match(`${result.stdout}\n${result.stderr}`, /stale\s+ghostty\/The-Flying-Dutchman/);
      assertSnapshotEqual(before, snapshot(), 'check mode must not repair a stale file');
      assert.ok(readFileSync(target).equals(drifted));
    } finally {
      writeFileSync(target, original);
    }
  });

  await t.test('missing generated file fails without being created', () => {
    const targetRel = 'warp/the-flying-dutchman.yaml';
    const target = resolve(root, targetRel);
    const original = readFileSync(target);
    unlinkSync(target);
    try {
      const before = snapshot();
      const result = runCheck();
      assert.notEqual(result.status, 0);
      assert.match(`${result.stdout}\n${result.stderr}`, /missing\s+warp\/the-flying-dutchman.yaml/);
      assert.equal(existsSync(target), false, 'check mode must not recreate a missing file');
      assertSnapshotEqual(before, snapshot(), 'check mode must not create missing files');
    } finally {
      writeFileSync(target, original);
    }
  });
});
