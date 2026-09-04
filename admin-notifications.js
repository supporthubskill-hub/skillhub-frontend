(() => {
  if (typeof api !== 'function' || typeof askConfirm !== 'function') return;
  const main = document.querySelector('main');
  if (!main || document.getElementById('adminNotificationsCard')) return;

  const section = document.createElement('section');
  section.className = 'card admin-notifications-card';
  section.id = 'adminNotificationsCard';
  section.innerHTML = `
    <div class="admin-notifications-head">
      <div><span class="admin-kicker">🔔 Comunicación</span><h3>Notificaciones a usuarios</h3><p class="muted">Envía un aviso a una persona o a todos los usuarios de Zeqviro.</p></div>
      <span class="pill warn">Solo Admin</span>
    </div>
    <div class="notification-compose-grid">
      <div>
        <label class="notification-label" for="notificationAudience">¿A quién quieres avisar?</label>
        <select id="notificationAudience"><option value="user">Una persona</option><option value="all">Todos los usuarios</option></select>
      </div>
      <div id="notificationUserWrap">
        <label class="notification-label" for="notificationUserSearch">Buscar usuario</label>
        <input id="notificationUserSearch" placeholder="Nombre o correo" autocomplete="off">
        <div id="notificationRecipientResults" class="recipient-results"></div>
        <input id="notificationUserId" type="hidden">
        <div id="notificationSelectedUser" class="selected-recipient" hidden></div>
      </div>
    </div>
    <div class="notification-form-block">
      <label class="notification-label" for="notificationTitle">Título</label>
      <input id="notificationTitle" maxlength="120" placeholder="Ej. Actualización sobre tu cuenta">
      <label class="notification-label" for="notificationBody">Mensaje</label>
      <textarea id="notificationBody" maxlength="2000" rows="5" placeholder="Escribe un mensaje claro y breve..."></textarea>
      <div class="notification-send-row"><span id="notificationStatus" class="muted"></span><button id="sendAdminNotification" class="btn" type="button">Enviar notificación</button></div>
    </div>
    <div class="notification-history-head"><h4>Historial reciente</h4><button id="refreshNotificationHistory" class="btn ghost" type="button">Actualizar historial</button></div>
    <div id="notificationHistory" class="list"><div class="muted">Cargando historial…</div></div>`;

  const settingsCard = document.getElementById('platformSettingsCard');
  if (settingsCard?.parentNode) settingsCard.parentNode.insertBefore(section, settingsCard.nextSibling);
  else main.prepend(section);

  const byId = id => document.getElementById(id);
  let searchTimer = null;

  function setStatus(message, type='') {
    const el = byId('notificationStatus');
    if (!el) return;
    el.textContent = message;
    el.style.color = type === 'error' ? 'var(--danger)' : type === 'ok' ? 'var(--success)' : 'var(--muted)';
  }

  function selectRecipient(row) {
    byId('notificationUserId').value = row.id;
    byId('notificationUserSearch').value = '';
    byId('notificationRecipientResults').innerHTML = '';
    const selected = byId('notificationSelectedUser');
    selected.hidden = false;
    selected.innerHTML = `<strong>${esc(row.name || 'Usuario')}</strong><span>${esc(row.email)}</span><button type="button" id="clearNotificationRecipient">Cambiar</button>`;
    byId('clearNotificationRecipient')?.addEventListener('click', () => {
      byId('notificationUserId').value = '';
      selected.hidden = true;
      selected.innerHTML = '';
      byId('notificationUserSearch').focus();
    });
  }

  async function searchRecipients() {
    const q = byId('notificationUserSearch').value.trim();
    const results = byId('notificationRecipientResults');
    if (q.length < 2) { results.innerHTML = ''; return; }
    try {
      const rows = await api('/api/admin/notifications/recipients?q=' + encodeURIComponent(q));
      results.innerHTML = rows.length ? rows.map(row => `<button type="button" class="recipient-option" data-id="${row.id}" data-name="${esc(row.name || 'Usuario')}" data-email="${esc(row.email)}"><strong>${esc(row.name || 'Usuario')}</strong><span>${esc(row.email)}</span></button>`).join('') : '<div class="muted recipient-none">No encontramos usuarios.</div>';
      results.querySelectorAll('.recipient-option').forEach(button => button.addEventListener('click', () => selectRecipient({ id:Number(button.dataset.id), name:button.dataset.name, email:button.dataset.email })));
    } catch (e) { results.innerHTML = `<div class="muted recipient-none">${esc(e.message)}</div>`; }
  }

  async function loadHistory() {
    const box = byId('notificationHistory');
    try {
      const rows = await api('/api/admin/notifications/history');
      box.innerHTML = rows.length ? rows.map(row => `<div class="item notification-history-item"><div class="notification-history-top"><strong>${esc(row.title)}</strong><span class="pill ${row.audience === 'all' ? 'warn' : 'ok'}">${row.audience === 'all' ? 'Todos' : 'Individual'}</span></div><p>${esc(row.body)}</p><div class="muted">${row.audience === 'all' ? `${row.recipientCount} destinatarios` : esc(row.targetName || row.targetEmail || 'Usuario')} · ${fmtDate(row.createdAt)}</div></div>`).join('') : '<div class="muted">Todavía no se han enviado notificaciones.</div>';
    } catch (e) { box.innerHTML = `<div class="muted">${esc(e.message)}</div>`; }
  }

  async function sendNotification() {
    const audience = byId('notificationAudience').value;
    const userId = Number(byId('notificationUserId').value);
    const title = byId('notificationTitle').value.trim();
    const body = byId('notificationBody').value.trim();
    if (audience === 'user' && !userId) { setStatus('Selecciona un usuario.', 'error'); return; }
    if (title.length < 2) { setStatus('Escribe un título.', 'error'); return; }
    if (body.length < 2) { setStatus('Escribe el mensaje.', 'error'); return; }

    const message = audience === 'all'
      ? 'Este mensaje se enviará a todos los usuarios activos de Zeqviro. Esta acción no se puede deshacer.'
      : 'Este mensaje se enviará únicamente al usuario seleccionado.';
    const ok = await askConfirm({ title: audience === 'all' ? 'Enviar a todos los usuarios' : 'Enviar notificación', message, confirmText: audience === 'all' ? 'Sí, enviar a todos' : 'Enviar' });
    if (!ok) return;
    const button = byId('sendAdminNotification');
    button.disabled = true;
    setStatus('Enviando…');
    try {
      const result = await api('/api/admin/notifications/send', 'POST', { audience, userId: audience === 'user' ? userId : undefined, title, body });
      setStatus(result.message || 'Notificación enviada.', 'ok');
      byId('notificationTitle').value = '';
      byId('notificationBody').value = '';
      await Promise.allSettled([loadHistory(), typeof loadActivity === 'function' ? loadActivity() : Promise.resolve()]);
    } catch (e) { setStatus(e.message || 'No se pudo enviar.', 'error'); }
    finally { button.disabled = false; }
  }

  byId('notificationAudience').addEventListener('change', () => {
    const all = byId('notificationAudience').value === 'all';
    byId('notificationUserWrap').hidden = all;
    setStatus(all ? 'El mensaje se enviará a todos los usuarios activos.' : 'Selecciona una persona.');
  });
  byId('notificationUserSearch').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(searchRecipients, 250); });
  byId('sendAdminNotification').addEventListener('click', sendNotification);
  byId('refreshNotificationHistory').addEventListener('click', loadHistory);
  loadHistory();
})();
