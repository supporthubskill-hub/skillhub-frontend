(()=>{
  const safe=(value)=>typeof escapeHtml==='function'?escapeHtml(value):String(value??'');
  const chips=(value)=>String(value||'').split(',').map(x=>x.trim()).filter(Boolean).map(x=>`<span class="b6-chip">${safe(x)}</span>`).join('');
  const fmtMember=(value)=>{if(!value)return '—';try{return new Date(value).toLocaleDateString(window.ZeqviroI18n?.locale||'es-US',{year:'numeric',month:'short'});}catch{return '—';}};

  window.openProviderProfile=async function(id){
    const dialog=document.getElementById('providerProfileDialog');
    const content=document.getElementById('providerProfileContent');
    if(!dialog||!content)return;
    content.innerHTML='<div class="chat-empty">Cargando perfil…</div>';
    dialog.showModal();
    try{
      const response=await fetch(`${API_URL}/api/providers/${id}`);
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.error||'No se pudo cargar el perfil');
      const p=data.profile||{};
      const services=Array.isArray(data.services)?data.services:[];
      const reviews=Array.isArray(data.reviews)?data.reviews:[];
      const completionValues=[p.headline,p.bio,p.skills,p.experience,p.languages,p.location,p.portfolioUrl,p.avatarUrl,p.remoteAvailable?'yes':''];
      const completion=Math.min(100,10+(completionValues.filter(v=>String(v||'').trim()).length*10));
      const avatar=p.avatarUrl?`<img class="b6-profile-avatar" src="${safe(p.avatarUrl)}" alt="Foto de perfil de ${safe(p.name||'proveedor')}">`:'<div class="b6-profile-avatar" aria-hidden="true">👤</div>';
      const trust=[
        p.emailVerified?'<span class="b6-trust-chip verified">✓ Correo verificado</span>':'',
        p.identityStatus==='verified'?'<span class="b6-trust-chip verified">✓ Identidad verificada</span>':'',
        `<span class="b6-trust-chip">⭐ ${Number(p.rating||0).toFixed(1)} · ${Number(p.reviewCount||0)} reseñas</span>`,
        `<span class="b6-trust-chip">📋 Perfil ${completion}%</span>`,
        p.remoteAvailable?'<span class="b6-trust-chip">💻 Remoto</span>':'',
        p.location?`<span class="b6-trust-chip">📍 ${safe(p.location)}</span>`:''
      ].filter(Boolean).join('');
      const serviceCards=services.length?services.map(s=>`<article class="b6-service-card"><h4>${safe(s.name)}</h4><div class="b6-service-meta">${safe(s.cat||'Servicio')} · ${safe(s.type||'Remoto')} · ${safe(s.area||'Remoto')}</div><p class="b6-profile-copy">${safe(s.desc||'')}</p><div class="b6-service-price">$${Number(s.price||0).toFixed(2)} USD${Number(s.hourly||0)>0?` · $${Number(s.hourly).toFixed(2)}/hr`:''}</div><div class="${s.hasAvailability?'b6-service-ready':'b6-service-wait'}">${s.hasAvailability?'● Horarios disponibles':'Sin horarios disponibles por ahora'}</div><button class="btn btn-secondary" type="button" style="margin-top:10px" onclick="providerProfileDialog.close();openServiceDialog(${Number(s.id)})">Ver servicio</button></article>`).join(''):'<p class="service-meta">No tiene servicios públicos en este momento.</p>';
      const reviewCards=reviews.length?reviews.map(r=>`<article class="b6-review"><strong>⭐ ${Number(r.rating||0).toFixed(1)} · ${safe(r.reviewerName||'Cliente')}</strong><div class="b6-service-meta">${safe(r.serviceName||'Servicio')} · ${new Date(r.createdAt).toLocaleDateString(window.ZeqviroI18n?.locale||'es-US')}</div><p class="b6-profile-copy">${safe(r.comment||'')}</p></article>`).join(''):'<p class="service-meta">Aún no tiene reseñas verificadas.</p>';
      content.innerHTML=`<div class="b6-profile-hero">${avatar}<div><h2 class="b6-profile-title">${safe(p.name||'Proveedor de Zeqviro')}</h2><p class="b6-profile-headline">${safe(p.headline||'Proveedor de servicios en Zeqviro')}</p><div class="b6-profile-trust">${trust}</div>${p.youthPrivacy?'<div class="b6-youth-note">Este perfil usa protecciones juveniles. La ubicación y el portafolio público están ocultos durante la beta.</div>':''}</div></div><div class="b6-profile-stats"><div class="b6-profile-stat"><strong>${Number(p.completedJobs||0)}</strong><span>trabajos completados</span></div><div class="b6-profile-stat"><strong>${Number(p.reviewCount||0)}</strong><span>reseñas</span></div><div class="b6-profile-stat"><strong>${fmtMember(p.memberSince)}</strong><span>miembro desde</span></div></div><section class="b6-profile-section"><h3>Sobre mí</h3><p class="b6-profile-copy">${safe(p.bio||'Este proveedor todavía no ha añadido una biografía.')}</p>${p.portfolioUrl?`<a class="btn btn-secondary" href="${safe(p.portfolioUrl)}" target="_blank" rel="noopener noreferrer">🔗 Ver portafolio</a>`:''}</section>${p.skills?`<section class="b6-profile-section"><h3>Habilidades</h3><div class="b6-chip-list">${chips(p.skills)}</div></section>`:''}${p.experience?`<section class="b6-profile-section"><h3>Experiencia</h3><p class="b6-profile-copy">${safe(p.experience)}</p></section>`:''}${p.languages?`<section class="b6-profile-section"><h3>Idiomas</h3><div class="b6-chip-list">${chips(p.languages)}</div></section>`:''}<section class="b6-profile-section"><h3>Servicios publicados</h3><div class="b6-profile-services">${serviceCards}</div></section><section class="b6-profile-section"><h3>Reseñas verificadas</h3><div class="b6-review-grid">${reviewCards}</div></section>`;
    }catch(error){content.innerHTML=`<div class="chat-empty">${safe(error.message)}</div>`;}
  };

  function addPreviewButton(){
    const form=document.getElementById('profilePageForm');
    if(!form||document.getElementById('b6ProfilePreviewButton'))return;
    const btn=document.createElement('button');
    btn.id='b6ProfilePreviewButton';
    btn.className='btn btn-secondary b6-profile-preview-btn';
    btn.type='button';
    btn.textContent='👁️ Ver mi perfil público';
    btn.addEventListener('click',()=>{if(session?.user?.id)window.openProviderProfile(session.user.id);});
    const status=document.getElementById('profilePageStatus');
    if(status)status.insertAdjacentElement('beforebegin',btn);else form.appendChild(btn);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addPreviewButton);else addPreviewButton();
  new MutationObserver(addPreviewButton).observe(document.documentElement,{childList:true,subtree:true});
})();
