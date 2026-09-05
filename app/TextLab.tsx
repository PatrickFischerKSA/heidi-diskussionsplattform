'use client';

import { useEffect, useState } from 'react';
import { comparisonDimensions, labPassages } from './textLabData';
import { checkFeedback, FeedbackResult, interpretationFeedback, observationFeedback, passageCoaches } from './textLabCoaching';

type Entry={marks:number[];signalChoice:string;observation:string;interpretation:string;counterMark:number|null;check:string};
export type LabState={entries:Record<string,Entry>;comparison:Record<string,string>};
export const TEXTLAB_KEY='denkraum-textlabor-v1';
const emptyEntry=():Entry=>({marks:[],signalChoice:'',observation:'',interpretation:'',counterMark:null,check:''});
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

function Feedback({result}:{result:FeedbackResult}){return <div className={`instant-feedback ${result.tone}`} aria-live="polite"><i aria-hidden="true">{result.tone==='ready'?'✓':result.tone==='next'?'→':'·'}</i><span><b>{result.praise}</b><small><strong>Nächster Handgriff:</strong> {result.action}</small></span></div>}

function Demo({onDone}:{onDone:()=>void}){
  const [step,setStep]=useState(0);
  const [playing,setPlaying]=useState(true);
  const frames=[
    {label:'1 · Lesen',title:'Zuerst den Verlauf erfassen',copy:'Lies alle sechs Sätze. Verfolge, wie Bild, Geschichte, Heimkehr, Erklärung und vergehende Zeit miteinander verbunden werden.'},
    {label:'2 · Markieren',title:'Mehrere Textsignale verbinden',copy:'«immer wieder», «laut und leise» und «nie genug» zeigen Wiederholung und Intensität; «aber» gliedert die Geschichte in Wendungen.'},
    {label:'3 · Beobachten',title:'Beim Wortlaut bleiben',copy:'Heidi kehrt zur Geschichte zurück, liest auf verschiedene Arten und verlangt wiederholt nach der Erklärung der Grossmama.'},
    {label:'4 · Deuten',title:'Eine vorsichtige Bedeutung bilden',copy:'Lesen erscheint hier als wiederholtes Durchleben: Bild, eigener Leseakt und Gespräch machen die Geschichte für Heidi bedeutsam.'},
    {label:'5 · Gegenprüfen',title:'Die Deutung begrenzen',copy:'Die Passage nennt nicht nur Vertiefung. «Die Tage gingen sehr schnell dahin» zeigt zugleich, dass Lesen Heidis Zeiterleben verändert.'},
  ];
  useEffect(()=>{if(!playing||step>=frames.length-1)return;const timer=window.setTimeout(()=>setStep(value=>value+1),2300);return()=>window.clearTimeout(timer)},[playing,step,frames.length]);
  const restart=()=>{setStep(0);setPlaying(true)};
  return <section className="lab-demo" aria-label="Animiertes Erklärbeispiel">
    <header><div><span>Bevor du beginnst</span><h2>So wird aus einer Stelle<br/><em>eine Deutung.</em></h2></div><button onClick={onDone}>Beispiel überspringen</button></header>
    <div className={`demo-stage demo-stage-${step}`}>
      <div className="demo-source"><small>Originalpassage · Johanna Spyri, «Heidi» · PDF-S. 104–105</small><p>
        <span>Am liebsten beschaute Heidi immer wieder seine grüne Weide und den Hirten mitten unter der Herde, wie er so vergnüglich, auf seinen langen Stab gelehnt, dastand, denn da war er noch bei der schönen Herde des Vaters und ging nur den lustigen Schäfchen und Ziegen nach, weil es ihn freute.</span>
        <span>Aber da kam das Bild, wo er vom Vaterhaus weggelaufen und in der Fremde war und die Schweinchen hüten musste und ganz mager geworden war bei den Trebern, die er allein noch zu essen bekam.</span>
        <span>Und auf dem Bilde schien auch die Sonne nicht mehr so golden, da war das Land grau und nebelig.</span>
        <span>Aber dann kam noch ein Bild zu der Geschichte: Da kam der alte Vater mit ausgebreiteten Armen aus dem Hause heraus und lief dem heimkehrenden, reuigen Sohn entgegen, um ihn zu empfangen, der ganz furchtsam und abgemagert in einem zerrissenen Wams daherkam.</span>
        <span>Das war Heidis Lieblingsgeschichte, die es <mark>immer wieder las, laut und leise</mark>, und es konnte <mark>nie genug von der Erklärung bekommen</mark>, welche die Großmama den Kindern dazu machte.</span>
        <span>Da waren aber noch so viele schöne Geschichten in dem Buch, und bei dem Lesen und dem Bilderbesehen <mark>gingen die Tage sehr schnell dahin</mark>, und schon nahte die Zeit heran, welche die Großmama zu ihrer Abreise bestimmt hatte.</span>
      </p></div>
      <div className="demo-thinking"><div className="demo-progress" aria-label={`Beispielschritt ${step+1} von ${frames.length}`}>{frames.map((_,index)=><span className={index<=step?'active':''} key={index}/>)}</div><small>{frames[step].label}</small><h3>{frames[step].title}</h3><p key={step}>{frames[step].copy}</p></div>
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
  useEffect(()=>{try{localStorage.setItem(TEXTLAB_KEY,JSON.stringify(state))}catch{}},[state]);
  const isComplete=(id:string)=>{const value={...emptyEntry(),...state.entries[id]};const passage=labPassages.find(item=>item.id===id)!;const passageCoach=passageCoaches[id];return value.marks.length===1&&value.signalChoice===guides[id].answer&&observationFeedback(value.observation,passage.sentences[value.marks[0]]||'',passageCoach).tone==='ready'&&interpretationFeedback(value.interpretation,value.observation,passageCoach).tone==='ready'&&checkFeedback(value.check,passage.sentences[value.counterMark??-1]||'',passageCoach).tone==='ready'};
  const done=labPassages.filter(item=>isComplete(item.id)).length;
  const changeReader=(next:'Heidi'|'Peter')=>{setReader(next);setActiveId(labPassages.find(item=>item.reader===next)!.id);setMicroStep(0)};
  const changePassage=(id:string)=>{setActiveId(id);setMicroStep(0)};
  const update=(patch:Partial<Entry>)=>setState(current=>({...current,entries:{...current.entries,[activeId]:{...emptyEntry(),...current.entries[activeId],...patch}}}));
  const updateComparison=(dimension:string,value:string)=>setState(current=>({...current,comparison:{...current.comparison,[dimension]:value}}));
  const steps=['Belegsatz','Textsignal','Beobachtung','Deutung','Gegenprobe','Ergebnis'];
  const next=()=>setMicroStep(value=>Math.min(steps.length-1,value+1));
  const observationResult=observationFeedback(entry.observation,active.sentences[entry.marks[0]]||'',coach);
  const interpretationResult=interpretationFeedback(entry.interpretation,entry.observation,coach);
  const checkResult=checkFeedback(entry.check,active.sentences[entry.counterMark??-1]||'',coach);

  return <div className="modal-backdrop textlab-backdrop" role="dialog" aria-modal="true" aria-label="Textlabor: Das Lesen lesen"><section className="textlab-shell">
    <header className="textlab-head"><button onClick={onClose}>← Zurück</button><div><small>Modus 03 · Textlabor</small><b>Das Lesen lesen</b></div><span>{view==='demo'?'Erklärbeispiel':`${done}/6 Lesespuren geprüft`}</span></header>
    {view==='demo'?<Demo onDone={()=>setView('lab')}/>:<>
      <div className="textlab-intro"><span className="kicker">Genau lesen · mit Sofortfeedback</span><h2>Eine Textspur.<br/><em>Ein Schritt nach dem anderen.</em></h2><p>Du wählst, beobachtest, deutest und prüfst. Nach jedem kleinen Schritt zeigt dir das Labor, was bereits trägt und woran du als Nächstes weiterarbeiten kannst.</p><button className="watch-demo" onClick={()=>setView('demo')}>▶ Erklärbeispiel nochmals ansehen</button></div>
      <div className="reader-switch" role="tablist" aria-label="Leseweg wählen"><button role="tab" aria-selected={reader==='Heidi'} className={reader==='Heidi'?'active':''} onClick={()=>changeReader('Heidi')}><small>Leseweg A</small>Heidi</button><button role="tab" aria-selected={reader==='Peter'} className={reader==='Peter'?'active':''} onClick={()=>changeReader('Peter')}><small>Leseweg B</small>Peter</button></div>
      <div className="textlab-layout"><aside className="passage-rail"><small>{reader}s Leseweg</small>{passages.map((item,index)=><button aria-current={activeId===item.id?'step':undefined} className={activeId===item.id?'active':''} onClick={()=>changePassage(item.id)} key={item.id}><span>0{index+1}</span><div><small>{item.phase}</small><b>{item.title}</b></div><i>{isComplete(item.id)?'●':'○'}</i></button>)}<div className="lab-method"><b>Deine sechs Schritte</b>{steps.map((step,index)=><span className={index===microStep?'active':''} key={step}>{index+1} · {step}</span>)}</div></aside>
        <div className="lab-bench"><header><div><small>{active.phase} · {active.chapter}</small><h3>{active.title}</h3></div><span>{active.pdfPages}</span></header><p className="edition-note">Wortlaut der bereitgestellten Ausgabe; die Markierung verändert den Text nicht.</p>
          <nav className="micro-nav" aria-label="Arbeitsschritte">{steps.map((label,index)=><button key={label} className={index===microStep?'active':index<microStep?'visited':''} onClick={()=>setMicroStep(index)} aria-current={index===microStep?'step':undefined}><i>{index<microStep?'✓':index+1}</i><span>{label}</span></button>)}</nav>
          {microStep===0&&<section className="micro-card"><header><span>01</span><div><small>Orientieren</small><h4>{coach.selectTitle}</h4></div></header><p>{coach.selectInstruction}</p><div className="passage-text select-one">{active.sentences.map((sentence,index)=><button aria-pressed={entry.marks.includes(index)} className={entry.marks.includes(index)?'marked':''} onClick={()=>update({marks:[index],counterMark:entry.counterMark===index?null:entry.counterMark})} key={index}><span>{String(index+1).padStart(2,'0')}</span>{sentence}</button>)}</div><Feedback result={entry.marks.length===1?{tone:'ready',praise:`Du hast Satz ${entry.marks[0]+1} gewählt: «${active.sentences[entry.marks[0]].slice(0,90)}${active.sentences[entry.marks[0]].length>90?'…':''}»`,action:coach.observationInstruction}:{tone:'pause',praise:`Diese Lesespur untersucht «${active.title}».`,action:coach.selectEmpty}}/><button className="micro-next" disabled={entry.marks.length!==1} onClick={next}>Weiter zum Textsignal →</button></section>}
          {microStep===1&&<section className="micro-card"><header><span>02</span><div><small>Erkennen</small><h4>{guide.question}</h4></div></header><p>Wähle die Beobachtung, die sich direkt am Wortlaut prüfen lässt.</p><div className="checkpoint-options">{guide.options.map(option=><button aria-pressed={entry.signalChoice===option.id} className={entry.signalChoice===option.id?(option.id===guide.answer?'correct':'retry'):''} onClick={()=>update({signalChoice:option.id})} key={option.id}>{option.label}</button>)}</div>{entry.signalChoice?<Feedback result={{tone:entry.signalChoice===guide.answer?'ready':'next',praise:entry.signalChoice===guide.answer?'Gut belegt: Du hast das zentrale Textsignal erkannt.':'Du hast eine Möglichkeit geprüft. Genau so werden unpassende Lesarten sichtbar.',action:guide.options.find(option=>option.id===entry.signalChoice)!.feedback}}/>:<Feedback result={{tone:'pause',praise:'Du vergleichst drei mögliche Beobachtungen.',action:'Prüfe jede Aussage an einem konkreten Wort der Passage. Wähle dann diejenige, für die du den deutlichsten Wortbeleg findest.'}}/>}<button className="micro-next" disabled={entry.signalChoice!==guide.answer} onClick={next}>Weiter zur eigenen Beobachtung →</button></section>}
          {microStep===2&&<section className="micro-card"><header><span>03</span><div><small>Beschreiben</small><h4>{coach.observationTitle}</h4></div></header><p>{coach.observationInstruction}</p><div className="text-lenses"><small>Textlupen für «{active.title}»</small>{active.lenses.map(lens=><span key={lens}>{lens}</span>)}</div><textarea value={entry.observation} onChange={event=>update({observation:event.target.value})} placeholder={`Im gewählten Satz fällt «${coach.focus[0]}» auf, weil …`}/><Feedback result={observationResult}/><button className="micro-next" disabled={observationResult.tone!=='ready'} onClick={next}>Weiter zur Deutung →</button></section>}
          {microStep===3&&<section className="micro-card"><header><span>04</span><div><small>Verknüpfen</small><h4>{coach.interpretationTitle}</h4></div></header><div className="evidence-carry"><small>Deine Beobachtung zu «{active.title}»</small><p>{entry.observation||`Noch fehlt deine Beobachtung zu «${coach.focus[0]}».`}</p></div><p>{coach.interpretationInstruction}</p><textarea value={entry.interpretation} onChange={event=>update({interpretation:event.target.value})} placeholder={coach.interpretationNext}/><Feedback result={interpretationResult}/><button className="micro-next" disabled={interpretationResult.tone!=='ready'} onClick={next}>Weiter zur Gegenprobe →</button></section>}
          {microStep===4&&<section className="micro-card"><header><span>05</span><div><small>Differenzieren</small><h4>{coach.counterTitle}</h4></div></header><p>{coach.counterInstruction}</p><div className="counter-sentences">{active.sentences.map((sentence,index)=><button disabled={entry.marks.includes(index)} aria-pressed={entry.counterMark===index} className={entry.counterMark===index?'marked':''} onClick={()=>update({counterMark:index})} key={index}><span>{String(index+1).padStart(2,'0')}</span>{sentence}</button>)}</div><textarea value={entry.check} onChange={event=>update({check:event.target.value})} placeholder={coach.counterNext}/><Feedback result={checkResult}/><button className="micro-next" disabled={checkResult.tone!=='ready'} onClick={next}>Ergebnis ansehen →</button></section>}
          {microStep===5&&<section className="micro-card result-card"><header><span>06</span><div><small>{active.title} · Lesespur abgeschlossen</small><h4>{coach.result}</h4></div></header><div className="result-chain"><div><small>Beleg</small><p>{active.sentences[entry.marks[0]]||'–'}</p></div><div><small>Beobachtung</small><p>{entry.observation||'–'}</p></div><div><small>Deutung</small><p>{entry.interpretation||'–'}</p></div><div><small>Gegenprobe</small><p>{entry.check||'–'}</p></div></div><Feedback result={isComplete(activeId)?{tone:'ready',praise:`Deine Deutung zu «${active.title}» verbindet den gewählten Satz mit seiner Gegenprobe.`,action:coach.result}:{tone:'next',praise:`Die Lesespur zu «${active.title}» ist noch nicht vollständig geschlossen.`,action:[observationResult,interpretationResult,checkResult].find(result=>result.tone!=='ready')?.action||coach.counterNext}}/></section>}
          <p className="feedback-disclaimer">Das Sofortfeedback prüft Aufbau und Textbezug – nicht, ob nur eine einzige Deutung möglich ist.</p>
        </div>
      </div>
      <section className="reading-comparison"><span className="kicker">Beide Lesewege zusammendenken</span><h2>Heidi liest anders. Peter auch.</h2><p>Der Vergleich trennt Beobachtung von vorschnellem Urteil: Nicht nur das Ergebnis, sondern Motivation, Beziehung, Methode und Wirkung des Lesens werden sichtbar.</p><div>{comparisonDimensions.map(dimension=><label key={dimension}><span>{dimension}</span><textarea value={state.comparison[dimension]||''} onChange={event=>updateComparison(dimension,event.target.value)} placeholder="Heidi … / Peter …"/></label>)}</div></section>
    </>}
  </section></div>
}
