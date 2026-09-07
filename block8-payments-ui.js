(()=>{
  'use strict';
  const API=()=>window.location.origin;
  const token=()=>window.session?.token||localStorage.getItem('token')||localStorage.getItem('skillhub_token')||'';
  const money=n=>new Intl.NumberFormat(undefined,{style:'currency',currency:'USD'}).format(Number(n||0));
  const authHeaders=()=>({Authorization:`Bearer ${token()}`,'Content-Type':'application/json'});
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let config=null;

  function notice(text,type='info'){
    let n=document.getElementById('zqPaymentNotice');
    if(!n){n=document.createElement('div');n.id='zqPaymentNotice';n.className='zq-payment-notice';document.body.appendChild(n);}
    n.dataset.type=type;n.textContent=text;n.hidden=false;clearTimeout(notice._t);notice._t=setTimeout(()=>n.hidden=true,5000);
  }

  async function loadConfig(){
    try{const r=await fetch(`${API()}/api/payments/config`);config=await r.json();return config;}catch{return null;}
  }

  function mount(){
    if(document.getElementById('zeqviroPaymentsPanel')) return;
    const host=document.getElementById('bookingsList')||document.getElementById('tab-publish')||document.getElementById('tab-profile');
    if(!host) return;
    const panel=document.createElement('section');
    panel.id='zeqviroPaymentsPanel'; panel.className='zq-payments-panel';
    panel.innerHTML=`<div class="zq-payments-head"><div><strong>Pagos de prueba</strong><small id="zqPaymentsMode">Stripe sandbox · no se cobrará dinero real</small></div><button type="button" id="zqReloadPayments" aria-label="Actualizar pagos">↻</button></div><div id="zqPaymentsBody"><p class="zq-payments-muted">Inicia sesión para ver pagos de tus reservas.</p></div>`;
    host.prepend(panel);
    panel.querySelector('#zqReloadPayments').addEventListener('click',load);
    load();
  }

  async function load(){
    const body=document.getElementById('zqPaymentsBody'); if(!body) return;
    const cfg=await loadConfig();
    const mode=document.getElementById('zqPaymentsMode');
    if(mode&&cfg) mode.textContent=cfg.checkoutReady?'Stripe conectado · modo de prueba':'Modo de prueba · checkout pendiente de configurar';
    if(!token()){body.innerHTML='<p class="zq-payments-muted">Inicia sesión para ver pagos de tus reservas.</p>';return;}
    body.innerHTML='<p class="zq-payments-muted">Actualizando pagos…</p>';
    try{
      const r=await fetch(`${API()}/api/bookings`,{headers:{Authorization:`Bearer ${token()}`}});
      if(!r.ok) throw new Error('No se pudieron cargar las reservas');
      const data=await r.json(); const bookings=Array.isArray(data)?data:(data.bookings||[]);
      if(!bookings.length){body.innerHTML='<p class="zq-payments-muted">Todavía no tienes reservas con pagos.</p>';return;}
      body.innerHTML=bookings.slice(0,20).map(b=>card(b)).join('');
      body.querySelectorAll('[data-pay-booking]').forEach(btn=>btn.addEventListener('click',()=>checkout(btn.dataset.payBooking,btn)));
      body.querySelectorAll('[data-payment-status]').forEach(btn=>btn.addEventListener('click',()=>status(btn.dataset.paymentStatus,btn)));
      body.querySelectorAll('[data-payment-receipt]').forEach(btn=>btn.addEventListener('click',()=>receipt(btn.dataset.paymentReceipt,btn)));
      body.querySelectorAll('[data-payment-refund]').forEach(btn=>btn.addEventListener('click',()=>refundTest(btn.dataset.paymentRefund,btn)));
    }catch(e){body.innerHTML=`<p class="zq-payments-error">${esc(e.message)}</p>`;}
  }

  function isClientBooking(b){
    if(b.perspective==='client'||b.clientPerspective===true) return true;
    if(b.perspective==='provider'||b.providerPerspective===true) return false;
    const role=String(b.role||b.viewerRole||b.bookingRole||'').toLowerCase();
    if(role==='client'||role==='customer') return true;
    if(role==='provider'||role==='seller') return false;
    const note=String(b.perspectiveLabel||b.relationship||b.direction||'').toLowerCase();
    if(note.includes('tu solicitud')||note.includes('your request')||note.includes('client')) return true;
    return true;
  }

  function card(b){
    const id=b.id||b.bookingId; const total=b.total??b.amount??b.agreedPrice??b.agreed_price??b.price??0; const st=b.paymentStatus||b.payment_status||'not_started';
    const client=isClientBooking(b);
    const bookingStatus=String(b.status||'').toLowerCase();
    const canPay=client&&['pending','confirmed','accepted'].includes(bookingStatus)&&!['paid','refunded'].includes(st);
    const canRefund=client&&st==='paid';
    return `<article class="zq-payment-card"><div><strong>${esc(b.serviceName||b.service_name||`Reserva #${id}`)}</strong><small>${money(total)} · ${esc(label(st))}</small></div><div class="zq-payment-actions">${canPay?`<button type="button" data-pay-booking="${esc(id)}">Pagar con Stripe · PRUEBA</button>`:''}<button type="button" class="secondary" data-payment-status="${esc(id)}">Estado</button>${['paid','refunded'].includes(st)?`<button type="button" class="secondary" data-payment-receipt="${esc(id)}">Comprobante</button>`:''}${canRefund?`<button type="button" class="secondary" data-payment-refund="${esc(id)}">Reembolso · prueba</button>`:''}</div></article>`;
  }
  function label(s){return ({not_started:'Sin iniciar',requires_payment:'Pendiente de pago',processing:'Procesando',paid:'Pagado',refunded:'Reembolsado',failed:'Fallido',cancelled:'Cancelado'})[s]||s;}

  async function checkout(id,btn){
    btn.disabled=true; const old=btn.textContent; btn.textContent='Preparando…';
    try{
      let r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}/prepare`,{method:'POST',headers:authHeaders(),body:'{}'});
      let d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'No se pudo preparar el pago');
      r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}/checkout-session`,{method:'POST',headers:authHeaders(),body:'{}'});
      d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'Checkout de prueba todavía no está configurado');
      if(d.checkoutUrl){location.assign(d.checkoutUrl);return;}
      throw new Error('El checkout no devolvió una dirección válida');
    }catch(e){notice(e.message,'error'); btn.disabled=false; btn.textContent=old;}
  }

  async function status(id,btn){btn.disabled=true;try{const r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${token()}`}});const d=await r.json();if(!r.ok)throw new Error(d.error||'No se pudo consultar');const p=d.payment;notice(`Estado: ${label(p?.status||d.paymentStatus||'not_started')}${p?` · Total ${money(p.grossAmount)} · Comisión ${money(p.platformFee)}`:''}`);}catch(e){notice(e.message,'error');}finally{btn.disabled=false;}}
  async function receipt(id,btn){btn.disabled=true;try{const r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}/receipt`,{headers:{Authorization:`Bearer ${token()}`}});const d=await r.json();if(!r.ok)throw new Error(d.error||'No se pudo cargar el comprobante');alert(`Comprobante de prueba\n${d.serviceName||`Reserva #${id}`}\nEstado: ${label(d.status)}\nTotal: ${money(d.total)}\nComisión Zeqviro: ${money(d.platformFee)}\nProveedor: ${money(d.providerAmount)}`);}catch(e){notice(e.message,'error');}finally{btn.disabled=false;}}
  async function refundTest(id,btn){if(!confirm('¿Confirmas el reembolso de PRUEBA? No afecta dinero real.')) return;btn.disabled=true;const old=btn.textContent;btn.textContent='Reembolsando…';try{const r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}/refund-test`,{method:'POST',headers:authHeaders(),body:JSON.stringify({confirm:true})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'No se pudo reembolsar');notice('Reembolso de prueba procesado.');await load();}catch(e){notice(e.message,'error');btn.disabled=false;btn.textContent=old;}}

  async function handleReturn(attempt=0){const q=new URLSearchParams(location.search);const state=q.get('payment');const sessionId=q.get('session_id');if(!state)return;if(state==='cancelled'){notice('Pago de prueba cancelado.');cleanPaymentQuery();return;}if(state!=='success'||!sessionId)return;if(!token()&&attempt<12){setTimeout(()=>handleReturn(attempt+1),500);return;}if(!token()){notice('Inicia sesión para confirmar el estado del pago.','error');return;}try{const r=await fetch(`${API()}/api/payments/stripe/confirm-session`,{method:'POST',headers:authHeaders(),body:JSON.stringify({sessionId})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'No se pudo confirmar el pago');notice(d.paid?'Pago de prueba confirmado.':'El pago sigue procesándose.');cleanPaymentQuery();await load();}catch(e){notice(e.message,'error');}}
  function cleanPaymentQuery(){const u=new URL(location.href);u.searchParams.delete('payment');u.searchParams.delete('session_id');history.replaceState({},'',u.pathname+u.search+u.hash);}

  window.addEventListener('zeqviro:refreshed',load);window.addEventListener('storage',load);
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(mount,500);setTimeout(()=>handleReturn(),900);});
  setTimeout(mount,1200);setTimeout(()=>handleReturn(),1600);
  window.ZeqviroPaymentsUI={load,mount,handleReturn};
})();