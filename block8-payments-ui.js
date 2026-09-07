(()=>{
  'use strict';
  const API=()=>window.location.origin;
  const token=()=>window.session?.token||localStorage.getItem('token')||localStorage.getItem('skillhub_token')||'';
  const money=n=>new Intl.NumberFormat(undefined,{style:'currency',currency:'USD'}).format(Number(n||0));
  const authHeaders=()=>({Authorization:`Bearer ${token()}`,'Content-Type':'application/json'});
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function mount(){
    if(document.getElementById('zeqviroPaymentsPanel')) return;
    const host=document.getElementById('bookingsList')||document.getElementById('tab-publish')||document.getElementById('tab-profile');
    if(!host) return;
    const panel=document.createElement('section');
    panel.id='zeqviroPaymentsPanel'; panel.className='zq-payments-panel';
    panel.innerHTML=`<div class="zq-payments-head"><div><strong>Pagos</strong><small>Modo de prueba · no se cobrará dinero real</small></div><button type="button" id="zqReloadPayments" aria-label="Actualizar pagos">↻</button></div><div id="zqPaymentsBody"><p class="zq-payments-muted">Inicia sesión para ver pagos de tus reservas.</p></div>`;
    host.prepend(panel);
    panel.querySelector('#zqReloadPayments').addEventListener('click',load);
    load();
  }

  async function load(){
    const body=document.getElementById('zqPaymentsBody'); if(!body) return;
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
    }catch(e){body.innerHTML=`<p class="zq-payments-error">${esc(e.message)}</p>`;}
  }

  function card(b){
    const id=b.id||b.bookingId; const total=b.total??b.amount??0; const st=b.paymentStatus||b.payment_status||'not_started';
    const canPay=['pending','confirmed'].includes(b.status)&&!['paid','refunded'].includes(st);
    return `<article class="zq-payment-card"><div><strong>${esc(b.serviceName||b.service_name||`Reserva #${id}`)}</strong><small>${money(total)} · ${esc(label(st))}</small></div><div class="zq-payment-actions">${canPay?`<button type="button" data-pay-booking="${esc(id)}">Pagar · prueba</button>`:''}<button type="button" class="secondary" data-payment-status="${esc(id)}">Estado</button></div></article>`;
  }
  function label(s){return ({not_started:'Sin iniciar',requires_payment:'Pendiente de pago',processing:'Procesando',paid:'Pagado',refunded:'Reembolsado',failed:'Fallido',cancelled:'Cancelado'})[s]||s;}

  async function checkout(id,btn){
    btn.disabled=true; const old=btn.textContent; btn.textContent='Preparando…';
    try{
      let r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}/prepare`,{method:'POST',headers:authHeaders(),body:'{}'});
      let d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'No se pudo preparar el pago');
      r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}/checkout`,{method:'POST',headers:authHeaders(),body:JSON.stringify({returnUrl:location.origin+location.pathname})});
      d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'Checkout de prueba todavía no está configurado');
      if(d.url){location.assign(d.url);return;}
      throw new Error('El checkout no devolvió una dirección válida');
    }catch(e){alert(e.message); btn.disabled=false; btn.textContent=old;}
  }
  async function status(id,btn){
    btn.disabled=true;
    try{const r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${token()}`}});const d=await r.json();if(!r.ok)throw new Error(d.error||'No se pudo consultar');alert(`Estado: ${label(d.payment?.status||d.paymentStatus||'not_started')}${d.payment?`\nTotal: ${money(d.payment.grossAmount)}\nComisión Zeqviro: ${money(d.payment.platformFee)}\nProveedor: ${money(d.payment.providerAmount)}`:''}`);}catch(e){alert(e.message);}finally{btn.disabled=false;}
  }
  window.addEventListener('zeqviro:refreshed',load);
  window.addEventListener('storage',load);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,500));
  setTimeout(mount,1200);
  window.ZeqviroPaymentsUI={load,mount};
})();