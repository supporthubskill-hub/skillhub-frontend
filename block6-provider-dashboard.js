(()=>{
  const currentSession=()=>typeof session!=='undefined'?session:null;
  const apiBase=()=>typeof API_URL!=='undefined'?API_URL:'';
  const isUser=()=>Boolean(currentSession()?.token&&currentSession()?.user?.role==='user');
  const lang=()=>window.ZeqviroI18n?.language||localStorage.getItem('zeqviroLanguage')||'es';
  const copy={
    es:{title:'Panel del proveedor',subtitle:'Todo lo importante de tus servicios en un solo lugar.',refresh:'Actualizar',active:'Servicios activos',ready:'Listos para reservar',pendingBookings:'Solicitudes de reserva',upcoming:'Próximas reservas',pendingQuotes:'Presupuestos pendientes',completed:'Trabajos completados',rating:'Calificación',recentBookings:'Reservas recientes',recentRequests:'Solicitudes recientes',topServices:'Rendimiento de servicios',empty:'Todavía no hay actividad para mostrar.',services:'Gestionar servicios',requests:'Ver presupuestos',bookings:'Ver reservas',profile:'Ver perfil público',client:'Cliente',noRating:'Sin reseñas',loading:'Cargando panel…',error:'No se pudo cargar el panel del proveedor.',pending:'Pendiente',confirmed:'Confirmada',completedStatus:'Completada',rejected:'Rechazada',cancelled:'Cancelada',quoted:'Propuesta enviada',accepted:'Aceptada',declined:'Rechazada'},
    en:{title:'Provider dashboard',subtitle:'Everything important about your services in one place.',refresh:'Refresh',active:'Active services',ready:'Ready to book',pendingBookings:'Booking requests',upcoming:'Upcoming bookings',pendingQuotes:'Pending quotes',completed:'Completed jobs',rating:'Rating',recentBookings:'Recent bookings',recentRequests:'Recent requests',topServices:'Service performance',empty:'There is no activity to show yet.',services:'Manage services',requests:'View quotes',bookings:'View bookings',profile:'View public profile',client:'Client',noRating:'No reviews',loading:'Loading dashboard…',error:'Could not load the provider dashboard.',pending:'Pending',confirmed:'Confirmed',completedStatus:'Completed',rejected:'Rejected',cancelled:'Cancelled',quoted:'Quote sent',accepted:'Accepted',declined:'Declined'},
    pt:{title:'Painel do prestador',subtitle:'Tudo o que importa sobre seus serviços em um só lugar.',refresh:'Atualizar',active:'Serviços ativos',ready:'Prontos para reservar',pendingBookings:'Solicitações de reserva',upcoming:'Próximas reservas',pendingQuotes:'Orçamentos pendentes',completed:'Trabalhos concluídos',rating:'Avaliação',recentBookings:'Reservas recentes',recentRequests:'Solicitações recentes',topServices:'Desempenho dos serviços',empty:'Ainda não há atividade para mostrar.',services:'Gerenciar serviços',requests:'Ver orçamentos',bookings:'Ver reservas',profile:'Ver perfil público',client:'Cliente',noRating:'Sem avaliações',loading:'Carregando painel…',error:'Não foi possível carregar o painel do prestador.',pending:'Pendente',confirmed:'Confirmada',completedStatus:'Concluída',rejected:'Recusada',cancelled:'Cancelada',quoted:'Proposta enviada',accepted:'Aceita',declined:'Recusada'},
    fr:{title:'Tableau de bord prestataire',subtitle:'Toutes les informations importantes sur vos services au même endroit.',refresh:'Actualiser',active:'Services actifs',ready:'Prêts à réserver',pendingBookings:'Demandes de réservation',upcoming:'Réservations à venir',pendingQuotes:'Devis en attente',completed:'Missions terminées',rating:'Note',recentBookings:'Réservations récentes',recentRequests:'Demandes récentes',topServices:'Performance des services',empty:'Aucune activité à afficher pour le moment.',services:'Gérer les services',requests:'Voir les devis',bookings:'Voir les réservations',profile:'Voir le profil public',client:'Client',noRating:'Aucun avis',loading:'Chargement du tableau de bord…',error:'Impossible de charger le tableau de bord prestataire.',pending:'En attente',confirmed:'Confirmée',completedStatus:'Terminée',rejected:'Refusée',cancelled:'Annulée',quoted:'Devis envoyé',accepted:'Acceptée',declined:'Refusée'},
    zh:{title:'服务者面板',subtitle:'在一个地方查看与你的服务有关的重要信息。',refresh:'刷新',active:'活跃服务',ready:'可预订服务',pendingBookings:'预订请求',upcoming:'即将到来的预订',pendingQuotes:'待处理报价',completed:'已完成工作',rating:'评分',recentBookings:'最近预订',recentRequests:'最近请求',topServices:'服务表现',empty:'目前还没有活动可显示。',services:'管理服务',requests:'查看报价',bookings:'查看预订',profile:'查看公开资料',client:'客户',noRating:'暂无评价',loading:'正在加载面板…',error:'无法加载服务者面板。',pending:'待处理',confirmed:'已确认',completedStatus:'已完成',rejected:'已拒绝',cancelled:'已取消',quoted:'已发送报价',accepted:'已接受',declined:'已拒绝'}
  };
  const c=()=>copy[lang()]||copy.es;
  const esc=value=>typeof escapeHtml==='function'?escapeHtml(String(value??'')):String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmtDate=value=>{try{return new Date(value).toLocaleString(window.ZeqviroI18n?.locale||'es-US',{dateStyle:'medium',timeStyle:'short'});}catch{return ''}};
  let data=null;

  function ensureDashboard(){
    if(document.getElementById('block6ProviderDashboard')) return;
    const tab=document.getElementById('tab-publish');
    if(!tab) return;
    const panel=document.createElement('section');
    panel.id='block6ProviderDashboard';
    panel.className='block6-provider-dashboard card';
    tab.insertAdjacentElement('afterbegin',panel);
    render();
  }

  function statusLabel(status){
    const map={pending:c().pending,confirmed:c().confirmed,completed:c().completedStatus,rejected:c().rejected,cancelled:c().cancelled,quoted:c().quoted,accepted:c().accepted,declined:c().declined};
    return map[status]||status;
  }

  function stat(value,label,extra=''){
    return `<div class="b6pd-stat"><strong>${esc(value)}</strong><span>${esc(label)}</span>${extra?`<small>${esc(extra)}</small>`:''}</div>`;
  }

  function render(){
    ensureDashboard();
    const panel=document.getElementById('block6ProviderDashboard');
    if(!panel)return;
    if(!isUser()){
      panel.innerHTML=`<div class="b6pd-head"><div><h3>📊 ${esc(c().title)}</h3><p>${esc(c().subtitle)}</p></div></div><div class="chat-empty">${esc(c().empty)}</div>`;
      return;
    }
    if(!data){
      panel.innerHTML=`<div class="b6pd-head"><div><h3>📊 ${esc(c().title)}</h3><p>${esc(c().subtitle)}</p></div><button class="btn btn-secondary" type="button" data-dashboard-refresh>${esc(c().refresh)}</button></div><div class="chat-empty">${esc(c().loading)}</div>`;
      panel.querySelector('[data-dashboard-refresh]')?.addEventListener('click',load);
      return;
    }
    const s=data.services||{},b=data.bookings||{},r=data.requests||{},rv=data.reviews||{};
    const rating=Number(rv.rating||0)>0?`⭐ ${Number(rv.rating).toFixed(1)}`:c().noRating;
    const recentBookings=(data.recentBookings||[]).map(item=>`<div class="b6pd-row"><div><strong>${esc(item.serviceName)}</strong><span>${esc(item.clientName||c().client)} · ${esc(fmtDate(item.scheduledAt))}</span></div><span class="b6pd-status ${esc(item.status)}">${esc(statusLabel(item.status))}</span></div>`).join('')||`<div class="b6pd-empty">${esc(c().empty)}</div>`;
    const recentRequests=(data.recentRequests||[]).map(item=>`<div class="b6pd-row"><div><strong>${esc(item.serviceName)}</strong><span>${esc(item.clientName||c().client)}${item.quoteAmount!=null?` · $${Number(item.quoteAmount).toFixed(2)}`:''}</span></div><span class="b6pd-status ${esc(item.status)}">${esc(statusLabel(item.status))}</span></div>`).join('')||`<div class="b6pd-empty">${esc(c().empty)}</div>`;
    const top=(data.topServices||[]).map(item=>`<div class="b6pd-service"><div><strong>${esc(item.name)}</strong><span>${Number(item.completedJobs||0)} ${esc(c().completed.toLowerCase())} · ${Number(item.reviewCount||0)} reseñas</span></div><strong>${Number(item.rating||0)>0?'⭐ '+Number(item.rating).toFixed(1):'—'}</strong></div>`).join('')||`<div class="b6pd-empty">${esc(c().empty)}</div>`;
    panel.innerHTML=`
      <div class="b6pd-head"><div><h3>📊 ${esc(c().title)}</h3><p>${esc(c().subtitle)}</p></div><button class="btn btn-secondary" type="button" data-dashboard-refresh>${esc(c().refresh)}</button></div>
      <div class="b6pd-stats">
        ${stat(s.active||0,c().active,`${s.ready||0} ${c().ready.toLowerCase()}`)}
        ${stat(b.pending||0,c().pendingBookings)}
        ${stat(b.upcoming||0,c().upcoming)}
        ${stat(r.pending||0,c().pendingQuotes)}
        ${stat(b.completed||0,c().completed)}
        ${stat(rating,c().rating,`${rv.count||0} reseñas`)}
      </div>
      <div class="b6pd-actions">
        <button class="btn btn-secondary" type="button" data-action="services">🛠️ ${esc(c().services)}</button>
        <button class="btn btn-secondary" type="button" data-action="requests">📝 ${esc(c().requests)}</button>
        <button class="btn btn-secondary" type="button" data-action="bookings">📅 ${esc(c().bookings)}</button>
        <button class="btn btn-secondary" type="button" data-action="profile">👁️ ${esc(c().profile)}</button>
      </div>
      <div class="b6pd-grid">
        <section><h4>${esc(c().recentBookings)}</h4>${recentBookings}</section>
        <section><h4>${esc(c().recentRequests)}</h4>${recentRequests}</section>
        <section><h4>${esc(c().topServices)}</h4>${top}</section>
      </div>`;
    panel.querySelector('[data-dashboard-refresh]')?.addEventListener('click',load);
    panel.querySelector('[data-action="services"]')?.addEventListener('click',()=>document.getElementById('myServicesList')?.scrollIntoView({behavior:'smooth',block:'start'}));
    panel.querySelector('[data-action="requests"]')?.addEventListener('click',()=>window.ZeqviroRequests?.open?.());
    panel.querySelector('[data-action="bookings"]')?.addEventListener('click',()=>document.getElementById('bookingsList')?.scrollIntoView({behavior:'smooth',block:'start'}));
    panel.querySelector('[data-action="profile"]')?.addEventListener('click',()=>{if(currentSession()?.user?.id)window.openProviderProfile?.(currentSession().user.id);});
  }

  async function load(){
    ensureDashboard();
    if(!isUser()){data=null;render();return;}
    const panel=document.getElementById('block6ProviderDashboard');
    panel?.classList.add('is-loading');
    try{
      const response=await fetch(`${apiBase()}/api/provider-dashboard`,{headers:{Authorization:`Bearer ${currentSession().token}`}});
      const json=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(json.error||c().error);
      data=json;render();
    }catch(error){
      if(panel)panel.innerHTML=`<div class="b6pd-head"><div><h3>📊 ${esc(c().title)}</h3><p>${esc(c().subtitle)}</p></div><button class="btn btn-secondary" type="button" data-dashboard-refresh>${esc(c().refresh)}</button></div><div class="chat-empty">${esc(error.message||c().error)}</div>`;
      panel?.querySelector('[data-dashboard-refresh]')?.addEventListener('click',load);
    }finally{panel?.classList.remove('is-loading');}
  }

  const originalSwitch=window.switchTab;
  if(typeof originalSwitch==='function'){
    window.switchTab=async function(tabId,btn){
      const result=await originalSwitch(tabId,btn);
      if(tabId==='tab-publish') setTimeout(load,0);
      return result;
    };
  }

  function boot(){
    ensureDashboard();
    if(isUser())load();
    document.addEventListener('change',event=>{if(event.target?.id==='zeqviroLanguageSelect')setTimeout(render,0);});
  }
  window.ZeqviroProviderDashboard={refresh:load};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
