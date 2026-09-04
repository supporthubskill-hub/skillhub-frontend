(()=>{
  const youthBand=()=>session?.user?.ageBand&&session.user.ageBand!=='18_plus';
  const conversation=()=>typeof activeConversation!=='undefined'?activeConversation:null;
  const otherUserId=()=>Number(conversation()?.otherUserId||conversation()?.userId||0)||null;

  function ensureUi(){
    const panel=document.querySelector('.chat-panel');
    if(!panel||document.getElementById('chatSafetyBar')) return;
    const bar=document.createElement('div');
    bar.id='chatSafetyBar';
    bar.className='chat-safety-bar';
    bar.innerHTML=`<div><strong>🛡️ Chat protegido</strong><span id="chatSafetyCopy">Mantén acuerdos y conversaciones dentro de Zeqviro. Durante la beta, no envíes pagos externos.</span></div><div class="chat-safety-actions"><button id="chatReportUser" class="icon-btn" type="button">Reportar</button><button id="chatBlockUser" class="icon-btn chat-block-btn" type="button">Bloquear</button></div>`;
    const title=document.getElementById('chatTitle');
    if(title) title.insertAdjacentElement('afterend',bar); else panel.prepend(bar);
    document.getElementById('chatBlockUser')?.addEventListener('click',blockCurrentUser);
    document.getElementById('chatReportUser')?.addEventListener('click',openChatReport);
    if(youthBand()){
      const copy=document.getElementById('chatSafetyCopy');
      if(copy) copy.textContent='Protección juvenil activa: no compartas teléfono, correo, redes sociales ni ubicación exacta.';
    }
    ensureReportDialog();
    refreshControls();
  }

  function refreshControls(){
    const id=otherUserId();
    ['chatReportUser','chatBlockUser'].forEach(key=>{const el=document.getElementById(key);if(el)el.disabled=!id;});
  }

  async function blockCurrentUser(){
    const id=otherUserId();
    if(!id||!session) return;
    const button=document.getElementById('chatBlockUser');
    if(button){button.disabled=true;button.textContent='Bloqueando…';}
    try{
      const response=await fetch(`${API_URL}/api/blocks/${id}`,{method:'POST',headers:{Authorization:`Bearer ${session.token}`}});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error||'No se pudo bloquear al usuario.');
      const status=document.getElementById('chatStatus');
      if(status){status.style.color='var(--success)';status.textContent='Usuario bloqueado. Esta conversación ya no podrá continuar.';}
      if(typeof loadConversations==='function') await loadConversations();
    }catch(error){
      const status=document.getElementById('chatStatus');
      if(status){status.style.color='var(--danger)';status.textContent=error.message;}
    }finally{
      if(button){button.disabled=false;button.textContent='Bloquear';}
    }
  }

  function ensureReportDialog(){
    if(document.getElementById('chatReportDialog')) return;
    const dialog=document.createElement('dialog');
    dialog.id='chatReportDialog';
    dialog.innerHTML=`<form class="dialog-body" id="chatReportForm"><h3>⚑ Reportar usuario del chat</h3><p class="service-meta">El reporte se enviará al equipo de moderación de Zeqviro.</p><div class="form-group"><label for="chatReportReason">Motivo</label><select id="chatReportReason"><option>Comportamiento inapropiado</option><option>Intento de fraude</option><option>Solicita información personal</option><option>Acoso o amenazas</option><option>Otro</option></select></div><div class="form-group"><label for="chatReportDetails">Detalles</label><textarea id="chatReportDetails" minlength="8" maxlength="1500" required></textarea></div><p id="chatReportStatus" class="form-error" role="status"></p><div class="dialog-actions"><button class="btn btn-secondary" type="button" id="chatReportCancel">Cancelar</button><button class="btn btn-danger" type="submit">Enviar reporte</button></div></form>`;
    document.body.appendChild(dialog);
    document.getElementById('chatReportCancel').addEventListener('click',()=>dialog.close());
    document.getElementById('chatReportForm').addEventListener('submit',submitChatReport);
  }

  function openChatReport(){
    if(!otherUserId()) return;
    document.getElementById('chatReportDetails').value='';
    document.getElementById('chatReportStatus').textContent='';
    document.getElementById('chatReportDialog').showModal();
  }

  async function submitChatReport(event){
    event.preventDefault();
    const id=otherUserId();
    if(!id||!session) return;
    const status=document.getElementById('chatReportStatus');
    try{
      const response=await fetch(`${API_URL}/api/reports`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.token}`},body:JSON.stringify({targetUserId:id,reason:document.getElementById('chatReportReason').value,details:document.getElementById('chatReportDetails').value.trim()})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error||'No se pudo enviar el reporte.');
      status.style.color='var(--success)';status.textContent='Reporte enviado a moderación.';
      setTimeout(()=>document.getElementById('chatReportDialog').close(),700);
    }catch(error){status.style.color='var(--danger)';status.textContent=error.message;}
  }

  function localYouthGuard(event){
    if(!youthBand()) return;
    const input=document.getElementById('chatInput');
    if(!input||!input.value) return;
    const sensitive=/(?:\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:instagram|insta|snapchat|snap|tiktok|telegram|whatsapp)\s*[:@]?\s*[A-Z0-9._-]{2,})/i.test(input.value);
    if(!sensitive) return;
    event.preventDefault();event.stopImmediatePropagation();
    const status=document.getElementById('chatStatus');
    if(status){status.style.color='var(--danger)';status.textContent='Por seguridad, no compartas teléfonos, correos ni contactos externos desde una cuenta juvenil.';}
  }

  document.addEventListener('click',event=>{
    if(event.target?.closest?.('.conversation-item')) setTimeout(refreshControls,0);
    if(event.target?.matches?.('.chat-panel .btn')&&/enviar/i.test(event.target.textContent||'')) localYouthGuard(event);
  },true);
  document.addEventListener('keydown',event=>{if(event.target?.id==='chatInput'&&event.key==='Enter') localYouthGuard(event);},true);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ensureUi); else ensureUi();
})();
