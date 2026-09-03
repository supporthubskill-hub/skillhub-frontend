from pathlib import Path
import re
p=Path('index.html')
s=p.read_text()

s=s.replace("body { background-color: var(--bg); color: var(--text); padding-bottom: 75px; transition: background 0.3s; }", "html, body { max-width: 100%; overflow-x: hidden; }\n        body { background-color: var(--bg); color: var(--text); padding-bottom: 75px; transition: background 0.3s; }")
s=s.replace(".bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; background: var(--card-bg); border-top: 1px solid var(--border); display: flex; justify-content: space-around; padding: 8px 0; z-index: 1000; overflow-x: auto; }", ".bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; background: var(--card-bg); border-top: 1px solid var(--border); display: flex; justify-content: space-around; padding: 8px 0; z-index: 1000; overflow-x: hidden; }")
s=s.replace(".nav-item { background: none; border: none; color: var(--text); font-size: 0.7rem; display: flex; flex-direction: column; align-items: center; cursor: pointer; opacity: 0.7; min-width: 60px; }", ".nav-item { background: none; border: none; color: var(--text); font-size: 0.7rem; display: flex; flex: 1 1 0; min-width: 0; flex-direction: column; align-items: center; cursor: pointer; opacity: 0.7; }")
s=s.replace(".service-meta { color:#64748b; font-size:0.82rem; margin-top:6px; }", ".service-meta { color:#64748b; font-size:0.82rem; margin-top:6px; }\n        .form-row { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }\n        .my-service { border:1px solid var(--border); border-radius:10px; padding:12px; margin-top:8px; }\n        .status-ready { color:var(--success); font-weight:700; }\n        .status-waiting { color:#d97706; font-weight:700; }")
s=s.replace(".bottom-nav { justify-content: flex-start; gap: 2px; padding-bottom: max(8px, env(safe-area-inset-bottom)); }\n            .nav-item { flex: 0 0 72px; min-height: 54px; font-size: 0.75rem; }", ".bottom-nav { justify-content: space-around; gap: 0; padding-bottom: max(8px, env(safe-area-inset-bottom)); }\n            .nav-item { flex: 1 1 0; min-width: 0; min-height: 54px; font-size: 0.72rem; }\n            .form-row { grid-template-columns:1fr; }\n            .nav-container, .tab-content, .card { min-width:0; max-width:100%; }\n            #tab-search .card > div > div { flex-wrap:wrap; }")

