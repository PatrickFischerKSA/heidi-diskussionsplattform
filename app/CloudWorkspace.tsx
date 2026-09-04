'use client';

import { useEffect, useState } from 'react';
import { addCloudContribution, CloudContribution, CloudCredentials, createCloudRoom, getCloudCredentials, loadCloudRoom, saveCloudState, setCloudCredentials } from './cloud';

type Props={works:unknown;onRestore:(debates:unknown,letters:string[])=>void;onClose:()=>void};

export default function CloudWorkspace({works,onRestore,onClose}:Props){
  const [credentials,setCredentials]=useState<CloudCredentials|null>(()=>getCloudCredentials());
  const [label,setLabel]=useState('Heidi-Lernraum');
  const [roomId,setRoomId]=useState('');
  const [secret,setSecret]=useState('');
  const [status,setStatus]=useState(credentials?'Verbunden – bereit zum Synchronisieren.':'Noch nicht mit einem Lernraum verbunden.');
  const [busy,setBusy]=useState(false);
  const [posts,setPosts]=useState<CloudContribution[]>([]);
  const [alias,setAlias]=useState(''); const [topic,setTopic]=useState('Freundschaft'); const [body,setBody]=useState('');

  useEffect(()=>{if(!credentials)return;loadCloudRoom(credentials).then(data=>setPosts(data.contributions)).catch(()=>setStatus('Der gespeicherte Lernraum konnte nicht erreicht werden.'))},[credentials]);
  const localLetters=()=>{try{return JSON.parse(localStorage.getItem('denkraum-faden-v2')||'[]')}catch{return []}};
  const create=async()=>{setBusy(true);try{const next=await createCloudRoom(label);setCredentials(next);setRoomId(next.roomId);setSecret(next.secret);setStatus('Lernraum angelegt. Bewahre Schlüssel und Raum-ID gemeinsam auf.');await Promise.all([saveCloudState(next,'debates',works),saveCloudState(next,'letters',localLetters())])}catch(error){setStatus(error instanceof Error?error.message:'Lernraum konnte nicht angelegt werden.')}finally{setBusy(false)}};
  const join=async()=>{setBusy(true);try{const next={roomId:roomId.trim(),secret:secret.trim(),label:'Verbundener Lernraum'};const data=await loadCloudRoom(next);next.label=data.room.label;setCloudCredentials(next);setCredentials(next);setPosts(data.contributions);onRestore(data.states.debates?.data||{},Array.isArray(data.states.letters?.data)?data.states.letters.data:[]);setStatus('Cloud-Lernstand geladen und auf diesem Gerät übernommen.')}catch(error){setStatus(error instanceof Error?error.message:'Verbindung fehlgeschlagen.')}finally{setBusy(false)}};
  const sync=async()=>{if(!credentials)return;setBusy(true);try{await Promise.all([saveCloudState(credentials,'debates',works),saveCloudState(credentials,'letters',localLetters())]);const data=await loadCloudRoom(credentials);setPosts(data.contributions);setStatus(`Sicher gespeichert · ${new Date().toLocaleTimeString('de-CH',{hour:'2-digit',minute:'2-digit'})}`)}catch(error){setStatus(error instanceof Error?error.message:'Synchronisierung fehlgeschlagen.')}finally{setBusy(false)}};
  const contribute=async()=>{if(!credentials)return;setBusy(true);try{const data=await addCloudContribution(credentials,{alias,topic,body});setPosts(items=>[data.contribution,...items]);setBody('');setStatus('Beitrag im geschützten Lernraum gespeichert.')}catch(error){setStatus(error instanceof Error?error.message:'Beitrag konnte nicht gespeichert werden.')}finally{setBusy(false)}};
  const disconnect=()=>{setCloudCredentials(null);setCredentials(null);setRoomId('');setSecret('');setPosts([]);setStatus('Dieses Gerät ist nicht mehr verbunden. Die Cloud-Daten bleiben erhalten.')};

  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Cloud-Lernraum"><aside className="side-panel cloud-panel"><header><div><small>Cloudflare D1 · verschlüsselte Übertragung</small><h2>Cloud-Lernraum</h2></div><button onClick={onClose} aria-label="Schliessen">×</button></header><div className="side-scroll">
    <div className="cloud-status"><i className={credentials?'online':''}/><div><b>{credentials?'Cloud-Speicherung aktiv':'Lokale Speicherung aktiv'}</b><span>{status}</span></div></div>
    {!credentials&&<div className="cloud-onboarding">
      <section><span className="cloud-step">01</span><h3>Neuen Lernraum anlegen</h3><p>Es werden keine Namen oder E-Mail-Adressen benötigt. Ein zufälliger Schlüssel schützt den Raum.</p><label>Bezeichnung<input value={label} maxLength={80} onChange={event=>setLabel(event.target.value)}/></label><button className="primary-inline" onClick={create} disabled={busy}>Lernraum anlegen</button></section>
      <section><span className="cloud-step">02</span><h3>Bestehenden Raum öffnen</h3><label>Raum-ID<input value={roomId} onChange={event=>setRoomId(event.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"/></label><label>Zugangsschlüssel<input type="password" value={secret} onChange={event=>setSecret(event.target.value)} placeholder="Geheimer Schlüssel"/></label><button className="secondary-button" onClick={join} disabled={busy||!roomId||!secret}>Verbinden und laden</button></section>
    </div>}
    {credentials&&<>
      <div className="credential-card"><small>Zugangsdaten dieses Lernraums</small><h3>{credentials.label}</h3><label>Raum-ID<code>{credentials.roomId}</code></label><label>Zugangsschlüssel<code>{credentials.secret}</code></label><p>Wer beides besitzt, kann die gespeicherten Inhalte lesen und verändern. Nicht öffentlich teilen.</p><div><button onClick={()=>navigator.clipboard?.writeText(`${credentials.roomId}\n${credentials.secret}`)}>Zugangsdaten kopieren</button><button onClick={disconnect}>Gerät trennen</button></div></div>
      <div className="sync-card"><div><small>Lernstände</small><h3>Dieses Gerät ↔ Cloud</h3><p>Diskussionsräume und Fadenspiel werden gemeinsam gesichert.</p></div><button className="primary-inline" onClick={sync} disabled={busy}>{busy?'Speichert …':'Jetzt synchronisieren'}</button></div>
      <section className="contribution-compose"><span className="cloud-step">Beiträge</span><h3>Gedanken im Lernraum teilen</h3><p>Beiträge sind nur mit Raum-ID und Schlüssel sichtbar. Verwende ein Kürzel statt eines vollständigen Namens.</p><div className="compose-row"><label>Kürzel<input value={alias} maxLength={40} onChange={event=>setAlias(event.target.value)} placeholder="z. B. Gruppe A"/></label><label>Thema<select value={topic} onChange={event=>setTopic(event.target.value)}><option>Freundschaft</option><option>Eifersucht</option><option>Tiere</option><option>Bildung</option><option>Behinderung</option><option>Natur</option><option>Ungleichheit</option><option>Zugehörigkeit</option><option>Verantwortung</option></select></label></div><label>Beitrag<textarea value={body} maxLength={2000} onChange={event=>setBody(event.target.value)} placeholder="Ein Gedanke, ein Widerspruch oder eine Textbeobachtung …"/></label><button className="primary-inline" onClick={contribute} disabled={busy||!alias.trim()||body.trim().length<3}>Beitrag speichern</button>
      </section>
      <section className="cloud-posts"><h3>Beiträge aus diesem Lernraum</h3>{posts.length===0?<p className="empty-posts">Noch keine Beiträge gespeichert.</p>:posts.map(post=><article key={post.id}><header><b>{post.alias}</b><span>{post.topic}</span><time>{new Date(post.createdAt).toLocaleDateString('de-CH')}</time></header><p>{post.body}</p></article>)}</section>
    </>}
    <div className="security-note"><b>So werden die Daten geschützt</b><p>Der Schlüssel wird nur auf diesem Gerät gespeichert. In der Datenbank liegt davon ausschliesslich ein SHA-256-Prüfwert. Alle Anfragen werden validiert, Datenbankzugriffe sind parametrisiert und die Übertragung erfolgt über HTTPS. Beiträge sind nicht öffentlich durchsuchbar.</p></div>
  </div></aside></div>
}
