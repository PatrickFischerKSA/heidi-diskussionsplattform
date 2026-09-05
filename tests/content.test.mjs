import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const data = await readFile(new URL('../app/data.ts', import.meta.url), 'utf8');
const app = await readFile(new URL('../app/DebatePlatform.tsx', import.meta.url), 'utf8');
const letters = await readFile(new URL('../app/CorrespondenceMode.tsx', import.meta.url), 'utf8');
const cloud = await readFile(new URL('../app/CloudWorkspace.tsx', import.meta.url), 'utf8');
const route = await readFile(new URL('../app/api/learning-room/route.ts', import.meta.url), 'utf8');
const teacherGate = await readFile(new URL('../app/TeacherGate.tsx', import.meta.url), 'utf8');
const teacherAuth = await readFile(new URL('../app/api/teacher-auth/route.ts', import.meta.url), 'utf8');
const textLab = await readFile(new URL('../app/TextLab.tsx', import.meta.url), 'utf8');
const textLabData = await readFile(new URL('../app/textLabData.ts', import.meta.url), 'utf8');
const hosting = JSON.parse(await readFile(new URL('../.openai/hosting.json', import.meta.url), 'utf8'));

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

test('zweiter Modus besteht aus Beiträgen der Schüler*innen', () => {
  for (const figure of ['Heidi', 'Clara', 'Peter', 'Grossmama', 'Fräulein Rottenmeier', 'Dete', 'Herr Sesemann', 'Almöhi']) {
    assert.ok((letters + route).includes(figure), `Figur fehlt: ${figure}`);
  }
  for (const theme of ['Freundschaft', 'Eifersucht', 'Tiere', 'Bildung', 'Behinderung', 'Natur']) {
    assert.ok(route.includes(theme), `Thema fehlt: ${theme}`);
  }
  assert.ok(letters.includes('speechSynthesis'));
  assert.ok(letters.includes('Eigener Beitrag'));
  assert.ok(letters.includes('keine Aufgabe, keine Bewertung, keine Aufforderung'));
  assert.ok(route.includes("payload.action==='correspond'"));
  assert.ok(route.includes("amount%3===0"));
});

test('Cloud-Lernraum speichert Lernstände und Beiträge geschützt', () => {
  assert.equal(hosting.d1, 'DB');
  assert.ok(cloud.includes('Jetzt synchronisieren'));
  assert.ok(letters.includes('Kürzel'));
  assert.ok(route.includes("crypto.subtle.digest('SHA-256'"));
  assert.ok(route.includes("Authorization"));
  assert.ok(route.includes('.bind('));
  assert.ok(route.includes("allowedScopes = new Set(['debates','letters','textlab'])"));
  assert.ok(route.includes('correspondence_messages'));
});

test('Textlabor trainiert genaues Lesen an Heidi und Peter', () => {
  assert.ok(app.includes('Das Lesen lesen'));
  assert.equal([...textLabData.matchAll(/id:'(?:heidi|peter)-/g)].length, 6);
  for (const phrase of ['Lesen als fremde Pflicht','Ein Bild wird zum Lesemotiv','Buchstaben gewinnen Leben','«Kann nicht»','Buchstabieren, vormachen, wiederholen','Lesen bekommt einen Adressaten']) assert.ok(textLabData.includes(phrase), `Textfenster fehlt: ${phrase}`);
  for (const step of ['Beobachtung','Deutungshypothese','Gegenprobe','Textlupe']) assert.ok(textLab.includes(step), `Leseschritt fehlt: ${step}`);
  assert.ok(textLab.includes('aria-pressed'));
  assert.ok(cloud.includes("saveCloudState(credentials,'textlab'"));
});

test('Lehrpersonenbereich prüft das Passwort serverseitig', () => {
  assert.ok(app.includes('<TeacherGate>'));
  assert.ok(teacherGate.includes('Lehrpersonen-Zugang'));
  assert.ok(teacherGate.includes("sessionStorage.setItem"));
  assert.ok(teacherAuth.includes('TEACHER_PASSWORD'));
  assert.ok(teacherAuth.includes("name:'HMAC'"));
  assert.ok(teacherAuth.includes('HttpOnly; Secure; SameSite=Lax'));
  assert.equal((app + teacherGate + teacherAuth).includes('Heidi_Diskussion!'), false);
});
