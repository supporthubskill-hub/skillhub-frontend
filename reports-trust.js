(() => {
  const API = window.API_BASE || 'https://skillhub-backend-b5iy.onrender.com';
  const token = () => localStorage.getItem('token') || localStorage.getItem('skillhub_token') || '';
  async function api(path, options={}) {
    const res = await fetch(API + path, { ...options, headers:{'Content-Type':'application/json', ...(token()?{Authorization:`Bearer ${token()}`}:{}) ,...(options.headers||{})} });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) throw Object.assign(new Error(data.error || 'No se pudo completar la acción.'), {status:res.status,data});
    return data;
  }
  const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const labels={open:'Pendiente',reviewing:'En revisión',resolved:'Resuelto',dismissed:'Descartado'};

  window.zeqviroReport = async ({targetUserId=null, serviceId=null, targetName='este contenido'}={}) => {
    if (!token()) return alert('Inicia sesión para enviar un reporte.');
    const reason = prompt(`Reportar ${targetName}\n\nMotivo:\n• Spam o engaño\n• Acoso o comportamiento inapropiado\n• Servicio engañoso\n• Fraude o actividad sospechosa\n• Otro\n\nEscribe el motivo:`);
    if (!reason) return;
    const details = prompt('Explica brevemente qué ocurrió (mínimo 8 caracteres).');
    if (!details) return;
    try {
      await api('/api/reports',{method:'POST',body:JSON.stringify({targetUserId,serviceId,reason,details})});
      alert('✓ Reporte enviado. El equipo de moderación podrá revisarlo.');
    } catch(e) { alert(e.message); }
  };

  function installReportButtons(){
    document.querySelectorAll('[data-service-id]').forEach(card=>{
      if(card.querySelector('.zeqviro-report-btn')) return;
      const id=Number(card.dataset.serviceId); if(!id) return;
      const b=document.createElement('button'); b.type='button'; b.className='zeqviro-report-btn'; b.textContent='⚑ Reportar';
      b.onclick=e=>{e.preventDefault();e.stopPropagation();window.zeqviroReport({serviceId:id,targetName:'este servicio'});};
      card.appendChild(b);
    });
  }

  async function installAdminReports(){
    if(!location.pathname.startsWith('/admin') || document.getElementById('zeqviroReportsAdmin')) return;
    const host=document.querySelector('main') || document.body;
    const section=document.createElement('section'); section.id='zeqviroReportsAdmin'; section.className='zeqviro-trust-panel';
    section.innerHTML='<h2>🛡️ Reportes y confianza</h2><p class="muted">Revisa reportes de usuarios y servicios. Las sanciones siguen siendo una decisión del Admin.</p><div class="trust-filters"><button data-rstatus="">Todos</button><button data-rstatus="open">Pendientes</button><button data-rstatus="reviewing">En revisión</button><button data-rstatus="resolved">Resueltos</button><button data-rstatus="dismissed">Descartados</button></div><div id="zeqviroReportsList">Cargando…</div>';
    host.appendChild(section);
    const load=async status=>{
      const list=section.querySelector('#zeqviroReportsList'); list.textContent='Cargando…';
      try{
        const d=await api('/api/admin/reports'+(status?`?status=${status}`:''));
        list.innerHTML=(d.reports||[]).map(r=>`<article class="trust-report"><div><strong>#${r.id} · ${escapeHtml(r.reason)}</strong><span class="trust-status trust-${r.status}">${labels[r.status]||r.status}</span></div><p>${escapeHtml(r.details)}</p><small>Reportó: ${escapeHtml(r.reporterName)} · Objetivo: ${escapeHtml(r.serviceName||r.targetUserName||'Contenido')}</small><div class="trust-actions"><button data-id="${r.id}" data-status="reviewing">Revisar</button><button data-id="${r.id}" data-status="resolved">Resolver</button><button data-id="${r.id}" data-status="dismissed">Descartar</button></div></article>`).join('') || '<p>No hay reportes en este estado.</p>';
        list.querySelectorAll('[data-id]').forEach(b=>b.onclick=async()=>{const note=prompt('Nota administrativa opcional:')||'';try{await api(`/api/admin/reports/${b.dataset.id}/status`,{method:'PATCH',body:JSON.stringify({status:b.dataset.status,note})});load(status);}catch(e){alert(e.message);}});
      }catch(e){list.innerHTML=`<p>${escapeHtml(e.message)}</p>`;}
    };
    section.querySelectorAll('[data-rstatus]').forEach(b=>b.onclick=()=>load(b.dataset.rstatus)); load('');
  }

  const originalFetch=window.fetch.bind(window);
  window.fetch=async (...args)=>{
    const res=await originalFetch(...args);
    try{
      const url=String(args[0]||'');
      if(url.includes('/api/auth/login') && res.status===403){
        const clone=res.clone(); const d=await clone.json();
        if(d.code==='ACCOUNT_SUSPENDED'){
          const until=d.suspendedUntil ? new Date(d.suspendedUntil).toLocaleString() : '';
          setTimeout(()=>alert(until?`Tu cuenta está suspendida hasta ${until}.`:'Tu cuenta está suspendida. Contacta al soporte de Zeqviro si necesitas ayuda.'),0);
        }
      }
    }catch(_){}
    return res;
  };
  const observer=new MutationObserver(()=>installReportButtons()); observer.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',()=>{installReportButtons();installAdminReports();});
  if(document.readyState!=='loading'){installReportButtons();installAdminReports();}
})();
