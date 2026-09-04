(()=>{
  function youthLabel(value){
    return ({'14_15':'14–15 · protección juvenil','16_17':'16–17 · protección juvenil','18_plus':'18+','unknown':'Edad no clasificada'}[value]||value||'Edad no clasificada');
  }
  function ensureSummary(){
    if(document.getElementById('block5AdminSafety')) return;
    const main=document.querySelector('main');
    if(!main) return;
    const card=document.createElement('section');
    card.className='card';card.id='block5AdminSafety';
    card.innerHTML=`<h3>Seguridad y privacidad · Bloque 5</h3><p class="muted">Vista rápida de las protecciones activas durante la beta.</p><div class="admin-safety-summary"><div class="admin-safety-box"><strong>Edades juveniles</strong><span>14–15 y 16–17 reciben protecciones adicionales.</span></div><div class="admin-safety-box"><strong>Chat protegido</strong><span>Bloqueos, reportes y controles de contacto externo.</span></div><div class="admin-safety-box"><strong>Privacidad</strong><span>La fecha de nacimiento no debe mostrarse públicamente.</span></div></div>`;
    const first=main.querySelector('.card');
    if(first) first.insertAdjacentElement('afterend',card); else main.prepend(card);
  }
  function decorateYouth(){
    document.querySelectorAll('#users .item,#userDetailBody').forEach(root=>{
      if(root.dataset.block5AgeDecorated) return;
      const text=root.textContent||'';
      const match=text.match(/\b(14_15|16_17|18_plus)\b/);
      if(!match) return;
      root.dataset.block5AgeDecorated='1';
      const badge=document.createElement('span');badge.className='admin-youth-badge';badge.textContent=youthLabel(match[1]);
      const heading=root.querySelector('strong,h3,h4')||root;heading.appendChild(badge);
    });
  }
  function run(){ensureSummary();decorateYouth();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
  new MutationObserver(()=>decorateYouth()).observe(document.documentElement,{childList:true,subtree:true});
})();
