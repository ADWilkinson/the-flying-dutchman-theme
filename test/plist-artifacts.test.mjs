// Regression: the .tmTheme and .itermcolors ports are XML, and check:themes only
// proves the committed bytes match the emitters — a malformed artifact round-trips
// clean forever. 2.0.0 shipped a Sublime theme that no XML parser would load,
// because the rule names "Number & Constant" and "Type & Class" wrote a bare `&`.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { iterm, sublime } from '../scripts/emitters.mjs';
import { palette } from '../scripts/palette.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const PLISTS = ['iterm/The-Flying-Dutchman.itermcolors', 'sublime-text/The-Flying-Dutchman.tmTheme'];

const ENTITY = /^&(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);/;

// Everything outside a <tag> is a text node. Report the offending line so a
// failure names the rule that broke rather than just the file.
function textNodeFaults(xml) {
  const faults = [];
  let line = 1;
  let inTag = false;
  for (let i = 0; i < xml.length; i += 1) {
    const ch = xml[i];
    if (ch === '\n') line += 1;
    if (ch === '<') {
      inTag = true;
      continue;
    }
    if (ch === '>') {
      if (!inTag) faults.push(`line ${line}: bare '>' in text`);
      inTag = false;
      continue;
    }
    if (inTag) continue;
    if (ch === '&' && !ENTITY.test(xml.slice(i))) faults.push(`line ${line}: bare '&' in text`);
  }
  return faults;
}

test('generated plist ports are well-formed XML', async (t) => {
  for (const rel of PLISTS) {
    await t.test(`${rel} escapes every text node`, () => {
      const faults = textNodeFaults(readFileSync(resolve(root, rel), 'utf8'));
      assert.deepEqual(faults, [], `${rel}:\n${faults.join('\n')}`);
    });
  }

  await t.test('the detector would have caught the 2.0.0 break', () => {
    assert.deepEqual(textNodeFaults('<string>Number & Constant</string>'), ["line 1: bare '&' in text"]);
    assert.deepEqual(textNodeFaults('<string>Number &amp; Constant</string>'), []);
  });
});

test('plist emitters escape interpolated text', async (t) => {
  const p = palette('standard');

  await t.test('sublime escapes the theme name and every rule name', () => {
    const out = sublime('Ampersand & <Angle>', p);
    assert.match(out, /<string>Ampersand &amp; &lt;Angle&gt;<\/string>/);
    assert.match(out, /<string>Number &amp; Constant<\/string>/);
    assert.match(out, /<string>Type &amp; Class<\/string>/);
    assert.deepEqual(textNodeFaults(out), []);
  });

  await t.test('iterm stays well-formed', () => {
    assert.deepEqual(textNodeFaults(iterm(p)), []);
  });
});
