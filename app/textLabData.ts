export type VocabularyItem={word:string;clue:string;meaning:string};
export type LabPassage={id:string;reader:'Heidi'|'Peter';phase:string;title:string;chapter:string;pdfPages:string;sentences:string[];lenses:string[];vocabulary:VocabularyItem[]};

export const labPassages:LabPassage[]=[
  {id:'heidi-schule',reader:'Heidi',phase:'Ausgangslage',title:'Lesen als fremde Pflicht',chapter:'Erster Teil · Sechstes Kapitel: Lauter neue Dinge',pdfPages:'PDF-S. 63',sentences:[
    'Der Herr Kandidat nimmt auch manchmal das Buch ganz nahe ans Gesicht heran, so als wäre er auf einmal kurzsichtig geworden, aber er gähnt nur furchtbar hinter dem Buch, und Fräulein Rottenmeier nimmt auch von Zeit zu Zeit ihr großes Taschentuch hervor und hält es vor das Gesicht hin, so als sei sie ganz ergriffen von etwas, das wir lesen; aber ich weiß recht gut, dass sie nur ganz schrecklich gähnt dahinter.',
    'Und dann sollte ich auch so stark gähnen und muss es immer hinunterschlucken, denn wenn ich nur ein einziges Mal herausgähne, so holt Fräulein Rottenmeier gleich den Fischtran und sagt, ich sei wieder schwach, und Fischtran nehmen ist das Allerschrecklichste, da will ich noch lieber Gähnen schlucken.',
    'Aber nun wird’s viel kurzweiliger, da kann ich dann zuhören, wenn du lesen lernst.«',
    'Heidi schüttelte ganz bedenklich mit dem Kopf, als es vom Lesenlernen hörte.',
    '»Doch, doch, Heidi, natürlich musst du lesen lernen, alle Menschen müssen, und der Herr Kandidat ist sehr gut, er wird niemals böse und erklärt dir dann schon alles.',
    'Aber siehst du, wenn er etwas erklärt, dann verstehst du nichts davon; dann musst du nur warten und gar nichts sagen, sonst erklärt er dir noch viel mehr und du verstehst es noch weniger.',
    'Aber dann nachher, wenn du etwas gelernt hast und es weißt, dann verstehst du schon, was er gemeint hat.«',
  ],lenses:['Modalverben: «musst», «müssen»','Körperzeichen: Kopfschütteln','Steigerung von «nicht verstehen»','Wer spricht über wessen Lernen?'],vocabulary:[
    {word:'kurzweiliger',clue:'Clara stellt das Zuhören beim Lesenlernen dem gemeinsamen Gähnen gegenüber.',meaning:'unterhaltsamer; die Zeit vergeht dabei weniger langweilig'},
    {word:'Kandidat',clue:'Er erklärt Heidi im Haus Sesemann den Unterrichtsstoff.',meaning:'hier: ein junger Privatlehrer, der sich auf ein Amt oder einen Beruf vorbereitet'},
  ]},
  {id:'heidi-oma',reader:'Heidi',phase:'Umschlagpunkt',title:'Ein Bild wird zum Lesemotiv',chapter:'Erster Teil · Zehntes Kapitel: Eine Grossmama',pdfPages:'PDF-S. 100–101',sentences:[
    '»Es nützt nichts«, versicherte Heidi mit dem Ton der vollen Ergebung in das Unabänderliche.',
    '»Heidi«, sagte nun die Großmama, »jetzt will ich dir etwas sagen: Du hast noch nie lesen gelernt, weil du deinem Peter geglaubt hast; nun aber sollst du mir glauben, und ich sage dir fest und sicher, dass du in kurzer Zeit lesen kannst wie eine große Menge von Kindern, die geartet sind wie du und nicht wie Peter.',
    'Und nun musst du wissen, was nachher kommt, wenn du dann lesen kannst – du hast den Hirten gesehen auf der schönen grünen Weide – sobald du nun lesen kannst, bekommst du das Buch, da kannst du seine ganze Geschichte vernehmen, ganz so, als ob sie dir jemand erzählte, alles, was er macht mit seinen Schafen und Ziegen und was ihm für merkwürdige Dinge begegnen.',
    'Das möchtest du schon wissen, Heidi, nicht?«',
    'Heidi hatte mit gespannter Aufmerksamkeit zugehört, und mit leuchtenden Augen sagte es jetzt, tief Atem holend: »O, wenn ich nur schon lesen könnte!«',
    '»Jetzt wird’s kommen, und gar nicht lange wird’s währen, das kann ich schon sehen, Heidi, und nun müssen wir mal nach der Klara sehen; komm, die schönen Bücher nehmen wir mit.«',
  ],lenses:['Ergebung und Unabänderlichkeit','Glauben gegen eigenes Erproben','Bild → Geschichte → eigener Wunsch','Aufmerksamkeit, Augen und Atem'],vocabulary:[
    {word:'Ergebung',clue:'Heidi sagt «Es nützt nichts» und erwartet keine Veränderung mehr.',meaning:'widerspruchsloses Hinnehmen einer als unvermeidlich empfundenen Lage'},
    {word:'Unabänderliche',clue:'Die Grossmama widerspricht sofort und behauptet, Heidi könne doch lesen lernen.',meaning:'etwas, das nach Heidis bisheriger Überzeugung nicht verändert werden kann'},
  ]},
  {id:'heidi-verstehen',reader:'Heidi',phase:'Leseerfahrung',title:'Lesefreude – und dennoch nicht froh',chapter:'Erster Teil · Elftes Kapitel: Heidi nimmt auf der einen Seite zu, auf der anderen ab',pdfPages:'PDF-S. 105',sentences:[
    'Die Großmama hatte während der ganzen Zeit ihres Aufenthaltes jeden Nachmittag, wenn Klara sich hinlegte und Fräulein Rottenmeier, wahrscheinlich der Ruhe bedürftig, geheimnisvoll verschwand, sich einen Augenblick neben Klara hingesetzt; aber schon nach fünf Minuten war sie wieder auf den Füßen und hatte dann immer Heidi auf ihre Stube berufen, sich mit ihm besprochen und es auf allerlei Weise beschäftigt und unterhalten.',
    'Die Großmama hatte hübsche kleine Puppen und zeigte dem Heidi, wie man ihnen Kleider und Schürzen macht, und ganz unvermerkt hatte Heidi das Nähen erlernt und machte den kleinen Leuten die schönsten Kleider und Mäntelchen, denn die Großmama hatte immer Zeugstücke von den prächtigsten Farben.',
    'Nun Heidi lesen konnte, durfte es auch immer wieder der Großmama seine Geschichten vorlesen; das machte ihm die größte Freude, denn je mehr es seine Geschichten las, desto lieber wurden sie ihm.',
    'Heidi lebte alles ganz mit durch, was die Leute alle zu erleben hatten, und so hatte es zu ihnen allen ein sehr nahes Verhältnis und freute sich immer wieder, bei ihnen zu sein.',
    'Aber so recht froh sah Heidi nie aus, und seine lustigen Augen waren nie mehr zu sehen.',
  ],lenses:['«unvermerkt» lernen','Steigerung: je mehr, desto lieber','Mitdurchleben und Nähe','Lesefreude gegen bleibenden Kummer'],vocabulary:[
    {word:'unvermerkt',clue:'Heidi lernt nähen, während die Grossmama mit Puppen und Stoffen arbeitet; ein ausdrücklicher Unterrichtsbeginn fehlt.',meaning:'ohne dass Heidi den Lernvorgang bewusst als Unterricht bemerkt'},
    {word:'Verhältnis',clue:'Heidi «lebt» die Erlebnisse der Buchfiguren mit und freut sich, wieder bei ihnen zu sein.',meaning:'hier: eine enge innere Beziehung zu den Figuren der Geschichten'},
  ]},
  {id:'peter-widerstand',reader:'Peter',phase:'Ausgangslage',title:'«Kann nicht»',chapter:'Zweiter Teil · Fünftes Kapitel: Der Winter dauert fort',pdfPages:'PDF-S. 188',sentences:[
    '»Peter, ich weiß etwas«, rief es ihm entgegen.',
    '»Sag’s«, gab er zurück.',
    '»Jetzt muss du lesen lernen«, lautete die Nachricht.',
    '»Hab’s schon getan«, war die Antwort.',
    '»Ja, ja, Peter, so mein ich nicht«, eiferte jetzt das Heidi; »ich meine so, dass du es nachher kannst.«',
    '»Kann nicht«, bemerkte der Peter.',
    '»Das glaubt dir jetzt kein Mensch mehr, und ich auch nicht«, sagte das Heidi sehr entschieden.',
  ],lenses:['Extrem kurze Antworten','«getan» gegen «können»','Modalverb «musst»','Erzählerverben: «eiferte», «bemerkte»'],vocabulary:[
    {word:'eiferte',clue:'Heidi widerspricht Peters kurzem «Hab’s schon getan» mit einem längeren, drängenden Satz.',meaning:'sprach lebhaft, ungeduldig und mit grossem Nachdruck'},
    {word:'bemerkte',clue:'Peters «Kann nicht» bleibt auffallend knapp und klingt fast beiläufig.',meaning:'sagte oder äusserte; das zurückhaltende Verb kontrastiert mit Heidis Eifern'},
  ]},
  {id:'peter-unterricht',reader:'Peter',phase:'Lernweg',title:'Buchstabieren, vormachen, wiederholen',chapter:'Zweiter Teil · Fünftes Kapitel: Der Winter dauert fort',pdfPages:'PDF-S. 189',sentences:[
    '»So will ich«, sagte der Peter halb kläglich, halb ärgerlich.',
    'Im Augenblick war das Heidi besänftigt.',
    '»So, das ist recht, dann wollen wir gleich anfangen«, sagte es erfreut, und geschäftig zog es den Peter an den Tisch hin und holte das nötige Werkzeug herbei.',
    'In dem großen Paket der Klara hatte sich auch ein Büchlein befunden, das dem Heidi wohl gefiel, und schon gestern Nacht war es ihm in den Sinn gekommen, das könne es gut zu dem Unterricht für den Peter gebrauchen, denn das war ein Abc-Büchlein mit Sprüchen.',
    'Jetzt saßen die beiden am Tisch, die Köpfe über das kleine Buch gebeugt, und die Lehrstunde konnte beginnen.',
    'Der Peter musste den ersten Spruch buchstabieren und dann wieder und dann noch einmal, denn das Heidi wollte die Sache sauber und geläufig haben.',
    'Endlich sagte es: »Du kannst es immer noch nicht, aber ich will dir ihn jetzt einmal hintereinander lesen; wenn du weißt, wie’s heißen muss, kannst du’s dann besser zusammenbuchstabieren.«',
  ],lenses:['Nähe: Köpfe über demselben Buch','Rhythmus der Wiederholung','Vom Ganzen zurück zu Buchstaben','Wer entscheidet, wann es «kann»?'],vocabulary:[
    {word:'besänftigt',clue:'Unmittelbar vorher stimmt Peter halb kläglich, halb ärgerlich dem Lernen zu.',meaning:'beruhigt und nicht mehr zornig oder aufgebracht'},
    {word:'geläufig',clue:'Peter soll denselben Spruch wiederholt buchstabieren, bis er nicht mehr stockt.',meaning:'sicher, flüssig und ohne langes Suchen verfügbar'},
  ]},
  {id:'peter-transfer',reader:'Peter',phase:'Ergebnis',title:'Lesen bekommt einen Adressaten',chapter:'Zweiter Teil · Fünftes Kapitel: Der Winter dauert fort',pdfPages:'PDF-S. 193–194',sentences:[
    '»Ich muss jetzt ein Lied lesen, das Heidi hat’s gesagt«, berichtete der Peter weiter.',
    'Die Mutter holte hurtig das Buch herunter, und die Großmutter freute sich, sie hatte so lange kein gutes Wort gehört.',
    'Der Peter setzte sich an den Tisch hin und begann zu lesen.',
    'Seine Mutter saß aufhorchend neben ihm; nach jedem Verse musste sie mit Bewunderung sagen: »Wer hätte es auch denken können!«',
    'Auch die Großmutter folgte mit Spannung einem Verse nach dem anderen, sie sagte aber nichts dazu.',
    'Am Tage nach diesem Ereignis traf es sich, dass in der Schule in Peters Klasse eine Leseübung stattfand.',
    'Als die Reihe an den Peter kommen sollte, sagte der Lehrer: »Peter, muss man dich wieder übergehen, wie immer, oder willst du einmal wieder – ich will nicht sagen lesen, ich will sagen: versuchen, an einer Zeile herumzustottern?«',
  ],lenses:['Lesen für die Grossmutter','Privater und schulischer Raum','Zuhören als Wirkung','Vom Buchstabieren zum fortlaufenden Lesen'],vocabulary:[
    {word:'hurtig',clue:'Die Mutter holt das Buch sofort, nachdem Peter sein Vorlesen ankündigt.',meaning:'rasch, flink und ohne Zögern'},
    {word:'aufhorchend',clue:'Die Mutter sitzt neben Peter und reagiert nach jedem Vers mit Bewunderung.',meaning:'plötzlich besonders aufmerksam zuhörend'},
  ]},
];

export const comparisonDimensions=['Ausgangsvorstellung vom Lesen','Antrieb und Interesse','Rolle der Lehrperson','Methode und Wiederholung','Moment des Verstehens','Wirkung auf andere'];
