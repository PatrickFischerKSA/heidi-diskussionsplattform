import { env } from 'cloudflare:workers';

const SESSION_SECONDS=8*60*60;
const COOKIE_NAME='heidi_teacher_session';

function configuredPassword(){return (env as unknown as Record<string,string|undefined>).TEACHER_PASSWORD||''}
function allowedOrigin(request:Request){
  const origin=request.headers.get('origin');
  if(!origin)return null;
  const own=new URL(request.url).origin;
  if(origin===own||/^https:\/\/[a-z0-9-]+\.github\.io$/i.test(origin)||/^https?:\/\/localhost(?::\d+)?$/i.test(origin))return origin;
  return null;
}
function json(request:Request,body:unknown,status=200,extra:Record<string,string>={}){
  const origin=allowedOrigin(request);
  const headers:Record<string,string>={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra};
  if(origin){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Credentials']='true';headers.Vary='Origin'}
  return new Response(JSON.stringify(body),{status,headers});
}
function cookie(request:Request){
  const value=request.headers.get('cookie')?.split(';').map(part=>part.trim()).find(part=>part.startsWith(`${COOKIE_NAME}=`));
  return value?.slice(COOKIE_NAME.length+1)||'';
}
function bearer(request:Request){const value=request.headers.get('Authorization')||'';return value.startsWith('Bearer ')?value.slice(7):''}
function toBase64(bytes:ArrayBuffer){return btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','')}
async function signature(expires:string,password:string){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return toBase64(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`teacher:${expires}`)));
}
async function validSession(token:string,password:string){
  const [expires,sig,...rest]=token.split('.');
  if(rest.length||!/^\d{10,13}$/.test(expires)||Number(expires)<Date.now())return false;
  return sig===(await signature(expires,password));
}
async function samePassword(candidate:string,expected:string){
  const values=await Promise.all([candidate,expected].map(value=>crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))));
  const a=new Uint8Array(values[0]);const b=new Uint8Array(values[1]);let difference=a.length^b.length;
  for(let i=0;i<Math.max(a.length,b.length);i++)difference|=(a[i]||0)^(b[i]||0);
  return difference===0;
}

export async function OPTIONS(request:Request){
  const origin=allowedOrigin(request);if(!origin)return new Response(null,{status:403});
  return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Credentials':'true','Access-Control-Allow-Methods':'GET, POST, DELETE, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'86400','Vary':'Origin'}});
}
export async function GET(request:Request){
  const password=configuredPassword();
  if(!password)return json(request,{authenticated:false,error:'Lehrpersonen-Zugang ist nicht konfiguriert.'},503);
  const authenticated=await validSession(bearer(request)||cookie(request),password);
  return json(request,{authenticated},authenticated?200:401);
}
export async function POST(request:Request){
  const password=configuredPassword();
  if(!password)return json(request,{authenticated:false,error:'Lehrpersonen-Zugang ist nicht konfiguriert.'},503);
  const contentLength=Number(request.headers.get('content-length')||0);
  if(contentLength>2048)return json(request,{authenticated:false,error:'Anfrage ist zu gross.'},413);
  const body=await request.json().catch(()=>null) as {password?:unknown}|null;
  const candidate=typeof body?.password==='string'?body.password:'';
  if(candidate.length<1||candidate.length>200||!(await samePassword(candidate,password)))return json(request,{authenticated:false,error:'Passwort ist nicht korrekt.'},401);
  const expires=String(Date.now()+SESSION_SECONDS*1000);const token=`${expires}.${await signature(expires,password)}`;
  return json(request,{authenticated:true,token,expiresAt:Number(expires)},200,{'Set-Cookie':`${COOKIE_NAME}=${token}; Max-Age=${SESSION_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Lax`});
}
export async function DELETE(request:Request){return json(request,{authenticated:false},200,{'Set-Cookie':`${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`})}