services_html='''    <!-- 2. SERVICIOS, DISPONIBILIDAD Y RESERVAS -->
    <section id="tab-publish" class="tab-content">
        <div class="card">
            <h3 id="serviceFormTitle">🛠️ Crear servicio</h3>
            <p class="service-meta">Puedes crear hasta 5 servicios nuevos cada 24 horas. Editarlos después no consume otro espacio.</p>
            <p id="serviceLimitStatus" class="service-meta"></p>
            <form id="serviceForm" onsubmit="saveService(event)" style="margin-top:12px;">
                <div class="form-group"><label>Nombre del servicio</label><input type="text" id="serviceName" required maxlength="120" placeholder="Ej: Reparación de computadoras"></div>
                <div class="form-group"><label>Descripción del servicio</label><textarea id="serviceDesc" rows="3" minlength="10" maxlength="1000" required placeholder="Explica qué incluye tu servicio..."></textarea></div>
                <div class="form-row"><div class="form-group"><label>Categoría</label><select id="serviceCat"><option value="Desarrollo">Desarrollo</option><option value="Hogar">Hogar</option><option value="Educación">Educación</option></select></div><div class="form-group"><label>Tipo</label><select id="serviceType"><option value="Remoto">Remoto</option><option value="Presencial">Presencial</option></select></div></div>
                <div class="form-row"><div class="form-group"><label>Precio fijo ($)</label><input type="number" min="0" step="0.01" id="servicePrice" placeholder="50.00"></div><div class="form-group"><label>Precio por hora ($)</label><input type="number" min="0" step="0.01" id="serviceHourly" placeholder="15.00"></div></div>
                <div class="form-group"><label>Ubicación / área</label><input type="text" id="serviceArea" maxlength="150" placeholder="Ej: Bronx, NY / Remoto"></div>
                <div class="dialog-actions"><button id="cancelServiceEdit" class="btn btn-secondary" type="button" onclick="cancelServiceEdit()" hidden>Cancelar edición</button><button id="serviceSubmitButton" type="submit" class="btn">Guardar servicio</button></div>
                <p id="serviceFormStatus" class="form-error" role="status"></p>
            </form>
            <h4 style="margin-top:20px;">Mis servicios</h4><div id="myServicesList"><div class="chat-empty">Inicia sesión para administrar tus servicios.</div></div>
        </div>
        <div class="card">
            <h3>🗓️ Disponibilidad</h3>
            <p class="service-meta"><strong>Obligatorio:</strong> un servicio necesita al menos un horario futuro disponible para aparecer en el marketplace y aceptar reservas.</p>
            <p class="service-meta">Elige la fecha y la hora exacta que quieras. También puedes escribir la duración en minutos.</p>
            <form onsubmit="addAvailability(event)" style="margin-top:12px;">
                <div class="form-group"><label for="availabilityService">Servicio</label><select id="availabilityService" required></select></div>
                <div class="form-row"><div class="form-group"><label for="availabilityStart">Fecha y hora exacta</label><input id="availabilityStart" type="datetime-local" step="60" required></div><div class="form-group"><label for="availabilityDuration">Duración (minutos)</label><input id="availabilityDuration" type="number" min="15" max="480" step="5" value="60" required></div></div>
                <div class="dialog-actions"><button id="cancelAvailabilityEdit" class="btn btn-secondary" type="button" onclick="cancelAvailabilityEdit()" hidden>Cancelar edición</button><button id="availabilitySubmitButton" class="btn" type="submit">Añadir horario</button></div>
                <p id="availabilityStatus" class="form-error" role="status"></p>
            </form>
            <div id="availabilityList"></div>
        </div>
        <div class="card"><h3>📅 Reservas</h3><div id="bookingsList" style="margin-top:12px;"><div class="chat-empty">Inicia sesión para ver tus reservaciones.</div></div></div>
    </section>

'''
s,n=re.subn(r"    <!-- 2\. CREAR / EDITAR SERVICIO \(PROVEEDOR\) -->[\s\S]*?(?=    <!-- 4\. COMUNICACIÓN Y CHAT -->)",services_html,s,count=1)
assert n==1,'services html'

help_html='''    <!-- 5. AYUDA, CUENTA Y SEGURIDAD -->
    <section id="tab-dashboard" class="tab-content">
        <div class="card"><h3>🧭 Ayuda y cuenta</h3><p class="service-meta">Administra tu perfil, reseñas, seguridad y soporte desde un solo lugar.</p><div class="dialog-actions"><button class="btn btn-secondary" type="button" onclick="openProfileEditor()">✏️ Editar perfil y biografía</button><button class="btn" type="button" onclick="switchTab('tab-reviews')">⭐ Reseñas</button></div></div>
        <div class="card"><h3>🛡️ Seguridad</h3><div id="verificationStatus" class="stats-grid" style="margin-top:12px;"></div><button id="verifyButton" class="btn" style="margin-top:12px;" onclick="requestVerification()">Solicitar verificación</button><h4 style="margin-top:18px;">Mis reportes y disputas</h4><div id="caseHistory" style="margin-top:8px;"></div></div>
        <div class="card"><h3>🆘 Soporte</h3><p class="service-meta" style="margin-bottom:12px;">¿Tienes una duda o problema? Envía una consulta al equipo de SkillHub.</p><form onsubmit="handleSupportSubmit(event)"><div class="form-group"><label>Tu correo electrónico</label><input type="email" id="suppEmail" required></div><div class="form-group"><label>Asunto</label><input type="text" id="suppSubject" required></div><div class="form-group"><label>Mensaje</label><textarea id="suppMsg" rows="3" required></textarea></div><button type="submit" class="btn">Contactar soporte</button></form></div>
    </section>

'''
s,n=re.subn(r"    <!-- 5\. PANEL DE PROVEEDOR & CLIENTE -->[\s\S]*?(?=    <!-- 6\. RESEÑAS -->)",help_html,s,count=1)
assert n==1,'help html'
s,n=re.subn(r"    <!-- 8\. SOPORTE Y AYUDA -->[\s\S]*?(?=    <!-- 9\. NOTIFICACIONES -->)",'',s,count=1)
assert n==1,'remove support'

