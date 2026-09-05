'use client';

import { useEffect, useState } from 'react';
import { comparisonDimensions, labPassages } from './textLabData';
import { checkFeedback, FeedbackResult, interpretationFeedback, observationFeedback, passageCoaches } from './textLabCoaching';

type Entry={marks:number[];words:string[];signalChoice:string;highlights:string[];excerpt:string;observation:string;interpretation:string;counterMark:number|null;check:string};
export type LabState={entries:Record<string,Entry>;comparison:Record<string,string>};
export const TEXTLAB_KEY='denkraum-textlabor-v1';
const emptyEntry=():Entry=>({marks:[],words:[],signalChoice:'',highlights:[],excerpt:'',observation:'',interpretation:'',counterMark:null,check:''});
const load=():LabState=>{try{return JSON.parse(localStorage.getItem(TEXTLAB_KEY)||'') as LabState}catch{return {entries:{},comparison:{}}}};

type Guide={question:string;options:{id:string;label:string;feedback:string}[];answer:string};
const guides:Record<string,Guide>={
  'heidi-schule':{question:'Wie verstärkt der Text das Nichtverstehen?',answer:'repeat',options:[
    {id:'repeat',label:'Durch Wiederholung und Steigerung von «verstehen»',feedback:'Genau. Dasselbe Wort kehrt wieder und steigert Klaras Warnung: Mehr Erklärung kann hier sogar weniger Verstehen bedeuten.'},
    {id:'room',label:'Durch eine genaue Beschreibung des Schulzimmers',feedback:'Schau noch einmal nur auf den Wortlaut: Ein Schulzimmer wird gar nicht beschrieben. Suche nach einem wiederkehrenden Verb.'},
    {id:'time',label:'Durch einen Wechsel der Erzählzeit',feedback:'Die Zeitform bleibt unauffällig. Auffällig ist vielmehr, wie oft «verstehen» und «noch» vorkommen.'},
  ]},
  'heidi-oma':{question:'Woran wird Heidis veränderte Haltung sichtbar?',answer:'body',options:[
    {id:'body',label:'An Aufmerksamkeit, leuchtenden Augen und ihrem eigenen Wunsch',feedback:'Ja. Der Text zeigt die Veränderung körperlich und lässt Heidi selbst sprechen: Aus der behaupteten Unmöglichkeit wird ein eigener Wunsch.'},
    {id:'rule',label:'An einer neuen Schulregel',feedback:'Eine Regel nennt die Passage nicht. Achte auf Heidis Körper, Blick und direkte Rede.'},
    {id:'speed',label:'Daran, dass Heidi schon besonders schnell liest',feedback:'Hier kann Heidi noch nicht lesen. Suche deshalb nach Signalen für Interesse und Erwartung.'},
  ]},
  'heidi-verstehen':{question:'Welche Spannung bleibt trotz Heidis Lesefreude bestehen?',answer:'world',options:[
    {id:'world',label:'Die Geschichten werden ihr immer näher, aber Heidi selbst bleibt unfroh',feedback:'Treffend. «Grösste Freude» und «nahes Verhältnis» stehen unmittelbar neben «nie recht froh»: Lesen trägt Heidi, löst aber ihren Kummer nicht auf.'},
    {id:'dark',label:'Die Grossmama zwingt Heidi gegen ihren Willen zum Vorlesen',feedback:'Der Wortlaut sagt das Gegenteil: Das Vorlesen macht Heidi «die grösste Freude». Suche nach dem Gegensatz im letzten Satz.'},
    {id:'memory',label:'Heidi verliert durch das Lesen den Bezug zu den Figuren',feedback:'Achte auf «lebte alles ganz mit durch» und «nahes Verhältnis». Die Passage beschreibt wachsende Nähe, nicht Distanz.'},
  ]},
  'peter-widerstand':{question:'Welche Spannung steckt in Peters zwei Antworten?',answer:'done-can',options:[
    {id:'done-can',label:'Er unterscheidet nicht zwischen «getan» und wirklich «können»',feedback:'Genau. Heidi meint eine bleibende Fähigkeit; Peter behandelt Lernen zunächst wie etwas, das man bloss erledigt.'},
    {id:'length',label:'Er möchte lieber einen längeren Text lesen',feedback:'Die Länge eines Textes kommt nicht vor. Vergleiche die Bedeutungen von «getan» und «kann».'},
    {id:'teacher',label:'Er verlangt nach einer anderen Lehrperson',feedback:'Das sagt Peter nicht. Seine knappen Antworten zeigen Widerstand gegen das Lernen selbst.'},
  ]},
  'peter-unterricht':{question:'Wie organisiert Heidi Peters Lernen?',answer:'repeat',options:[
    {id:'repeat',label:'Sie verbindet Vormachen, Wiederholen und kleine Einheiten',feedback:'Ja. Heidi liest das Ganze vor, kehrt zu drei Buchstaben zurück und bestätigt einen kleinen erreichten Schritt.'},
    {id:'alone',label:'Sie lässt Peter von Anfang an völlig allein lesen',feedback:'Im Gegenteil: Beide sitzen über demselben Buch, und Heidi macht vor, hört zu und entscheidet mit.'},
    {id:'one',label:'Sie erklärt jeden Buchstaben nur ein einziges Mal',feedback:'Achte auf den Rhythmus: «wieder», «noch einmal», «so lange». Wiederholung ist zentral.'},
  ]},
  'peter-transfer':{question:'Wodurch erhält Peters Lesen jetzt Bedeutung?',answer:'audience',options:[
    {id:'audience',label:'Es richtet sich an die Grossmutter und bewährt sich später in der Schule',feedback:'Genau. Lesen wird eine Handlung für jemanden – und die neue Fähigkeit zeigt sich danach auch im schulischen Raum.'},
    {id:'grade',label:'Peter bekommt sofort eine gute Schulnote',feedback:'Eine Note nennt der Text nicht. Frage stattdessen: Wer hört ihm zu, und wo zeigt sich das Können später?'},
    {id:'book',label:'Das Buch wird gegen ein leichteres ausgetauscht',feedback:'Von einem Buchwechsel ist nicht die Rede. Achte auf Adressatin und Ortswechsel.'},
  ]},
};

