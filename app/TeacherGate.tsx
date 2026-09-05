'use client';

import { FormEvent, ReactNode, useEffect, useState } from 'react';

const TOKEN_KEY='denkraum-teacher-session-v1';
const base=(process.env.NEXT_PUBLIC_API_BASE_URL||'').replace(/\/$/,'');
const endpoint=`${base}/api/teacher-auth`;
const storedToken=()=>{try{return sessionStorage.getItem(TOKEN_KEY)||''}catch{return ''}};

export default function TeacherGate({children}:{children:ReactNode}){
  const [state,setState]=useState<'checking'|'locked'|'open'>('checking');
  const [password,setPassword]=useState('');
  const [notice,setNotice]=useState('Dieser Bereich ist Lehrpersonen vorbehalten.');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{fetch(endpoint,{credentials:'include',headers:storedToken()?{Authorization:`Bearer ${storedToken()}`}:{}}).then(response=>setState(response.ok?'open':'locked')).catch(()=>{setState('locked');setNotice('Die Zugangskontrolle ist gerade nicht erreichbar.')})},[]);
  const login=async(event:FormEvent)=>{
    event.preventDefault();setBusy(true);
    try{
      const response=await fetch(endpoint,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.error||'Anmeldung nicht möglich.');
      if(data.token)try{sessionStorage.setItem(TOKEN_KEY,data.token)}catch{}
      setPassword('');setState('open');
    }catch(error){setNotice(error instanceof Error?error.message:'Anmeldung nicht möglich.')}finally{setBusy(false)}
  };
  const logout=async()=>{const token=storedToken();try{await fetch(endpoint,{method:'DELETE',credentials:'include',headers:token?{Authorization:`Bearer ${token}`}:{}})}catch{}try{sessionStorage.removeItem(TOKEN_KEY)}catch{}setState('locked');setNotice('Lehrpersonenbereich wurde geschlossen.')};

  if(state==='checking')return <div className="teacher-lock checking"><i/><p>Zugang wird geprüft …</p></div>;
  if(state==='locked')return <form className="teacher-lock" onSubmit={login}><span className="lock-mark" aria-hidden="true">H</span><small>Geschützter Bereich</small><h3>Lehrpersonen-Zugang</h3><p>{notice}</p><label>Passwort<input type="password" autoComplete="current-password" autoFocus value={password} onChange={event=>setPassword(event.target.value)}/></label><button type="submit" disabled={busy||!password}>{busy?'Prüft …':'Bereich öffnen'}</button></form>;
  return <div className="teacher-unlocked"><div className="teacher-session"><span><i/> Lehrpersonen-Sitzung aktiv</span><button onClick={logout}>Abmelden</button></div>{children}</div>;
}
