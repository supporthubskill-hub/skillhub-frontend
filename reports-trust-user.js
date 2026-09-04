(() => {
  function addUserReportButtons(){
    document.querySelectorAll('[data-user-id],[data-provider-id]').forEach(el=>{
      if(el.querySelector?.('.zeqviro-user-report-btn')) return;
      const id=Number(el.dataset.userId||el.dataset.providerId); if(!id||!window.zeqviroReport) return;
      if(!el.matches('.profile-card,.provider-card,[data-profile-card]')) return;
      const b=document.createElement('button'); b.type='button'; b.className='zeqviro-report-btn zeqviro-user-report-btn'; b.textContent='⚑ Reportar usuario';
      b.onclick=e=>{e.preventDefault();e.stopPropagation();window.zeqviroReport({targetUserId:id,targetName:'este usuario'});}; el.appendChild(b);
    });
  }
  new MutationObserver(addUserReportButtons).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',addUserReportButtons); if(document.readyState!=='loading')addUserReportButtons();
})();