const markupGuides:Record<string,{highlights:string[];excerptInstruction:string}>={
  'heidi-schule':{highlights:['wenn er etwas erklärt','verstehst du nichts davon','erklärt er dir noch viel mehr','verstehst es noch weniger'],excerptInstruction:'Übernimm «erklärt … noch viel mehr» und «verstehst … noch weniger» getrennt. Notiere dahinter, wie die gegenläufige Steigerung Klaras Warnung verschärft.'},
  'heidi-oma':{highlights:['mit gespannter Aufmerksamkeit','mit leuchtenden Augen','tief Atem holend','wenn ich nur schon lesen könnte'],excerptInstruction:'Stelle «leuchtende Augen» direkt neben Heidis Wunsch «wenn ich nur schon lesen könnte». Halte fest, dass Körperzeichen und eigener Satz im selben Moment umschlagen.'},
  'heidi-verstehen':{highlights:['die größte Freude','desto lieber wurden sie ihm','lebte alles ganz mit durch','sehr nahes Verhältnis','Aber so recht froh','nie mehr zu sehen'],excerptInstruction:'Exzerpiere einen Ausdruck intensiver Lesefreude und einen Ausdruck des bleibenden Kummers. Notiere genau, was gleichzeitig gilt.'},
  'peter-widerstand':{highlights:['Hab’s schon getan','Jetzt muss du lesen lernen','dass du es nachher kannst','Kann nicht','sehr entschieden'],excerptInstruction:'Schreibe Peters «Hab’s schon getan» und Heidis «dass du es nachher kannst» untereinander. Notiere, ob Lernen als erledigte Handlung oder bleibende Fähigkeit erscheint.'},
  'peter-unterricht':{highlights:['buchstabieren und dann wieder','dann noch einmal','sauber und geläufig','hintereinander lesen','besser zusammenbuchstabieren'],excerptInstruction:'Ordne die Verben in Arbeitsreihenfolge: buchstabieren → wiederholen → ganz vorlesen → zusammenbuchstabieren. Ergänze, wer jeden Schritt ausführt oder bestimmt.'},
  'peter-transfer':{highlights:['ein Lied lesen','freute sich','aufhorchend neben ihm','mit Bewunderung','mit Spannung','herumzustottern'],excerptInstruction:'Exzerpiere eine Reaktion aus der Familie und die spätere Erwartung des Lehrers. Notiere, welche Wirkung Peters Lesen im einen Raum hat und welches alte Bild im anderen fortbesteht.'},
};

