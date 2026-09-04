# Apply optional profile-completion guidance to PR #18.
from pathlib import Path
import re
p=Path('index.html')
s=p.read_text()

css_marker='        /* Public provider profile */'
css='''        /* Profile completion */
        .profile-progress-card { margin:14px 0 18px; padding:14px; border:1px solid var(--border); border-radius:12px; background:var(--bg); }
        .profile-progress-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:8px; }
        .profile-progress-track { height:10px; border-radius:999px; background:var(--border); overflow:hidden; }
        .profile-progress-fill { height:100%; width:10%; border-radius:999px; background:var(--primary); transition:width .25s ease; }
        .profile-suggestions { margin-top:10px; font-size:.82rem; color:#64748b; line-height:1.5; }
        .profile-optional { font-size:.74rem; color:#64748b; font-weight:500; }
        .profile-photo-note { margin-top:6px; font-size:.78rem; color:#64748b; line-height:1.4; }

'''
if '.profile-progress-card' not in s:
    s=s.replace(css_marker, css+css_marker)

old='''            <p class="service-meta">Mantén tu información actualizada para que otros usuarios sepan más sobre ti.</p>\n            <div id="profilePageLogin" class="chat-empty">Inicia sesión para administrar tu perfil.</div>\n            <form id="profilePageForm" onsubmit="saveProfilePage(event)" hidden style="margin-top:14px;">'''
new='''            <p class="service-meta">Completar tu perfil es opcional, pero un perfil más completo ayuda a que otros usuarios conozcan mejor tu experiencia.</p>\n            <div id="profilePageLogin" class="chat-empty">Inicia sesión para administrar tu perfil.</div>\n            <form id="profilePageForm" onsubmit="saveProfilePage(event)" hidden style="margin-top:14px;">\n                <div class="profile-progress-card">\n                    <div class="profile-progress-head"><strong>Perfil completado</strong><strong id="profileCompletionText">10%</strong></div>\n                    <div class="profile-progress-track" aria-hidden="true"><div id="profileCompletionFill" class="profile-progress-fill"></div></div>\n                    <p id="profileCompletionSuggestions" class="profile-suggestions">Añade información para mejorar tu perfil público.</p>\n                </div>'''
if old not in s: raise SystemExit('profile intro not found')
s=s.replace(old,new)

s=s.replace('<div class="form-group"><label>Título profesional</label><input id="profilePageHeadline" maxlength="100" placeholder="Ej: Técnico de computadoras"></div>', '<div class="form-group"><label>Título profesional <span class="profile-optional">(opcional)</span></label><input id="profilePageHeadline" maxlength="100" placeholder="Ej: Técnico de computadoras" oninput="updateProfileCompletion()"></div>')
s=s.replace('<div class="form-group"><label>Biografía</label><textarea id="profilePageBio" rows="4" maxlength="600" placeholder="Cuéntales a los demás quién eres y qué experiencia tienes..."></textarea></div>', '<div class="form-group"><label>Biografía <span class="profile-optional">(opcional)</span></label><textarea id="profilePageBio" rows="4" maxlength="600" placeholder="Cuéntales a los demás quién eres y qué experiencia tienes..." oninput="updateProfileCompletion()"></textarea></div>')
s=s.replace('<div class="form-group"><label>Habilidades</label><input id="profilePageSkills" maxlength="300" placeholder="Ej: JavaScript, reparación, limpieza"></div>', '<div class="form-group"><label>Habilidades <span class="profile-optional">(opcional)</span></label><input id="profilePageSkills" maxlength="300" placeholder="Ej: JavaScript, reparación, limpieza" oninput="updateProfileCompletion()"></div>')
s=s.replace('<div class="form-group"><label>Experiencia</label><textarea id="profilePageExperience" rows="3" maxlength="600" placeholder="Describe brevemente tu experiencia"></textarea></div>', '<div class="form-group"><label>Experiencia <span class="profile-optional">(opcional)</span></label><textarea id="profilePageExperience" rows="3" maxlength="600" placeholder="Describe brevemente tu experiencia" oninput="updateProfileCompletion()"></textarea></div>')
s=s.replace('<div class="form-row"><div class="form-group"><label>Idiomas</label><input id="profilePageLanguages" maxlength="200" placeholder="Ej: Español, inglés"></div><div class="form-group"><label>Ciudad o área</label><input id="profilePageLocation" maxlength="100" placeholder="Ej: Bronx, NY"></div></div>', '<div class="form-row"><div class="form-group"><label>Idiomas <span class="profile-optional">(opcional)</span></label><input id="profilePageLanguages" maxlength="200" placeholder="Ej: Español, inglés" oninput="updateProfileCompletion()"></div><div class="form-group"><label>Ciudad o área <span class="profile-optional">(opcional)</span></label><input id="profilePageLocation" maxlength="100" placeholder="Ej: Bronx, NY" oninput="updateProfileCompletion()"></div></div>')
s=s.replace('<div class="form-group"><label>Portafolio</label><input id="profilePagePortfolio" type="url" maxlength="500" placeholder="https://..."></div>', '<div class="form-group"><label>Portafolio <span class="profile-optional">(opcional)</span></label><input id="profilePagePortfolio" type="url" maxlength="500" placeholder="https://..." oninput="updateProfileCompletion()"></div>')
s=s.replace('<div class="form-group"><label>Foto de perfil (URL https)</label><input id="profilePageAvatar" type="url" maxlength="500" placeholder="https://..."></div>', '<div class="form-group"><label>Foto de perfil (URL https) <span class="profile-optional">(opcional)</span></label><input id="profilePageAvatar" type="url" maxlength="500" placeholder="https://..." oninput="updateProfileCompletion()"><p class="profile-photo-note">Usa una foto apropiada y profesional. Las imágenes que violen las reglas de SkillHub pueden ser retiradas o reportadas.</p></div>')
s=s.replace('<input id="profilePageRemote" type="checkbox" style="width:auto" checked> Disponible para trabajos remotos', '<input id="profilePageRemote" type="checkbox" style="width:auto" checked onchange="updateProfileCompletion()"> Disponible para trabajos remotos')

