'use client';

export type CloudCredentials={roomId:string;secret:string;label:string};
export type CloudContribution={id:string;alias:string;topic:string;body:string;createdAt:string};
export type CorrespondenceMessage={id:string;kind:'student'|'reaction';alias:string;character:string;channel:'letter'|'voice';topic:string;body:string;createdAt:string};
export type CloudRoomData={room:{id:string;label:string;updatedAt:string};states:Record<string,{data:unknown;updatedAt:string}>;contributions:CloudContribution[];correspondence:CorrespondenceMessage[]};

const KEY='denkraum-cloud-room-v1';
const base=(process.env.NEXT_PUBLIC_API_BASE_URL||'').replace(/\/$/,'');
const endpoint=(roomId='')=>`${base}/api/learning-room${roomId?`?room=${encodeURIComponent(roomId)}`:''}`;

export function getCloudCredentials():CloudCredentials|null{try{const value=localStorage.getItem(KEY);return value?JSON.parse(value):null}catch{return null}}
export function setCloudCredentials(value:CloudCredentials|null){try{if(value)localStorage.setItem(KEY,JSON.stringify(value));else localStorage.removeItem(KEY)}catch{}}
function headers(secret?:string){return {'Content-Type':'application/json',...(secret?{Authorization:`Bearer ${secret}`}:{})}}
async function parse(response:Response){const data=await response.json().catch(()=>({error:'Unbekannte Serverantwort.'}));if(!response.ok)throw new Error(data.error||'Speichern nicht möglich.');return data}

export async function createCloudRoom(label:string){
  const data=await parse(await fetch(endpoint(),{method:'POST',headers:headers(),body:JSON.stringify({action:'create',label})}));
  const credentials={roomId:data.room.id,secret:data.room.secret,label:data.room.label}; setCloudCredentials(credentials); return credentials;
}
export async function loadCloudRoom(credentials:CloudCredentials):Promise<CloudRoomData>{return parse(await fetch(endpoint(credentials.roomId),{headers:headers(credentials.secret),cache:'no-store'}))}
export async function saveCloudState(credentials:CloudCredentials,scope:'debates'|'letters'|'textlab',data:unknown){return parse(await fetch(endpoint(credentials.roomId),{method:'PUT',headers:headers(credentials.secret),body:JSON.stringify({scope,data})}))}
export async function addCloudContribution(credentials:CloudCredentials,input:{alias:string;topic:string;body:string}){return parse(await fetch(endpoint(credentials.roomId),{method:'POST',headers:headers(credentials.secret),body:JSON.stringify({action:'contribute',...input})}))}
export async function addCorrespondenceMessage(credentials:CloudCredentials,input:{alias:string;character:'Clara'|'Heidi'|'Peter';channel:'letter'|'voice';body:string}){return parse(await fetch(endpoint(credentials.roomId),{method:'POST',headers:headers(credentials.secret),body:JSON.stringify({action:'correspond',...input})})) as Promise<{message:CorrespondenceMessage;reaction:CorrespondenceMessage|null}>}
