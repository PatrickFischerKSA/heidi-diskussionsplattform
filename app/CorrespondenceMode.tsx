'use client';

import { useEffect, useMemo, useState } from 'react';
import { addCorrespondenceMessage, CloudCredentials, CorrespondenceMessage, createCloudRoom, getCloudCredentials, loadCloudRoom, setCloudCredentials } from './cloud';

type StudentCharacter='Clara'|'Heidi'|'Peter';
type Channel='letter'|'voice';
const formats:Record<StudentCharacter,Channel[]>={Clara:['letter'],Heidi:['letter','voice'],Peter:['voice']};
const labels:Record<Channel,string>={letter:'Brief',voice:'Sprachnachricht'};

export default function CorrespondenceMode({onClose}:{onClose:()=>void}){
  const [credentials,setCredentials]=useState<CloudCredentials|null>(()=>getCloudCredentials());
  const [messages,setMessages]=useState<CorrespondenceMessage[]>([]);
  const [alias,setAlias]=useState('');
  const [character,setCharacter]=useState<StudentCharacter>('Heidi');
  const [channel,setChannel]=useState<Channel>('voice');
  const [body,setBody]=useState('');
  const [status,setStatus]=useState(credentials?'Der Posttisch verbindet sich …':'Dieser Posttisch hat noch keine gemeinsame Adresse.');
  const [busy,setBusy]=useState(false);
  const [playing,setPlaying]=useState<string|null>(null);

  useEffect(()=>{
    if(!credentials)return;
    let active=true;
    const pull=()=>loadCloudRoom(credentials).then(data=>{if(active){setMessages(data.correspondence||[]);setStatus('Neue Post erscheint hier von selbst.')}}).catch(()=>{if(active)setStatus('Die gemeinsame Post ist gerade nicht erreichbar.')});
    pull(); const interval=window.setInterval(pull,7000);
    return()=>{active=false;window.clearInterval(interval)};
  },[credentials]);
  useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);

  const themes=useMemo(()=>[...new Set(messages.filter(item=>item.kind==='student').map(item=>item.topic))],[messages]);
  const studentCount=messages.filter(item=>item.kind==='student').length;
  const chooseCharacter=(next:StudentCharacter)=>{setCharacter(next);if(!formats[next].includes(channel))setChannel(formats[next][0])};
  const append=(items:CorrespondenceMessage[])=>setMessages(current=>[...new Map([...current,...items].map(item=>[item.id,item])).values()].sort((a,b)=>a.createdAt.localeCompare(b.createdAt)));

  const submit=async()=>{
    if(!credentials||!alias.trim()||body.trim().length<3)return;
    setBusy(true);
    try{
      const result=await addCorrespondenceMessage(credentials,{alias,character,channel,body});
      append([result.message,...(result.reaction?[result.reaction]:[])]);
      setBody(''); setStatus(result.reaction?'Eine Randstimme hat einen neuen Faden sichtbar gemacht.':'Nachricht ist am gemeinsamen Posttisch angekommen.');
    }catch(error){setStatus(error instanceof Error?error.message:'Die Nachricht konnte nicht ankommen.')}finally{setBusy(false)}
  };
  const speak=(message:CorrespondenceMessage)=>{
    if(message.channel!=='voice'||!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    if(playing===message.id){setPlaying(null);return}
    const utterance=new SpeechSynthesisUtterance(message.body); utterance.lang='de-CH'; utterance.rate=message.character==='Peter'?.92:message.character==='Heidi'?1.02:.88; utterance.pitch=message.character==='Peter'?.86:message.character==='Heidi'?1.08:.95;
    utterance.onend=()=>setPlaying(null);utterance.onerror=()=>setPlaying(null);setPlaying(message.id);window.speechSynthesis.speak(utterance);
  };

  return <div className="modal-backdrop correspondence-backdrop" role="dialog" aria-modal="true" aria-label="Heidi, Clara und Peter – gemeinsamer Austausch"><section className="correspondence-shell">
    <header className="correspondence-head"><button onClick={onClose}>← Zurück</button><div><small>Modus 02 · gemeinsamer Posttisch</small><b>Heidi · Clara · Peter</b></div><span>{studentCount} eigene Stimmen</span></header>
    <div className="correspondence-intro student-led"><span className="kicker">Briefe und Sprachnachrichten der Schüler*innen</span><h2>Die Figuren warten<br/><em>auf eure Stimmen.</em></h2><p>Hier sprechen nicht fertige Texte für Heidi, Clara und Peter. Der Austausch entsteht erst aus den Nachrichten im Lernraum.</p><div className="format-key"><span><i className="dot clara"/> Clara schreibt</span><span><i className="dot heidi"/> Heidi schreibt & spricht</span><span><i className="dot peter"/> Peter spricht</span></div></div>

    {!credentials?<RoomGate onConnected={next=>{setCredentials(next);setStatus('Der gemeinsame Posttisch ist geöffnet.')}}/>:<div className="correspondence-workbench">
      <aside className="thread-map live-map"><small>Was im Gewebe auftaucht</small><div className="spool" aria-hidden="true"><i/><i/><i/></div>{themes.length?<div className="theme-weave">{themes.map(theme=><span key={theme}>{theme}</span>)}</div>:<p>Noch ist kein Themenfaden sichtbar.</p>}<div className="live-room"><i/><span>{credentials.label}<small>{status}</small></span></div></aside>

      <div className="message-stream student-stream">
        <div className="moderation-contract"><span>Der Faden hört leise mit</span><p>Nach mehreren Nachrichten kann eine Randstimme auftauchen. Sie verbindet nur Gedankenfelder: keine Aufgabe, keine Bewertung, keine Aufforderung.</p></div>
        {messages.length===0?<div className="empty-post-table"><span>Der Posttisch ist leer.</span><p>Die erste sichtbare Stimme wird die einer Schüler*in sein.</p></div>:messages.map((message,index)=><StudentMessage key={message.id} message={message} index={index} playing={playing===message.id} onPlay={()=>speak(message)}/>)}

        <section className="student-composer" aria-label="Eigene Nachricht verfassen"><header><div><small>Eigener Beitrag</small><h3>Eine Figurenstimme entsteht</h3></div><span>{body.length}/1600</span></header><div className="composer-identity"><label>Kürzel<input value={alias} maxLength={32} onChange={event=>setAlias(event.target.value)} placeholder="z. B. L7"/></label><fieldset><legend>Figurenstimme</legend><div>{(['Clara','Heidi','Peter'] as StudentCharacter[]).map(item=><button type="button" className={character===item?'active':''} onClick={()=>chooseCharacter(item)} key={item}>{item}</button>)}</div></fieldset><fieldset><legend>Form</legend><div>{formats[character].map(item=><button type="button" className={channel===item?'active':''} onClick={()=>setChannel(item)} key={item}>{labels[item]}</button>)}</div></fieldset></div><label>{channel==='letter'?'Brieftext':'Gesprochener Text'}<textarea value={body} maxLength={1600} onChange={event=>setBody(event.target.value)} placeholder={`${labels[channel]} als ${character}`}/></label>{channel==='voice'&&<p className="voice-privacy">Die Stimme entsteht erst beim Abspielen im Browser. Es wird keine Schüler*innenstimme aufgenommen.</p>}<div className="composer-send"><span>{status}</span><button onClick={submit} disabled={busy||!alias.trim()||body.trim().length<3}>{busy?'Unterwegs …':'In den Postlauf geben'} <b>→</b></button></div></section>
      </div>
    </div>}
  </section></div>
}

