(()=>{
  let requests=[];
  let selectedService=null;
  let lastToken='';

  const currentSession=()=>typeof session!=='undefined'?session:null;
  const apiBase=()=>typeof API_URL!=='undefined'?API_URL:'';
  const isUser=()=>Boolean(currentSession()?.token&&currentSession()?.user?.role==='user');
  const lang=()=>window.ZeqviroI18n?.language||localStorage.getItem('zeqviroLanguage')||'es';
  const copy={
    es:{bar:'📝 Solicitudes y presupuestos',hint:'Explica lo que necesitas y recibe una propuesta antes de reservar.',open:'Ver solicitudes',ask:'Solicitar presupuesto',title:'Solicitar presupuesto',details:'¿Qué necesitas?',detailsPh:'Describe el trabajo, resultado esperado y cualquier detalle importante…',budget:'Presupuesto aproximado',min:'Mín. $',max:'Máx. $',when:'¿Cuándo lo necesitas? (opcional)',whenPh:'Ej. esta semana, antes del viernes…',send:'Enviar solicitud',cancel:'Cancelar',signin:'Inicia sesión para solicitar un presupuesto.',mine:'Solicitudes y presupuestos',empty:'Todavía no tienes solicitudes.',pending:'Pendiente',quoted:'Propuesta recibida',accepted:'Aceptada',declined:'Rechazada',cancelled:'Cancelada',client:'Cliente',provider:'Proveedor',quote:'Enviar propuesta',amount:'Precio propuesto ($)',message:'Mensaje para el cliente',messagePh:'Explica qué incluye tu propuesta…',decline:'Rechazar solicitud',accept:'Aceptar propuesta',cancelRequest:'Cancelar solicitud',openChat:'Abrir chat',sent:'Solicitud enviada. Ya puedes conversar con el proveedor dentro de Zeqviro.',quoteSent:'Propuesta enviada.',acceptedMsg:'Propuesta aceptada.',error:'No se pudo completar la acción.'},
    en:{bar:'📝 Requests and quotes',hint:'Explain what you need and receive a quote before booking.',open:'View requests',ask:'Request a quote',title:'Request a quote',details:'What do you need?',detailsPh:'Describe the work, expected result, and important details…',budget:'Approximate budget',min:'Min $',max:'Max $',when:'When do you need it? (optional)',whenPh:'Example: this week, before Friday…',send:'Send request',cancel:'Cancel',signin:'Sign in to request a quote.',mine:'Requests and quotes',empty:'You do not have any requests yet.',pending:'Pending',quoted:'Quote received',accepted:'Accepted',declined:'Declined',cancelled:'Cancelled',client:'Client',provider:'Provider',quote:'Send quote',amount:'Quoted price ($)',message:'Message to client',messagePh:'Explain what your quote includes…',decline:'Decline request',accept:'Accept quote',cancelRequest:'Cancel request',openChat:'Open chat',sent:'Request sent. You can now talk with the provider inside Zeqviro.',quoteSent:'Quote sent.',acceptedMsg:'Quote accepted.',error:'The action could not be completed.'},
    pt:{bar:'📝 Solicitações e orçamentos',hint:'Explique o que precisa e receba uma proposta antes de reservar.',open:'Ver solicitações',ask:'Solicitar orçamento',title:'Solicitar orçamento',details:'O que você precisa?',detailsPh:'Descreva o trabalho, resultado esperado e detalhes importantes…',budget:'Orçamento aproximado',min:'Mín. $',max:'Máx. $',when:'Quando você precisa? (opcional)',whenPh:'Ex.: esta semana, antes de sexta…',send:'Enviar solicitação',cancel:'Cancelar',signin:'Entre para solicitar um orçamento.',mine:'Solicitações e orçamentos',empty:'Você ainda não tem solicitações.',pending:'Pendente',quoted:'Proposta recebida',accepted:'Aceita',declined:'Recusada',cancelled:'Cancelada',client:'Cliente',provider:'Prestador',quote:'Enviar proposta',amount:'Preço proposto ($)',message:'Mensagem ao cliente',messagePh:'Explique o que sua proposta inclui…',decline:'Recusar solicitação',accept:'Aceitar proposta',cancelRequest:'Cancelar solicitação',openChat:'Abrir chat',sent:'Solicitação enviada. Agora você pode conversar com o prestador dentro da Zeqviro.',quoteSent:'Proposta enviada.',acceptedMsg:'Proposta aceita.',error:'Não foi possível concluir a ação.'},
    fr:{bar:'📝 Demandes et devis',hint:'Expliquez votre besoin et recevez un devis avant de réserver.',open:'Voir les demandes',ask:'Demander un devis',title:'Demander un devis',details:'De quoi avez-vous besoin ?',detailsPh:'Décrivez le travail, le résultat attendu et les détails importants…',budget:'Budget approximatif',min:'Min. $',max:'Max. $',when:'Quand en avez-vous besoin ? (facultatif)',whenPh:'Ex. cette semaine, avant vendredi…',send:'Envoyer la demande',cancel:'Annuler',signin:'Connectez-vous pour demander un devis.',mine:'Demandes et devis',empty:'Vous n’avez encore aucune demande.',pending:'En attente',quoted:'Devis reçu',accepted:'Acceptée',declined:'Refusée',cancelled:'Annulée',client:'Client',provider:'Prestataire',quote:'Envoyer un devis',amount:'Prix proposé ($)',message:'Message au client',messagePh:'Expliquez ce que comprend votre devis…',decline:'Refuser la demande',accept:'Accepter le devis',cancelRequest:'Annuler la demande',openChat:'Ouvrir le chat',sent:'Demande envoyée. Vous pouvez maintenant échanger avec le prestataire dans Zeqviro.',quoteSent:'Devis envoyé.',acceptedMsg:'Devis accepté.',error:'Impossible de terminer cette action.'},
    zh:{bar:'📝 请求与报价',hint:'说明你的需求，在预订前先收到报价。',open:'查看请求',ask:'请求报价',title:'请求报价',details:'你需要什么？',detailsPh:'描述工作内容、预期结果和重要细节…',budget:'大致预算',min:'最低 $',max:'最高 $',when:'什么时候需要？（可选）',whenPh:'例如：本周、周五之前…',send:'发送请求',cancel:'取消',signin:'登录后才能请求报价。',mine:'请求与报价',empty:'你还没有任何请求。',pending:'待处理',quoted:'已收到报价',accepted:'已接受',declined:'已拒绝',cancelled:'已取消',client:'客户',provider:'服务者',quote:'发送报价',amount:'报价金额 ($)',message:'给客户的消息',messagePh:'说明报价包含的内容…',decline:'拒绝请求',accept:'接受报价',cancelRequest:'取消请求',openChat:'打开聊天',sent:'请求已发送。现在可以在 Zeqviro 内与服务者沟通。',quoteSent:'报价已发送。',acceptedMsg:'报价已接受。',error:'无法完成此操作。'}
  };
  const c=()=>copy[lang()]||copy.es;
  const esc=value=>typeof escapeHtml==='function'?escapeHtml(String(value||'')):String(value||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function ensureBar(){
    if(document.getElementById('block6RequestsBar')) return;
    const favorites=document.getElementById('block6FavoritesBar');
    const grid=document.getElementById('servicesGrid');
    if(!grid) return;
    const bar=document.createElement('div');
    bar.id='block6RequestsBar';bar.className='block6-requests-bar';
    bar.innerHTML=`<div><strong>${c().bar}</strong><span>${c().hint}</span></div><button id="block6RequestsOpen" type="button" class="btn btn-secondary">${c().open}</button>`;
    (favorites||grid).insertAdjacentElement(favorites?'afterend':'beforebegin',bar);
    bar.querySelector('button')?.addEventListener('click',openRequestsPanel);
  }

  function ensureDialogs(){
    if(!document.getElementById('block6RequestDialog')){
      const dialog=document.createElement('dialog');dialog.id='block6RequestDialog';dialog.className='block6-request-dialog';
      document.body.appendChild(dialog);
    }
    if(!document.getElementById('block6RequestsDialog')){
      const dialog=document.createElement('dialog');dialog.id='block6RequestsDialog';dialog.className='block6-requests-list-dialog';
      document.body.appendChild(dialog);
    }
  }

  function decorateCards(items){
    const cards=[...document.querySelectorAll('#servicesGrid .block6-service-card')];
    cards.forEach((card,index)=>{
      const service=items[index];if(!service)return;
      card.querySelector('.block6-request-quote-button')?.remove();
      const own=String(service.providerId||'')===String(currentSession()?.user?.id||'');
      if(own)return;
      const actions=card.querySelector('.block6-service-actions');if(!actions)return;
      const button=document.createElement('button');button.type='button';button.className='btn btn-secondary block6-request-quote-button';button.textContent=c().ask;
      button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openRequestDialog(service);});
      actions.prepend(button);
    });
  }

  const priorRender=window.renderServices;
  if(typeof priorRender==='function'){
    window.renderServices=function(items){const list=Array.isArray(items)?items:[];priorRender(list);decorateCards(list);};
  }

  function openRequestDialog(service){
    if(!isUser()){if(typeof openAuth==='function')openAuth();return;}
    selectedService=service;ensureDialogs();
    const dialog=document.getElementById('block6RequestDialog');
    dialog.innerHTML=`<div class="dialog-body"><button class="icon-btn block6-dialog-close" type="button" aria-label="Close">✕</button><h3>${esc(c().title)}</h3><p class="service-meta">${esc(service.name||'')}</p><form id="block6RequestForm"><div class="form-group"><label for="block6RequestDetails">${esc(c().details)}</label><textarea id="block6RequestDetails" minlength="10" maxlength="1200" required placeholder="${esc(c().detailsPh)}"></textarea></div><div class="form-group"><label>${esc(c().budget)}</label><div class="block6-budget-row"><input id="block6BudgetMin" type="number" min="0" step="1" placeholder="${esc(c().min)}"><input id="block6BudgetMax" type="number" min="0" step="1" placeholder="${esc(c().max)}"></div></div><div class="form-group"><label for="block6DesiredTime">${esc(c().when)}</label><input id="block6DesiredTime" maxlength="160" placeholder="${esc(c().whenPh)}"></div><p id="block6RequestStatus" class="form-error" role="status"></p><div class="dialog-actions"><button class="btn btn-secondary" type="button" data-close>${esc(c().cancel)}</button><button class="btn" type="submit">${esc(c().send)}</button></div></form></div>`;
    dialog.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());dialog.querySelector('.block6-dialog-close')?.addEventListener('click',()=>dialog.close());dialog.querySelector('form')?.addEventListener('submit',submitRequest);dialog.showModal();
  }

  async function submitRequest(event){
    event.preventDefault();const status=document.getElementById('block6RequestStatus');
    const payload={serviceId:Number(selectedService?.id),details:document.getElementById('block6RequestDetails')?.value.trim()||'',budgetMin:document.getElementById('block6BudgetMin')?.value||'',budgetMax:document.getElementById('block6BudgetMax')?.value||'',desiredTime:document.getElementById('block6DesiredTime')?.value.trim()||''};
    try{
      const response=await fetch(`${apiBase()}/api/service-requests`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${currentSession().token}`},body:JSON.stringify(payload)});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||c().error);
      status.style.color='var(--success)';status.textContent=c().sent;await loadRequests();setTimeout(()=>document.getElementById('block6RequestDialog')?.close(),900);
    }catch(error){status.style.color='var(--danger)';status.textContent=error.message;}
  }

  const statusLabel=value=>({pending:c().pending,quoted:c().quoted,accepted:c().accepted,declined:c().declined,cancelled:c().cancelled}[value]||value);
  function requestCard(r){
    const budget=r.budgetMin!=null||r.budgetMax!=null?`<span>💵 ${r.budgetMin!=null?'$'+Number(r.budgetMin).toFixed(0):'—'} – ${r.budgetMax!=null?'$'+Number(r.budgetMax).toFixed(0):'—'}</span>`:'';
    const quote=r.quoteAmount!=null?`<div class="block6-quote-box"><strong>$${Number(r.quoteAmount).toFixed(2)}</strong>${r.providerMessage?`<p data-user-content>${esc(r.providerMessage)}</p>`:''}</div>`:'';
    let actions='';
    if(r.perspective==='provider'&&r.status==='pending') actions=`<div class="block6-quote-form"><input type="number" min="0" step="1" data-quote-amount placeholder="${esc(c().amount)}"><textarea maxlength="800" data-quote-message placeholder="${esc(c().messagePh)}"></textarea><div class="block6-request-actions"><button class="btn btn-secondary" type="button" data-decline>${esc(c().decline)}</button><button class="btn" type="button" data-quote>${esc(c().quote)}</button></div></div>`;
    if(r.perspective==='client'&&r.status==='quoted') actions=`<div class="block6-request-actions"><button class="btn btn-secondary" type="button" data-cancel-request>${esc(c().cancelRequest)}</button><button class="btn btn-success" type="button" data-accept>${esc(c().accept)}</button></div>`;
    if(r.perspective==='client'&&r.status==='pending') actions=`<div class="block6-request-actions"><button class="btn btn-secondary" type="button" data-cancel-request>${esc(c().cancelRequest)}</button></div>`;
    return `<article class="block6-request-card" data-request-id="${Number(r.id)}"><div class="block6-request-head"><div><strong>${esc(r.serviceName)}</strong><span>${esc(r.perspective==='client'?r.providerName:r.clientName)}</span></div><span class="block6-request-status ${esc(r.status)}">${esc(statusLabel(r.status))}</span></div><p data-user-content>${esc(r.details)}</p><div class="block6-request-meta">${budget}${r.desiredTime?`<span>🕒 ${esc(r.desiredTime)}</span>`:''}</div>${quote}${actions}<p class="block6-request-feedback" role="status"></p></article>`;
  }

  function renderRequests(){
    ensureDialogs();const dialog=document.getElementById('block6RequestsDialog');
    dialog.innerHTML=`<div class="dialog-body"><button class="icon-btn block6-dialog-close" type="button">✕</button><h3>${esc(c().mine)}</h3><div class="block6-requests-list">${requests.length?requests.map(requestCard).join(''):`<div class="block6-requests-empty">${esc(c().empty)}</div>`}</div></div>`;
    dialog.querySelector('.block6-dialog-close')?.addEventListener('click',()=>dialog.close());
    dialog.querySelectorAll('[data-request-id]').forEach(card=>{
      const id=Number(card.dataset.requestId);card.querySelector('[data-quote]')?.addEventListener('click',()=>sendQuote(id,card));card.querySelector('[data-decline]')?.addEventListener('click',()=>changeStatus(id,'declined',card));card.querySelector('[data-accept]')?.addEventListener('click',()=>changeStatus(id,'accepted',card));card.querySelector('[data-cancel-request]')?.addEventListener('click',()=>changeStatus(id,'cancelled',card));
    });
  }

  async function loadRequests(){
    if(!isUser()){requests=[];lastToken='';return;}
    lastToken=currentSession().token;
    try{const response=await fetch(`${apiBase()}/api/service-requests`,{headers:{Authorization:`Bearer ${currentSession().token}`}});if(!response.ok)throw new Error();requests=await response.json();if(!Array.isArray(requests))requests=[];}catch{requests=[];}
  }

  async function openRequestsPanel(){
    if(!isUser()){if(typeof openAuth==='function')openAuth();return;}
    await loadRequests();renderRequests();document.getElementById('block6RequestsDialog')?.showModal();
  }

  async function sendQuote(id,card){
    const amount=card.querySelector('[data-quote-amount]')?.value;const message=card.querySelector('[data-quote-message]')?.value.trim()||'';const feedback=card.querySelector('.block6-request-feedback');
    try{const response=await fetch(`${apiBase()}/api/service-requests/${id}/quote`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${currentSession().token}`},body:JSON.stringify({amount,message})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||c().error);feedback.style.color='var(--success)';feedback.textContent=c().quoteSent;await loadRequests();renderRequests();}catch(error){feedback.style.color='var(--danger)';feedback.textContent=error.message;}
  }

  async function changeStatus(id,status,card){
    const feedback=card.querySelector('.block6-request-feedback');
    try{const response=await fetch(`${apiBase()}/api/service-requests/${id}/status`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${currentSession().token}`},body:JSON.stringify({status})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||c().error);feedback.style.color='var(--success)';feedback.textContent=status==='accepted'?c().acceptedMsg:'';await loadRequests();renderRequests();}catch(error){feedback.style.color='var(--danger)';feedback.textContent=error.message;}
  }

  function sync(){const token=currentSession()?.token||'';if(token!==lastToken)loadRequests();}
  function boot(){ensureBar();ensureDialogs();loadRequests();document.addEventListener('click',()=>setTimeout(sync,0),true);document.addEventListener('change',event=>{if(event.target?.id==='zeqviroLanguageSelect'){document.getElementById('block6RequestsBar')?.remove();ensureBar();}});}
  window.ZeqviroRequests={refresh:loadRequests,open:openRequestsPanel,request:openRequestDialog};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
