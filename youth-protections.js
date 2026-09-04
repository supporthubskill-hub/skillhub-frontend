(()=>{
  const YOUTH_BANDS=new Set(['14_15','16_17']);

  function getSession(){
    try{return JSON.parse(sessionStorage.getItem('skillhubSession')||'null');}catch{return null;}
  }

  function isYouth(){return YOUTH_BANDS.has(getSession()?.user?.ageBand||'');}

  function ensureBanner(){
    let banner=document.getElementById('youthProtectionBanner');
    if(!isYouth()){
      banner?.remove();
      return;
    }
    if(banner) return;
    banner=document.createElement('div');
    banner.id='youthProtectionBanner';
    banner.className='youth-protection-banner';
    banner.setAttribute('role','status');
    banner.innerHTML='<strong>🛡️ Protecciones juveniles activas</strong><span>Durante la beta, tu cuenta usa servicios remotos y protege información de ubicación en el perfil público.</span>';
    const target=document.querySelector('#tab-profile .card, #tab-dashboard .card, main, section.tab-content');
    target?.prepend(banner);
  }

  function lockServiceToRemote(){
    const select=document.getElementById('serviceType');
    const area=document.getElementById('serviceArea');
    if(!select) return;
    if(isYouth()){
      select.value='Remoto';
      select.dataset.youthLocked='1';
      const presencial=[...select.options].find(option=>option.value==='Presencial');
      if(presencial) presencial.disabled=true;
      if(area){
        area.value='Remoto';
        area.dataset.youthLocked='1';
        area.placeholder='La ubicación pública está protegida durante la beta';
      }
    }else{
      const presencial=[...select.options].find(option=>option.value==='Presencial');
      if(presencial) presencial.disabled=false;
      delete select.dataset.youthLocked;
      if(area) delete area.dataset.youthLocked;
    }
  }

  function enforceYouthFields(event){
    if(!isYouth()) return;
    if(event.target?.id==='serviceType' && event.target.value!=='Remoto') event.target.value='Remoto';
    if(event.target?.id==='serviceArea' && event.target.value!=='Remoto') event.target.value='Remoto';
  }

  function addProfilePrivacyNote(){
    const profileForm=document.getElementById('profilePageForm');
    if(!profileForm||!isYouth()||document.getElementById('youthProfilePrivacyNote')) return;
    const note=document.createElement('div');
    note.id='youthProfilePrivacyNote';
    note.className='youth-profile-note';
    note.innerHTML='<strong>Privacidad juvenil:</strong> Zeqviro no mostrará públicamente tu ubicación ni enlace de portafolio mientras estas protecciones estén activas.';
    const progress=profileForm.querySelector('.profile-progress-card');
    if(progress) progress.insertAdjacentElement('afterend',note); else profileForm.prepend(note);
  }

  function refresh(){
    ensureBanner();
    lockServiceToRemote();
    addProfilePrivacyNote();
  }

  document.addEventListener('change',enforceYouthFields,true);
  document.addEventListener('click',()=>setTimeout(refresh,0),true);
  window.addEventListener('storage',refresh);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',refresh); else refresh();
  setInterval(refresh,2000);
})();