function RoomGate({onConnected}:{onConnected:(credentials:CloudCredentials)=>void}){
  const [roomId,setRoomId]=useState('');const [secret,setSecret]=useState('');const [label,setLabel]=useState('Heidi-Posttisch');const [busy,setBusy]=useState(false);const [notice,setNotice]=useState('Raum-ID und Schlüssel verbinden mehrere Geräte mit derselben Post.');
  const create=async()=>{setBusy(true);try{const next=await createCloudRoom(label);onConnected(next)}catch(error){setNotice(error instanceof Error?error.message:'Die Adresse konnte nicht entstehen.')}finally{setBusy(false)}};
  const join=async()=>{setBusy(true);try{const next={roomId:roomId.trim(),secret:secret.trim(),label:'Gemeinsamer Posttisch'};const data=await loadCloudRoom(next);next.label=data.room.label;setCloudCredentials(next);onConnected(next)}catch(error){setNotice(error instanceof Error?error.message:'Diese Adresse liess sich nicht öffnen.')}finally{setBusy(false)}};
  return <div className="post-address"><div><small>Neue gemeinsame Adresse</small><h3>{label}</h3><label>Bezeichnung<input value={label} maxLength={80} onChange={event=>setLabel(event.target.value)}/></label><button onClick={create} disabled={busy}>Posttisch eröffnen</button></div><div><small>Vorhandene Adresse</small><h3>Posttisch wiederfinden</h3><label>Raum-ID<input value={roomId} onChange={event=>setRoomId(event.target.value)}/></label><label>Zugangsschlüssel<input type="password" value={secret} onChange={event=>setSecret(event.target.value)}/></label><button onClick={join} disabled={busy||!roomId.trim()||!secret.trim()}>Adresse öffnen</button></div><p>{notice}</p></div>
}

function StudentMessage({message,index,playing,onPlay}:{message:CorrespondenceMessage;index:number;playing:boolean;onPlay:()=>void}){
  const isLetter=message.channel==='letter';const isReaction=message.kind==='reaction';const className=`${isLetter?'letter-message':'voice-message'} ${isReaction?'adult-reaction thread-resonance':''} from-${message.character.toLowerCase().replaceAll('ä','a').replaceAll('ö','o').replaceAll('ü','u').replaceAll(' ','-')}`;
  return <article className={className}><div className="message-route"><span>{isReaction?'Rand':'Post'}</span><i/><span>{String(index+1).padStart(2,'0')}</span></div>{isLetter?<><div className="letter-fold" aria-hidden="true"/><header><small>{isReaction?'Diskrete Resonanz':`${message.alias} · eigener Brief`}</small><b>{message.topic}</b></header><p>{message.body}</p><span className="signature">{message.character}</span></>:<><div className="voice-player"><button className={playing?'playing':''} onClick={onPlay} aria-label={`${message.character}s Sprachnachricht ${playing?'stoppen':'abspielen'}`}>{playing?'■':'▶'}</button><div><header><b>{message.character}</b><em>{isReaction?'Diskrete Resonanz':message.alias}</em><small>{message.topic}</small></header><div className="waveform" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{height:`${8+((i*7)%19)}px`}}/>)}</div></div></div><details><summary>Mitlesen</summary><p>{message.body}</p></details></>}</article>
}