marker='''        async function loadProfilePage() {'''
helper='''        function updateProfileCompletion() {\n            const fields=[\n                ['Título profesional', profilePageHeadline?.value],\n                ['Biografía', profilePageBio?.value],\n                ['Habilidades', profilePageSkills?.value],\n                ['Experiencia', profilePageExperience?.value],\n                ['Idiomas', profilePageLanguages?.value],\n                ['Ciudad o área', profilePageLocation?.value],\n                ['Portafolio', profilePagePortfolio?.value],\n                ['Foto de perfil', profilePageAvatar?.value],\n                ['Disponibilidad remota', profilePageRemote?.checked ? 'sí' : '']\n            ];\n            const completed=fields.filter(([,value])=>String(value||'').trim()).length;\n            const percent=Math.min(100,10+(completed*10));\n            const text=document.getElementById('profileCompletionText');\n            const fill=document.getElementById('profileCompletionFill');\n            const suggestions=document.getElementById('profileCompletionSuggestions');\n            if(text) text.textContent=`${percent}%`;\n            if(fill) fill.style.width=`${percent}%`;\n            if(suggestions){\n                const missing=fields.filter(([,value])=>!String(value||'').trim()).map(([label])=>label);\n                suggestions.textContent=percent===100?'Tu perfil está completo. Puedes actualizarlo cuando quieras.':`Sugerencia: completa ${missing.slice(0,3).join(', ')}${missing.length>3?' y otros campos':''}. Nada de esto es obligatorio.`;\n            }\n        }\n\n'''
if 'function updateProfileCompletion()' not in s:
    s=s.replace(marker,helper+marker)

needle="profilePageRemote.checked=p.remoteAvailable!==false;"
if needle not in s: raise SystemExit('profile load assignment not found')
s=s.replace(needle, needle+' updateProfileCompletion();',1)

public_needle="const p=data.profile||{}, services=Array.isArray(data.services)?data.services:[], reviews=Array.isArray(data.reviews)?data.reviews:[];"
public_add="""const p=data.profile||{}, services=Array.isArray(data.services)?data.services:[], reviews=Array.isArray(data.reviews)?data.reviews:[];\n                const publicFields=[p.headline,p.bio,p.skills,p.experience,p.languages,p.location,p.portfolioUrl,p.avatarUrl,p.remoteAvailable?'sí':''];\n                const profilePercent=Math.min(100,10+(publicFields.filter(v=>String(v||'').trim()).length*10));"""
if public_needle not in s: raise SystemExit('public profile data line not found')
s=s.replace(public_needle,public_add,1)
old_badge='''<span class="profile-badge profile-rating">⭐ ${Number(p.rating||0).toFixed(1)} · ${Number(p.reviewCount||0)} reseñas</span>${p.location?`<span class="profile-badge">📍 ${escapeHtml(p.location)}</span>`:''}${p.remoteAvailable?'<span class="profile-badge">💻 Disponible remoto</span>':''}'''
new_badge='''<span class="profile-badge profile-rating">⭐ ${Number(p.rating||0).toFixed(1)} · ${Number(p.reviewCount||0)} reseñas</span><span class="profile-badge">📋 Perfil ${profilePercent}% completo</span>${p.location?`<span class="profile-badge">📍 ${escapeHtml(p.location)}</span>`:''}${p.remoteAvailable?'<span class="profile-badge">💻 Disponible remoto</span>':''}'''
if old_badge not in s: raise SystemExit('public badge block not found')
s=s.replace(old_badge,new_badge,1)

p.write_text(s)