nav='''    <!-- Bottom Navigation Bar -->
    <nav class="bottom-nav">
        <button class="nav-item active" data-tab="tab-search" onclick="switchTab('tab-search', this)"><span>🔍</span>Buscar</button>
        <button class="nav-item" data-tab="tab-publish" onclick="switchTab('tab-publish', this)"><span>🛠️</span>Servicios</button>
        <button class="nav-item" data-tab="tab-chat" onclick="switchTab('tab-chat', this)"><span>💬</span>Chat</button>
        <button class="nav-item" data-tab="tab-dashboard" onclick="switchTab('tab-dashboard', this)"><span>🧭</span>Ayuda</button>
        <button id="adminNav" class="nav-item" onclick="window.location.href='/admin'" hidden><span>⚙️</span>Admin</button>
    </nav>
'''
s,n=re.subn(r"    <!-- Bottom Navigation Bar -->[\s\S]*?(?=    <!-- App Logic)",nav+'\n',s,count=1)
assert n==1,'nav'

s=s.replace("        let servicesData = [];\n","        let servicesData = [];\n        let myServicesData = [];\n        let myAvailabilityData = [];\n        let editingServiceId = null;\n        let editingAvailabilityId = null;\n",1)

old_switch="""        async function switchTab(tabId, btn) {
            if (tabId === 'tab-admin' && (!session || session.user.role !== 'admin')) {
                alert('Acceso exclusivo para administradores autenticados.');
                return;
            }

            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            if (tabId === 'tab-chat') loadConversations();
            if (tabId === 'tab-bookings') loadCalendar();
            if (tabId === 'tab-reviews') loadReviewOptions();
            if (tabId === 'tab-dashboard') loadSecurityCenter();
            if(btn) btn.classList.add('active');
        }
"""
new_switch="""        async function switchTab(tabId, btn) {
            if (tabId === 'tab-admin' && (!session || session.user.role !== 'admin')) return;
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            if (tabId === 'tab-chat') loadConversations();
            if (tabId === 'tab-publish') { await loadMyServices(); await loadCalendar(); }
            if (tabId === 'tab-reviews') loadReviewOptions();
            if (tabId === 'tab-dashboard') loadSecurityCenter();
            if(btn) btn.classList.add('active');
        }
"""
assert old_switch in s
s=s.replace(old_switch,new_switch,1)