function Feedback({result}:{result:FeedbackResult}){return <div className={`instant-feedback ${result.tone}`} aria-live="polite"><i aria-hidden="true">{result.tone==='ready'?'✓':result.tone==='next'?'→':'·'}</i><span><b>{result.praise}</b><small><strong>Nächster Handgriff:</strong> {result.action}</small></span></div>}

const escapeRegExp=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function MarkedSentence({sentence,terms}:{sentence:string;terms:string[]}){
  if(!terms.length)return <>{sentence}</>;
  const expression=new RegExp(`(${[...terms].sort((a,b)=>b.length-a.length).map(escapeRegExp).join('|')})`,'gi');
  const lowered=new Set(terms.map(term=>term.toLocaleLowerCase('de-CH')));
  return <>{sentence.split(expression).map((part,index)=>lowered.has(part.toLocaleLowerCase('de-CH'))?<mark key={index}>{part}</mark>:part)}</>;
}

function Demo({onDone}:{onDone:()=>void}){
  const [step,setStep]=useState(0);
  const [playing,setPlaying]=useState(true);
  const frames=[
    {label:'1 · Überfliegen',title:'Sechs Sätze – noch ohne Stift',copy:'Zuerst wird nur der Ablauf sichtbar: Heidi betrachtet Bilder, erkennt Verlust und Heimkehr, liest die Geschichte wiederholt und verliert beim Lesen das Zeitgefühl.'},
    {label:'2 · Stolperwort',title:'Bei «Trebern» anhalten',copy:'Das unbekannte Wort wird nicht übersprungen. Der Satz verrät bereits: Es ist etwas, das der abgemagerte Sohn allein zu essen bekommt.'},
    {label:'3 · Kontext',title:'Eine Bedeutung vermuten',copy:'«Schweinchen hüten», «mager» und «allein noch zu essen» legen nahe: Trebern sind kein reichhaltiges Essen, sondern minderwertige Reste.'},
    {label:'4 · Klären',title:'Die Vermutung absichern',copy:'Trebern sind Rückstände vom Auspressen oder Brauen, die als Tierfutter dienen. Die Wortklärung erklärt nun genauer, wie tief der Sohn gesunken ist.'},
    {label:'5 · Grün anstreichen',title:'Wiederholung sichtbar machen',copy:'Nur Ausdrücke für Heidis wiederholtes Lesen werden grün markiert: «immer wieder», «laut und leise», «nie genug».'},
    {label:'6 · Ocker anstreichen',title:'Die Wirkung danebenlegen',copy:'Eine zweite Farbe gilt einer anderen Funktion: «gingen die Tage sehr schnell dahin» zeigt nicht Intensität, sondern die Wirkung auf Heidis Zeiterleben.'},
    {label:'7 · Randzeichen',title:'Markierungen beschriften',copy:'R steht für Wiederholung, Z für verändertes Zeiterleben. Eine Markierung ohne Randnotiz wäre nur Farbe; das Kürzel hält ihre Funktion fest.'},
    {label:'8 · Exzerpieren',title:'Wortlaut und Notiz trennen',copy:'Das Exzerpt übernimmt nicht den ganzen Absatz. Es notiert zwei kurze Belege, Seitenangabe und je eine knappe Beobachtung – noch keine fertige Deutung.'},
    {label:'9 · Verbinden',title:'Aus zwei Notizen wird eine Aussage',copy:'Wiederholtes Lesen bindet Heidi an die Geschichte; zugleich lässt es die verbleibende Zeit mit der Grossmama schnell vergehen.'},
    {label:'10 · Begrenzen',title:'Die Aussage bleibt am Text',copy:'Die Passage zeigt intensive Lektüre und verändertes Zeiterleben. Sie beweist nicht, dass Lesen Heidis Heimweh heilt oder jede Schwierigkeit löst.'},
  ];
  useEffect(()=>{if(!playing||step>=frames.length-1)return;const timer=window.setTimeout(()=>setStep(value=>value+1),2600);return()=>window.clearTimeout(timer)},[playing,step,frames.length]);
  const restart=()=>{setStep(0);setPlaying(true)};
  return <section className="lab-demo" aria-label="Animiertes Erklärbeispiel">
    <header><div><span>Bevor du beginnst</span><h2>So wird aus einer Stelle<br/><em>eine Deutung.</em></h2></div><button onClick={onDone}>Beispiel überspringen</button></header>
    <div className={`demo-stage demo-stage-${step}`}>
      <div className="demo-source"><small>Originalpassage · Johanna Spyri, «Heidi» · PDF-S. 104–105</small><p>
        <span>Am liebsten beschaute Heidi immer wieder seine grüne Weide und den Hirten mitten unter der Herde, wie er so vergnüglich, auf seinen langen Stab gelehnt, dastand, denn da war er noch bei der schönen Herde des Vaters und ging nur den lustigen Schäfchen und Ziegen nach, weil es ihn freute.</span>
        <span>Aber da kam das Bild, wo er vom Vaterhaus weggelaufen und in der Fremde war und die Schweinchen hüten musste und ganz mager geworden war bei den <mark className={`word-mark ${step>=1?'active':''}`}>Trebern</mark>, die er allein noch zu essen bekam.</span>
        <span>Und auf dem Bilde schien auch die Sonne nicht mehr so golden, da war das Land grau und nebelig.</span>
        <span>Aber dann kam noch ein Bild zu der Geschichte: Da kam der alte Vater mit ausgebreiteten Armen aus dem Hause heraus und lief dem heimkehrenden, reuigen Sohn entgegen, um ihn zu empfangen, der ganz furchtsam und abgemagert in einem zerrissenen Wams daherkam.</span>
        <span>Das war Heidis Lieblingsgeschichte, die es <mark className={`repeat-mark ${step>=4?'active':''}`}>immer wieder las, laut und leise</mark>, und es konnte <mark className={`repeat-mark ${step>=4?'active':''}`}>nie genug von der Erklärung bekommen</mark>, welche die Großmama den Kindern dazu machte.<i className={`margin-code ${step>=6?'active':''}`}>R</i></span>
        <span>Da waren aber noch so viele schöne Geschichten in dem Buch, und bei dem Lesen und dem Bilderbesehen <mark className={`time-mark ${step>=5?'active':''}`}>gingen die Tage sehr schnell dahin</mark>, und schon nahte die Zeit heran, welche die Großmama zu ihrer Abreise bestimmt hatte.<i className={`margin-code time ${step>=6?'active':''}`}>Z</i></span>
      </p></div>
      <div className="demo-thinking"><div className="demo-progress" aria-label={`Beispielschritt ${step+1} von ${frames.length}`}>{frames.map((_,index)=><span className={index<=step?'active':''} key={index}/>)}</div><small>{frames[step].label}</small><h3>{frames[step].title}</h3><p key={step}>{frames[step].copy}</p>
        {step>=1&&step<=3&&<div className={`demo-word-card stage-${step}`}><b>Trebern</b><span>{step===1?'Was verrät der Satz schon?':step===2?'Vermutung aus dem Kontext':'Geklärte Bedeutung'}</span><p>{step===1?'Nahrung · Schweine · mager':step===2?'wahrscheinlich minderwertige Essensreste':'Press- oder Braurückstände; meist als Tierfutter verwendet'}</p></div>}
        {step>=7&&<div className="demo-excerpt"><header><b>Mini-Exzerpt</b><span>PDF-S. 104–105</span></header><div><q>immer wieder … laut und leise</q><p>R: wiederholtes, variables Lesen</p></div><div><q>die Tage sehr schnell dahin</q><p>Z: Lesen verändert das Zeiterleben</p></div>{step>=8&&<footer><span>Verbindung</span><p>{step===8?'Wiederholung + Zeiterleben → intensive Bindung an die Geschichte':'Belegt: Vertiefung und Zeiterleben. Nicht belegt: Heilung des Heimwehs.'}</p></footer>}</div>}
      </div>
    </div>
    <footer><button onClick={restart}>↻ Noch einmal zeigen</button><div><button disabled={step===0} onClick={()=>{setPlaying(false);setStep(value=>Math.max(0,value-1))}}>Zurück</button><button onClick={()=>{if(step<frames.length-1){setPlaying(false);setStep(value=>value+1)}else onDone()}}>{step<frames.length-1?'Nächster Schritt':'Jetzt selbst untersuchen →'}</button></div></footer>
    <p className="demo-note">Originalwortlaut der bereitgestellten Ausgabe. Die Hervorhebungen gehören zur Demonstration, nicht zum Romantext.</p>
  </section>
}

