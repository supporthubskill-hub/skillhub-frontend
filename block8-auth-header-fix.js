(()=>{
  'use strict';
  const runtime=()=>window.ZeqviroRuntime;
  const readSession=()=>runtime()?.getSession?.()||null;
  function syncAuthHeader(){
    const button=document.getElementById('authButton');
    if(!button)return;
    const current=readSession();
    if(current?.user){
      const name=String(current.user.name||current.user.email||'Cuenta').trim();
      button.textContent=`👤 ${name}`;
      button.setAttribute('aria-label','Cuenta activa');
      button.onclick=()=>{
        const profileNav=document.querySelector('.nav-item[data-tab="tab-profile"]');
        if(typeof switchTab==='function')switchTab('tab-profile',profileNav||null);
      };
    }else{
      button.textContent='👤 Ingresar';
      button.setAttribute('aria-label','Ingresar');
      button.onclick=()=>{if(typeof openAuth==='function')openAuth();};
    }
  }
  const schedule=()=>{syncAuthHeader();setTimeout(syncAuthHeader,250);setTimeout(syncAuthHeader,900);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
  window.addEventListener('zeqviro:session-changed',schedule);
  window.addEventListener('zeqviro:refreshed',schedule);
  document.addEventListener('click',()=>setTimeout(syncAuthHeader,50),true);
  window.ZeqviroAuthHeader={sync:syncAuthHeader};
})();