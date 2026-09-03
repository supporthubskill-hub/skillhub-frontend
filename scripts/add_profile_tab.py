from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
help_start=s.index('    <!-- 5. AYUDA, CUENTA Y SEGURIDAD -->')
help_end=s.index('    <!-- 6. RESEÑAS -->', help_start)
profile='''    <!-- 5. PERFIL -->
    <section id="tab-profile" class="tab-content">
        <div class="card">
            <h3>👤 Mi perfil</h3>
            <p class="service-meta">Mantén tu información actualizada para que otros usuarios sepan más sobre ti.</p>
            <div id="profilePageLogin" class="chat-empty">Inicia sesión para administrar tu perfil.</div>
            <form id="profilePageForm" onsubmit="saveProfilePage(event)" hidden style="margin-top:14px;">
                <div class="form-group"><label>Nombre de la cuenta</label><input id="profilePageName" disabled></div>
                <div class="form-group"><label>Título profesional</label><input id="profilePageHeadline" maxlength="100" placeholder="Ej: Técnico de computadoras"></div>
                <div class="form-group"><label>Biografía</label><textarea id="profilePageBio" rows="4" maxlength="600" placeholder="Cuéntales a los demás quién eres y qué experiencia tienes..."></textarea></div>
                <div class="form-group"><label>Habilidades</label><input id="profilePageSkills" maxlength="300" placeholder="Ej: JavaScript, reparación, limpieza"></div>
                <div class="form-group"><label>Experiencia</label><textarea id="profilePageExperience" rows="3" maxlength="600" placeholder="Describe brevemente tu experiencia"></textarea></div>
                <div class="form-row"><div class="form-group"><label>Idiomas</label><input id="profilePageLanguages" maxlength="200" placeholder="Ej: Español, inglés"></div><div class="form-group"><label>Ciudad o área</label><input id="profilePageLocation" maxlength="100" placeholder="Ej: Bronx, NY"></div></div>
                <div class="form-group"><label>Portafolio</label><input id="profilePagePortfolio" type="url" maxlength="500" placeholder="https://..."></div>
                <div class="form-group"><label>Foto de perfil (URL https)</label><input id="profilePageAvatar" type="url" maxlength="500" placeholder="https://..."></div>
                <label style="display:flex;align-items:center;gap:8px;"><input id="profilePageRemote" type="checkbox" style="width:auto" checked> Disponible para trabajos remotos</label>
                <button class="btn" type="submit" style="margin-top:14px;">Guardar perfil</button>
                <p id="profilePageStatus" class="form-error" role="status"></p>
            </form>
        </div>
    </section>

    <!-- 6. AYUDA Y SEGURIDAD -->
    <section id="tab-dashboard" class="tab-content">
        <div class="card"><h3>🧭 Ayuda</h3><p class="service-meta">Seguridad, reportes, disputas, reseñas y soporte de SkillHub.</p><button class="btn" type="button" style="margin-top:12px" onclick="switchTab('tab-reviews')">⭐ Mis reseñas</button></div>
        <div class="card"><h3>🛡️ Seguridad</h3><div id="verificationStatus" class="stats-grid" style="margin-top:12px;"></div><button id="verifyButton" class="btn" style="margin-top:12px;" onclick="requestVerification()">Solicitar verificación</button><h4 style="margin-top:18px;">Mis reportes y disputas</h4><div id="caseHistory" style="margin-top:8px;"></div></div>
        <div class="card"><h3>🆘 Soporte</h3><p class="service-meta" style="margin-bottom:12px;">¿Tienes una duda o problema? Envía una consulta al equipo de SkillHub.</p><form onsubmit="handleSupportSubmit(event)"><div class="form-group"><label>Tu correo electrónico</label><input type="email" id="suppEmail" required></div><div class="form-group"><label>Asunto</label><input type="text" id="suppSubject" required></div><div class="form-group"><label>Mensaje</label><textarea id="suppMsg" rows="3" required></textarea></div><button type="submit" class="btn">Contactar soporte</button></form></div>
    </section>

'''
s=s[:help_start]+profile+s[help_end:]
s=s.replace('''        <button class="nav-item" data-tab="tab-chat" onclick="switchTab('tab-chat', this)"><span>💬</span>Chat</button>\n        <button class="nav-item" data-tab="tab-dashboard" onclick="switchTab('tab-dashboard', this)"><span>🧭</span>Ayuda</button>''','''        <button class="nav-item" data-tab="tab-chat" onclick="switchTab('tab-chat', this)"><span>💬</span>Chat</button>\n        <button class="nav-item" data-tab="tab-profile" onclick="switchTab('tab-profile', this)"><span>👤</span>Perfil</button>\n        <button class="nav-item" data-tab="tab-dashboard" onclick="switchTab('tab-dashboard', this)"><span>🧭</span>Ayuda</button>''',1)
s=s.replace("            if (tabId === 'tab-publish') { await loadMyServices(); await loadCalendar(); }\n            if (tabId === 'tab-reviews') loadReviewOptions();", "            if (tabId === 'tab-publish') { await loadMyServices(); await loadCalendar(); }\n            if (tabId === 'tab-profile') await loadProfilePage();\n            if (tabId === 'tab-reviews') loadReviewOptions();",1)
marker='        async function openProfileEditor() {'
insert='''        async function loadProfilePage() {\n            const login=document.getElementById('profilePageLogin'),form=document.getElementById('profilePageForm'),status=document.getElementById('profilePageStatus');\n            status.textContent='';\n            if(!session){login.hidden=false;login.textContent='Inicia sesión para administrar tu perfil.';form.hidden=true;return;}\n            if(session.user.role==='admin'){login.hidden=false;login.textContent='La cuenta administrativa se gestiona desde el panel de administración.';form.hidden=true;return;}\n            login.hidden=true;form.hidden=false;profilePageName.value=session.user.name||'';\n            try{const response=await fetch(`${API_URL}/api/providers/${session.user.id}`);const data=await response.json();if(!response.ok)throw new Error(data.error||'No se pudo cargar el perfil');const p=data.profile||{};profilePageHeadline.value=p.headline||'';profilePageBio.value=p.bio||'';profilePageSkills.value=p.skills||'';profilePageExperience.value=p.experience||'';profilePageLanguages.value=p.languages||'';profilePageLocation.value=p.location||'';profilePagePortfolio.value=p.portfolioUrl||'';profilePageAvatar.value=p.avatarUrl||'';profilePageRemote.checked=p.remoteAvailable!==false;}catch(e){status.textContent=e.message;}\n        }\n        async function saveProfilePage(event) {\n            event.preventDefault();const status=document.getElementById('profilePageStatus');status.textContent='';\n            const payload={headline:profilePageHeadline.value.trim(),bio:profilePageBio.value.trim(),skills:profilePageSkills.value.trim(),experience:profilePageExperience.value.trim(),languages:profilePageLanguages.value.trim(),location:profilePageLocation.value.trim(),portfolioUrl:profilePagePortfolio.value.trim(),avatarUrl:profilePageAvatar.value.trim(),remoteAvailable:profilePageRemote.checked};\n            try{const response=await fetch(`${API_URL}/api/profile`,{method:'PUT',headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.token}`},body:JSON.stringify(payload)});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'No se pudo guardar el perfil');status.style.color='var(--success)';status.textContent='Perfil guardado correctamente.';}catch(e){status.style.color='var(--danger)';status.textContent=e.message;}\n        }\n\n'''
if marker not in s: raise SystemExit('profile marker missing')
s=s.replace(marker,insert+marker,1)
p.write_text(s,encoding='utf-8')
