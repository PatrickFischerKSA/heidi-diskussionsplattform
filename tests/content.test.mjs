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
const textLabCoaching = await readFile(new URL('../app/textLabCoaching.ts', import.meta.url), 'utf8');
const textLabStyles = await readFile(new URL('../app/textlab-extra.css', import.meta.url), 'utf8');
const figureFocus = await readFile(new URL('../app/FigureFocus.tsx', import.meta.url), 'utf8');
const figureFocusStyles = await readFile(new URL('../app/figure-focus.css', import.meta.url), 'utf8');
const hosting = JSON.parse(await readFile(new URL('../.openai/hosting.json', import.meta.url), 'utf8'));

test('enthält genau sechs nummerierte Diskussionsräume', () => {
  const ids = [...data.matchAll(/\bid:\s*([1-6]),/g)].map(match => Number(match[1]));
  assert.deepEqual(ids, [1, 2, 3, 4, 5, 6]);
});

test('enthält die geforderten didaktischen Werkzeuge', () => {
  for (const phrase of ['Textbeleg', 'perspective-card', 'guided-counter', 'work.reflection', 'localStorage']) {
    assert.ok(app.includes(phrase), `Fehlt: ${phrase}`);
  }
});

test('führt Lernende schrittweise durch die Diskussion', () => {
  for (const phrase of ['topicGuide[0].title','topicGuide[1].title','topicGuide[2].title','topicGuide[3].title','topicGuide[4].title','topicGuide[5].title','nextLabel']) assert.ok(app.includes(phrase), `Führung fehlt: ${phrase}`);
  for (const field of ['questionResponse','perspectiveResponse','counterResponse']) assert.ok(app.includes(field), `Geführtes Antwortfeld fehlt: ${field}`);
  assert.ok(app.includes('disabled={!unlocked}'));
  assert.ok(app.includes('currentStep===0'));
  assert.ok(app.includes('currentStep===5'));
});

test('verwendet in den Arbeitskarten keine wiederverwendeten Aufgaben-Versatzstücke', () => {
  for(const phrase of ['Wo stehst du – und warum?','Welche Frage trifft deine Position?','Was zeigt eine konkrete Stelle?','Was würde diese Figur einwenden?','Was antwortest du darauf?','Was hat sich bewegt?','Tu jetzt:','Dieser Gedanke trägt','An diesem konkreten Punkt weiterarbeiten','Weiter zu Schritt']) assert.equal(app.includes(phrase),false,`Versatzstück noch vorhanden: ${phrase}`);
  assert.ok(app.includes('const stepLabels=topicGuide.map'));
  assert.ok(app.includes('{topicGuide[currentStep].discovery}'));
});

test('macht das Erkenntnispotenzial jedes Diskussionsschritts sichtbar', () => {
  for (const phrase of ['topicGuide[currentStep].title','topicGuide[currentStep].potential','topicGuide[currentStep].discovery']) assert.ok(app.includes(phrase), `Denkpotenzial fehlt: ${phrase}`);
  assert.ok(app.includes('{topic.thesis}'));
});

test('führt jedes Thema mit 36 spezifischen statt generischen Schritten', () => {
  const guideSource=data.slice(data.indexOf('export const discussionGuides'));
  for (const field of ['title','potential','discovery','action','starter','success','pending']) {
    const values=[...guideSource.matchAll(new RegExp(`${field}:'([^']+)'`,'g'))].map(match=>match[1]);
    assert.equal(values.length,36,`${field} ist nicht für alle 36 Schritte vorhanden`);
    assert.equal(new Set(values).size,36,`${field} enthält wiederholte Schablonen`);
  }
  for (const phrase of ['Detes / des Almöhis Entscheidung','Spuk-Erklärung','Unterricht des Kandidaten','zerstörte Rollstuhl','weissen Brötchen','Klaras unmittelbaren Schutz']) assert.ok(guideSource.includes(phrase),`Themenspezifische Führung fehlt: ${phrase}`);
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
  assert.ok(letters.includes('Mit einem Klick'));
  assert.ok(letters.includes('Jetzt Posttisch starten'));
  assert.ok(letters.includes('Zugang kopieren'));
  assert.ok(letters.includes('Zugangsdaten<textarea'));
  assert.ok(letters.includes('keine Aufgabe, keine Bewertung, keine Aufforderung'));
  assert.ok(route.includes("payload.action==='correspond'"));
  assert.ok(route.includes("amount%3===0"));
  assert.ok(route.includes('source.lens(currentExcerpt,character,bridge)'));
  assert.ok(route.includes('Zwischen diesen beiden Formulierungen entsteht eine Spannung'));
  assert.ok(letters.includes('voiceFrames[character]'));
  assert.ok(letters.includes('Der Faden hört in deinem Entwurf'));
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
  for (const phrase of ['Lesen als fremde Pflicht','Ein Bild wird zum Lesemotiv','Lesefreude – und dennoch nicht froh','«Kann nicht»','Buchstabieren, vormachen, wiederholen','Lesen bekommt einen Adressaten']) assert.ok(textLabData.includes(phrase), `Textfenster fehlt: ${phrase}`);
  for (const step of ['Beobachtung','Deutung','Gegenprobe','Textlupe']) assert.ok(textLab.includes(step), `Leseschritt fehlt: ${step}`);
  assert.ok(textLab.includes('aria-pressed'));
  assert.ok(cloud.includes("saveCloudState(credentials,'textlab'"));
});

