from pathlib import Path

p = Path('index.html')
s = p.read_text()

# Add verification dialog before report dialog.
needle = '''    <dialog id="reportDialog">'''
insert = '''    <dialog id="emailVerificationDialog">
        <div class="dialog-body">
            <button class="icon-btn" type="button" style="float:right" onclick="document.getElementById('emailVerificationDialog').close()" aria-label="Cerrar">✕</button>
            <h3>✉️ Verificar correo</h3>
            <p class="service-meta" style="margin-top:8px;">Te enviaremos un código de 6 dígitos al correo de tu cuenta. El código vence en 10 minutos.</p>
            <p id="verificationEmailLabel" style="margin-top:10px;font-weight:700;"></p>
            <div id="verificationSendArea" style="margin-top:12px;">
                <button id="sendEmailCodeButton" class="btn" type="button" onclick="sendEmailVerificationCode()">Enviar código</button>
            </div>
            <div id="verificationCodeArea" hidden style="margin-top:12px;">
                <div class="form-group">
                    <label for="emailVerificationCode">Código de verificación</label>
                    <input id="emailVerificationCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="123456">
                </div>
                <div class="dialog-actions">
                    <button class="btn btn-secondary" type="button" onclick="sendEmailVerificationCode()">Reenviar código</button>
                    <button class="btn btn-success" type="button" onclick="confirmEmailVerificationCode()">Verificar correo</button>
                </div>
            </div>
            <p id="emailVerificationStatus" class="form-error" role="status" style="margin-top:10px;"></p>
        </div>
    </dialog>

    <dialog id="reportDialog">'''
if needle not in s:
    raise SystemExit('report dialog anchor missing')
s = s.replace(needle, insert, 1)

# Add verification button and message into security card.
old = '''<div class="card"><h3>🛡️ Seguridad</h3><div id="verificationStatus" class="stats-grid" style="margin-top:12px;"></div><button id="verifyButton" class="btn" style="margin-top:12px;" onclick="requestVerification()">Solicitar verificación</button><h4 style="margin-top:18px;">Mis reportes y disputas</h4>'''
new = '''<div class="card"><h3>🛡️ Seguridad</h3><div id="verificationStatus" class="stats-grid" style="margin-top:12px;"></div><div id="emailVerificationActions" style="margin-top:12px;"></div><button id="verifyButton" class="btn" style="margin-top:12px;" onclick="requestVerification()">Solicitar verificación de identidad</button><h4 style="margin-top:18px;">Mis reportes y disputas</h4>'''
if old not in s:
    raise SystemExit('security card anchor missing')
s = s.replace(old, new, 1)

# Add helpers after updateAuthButton.
needle = '''        function openAuth() {'''
helper = '''        function sessionEmailVerified() {
            return Boolean(session?.user?.emailVerified);
        }

        async function refreshEmailVerificationStatus() {
            if (!session || session.user.role === 'admin') return false;
            try {
                const response = await fetch(`${API_URL}/api/verification/status`, { headers: { 'Authorization': `Bearer ${session.token}` } });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) return sessionEmailVerified();
                session.user.emailVerified = Boolean(data.emailVerified);
                sessionStorage.setItem('skillhubSession', JSON.stringify(session));
                return session.user.emailVerified;
            } catch {
                return sessionEmailVerified();
            }
        }

        async function openEmailVerificationDialog() {
            if (!session || session.user.role === 'admin') return;
            const verified = await refreshEmailVerificationStatus();
            const dialog = document.getElementById('emailVerificationDialog');
            document.getElementById('verificationEmailLabel').textContent = session.user.email || '';
            document.getElementById('emailVerificationCode').value = '';
            document.getElementById('emailVerificationStatus').textContent = verified ? '✓ Tu correo ya está verificado.' : '';
            document.getElementById('verificationSendArea').hidden = verified;
            document.getElementById('verificationCodeArea').hidden = true;
            dialog.showModal();
        }

        async function sendEmailVerificationCode() {
            if (!session) return;
            const button = document.getElementById('sendEmailCodeButton');
            const status = document.getElementById('emailVerificationStatus');
            if (button) button.disabled = true;
            status.style.color = 'var(--text)';
            status.textContent = 'Enviando código…';
            try {
                const response = await fetch(`${API_URL}/api/verification/email/send`, { method: 'POST', headers: { 'Authorization': `Bearer ${session.token}` } });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(data.error || 'No se pudo enviar el código');
                document.getElementById('verificationCodeArea').hidden = false;
                status.style.color = 'var(--success)';
                status.textContent = data.message || 'Código enviado. Revisa tu correo.';
                document.getElementById('emailVerificationCode').focus();
            } catch (error) {
                status.style.color = 'var(--danger)';
                status.textContent = error.message;
            } finally {
                if (button) button.disabled = false;
            }
        }

        async function confirmEmailVerificationCode() {
            if (!session) return;
            const code = document.getElementById('emailVerificationCode').value.trim();
            const status = document.getElementById('emailVerificationStatus');
            if (!/^\\d{6}$/.test(code)) {
                status.style.color = 'var(--danger)';
                status.textContent = 'Escribe el código de 6 dígitos.';
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/verification/email/confirm`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.token}` },
                    body: JSON.stringify({ code })
                });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(data.error || 'El código no es válido');
                session.user.emailVerified = true;
                sessionStorage.setItem('skillhubSession', JSON.stringify(session));
                status.style.color = 'var(--success)';
                status.textContent = '✓ Correo verificado correctamente.';
                document.getElementById('verificationSendArea').hidden = true;
                document.getElementById('verificationCodeArea').hidden = true;
                await loadSecurityCenter();
                setTimeout(() => document.getElementById('emailVerificationDialog').close(), 900);
            } catch (error) {
                status.style.color = 'var(--danger)';
                status.textContent = error.message;
            }
        }

        function openAuth() {'''
