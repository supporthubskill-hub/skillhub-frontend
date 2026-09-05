(()=>{
  function youthLabel(value){
    return ({'14_15':'14–15 · protección juvenil','16_17':'16–17 · protección juvenil','18_plus':'18+','unknown':'Edad no clasificada'}[value]||value||'Edad no clasificada');
  }
  function isYouthBand(value){return value==='14_15'||value==='16_17';}
  function makeBadge(value){
    const badge=document.createElement('span');
    badge.className='admin-youth-badge';
    badge.textContent=youthLabel(value||'unknown');
    if(!isYouthBand(value)) badge.classList.add('admin-age-adult');
    return badge;
  }
  function ensureSummary(){
    if(document.getElementById('block5AdminSafety')) return;
    const main=document.querySelector('main');
    if(!main) return;
    const card=document.createElement('section');
    card.className='card';card.id='block5AdminSafety';
    card.innerHTML=`<h3>Seguridad y privacidad · Bloque 5</h3><p class="muted">Vista rápida de las protecciones activas durante la beta.</p><div class="admin-safety-summary"><div class="admin-safety-box"><strong>Edades juveniles</strong><span>14–15 y 16–17 reciben protecciones adicionales.</span></div><div class="admin-safety-box"><strong>Chat protegido</strong><span>Bloqueos, reportes y controles de contacto externo.</span></div><div class="admin-safety-box"><strong>Privacidad</strong><span>El Admin ve solo el grupo de edad necesario; la fecha de nacimiento no se muestra aquí.</span></div></div>`;
    const first=main.querySelector('.card');
    if(first) first.insertAdjacentElement('afterend',card); else main.prepend(card);
  }
  async function decorateUsersFromApi(){
    const host=document.getElementById('users');
    if(!host||typeof api!=='function') return;
    try{
      const q=encodeURIComponent(document.getElementById('userSearch')?.value.trim()||'');
      const account=encodeURIComponent(document.getElementById('userAccount')?.value||'all');
      const verification=encodeURIComponent(document.getElementById('userVerification')?.value||'all');
      const rows=await api('/api/admin/users?q='+q+'&account='+account+'&verification='+verification);
      const cards=[...host.querySelectorAll('.item')];
      cards.forEach((card,index)=>{
        const value=rows[index]?.ageBand||'unknown';
        const heading=card.querySelector('strong')||card;
        card.querySelector('.admin-youth-badge')?.remove();
        heading.appendChild(makeBadge(value));
        card.dataset.block5AgeBand=value;
      });
    }catch(_){/* El panel principal ya muestra su propio error si falla. */}
  }
  async function decorateOpenUserDetail(){
    const body=document.getElementById('userDetailBody');
    const dialog=document.getElementById('userDetailDialog');
    if(!body||!dialog?.open||typeof api!=='function') return;
    const id=Number(dialog.dataset.block5UserId||0);
    if(!id) return;
    try{
      const data=await api('/api/admin/users/'+id+'/details');
      const value=data?.user?.ageBand||'unknown';
      let box=body.querySelector('.block5-admin-age-box');
      if(!box){
        box=document.createElement('div');
        box.className='mini block5-admin-age-box';
        box.innerHTML='<strong>Grupo de edad</strong><div class="block5-admin-age-value"></div><div class="muted">La fecha exacta de nacimiento no se muestra en este panel.</div>';
        body.prepend(box);
      }
      const valueHost=box.querySelector('.block5-admin-age-value');
      valueHost.innerHTML='';valueHost.appendChild(makeBadge(value));
    }catch(_){/* Sin bloquear la vista administrativa existente. */}
  }
  function installHooks(){
    if(typeof window.loadUsers==='function'&&!window.loadUsers.block5Wrapped){
      const original=window.loadUsers;
      const wrapped=async function(...args){const result=await original.apply(this,args);await decorateUsersFromApi();return result;};
      wrapped.block5Wrapped=true;window.loadUsers=wrapped;
    }
    if(typeof window.openUserDetails==='function'&&!window.openUserDetails.block5Wrapped){
      const original=window.openUserDetails;
      const wrapped=async function(id,...args){
        const dialog=document.getElementById('userDetailDialog');if(dialog)dialog.dataset.block5UserId=String(id);
        const result=await original.call(this,id,...args);await decorateOpenUserDetail();return result;
      };
      wrapped.block5Wrapped=true;window.openUserDetails=wrapped;
    }
    document.getElementById('userFilterButton')?.addEventListener('click',()=>setTimeout(decorateUsersFromApi,0));
  }
  function run(){ensureSummary();installHooks();setTimeout(decorateUsersFromApi,0);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
