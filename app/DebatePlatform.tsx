'use client';

import { useEffect, useMemo, useState } from 'react';
import { glossary, modes, roles, topics } from './data';
import CorrespondenceMode from './CorrespondenceMode';
import CloudWorkspace from './CloudWorkspace';
import TeacherGate from './TeacherGate';
import TextLab from './TextLab';

type Work = { position:number; reason:string; scene:string; observation:string; interpretation:string; pre:number; post:number; reflection:string; notes:string };
const emptyWork = ():Work => ({position:50,reason:'',scene:'',observation:'',interpretation:'',pre:50,post:50,reflection:'',notes:''});
const safeStorage = { get:(key:string)=>{try{return localStorage.getItem(key)}catch{return null}}, set:(key:string,value:string)=>{try{localStorage.setItem(key,value)}catch{}} };

export default function DebatePlatform() {
  const [active,setActive] = useState<number|null>(null);
  const [panel,setPanel] = useState<'teacher'|'focus'|'glossary'|'letters'|'cloud'|'lab'|null>(null);
  const [works,setWorks] = useState<Record<number,Work>>(()=>{const saved=safeStorage.get('denkraum-heidi-v2');if(!saved)return {};try{return JSON.parse(saved)}catch{return {}}});
  const [mode,setMode] = useState(0);
  const [seconds,setSeconds] = useState(modes[0].minutes*60);
  const [running,setRunning] = useState(false);
  const [perspective,setPerspective] = useState(0);
  const [counter,setCounter] = useState(0);
  const [customQuestion,setCustomQuestion] = useState('');
  const [helpers,setHelpers] = useState(true);
  const [roleNames,setRoleNames] = useState('');
  const [assignments,setAssignments] = useState<string[]>([]);
  const topic = active ? topics.find(t=>t.id===active)! : null;
  const work = active ? (works[active] || emptyWork()) : emptyWork();

  useEffect(()=>{ safeStorage.set('denkraum-heidi-v2',JSON.stringify(works)); },[works]);
  useEffect(()=>{ if(!running)return; const id=window.setInterval(()=>setSeconds(s=>{if(s<=1){window.clearInterval(id);return 0}return s-1}),1000); return()=>clearInterval(id); },[running]);

  const update=(patch:Partial<Work>)=> active && setWorks(prev=>({...prev,[active]:{...(prev[active]||emptyWork()),...patch}}));
  const complete = useMemo(()=> topic ? [work.reason,work.scene,work.observation,work.interpretation,work.reflection].filter(Boolean).length : 0,[topic,work]);
  const time=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  const openTopic=(id:number)=>{setActive(id);setPerspective(0);setCounter(0)};
  const close=()=>{setActive(null);setPanel(null)};
  const selectMode=(index:number)=>{setMode(index);setSeconds(modes[index].minutes*60);setRunning(false)};
  const download=(kind:'json'|'md')=>{
    if(!topic)return;
    const payload={topic:topic.title,thesis:topic.thesis,mode:modes[mode].name,...work,savedAt:new Date().toISOString()};
    const markdown=`# Denkraum Heidi – ${topic.title}\n\n**Leitthese:** ${topic.thesis}\n\n**Position vorher:** ${work.pre}/100  \n**Position nachher:** ${work.post}/100\n\n## Begründung\n${work.reason||'–'}\n\n## Textbeleg\n${work.scene||topic.chapter}\n\n**Beobachtung:** ${work.observation||'–'}\n\n**Deutung:** ${work.interpretation||'–'}\n\n## Reflexion\n${work.reflection||'–'}\n\n## Notizen\n${work.notes||'–'}\n`;
    const blob=new Blob([kind==='json'?JSON.stringify(payload,null,2):markdown],{type:kind==='json'?'application/json':'text/markdown'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`heidi-thema-${topic.id}.${kind}`; a.click(); URL.revokeObjectURL(url);
  };
  const reset=()=>{if(active && window.confirm('Diesen Arbeitsstand wirklich vollständig zurücksetzen?')){setWorks(p=>{const n={...p};delete n[active];return n})}};
  const assign=()=>{const names=roleNames.split(/[,\n]/).map(n=>n.trim()).filter(Boolean); const shuffled=[...roles].sort(()=>Math.random()-.5); setAssignments(names.map((n,i)=>`${n}: ${shuffled[i%shuffled.length]}`))};

  return <main>
    <header className="topbar">
      <a className="brand" href="#start" aria-label="Denkraum Heidi – Startseite"><span className="brand-mark">H</span><span><b>Denkraum Heidi</b><small>Textnah diskutieren</small></span></a>
      <nav aria-label="Hauptnavigation"><a href="#raeume">Diskussionsräume</a><button className="nav-plain" onClick={()=>setPanel('lab')}>Textlabor</button><button className="nav-plain" onClick={()=>setPanel('focus')}>Figurenfokus</button><button className="nav-plain" onClick={()=>setPanel('glossary')}>Glossar</button><button className="cloud-link" onClick={()=>setPanel('cloud')}><i/>Cloud-Speicher</button><button className="teacher-link" onClick={()=>setPanel('teacher')}>Für Lehrpersonen</button></nav>
    </header>
    <section className="hero" id="start">
      <div className="eyebrow"><span/> Diskussionsplattform · Sekundarstufe II</div>
      <h1>Ein Roman.<br/><em>Sechs offene Fragen.</em></h1>
      <p className="hero-copy">Nicht nacherzählen, sondern abwägen: Position beziehen, am Text prüfen, Gegenargumente ernst nehmen.</p>
      <a className="primary-button" href="#raeume">Diskussion wählen <span>↓</span></a>
      <div className="hero-note" aria-label="Arbeitsprinzip"><span>01</span><p><b>Beobachten</b>Was steht im Text?</p><i/><span>02</span><p><b>Deuten</b>Was könnte es bedeuten?</p><i/><span>03</span><p><b>Urteilen</b>Wie bewerten wir es heute?</p></div>
    </section>
    <section className="topics-section" id="raeume">
      <div className="section-heading"><div><span className="kicker">Sechs Konflikte</span><h2>Womit wollt ihr beginnen?</h2></div><p>Jeder Raum führt von einer ersten Position zu einem begründeten, differenzierten Urteil.</p></div>
      <div className="topic-grid">{topics.map(t=><article className={`topic-card tone-${t.id}`} key={t.id}><div className="card-top"><span className="topic-number">0{t.id}</span><span className="topic-area">{t.area}</span></div><h3>{t.title}</h3><blockquote>«{t.thesis}»</blockquote><div className="card-meta"><span>{t.figures.slice(0,3).join(' · ')}</span><span>{t.duration}</span></div><button onClick={()=>openTopic(t.id)} aria-label={`${t.title} öffnen`}>Raum öffnen <span>↗</span></button></article>)}</div>
    </section>
    <section className="mode-two-teaser">
      <div><span className="mode-index">Modus 02</span><span className="kicker">Gemeinsame Post zwischen Alp und Frankfurt</span><h2>Heidi · Clara · Peter</h2><p>Schüler*innen lassen die Figuren in eigenen Briefen und Sprachnachrichten aufeinander reagieren.</p></div>
      <div className="post-preview" aria-hidden="true"><span className="envelope">C</span><i/><span className="voice-wave">•••••••</span><i/><span className="envelope small">H</span></div>
      <button onClick={()=>setPanel('letters')}>Posttisch öffnen <span>→</span></button>
    </section>
    <section className="textlab-teaser"><div><span className="mode-index">Modus 03</span><span className="kicker">Genau lesen · Deutungen prüfen</span><h2>Das Lesen lesen</h2><p>Kurze Passagen zeigen, wie Heidi und Peter lesen lernen – und wie Interpretation aus genauer Beobachtung entsteht.</p></div><div className="text-magnifier" aria-hidden="true"><span>schwarze Buchstaben</span><i/><b>Bedeutung</b></div><button onClick={()=>setPanel('lab')}>Textlabor öffnen <span>→</span></button></section>
    <section className="focus-teaser" id="figuren"><span className="focus-label">Querschnitt</span><div><p>Figurenfokus</p><h2>Dete und Almöhi:<br/>Wer sorgt wie für Heidi?</h2></div><p>Ein Vergleich ohne einfache Einteilung in «gut» und «böse».</p><button onClick={()=>setPanel('focus')}>Vergleich öffnen <span>→</span></button></section>
    <footer><span>Denkraum Heidi</span><p>Johanna Spyri · Erster und Zweiter Teil</p><button onClick={()=>setPanel('glossary')}>Begriffe nachschlagen</button></footer>

    {topic && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={topic.title}><section className="workspace">
      <header className="workspace-head"><button className="back-button" onClick={close}>← Übersicht</button><div><span>Thema 0{topic.id} · {topic.area}</span><b>{complete}/5 Arbeitsschritte ausgefüllt</b></div></header>
      <div className="workspace-hero"><span className="kicker">Leitthese</span><h2>{topic.title}</h2><blockquote>«{topic.thesis}»</blockquote><p><b>Textanker:</b> {topic.anchor}</p><small>{topic.chapter}</small></div>
      <div className="workspace-grid">
        <aside className="workspace-nav"><a href="#position">01 Position</a><a href="#fragen">02 Vertiefen</a><a href="#beleg">03 Textbeleg</a><a href="#perspektive">04 Perspektive</a><a href="#diskussion">05 Diskutieren</a><a href="#reflexion">06 Abschliessen</a></aside>
        <div className="workspace-content">
          <section className="work-card" id="position"><div className="step-title"><span>01</span><div><small>Position beziehen</small><h3>Wo stehst du?</h3></div></div><div className="range-labels"><b>{topic.poles[0]}</b><b>{topic.poles[1]}</b></div><input aria-label="Position von 0 bis 100" type="range" min="0" max="100" value={work.position} onChange={e=>update({position:+e.target.value,pre:+e.target.value})}/><output>{work.position}</output><label>Begründe deine Position<textarea value={work.reason} onChange={e=>update({reason:e.target.value})} placeholder="Ich stehe hier, weil …"/></label></section>
          <section className="work-card" id="fragen"><div className="step-title"><span>02</span><div><small>Vertiefen</small><h3>Fragen, die weiterführen</h3></div></div><div className="question-list">{topic.questions.map((q,i)=><details key={i} open={i===0}><summary><span>{q.level}</span>{q.text}</summary><textarea aria-label={`Notiz zu: ${q.text}`} placeholder="Gedanken oder Argumente notieren …" onChange={e=>update({notes:[work.notes,e.target.value].filter(Boolean).join('\n')})}/></details>)}</div>{customQuestion&&<p className="custom-question"><b>Zusatzfrage:</b> {customQuestion}</p>}</section>
          <section className="work-card" id="beleg"><div className="step-title"><span>03</span><div><small>Am Text prüfen</small><h3>Belegkarte</h3></div></div><label>Kapitel oder Situation<input value={work.scene} onChange={e=>update({scene:e.target.value})} placeholder={topic.chapter}/></label><div className="two-fields"><label>Beobachtung<textarea value={work.observation} onChange={e=>update({observation:e.target.value})} placeholder="Was ist konkret zu sehen oder zu lesen?"/></label><label>Deutung<textarea value={work.interpretation} onChange={e=>update({interpretation:e.target.value})} placeholder="Wie stützt oder verändert das deine Position?"/></label></div><p className="method-note">Beobachtung beschreibt den Text. Deutung erklärt seine mögliche Bedeutung. Die heutige Bewertung folgt erst danach.</p></section>
          <section className="work-card" id="perspektive"><div className="step-title"><span>04</span><div><small>Rolle wechseln</small><h3>Perspektivkarte</h3></div></div><div className="perspective-card"><small>Argumentiere als</small><h4>{topic.perspectives[perspective].name}</h4><p>{topic.perspectives[perspective].prompt}</p></div><button className="secondary-button" onClick={()=>setPerspective((perspective+1)%topic.perspectives.length)}>Neue Karte ziehen ↻</button></section>
          <section className="work-card" id="diskussion"><div className="step-title"><span>05</span><div><small>Strukturiert diskutieren</small><h3>Modus & Gegenposition</h3></div></div><div className="mode-tabs">{modes.map((m,i)=><button className={mode===i?'active':''} onClick={()=>selectMode(i)} key={m.name}>{m.name}<small>{m.minutes} Min.</small></button>)}</div><div className="debate-tools"><div className="timer"><small>Optionaler Timer</small><strong>{time}</strong><div><button onClick={()=>setRunning(!running)}>{running?'Pause':'Start'}</button><button onClick={()=>setSeconds(modes[mode].minutes*60)}>Zurücksetzen</button></div></div><ol>{modes[mode].steps.map(s=><li key={s}>{s}</li>)}</ol></div><div className="counter"><small>Kuratiertes Gegenargument</small><p>{topic.counters[counter]}</p><button onClick={()=>setCounter((counter+1)%topic.counters.length)}>Anderes Gegenargument ↻</button></div><div className="impulses"><small>Sechs Impulse</small>{topic.impulses.map((x,i)=><span key={x}>{i+1}. {x}</span>)}</div></section>
          <section className="work-card" id="reflexion"><div className="step-title"><span>06</span><div><small>Abschliessen</small><h3>Was hat sich bewegt?</h3></div></div><div className="vote-shift"><label>Vorher <input type="range" min="0" max="100" value={work.pre} onChange={e=>update({pre:+e.target.value})}/><b>{work.pre}</b></label><span className={work.post-work.pre>0?'right':work.post-work.pre<0?'left':''}>{work.post-work.pre>0?'+':''}{work.post-work.pre}</span><label>Nachher <input type="range" min="0" max="100" value={work.post} onChange={e=>update({post:+e.target.value})}/><b>{work.post}</b></label></div><label>Welches Argument hat deine Position verändert oder differenziert?<textarea value={work.reflection} onChange={e=>update({reflection:e.target.value})} placeholder="Ein Argument, das ich jetzt ernster nehme …"/></label><div className="actions"><button onClick={()=>window.print()}>Drucken</button><button onClick={()=>download('md')}>Markdown</button><button onClick={()=>download('json')}>JSON</button><button className="danger" onClick={reset}>Zurücksetzen</button></div></section>
        </div>
      </div>
    </section></div>}

    {panel==='focus'&&<SidePanel title="Dete und Almöhi" subtitle="Wer sorgt wie für Heidi?" onClose={close}><div className="comparison"><div className="comparison-head"><b>Aspekt</b><b>Dete</b><b>Almöhi</b></div>{[
      ['Motive','Existenz sichern; eine Stelle und Chancen vermitteln','Heidi schützen; ein selbstständiges Leben ermöglichen'],
      ['Materielle Zwänge','Abhängig von Erwerbsarbeit und Dienststellen','Wenig Besitz, aber eigene Hütte und Tiere'],
      ['Form der Fürsorge','Organisiert Unterbringung, entscheidet pragmatisch','Alltagsnähe, Bindung, Schutz und praktische Bildung'],
      ['Mitsprache','Heidi wird kaum einbezogen','Viel Freiheit im Alltag, aber Grundentscheidungen allein'],
      ['Übersehene Bedürfnisse','Bindung, Vorbereitung, emotionale Sicherheit','Schule, Gleichaltrige, Gemeinschaft'],
      ['Bildungsverständnis','Frankfurt als gesellschaftliche Chance','Erfahrung, Beobachtung und Selbstständigkeit'],
      ['Gemeinschaft','Mobil zwischen Arbeitsorten und Haushalten','Zunächst Rückzug; später teilweise Rückkehr'],
      ['Entwicklung','Bleibt ambivalent zwischen Sorge und Abgabe','Verändert sich durch Heidi und übernimmt neue Pflichten'],
    ].map(r=><div className="comparison-row" key={r[0]}>{r.map((c,i)=><span key={i}>{c}</span>)}</div>)}</div><h3>Offene Urteilsfragen</h3><ul className="judge-list">{['Ist Dete verantwortungslos, pragmatisch oder unter den Bedingungen ihrer Zeit beides?','Nutzt die Stelle in Frankfurt vor allem Heidi, Klara oder Dete?','Ist der Almöhi ein guter Lernbegleiter oder vernachlässigt er Pflichten?','Schützt sein Rückzug Heidi oder schliesst er sie von Bildung und Gesellschaft aus?','Warum kehrt der Almöhi später teilweise in die Gemeinschaft zurück?','Welche Entscheidung hätten beide gemeinsam mit Heidi treffen können?'].map(x=><li key={x}>{x}</li>)}</ul></SidePanel>}
    {panel==='glossary'&&<SidePanel title="Glossar" subtitle="Heutige Analysebegriffe – einfach erklärt" onClose={close}><p className="panel-note">Diese Begriffe helfen bei einer heutigen Deutung. Sie werden Johanna Spyri nicht ohne Beleg als Absicht zugeschrieben.</p><dl className="glossary">{glossary.map(([a,b])=><div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl></SidePanel>}
    {panel==='teacher'&&<SidePanel title="Lehrpersonenbereich" subtitle="Passwortgeschützte Vorbereitung" onClose={close}><TeacherGate><label>Eigene Leitfrage<textarea value={customQuestion} onChange={e=>setCustomQuestion(e.target.value)} placeholder="Zusätzliche Frage für die Lerngruppe …"/></label><label className="check"><input type="checkbox" checked={helpers} onChange={e=>setHelpers(e.target.checked)}/> Begriffshilfen für Lernende sichtbar</label><h3>Rollen zufällig zuteilen</h3><label>Namen, durch Komma oder Zeilenumbruch getrennt<textarea value={roleNames} onChange={e=>setRoleNames(e.target.value)} placeholder="Mira, Noah, Elif, Luca …"/></label><button className="primary-inline" onClick={assign}>Rollen verteilen</button>{assignments.length>0&&<ul className="assignments">{assignments.map(x=><li key={x}>{x}</li>)}</ul>}<h3>Beobachtungsbogen</h3><div className="rubric">{['Textnähe','Begründung','Reaktion auf Gegenargumente','Perspektivenübernahme','Gesprächsverhalten'].map(x=><label key={x}><span>{x}</span><select defaultValue=""><option value="">Beobachtung …</option><option>noch wenig sichtbar</option><option>teilweise sichtbar</option><option>klar sichtbar</option></select><input placeholder="Kurze Rückmeldung"/></label>)}</div><p className="panel-note">Keine automatische Notengebung. Rückmeldungen bleiben lokal auf diesem Gerät.</p></TeacherGate></SidePanel>}
    {panel==='letters'&&<CorrespondenceMode onClose={close}/>}
    {panel==='lab'&&<TextLab onClose={close}/>}
    {panel==='cloud'&&<CloudWorkspace works={works} onClose={close} onRestore={(debates,textlab)=>{setWorks(debates as Record<number,Work>);try{localStorage.setItem('denkraum-heidi-v2',JSON.stringify(debates));localStorage.setItem('denkraum-textlabor-v1',JSON.stringify(textlab))}catch{}}}/>}
  </main>;
}

function SidePanel({title,subtitle,onClose,children}:{title:string;subtitle:string;onClose:()=>void;children:React.ReactNode}){
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}><aside className="side-panel"><header><div><small>{subtitle}</small><h2>{title}</h2></div><button onClick={onClose} aria-label="Schliessen">×</button></header><div className="side-scroll">{children}</div></aside></div>
}
