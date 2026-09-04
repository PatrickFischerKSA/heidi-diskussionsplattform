'use client';

import { useEffect, useState } from 'react';
import { CloudCredentials, createCloudRoom, getCloudCredentials, loadCloudRoom, saveCloudState, setCloudCredentials } from './cloud';

type Props={works:unknown;onRestore:(debates:unknown)=>void;onClose:()=>void};

export default function CloudWorkspace({works,onRestore,onClose}:Props){
  const [credentials,setCredentials]=useState<CloudCredentials|null>(()=>getCloudCredentials());
  const [label,setLabel]=useState('Heidi-Lernraum');
  const [roomId,setRoomId]=useState('');
  const [secret,setSecret]=useState('');
  const [status,setStatus]=useState(credentials?'Verbunden – bereit zum Synchronisieren.':'Noch nicht mit einem Lernraum verbunden.');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{if(!credentials)return;loadCloudRoom(credentials).then(()=>setStatus('Verbunden – bereit zum Synchronisieren.')).catch(()=>setStatus('Der gespeicherte Lernraum konnte nicht erreicht werden.'))},[credentials]);
  const create=async()=>{setBusy(true);try{const next=await createCloudRoom(label);setCredentials(next);setRoomId(next.roomId);setSecret(next.secret);setStatus('Lernraum angelegt. Bewahre Schlüssel und Raum-ID gemeinsam auf.');await saveCloudState(next,'debates',works)}catch(error){setStatus(error instanceof Error?error.message:'Lernraum konnte nicht angelegt werden.')}finally{setBusy(false)}};
  const join=async()=>{setBusy(true);try{const next={roomId:roomId.trim(),secret:secret.trim(),label:'Verbundener Lernraum'};const data=await loadCloudRoom(next);next.label=data.room.label;setCloudCredentials(next);setCredentials(next);onRestore(data.states.debates?.data||{});setStatus('Cloud-Lernstand geladen und auf diesem Gerät übernommen.')}catch(error){setStatus(error instanceof Error?error.message:'Verbindung fehlgeschlagen.')}finally{setBusy(false)}};
  const sync=async()=>{if(!credentials)return;setBusy(true);try{await saveCloudState(credentials,'debates',works);setStatus(`Sicher gespeichert · ${new Date().toLocaleTimeString('de-CH',{hour:'2-digit',minute:'2-digit'})}`)}catch(error){setStatus(error instanceof Error?error.message:'Synchronisierung fehlgeschlagen.')}finally{setBusy(false)}};
  const disconnect=()=>{setCloudCredentials(null);setCredentials(null);setRoomId('');setSecret('');setStatus('Dieses Gerät ist nicht mehr verbunden. Die Cloud-Daten bleiben erhalten.')};

  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Cloud-Lernraum"><aside className="side-panel cloud-panel"><header><div><small>Cloudflare D1 · verschlüsselte Übertragung</small><h2>Cloud-Lernraum</h2></div><button onClick={onClose} aria-label="Schliessen">×</button></header><div className="side-scroll">
    <div className="cloud-status"><i className={credentials?'online':''}/><div><b>{credentials?'Cloud-Speicherung aktiv':'Lokale Speicherung aktiv'}</b><span>{status}</span></div></div>
    {!credentials&&<div className="cloud-onboarding">
      <section><span className="cloud-step">01</span><h3>Neuen Lernraum anlegen</h3><p>Es werden keine Namen oder E-Mail-Adressen benötigt. Ein zufälliger Schlüssel schützt den Raum.</p><label>Bezeichnung<input value={label} maxLength={80} onChange={event=>setLabel(event.target.value)}/></label><button className="primary-inline" onClick={create} disabled={busy}>Lernraum anlegen</button></section>
      <section><span className="cloud-step">02</span><h3>Bestehenden Raum öffnen</h3><label>Raum-ID<input value={roomId} onChange={event=>setRoomId(event.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"/></label><label>Zugangsschlüssel<input type="password" value={secret} onChange={event=>setSecret(event.target.value)} placeholder="Geheimer Schlüssel"/></label><button className="secondary-button" onClick={join} disabled={busy||!roomId||!secret}>Verbinden und laden</button></section>
    </div>}
    {credentials&&<>
      <div className="credential-card"><small>Zugangsdaten dieses Lernraums</small><h3>{credentials.label}</h3><label>Raum-ID<code>{credentials.roomId}</code></label><label>Zugangsschlüssel<code>{credentials.secret}</code></label><p>Wer beides besitzt, kann die gespeicherten Inhalte lesen und verändern. Nicht öffentlich teilen.</p><div><button onClick={()=>navigator.clipboard?.writeText(`${credentials.roomId}\n${credentials.secret}`)}>Zugangsdaten kopieren</button><button onClick={disconnect}>Gerät trennen</button></div></div>
      <div className="sync-card"><div><small>Lernstände</small><h3>Dieses Gerät ↔ Cloud</h3><p>Die Arbeitsstände der sechs Diskussionsräume werden hier synchronisiert. Figurenpost wird direkt beim Absenden gespeichert.</p></div><button className="primary-inline" onClick={sync} disabled={busy}>{busy?'Speichert …':'Jetzt synchronisieren'}</button></div>
      <section className="cloud-mode-note"><span className="cloud-step">Gemeinsame Beiträge</span><h3>Die Figurenstimmen gehören den Schüler*innen</h3><p>Briefe und Sprachnachrichten entstehen ausschliesslich am gemeinsamen Posttisch im Modus «Heidi · Clara · Peter». Dieser Bereich verwaltet nur Zugang und Lernstände.</p></section>
    </>}
    <div className="security-note"><b>So werden die Daten geschützt</b><p>Der Schlüssel wird nur auf diesem Gerät gespeichert. In der Datenbank liegt davon ausschliesslich ein SHA-256-Prüfwert. Alle Anfragen werden validiert, Datenbankzugriffe sind parametrisiert und die Übertragung erfolgt über HTTPS. Beiträge sind nicht öffentlich durchsuchbar.</p></div>
  </div></aside></div>
}