save_code='''        async function loadMyServices() {
            const list=document.getElementById('myServicesList'),limit=document.getElementById('serviceLimitStatus');
            if(!session || session.user.role==='admin'){myServicesData=[];list.innerHTML='<div class="chat-empty">Inicia sesión para administrar tus servicios.</div>';limit.textContent='';return;}
            try{const r=await fetch(`${API_URL}/api/services/me`,{headers:{'Authorization':`Bearer ${session.token}`}});const data=await r.json();if(!r.ok)throw new Error(data.error||'No se pudieron cargar tus servicios');myServicesData=data.services||[];limit.textContent=`Publicaciones nuevas en las últimas 24 h: ${data.limit?.used||0}/5 · Te quedan ${data.limit?.remaining??5}.`;list.innerHTML=myServicesData.length?myServicesData.map(x=>`<div class="my-service"><div><strong>${escapeHtml(x.name)}</strong><p class="service-meta">${escapeHtml(x.cat||'')} · ${escapeHtml(x.type||'')} · ${Number(x.price||0).toFixed(2)} USD</p><p class="${x.hasAvailability?'status-ready':'status-waiting'}">${x.hasAvailability?'✓ Visible y listo para reservas':'⚠ Falta añadir disponibilidad para publicarlo'}</p></div><button class="btn btn-secondary" style="margin-top:8px" onclick="editService(${Number(x.id)})">Editar servicio</button></div>`).join(''):'<div class="chat-empty">Todavía no has creado servicios.</div>';}catch(e){list.innerHTML=`<div class="chat-empty">${escapeHtml(e.message)}</div>`;}
        }
        function editService(id){const x=myServicesData.find(v=>Number(v.id)===Number(id));if(!x)return;editingServiceId=Number(id);serviceName.value=x.name||'';serviceDesc.value=x.desc||'';serviceCat.value=x.cat||'Desarrollo';serviceType.value=x.type||'Remoto';servicePrice.value=x.price??0;serviceHourly.value=x.hourly??0;serviceArea.value=x.area||'';serviceFormTitle.textContent='✏️ Editar servicio';serviceSubmitButton.textContent='Guardar cambios';cancelServiceEdit.hidden=false;serviceForm.scrollIntoView({behavior:'smooth',block:'start'});}
        function cancelServiceEdit(){editingServiceId=null;serviceForm.reset();serviceFormTitle.textContent='🛠️ Crear servicio';serviceSubmitButton.textContent='Guardar servicio';cancelServiceEdit.hidden=true;serviceFormStatus.textContent='';}
        async function saveService(e){e.preventDefault();const payload={name:filterOffensiveContent(serviceName.value),desc:filterOffensiveContent(serviceDesc.value),cat:serviceCat.value,type:serviceType.value,price:Number(servicePrice.value||0),hourly:Number(serviceHourly.value||0),area:serviceArea.value.trim()||'Remoto'};const status=document.getElementById('serviceFormStatus');status.textContent='';try{if(!session||session.user.role==='admin')throw new Error('Inicia sesión para guardar servicios.');const isEdit=Boolean(editingServiceId);const r=await fetch(`${API_URL}/api/services${isEdit?'/'+editingServiceId:''}`,{method:isEdit?'PATCH':'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.token}`},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok)throw new Error(data.error||'No se pudo guardar');const newId=data.id;cancelServiceEdit();await loadMyServices();await loadCalendar();await fetchServicesFromAPI();status.style.color='var(--success)';status.textContent=isEdit?'Cambios guardados.':'Servicio guardado. Ahora añade al menos un horario para que aparezca en el marketplace.';if(!isEdit&&newId){availabilityService.value=String(newId);availabilityStart.focus();}}catch(err){status.style.color='var(--danger)';status.textContent=err.message;}}

'''
s,n=re.subn(r"        async function saveService\(e\) \{[\s\S]*?(?=        function filterServices\(\))",save_code,s,count=1)
assert n==1,'save js'
s=s.replace("                switchTab('tab-bookings', document.querySelectorAll('.nav-item')[2]);","                switchTab('tab-publish', document.querySelector('.nav-item[data-tab=\"tab-publish\"]'));",1)

