export type LabPassage={id:string;reader:'Heidi'|'Peter';phase:string;title:string;chapter:string;pdfPages:string;sentences:string[];lenses:string[]};

export const labPassages:LabPassage[]=[
  {id:'heidi-schule',reader:'Heidi',phase:'Ausgangslage',title:'Lesen als fremde Pflicht',chapter:'Erster Teil · Sechstes Kapitel: Lauter neue Dinge',pdfPages:'PDF-S. 63',sentences:[
    'Heidi schüttelte ganz bedenklich mit dem Kopf, als es vom Lesenlernen hörte.',
    '»Doch, doch, Heidi, natürlich musst du lesen lernen, alle Menschen müssen, und der Herr Kandidat ist sehr gut, er wird niemals böse und erklärt dir dann schon alles.«',
    '»Aber siehst du, wenn er etwas erklärt, dann verstehst du nichts davon; dann musst du nur warten und gar nichts sagen, sonst erklärt er dir noch viel mehr und du verstehst es noch weniger.«',
  ],lenses:['Modalverben: «musst», «müssen»','Körperzeichen: Kopfschütteln','Steigerung von «nicht verstehen»','Wer spricht über wessen Lernen?']},
  {id:'heidi-oma',reader:'Heidi',phase:'Umschlagpunkt',title:'Ein Bild wird zum Lesemotiv',chapter:'Erster Teil · Zehntes Kapitel: Eine Grossmama',pdfPages:'PDF-S. 99–100',sentences:[
    'Auf einmal schrie Heidi laut auf, als die Großmama wieder ein Blatt umgewandt hatte; mit glühendem Blick schaute es auf die Figuren, dann stürzten ihm plötzlich die hellen Tränen aus den Augen.',
    '»Und da sind noch so viele schöne Geschichten in dem Buch, die kann man alle lesen und wiedererzählen.«',
    '»Sobald du nun lesen kannst, bekommst du das Buch, da kannst du seine ganze Geschichte vernehmen, ganz so, als ob sie dir jemand erzählte.«',
    'Heidi hatte mit gespannter Aufmerksamkeit zugehört, und mit leuchtenden Augen sagte es jetzt, tief Atem holend: »O, wenn ich nur schon lesen könnte!«',
  ],lenses:['Blick, Tränen und leuchtende Augen','Bild → Geschichte → eigener Wunsch','«müssen» verschwindet','Zukunftsversprechen des Buches']},
  {id:'heidi-verstehen',reader:'Heidi',phase:'Leseerfahrung',title:'Buchstaben gewinnen Leben',chapter:'Erster Teil · Zehntes Kapitel: Eine Grossmama',pdfPages:'PDF-S. 104',sentences:[
    'Richtig saß hier Heidi neben Klara und las dieser eine Geschichte vor, sichtlich selbst mit dem größten Erstaunen und mit einem wachsenden Eifer in die neue Welt eindringend, die ihm aufgegangen war, nun ihm mit einem Mal aus den schwarzen Buchstaben Menschen und Dinge entgegentraten und Leben gewannen und zu herzbewegenden Geschichten wurden.',
    'Sagte am Abend die Großmama: »Nun liest uns Heidi vor«, so war das Kind beglückt, denn das Lesen ging ihm nun ganz leicht, und wenn es die Geschichten laut vorlas, so kamen sie ihm noch viel schöner und verständlicher vor, und die Großmama erklärte dann noch so vieles und erzählte immer noch mehr hinzu.',
  ],lenses:['Metapher: eine Welt geht auf','«schwarze Buchstaben» → «Leben»','Lautlesen verändert Verstehen','Erklärung als gemeinsames Weitererzählen']},
  {id:'peter-widerstand',reader:'Peter',phase:'Ausgangslage',title:'«Kann nicht»',chapter:'Zweiter Teil · Fünftes Kapitel: Der Winter dauert fort',pdfPages:'PDF-S. 188',sentences:[
    '»Jetzt musst du lesen lernen«, lautete die Nachricht.',
    '»Hab’s schon getan«, war die Antwort.',
    '»Ja, ja, Peter, so mein ich nicht«, eiferte jetzt das Heidi; »ich meine so, dass du es nachher kannst.«',
    '»Kann nicht«, bemerkte der Peter.',
  ],lenses:['Extrem kurze Antworten','«getan» gegen «können»','Modalverb «musst»','Erzählerverben: «eiferte», «bemerkte»']},
  {id:'peter-unterricht',reader:'Peter',phase:'Lernweg',title:'Buchstabieren, vormachen, wiederholen',chapter:'Zweiter Teil · Fünftes Kapitel: Der Winter dauert fort',pdfPages:'PDF-S. 189–190',sentences:[
    'Jetzt saßen die beiden am Tisch, die Köpfe über das kleine Buch gebeugt, und die Lehrstunde konnte beginnen.',
    'Der Peter musste den ersten Spruch buchstabieren und dann wieder und dann noch einmal, denn das Heidi wollte die Sache sauber und geläufig haben.',
    'Endlich sagte es: »Du kannst es immer noch nicht, aber ich will dir ihn jetzt einmal hintereinander lesen; wenn du weißt, wie’s heißen muss, kannst du’s dann besser zusammenbuchstabieren.«',
    'Jetzt setzte der Peter noch einmal an und wiederholte beharrlich die drei Buchstaben so lange fort, bis das Heidi sagte: »Jetzt kannst du die drei.«',
  ],lenses:['Nähe: Köpfe über demselben Buch','Rhythmus der Wiederholung','Vom Ganzen zurück zu Buchstaben','Wer entscheidet, wann es «kann»?']},
  {id:'peter-transfer',reader:'Peter',phase:'Ergebnis',title:'Lesen bekommt einen Adressaten',chapter:'Zweiter Teil · Fünftes Kapitel: Der Winter dauert fort',pdfPages:'PDF-S. 193–194',sentences:[
    '»Ich muss jetzt ein Lied lesen, das Heidi hat’s gesagt«, berichtete der Peter weiter.',
    'Der Peter setzte sich an den Tisch hin und begann zu lesen.',
    'Auch die Großmutter folgte mit Spannung einem Verse nach dem anderen, sie sagte aber nichts dazu.',
    'Am Tage nach diesem Ereignis traf es sich, dass in der Schule in Peters Klasse eine Leseübung stattfand.',
    'Der Peter fing an und las hintereinander drei Zeilen, ohne abzusetzen.',
  ],lenses:['Lesen für die Grossmutter','Privater und schulischer Raum','Zuhören als Wirkung','Vom Buchstabieren zum fortlaufenden Lesen']},
];

export const comparisonDimensions=['Ausgangsvorstellung vom Lesen','Antrieb und Interesse','Rolle der Lehrperson','Methode und Wiederholung','Moment des Verstehens','Wirkung auf andere'];
