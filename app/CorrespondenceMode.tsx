'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Message, openingEchoes, openingMessages, threadThemes } from './correspondenceData';

const themeOrder = ['freundschaft','eifersucht','tiere','bildung','behinderung','natur','ungleichheit','zugehoerigkeit','verantwortung'];

export default function CorrespondenceMode({onClose}:{onClose:()=>void}) {
  const [trail,setTrail] = useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('denkraum-faden-v2')||'[]')}catch{return []}});
  const [playing,setPlaying] = useState<string|null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const messages = useMemo(()=>[...openingMessages,...trail.flatMap(key=>threadThemes[key]?.messages||[])],[trail]);
  const choices = useMemo(()=>{
    const source = trail.length ? threadThemes[trail.at(-1)!].echoes : openingEchoes;
    const fresh = source.filter(e=>!trail.includes(e.next));
    if(fresh.length)return fresh;
    return themeOrder.filter(key=>!trail.includes(key)).slice(0,3).map(key=>({label:threadThemes[key].name,next:key}));
  },[trail]);

  useEffect(()=>{try{localStorage.setItem('denkraum-faden-v2',JSON.stringify(trail))}catch{}},[trail]);
  useEffect(()=>()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel()},[]);

  const choose=(key:string)=>{
    if(trail.includes(key))return;
    setTrail(items=>[...items,key]);
    window.setTimeout(()=>endRef.current?.scrollIntoView({behavior:'smooth',block:'end'}),80);
  };
  const speak=(message:Message)=>{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    if(playing===message.id){setPlaying(null);return}
    const utterance=new SpeechSynthesisUtterance(message.text);
    utterance.lang='de-CH';
    utterance.rate=message.from==='Peter'?.92:message.adult?.86:.9;
    utterance.pitch=message.from==='Peter'?.86:message.from==='Heidi'?1.1:1;
    utterance.onend=()=>setPlaying(null);
    utterance.onerror=()=>setPlaying(null);
    setPlaying(message.id);
    window.speechSynthesis.speak(utterance);
  };
  const restart=()=>{if(window.confirm('Den bisherigen Gesprächsfaden lösen und neu beginnen?')){window.speechSynthesis?.cancel();setPlaying(null);setTrail([])}};

  return <div className="modal-backdrop correspondence-backdrop" role="dialog" aria-modal="true" aria-label="Heidi, Clara und Peter – ein Austausch">
    <section className="correspondence-shell">
      <header className="correspondence-head">
        <button onClick={onClose}>← Zurück</button>
        <div><small>Modus 02 · Fadenspiel</small><b>Heidi · Clara · Peter</b></div>
        <span>{trail.length} Fäden aufgenommen</span>
      </header>
      <div className="correspondence-intro">
        <span className="kicker">Ein Austausch in Briefen und Sprachnachrichten</span>
        <h2>Welcher Faden<br/><em>klingt weiter?</em></h2>
        <p>Worte hinterlassen Spuren. Ein nachklingender Satz entscheidet, welche Post als Nächstes zwischen Alp und Frankfurt unterwegs ist.</p>
        <div className="format-key"><span><i className="dot clara"/> Clara schreibt</span><span><i className="dot heidi"/> Heidi schreibt & spricht</span><span><i className="dot peter"/> Peter spricht</span></div>
      </div>

      <div className="correspondence-layout">
        <aside className="thread-map">
          <small>Die Fadenspule</small>
          <div className="spool" aria-hidden="true"><i/><i/><i/></div>
          <ol>{themeOrder.map(key=><li className={trail.includes(key)?'visited':''} key={key}><span>{trail.includes(key)?'●':'○'}</span>{threadThemes[key].name}</li>)}</ol>
          <p>Kein Weg ist vollständig. Das sichtbare Geflecht entsteht aus den Worten, die weitergetragen werden.</p>
        </aside>

        <div className="message-stream">
          <div className="fiction-note">Fiktive Fortschreibung auf Grundlage der Figuren und Konflikte des Romans – keine Originalzitate.</div>
          {messages.map((message,index)=><MessageCard key={message.id} message={message} index={index} playing={playing===message.id} onPlay={()=>speak(message)}/>)}

          {choices.length>0 ? <div className="echo-choice">
            <div className="echo-orbit" aria-hidden="true"><span/><i/><span/></div>
            <small>Was klingt nach?</small>
            <p>Ein Echo nimmt den Gesprächsfaden auf. Dahinter wartet bereits neue Post.</p>
            <div>{choices.map(choice=><button onClick={()=>choose(choice.next)} key={choice.next}>{choice.label}<span>↗</span></button>)}</div>
          </div> : <div className="woven-ending">
            <small>Grossmamas letzter Fadenbrief</small>
            <p>Ihr habt nicht alles geklärt. Das ist kein Mangel. Ein Gespräch wird lebendig, wenn nach dem letzten Wort noch Beziehungen zwischen den Fragen sichtbar bleiben.</p>
            <div className="constellation">{trail.map((key,i)=><span style={{'--i':i} as React.CSSProperties} key={key}>{threadThemes[key].name}</span>)}</div>
          </div>}
          <div ref={endRef}/>
          {trail.length>0&&<button className="restart-thread" onClick={restart}>Faden lösen und neu beginnen</button>}
        </div>
      </div>
    </section>
  </div>
}

function MessageCard({message,index,playing,onPlay}:{message:Message;index:number;playing:boolean;onPlay:()=>void}){
  const isLetter=message.channel==='letter';
  return <article className={`${isLetter?'letter-message':'voice-message'} ${message.adult?'adult-reaction':''} from-${message.from.toLowerCase().replaceAll('ä','a').replaceAll('ö','o').replaceAll('ü','u').replaceAll(' ','-')}`}>
    <div className="message-route"><span>{message.place}</span><i/><span>{String(index+1).padStart(2,'0')}</span></div>
    {isLetter ? <>
      <div className="letter-fold" aria-hidden="true"/>
      <header><small>{message.meta}</small>{message.adult&&<b>Stimme von aussen</b>}</header>
      <p>{message.text}</p>
      <span className="signature">{message.from}</span>
    </> : <>
      <div className="voice-player"><button className={playing?'playing':''} onClick={onPlay} aria-label={`${message.from}s Sprachnachricht ${playing?'stoppen':'abspielen'}`}>{playing?'■':'▶'}</button><div><header><b>{message.from}</b>{message.adult&&<em>Stimme von aussen</em>}<small>{message.meta}</small></header><div className="waveform" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{height:`${8+((i*7)%19)}px`}}/>)}</div></div></div>
      <details><summary>Mitlesen</summary><p>{message.text}</p></details>
    </>}
  </article>
}
