(()=>{
  'use strict';
  const API=()=>window.location.origin;
  const token=()=>window.session?.token||localStorage.getItem('token')||localStorage.getItem('skillhub_token')||'';
  const authHeaders=()=>({Authorization:`Bearer ${token()}`,'Content-Type':'application/json'});
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=n=>new Intl.NumberFormat(undefined,{style:'currency',currency:'USD'}).format(Number(n||0));
  let rows=[];

  function notice(text,type='info'){let n=document.getElementById('zqPaymentNotice');if(!n){n=document.createElement('div');n.id='zqPaymentNotice';n.className='zq-payment-notice';document.body.appendChild(n);}n.dataset.type=type;n.textContent=text;n.hidden=false;clearTimeout(notice._t);notice._t=setTimeout(()=>n.hidden=true,5000);}
  function label(s){return ({not_started:'Sin iniciar',requires_payment:'Pendiente de pago',processing:'Procesando',paid:'Pagado',refunded:'Reembolsado',failed:'Fallido',cancelled:'Cancelado'})[s]||s;}

  async function fetchBookings(){
    if(!token()){rows=[];return rows;}
    const r=await fetch(`${API()}/api/bookings/me`,{headers:{Authorization:`Bearer ${token()}`}});
    const d=await r.json().catch(()=>[]);if(!r.ok)throw new Error(d.error||'No se pudieron cargar las reservas');rows=Array.isArray(d)?d:(d.bookings||[]);return rows;
  }

  function isClient(b){if(b.requestedByMe===true||b.isClient===true||b.clientPerspective===true||b.perspective==='client')return true;if(b.requestedByMe===false||b.isProvider===true||b.providerPerspective===true||b.perspective==='provider')return false;return true;}

  function decorate(){
    document.querySelectorAll('#bookingsList .booking-request-card').forEach(card=>{
      card.querySelector('.zq-inline-payment')?.remove();
      const id=Number(card.dataset.bookingId);const b=rows.find(x=>Number(x.id)===id);if(!b||!isClient(b)||String(b.status).toLowerCase()!=='confirmed')return;
      const st=b.paymentStatus||b.payment_status||'not_started';
      const box=document.createElement('div');box.className='zq-inline-payment';
      if(st==='paid') box.innerHTML=`<button type="button" class="btn btn-secondary" data-payment-status="${id}">✓ Pago de prueba confirmado · Ver estado</button>`;
      else if(st==='refunded') box.innerHTML=`<button type="button" class="btn btn-secondary" data-payment-status="${id}">Reembolso de prueba · Ver estado</button>`;
      else box.innerHTML=`<button type="button" class="btn" data-pay-booking="${id}">💳 Pagar con Stripe · PRUEBA</button><small>Sandbox de Stripe · no se cobrará dinero real.</small>`;
      const reschedule=card.querySelector('.block6-reschedule-box');if(reschedule)card.insertBefore(box,reschedule);else card.appendChild(box);
      box.querySelector('[data-pay-booking]')?.addEventListener('click',e=>checkout(id,e.currentTarget));
      box.querySelector('[data-payment-status]')?.addEventListener('click',e=>status(id,e.currentTarget));
    });
  }

  async function refresh(){try{await fetchBookings();decorate();}catch(e){console.warn('Block 8 payments',e.message);}}

  async function checkout(id,btn){btn.disabled=true;const old=btn.textContent;btn.textContent='Preparando pago de prueba…';try{let r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}/prepare`,{method:'POST',headers:authHeaders(),body:'{}'});let d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'No se pudo preparar el pago');r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}/checkout-session`,{method:'POST',headers:authHeaders(),body:'{}'});d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Checkout de prueba todavía no está configurado');if(d.checkoutUrl){location.assign(d.checkoutUrl);return;}throw new Error('Stripe no devolvió una dirección de checkout');}catch(e){notice(e.message,'error');btn.disabled=false;btn.textContent=old;}}

  async function status(id,btn){btn.disabled=true;try{const r=await fetch(`${API()}/api/payments/bookings/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${token()}`}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'No se pudo consultar');const p=d.payment;notice(`Estado: ${label(p?.status||d.paymentStatus||'not_started')}${p?` · Total ${money(p.grossAmount)} · Comisión ${money(p.platformFee)}`:''}`);}catch(e){notice(e.message,'error');}finally{btn.disabled=false;}}

  async function handleReturn(attempt=0){const q=new URLSearchParams(location.search);const state=q.get('payment'),sessionId=q.get('session_id');if(!state)return;if(state==='cancelled'){notice('Pago de prueba cancelado.');clean();return;}if(state!=='success'||!sessionId)return;if(!token()&&attempt<12){setTimeout(()=>handleReturn(attempt+1),500);return;}if(!token()){notice('Inicia sesión para confirmar el pago de prueba.','error');return;}try{const r=await fetch(`${API()}/api/payments/stripe/confirm-session`,{method:'POST',headers:authHeaders(),body:JSON.stringify({sessionId})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'No se pudo confirmar el pago');notice(d.paid?'Pago de prueba confirmado.':'El pago sigue procesándose.');clean();await refresh();}catch(e){notice(e.message,'error');}}
  function clean(){const u=new URL(location.href);u.searchParams.delete('payment');u.searchParams.delete('session_id');history.replaceState({},'',u.pathname+u.search+u.hash);}

  const observer=new MutationObserver(()=>{if(document.querySelector('#bookingsList .booking-request-card')){clearTimeout(observer._t);observer._t=setTimeout(()=>{if(rows.length)decorate();else refresh();},150);}});
  document.addEventListener('DOMContentLoaded',()=>{observer.observe(document.body,{childList:true,subtree:true});setTimeout(refresh,900);setTimeout(()=>handleReturn(),1100);});
  setTimeout(()=>{if(document.body&&!observer._started){observer._started=true;observer.observe(document.body,{childList:true,subtree:true});}refresh();},1600);
  window.addEventListener('zeqviro:refreshed',refresh);window.addEventListener('storage',refresh);
  window.ZeqviroPaymentsUI={load:refresh,mount:refresh,handleReturn};
})();