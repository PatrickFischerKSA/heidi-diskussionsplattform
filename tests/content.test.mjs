import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const data = await readFile(new URL('../app/data.ts', import.meta.url), 'utf8');
const app = await readFile(new URL('../app/DebatePlatform.tsx', import.meta.url), 'utf8');

test('enthält genau sechs nummerierte Diskussionsräume', () => {
  const ids = [...data.matchAll(/\bid:\s*([1-6]),/g)].map(match => Number(match[1]));
  assert.deepEqual(ids, [1, 2, 3, 4, 5, 6]);
});

test('enthält die geforderten didaktischen Werkzeuge', () => {
  for (const phrase of ['Textbeleg', 'Perspektivkarte', 'Kuratiertes Gegenargument', 'Welches Argument', 'localStorage']) {
    assert.ok(app.includes(phrase), `Fehlt: ${phrase}`);
  }
});

test('verwendet Schweizer Rechtschreibung in zentralen UI-Texten', () => {
  assert.equal((data + app).includes('ß'), false);
  assert.ok(app.includes('schliessen') || app.includes('Schliessen'));
});
