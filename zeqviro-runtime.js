(()=>{
  'use strict';
  const SESSION_KEY='skillhubSession';
  const listeners=new Set();

  function safeParse(value){
    try{return value?JSON.parse(value):null;}catch{return null;}
  }
  function getSession(){
    return safeParse(sessionStorage.getItem(SESSION_KEY));
  }
  function getToken(){
    return String(getSession()?.token||'');
  }
  function setSession(next){
    if(next) sessionStorage.setItem(SESSION_KEY,JSON.stringify(next));
    else sessionStorage.removeItem(SESSION_KEY);
    emit(next||null);
  }
  function clearSession(){setSession(null);}
  function apiBase(){return window.location.origin;}
  function authHeaders(extra={}){
    const token=getToken();
    return {...extra,...(token?{Authorization:`Bearer ${token}`}:{})};
  }
  function jsonAuthHeaders(extra={}){
    return authHeaders({'Content-Type':'application/json',...extra});
  }
  function emit(session){
    window.dispatchEvent(new CustomEvent('zeqviro:session-changed',{detail:{session}}));
    listeners.forEach(fn=>{try{fn(session);}catch{}});
  }
  function subscribe(fn){
    if(typeof fn!=='function')return()=>{};
    listeners.add(fn);
    return()=>listeners.delete(fn);
  }
  function syncLegacyGlobals(){
    const current=getSession();
    try{window.session=current;}catch{}
    return current;
  }
  window.ZeqviroRuntime={SESSION_KEY,getSession,getToken,setSession,clearSession,apiBase,authHeaders,jsonAuthHeaders,subscribe,syncLegacyGlobals};
  syncLegacyGlobals();
  window.addEventListener('storage',e=>{if(e.key===SESSION_KEY){syncLegacyGlobals();emit(getSession());}});
})();