if needle not in s:
    raise SystemExit('openAuth anchor missing')
s = s.replace(needle, helper, 1)

# After authentication, refresh status quietly.
old = '''                updateAuthButton();
                document.getElementById('authDialog').close();'''
new = '''                updateAuthButton();
                document.getElementById('authDialog').close();
                if (session.user.role !== 'admin') refreshEmailVerificationStatus();'''
if old not in s:
    raise SystemExit('auth completion anchor missing')
s = s.replace(old, new, 1)

# Improve security center actions.
old = '''                statusBox.innerHTML=`<div class="stat-box"><p>Correo</p><strong>${sec.emailVerified?'Verificado':'No verificado'}</strong></div><div class="stat-box"><p>Teléfono</p><strong>${sec.phoneVerified?'Verificado':'No verificado'}</strong></div><div class="stat-box"><p>Identidad</p><strong>${labels[sec.identityStatus]||'No verificada'}</strong></div>`;
                verifyButton.disabled=['pending','verified'].includes(sec.identityStatus);'''
new = '''                session.user.emailVerified=Boolean(sec.emailVerified); sessionStorage.setItem('skillhubSession',JSON.stringify(session));
                statusBox.innerHTML=`<div class="stat-box"><p>Correo</p><strong>${sec.emailVerified?'✓ Verificado':'No verificado'}</strong></div><div class="stat-box"><p>Teléfono</p><strong>${sec.phoneVerified?'Verificado':'No verificado'}</strong></div><div class="stat-box"><p>Identidad</p><strong>${labels[sec.identityStatus]||'No verificada'}</strong></div>`;
                const emailActions=document.getElementById('emailVerificationActions');
                emailActions.innerHTML=sec.emailVerified?'<p class="service-meta" style="color:var(--success);font-weight:700;">✓ Tu correo está verificado.</p>':'<div class="card" style="padding:12px;margin:0;"><strong>Verifica tu correo</strong><p class="service-meta" style="margin-top:4px;">Te recomendamos verificarlo para aumentar la confianza al solicitar servicios.</p><button class="btn" type="button" style="margin-top:8px;" onclick="openEmailVerificationDialog()">✉️ Verificar correo</button></div>';
                verifyButton.disabled=['pending','verified'].includes(sec.identityStatus);'''
if old not in s:
    raise SystemExit('security rendering anchor missing')
s = s.replace(old, new, 1)

# Recommend verification before booking, but do not block booking.
old = '''            const date = document.getElementById('bookingDate').value;
            const notes = document.getElementById('sellerMessage').value.trim();'''
new = '''            const verified = await refreshEmailVerificationStatus();
            if (!verified) {
                const status = document.getElementById('serviceDialogStatus');
                status.style.color = 'var(--warning)';
                status.innerHTML = 'Te recomendamos verificar tu correo antes de solicitar este servicio. <button type="button" class="btn btn-secondary" style="margin-left:6px;padding:6px 10px;" onclick="openEmailVerificationDialog()">Verificar correo</button>';
            }
            const date = document.getElementById('bookingDate').value;
            const notes = document.getElementById('sellerMessage').value.trim();'''
if old not in s:
    raise SystemExit('booking anchor missing')
s = s.replace(old, new, 1)

p.write_text(s)
