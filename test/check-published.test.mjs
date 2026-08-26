// Regression: drift between package.json and the served Marketplace version is
// always reported, and an unreachable gallery is reported rather than assumed healthy.
// No network: fetchPublished is driven with a stub.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  assess,
  compareVersions,
  fetchPublished,
  latestVersion,
  parseVersion,
} from '../scripts/check-published.mjs';

const galleryBody = (versions) => ({
  results: [{ extensions: [{ versions: versions.map((version) => ({ version })) }] }],
});

const stubFetch = (body, { ok = true, status = 200 } = {}) => async () => ({
  ok,
  status,
  json: async () => body,
});

test('version parsing and ordering', async (t) => {
  await t.test('accepts plain dotted releases', () => {
    assert.deepEqual(parseVersion('2.0.2'), [2, 0, 2]);
    assert.deepEqual(parseVersion(' 1.4 '), [1, 4]);
  });

  await t.test('refuses anything it cannot order', () => {
    for (const tag of ['2.0.2-rc.1', 'v2.0.2', '', 'latest', undefined, null, 2]) {
      assert.equal(parseVersion(tag), null, `${tag} should be unparseable`);
    }
  });

  await t.test('orders by numeric segment, not string', () => {
    assert.equal(compareVersions('2.0.10', '2.0.9'), 1);
    assert.equal(compareVersions('2.0.0', '2.0'), 0);
    assert.equal(compareVersions('1.4.0', '2.0.0'), -1);
    assert.equal(compareVersions('2.0.2', 'v2'), null);
  });
});

test('latestVersion picks the max, not the first', () => {
  assert.equal(latestVersion([{ version: '1.4.0' }, { version: '2.0.0' }, { version: '1.3.1' }]), '2.0.0');
  assert.equal(latestVersion([{ version: '2.0.2-rc.1' }, { version: '2.0.0' }]), '2.0.0');
  assert.equal(latestVersion([]), null);
  assert.equal(latestVersion(undefined), null);
});

test('assess', async (t) => {
  await t.test('in sync is the only ok status', () => {
    const result = assess({ local: '2.0.2', published: '2.0.2' });
    assert.equal(result.status, 'in-sync');
    assert.equal(result.ok, true);
  });

  await t.test('source ahead of the listing is the six-week gap this exists to catch', () => {
    const result = assess({ local: '2.0.2', published: '2.0.0' });
    assert.equal(result.status, 'unpublished');
    assert.equal(result.ok, false);
    assert.equal(result.level, 'warning');
    assert.match(result.message, /2\.0\.2/);
    assert.match(result.message, /2\.0\.0/);
  });

  await t.test('listing ahead of source is also drift', () => {
    const result = assess({ local: '2.0.0', published: '2.0.2' });
    assert.equal(result.status, 'ahead-of-source');
    assert.equal(result.ok, false);
  });

  await t.test('an unreachable gallery is not healthy', () => {
    const result = assess({ local: '2.0.2', error: 'HTTP 503' });
    assert.equal(result.status, 'unreachable');
    assert.equal(result.ok, false);
    assert.match(result.message, /HTTP 503/);
  });

  await t.test('a silent gallery is not healthy either', () => {
    assert.equal(assess({ local: '2.0.2', published: null }).status, 'unknown');
    assert.equal(assess({ local: '2.0.2', published: null }).ok, false);
  });

  await t.test('unorderable versions are reported, not guessed', () => {
    const result = assess({ local: '2.0.2-rc.1', published: '2.0.0' });
    assert.equal(result.status, 'unknown');
    assert.equal(result.ok, false);
  });
});

test('fetchPublished', async (t) => {
  await t.test('asks the gallery for one extension by id', async () => {
    let seen;
    const spy = async (url, init) => {
      seen = { url, init };
      return { ok: true, status: 200, json: async () => galleryBody(['2.0.0']) };
    };
    const version = await fetchPublished('DavyJones.the-flying-dutchman-theme', spy);
    assert.equal(version, '2.0.0');
    assert.match(seen.url, /extensionquery$/);
    const body = JSON.parse(seen.init.body);
    assert.equal(body.filters[0].criteria[0].value, 'DavyJones.the-flying-dutchman-theme');
    assert.equal(body.filters[0].criteria[0].filterType, 7);
  });

  await t.test('throws on a non-ok response so the caller reports unreachable', async () => {
    await assert.rejects(
      fetchPublished('DavyJones.the-flying-dutchman-theme', stubFetch(null, { ok: false, status: 503 })),
      /HTTP 503/,
    );
  });

  await t.test('returns null when the extension is absent', async () => {
    const version = await fetchPublished('DavyJones.nope', stubFetch({ results: [{ extensions: [] }] }));
    assert.equal(version, null);
  });
});
