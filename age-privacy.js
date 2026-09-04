(()=>{
  const MIN_BETA_AGE=14;
  const DAY=24*60*60*1000;

  function calculateAge(value){
    if(!value) return null;
    const birth=new Date(`${value}T00:00:00`);
    if(Number.isNaN(birth.getTime())) return null;
    const now=new Date();
    let age=now.getFullYear()-birth.getFullYear();
    const month=now.getMonth()-birth.getMonth();
    if(month<0||(month===0&&now.getDate()<birth.getDate())) age--;
    return age;
  }

  function ageBand(age){
    if(age==null) return 'unknown';
    if(age<14) return 'under_14';
    if(age<=15) return '14_15';
    if(age<=17) return '16_17';
    return '18_plus';
  }

  function registrationVisible(){
    return document.getElementById('authAction')?.value==='register';
  }

  function ensureFields(){
    const registerFields=document.getElementById('registerFields');
    if(!registerFields||document.getElementById('authBirthDate')) return;
    const wrap=document.createElement('div');
    wrap.id='agePrivacyFields';
    wrap.innerHTML=`
      <div class="age-privacy-row">
        <div class="form-group">
          <label for="authBirthDate">Fecha de nacimiento</label>
          <input id="authBirthDate" type="date" autocomplete="bday">
        </div>
        <div class="form-group">
          <label for="authRegion">Estado / región</label>
          <select id="authRegion"><option value="NY">Nueva York</option><option value="OTHER">Otro</option></select>
        </div>
      </div>
      <label class="age-privacy-check"><input id="authPrivacyConsent" type="checkbox"><span>Acepto los Términos, la Política de Privacidad y las Normas de la comunidad.</span></label>
      <div class="age-privacy-note"><strong>Privacidad por edad:</strong> la fecha de nacimiento se usa para aplicar protecciones y no se muestra públicamente. Durante la beta, las cuentas nuevas deben tener al menos 14 años.</div>
      <p id="agePrivacyStatus" class="age-privacy-status" role="status"></p>`;
    registerFields.appendChild(wrap);
    const birth=document.getElementById('authBirthDate');
    if(birth){
      const today=new Date();
      birth.max=today.toISOString().slice(0,10);
      birth.min=new Date(today.getTime()-100*365.25*DAY).toISOString().slice(0,10);
      birth.addEventListener('change',refreshStatus);
    }
    document.getElementById('authPrivacyConsent')?.addEventListener('change',refreshStatus);
    refreshStatus();
  }

  function refreshStatus(){
    const status=document.getElementById('agePrivacyStatus');
    if(!status) return;
    const age=calculateAge(document.getElementById('authBirthDate')?.value);
    status.className='age-privacy-status';
    if(age==null){status.textContent='Ingresa tu fecha de nacimiento para continuar.';return;}
    if(age<MIN_BETA_AGE){status.classList.add('error');status.textContent='Las cuentas nuevas de la beta requieren 14 años o más.';return;}
    const band=ageBand(age);
    if(band==='14_15'||band==='16_17'){
      status.classList.add('warn');
      status.textContent='Tu cuenta tendrá protecciones juveniles adicionales.';
      return;
    }
    status.classList.add('ok');status.textContent='Edad verificada para el registro.';
  }

  function validateRegistration(event){
    if(!registrationVisible()) return true;
    ensureFields();
    const birthDate=document.getElementById('authBirthDate')?.value||'';
    const accepted=Boolean(document.getElementById('authPrivacyConsent')?.checked);
    const age=calculateAge(birthDate);
    const error=document.getElementById('authError');
    if(age==null||age<MIN_BETA_AGE||!accepted){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(error) error.textContent=age==null?'Ingresa una fecha de nacimiento válida.':age<MIN_BETA_AGE?'Durante la beta debes tener al menos 14 años para crear una cuenta.':'Debes aceptar los Términos, Privacidad y Normas para crear la cuenta.';
      return false;
    }
    const region=document.getElementById('authRegion')?.value==='NY'?'NY':'OTHER';
    sessionStorage.setItem('zeqviroPendingAgePrivacy',JSON.stringify({birthDate,region,privacyAccepted:true}));
    return true;
  }

  const originalFetch=window.fetch.bind(window);
  window.fetch=async(input,init={})=>{
    const url=typeof input==='string'?input:input?.url||'';
    if(/\/api\/auth\/register(?:$|\?)/.test(url)&&String(init.method||'GET').toUpperCase()==='POST'){
      try{
        const pending=JSON.parse(sessionStorage.getItem('zeqviroPendingAgePrivacy')||'null');
        const body=JSON.parse(init.body||'{}');
        if(pending){init={...init,body:JSON.stringify({...body,...pending})};}
      }catch{}
    }
    const response=await originalFetch(input,init);
    if(/\/api\/auth\/register(?:$|\?)/.test(url)&&response.ok){sessionStorage.removeItem('zeqviroPendingAgePrivacy');}
    return response;
  };

  function syncVisibility(){
    ensureFields();
    const fields=document.getElementById('agePrivacyFields');
    if(fields) fields.hidden=!registrationVisible();
    const birth=document.getElementById('authBirthDate');
    const consent=document.getElementById('authPrivacyConsent');
    if(birth) birth.required=registrationVisible();
    if(consent) consent.required=registrationVisible();
  }

  document.addEventListener('submit',event=>{if(event.target?.id==='authForm') validateRegistration(event);},true);
  document.addEventListener('change',event=>{if(event.target?.id==='authAction') setTimeout(syncVisibility,0);});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',syncVisibility); else syncVisibility();
})();
