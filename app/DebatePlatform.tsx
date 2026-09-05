'use client';

import { useEffect, useMemo, useState } from 'react';
import { glossary, modes, roles, topics } from './data';
import CorrespondenceMode from './CorrespondenceMode';
import CloudWorkspace from './CloudWorkspace';
import TeacherGate from './TeacherGate';
import TextLab from './TextLab';

type Work = { position:number; reason:string; questionIndex:number|null; questionResponse:string; scene:string; observation:string; interpretation:string; perspectiveResponse:string; counterResponse:string; pre:number; post:number; reflection:string; notes:string };
const emptyWork = ():Work => ({position:50,reason:'',questionIndex:null,questionResponse:'',scene:'',observation:'',interpretation:'',perspectiveResponse:'',counterResponse:'',pre:50,post:50,reflection:'',notes:''});
const stepReadiness=(work:Work)=>[
  work.reason.trim().length>=30,
  work.questionIndex!==null&&work.questionResponse.trim().length>=35,
  work.scene.trim().length>=3&&work.observation.trim().length>=30&&work.interpretation.trim().length>=30,
  work.perspectiveResponse.trim().length>=35,
  work.counterResponse.trim().length>=35,
  work.reflection.trim().length>=35,
];
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
  const [currentStep,setCurrentStep] = useState(0);
  const topic = active ? topics.find(t=>t.id===active)! : null;
  const work = active ? {...emptyWork(),...(works[active] || {})} : emptyWork();

  useEffect(()=>{ safeStorage.set('denkraum-heidi-v2',JSON.stringify(works)); },[works]);
  useEffect(()=>{ if(!running)return; const id=window.setInterval(()=>setSeconds(s=>{if(s<=1){window.clearInterval(id);return 0}return s-1}),1000); return()=>clearInterval(id); },[running]);

  const update=(patch:Partial<Work>)=> active && setWorks(prev=>({...prev,[active]:{...(prev[active]||emptyWork()),...patch}}));
  const readiness = useMemo(()=>stepReadiness(work),[work]);
  const complete = useMemo(()=>topic?readiness.filter(Boolean).length:0,[topic,readiness]);
  const time=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  const openTopic=(id:number)=>{const saved={...emptyWork(),...(works[id]||{})};const firstOpen=stepReadiness(saved).findIndex(done=>!done);setActive(id);setPerspective(0);setCounter(0);setCurrentStep(firstOpen<0?5:firstOpen)};
  const close=()=>{setActive(null);setPanel(null)};
  const selectMode=(index:number)=>{setMode(index);setSeconds(modes[index].minutes*60);setRunning(false)};
  const download=(kind:'json'|'md')=>{
    if(!topic)return;
    const payload={topic:topic.title,thesis:topic.thesis,mode:modes[mode].name,...work,savedAt:new Date().toISOString()};
    const selectedQuestion=work.questionIndex===null?'–':work.questionIndex<topic.questions.length?topic.questions[work.questionIndex].text:customQuestion;
    const markdown=`# Denkraum Heidi – ${topic.title}\n\n**Leitthese:** ${topic.thesis}\n\n**Position vorher:** ${work.pre}/100  \n**Position nachher:** ${work.post}/100\n\n## Erste Begründung\n${work.reason||'–'}\n\n## Vertiefungsfrage\n${selectedQuestion}\n\n${work.questionResponse||'–'}\n\n## Textbeleg\n${work.scene||topic.chapter}\n\n**Beobachtung:** ${work.observation||'–'}\n\n**Deutung:** ${work.interpretation||'–'}\n\n## Perspektivwechsel\n${work.perspectiveResponse||'–'}\n\n## Antwort auf das Gegenargument\n${work.counterResponse||'–'}\n\n## Reflexion\n${work.reflection||'–'}\n`;
    const blob=new Blob([kind==='json'?JSON.stringify(payload,null,2):markdown],{type:kind==='json'?'application/json':'text/markdown'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`heidi-thema-${topic.id}.${kind}`; a.click(); URL.revokeObjectURL(url);
  };
  const reset=()=>{if(active && window.confirm('Diesen Arbeitsstand wirklich vollständig zurücksetzen?')){setWorks(p=>{const n={...p};delete n[active];return n});setCurrentStep(0)}};
  const assign=()=>{const names=roleNames.split(/[,\n]/).map(n=>n.trim()).filter(Boolean); const shuffled=[...roles].sort(()=>Math.random()-.5); setAssignments(names.map((n,i)=>`${n}: ${shuffled[i%shuffled.length]}`))};
  const stepLabels=['Position','Vertiefen','Textbeleg','Perspektive','Diskutieren','Abschliessen'];
  const stepActions=['Regler setzen und die erste Position in zwei Sätzen begründen.','Eine Vertiefungsfrage wählen und mit einem konkreten Gedanken beantworten.','Eine Romanszene nennen, genau beobachten und erst danach deuten.','Die Gegenperspektive übernehmen und ein Argument aus ihrer Sicht formulieren.','Ein Gegenargument ernst nehmen und darauf differenziert antworten.','Die Position erneut setzen und die wichtigste Veränderung erklären.'];
  const currentReady=readiness[currentStep];
  const goNext=()=>{if(currentReady&&currentStep<5){setCurrentStep(currentStep+1);window.setTimeout(()=>document.querySelector('.guided-content')?.scrollIntoView({behavior:'smooth',block:'start'}),0)}};

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

    {topic && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={topic.title}><section className="workspace guided-workspace">
      <header className="workspace-head"><button className="back-button" onClick={close}>← Übersicht</button><div><span>Thema 0{topic.id} · {topic.area}</span><b>{complete}/6 Schritte abgeschlossen</b></div></header>
      <div className="workspace-hero guided-hero"><span className="kicker">Leitthese</span><h2>{topic.title}</h2><blockquote>«{topic.thesis}»</blockquote><details><summary>Textanker anzeigen</summary><p><b>Textanker:</b> {topic.anchor}</p><small>{topic.chapter}</small></details></div>
      <div className="guided-brief"><div><small>Dein Auftrag</small><h3>Baue in sechs Schritten ein begründetes Urteil.</h3><p>Am Ende hast du eine Position, einen Textbeleg, eine Gegenperspektive und eine überarbeitete Schlussfolgerung.</p></div><div className="guided-progress" aria-label={`${complete} von 6 Schritten abgeschlossen`}><strong>{complete}<span>/6</span></strong><div>{stepLabels.map((label,index)=><i className={readiness[index]?'done':index===currentStep?'active':''} key={label}/>)}</div></div></div>
      <div className="workspace-grid guided-grid">
        <aside className="workspace-nav guided-nav"><small>Dein Weg</small>{stepLabels.map((label,index)=>{const unlocked=index===0||readiness.slice(0,index).every(Boolean);return <button className={index===currentStep?'active':readiness[index]?'done':''} disabled={!unlocked} onClick={()=>setCurrentStep(index)} key={label}><span>{readiness[index]?'✓':String(index+1).padStart(2,'0')}</span>{label}<i>{!unlocked?'gesperrt':index===currentStep?'jetzt':''}</i></button>})}</aside>
        <div className="workspace-content guided-content">
          <div className="now-card"><small>Jetzt – Schritt {currentStep+1}</small><p>{stepActions[currentStep]}</p></div>

          {currentStep===0&&<section className="work-card guided-step" id="position"><div className="step-title"><span>01</span><div><small>Position beziehen</small><h3>Wo stehst du – und warum?</h3></div></div><p className="do-this"><b>Tu jetzt:</b> Setze den Regler. Schreibe danach zwei Sätze: deinen wichtigsten Grund und einen Punkt, bei dem du noch unsicher bist.</p><div className="range-labels"><b>{topic.poles[0]}</b><b>{topic.poles[1]}</b></div><input aria-label="Position von 0 bis 100" type="range" min="0" max="100" value={work.position} onChange={e=>update({position:+e.target.value,pre:+e.target.value})}/><output>{work.position}</output><label>Meine erste Begründung<textarea value={work.reason} onChange={e=>update({reason:e.target.value})} placeholder="Ich stehe eher auf dieser Seite, weil … Unsicher bin ich noch bei …"/></label><GuidedFooter ready={currentReady} step={currentStep} onBack={()=>setCurrentStep(currentStep-1)} onNext={goNext} success="Deine Ausgangsposition ist nachvollziehbar. Jetzt machst du sie mit einer Frage genauer." pending="Ergänze Grund und Unsicherheit in mindestens zwei kurzen Sätzen."/></section>}

          {currentStep===1&&<section className="work-card guided-step" id="fragen"><div className="step-title"><span>02</span><div><small>Vertiefen</small><h3>Welche Frage trifft deine Position?</h3></div></div><p className="do-this"><b>Tu jetzt:</b> Wähle genau eine Frage. Antworte mit einem konkreten Beispiel oder einer möglichen Folge.</p><div className="question-choices">{topic.questions.map((q,i)=><button className={work.questionIndex===i?'active':''} onClick={()=>update({questionIndex:i,questionResponse:work.questionIndex===i?work.questionResponse:''})} key={i}><small>{q.level}</small><span>{q.text}</span></button>)}</div>{customQuestion&&<button className={`custom-question choice ${work.questionIndex===topic.questions.length?'active':''}`} onClick={()=>update({questionIndex:topic.questions.length,questionResponse:''})}><b>Frage der Lehrperson:</b> {customQuestion}</button>}<label>Meine Antwort<textarea value={work.questionResponse} onChange={e=>update({questionResponse:e.target.value})} placeholder="Ein konkretes Beispiel oder eine Folge wäre …"/></label><GuidedFooter ready={currentReady} step={currentStep} onBack={()=>setCurrentStep(currentStep-1)} onNext={goNext} success="Du hast deine erste Position an einer konkreten Frage vertieft. Als Nächstes muss sie sich am Roman bewähren." pending={work.questionIndex===null?'Wähle zuerst eine der Fragen aus.':'Füge ein Beispiel oder eine konkrete Folge hinzu.'}/></section>}

          {currentStep===2&&<section className="work-card guided-step" id="beleg"><div className="step-title"><span>03</span><div><small>Am Text prüfen</small><h3>Was zeigt eine konkrete Stelle?</h3></div></div><p className="do-this"><b>Tu jetzt:</b> Nenne die Situation. Beschreibe zuerst nur, was dort geschieht oder gesagt wird. Erkläre erst im zweiten Feld, was das bedeuten könnte.</p><label>Kapitel oder Situation<input type="text" value={work.scene} onChange={e=>update({scene:e.target.value})} placeholder={topic.chapter}/></label><div className="two-fields"><label>1 · Beobachtung<textarea value={work.observation} onChange={e=>update({observation:e.target.value})} placeholder="In der Szene sagt oder tut …"/></label><label>2 · Deutung<textarea value={work.interpretation} onChange={e=>update({interpretation:e.target.value})} placeholder="Das könnte zeigen, dass …"/></label></div><p className="method-note">Prüfe den Unterschied: Die Beobachtung könnte man im Buch unterstreichen. Die Deutung erklärt, warum sie für deine Position wichtig ist.</p><GuidedFooter ready={currentReady} step={currentStep} onBack={()=>setCurrentStep(currentStep-1)} onNext={goNext} success="Deine Position hat jetzt einen Textanker. Im nächsten Schritt prüfst du sie aus einer fremden Sicht." pending={!work.scene.trim()?'Nenne zuerst eine konkrete Situation oder ein Kapitel.':'Beobachtung und Deutung brauchen jeweils einen vollständigen Gedanken.'}/></section>}

          {currentStep===3&&<section className="work-card guided-step" id="perspektive"><div className="step-title"><span>04</span><div><small>Perspektivkarte · Rolle wechseln</small><h3>Was würde diese Figur einwenden?</h3></div></div><p className="do-this"><b>Tu jetzt:</b> Lies die Karte und antworte in der Ich-Form der Figur. Formuliere ein Argument, das deiner bisherigen Position widerspricht oder sie ergänzt.</p><div className="perspective-card"><small>Du argumentierst als</small><h4>{topic.perspectives[perspective].name}</h4><p>{topic.perspectives[perspective].prompt}</p></div><button className="secondary-button" onClick={()=>{setPerspective((perspective+1)%topic.perspectives.length);update({perspectiveResponse:''})}}>Andere Perspektive ziehen ↻</button><label className="response-field">Antwort aus dieser Perspektive<textarea value={work.perspectiveResponse} onChange={e=>update({perspectiveResponse:e.target.value})} placeholder={`Ich, ${topic.perspectives[perspective].name}, würde einwenden, dass …`}/></label><GuidedFooter ready={currentReady} step={currentStep} onBack={()=>setCurrentStep(currentStep-1)} onNext={goNext} success="Du hast eine fremde Perspektive als echtes Argument formuliert. Jetzt reagierst du darauf." pending="Schreibe in der Ich-Form der Figur und nenne einen nachvollziehbaren Grund."/></section>}

          {currentStep===4&&<section className="work-card guided-step" id="diskussion"><div className="step-title"><span>05</span><div><small>Kuratiertes Gegenargument prüfen</small><h3>Was antwortest du darauf?</h3></div></div><p className="do-this"><b>Tu jetzt:</b> Lies das Gegenargument. Gib zuerst zu, was daran berechtigt ist, und formuliere dann deine begründete Antwort.</p><div className="counter guided-counter"><small>Gegenargument</small><p>{topic.counters[counter]}</p><button onClick={()=>{setCounter((counter+1)%topic.counters.length);update({counterResponse:''})}}>Anderes Gegenargument ↻</button></div><label className="response-field">Meine differenzierte Antwort<textarea value={work.counterResponse} onChange={e=>update({counterResponse:e.target.value})} placeholder="Daran ist berechtigt, dass … Trotzdem / Zugleich …"/></label><details className="discussion-toolbox"><summary>Gesprächsmodus und Timer öffnen</summary><div className="mode-tabs">{modes.map((m,i)=><button className={mode===i?'active':''} onClick={()=>selectMode(i)} key={m.name}>{m.name}<small>{m.minutes} Min.</small></button>)}</div><div className="debate-tools"><div className="timer"><small>Timer</small><strong>{time}</strong><div><button onClick={()=>setRunning(!running)}>{running?'Pause':'Start'}</button><button onClick={()=>setSeconds(modes[mode].minutes*60)}>Zurücksetzen</button></div></div><ol>{modes[mode].steps.map(s=><li key={s}>{s}</li>)}</ol></div></details><GuidedFooter ready={currentReady} step={currentStep} onBack={()=>setCurrentStep(currentStep-1)} onNext={goNext} success="Du hast das Gegenargument nicht abgewehrt, sondern verarbeitet. Jetzt kannst du dein Urteil überarbeiten." pending="Beginne mit «Daran ist berechtigt …» und ergänze danach «Trotzdem …» oder «Zugleich …»."/></section>}

          {currentStep===5&&<section className="work-card guided-step" id="reflexion"><div className="step-title"><span>06</span><div><small>Abschliessen</small><h3>Was hat sich bewegt?</h3></div></div><p className="do-this"><b>Tu jetzt:</b> Setze deine Position erneut. Nenne danach das Argument, das deine Sicht verändert, bestätigt oder genauer gemacht hat.</p><div className="vote-shift"><label>Vorher <input type="range" min="0" max="100" value={work.pre} disabled/><b>{work.pre}</b></label><span className={work.post-work.pre>0?'right':work.post-work.pre<0?'left':''}>{work.post-work.pre>0?'+':''}{work.post-work.pre}</span><label>Nachher <input type="range" min="0" max="100" value={work.post} onChange={e=>update({post:+e.target.value})}/><b>{work.post}</b></label></div><label>Welches Argument hat deine Position verändert oder differenziert?<textarea value={work.reflection} onChange={e=>update({reflection:e.target.value})} placeholder="Meine Position hat sich …, weil das Argument …"/></label>{currentReady&&<div className="argument-chain"><small>Deine Argumentkette</small><p><b>Ausgangspunkt:</b> {work.reason}</p><p><b>Textprüfung:</b> {work.interpretation}</p><p><b>Gegenargument:</b> {work.counterResponse}</p><p><b>Schluss:</b> {work.reflection}</p></div>}<GuidedFooter ready={currentReady} step={currentStep} onBack={()=>setCurrentStep(currentStep-1)} onNext={goNext} success="Geschafft: Dein Urteil ist begründet, am Text geprüft und durch eine Gegenposition differenziert." pending="Erkläre in einem vollständigen Gedanken, welches Argument deine Sicht verändert oder bestätigt hat."/><div className="actions"><button onClick={()=>window.print()}>Drucken</button><button onClick={()=>download('md')}>Markdown</button><button onClick={()=>download('json')}>JSON</button><button className="danger" onClick={reset}>Zurücksetzen</button></div></section>}
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

function GuidedFooter({ready,step,onBack,onNext,success,pending}:{ready:boolean;step:number;onBack:()=>void;onNext:()=>void;success:string;pending:string}){
  return <div className={`guided-feedback ${ready?'ready':'waiting'}`} aria-live="polite"><div><i>{ready?'✓':'→'}</i><p><b>{ready?'Schritt geschafft':'Noch ein konkreter Handgriff'}</b><span>{ready?success:pending}</span></p></div><nav>{step>0&&<button onClick={onBack}>← Zurück</button>}{step<5&&<button className="guided-next" disabled={!ready} onClick={onNext}>Weiter zu Schritt {step+2} →</button>}</nav></div>
}
