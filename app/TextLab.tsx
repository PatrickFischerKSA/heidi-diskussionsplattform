'use client';

import { useEffect, useMemo, useState } from 'react';
import { comparisonDimensions, labPassages } from './textLabData';

type Entry={marks:number[];observation:string;interpretation:string;check:string};
export type LabState={entries:Record<string,Entry>;comparison:Record<string,string>};
export const TEXTLAB_KEY='denkraum-textlabor-v1';
const emptyEntry=():Entry=>({marks:[],observation:'',interpretation:'',check:''});
const load=():LabState=>{try{return JSON.parse(localStorage.getItem(TEXTLAB_KEY)||'') as LabState}catch{return {entries:{},comparison:{}}}};

export default function TextLab({onClose}:{onClose:()=>void}){
  const [reader,setReader]=useState<'Heidi'|'Peter'>('Heidi');
  const passages=labPassages.filter(item=>item.reader===reader);
  const [activeId,setActiveId]=useState(passages[0].id);
  const [state,setState]=useState<LabState>(load);
  const active=labPassages.find(item=>item.id===activeId)!;
  const entry=state.entries[activeId]||emptyEntry();
  useEffect(()=>{try{localStorage.setItem(TEXTLAB_KEY,JSON.stringify(state))}catch{}},[state]);
  const done=useMemo(()=>labPassages.filter(item=>{const value=state.entries[item.id];return value?.marks.length&&value.observation.trim()&&value.interpretation.trim()&&value.check.trim()}).length,[state]);
  const changeReader=(next:'Heidi'|'Peter')=>{setReader(next);setActiveId(labPassages.find(item=>item.reader===next)!.id)};
  const update=(patch:Partial<Entry>)=>setState(current=>({...current,entries:{...current.entries,[activeId]:{...(current.entries[activeId]||emptyEntry()),...patch}}}));
  const toggleMark=(index:number)=>update({marks:entry.marks.includes(index)?entry.marks.filter(item=>item!==index):[...entry.marks,index]});
  const updateComparison=(dimension:string,value:string)=>setState(current=>({...current,comparison:{...current.comparison,[dimension]:value}}));

  return <div className="modal-backdrop textlab-backdrop" role="dialog" aria-modal="true" aria-label="Textlabor: Das Lesen lesen"><section className="textlab-shell">
    <header className="textlab-head"><button onClick={onClose}>← Zurück</button><div><small>Modus 03 · Textlabor</small><b>Das Lesen lesen</b></div><span>{done}/6 Lesespuren geprüft</span></header>
    <div className="textlab-intro"><span className="kicker">Genau lesen · schrittweise deuten</span><h2>Wie wird aus<br/><em>Buchstaben Bedeutung?</em></h2><p>Zwei Lernwege im Roman werden selbst zum Gegenstand des Lesens: Heidis Weg von der fremden Pflicht zur inneren Bilderwelt und Peters Weg vom Widerstand zum Lesen für andere.</p></div>
    <div className="reader-switch" role="tablist" aria-label="Leseweg wählen"><button role="tab" aria-selected={reader==='Heidi'} className={reader==='Heidi'?'active':''} onClick={()=>changeReader('Heidi')}><small>Leseweg A</small>Heidi</button><button role="tab" aria-selected={reader==='Peter'} className={reader==='Peter'?'active':''} onClick={()=>changeReader('Peter')}><small>Leseweg B</small>Peter</button></div>
    <div className="textlab-layout"><aside className="passage-rail"><small>{reader}s Leseweg</small>{passages.map((item,index)=><button aria-current={activeId===item.id?'step':undefined} className={activeId===item.id?'active':''} onClick={()=>setActiveId(item.id)} key={item.id}><span>0{index+1}</span><div><small>{item.phase}</small><b>{item.title}</b></div><i>{state.entries[item.id]?.interpretation?'●':'○'}</i></button>)}<div className="lab-method"><b>Die Lesebewegung</b><span>1 · markieren</span><span>2 · beobachten</span><span>3 · deuten</span><span>4 · gegenprüfen</span></div></aside>
      <div className="lab-bench"><header><div><small>{active.phase} · {active.chapter}</small><h3>{active.title}</h3></div><span>{active.pdfPages}</span></header><p className="edition-note">Wortlaut der bereitgestellten Ausgabe; die Markierung verändert den Text nicht.</p><div className="passage-text">{active.sentences.map((sentence,index)=><button aria-pressed={entry.marks.includes(index)} className={entry.marks.includes(index)?'marked':''} onClick={()=>toggleMark(index)} key={index}><span>{String(index+1).padStart(2,'0')}</span>{sentence}</button>)}</div><div className="text-lenses"><small>Textlupe</small>{active.lenses.map(lens=><span key={lens}>{lens}</span>)}</div><div className="reading-steps"><label><span>01 · Beobachtung</span><small>Nur beschreiben: Welche Wörter, Gegensätze, Wiederholungen oder Erzählzeichen fallen auf?</small><textarea value={entry.observation} onChange={event=>update({observation:event.target.value})} placeholder="Im Wortlaut fällt auf …"/></label><label><span>02 · Deutungshypothese</span><small>Aus der Beobachtung folgern: Was zeigt die Passage über diesen Leseprozess?</small><textarea value={entry.interpretation} onChange={event=>update({interpretation:event.target.value})} placeholder="Daraus lässt sich deuten …"/></label><label><span>03 · Gegenprobe</span><small>Die eigene Deutung begrenzen: Welcher Satz passt nur teilweise oder eröffnet eine andere Lesart?</small><textarea value={entry.check} onChange={event=>update({check:event.target.value})} placeholder="Meine Deutung reicht nicht ganz aus, weil …"/></label></div></div>
    </div>
    <section className="reading-comparison"><span className="kicker">Beide Lesewege zusammendenken</span><h2>Heidi liest anders. Peter auch.</h2><p>Der Vergleich trennt Beobachtung von vorschnellem Urteil: Nicht nur das Ergebnis, sondern Motivation, Beziehung, Methode und Wirkung des Lesens werden sichtbar.</p><div>{comparisonDimensions.map(dimension=><label key={dimension}><span>{dimension}</span><textarea value={state.comparison[dimension]||''} onChange={event=>updateComparison(dimension,event.target.value)} placeholder="Heidi … / Peter …"/></label>)}</div></section>
  </section></div>
}
