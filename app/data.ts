export type Level = 'Verstehen' | 'Analysieren' | 'Urteilen & Transfer';
export type Topic = {
  id: number; area: string; title: string; thesis: string; poles: [string, string];
  figures: string[]; duration: string; anchor: string; chapter: string;
  questions: { level: Level; text: string }[]; impulses: string[]; counters: string[];
  perspectives: { name: string; prompt: string }[];
};

export const topics: Topic[] = [
  {
    id: 1, area: 'Kinderrechte · Pädagogik', title: 'Kindeswohl oder Fremdbestimmung?',
    thesis: 'Die Erwachsenen verletzen Heidis Selbstbestimmung, obwohl sie behaupten, zu ihrem Wohl zu handeln.',
    poles: ['Schutz & Chancen', 'Mitsprache & Bindung'], figures: ['Heidi','Dete','Almöhi','Herr Sesemann'], duration: '20–30 Min.',
    anchor: 'Dete bringt Heidi zuerst auf die Alp und später nach Frankfurt. Über Wohnort, Beziehungen und Zukunft bestimmen Erwachsene.',
    chapter: 'Erster Teil, Kap. 1 «Zum Alm-Öhi hinauf» und Kap. 5 «Es kommt Besuch»',
    questions: [
      {level:'Verstehen',text:'Welche Entscheidungen treffen Dete und der Almöhi für Heidi?'},
      {level:'Verstehen',text:'An welchen Reaktionen erkennt man Heidis eigenen Willen?'},
      {level:'Analysieren',text:'Welche Motive, Zwänge und blinden Flecken prägen Detes Handeln?'},
      {level:'Analysieren',text:'Wo schafft der Almöhi Freiheit – und wo schliesst er Heidi aus?'},
      {level:'Urteilen & Transfer',text:'Wie stark soll der Wille eines jungen Kindes eine Entscheidung bestimmen?'},
      {level:'Urteilen & Transfer',text:'Wie sähe eine gemeinsam mit Heidi getroffene Lösung aus?'},
    ],
    impulses:['Dete muss ihren Lebensunterhalt verdienen.','Heidi wird über den Zweck der Reise im Unklaren gelassen.','Frankfurt verspricht Bildung und materielle Sicherheit.','Der Almöhi bietet Bindung, aber zunächst keine Schule.','Gute Absicht garantiert keine gute Wirkung.','Kinderrechte sind ein heutiger Deutungsrahmen.'],
    counters:['Ohne erwachsene Entscheidungen wäre ein kleines Kind nicht geschützt.','Zukunftschancen können einen vorübergehenden Verlust an Freiheit rechtfertigen.'],
    perspectives:[
      {name:'Heidi',prompt:'Sprich über Zugehörigkeit, vertraute Menschen und darüber, wann du gefragt wurdest.'},
      {name:'Dete',prompt:'Erkläre deine Erwerbsarbeit, begrenzten Möglichkeiten und weshalb du Frankfurt als Chance siehst.'},
      {name:'Almöhi',prompt:'Begründe Schutz und Freiheit auf der Alp – und antworte auf den Vorwurf der Isolation.'},
      {name:'Herr Sesemann',prompt:'Wäge Verantwortung als Hausherr gegen dein Vertrauen in andere Erwachsene ab.'},
    ],
  },
  {
    id: 2, area: 'Psychologie · Umwelt', title: 'Krankes Kind – oder kranke Umgebung?',
    thesis: 'Nicht Heidi ist krank; krank macht sie eine Umgebung, in der ihre elementaren Bedürfnisse übersehen werden.',
    poles: ['Individuelle Störung', 'Belastende Umgebung'], figures: ['Heidi','Arzt','Fräulein Rottenmeier'], duration: '20–30 Min.',
    anchor: 'In Frankfurt verliert Heidi Appetit und Lebensfreude, wird blass und schlafwandelt. Die Vorgänge gelten zuerst als Spuk.',
    chapter: 'Erster Teil, Kap. 11 «Heidi nimmt auf der einen Seite zu, auf der anderen ab» und Kap. 12 «Im Hause Sesemanns spukt’s»',
    questions: [
      {level:'Verstehen',text:'Welche körperlichen und seelischen Warnzeichen zeigt Heidi?'},
      {level:'Verstehen',text:'Wie erklären die Erwachsenen die nächtlichen Vorgänge zuerst?'},
      {level:'Analysieren',text:'Welche Bedürfnisse werden im Haus Sesemann übersehen?'},
      {level:'Analysieren',text:'Warum kann Heimweh körperliche Symptome auslösen?'},
      {level:'Urteilen & Transfer',text:'Ist die Alp Heilmittel, Symbol oder beides?'},
      {level:'Urteilen & Transfer',text:'Wie müsste eine Umgebung reagieren, bevor ein Kind zusammenbricht?'},
    ],
    impulses:['Heidi gehorcht lange, ohne ihre Not klar auszusprechen.','Die Erwachsenen suchen zuerst eine übernatürliche Erklärung.','Der Arzt verbindet Symptome und Lebenssituation.','Beziehung und Bewegung verändern Heidis Zustand.','Die Naturdarstellung ist literarisch idealisiert.','Eine psychosomatische Reaktion ist nicht eingebildet.'],
    counters:['Auch eine belastende Umgebung kann eine medizinische Behandlung nötig machen.','Die schnelle Heilung auf der Alp romantisiert Natur als Wundermittel.'],
    perspectives:[
      {name:'Heidi',prompt:'Beschreibe, was dir fehlt, ohne moderne Fachbegriffe zu benutzen.'},
      {name:'Arzt',prompt:'Erkläre deine Beobachtungen und weshalb du die Rückkehr empfiehlst.'},
      {name:'Fräulein Rottenmeier',prompt:'Verteidige Ordnung und Fürsorge im Haus – und benenne, was du übersiehst.'},
      {name:'Klara',prompt:'Zeige den Konflikt zwischen Freundschaft und Heidis Wohl.'},
    ],
  },
  {
    id: 3, area: 'Bildung · Motivation', title: 'Wann gelingt Bildung?',
    thesis: 'Kinder lernen nachhaltig, wenn Bildung für sie Beziehung, Sinn und Selbstwirksamkeit gewinnt.',
    poles: ['Anleitung & Pflicht', 'Sinn & Eigenmotivation'], figures: ['Heidi','Grossmama','Peter','Almöhi'], duration: '20–45 Min.',
    anchor: 'Der formale Unterricht erreicht Heidi zunächst kaum. Bilder, Beziehung und der Wunsch, Peters Grossmutter vorzulesen, verändern das Lernen.',
    chapter: 'Erster Teil, Kap. 6 «Lauter neue Dinge» und Kap. 10 «Eine Grossmama»',
    questions: [
      {level:'Verstehen',text:'Was kann Heidi bei ihrer Ankunft – und was noch nicht?'},
      {level:'Verstehen',text:'Was löst ihren Wunsch aus, lesen zu lernen?'},
      {level:'Analysieren',text:'Wie unterscheiden sich Kandidat, Grossmama und Almöhi als Lernbegleiter?'},
      {level:'Analysieren',text:'Welche praktischen Kompetenzen bleiben im Unterricht unsichtbar?'},
      {level:'Urteilen & Transfer',text:'Ist Heidis Druck auf Peter trotz des Erfolgs vertretbar?'},
      {level:'Urteilen & Transfer',text:'Wie verbindet gute Schule Freiheit, Anspruch und Teilhabe?'},
    ],
    impulses:['Der Defizitblick misst Heidi zunächst nur am Lesen.','Die Grossmama knüpft an Bilder und Beziehungen an.','Heidi will für einen geliebten Menschen lesen können.','Auf der Alp lernt Heidi genau zu beobachten.','Schule eröffnet gesellschaftliche Teilhabe.','Auch gut gemeinter Lerndruck kann Angst erzeugen.'],
    counters:['Nicht jedes Lernen kann auf spontane Motivation warten.','Informelles Wissen ersetzt Lesen und schulische Teilhabe nicht.'],
    perspectives:[
      {name:'Heidi',prompt:'Erkläre, wann Lernen für dich Sinn bekommt und wann es fremd bleibt.'},
      {name:'Grossmama',prompt:'Zeige, wie Beziehung und Geschichten einen Zugang öffnen.'},
      {name:'Almöhi',prompt:'Verteidige Erfahrungslernen und stelle dich der Kritik an der Schulverweigerung.'},
      {name:'Peter',prompt:'Sprich über Lernfrust, Druck und die Folgen von Heidis Drohungen.'},
    ],
  },
  {
    id: 4, area: 'Inklusion · Körpernormen', title: 'Muss Klara gehen können?',
    thesis: 'Klaras Heilung erzählt weniger über Behinderung als über die Erwartungen einer nichtbehinderten Gesellschaft.',
    poles: ['Heilung als gutes Ende', 'Teilhabe ohne Heilungsdruck'], figures: ['Klara','Heidi','Grossmama'], duration: '30–45 Min.',
    anchor: 'Klaras Alltag wird von Erwachsenen organisiert. Auf der Alp gewinnt sie Kraft; das Gehen wird als Höhepunkt des guten Endes inszeniert.',
    chapter: 'Zweiter Teil, Kap. 7 «Wie es auf der Alp weitergeht» und Kap. 8 «Es geschieht, was keiner erwartet hat»',
    questions: [
      {level:'Verstehen',text:'Wer entscheidet im Alltag über Klaras Bewegung und Tagesablauf?'},
      {level:'Verstehen',text:'Wie verändert die Alp Klaras Handlungsmöglichkeiten?'},
      {level:'Analysieren',text:'Wie lenkt die Erzählung unsere Erwartungen an ein gutes Ende?'},
      {level:'Analysieren',text:'Welche Barrieren sind körperlich, welche sozial geschaffen?'},
      {level:'Urteilen & Transfer',text:'Kann ein Heilungsende stärken und zugleich problematisch sein?'},
      {level:'Urteilen & Transfer',text:'Wie könnte ein inklusives Ende ohne Heilungszwang aussehen?'},
    ],
    impulses:['Klara wird häufig getragen oder geschoben.','Ihre Wünsche werden nicht immer direkt erfragt.','Auf der Alp erlebt sie Gemeinschaft und Aktivität.','Der zerstörte Rollstuhl nimmt ihr zunächst Mobilität.','Das soziale Modell fragt nach Barrieren statt Defiziten.','Historische Erzählmuster sind anders als heutige Inklusionsbegriffe.'],
    counters:['Klaras Freude über das Gehen darf nicht kleingeredet werden.','Eine heutige Kritik darf den historischen Text nicht ahistorisch verurteilen.'],
    perspectives:[
      {name:'Klara',prompt:'Formuliere eigene Wünsche jenseits dessen, was andere als Erfolg definieren.'},
      {name:'Heidi',prompt:'Sprich über Ermutigung, Freundschaft und mögliche Grenzüberschreitungen.'},
      {name:'Grossmama',prompt:'Wäge Hoffnung, medizinische Erwartungen und Selbstbestimmung ab.'},
      {name:'Leserin heute',prompt:'Untersuche Barrieren mit dem sozialen Modell von Behinderung.'},
    ],
  },
  {
    id: 5, area: 'Ungleichheit · Care-Arbeit', title: 'Überwindet Freundschaft soziale Ungleichheit?',
    thesis: 'Heidis Hilfsbereitschaft lindert Not, verändert aber die ungerechten Verhältnisse nicht.',
    poles: ['Private Hilfe genügt', 'Strukturelle Rechte nötig'], figures: ['Heidi','Dete','Peters Familie'], duration: '20–30 Min.',
    anchor: 'Im Haus Sesemann gibt es Personal, Unterricht und medizinische Betreuung. Peters Familie lebt knapp; Hilfe bleibt persönlich und punktuell.',
    chapter: 'Erster Teil, Kap. 4 «Bei der Grossmutter»; Zweiter Teil, Kap. 4 «Der Winter im Dörfli»',
    questions: [
      {level:'Verstehen',text:'Welche materiellen Unterschiede zeigt der Roman konkret?'},
      {level:'Verstehen',text:'Wer übernimmt bezahlte und unbezahlte Sorgearbeit?'},
      {level:'Analysieren',text:'Welche Handlungsmöglichkeiten hat Dete als erwerbstätige Frau?'},
      {level:'Analysieren',text:'Wie verbindet Freundschaft Menschen verschiedener sozialer Lagen?'},
      {level:'Urteilen & Transfer',text:'Wann wird Wohltätigkeit zum Trostpflaster?'},
      {level:'Urteilen & Transfer',text:'Welche Rechte oder Strukturen würden dauerhafter helfen?'},
    ],
    impulses:['Weisse Brötchen werden zum Zeichen materieller Not.','Der Haushalt Sesemann verteilt Care-Arbeit an Personal.','Detes Mobilität hängt von Erwerbsarbeit ab.','Heidi kann Ressourcen weitergeben, besitzt sie aber nicht selbst.','Freundschaft schafft Nähe, aber keine gleichen Ausgangsbedingungen.','Soziale Rechte unterscheiden sich von freiwilliger Güte.'],
    counters:['Persönliche Hilfe kann unmittelbar wirken, wo Strukturen versagen.','Der Roman zeigt Beziehungen, nicht ein politisches Reformprogramm.'],
    perspectives:[
      {name:'Dete',prompt:'Erkläre deine Entscheidungen aus der Sicht einer arbeitenden Frau ohne grossen Besitz.'},
      {name:'Peters Grossmutter',prompt:'Beschreibe konkrete Bedürfnisse und wie Abhängigkeit von Hilfe wirkt.'},
      {name:'Herr Sesemann',prompt:'Argumentiere über Verantwortung, Besitz und private Unterstützung.'},
      {name:'Heidi',prompt:'Erkläre, was deine Hilfe vermag – und was nicht.'},
    ],
  },
  {
    id: 6, area: 'Schuld · Restorative Gerechtigkeit', title: 'Peter: Täter, Opfer – oder beides?',
    thesis: 'Wer Peters Tat nur bestraft, verurteilt das Verhalten, ohne seine Ursachen zu bearbeiten.',
    poles: ['Strafe & Verantwortung', 'Verstehen & Wiedergutmachung'], figures: ['Peter','Heidi','Klara'], duration: '20–45 Min.',
    anchor: 'Aus Eifersucht zerstört Peter Klaras Rollstuhl. Danach bestimmen Angst vor Entdeckung, Schuld und die Reaktionen der anderen sein Verhalten.',
    chapter: 'Zweiter Teil, Kap. 3 «Eine Vergeltung»',
    questions: [
      {level:'Verstehen',text:'Was tut Peter, und welche Folgen kann seine Tat haben?'},
      {level:'Verstehen',text:'Welche Gefühle zeigt er vor und nach der Tat?'},
      {level:'Analysieren',text:'Wie hängen Eifersucht, Verlustangst und soziale Lage zusammen?'},
      {level:'Analysieren',text:'Wie erklärt man eine Tat, ohne sie zu entschuldigen?'},
      {level:'Urteilen & Transfer',text:'Welche Reaktion wäre gerecht und würde Schaden bearbeiten?'},
      {level:'Urteilen & Transfer',text:'Was müssten Peter, Heidi, Klara und Erwachsene zur Versöhnung beitragen?'},
    ],
    impulses:['Die Zerstörung gefährdet Klaras Mobilität.','Peter erlebt Klara als Rivalin um Heidis Aufmerksamkeit.','Er kann Bedürfnisse kaum sprachlich ausdrücken.','Angst vor Strafe führt nicht automatisch zu Einsicht.','Wiedergutmachung verlangt Verantwortung.','Restorative Gerechtigkeit bezieht Betroffene und Gemeinschaft ein.'],
    counters:['Ursachen zu verstehen darf die Schwere der Tat nicht verkleinern.','Ohne klare Konsequenzen bleibt die Verantwortung unsichtbar.'],
    perspectives:[
      {name:'Peter',prompt:'Benenne Eifersucht und Angst, übernimm aber Verantwortung für die Tat.'},
      {name:'Klara',prompt:'Sprich über Schaden, Sicherheit und Bedingungen für Wiedergutmachung.'},
      {name:'Heidi',prompt:'Reflektiere Freundschaft, übersehene Signale und deine Rolle in einer Versöhnung.'},
      {name:'Moderation',prompt:'Suche eine Reaktion, die Schutz, Verantwortung und Wiedergutmachung verbindet.'},
    ],
  },
];