export default function TextLab({onClose}:{onClose:()=>void}){
  const [view,setView]=useState<'demo'|'lab'>('demo');
  const [reader,setReader]=useState<'Heidi'|'Peter'>('Heidi');
  const passages=labPassages.filter(item=>item.reader===reader);
  const [activeId,setActiveId]=useState(passages[0].id);
  const [microStep,setMicroStep]=useState(0);
  const [state,setState]=useState<LabState>(load);
  const active=labPassages.find(item=>item.id===activeId)!;
  const stored=state.entries[activeId]||emptyEntry();
  const entry={...emptyEntry(),...stored,counterMark:stored.counterMark??null};
  const guide=guides[activeId];
  const coach=passageCoaches[activeId];
  const markup=markupGuides[activeId];
  useEffect(()=>{try{localStorage.setItem(TEXTLAB_KEY,JSON.stringify(state))}catch{}},[state]);
  const isComplete=(id:string)=>{const value={...emptyEntry(),...state.entries[id]};const passage=labPassages.find(item=>item.id===id)!;const passageCoach=passageCoaches[id];return value.marks.length===1&&value.words.length>0&&value.signalChoice===guides[id].answer&&value.highlights.length>0&&value.excerpt.trim().length>15&&observationFeedback(value.observation,passage.sentences[value.marks[0]]||'',passageCoach).tone==='ready'&&interpretationFeedback(value.interpretation,value.observation,passageCoach).tone==='ready'&&checkFeedback(value.check,passage.sentences[value.counterMark??-1]||'',passageCoach).tone==='ready'};
  const done=labPassages.filter(item=>isComplete(item.id)).length;
  const changeReader=(next:'Heidi'|'Peter')=>{setReader(next);setActiveId(labPassages.find(item=>item.reader===next)!.id);setMicroStep(0)};
  const changePassage=(id:string)=>{setActiveId(id);setMicroStep(0)};
  const update=(patch:Partial<Entry>)=>setState(current=>({...current,entries:{...current.entries,[activeId]:{...emptyEntry(),...current.entries[activeId],...patch}}}));
  const updateComparison=(dimension:string,value:string)=>setState(current=>({...current,comparison:{...current.comparison,[dimension]:value}}));
  const steps=['Belegsatz','Wort klären','Textsignal','Anstreichen','Exzerpieren','Beobachtung','Deutung','Gegenprobe','Ergebnis'];
  const next=()=>setMicroStep(value=>Math.min(steps.length-1,value+1));
  const observationResult=observationFeedback(entry.observation,active.sentences[entry.marks[0]]||'',coach);
  const interpretationResult=interpretationFeedback(entry.interpretation,entry.observation,coach);
  const checkResult=checkFeedback(entry.check,active.sentences[entry.counterMark??-1]||'',coach);

  return <div className="modal-backdrop textlab-backdrop" role="dialog" aria-modal="true" aria-label="Textlabor: Das Lesen lesen"><section className="textlab-shell">
    <header className="textlab-head"><button onClick={onClose}>← Zurück</button><div><small>Modus 03 · Textlabor</small><b>Das Lesen lesen</b></div><span>{view==='demo'?'Erklärbeispiel':`${done}/6 Lesespuren geprüft`}</span></header>
    {view==='demo'?<Demo onDone={()=>setView('lab')}/>:<>
      <div className="textlab-intro"><span className="kicker">Genau lesen · mit Sofortfeedback</span><h2>Eine Textspur.<br/><em>Ein Schritt nach dem anderen.</em></h2><p>Du klärst ein Stolperwort aus seinem Satz, streichst Ausdrücke nach ihrer Funktion an und überführst sie mit Seitenangabe in ein Exzerpt. Erst daraus entstehen Beobachtung, Deutung und Gegenprobe.</p><button className="watch-demo" onClick={()=>setView('demo')}>▶ Erklärbeispiel nochmals ansehen</button></div>
      <div className="reader-switch" role="tablist" aria-label="Leseweg wählen"><button role="tab" aria-selected={reader==='Heidi'} className={reader==='Heidi'?'active':''} onClick={()=>changeReader('Heidi')}><small>Leseweg A</small>Heidi</button><button role="tab" aria-selected={reader==='Peter'} className={reader==='Peter'?'active':''} onClick={()=>changeReader('Peter')}><small>Leseweg B</small>Peter</button></div>
      <div className="textlab-layout"><aside className="passage-rail"><small>{reader}s Leseweg</small>{passages.map((item,index)=><button aria-current={activeId===item.id?'step':undefined} className={activeId===item.id?'active':''} onClick={()=>changePassage(item.id)} key={item.id}><span>0{index+1}</span><div><small>{item.phase}</small><b>{item.title}</b></div><i>{isComplete(item.id)?'●':'○'}</i></button>)}<div className="lab-method"><b>Deine neun Schritte</b>{steps.map((step,index)=><span className={index===microStep?'active':''} key={step}>{index+1} · {step}</span>)}</div></aside>
        <div className="lab-bench"><header><div><small>{active.phase} · {active.chapter}</small><h3>{active.title}</h3></div><span>{active.pdfPages}</span></header><p className="edition-note">Wortlaut der bereitgestellten Ausgabe; die Markierung verändert den Text nicht.</p>
          <nav className="micro-nav" aria-label="Arbeitsschritte">{steps.map((label,index)=><button key={label} className={index===microStep?'active':index<microStep?'visited':''} onClick={()=>setMicroStep(index)} aria-current={index===microStep?'step':undefined}><i>{index<microStep?'✓':index+1}</i><span>{label}</span></button>)}</nav>
          {microStep===0&&<section className="micro-card"><header><span>01</span><div><small>Orientieren</small><h4>{coach.selectTitle}</h4></div></header><p>{coach.selectInstruction}</p><div className="passage-text select-one">{active.sentences.map((sentence,index)=><button aria-pressed={entry.marks.includes(index)} className={entry.marks.includes(index)?'marked':''} onClick={()=>update({marks:[index],counterMark:entry.counterMark===index?null:entry.counterMark,highlights:[]})} key={index}><span>{String(index+1).padStart(2,'0')}</span>{sentence}</button>)}</div><Feedback result={entry.marks.length===1?{tone:'ready',praise:`Du hast Satz ${entry.marks[0]+1} gewählt: «${active.sentences[entry.marks[0]].slice(0,90)}${active.sentences[entry.marks[0]].length>90?'…':''}»`,action:`Bevor du ihn deutest, klärst du ein Wort aus «${active.title}» über seinen Satzkontext.`}:{tone:'pause',praise:`Diese Lesespur untersucht «${active.title}».`,action:coach.selectEmpty}}/><button className="micro-next" disabled={entry.marks.length!==1} onClick={next}>Ein Stolperwort klären →</button></section>}

          {microStep===1&&<section className="micro-card"><header><span>02</span><div><small>Wortwerkstatt</small><h4>Was bedeuten «{active.vocabulary[0].word}» und «{active.vocabulary[1].word}» hier?</h4></div></header><p>Klicke zuerst auf das Wort: Der Kontext liefert eine Vermutung. Öffne danach die genaue Bedeutung und vergleiche beides.</p><div className="vocabulary-workbench">{active.vocabulary.map(item=>{const stage=entry.words.includes(`${item.word}:meaning`)?2:entry.words.includes(item.word)?1:0;return <article className={`vocabulary-card stage-${stage}`} key={item.word}><button onClick={()=>update({words:stage===0?[...entry.words,item.word]:stage===1?[...entry.words,`${item.word}:meaning`]:entry.words.filter(word=>word!==item.word&&word!==`${item.word}:meaning`)})} aria-expanded={stage>0}><span>{item.word}</span><i>{stage===0?'Kontext öffnen':stage===1?'Bedeutung prüfen':'nochmals schliessen'}</i></button>{stage>0&&<div><small>{stage===1?'Hinweise aus genau dieser Passage':'Bedeutung an dieser Stelle'}</small><p>{stage===1?item.clue:item.meaning}</p></div>}</article>})}</div><Feedback result={entry.words.some(word=>word.endsWith(':meaning'))?{tone:'ready',praise:`Du hast ein Wort aus «${active.title}» über Kontext und Bedeutung geklärt.`,action:`Prüfe nun bei «${guide.question}», welches sprachliche Signal die Passage tatsächlich trägt.`}:{tone:entry.words.length?'next':'pause',praise:entry.words.length?'Deine Kontextvermutung ist geöffnet.':'Noch ist kein schwieriges Wort untersucht.',action:entry.words.length?'Öffne beim selben Wort nun die genaue Bedeutung und vergleiche sie mit dem Satzkontext.':`Beginne mit «${active.vocabulary[0].word}» oder «${active.vocabulary[1].word}».`}}/><button className="micro-next" disabled={!entry.words.some(word=>word.endsWith(':meaning'))} onClick={next}>Zum Textsignal →</button></section>}

          {microStep===2&&<section className="micro-card"><header><span>03</span><div><small>Erkennen</small><h4>{guide.question}</h4></div></header><p>{coach.selectInstruction}</p><div className="checkpoint-options">{guide.options.map(option=><button aria-pressed={entry.signalChoice===option.id} className={entry.signalChoice===option.id?(option.id===guide.answer?'correct':'retry'):''} onClick={()=>update({signalChoice:option.id})} key={option.id}>{option.label}</button>)}</div>{entry.signalChoice?<Feedback result={{tone:entry.signalChoice===guide.answer?'ready':'next',praise:entry.signalChoice===guide.answer?`Diese Beobachtung passt zu «${active.title}».`:`Diese Möglichkeit lässt sich an «${active.title}» nicht halten.`,action:guide.options.find(option=>option.id===entry.signalChoice)!.feedback}}/>:<Feedback result={{tone:'pause',praise:`Drei Lesarten konkurrieren um den Satz aus «${active.title}».`,action:`Suche in den Antworten nach dem Wortsignal, das ${coach.selectTitle.toLocaleLowerCase('de-CH')}`}}/>}<button className="micro-next" disabled={entry.signalChoice!==guide.answer} onClick={next}>Die tragenden Wörter anstreichen →</button></section>}

          {microStep===3&&<section className="micro-card"><header><span>04</span><div><small>Funktional markieren</small><h4>Welche Wörter tragen deine Beobachtung zu «{active.title}»?</h4></div></header><p>{coach.observationInstruction} Eine Markierung zählt hier erst, wenn du sagen kannst, wofür sie später im Exzerpt gebraucht wird.</p><div className="marking-board"><div className="marked-passage">{active.sentences.map((sentence,index)=><p key={index}><span>{String(index+1).padStart(2,'0')}</span><span><MarkedSentence sentence={sentence} terms={entry.highlights}/></span></p>)}</div><div>{markup.highlights.map(term=><button className={entry.highlights.includes(term)?'active':''} aria-pressed={entry.highlights.includes(term)} onClick={()=>update({highlights:entry.highlights.includes(term)?entry.highlights.filter(value=>value!==term):[...entry.highlights,term]})} key={term}><i/>«{term}»</button>)}</div></div><Feedback result={entry.highlights.length?{tone:'ready',praise:`Du hast «${entry.highlights.join('» und «')}» im Wortlaut sichtbar gemacht.`,action:markup.excerptInstruction}:{tone:'pause',praise:`Die Passage «${active.title}» ist noch unmarkiert.`,action:`Wähle unten den Ausdruck, der ${guide.question.toLocaleLowerCase('de-CH')}`}}/><button className="micro-next" disabled={!entry.highlights.length} onClick={next}>Markierungen exzerpieren →</button></section>}

          {microStep===4&&<section className="micro-card"><header><span>05</span><div><small>Exzerptblatt</small><h4>Wie wird aus der Markierung eine brauchbare Textnotiz?</h4></div></header><p>{markup.excerptInstruction}</p><div className="excerpt-sheet"><header><span>{active.chapter}</span><b>{active.pdfPages}</b></header>{entry.highlights.map((term,index)=><div key={term}><small>Beleg {index+1}</small><q>{term}</q></div>)}<label>Knappe Beobachtung – noch ohne Gesamtdeutung<textarea value={entry.excerpt} onChange={event=>update({excerpt:event.target.value})} placeholder={`${entry.highlights.map(term=>`«${term}»`).join(' + ')}: Im Wortlaut fällt auf, dass …`}/></label></div><Feedback result={entry.excerpt.trim().length>15?{tone:'ready',praise:`Dein Exzerpt verbindet ${active.pdfPages} mit «${entry.highlights.join('» / «')}».`,action:coach.observationNext}:{tone:'pause',praise:`Die Belege aus «${active.title}» stehen bereits mit Seitenangabe auf dem Exzerptblatt.`,action:markup.excerptInstruction}}/><button className="micro-next" disabled={entry.excerpt.trim().length<=15} onClick={next}>Aus dem Exzerpt beobachten →</button></section>}

          {microStep===5&&<section className="micro-card"><header><span>06</span><div><small>Beschreiben</small><h4>{coach.observationTitle}</h4></div></header><div className="evidence-carry"><small>Dein Exzerpt zu {active.pdfPages}</small><p>{entry.excerpt}</p></div><p>{coach.observationInstruction}</p><div className="text-lenses"><small>Textlupen für «{active.title}»</small>{active.lenses.map(lens=><span key={lens}>{lens}</span>)}</div><textarea value={entry.observation} onChange={event=>update({observation:event.target.value})} placeholder={`Im gewählten Satz fällt «${coach.focus[0]}» auf, weil …`}/><Feedback result={observationResult}/><button className="micro-next" disabled={observationResult.tone!=='ready'} onClick={next}>Aus der Beobachtung deuten →</button></section>}
          {microStep===6&&<section className="micro-card"><header><span>07</span><div><small>Verknüpfen</small><h4>{coach.interpretationTitle}</h4></div></header><div className="evidence-carry"><small>Deine Beobachtung zu «{active.title}»</small><p>{entry.observation||`Noch fehlt deine Beobachtung zu «${coach.focus[0]}».`}</p></div><p>{coach.interpretationInstruction}</p><textarea value={entry.interpretation} onChange={event=>update({interpretation:event.target.value})} placeholder={coach.interpretationNext}/><Feedback result={interpretationResult}/><button className="micro-next" disabled={interpretationResult.tone!=='ready'} onClick={next}>Die Deutung gegenprüfen →</button></section>}
          {microStep===7&&<section className="micro-card"><header><span>08</span><div><small>Differenzieren</small><h4>{coach.counterTitle}</h4></div></header><p>{coach.counterInstruction}</p><div className="counter-sentences">{active.sentences.map((sentence,index)=><button disabled={entry.marks.includes(index)} aria-pressed={entry.counterMark===index} className={entry.counterMark===index?'marked':''} onClick={()=>update({counterMark:index})} key={index}><span>{String(index+1).padStart(2,'0')}</span>{sentence}</button>)}</div><textarea value={entry.check} onChange={event=>update({check:event.target.value})} placeholder={coach.counterNext}/><Feedback result={checkResult}/><button className="micro-next" disabled={checkResult.tone!=='ready'} onClick={next}>Die vollständige Lesespur ansehen →</button></section>}
          {microStep===8&&<section className="micro-card result-card"><header><span>09</span><div><small>{active.title} · Lesespur abgeschlossen</small><h4>{coach.result}</h4></div></header><div className="result-chain"><div><small>Geklärtes Wort</small><p>{entry.words.find(word=>word.endsWith(':meaning'))?.replace(':meaning','')||'–'}</p></div><div><small>Exzerpt · {active.pdfPages}</small><p>{entry.excerpt||'–'}</p></div><div><small>Beobachtung</small><p>{entry.observation||'–'}</p></div><div><small>Deutung</small><p>{entry.interpretation||'–'}</p></div><div><small>Gegenprobe</small><p>{entry.check||'–'}</p></div></div><Feedback result={isComplete(activeId)?{tone:'ready',praise:`Deine Deutung zu «${active.title}» wächst nachvollziehbar aus Wortklärung, Markierung, Exzerpt und Gegenprobe.`,action:coach.result}:{tone:'next',praise:`Die Lesespur zu «${active.title}» ist noch nicht vollständig geschlossen.`,action:!entry.words.length?`Kläre zuerst «${active.vocabulary[0].word}» über den Kontext.`:!entry.highlights.length?markup.excerptInstruction:!entry.excerpt.trim()?markup.excerptInstruction:[observationResult,interpretationResult,checkResult].find(result=>result.tone!=='ready')?.action||coach.counterNext}}/></section>}
          <p className="feedback-disclaimer">Das Sofortfeedback prüft Aufbau und Textbezug – nicht, ob nur eine einzige Deutung möglich ist.</p>
        </div>
      </div>
      <section className="reading-comparison"><span className="kicker">Beide Lesewege zusammendenken</span><h2>Heidi liest anders. Peter auch.</h2><p>Der Vergleich trennt Beobachtung von vorschnellem Urteil: Nicht nur das Ergebnis, sondern Motivation, Beziehung, Methode und Wirkung des Lesens werden sichtbar.</p><div>{comparisonDimensions.map(dimension=><label key={dimension}><span>{dimension}</span><textarea value={state.comparison[dimension]||''} onChange={event=>updateComparison(dimension,event.target.value)} placeholder="Heidi … / Peter …"/></label>)}</div></section>
    </>}
  </section></div>
}
