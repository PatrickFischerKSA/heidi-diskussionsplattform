import { env } from 'cloudflare:workers';

type RoomRow = { id:string; label:string; created_at:string; updated_at:string };
type StateRow = { scope:string; payload_json:string; updated_at:string };
type ContributionRow = { id:string; alias:string; topic:string; body:string; created_at:string };
const allowedScopes = new Set(['debates','letters']);

function allowedOrigin(request:Request){
  const origin=request.headers.get('origin');
  if(!origin)return null;
  const own=new URL(request.url).origin;
  if(origin===own || /^https:\/\/[a-z0-9-]+\.github\.io$/i.test(origin))return origin;
  if(/^https?:\/\/localhost(?::\d+)?$/i.test(origin))return origin;
  return null;
}

function response(request:Request,body:unknown,status=200){
  const origin=allowedOrigin(request);
  const headers:Record<string,string>={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
  if(origin){headers['Access-Control-Allow-Origin']=origin;headers['Vary']='Origin'}
  return new Response(JSON.stringify(body),{status,headers});
}

export async function OPTIONS(request:Request){
  const origin=allowedOrigin(request);
  if(!origin)return new Response(null,{status:403});
  return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'86400','Vary':'Origin'}});
}

async function ensureSchema(){
  const db=env.DB as D1Database;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS learning_rooms (id TEXT PRIMARY KEY NOT NULL, secret_hash TEXT NOT NULL, label TEXT NOT NULL DEFAULT 'Mein Lernraum', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS learning_states (id TEXT PRIMARY KEY NOT NULL, room_id TEXT NOT NULL REFERENCES learning_rooms(id) ON DELETE CASCADE, scope TEXT NOT NULL, payload_json TEXT NOT NULL, updated_at TEXT NOT NULL)`),
    db.prepare(`CREATE TABLE IF NOT EXISTS contributions (id TEXT PRIMARY KEY NOT NULL, room_id TEXT NOT NULL REFERENCES learning_rooms(id) ON DELETE CASCADE, alias TEXT NOT NULL, topic TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL)`),
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_learning_rooms_secret ON learning_rooms(id, secret_hash)`),
    db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS idx_learning_states_room_scope ON learning_states(room_id, scope)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_learning_states_room_updated ON learning_states(room_id, updated_at)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_contributions_room_created ON contributions(room_id, created_at)`),
  ]);
  await db.prepare('PRAGMA optimize').run();
}

function makeSecret(){
  const bytes=crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
}
async function hash(value:string){
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
function credentials(request:Request,url=new URL(request.url)){
  const roomId=url.searchParams.get('room')||request.headers.get('X-Learning-Room')||'';
  const auth=request.headers.get('Authorization')||'';
  const secret=auth.startsWith('Bearer ')?auth.slice(7):'';
  return {roomId,secret};
}
async function authenticate(request:Request,url?:URL){
  const {roomId,secret}=credentials(request,url);
  if(!/^[a-f0-9-]{36}$/.test(roomId)||secret.length<30||secret.length>120)return null;
  const row=await (env.DB as D1Database).prepare('SELECT id, label, created_at, updated_at FROM learning_rooms WHERE id = ? AND secret_hash = ? LIMIT 1').bind(roomId,await hash(secret)).first<RoomRow>();
  return row?{room:row,secret}:null;
}

export async function GET(request:Request){
  await ensureSchema();
  const auth=await authenticate(request,new URL(request.url));
  if(!auth)return response(request,{error:'Lernraum oder Schlüssel ist ungültig.'},401);
  const db=env.DB as D1Database;
  const [states,posts]=await Promise.all([
    db.prepare('SELECT scope, payload_json, updated_at FROM learning_states WHERE room_id = ? ORDER BY scope').bind(auth.room.id).all<StateRow>(),
    db.prepare('SELECT id, alias, topic, body, created_at FROM contributions WHERE room_id = ? ORDER BY created_at DESC LIMIT 100').bind(auth.room.id).all<ContributionRow>(),
  ]);
  return response(request,{room:{id:auth.room.id,label:auth.room.label,updatedAt:auth.room.updated_at},states:Object.fromEntries(states.results.map(item=>[item.scope,{data:JSON.parse(item.payload_json),updatedAt:item.updated_at}])),contributions:posts.results.map(item=>({id:item.id,alias:item.alias,topic:item.topic,body:item.body,createdAt:item.created_at}))});
}

export async function POST(request:Request){
  await ensureSchema();
  const contentLength=Number(request.headers.get('content-length')||0);
  if(contentLength>100_000)return response(request,{error:'Anfrage ist zu gross.'},413);
  const payload=await request.json().catch(()=>null) as Record<string,unknown>|null;
  if(!payload)return response(request,{error:'Ungültige Anfrage.'},400);
  const db=env.DB as D1Database;
  if(payload.action==='create'){
    const id=crypto.randomUUID(); const secret=makeSecret(); const now=new Date().toISOString();
    const label=typeof payload.label==='string'?(payload.label.trim().slice(0,80)||'Mein Lernraum'):'Mein Lernraum';
    await db.prepare('INSERT INTO learning_rooms (id, secret_hash, label, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').bind(id,await hash(secret),label,now,now).run();
    return response(request,{room:{id,label,secret,createdAt:now}},201);
  }
  const auth=await authenticate(request);
  if(!auth)return response(request,{error:'Lernraum oder Schlüssel ist ungültig.'},401);
  if(payload.action==='contribute'){
    const alias=typeof payload.alias==='string'?payload.alias.trim().slice(0,40):'';
    const topic=typeof payload.topic==='string'?payload.topic.trim().slice(0,80):'';
    const body=typeof payload.body==='string'?payload.body.trim().slice(0,2000):'';
    if(alias.length<1||topic.length<1||body.length<3)return response(request,{error:'Beitrag ist unvollständig.'},400);
    const id=crypto.randomUUID(); const createdAt=new Date().toISOString();
    await db.prepare('INSERT INTO contributions (id, room_id, alias, topic, body, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(id,auth.room.id,alias,topic,body,createdAt).run();
    await db.prepare('UPDATE learning_rooms SET updated_at = ? WHERE id = ?').bind(createdAt,auth.room.id).run();
    return response(request,{contribution:{id,alias,topic,body,createdAt}},201);
  }
  return response(request,{error:'Unbekannte Aktion.'},400);
}

export async function PUT(request:Request){
  await ensureSchema();
  const auth=await authenticate(request);
  if(!auth)return response(request,{error:'Lernraum oder Schlüssel ist ungültig.'},401);
  const payload=await request.json().catch(()=>null) as {scope?:string;data?:unknown}|null;
  if(!payload?.scope||!allowedScopes.has(payload.scope))return response(request,{error:'Ungültiger Speicherbereich.'},400);
  const data=JSON.stringify(payload.data??{});
  if(data.length>80_000)return response(request,{error:'Lernstand ist zu gross.'},413);
  const now=new Date().toISOString(); const id=`${auth.room.id}:${payload.scope}`; const db=env.DB as D1Database;
  await db.batch([
    db.prepare(`INSERT INTO learning_states (id, room_id, scope, payload_json, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(room_id, scope) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at`).bind(id,auth.room.id,payload.scope,data,now),
    db.prepare('UPDATE learning_rooms SET updated_at = ? WHERE id = ?').bind(now,auth.room.id),
  ]);
  return response(request,{ok:true,updatedAt:now});
}