export const modes = [
  {name:'Blitzdebatte', minutes:8, steps:['1 Min. Position wählen','2 Min. Belege sammeln','4 Min. Pro & Contra','1 Min. Schlussvotum']},
  {name:'Fishbowl', minutes:25, steps:['Positionen vorbereiten','Innenkreis diskutiert','Freier Stuhl wechselt','Beobachtung auswerten']},
  {name:'Philosophisches Gespräch', minutes:40, steps:['Frage klären','Begriffe prüfen','Gedankengang vertiefen','Gemeinsame Bilanz']},
  {name:'Gerichtsverhandlung', minutes:30, steps:['Anklage & Verteidigung','Belege vernehmen','Plädoyers','Begründetes Urteil']},
];

export const roles = ['Moderation','Pro','Contra','Textdetektiv/in','Gegenwartsbezug','Beobachtung & Feedback'];

export const glossary = [
  ['Kinderrechte','Rechte, die jedem Kind Schutz, Förderung und Beteiligung sichern.'],
  ['psychosomatische Reaktion','Körperliche Beschwerden, die mit seelischer Belastung zusammenhängen.'],
  ['intrinsische Motivation','Lernen oder Handeln aus eigenem Interesse und innerem Antrieb.'],
  ['Defizitblick','Eine Sichtweise, die vor allem darauf achtet, was jemand nicht kann.'],
  ['soziales Modell von Behinderung','Es fragt, welche Barrieren Teilhabe verhindern – nicht nur nach dem Körper einer Person.'],
  ['Care-Arbeit','Bezahlte oder unbezahlte Arbeit des Sorgens, Pflegens und Betreuens.'],
  ['soziale Ungleichheit','Ungleich verteilte Chancen, Mittel und gesellschaftliche Teilhabe.'],
  ['Eifersucht','Angst oder Ärger, eine wichtige Beziehung oder Aufmerksamkeit zu verlieren.'],
  ['restorative Gerechtigkeit','Ein Ansatz, der Schaden, Verantwortung und Wiedergutmachung ins Zentrum stellt.'],
];
