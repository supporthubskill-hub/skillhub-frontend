(()=>{
  'use strict';
  const closeLabels={es:'Cerrar',en:'Close',pt:'Fechar',fr:'Fermer',zh:'关闭'};
  const language=()=>{
    try{return window.ZeqviroI18nCore?.language?.()||localStorage.getItem('zeqviroLanguage')||'es';}catch{return 'es';}
  };

  function addCloseButton(dialog){
    if(!(dialog instanceof HTMLDialogElement)) return;
    if(dialog.querySelector('.block7-dialog-close')) return;
    const existing=[...dialog.querySelectorAll('button')].find(btn=>{
      const label=(btn.getAttribute('aria-label')||'').toLowerCase();
      const text=(btn.textContent||'').trim();
      return text==='✕'||text==='×'||label==='cerrar'||label==='close'||label==='fechar'||label==='fermer'||label==='关闭';
    });
    if(existing) return;
    const button=document.createElement('button');
    button.type='button';
    button.className='block7-dialog-close';
    button.textContent='×';
    const label=closeLabels[language()]||closeLabels.es;
    button.setAttribute('aria-label',label);
    button.title=label;
    button.addEventListener('click',()=>dialog.close());
    dialog.prepend(button);
  }

  function enhanceDialogs(root=document){
    root.querySelectorAll?.('dialog').forEach(addCloseButton);
  }

  function openSearchTab(){
    const nav=document.querySelector('.nav-item[data-tab="tab-search"]');
    if(typeof window.switchTab==='function') window.switchTab('tab-search',nav||undefined);
    else {
      document.querySelectorAll('.tab-content').forEach(el=>el.classList.remove('active'));
      document.getElementById('tab-search')?.classList.add('active');
    }
  }

  function moveFavoritesToProfile(){
    const bar=document.getElementById('block6FavoritesBar');
    const profile=document.getElementById('tab-profile');
    if(!bar||!profile) return;
    const card=profile.querySelector('.card')||profile;
    const anchor=document.getElementById('profilePageLogin')||document.getElementById('profilePageForm')||null;
    if(bar.parentElement!==card){
      if(anchor&&anchor.parentElement===card) card.insertBefore(bar,anchor);
      else card.appendChild(bar);
      bar.classList.add('block7-favorites-in-profile');
    }
    const toggle=document.getElementById('block6FavoritesToggle');
    if(toggle&&!toggle.dataset.block7NavBound){
      toggle.dataset.block7NavBound='1';
      toggle.addEventListener('click',()=>setTimeout(openSearchTab,0));
    }
  }

  function apply(root=document){
    enhanceDialogs(root);
    moveFavoritesToProfile();
  }

  const observer=new MutationObserver(records=>{
    for(const record of records){
      record.addedNodes.forEach(node=>{
        if(node.nodeType!==1) return;
        if(node.matches?.('dialog')) addCloseButton(node);
        enhanceDialogs(node);
      });
    }
    moveFavoritesToProfile();
  });

  function boot(){
    apply();
    observer.observe(document.documentElement,{childList:true,subtree:true});
    document.addEventListener('zeqviro:languagechange',()=>{
      document.querySelectorAll('.block7-dialog-close').forEach(button=>{
        const label=closeLabels[language()]||closeLabels.es;
        button.setAttribute('aria-label',label);
        button.title=label;
      });
      moveFavoritesToProfile();
    });
  }

  window.ZeqviroNavigationUX={apply,moveFavoritesToProfile};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
