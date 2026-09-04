export type Voice = 'Heidi' | 'Clara' | 'Peter' | 'Grossmama' | 'Fräulein Rottenmeier' | 'Dete' | 'Herr Sesemann' | 'Almöhi';
export type Message = { id:string; from:Voice; channel:'letter'|'voice'; place:string; meta:string; text:string; adult?:boolean };
export type ThreadTheme = { key:string; name:string; symbol:string; messages:Message[]; echoes:{label:string; next:string}[] };

export const openingMessages: Message[] = [
  {id:'opening-clara',from:'Clara',channel:'letter',place:'Frankfurt',meta:'Brief · am Fenster geschrieben',text:'Liebe Heidi, im Haus ist es stiller, seit du fort bist. Alle sagen, ich solle mich auf die Reise freuen. Aber manchmal klingt «freuen» fast wie eine Pflicht. Bei dir konnte ich vergessen, dass immer jemand auf meine Beine schaut. Schreibst du mir, wie es den Geissen geht? Clara'},
  {id:'opening-heidi',from:'Heidi',channel:'voice',place:'Alp',meta:'Sprachnachricht · 0:24',text:'Hier oben ist alles laut – der Wind, die Geissen, sogar die Stille. Ich wollte, du könntest hören, wie anders still sein kann. Der Peter sagt nicht viel. Aber wenn ich von dir rede, macht er ein Gesicht, als wäre eine Wolke vor die Sonne gerutscht.'},
  {id:'opening-peter',from:'Peter',channel:'voice',place:'Weide',meta:'Sprachnachricht · 0:09',text:'Wenn sie kommt, bist du wieder nur bei ihr. Die Geissen merken auch, wenn einer nicht mehr dazugehört.'},
];

export const openingEchoes = [
  {label:'Freude als Pflicht',next:'behinderung'},
  {label:'Anders still sein',next:'natur'},
  {label:'Nicht mehr dazugehören',next:'eifersucht'},
];