cal='''        async function loadCalendar() {
            const serviceSelect=document.getElementById('availabilityService'),list=document.getElementById('availabilityList'),bookings=document.getElementById('bookingsList');
            if(!session||session.user.role==='admin'){serviceSelect.innerHTML='<option value="">Inicia sesión</option>';list.innerHTML='';bookings.innerHTML='<div class="chat-empty">Inicia sesión para ver tus reservaciones.</div>';return;}
            if(!myServicesData.length)await loadMyServices();serviceSelect.innerHTML='<option value="">Selecciona un servicio</option>';myServicesData.filter(x=>x.active!==false).forEach(x=>serviceSelect.add(new Option(x.name,x.id)));
            try{const headers={'Authorization':`Bearer ${session.token}`};const[sr,br]=await Promise.all([fetch(`${API_URL}/api/availability/me`,{headers}),fetch(`${API_URL}/api/bookings/me`,{headers})]);const slots=await sr.json(),rows=await br.json();if(!sr.ok)throw new Error(slots.error||'No se pudo cargar la disponibilidad');if(!br.ok)throw new Error(rows.error||'No se pudieron cargar las reservas');myAvailabilityData=slots;list.innerHTML=slots.length?slots.map(x=>`<div class="card" style="padding:12px;margin-top:8px;"><strong>${escapeHtml(x.serviceName)}</strong><p class="service-meta">${new Date(x.startsAt).toLocaleString()} · ${x.durationMinutes} min · ${x.available?'Disponible':'Reservado'}</p>${x.available?`<div class="dialog-actions"><button class="btn btn-secondary" onclick="editAvailability(${x.id})">Editar</button><button class="btn btn-danger" onclick="deleteAvailability(${x.id})">Eliminar</button></div>`:''}</div>`).join(''):'<div class="chat-empty">No has añadido horarios.</div>';bookings.innerHTML=rows.length?rows.map(item=>`<div class="card" style="padding:12px;"><strong>${escapeHtml(item.serviceName)}</strong><p class="service-meta">${new Date(item.date).toLocaleString()} · ${escapeHtml(item.status)} · ${item.perspective==='provider'?'Te contrataron':'Tu reservación'}</p><button class="btn btn-danger" style="margin-top:8px" onclick="openDisputeDialog(${item.id})">Abrir disputa</button>${item.perspective==='provider'&&item.status!=='completed'&&item.status!=='cancelled'?`<button class="btn btn-success" style="margin-top:8px" onclick="updateBookingStatus(${item.id},'completed')">Marcar completado</button>`:''}${item.perspective==='client'&&item.status==='completed'?`<button class="btn" style="margin-top:8px" onclick="switchTab('tab-reviews')">Dejar reseña</button>`:''}</div>`).join(''):'<div class="chat-empty">Aún no tienes reservaciones.</div>';}catch(error){availabilityStatus.textContent=error.message;}
        }
        function toLocalInputValue(value){const d=new Date(value),pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;}
        function editAvailability(id){const x=myAvailabilityData.find(v=>Number(v.id)===Number(id));if(!x)return;editingAvailabilityId=Number(id);availabilityService.value=String(x.serviceId);availabilityService.disabled=true;availabilityStart.value=toLocalInputValue(x.startsAt);availabilityDuration.value=x.durationMinutes;availabilitySubmitButton.textContent='Guardar horario';cancelAvailabilityEdit.hidden=false;availabilityStart.focus();}
        function cancelAvailabilityEdit(){editingAvailabilityId=null;availabilityService.disabled=false;availabilityStart.value='';availabilityDuration.value='60';availabilitySubmitButton.textContent='Añadir horario';cancelAvailabilityEdit.hidden=true;availabilityStatus.textContent='';}

'''
s,n=re.subn(r"        async function loadCalendar\(\) \{[\s\S]*?(?=        async function addAvailability\(event\))",cal,s,count=1)
assert n==1,'calendar js'

add='''        async function addAvailability(event){event.preventDefault();const status=document.getElementById('availabilityStatus'),startsAt=availabilityStart.value,duration=Number(availabilityDuration.value),serviceId=Number(availabilityService.value);try{if(!startsAt)throw new Error('Elige una fecha y hora.');const isEdit=Boolean(editingAvailabilityId);const r=await fetch(`${API_URL}/api/availability${isEdit?'/'+editingAvailabilityId:''}`,{method:isEdit?'PATCH':'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.token}`},body:JSON.stringify({serviceId,startsAt:new Date(startsAt).toISOString(),durationMinutes:duration})});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'No se pudo guardar el horario');cancelAvailabilityEdit();await loadCalendar();await loadMyServices();await fetchServicesFromAPI();status.style.color='var(--success)';status.textContent=isEdit?'Horario actualizado.':'Horario añadido. El servicio ya puede aparecer para reservas.';}catch(error){status.style.color='var(--danger)';status.textContent=error.message;}}

'''
s,n=re.subn(r"        async function addAvailability\(event\) \{[\s\S]*?(?=        async function deleteAvailability\(id\))",add,s,count=1)
assert n==1,'availability js'
old_del="""        async function deleteAvailability(id) {
            const response = await fetch(`${API_URL}/api/availability/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${session.token}` } });
            if (response.ok) loadCalendar();
        }
"""
new_del="""        async function deleteAvailability(id) {
            const response=await fetch(`${API_URL}/api/availability/${id}`,{method:'DELETE',headers:{'Authorization':`Bearer ${session.token}`}});
            if(response.ok){await loadCalendar();await loadMyServices();await fetchServicesFromAPI();}
        }
"""
assert old_del in s
s=s.replace(old_del,new_del,1)
p.write_text(s)