test('Textlabor modelliert und begleitet den Leseprozess kleinschrittig', () => {
  for (const phrase of ['Animiertes Erklärbeispiel','Originalpassage · Johanna Spyri','Zuerst den Verlauf erfassen','Eine vorsichtige Bedeutung bilden','Die Deutung begrenzen']) assert.ok(textLab.includes(phrase), `Erklärbeispiel fehlt: ${phrase}`);
  assert.equal(textLab.includes('Erfundener Übungssatz'), false);
  const passageBlocks=[...textLabData.matchAll(/sentences:\[([\s\S]*?)\n  \],lenses:/g)];
  assert.equal(passageBlocks.length,6);
  for(const block of passageBlocks){
    const sentenceCount=block[1].split('\n').filter(line=>/^\s{4}'/.test(line)).length;
    assert.ok(sentenceCount>=5&&sentenceCount<=7,`Passage hat ${sentenceCount} statt 5–7 Sätzen`);
  }
  for (const step of ['Belegsatz','Textsignal','Beobachtung','Deutung','Gegenprobe','Ergebnis']) assert.ok(textLab.includes(step), `Mikroschritt fehlt: ${step}`);
  assert.ok(textLab.includes('aria-live="polite"'));
  assert.ok(textLab.includes('Das Sofortfeedback prüft Aufbau und Textbezug'));
  for (const phrase of ['Nächster Handgriff','Du hast Satz','coach.observationInstruction','coach.interpretationInstruction','coach.counterInstruction','active.sentences[entry.marks[0]]']) assert.ok(textLab.includes(phrase), `Passusbezug fehlt: ${phrase}`);
  for (const phrase of ['immer und immer','leuchtenden Augen','nie recht froh','Hab’s schon getan','sauber und geläufig','aufhorchenden Mutter']) assert.ok(textLabCoaching.includes(phrase), `Passusspezifisches Feedback fehlt: ${phrase}`);
  const coachingSource=textLabCoaching.slice(textLabCoaching.indexOf('passageCoaches'));
  for(const field of ['selectTitle','selectInstruction','selectEmpty','observationTitle','observationInstruction','observationNext','interpretationTitle','interpretationInstruction','interpretationNext','counterTitle','counterInstruction','counterNext','result']) assert.equal([...coachingSource.matchAll(new RegExp(`${field}:'([^']+)'`,'g'))].length,6,`${field} fehlt für eine Passage`);
  assert.ok(textLabStyles.includes('prefers-reduced-motion'));
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

test('Figurenfokus ist ein responsives Fallatelier statt einer statischen Vergleichstabelle', () => {
  assert.ok(app.includes('<FigureFocus onClose={close}/>'));
  assert.equal(app.includes('className="comparison"'), false);
  assert.equal(app.includes('Offene Urteilsfragen'), false);
  for(const id of ['alp','frankfurt','lernen','mitsprache','gemeinschaft','veraenderung']) assert.ok(figureFocus.includes(`id:'${id}'`), `Konfliktfall fehlt: ${id}`);
  for(const interaction of ['aria-expanded={open}','type="range"','aria-pressed','localStorage.setItem','work.probe===index','verdictReady']) assert.ok(figureFocus.includes(interaction), `Interaktion fehlt: ${interaction}`);
  for(const phrase of ['Die Übergabe','Der Frankfurter Vorschlag','Schule und Lernen','Heidis Stimme','Nähe zur Gemeinschaft','Wer verändert sich?']) assert.ok(figureFocus.includes(phrase), `Fallspezifische Führung fehlt: ${phrase}`);
  assert.equal([...figureFocus.matchAll(/reasonLabel:'([^']+)'/g)].length,6);
  assert.equal(figureFocus.includes('Formuliere die Wirkung dieser beiden Handlungen auf Heidi'),false);
  assert.ok(figureFocusStyles.includes('@media(max-width:900px)'));
  assert.ok(figureFocusStyles.includes('@media(max-width:620px)'));
  assert.ok(figureFocusStyles.includes('grid-template-columns:1fr'));
});
