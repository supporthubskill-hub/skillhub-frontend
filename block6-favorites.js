(()=>{
  const favoriteIds=new Set();
  let showingFavorites=false;
  let lastToken='';

  const currentSession=()=>typeof session!=='undefined'?session:null;
  const apiBase=()=>typeof API_URL!=='undefined'?API_URL:'';
  const serviceList=()=>Array.isArray(window.servicesData)?window.servicesData:(typeof servicesData!=='undefined'&&Array.isArray(servicesData)?servicesData:[]);
  const isUser=()=>Boolean(currentSession()?.token&&currentSession()?.user?.role==='user');
  const t=(key,fallback)=>window.ZeqviroI18nCore?.t?.(key)||fallback;

  function ensureFavoritesBar(){
    if(document.getElementById('block6FavoritesBar')) return;
    const grid=document.getElementById('servicesGrid');
    if(!grid) return;
    const bar=document.createElement('div');
    bar.id='block6FavoritesBar';
    bar.className='block6-favorites-bar';
    bar.innerHTML='<div><strong data-i18n="favorites.title"></strong><span id="block6FavoritesHint"></span></div><button id="block6FavoritesToggle" type="button" class="btn btn-secondary"></button>';
    grid.insertAdjacentElement('beforebegin',bar);
    document.getElementById('block6FavoritesToggle')?.addEventListener('click',toggleFavoritesView);
    updateBar();
  }

  function updateBar(){
    ensureFavoritesBar();
    const button=document.getElementById('block6FavoritesToggle');
    const hint=document.getElementById('block6FavoritesHint');
    const title=document.querySelector('#block6FavoritesBar strong');
    if(title) title.textContent=`❤️ ${t('favorites.title','Mis favoritos')}`;
    if(button) button.textContent=showingFavorites?t('favorites.allServices','Todos los servicios'):`${t('favorites.title','Mis favoritos')} (${favoriteIds.size})`;
    if(hint) hint.textContent=isUser()?t('favorites.savedHint','Guarda servicios para encontrarlos fácilmente después.'):t('favorites.signIn','Inicia sesión para guardar favoritos.');
  }

  function favoriteButton(service){
    const id=Number(service?.id);
    const own=String(service?.providerId||'')===String(currentSession()?.user?.id||'');
    if(!Number.isInteger(id)||own) return null;
    const button=document.createElement('button');
    const active=favoriteIds.has(id);
    button.type='button';
    button.className=`block6-favorite-button${active?' active':''}`;
    button.setAttribute('aria-pressed',active?'true':'false');
    button.setAttribute('aria-label',active?'Remove from favorites':'Save to favorites');
    button.title=button.getAttribute('aria-label');
    button.textContent=active?'♥':'♡';
    button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();toggleFavorite(id,button);});
    return button;
  }

  function decorateCards(items){
    const cards=[...document.querySelectorAll('#servicesGrid .block6-service-card')];
    cards.forEach((card,index)=>{
      const service=items[index];
      if(!service) return;
      card.dataset.serviceId=String(service.id);
      card.querySelector('.block6-favorite-button')?.remove();
      const button=favoriteButton(service);
      if(button) card.appendChild(button);
    });
  }

  const originalRender=window.renderServices;
  if(typeof originalRender==='function'){
    window.renderServices=function(items){
      const list=Array.isArray(items)?items:[];
      originalRender(list);
      decorateCards(list);
      setTimeout(()=>window.ZeqviroI18nCore?.apply?.(),0);
    };
  }

  async function loadFavorites(){
    const token=currentSession()?.token||'';
    if(!token||currentSession()?.user?.role!=='user'){
      favoriteIds.clear();lastToken='';showingFavorites=false;updateBar();
      return;
    }
    lastToken=token;
    try{
      const response=await fetch(`${apiBase()}/api/favorites`,{headers:{Authorization:`Bearer ${token}`}});
      if(!response.ok) throw new Error('No se pudieron cargar los favoritos');
      const rows=await response.json();
      favoriteIds.clear();
      (Array.isArray(rows)?rows:[]).forEach(row=>{const id=Number(row.serviceId);if(Number.isInteger(id))favoriteIds.add(id);});
      updateBar();
      if(showingFavorites) renderFavorites(); else if(typeof window.filterServices==='function') window.filterServices();
    }catch{
      favoriteIds.clear();updateBar();
    }
  }

  async function toggleFavorite(serviceId,button){
    if(!isUser()){
      if(typeof openAuth==='function') openAuth();
      return;
    }
    const active=favoriteIds.has(serviceId);
    button.disabled=true;
    try{
      const response=await fetch(`${apiBase()}/api/favorites/${serviceId}`,{method:active?'DELETE':'POST',headers:{Authorization:`Bearer ${currentSession().token}`}});
      if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||'No se pudo actualizar favoritos');}
      if(active) favoriteIds.delete(serviceId); else favoriteIds.add(serviceId);
      updateBar();
      if(showingFavorites) renderFavorites(); else if(typeof window.filterServices==='function') window.filterServices();
    }catch(error){console.warn(error.message);}finally{button.disabled=false;}
  }

  function renderFavorites(){
    const list=serviceList().filter(service=>favoriteIds.has(Number(service.id)));
    if(typeof window.renderServices==='function') window.renderServices(list);
    const grid=document.getElementById('servicesGrid');
    if(grid&&list.length===0){grid.innerHTML=`<div class="block6-favorites-empty"><strong>${t('favorites.empty','No tienes servicios favoritos disponibles.')}</strong><span>${t('favorites.emptyHint','Guarda servicios con el corazón para volver a ellos después.')}</span></div>`;}
    const summary=document.getElementById('block6FilterSummary');
    if(summary) summary.textContent=String(list.length);
    window.ZeqviroI18nCore?.apply?.();
  }

  function toggleFavoritesView(){
    if(!isUser()){if(typeof openAuth==='function') openAuth();return;}
    showingFavorites=!showingFavorites;updateBar();if(showingFavorites) renderFavorites(); else if(typeof window.filterServices==='function') window.filterServices();
  }

  function syncSession(){const token=currentSession()?.token||'';if(token!==lastToken) loadFavorites();}
  function boot(){ensureFavoritesBar();loadFavorites();document.addEventListener('click',()=>setTimeout(syncSession,0),true);window.addEventListener('storage',syncSession);document.addEventListener('zeqviro:languagechange',()=>{updateBar();if(showingFavorites)renderFavorites();});}

  window.ZeqviroFavorites={has:id=>favoriteIds.has(Number(id)),refresh:loadFavorites,show:()=>{showingFavorites=true;updateBar();renderFavorites();}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();