export const threadThemes: Record<string, ThreadTheme> = {
  freundschaft: {
    key:'freundschaft',name:'Freundschaft',symbol:'zwei Hände',
    messages:[
      {id:'f-clara',from:'Clara',channel:'letter',place:'Frankfurt',meta:'Brief · mit blauem Rand',text:'Liebe Heidi, muss eine Freundin immer merken, was die andere braucht? Manchmal fürchte ich, ich habe mich so über dich gefreut, dass ich dein Heimweh nicht sehen wollte. Ich dachte: Wenn du bei mir lachst, darfst du nicht gleichzeitig fortwollen. Clara'},
      {id:'f-heidi',from:'Heidi',channel:'letter',place:'Dörfli',meta:'Brief · langsam geschrieben',text:'Liebe Clara, ich konnte dich liebhaben und trotzdem auf die Alp wollen. Das war beides wahr. Vielleicht ist Freundschaft nicht Festhalten. Vielleicht ist sie, wenn man einander auch von weit weg noch Platz macht. Deine Heidi'},
      {id:'f-peter',from:'Peter',channel:'voice',place:'Weide',meta:'Sprachnachricht · 0:16',text:'Platz machen klingt leicht, wenn man immer genug hat. Ich hatte nur die Weide und Heidi. Dann kam Clara. Da war mein Platz plötzlich kleiner.'},
      {id:'f-oma',from:'Grossmama',channel:'letter',place:'Frankfurt',meta:'Fadenbrief · an alle drei',adult:true,text:'Ihr drei, ein Herz ist kein Zimmer mit nur einem Stuhl. Und doch kann sich ein Mensch hinausgedrängt fühlen. Peter hat etwas ausgesprochen, das sein Tun nicht entschuldigt, aber sichtbar macht. Clara hat bemerkt, dass Zuneigung blind werden kann. Vielleicht beginnt Freundschaft dort, wo beides nebeneinander liegen darf. Eure Grossmama'},
    ],
    echoes:[{label:'Ein Platz wird kleiner',next:'ungleichheit'},{label:'Liebhaben und fortwollen',next:'zugehoerigkeit'},{label:'Zuneigung kann blind sein',next:'behinderung'}],
  },
  eifersucht: {
    key:'eifersucht',name:'Eifersucht',symbol:'eine Wolke',
    messages:[
      {id:'e-peter',from:'Peter',channel:'voice',place:'Hinter der Hütte',meta:'Sprachnachricht · 0:22',text:'Ich hab den Stuhl hinuntergestossen. Nicht weil der Stuhl mir etwas getan hat. Ich wollte, dass alles wieder ist wie vorher. Gleich danach wusste ich, dass es nie mehr wie vorher sein kann.'},
      {id:'e-clara',from:'Clara',channel:'letter',place:'Auf der Alp',meta:'Brief · nicht abgeschickt',text:'Peter, als der Rollstuhl fort war, war nicht nur ein Gegenstand weg. Ich konnte nicht mehr selbst entscheiden, wohin ich komme. Ich möchte verstehen, warum du es getan hast. Aber Verstehen kann nicht bedeuten, dass der Schaden klein wird. Clara'},
      {id:'e-heidi',from:'Heidi',channel:'voice',place:'Vor der Almhütte',meta:'Sprachnachricht · 0:20',text:'Ich war böse auf Peter und zugleich erschrocken, dass ich nichts gemerkt hatte. Ich hatte Clara alles zeigen wollen. Dabei habe ich wohl Peter übersehen. Aber den Rollstuhl hat er selber gestossen, nicht ich.'},
      {id:'e-rottenmeier',from:'Fräulein Rottenmeier',channel:'letter',place:'Haus Sesemann',meta:'Randnotiz · streng unterstrichen',adult:true,text:'Ein solches Verhalten verlangt Folgen. Gefühle sind keine Erlaubnis zur Zerstörung. Allerdings muss ich widerwillig einräumen: Wer von einem Kind nur Gehorsam erwartet, erfährt womöglich zu spät, was in ihm vorgeht. Fräulein Rottenmeier'},
      {id:'e-oma',from:'Grossmama',channel:'letter',place:'Frankfurt',meta:'Fadenbrief · mit rotem Garn',adult:true,text:'Eifersucht sagt oft: Ich fürchte, meinen Platz zu verlieren. Verantwortung sagt: Trotzdem war es meine Hand. Erst wenn beide Sätze ausgesprochen sind, kann Wiedergutmachung mehr werden als Strafe. Grossmama'},
    ],
    echoes:[{label:'Meine Hand war es',next:'verantwortung'},{label:'Nicht selbst entscheiden',next:'behinderung'},{label:'Ein Kind nur gehorsam',next:'bildung'}],
  },
  tiere: {
    key:'tiere',name:'Tiere',symbol:'eine Glocke',
    messages:[
      {id:'t-heidi',from:'Heidi',channel:'voice',place:'Weide',meta:'Sprachnachricht · 0:27',text:'Schwänli drängt sich vor, wenn sie Salz riecht, und Bärli wartet. Der Peter kennt jede Geiss am Schritt. Bei den Tieren merkt man schnell: Gut sorgen heisst nicht, alle gleich zu behandeln.'},
      {id:'t-clara',from:'Clara',channel:'letter',place:'Frankfurt',meta:'Brief · mit einer gepressten Blüte',text:'Liebe Heidi, im Haus redet man über Tiere, als wären sie draussen und wir drinnen. Bei dir gehören sie zum Tag. Du lernst von ihnen, ohne dass jemand eine Lektion ankündigt. Ist das auch Bildung? Clara'},
      {id:'t-peter',from:'Peter',channel:'voice',place:'Geissenstall',meta:'Sprachnachricht · 0:17',text:'Eine Geiss kommt nicht, weil man lange redet. Man muss sehen, wann sie Angst hat. Menschen reden mehr. Sehen tun sie deswegen nicht besser.'},
      {id:'t-almoehi',from:'Almöhi',channel:'voice',place:'Almhütte',meta:'Sprachnachricht · 0:18',adult:true,text:'Wer ein Tier führt, trägt Verantwortung. Freiheit ohne Aufmerksamkeit ist Gleichgültigkeit. Das gilt nicht nur auf der Weide.'},
      {id:'t-oma',from:'Grossmama',channel:'letter',place:'Frankfurt',meta:'Fadenbrief · an Clara',adult:true,text:'Clara, du hast eine Tür geöffnet: Wissen tritt nicht immer mit Schulbüchern ein. Doch manches Buch öffnet wiederum Welten, die keine Weide zeigen kann. Die Frage ist nicht, welches Lernen gewinnt, sondern wer Zugang zu beidem erhält. Grossmama'},
    ],
    echoes:[{label:'Nicht alle gleich behandeln',next:'behinderung'},{label:'Lernen ohne Lektion',next:'bildung'},{label:'Freiheit braucht Aufmerksamkeit',next:'verantwortung'}],
  },
  bildung: {
    key:'bildung',name:'Bildung',symbol:'ein offenes Buch',
    messages:[
      {id:'b-clara',from:'Clara',channel:'letter',place:'Schulzimmer in Frankfurt',meta:'Brief · zwischen Buchseiten',text:'Liebe Heidi, der Unterricht war für mich immer schon da – wie ein Tisch, an den man mich setzte. Für dich war Lesen zuerst eine Wand. Dann wurde es ein Weg zu Peters Grossmutter. Vielleicht ist dasselbe Buch nicht für alle dieselbe Sache. Clara'},
      {id:'b-heidi',from:'Heidi',channel:'voice',place:'Dörfli',meta:'Sprachnachricht · 0:24',text:'Als ich nur Buchstaben sah, wollten sie nicht zusammenkommen. Als ich wusste, wem ich vorlesen will, sind sie näher gerückt. Der Grossvater zeigt mir anderes: Wolken, Holz, Milch, den Weg im Schnee. Ich will nicht eines davon verlieren.'},
      {id:'b-peter',from:'Peter',channel:'voice',place:'Schulweg',meta:'Sprachnachricht · 0:14',text:'Heidi hat gesagt, es komme schlimm, wenn ich nicht lese. Da habe ich gelernt. Aber gern hatte ich es nicht. Kann etwas gut sein, wenn man es aus Angst tut?'},
      {id:'b-rottenmeier',from:'Fräulein Rottenmeier',channel:'letter',place:'Haus Sesemann',meta:'Stellungnahme · sauber gefaltet',adult:true,text:'Unterricht kann nicht davon abhängen, ob ein Kind gerade Lust verspürt. Ordnung schafft Verlässlichkeit. Gleichwohl hat der Kandidat offenbar zu lange auf das Nichtkönnen und zu wenig auf das Können gesehen. Fräulein Rottenmeier'},
      {id:'b-oma',from:'Grossmama',channel:'letter',place:'Frankfurt',meta:'Fadenbrief · mit Lesezeichen',adult:true,text:'Ein Schlüssel ist nutzlos, solange niemand weiss, welche Tür er öffnen könnte. Aber eine Tür bleibt verschlossen, wenn niemand den Schlüssel übt. Beziehung, Sinn und Anstrengung sind keine Gegner; sie müssen miteinander sprechen. Grossmama'},
    ],
    echoes:[{label:'Ein Buch ist nicht für alle gleich',next:'ungleichheit'},{label:'Aus Angst lernen',next:'verantwortung'},{label:'Keines verlieren',next:'natur'}],
  },
  behinderung: {
    key:'behinderung',name:'Behinderung & Freiheit',symbol:'ein offener Weg',
    messages:[
      {id:'h-clara',from:'Clara',channel:'letter',place:'Frankfurt',meta:'Brief · persönlich',text:'Wenn alle mein Gehen feiern, frage ich mich manchmal, ob ich vorher weniger Clara war. Ich freue mich über meine Kraft. Aber ich möchte nicht, dass mein Glück erst dort beginnt, wo andere meinen Körper richtig finden. Clara'},
      {id:'h-heidi',from:'Heidi',channel:'letter',place:'Alp',meta:'Brief · mit Tintenfleck',text:'Liebe Clara, ich habe so sehr gewollt, dass du mit mir überall hinkommst. Vielleicht habe ich dabei mehr an den Weg gedacht als daran, wie du selbst dorthin möchtest. Ich will dich fragen, nicht ziehen. Heidi'},
      {id:'h-peter',from:'Peter',channel:'voice',place:'Dörfli',meta:'Sprachnachricht · 0:13',text:'Alle sagen Wunder. Vorher haben sie Clara getragen. Nachher klatschen sie. Dazwischen fragt fast keiner, was sie will.'},
      {id:'h-sesemann',from:'Herr Sesemann',channel:'letter',place:'Frankfurt',meta:'Brief eines Vaters',adult:true,text:'Ich habe Schutz oft mit Fürsorge verwechselt und Fürsorge mit Entscheiden. Meine Freude über Claras Kraft ist echt. Ebenso echt ist die Frage, ob ich ihrer Stimme genug Raum gegeben habe. Herr Sesemann'},
      {id:'h-oma',from:'Grossmama',channel:'letter',place:'Frankfurt',meta:'Fadenbrief · ohne Siegel',adult:true,text:'Clara darf sich über jeden neuen Schritt freuen. Sie darf aber auch ohne diesen Schritt ein ganzes Leben beanspruchen. Ein gutes Ende misst sich nicht nur an einem Körper, sondern an Freiheit, Beziehungen und offenen Wegen. Grossmama'},
    ],
    echoes:[{label:'War ich vorher weniger Clara?',next:'zugehoerigkeit'},{label:'Fragen, nicht ziehen',next:'freundschaft'},{label:'Schutz ist nicht Entscheiden',next:'verantwortung'}],
  },
  natur: {
    key:'natur',name:'Natur & Heimweh',symbol:'ein Windhauch',
    messages:[
      {id:'n-heidi',from:'Heidi',channel:'voice',place:'Unter den Tannen',meta:'Sprachnachricht · 0:31',text:'In Frankfurt konnte ich den Himmel nur in einem Stück zwischen den Dächern sehen. Niemand war böse zu mir. Trotzdem wurde alles in mir enger. Hier riecht der Wind nach Gras und Holz. Aber vielleicht heilt nicht nur der Berg. Vielleicht heilt auch, dass mich hier jemand kennt.'},
      {id:'n-clara',from:'Clara',channel:'letter',place:'Frankfurt',meta:'Brief · am offenen Fenster',text:'Liebe Heidi, manchmal wird die Alp erzählt, als mache sie jeden Menschen gesund. Ich glaube, sie gab mir Bewegung, Mut und dich. Doch wäre sie ohne Hilfe und ohne Wege für jeden ein guter Ort? Clara'},
      {id:'n-peter',from:'Peter',channel:'voice',place:'Weide',meta:'Sprachnachricht · 0:12',text:'Der Berg ist nicht immer freundlich. Wenn Schnee kommt, fragt er nicht, ob einer arm ist oder krank. Schön sein und hart sein geht zusammen.'},
      {id:'n-almoehi',from:'Almöhi',channel:'voice',place:'Almhütte',meta:'Sprachnachricht · 0:16',adult:true,text:'Die Natur verspricht nichts. Sie verlangt Aufmerksamkeit. Menschen sind es, die einen Ort zum Zuhause machen – oder zum Gefängnis.'},
      {id:'n-oma',from:'Grossmama',channel:'letter',place:'Frankfurt',meta:'Fadenbrief · nachdenklich',adult:true,text:'Vielleicht war Heidis Krankheit keine Schwäche, sondern eine deutliche Antwort auf eine unpassende Umgebung. Und vielleicht wurde die Alp zur Hilfe, weil dort Natur, Bewegung, Beziehung und Zugehörigkeit zusammenkamen. Grossmama'},
    ],
    echoes:[{label:'Jemand kennt mich',next:'zugehoerigkeit'},{label:'Schön und hart zugleich',next:'ungleichheit'},{label:'Ein Ort wird zum Gefängnis',next:'behinderung'}],
  },
  ungleichheit: {
    key:'ungleichheit',name:'Ungleichheit',symbol:'zwei ungleiche Brote',
    messages:[
      {id:'u-peter',from:'Peter',channel:'voice',place:'Dörfli',meta:'Sprachnachricht · 0:16',text:'Bei Clara gibt es einen Stuhl für draussen und Leute, die ihn schieben. Bei uns zieht der Wind durchs Haus. Wenn jemand hilft, sind wir froh. Aber am nächsten Wintertag ist das Loch noch da.'},
      {id:'u-clara',from:'Clara',channel:'letter',place:'Haus Sesemann',meta:'Brief · beschämt begonnen',text:'Ich kann geben, was für mich selbstverständlich bereitliegt. Das fühlt sich gut an und zugleich seltsam. Warum hängt ein warmes Zimmer davon ab, ob eine reiche Familie gerade hinsieht? Clara'},
      {id:'u-heidi',from:'Heidi',channel:'voice',place:'Bei Peters Grossmutter',meta:'Sprachnachricht · 0:18',text:'Die weichen Brötchen helfen heute. Ich sehe, wie die Grossmutter sich freut. Aber ich kann nicht versprechen, dass immer jemand aus Frankfurt kommt.'},
      {id:'u-dete',from:'Dete',channel:'letter',place:'Frankfurt',meta:'Brief · zwischen zwei Stellen',adult:true,text:'Ihr urteilt leicht über meine Wege. Eine Stelle nimmt man nicht nur an, weil sie einem gefällt. Wer keinen Besitz hat, muss dorthin, wo Arbeit ist. Das erklärt meine Entscheidungen. Ob es sie entschuldigt, weiss ich selbst nicht. Dete'},
      {id:'u-oma',from:'Grossmama',channel:'letter',place:'Frankfurt',meta:'Fadenbrief · mit Brotkrume',adult:true,text:'Hilfe hat ein Gesicht und kann einen Tag verändern. Gerechtigkeit muss länger halten als der Besuch der helfenden Person. Beides gegeneinander auszuspielen wäre bequem; beides zusammenzudenken ist schwieriger. Grossmama'},
    ],
    echoes:[{label:'Das Loch bleibt',next:'verantwortung'},{label:'Wer gerade hinsieht',next:'freundschaft'},{label:'Erklären oder entschuldigen',next:'zugehoerigkeit'}],
  },
  zugehoerigkeit: {
    key:'zugehoerigkeit',name:'Zugehörigkeit',symbol:'ein Platz am Tisch',
    messages:[
      {id:'z-heidi',from:'Heidi',channel:'letter',place:'Almhütte',meta:'Brief · an zwei Orte',text:'Liebe Clara, lieber Peter, in Frankfurt war ich bei Menschen, die mich gernhatten, und doch nicht daheim. Auf der Alp bin ich daheim, aber ich vermisse euch. Vielleicht gehört man nicht nur an einen Ort. Vielleicht gehört man dorthin, wo man fehlen darf. Heidi'},
      {id:'z-clara',from:'Clara',channel:'letter',place:'Frankfurt',meta:'Antwort · am selben Abend',text:'Heidi, «wo man fehlen darf» gefällt mir. Im Haus wird oft entschieden, wer wann bei mir ist. Ich möchte nicht nur besucht werden. Ich möchte auch selbst aufbrechen können – mit Rädern, zu Fuss oder auf andere Weise. Clara'},
      {id:'z-peter',from:'Peter',channel:'voice',place:'Weide',meta:'Sprachnachricht · 0:15',text:'Wenn einer fehlen darf, muss er auch wiederkommen dürfen. Ohne dass alles so tut, als wäre nichts gewesen.'},
      {id:'z-sesemann',from:'Herr Sesemann',channel:'letter',place:'Frankfurt',meta:'Kurzer Brief · an Heidi',adult:true,text:'Ein Haus kann versorgen und dennoch kein Zuhause sein. Das habe ich spät verstanden. Zugehörigkeit lässt sich nicht anordnen, aber Erwachsene können Räume schaffen, in denen sie wachsen darf. Herr Sesemann'},
      {id:'z-oma',from:'Grossmama',channel:'letter',place:'Frankfurt',meta:'Fadenbrief · letzter Absatz offen',adult:true,text:'Ihr habt aus einem Ort eine Beziehung gemacht: Daheim ist, wo Abwesenheit bemerkt wird und Rückkehr möglich bleibt. Nun führt der Faden wieder zu der Frage, wie man einander Raum gibt, ohne einander zu verlieren. Grossmama'},
    ],
    echoes:[{label:'Wo man fehlen darf',next:'freundschaft'},{label:'Selbst aufbrechen können',next:'behinderung'},{label:'Rückkehr muss möglich sein',next:'eifersucht'}],
  },
  verantwortung: {
    key:'verantwortung',name:'Verantwortung',symbol:'ein Knoten',
    messages:[
      {id:'v-peter',from:'Peter',channel:'voice',place:'Weide',meta:'Sprachnachricht · 0:19',text:'Wenn ich sage, warum ich es getan habe, klingt es gleich wie eine Ausrede. Wenn ich nichts sage, weiss niemand, was wieder passieren könnte. Ich kann den Stuhl nicht zurückholen. Was kann ich dann tun?'},
      {id:'v-clara',from:'Clara',channel:'letter',place:'Frankfurt',meta:'Brief · direkt an Peter',text:'Peter, ich möchte keine Angst vor dir haben. Eine Entschuldigung allein macht meinen Weg nicht wieder sicher. Aber wenn du zuhörst, den Schaden anerkennst und mithilfst, Sicherheit zurückzugeben, könnte etwas Neues beginnen. Clara'},
      {id:'v-heidi',from:'Heidi',channel:'voice',place:'Dörfli',meta:'Sprachnachricht · 0:18',text:'Ich kann Peter nicht vergeben, was Clara passiert ist. Das kann nur Clara. Aber ich kann dabeibleiben, wenn beide reden, und sagen, wenn ich etwas übersehen habe.'},
      {id:'v-dete',from:'Dete',channel:'letter',place:'Unterwegs',meta:'Brief · ohne feste Adresse',adult:true,text:'Verantwortung bedeutet manchmal, nicht wieder fortzugehen, sobald die schwierige Frage beginnt. Darin war ich nicht immer gut. Dete'},
      {id:'v-oma',from:'Grossmama',channel:'letter',place:'Frankfurt',meta:'Fadenbrief · fest verknotet',adult:true,text:'Wiedergutmachung macht Geschehenes nicht ungeschehen. Sie verbindet Wahrheit, Verantwortung, die Bedürfnisse der verletzten Person und eine veränderte Zukunft. Der Knoten bleibt sichtbar – aber er kann etwas tragen. Grossmama'},
    ],
    echoes:[{label:'Keine Ausrede, nicht schweigen',next:'eifersucht'},{label:'Sicherheit zurückgeben',next:'behinderung'},{label:'Der Knoten kann tragen',next:'freundschaft'}],
  },
};
