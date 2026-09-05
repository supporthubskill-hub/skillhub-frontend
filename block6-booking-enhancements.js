(()=>{
  let bookingRows=[];
  let reschedules=[];
  const currentSession=()=>typeof session!=='undefined'?session:null;
  const apiBase=()=>typeof API_URL!=='undefined'?API_URL:'';
  const isUser=()=>Boolean(currentSession()?.token&&currentSession()?.user?.role==='user');
  const lang=()=>window.ZeqviroI18n?.language||localStorage.getItem('zeqviroLanguage')||'es';
  const locale=()=>window.ZeqviroI18n?.locale||'es-US';
  const copy={
    es:{details:'Detalles de la reserva',duration:'Duración',total:'Precio acordado',notes:'Nota de la solicitud',reschedule:'Proponer otro horario',title:'Cambiar horario',choose:'Nuevo horario disponible',note:'Nota para la otra persona (opcional)',notePh:'Explica por qué necesitas cambiar el horario…',send:'Enviar propuesta',cancel:'Cancelar',pendingMine:'Esperando respuesta al cambio de horario',pendingOther:'Te propusieron un nuevo horario',accept:'Aceptar cambio',decline:'Rechazar cambio',cancelChange:'Cancelar propuesta',changed:'Horario actualizado',sent:'Propuesta de horario enviada',empty:'No hay otros horarios disponibles para este servicio.',signin:'Inicia sesión para administrar tu reserva.',error:'No se pudo actualizar la reserva.'},
    en:{details:'Booking details',duration:'Duration',total:'Agreed price',notes:'Request note',reschedule:'Propose another time',title:'Change time',choose:'New available time',note:'Note for the other person (optional)',notePh:'Explain why you need to change the time…',send:'Send proposal',cancel:'Cancel',pendingMine:'Waiting for a response to the time change',pendingOther:'A new time was proposed to you',accept:'Accept change',decline:'Decline change',cancelChange:'Cancel proposal',changed:'Time updated',sent:'Time proposal sent',empty:'There are no other available times for this service.',signin:'Sign in to manage your booking.',error:'The booking could not be updated.'},
    pt:{details:'Detalhes da reserva',duration:'Duração',total:'Preço acordado',notes:'Nota da solicitação',reschedule:'Propor outro horário',title:'Alterar horário',choose:'Novo horário disponível',note:'Nota para a outra pessoa (opcional)',notePh:'Explique por que precisa alterar o horário…',send:'Enviar proposta',cancel:'Cancelar',pendingMine:'Aguardando resposta à mudança de horário',pendingOther:'Propuseram um novo horário para você',accept:'Aceitar mudança',decline:'Recusar mudança',cancelChange:'Cancelar proposta',changed:'Horário atualizado',sent:'Proposta de horário enviada',empty:'Não há outros horários disponíveis para este serviço.',signin:'Entre para gerenciar sua reserva.',error:'Não foi possível atualizar a reserva.'},
    fr:{details:'Détails de la réservation',duration:'Durée',total:'Prix convenu',notes:'Note de la demande',reschedule:'Proposer un autre horaire',title:'Changer l’horaire',choose:'Nouvel horaire disponible',note:'Note pour l’autre personne (facultatif)',notePh:'Expliquez pourquoi vous devez changer l’horaire…',send:'Envoyer la proposition',cancel:'Annuler',pendingMine:'En attente d’une réponse au changement d’horaire',pendingOther:'Un nouvel horaire vous a été proposé',accept:'Accepter le changement',decline:'Refuser le changement',cancelChange:'Annuler la proposition',changed:'Horaire mis à jour',sent:'Proposition d’horaire envoyée',empty:'Aucun autre horaire disponible pour ce service.',signin:'Connectez-vous pour gérer votre réservation.',error:'Impossible de mettre à jour la réservation.'},
    zh:{details:'预订详情',duration:'时长',total:'约定价格',notes:'请求备注',reschedule:'建议其他时间',title:'更改时间',choose:'新的可用时间',note:'给对方的备注（可选）',notePh:'说明为什么需要更改时间…',send:'发送建议',cancel:'取消',pendingMine:'正在等待对方回复时间更改',pendingOther:'对方向你建议了新的时间',accept:'接受更改',decline:'拒绝更改',cancelChange:'取消建议',changed:'时间已更新',sent:'时间建议已发送',empty:'此服务暂无其他可用时间。',signin:'登录后管理预订。',error:'无法更新预订。'}
  };
  const c=()=>copy[lang()]||copy.es;
  const esc=v=>typeof escapeHtml==='function'?escapeHtml(String(v??'')):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmt=v=>new Date(v).toLocaleString(locale());

  function ensureDialog(){
    let dialog=document.getElementById('block6RescheduleDialog');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');dialog.id='block6RescheduleDialog';dialog.className='block6-reschedule-dialog';document.body.appendChild(dialog);return dialog;
  }

  async function fetchData(){
    if(!isUser()){bookingRows=[];reschedules=[];return;}
    const headers={Authorization:`Bearer ${currentSession().token}`};
    const [br,rr]=await Promise.all([fetch(`${apiBase()}/api/bookings/me`,{headers}),fetch(`${apiBase()}/api/booking-reschedules`,{headers})]);
    const bookings=await br.json().catch(()=>[]),changes=await rr.json().catch(()=>[]);
    if(br.ok&&Array.isArray(bookings))bookingRows=bookings;
    if(rr.ok&&Array.isArray(changes))reschedules=changes;
  }

  function pendingFor(bookingId){return reschedules.find(r=>Number(r.bookingId)===Number(bookingId)&&r.status==='pending');}

  function decorateBookings(){
    document.querySelectorAll('#bookingsList .booking-request-card').forEach(card=>{
      const id=Number(card.dataset.bookingId);const item=bookingRows.find(x=>Number(x.id)===id);if(!item)return;
      card.querySelector('.block6-booking-details')?.remove();card.querySelector('.block6-reschedule-box')?.remove();
      const detail=document.createElement('div');detail.className='block6-booking-details';
      const duration=Number(item.durationMinutes)||60,total=Number(item.total)||0;
      detail.innerHTML=`<strong>${esc(c().details)}</strong><div><span>⏱ ${esc(c().duration)}: ${duration} min</span><span>💵 ${esc(c().total)}: $${total.toFixed(2)}</span></div>${item.notes?`<p data-user-content><b>${esc(c().notes)}:</b> ${esc(item.notes)}</p>`:''}`;
      card.querySelector('.booking-request-head')?.after(detail);
      if(!['pending','confirmed'].includes(item.status))return;
      const change=pendingFor(id);const box=document.createElement('div');box.className='block6-reschedule-box';
      if(change){
        box.innerHTML=`<div><strong>${esc(change.requestedByMe?c().pendingMine:c().pendingOther)}</strong><span>${esc(fmt(change.proposedAt))}</span>${change.note?`<p data-user-content>${esc(change.note)}</p>`:''}</div><div class="block6-reschedule-actions">${change.requestedByMe?`<button class="btn btn-secondary" data-change-action="cancelled">${esc(c().cancelChange)}</button>`:`<button class="btn btn-secondary" data-change-action="declined">${esc(c().decline)}</button><button class="btn btn-success" data-change-action="accepted">${esc(c().accept)}</button>`}</div>`;
        box.querySelectorAll('[data-change-action]').forEach(btn=>btn.addEventListener('click',()=>changeReschedule(change.id,btn.dataset.changeAction,box)));
      }else{
        box.innerHTML=`<button class="btn btn-secondary block6-reschedule-open" type="button">🗓 ${esc(c().reschedule)}</button>`;
        box.querySelector('button')?.addEventListener('click',()=>openReschedule(item));
      }
      card.appendChild(box);
    });
  }

  async function openReschedule(item){
    if(!isUser())return;
    const dialog=ensureDialog();
    try{
      const response=await fetch(`${apiBase()}/api/services/${item.serviceId}/availability`);const slots=await response.json();
      if(!response.ok)throw new Error(slots.error||c().error);
      const choices=(Array.isArray(slots)?slots:[]).filter(s=>new Date(s.startsAt).getTime()!==new Date(item.date).getTime());
      dialog.innerHTML=`<div class="dialog-body"><button class="icon-btn block6-dialog-close" type="button">✕</button><h3>${esc(c().title)}</h3><p class="service-meta">${esc(item.serviceName)}</p>${choices.length?`<form id="block6RescheduleForm"><div class="form-group"><label for="block6RescheduleDate">${esc(c().choose)}</label><select id="block6RescheduleDate" required>${choices.map(s=>`<option value="${esc(s.startsAt)}">${esc(fmt(s.startsAt))} · ${Number(s.durationMinutes)||60} min</option>`).join('')}</select></div><div class="form-group"><label for="block6RescheduleNote">${esc(c().note)}</label><textarea id="block6RescheduleNote" maxlength="500" placeholder="${esc(c().notePh)}"></textarea></div><p id="block6RescheduleStatus" class="form-error"></p><div class="dialog-actions"><button class="btn btn-secondary" type="button" data-close>${esc(c().cancel)}</button><button class="btn" type="submit">${esc(c().send)}</button></div></form>`:`<div class="block6-reschedule-empty">${esc(c().empty)}</div>`}</div>`;
      dialog.querySelector('.block6-dialog-close')?.addEventListener('click',()=>dialog.close());dialog.querySelector('[data-close]')?.addEventListener('click',()=>dialog.close());
      dialog.querySelector('form')?.addEventListener('submit',e=>submitReschedule(e,item.id));dialog.showModal();
    }catch(error){console.warn(error.message);}
  }

  async function submitReschedule(event,bookingId){
    event.preventDefault();const status=document.getElementById('block6RescheduleStatus');
    try{
      const response=await fetch(`${apiBase()}/api/bookings/${bookingId}/reschedule`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${currentSession().token}`},body:JSON.stringify({date:document.getElementById('block6RescheduleDate')?.value,note:document.getElementById('block6RescheduleNote')?.value.trim()||''})});
      const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||c().error);status.style.color='var(--success)';status.textContent=c().sent;await refresh();setTimeout(()=>ensureDialog().close(),700);
    }catch(error){status.style.color='var(--danger)';status.textContent=error.message;}
  }

  async function changeReschedule(id,status,box){
    box.querySelectorAll('button').forEach(b=>b.disabled=true);
    try{
      const response=await fetch(`${apiBase()}/api/booking-reschedules/${id}/status`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${currentSession().token}`},body:JSON.stringify({status})});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||c().error);await refresh();
      const state=document.getElementById('availabilityStatus');if(state&&status==='accepted'){state.style.color='var(--success)';state.textContent=c().changed;}
    }catch(error){const state=document.getElementById('availabilityStatus');if(state){state.style.color='var(--danger)';state.textContent=error.message;}box.querySelectorAll('button').forEach(b=>b.disabled=false);}
  }

  async function refresh(){await fetchData();await priorLoadCalendar();await fetchData();decorateBookings();await fetchServicesFromAPI?.();}
  const priorLoadCalendar=window.loadCalendar;
  if(typeof priorLoadCalendar==='function'){
    window.loadCalendar=async function(){await priorLoadCalendar();if(!isUser())return;try{await fetchData();decorateBookings();}catch(error){console.warn('Booking enhancements',error);}};
  }
  window.ZeqviroBookingEnhancements={refresh};
})();
