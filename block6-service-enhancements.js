(()=>{
  const safeUrl=(value)=>/^https:\/\//i.test(String(value||'').trim())?String(value).trim():'';

  function ensureImageField(){
    if(document.getElementById('serviceImageUrl')) return;
    const area=document.getElementById('serviceArea');
    if(!area) return;
    const group=document.createElement('div');
    group.className='form-group block6-service-image-field';
    group.innerHTML='<label for="serviceImageUrl">Imagen de portada <span class="service-meta">(opcional)</span></label><input id="serviceImageUrl" type="url" inputmode="url" maxlength="500" placeholder="https://..."><p class="service-meta">Usa una imagen HTTPS que represente el servicio. No incluyas información privada.</p><div id="serviceImagePreview" class="block6-image-preview" hidden></div>';
    area.closest('.form-group')?.insertAdjacentElement('afterend',group);
    document.getElementById('serviceImageUrl')?.addEventListener('input',updatePreview);
  }

  function updatePreview(){
    const input=document.getElementById('serviceImageUrl');
    const preview=document.getElementById('serviceImagePreview');
    if(!input||!preview) return;
    const url=safeUrl(input.value);
    preview.hidden=!url;
    preview.innerHTML=url?`<img src="${escapeHtml(url)}" alt="Vista previa de la portada del servicio" loading="lazy">`:'';
  }

  function serviceMedia(service){
    const url=safeUrl(service?.imageUrl);
    if(url) return `<div class="block6-service-media"><img src="${escapeHtml(url)}" alt="${escapeHtml(service.name||'Servicio')}" loading="lazy"></div>`;
    const label=String(service?.cat||service?.category||'Servicio').slice(0,1).toUpperCase();
    return `<div class="block6-service-media block6-service-placeholder" aria-hidden="true"><span>${escapeHtml(label||'Z')}</span></div>`;
  }

  window.renderServices=function(items){
    const grid=document.getElementById('servicesGrid');
    if(!grid) return;
    grid.innerHTML='';
    items.forEach(s=>{
      const cleanName=escapeHtml(filterOffensiveContent(s.name));
      const cleanDesc=escapeHtml(filterOffensiveContent(s.desc));
      const cat=escapeHtml(s.cat||s.category||'Servicio');
      const type=escapeHtml(s.type||'Remoto');
      const area=escapeHtml(s.area||'Remoto');
      const price=Number(s.price)||0;
      const hourly=Number(s.hourly)||0;
      const rating=Number(s.rating)||0;
      const reviews=Number(s.reviewCount)||0;
      const ready=s.hasAvailability!==false;
      const card=document.createElement('article');
      card.className='service-card block6-service-card';
      card.innerHTML=`${serviceMedia(s)}<div class="block6-service-body"><div class="block6-service-tags"><span>${cat}</span><span>${type}</span></div><h3>${cleanName}</h3><p class="block6-service-description">${cleanDesc}</p><div class="block6-service-trust"><span>⭐ ${rating?rating.toFixed(1):'Nuevo'}${reviews?` · ${reviews} reseña${reviews===1?'':'s'}`:''}</span><span>${ready?'🟢 Disponible':'⚪ Sin horarios'}</span></div><button class="block6-provider-link" type="button" onclick="openProviderProfile(${Number(s.providerId)})">Por ${escapeHtml(s.providerName||'Proveedor de Zeqviro')} · Ver perfil</button><div class="block6-service-footer"><div><strong>$${price.toFixed(2)}</strong>${hourly>0?`<small>$${hourly.toFixed(2)}/hora</small>`:''}<small>${area}</small></div><div class="block6-service-actions"><button class="btn btn-secondary" type="button" onclick="openServiceDialog(${Number(s.id)})">Detalles</button>${ready?`<button class="btn btn-success" type="button" onclick="openServiceDialog(${Number(s.id)},true)">Solicitar</button>`:`<button class="btn" type="button" onclick="openServiceDialog(${Number(s.id)})">Contactar</button>`}</div></div></div>`;
      grid.appendChild(card);
    });
  };

  window.editService=function(id){
    const x=myServicesData.find(v=>Number(v.id)===Number(id));
    if(!x) return;
    ensureImageField();
    editingServiceId=Number(id);
    serviceName.value=x.name||'';serviceDesc.value=x.desc||'';serviceCat.value=x.cat||'Desarrollo';serviceType.value=x.type||'Remoto';servicePrice.value=x.price??0;serviceHourly.value=x.hourly??0;serviceArea.value=x.area||'';
    const image=document.getElementById('serviceImageUrl');if(image)image.value=x.imageUrl||'';updatePreview();
    serviceFormTitle.textContent='✏️ Editar servicio';serviceSubmitButton.textContent='Guardar cambios';cancelServiceEdit.hidden=false;serviceForm.scrollIntoView({behavior:'smooth',block:'start'});
  };

  window.saveService=async function(event){
    event.preventDefault();
    ensureImageField();
    const imageUrl=document.getElementById('serviceImageUrl')?.value.trim()||'';
    if(imageUrl&&!safeUrl(imageUrl)){const status=document.getElementById('serviceFormStatus');status.style.color='var(--danger)';status.textContent='La imagen debe usar una dirección https://';return;}
    const payload={name:filterOffensiveContent(serviceName.value),desc:filterOffensiveContent(serviceDesc.value),cat:serviceCat.value,type:serviceType.value,price:Number(servicePrice.value||0),hourly:Number(serviceHourly.value||0),area:serviceArea.value.trim()||'Remoto',imageUrl};
    const status=document.getElementById('serviceFormStatus');status.textContent='';
    try{
      if(!session||session.user.role==='admin') throw new Error('Inicia sesión para guardar servicios.');
      const isEdit=Boolean(editingServiceId);
      const response=await fetch(`${API_URL}/api/services${isEdit?'/'+editingServiceId:''}`,{method:isEdit?'PATCH':'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.token}`},body:JSON.stringify(payload)});
      const data=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(data.error||'No se pudo guardar');
      const newId=data.id;cancelServiceEdit();const image=document.getElementById('serviceImageUrl');if(image)image.value='';updatePreview();
      await loadMyServices();await loadCalendar();await fetchServicesFromAPI();
      status.style.color='var(--success)';status.textContent=isEdit?'Cambios guardados.':'Servicio guardado. Ahora añade al menos un horario para que aparezca en el marketplace.';
      if(!isEdit&&newId){availabilityService.value=String(newId);availabilityStart.focus();}
    }catch(error){status.style.color='var(--danger)';status.textContent=error.message;}
  };

  const originalOpen=window.openServiceDialog;
  if(typeof originalOpen==='function'){
    window.openServiceDialog=async function(serviceId,focusDate=false){
      const service=servicesData.find(item=>Number(item.id)===Number(serviceId));
      let media=document.getElementById('block6DialogServiceMedia');
      if(!media){media=document.createElement('div');media.id='block6DialogServiceMedia';media.className='block6-dialog-service-media';document.getElementById('dialogServiceName')?.insertAdjacentElement('beforebegin',media);}
      if(media)media.innerHTML=service?serviceMedia(service):'';
      return originalOpen(serviceId,focusDate);
    };
  }

  function boot(){ensureImageField();if(Array.isArray(window.servicesData)&&window.servicesData.length)renderServices(window.servicesData);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  document.addEventListener('click',()=>setTimeout(ensureImageField,0),true);
})();
