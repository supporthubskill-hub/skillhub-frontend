(()=>{
  'use strict';

  const copy={
    es:{label:'Actualizar',busy:'Actualizando…',done:'Actualizado',error:'No se pudo actualizar'},
    en:{label:'Refresh',busy:'Refreshing…',done:'Updated',error:'Could not refresh'},
    pt:{label:'Atualizar',busy:'Atualizando…',done:'Atualizado',error:'Não foi possível atualizar'},
    fr:{label:'Actualiser',busy:'Actualisation…',done:'Actualisé',error:'Impossible d’actualiser'},
    zh:{label:'刷新',busy:'正在刷新…',done:'已刷新',error:'无法刷新'}
  };

  const lang=()=>{
    try{return window.ZeqviroI18nCore?.language?.()||localStorage.getItem('zeqviroLanguage')||'es';}
    catch{return 'es';}
  };
  const text=(key)=>copy[lang()]?.[key]||copy.es[key];

  function activeTab(){
    return document.querySelector('.tab-content.active')?.id||'tab-search';
  }

  function ensureButton(){
    if(document.getElementById('block7RefreshButton')) return;
    const actions=document.querySelector('.header-actions');
    if(!actions) return;
    const button=document.createElement('button');
    button.id='block7RefreshButton';
    button.type='button';
    button.className='icon-btn block7-refresh-button';
    button.innerHTML='<span class="block7-refresh-icon" aria-hidden="true">↻</span><span class="block7-refresh-label"></span>';
    button.addEventListener('click',refreshCurrent);
    actions.insertBefore(button,actions.lastElementChild||null);
    localize();
  }

  function localize(){
    const button=document.getElementById('block7RefreshButton');
    if(!button) return;
    button.querySelector('.block7-refresh-label').textContent=text('label');
    button.setAttribute('aria-label',text('label'));
    button.title=text('label');
  }

  async function run(fn){
    if(typeof fn!=='function') return;
    await fn();
  }

  async function refreshCurrent(){
    const button=document.getElementById('block7RefreshButton');
    if(!button||button.disabled) return;
    const label=button.querySelector('.block7-refresh-label');
    button.disabled=true;
    button.classList.add('is-refreshing');
    if(label) label.textContent=text('busy');

    try{
      const tab=activeTab();
      if(tab==='tab-search'){
        await run(window.fetchServicesFromAPI);
        await run(window.ZeqviroFavorites?.refresh);
        if(typeof window.filterServices==='function') window.filterServices();
      }else if(tab==='tab-publish'){
        await run(window.loadMyServices);
        await run(window.loadCalendar);
        await run(window.ZeqviroProviderDashboard?.refresh);
      }else if(tab==='tab-chat'){
        await run(window.loadConversations);
      }else if(tab==='tab-profile'){
        await run(window.loadProfilePage);
        await run(window.ZeqviroFavorites?.refresh);
      }else if(tab==='tab-dashboard'){
        await run(window.loadSecurityCenter);
      }else if(tab==='tab-notifications'){
        await run(window.ZeqviroNotifications?.refresh);
      }

      await run(window.ZeqviroNotifications?.refresh);
      button.classList.add('is-success');
      if(label) label.textContent=text('done');
      setTimeout(()=>{
        button.classList.remove('is-success');
        localize();
      },900);
    }catch(error){
      console.warn('Zeqviro refresh failed:',error);
      button.classList.add('is-error');
      if(label) label.textContent=text('error');
      setTimeout(()=>{
        button.classList.remove('is-error');
        localize();
      },1200);
    }finally{
      button.disabled=false;
      button.classList.remove('is-refreshing');
    }
  }

  function boot(){
    ensureButton();
    const observer=new MutationObserver(ensureButton);
    observer.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener('zeqviro:languagechange',localize);
  }

  window.ZeqviroRefresh={refresh:refreshCurrent};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
