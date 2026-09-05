(()=>{
  let reviewRows=[];
  const currentSession=()=>typeof session!=='undefined'?session:null;
  const apiBase=()=>typeof API_URL!=='undefined'?API_URL:'';
  const lang=()=>window.ZeqviroI18n?.language||localStorage.getItem('zeqviroLanguage')||'es';
  const copy={
    es:{title:'⭐ Reseñas verificadas',intro:'Solo puedes reseñar reservas realmente completadas en Zeqviro. Cada reseña publicada queda marcada como verificada.',select:'Reservación completada',choose:'Selecciona una reservación',none:'No tienes reservas completadas pendientes de reseña.',rated:'Ya reseñada',verified:'✓ Reserva verificada',publish:'Publicar reseña verificada',published:'Reseña verificada publicada.',history:'Tus reseñas',empty:'Todavía no has publicado reseñas.',stars:'estrellas'},
    en:{title:'⭐ Verified reviews',intro:'You can only review bookings actually completed on Zeqviro. Every published review is marked as verified.',select:'Completed booking',choose:'Select a booking',none:'You have no completed bookings waiting for a review.',rated:'Already reviewed',verified:'✓ Verified booking',publish:'Publish verified review',published:'Verified review published.',history:'Your reviews',empty:'You have not published any reviews yet.',stars:'stars'},
    pt:{title:'⭐ Avaliações verificadas',intro:'Você só pode avaliar reservas realmente concluídas na Zeqviro. Toda avaliação publicada fica marcada como verificada.',select:'Reserva concluída',choose:'Selecione uma reserva',none:'Você não tem reservas concluídas aguardando avaliação.',rated:'Já avaliada',verified:'✓ Reserva verificada',publish:'Publicar avaliação verificada',published:'Avaliação verificada publicada.',history:'Suas avaliações',empty:'Você ainda não publicou avaliações.',stars:'estrelas'},
    fr:{title:'⭐ Avis vérifiés',intro:'Vous ne pouvez évaluer que les réservations réellement terminées sur Zeqviro. Chaque avis publié est marqué comme vérifié.',select:'Réservation terminée',choose:'Sélectionnez une réservation',none:'Aucune réservation terminée n’attend un avis.',rated:'Déjà évaluée',verified:'✓ Réservation vérifiée',publish:'Publier un avis vérifié',published:'Avis vérifié publié.',history:'Vos avis',empty:'Vous n’avez encore publié aucun avis.',stars:'étoiles'},
    zh:{title:'⭐ 已验证评价',intro:'只有在 Zeqviro 上真正完成的预订才能评价。每条发布的评价都会标记为已验证。',select:'已完成预订',choose:'选择一个预订',none:'没有等待评价的已完成预订。',rated:'已评价',verified:'✓ 已验证预订',publish:'发布已验证评价',published:'已发布已验证评价。',history:'你的评价',empty:'你还没有发布评价。',stars:'星'}
  };
  const c=()=>copy[lang()]||copy.es;
  const esc=value=>typeof escapeHtml==='function'?escapeHtml(String(value||'')):String(value||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmt=value=>{try{return new Date(value).toLocaleDateString(window.ZeqviroI18n?.locale||'es-US',{year:'numeric',month:'short',day:'numeric'});}catch{return '';}};

  function ensureLayout(){
    const tab=document.getElementById('tab-reviews');
    if(!tab||document.getElementById('block6VerifiedReviewIntro'))return;
    const card=tab.querySelector('.card');
    if(!card)return;
    card.classList.add('block6-review-card');
    const heading=card.querySelector('h3');if(heading)heading.textContent=c().title;
    const intro=card.querySelector('.service-meta');if(intro){intro.id='block6VerifiedReviewIntro';intro.textContent=c().intro;}
    const label=document.querySelector('label[for="reviewBooking"]');if(label)label.textContent=c().select;
    const submit=card.querySelector('form button[type="submit"]');if(submit)submit.textContent=c().publish;
    if(!document.getElementById('block6ReviewHistory')){
      const section=document.createElement('div');section.id='block6ReviewHistory';section.className='block6-review-history';
      section.innerHTML=`<h4>${esc(c().history)}</h4><div id="block6ReviewHistoryList"></div>`;
      card.appendChild(section);
    }
  }

  function renderHistory(){
    ensureLayout();
    const list=document.getElementById('block6ReviewHistoryList');if(!list)return;
    const reviewed=reviewRows.filter(r=>r.reviewId);
    list.innerHTML=reviewed.length?reviewed.map(r=>`<article class="block6-my-review"><div class="block6-my-review-head"><div><strong>${esc(r.serviceName)}</strong><span>${esc(r.providerName||'')}</span></div><span class="block6-verified-badge">${esc(c().verified)}</span></div><div class="block6-review-stars">${'★'.repeat(Number(r.rating)||0)}${'☆'.repeat(Math.max(0,5-(Number(r.rating)||0)))}</div><p data-user-content>${esc(r.comment||'')}</p><small>${fmt(r.bookingDate)}</small></article>`).join(''):`<p class="service-meta">${esc(c().empty)}</p>`;
  }

  window.loadReviewOptions=async function(){
    ensureLayout();
    const select=document.getElementById('reviewBooking');if(!select)return;
    select.innerHTML=`<option value="">${esc(c().choose)}</option>`;
    if(!currentSession()?.token||currentSession()?.user?.role!=='user'){reviewRows=[];renderHistory();return;}
    try{
      const response=await fetch(`${apiBase()}/api/reviews/me`,{headers:{Authorization:`Bearer ${currentSession().token}`}});
      const rows=await response.json().catch(()=>[]);if(!response.ok)throw new Error();
      reviewRows=Array.isArray(rows)?rows:[];
      const eligible=reviewRows.filter(r=>r.canReview);
      eligible.forEach(r=>select.add(new Option(`${r.serviceName} · ${fmt(r.bookingDate)} · ${c().verified}`,r.bookingId)));
      if(!eligible.length)select.add(new Option(c().none,''));
      renderHistory();
    }catch{reviewRows=[];renderHistory();}
  };

  window.submitReview=async function(event){
    event.preventDefault();
    const status=document.getElementById('reviewStatus');
    const bookingId=Number(document.getElementById('reviewBooking')?.value);
    const rating=Number(document.getElementById('reviewRating')?.value);
    const comment=document.getElementById('reviewText')?.value||'';
    if(!bookingId){if(status)status.textContent=c().none;return;}
    try{
      const response=await fetch(`${apiBase()}/api/reviews`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${currentSession().token}`},body:JSON.stringify({bookingId,rating,comment})});
      const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'No se pudo publicar');
      if(status){status.style.color='var(--success)';status.textContent=c().published;}
      event.target.reset();await window.loadReviewOptions();
      if(typeof fetchServicesFromAPI==='function')await fetchServicesFromAPI();
    }catch(error){if(status){status.style.color='var(--danger)';status.textContent=error.message;}}
  };

  function refreshLanguage(){
    const intro=document.getElementById('block6VerifiedReviewIntro');if(intro)intro.textContent=c().intro;
    const tab=document.getElementById('tab-reviews');const heading=tab?.querySelector('h3');if(heading)heading.textContent=c().title;
    const label=document.querySelector('label[for="reviewBooking"]');if(label)label.textContent=c().select;
    const submit=tab?.querySelector('form button[type="submit"]');if(submit)submit.textContent=c().publish;
    const history=document.querySelector('#block6ReviewHistory h4');if(history)history.textContent=c().history;
    renderHistory();
  }

  function boot(){ensureLayout();document.addEventListener('change',event=>{if(event.target?.id==='zeqviroLanguageSelect')setTimeout(refreshLanguage,0);});}
  window.ZeqviroVerifiedReviews={refresh:window.loadReviewOptions};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
