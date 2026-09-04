(() => {
  if (typeof api !== 'function') return;
  const main = document.querySelector('main');
  if (!main || document.getElementById('adminWarningsCard')) return;

  const section = document.createElement('section');
  section.className = 'card admin-warnings-card';
  section.id = 'adminWarningsCard';
  section.innerHTML = `
    <div class="admin-warnings-head"><div><span class="admin-kicker">⚠️ Moderación</span><h3>Advertencias a usuarios</h3><p class="muted">Registra una advertencia formal. El usuario la recibirá también en su centro de notificaciones.</p></div><span class="pill warn">Solo Admin</span></div>
    <div class="warning-grid">
      <div>
        <label class="warning-label" for="warningUserSearch">Usuario</label>
        <input id="warningUserSearch" placeholder="Busca por nombre o correo" autocomplete="off">
        <div id="warningRecipientResults" class="recipient-results"></div>
        <input id="warningUserId" type="hidden">
        <div id="warningSelectedUser" class="selected-recipient" hidden></div>
      </div>
      <div>
        <label class="warning-label" for="warningCategory">Motivo</label>
        <select id="warningCategory"><option value="">Selecciona un motivo</option><option>Incumplimiento de normas</option><option>Conducta inapropiada</option><option>Información engañosa</option><option>Problemas repetidos con reservas</option><option>Otro</option></select>
      </div>
    </div>
    <div class="warning-compose">
      <label class="warning-label" for="warningMessage">Explicación para el usuario</label>
      <textarea id="warningMessage" rows="4" maxlength="1500" placeholder="Explica de forma clara qué ocurrió y qué debe corregir..."></textarea>
      <div class="warning-note">Una advertencia no suspende automáticamente la cuenta. Si necesitas suspenderla, usa los controles existentes en la sección Usuarios.</div>
      <div class="warning-send-row"><span id="warningStatus" class="muted"></span><button id="sendUserWarning" class="btn danger" type="button">Registrar advertencia</button></div>
    </div>
    <div class="warning-history-head"><h4>Historial reciente</h4><button id="refreshWarningHistory" class="btn ghost" type="button">Actualizar historial</button></div>
    <div id="warningHistory" class="list"><div class="muted">Cargando advertencias…</div></div>`;

  const notifications = document.getElementById('adminNotificationsCard');
  if (notifications?.parentNode) notifications.parentNode.insertBefore(section, notifications.nextSibling);
  else main.prepend(section);

  const $w = id => document.getElementById(id);
  let timer = null;

  function status(message, type='') {
    const el = $w('warningStatus');
    el.textContent = message;
    el.style.color = type === 'error' ? 'var(--danger)' : type === 'ok' ? 'var(--success)' : 'var(--muted)';
  }

  function selectUser(row) {
    $w('warningUserId').value = row.id;
    $w('warningUserSearch').value = '';
    $w('warningRecipientResults').innerHTML = '';
    const selected = $w('warningSelectedUser');
    selected.hidden = false;
    selected.innerHTML = `<strong>${esc(row.name || 'Usuario')}</strong><span>${esc(row.email)}</span><button id="clearWarningUser" type="button">Cambiar</button>`;
    $w('clearWarningUser')?.addEventListener('click', () => {
      $w('warningUserId').value = '';
      selected.hidden = true;
      selected.innerHTML = '';
      $w('warningUserSearch').focus();
    });
  }

  async function searchUsers() {
    const q = $w('warningUserSearch').value.trim();
    const results = $w('warningRecipientResults');
    if (q.length < 2) { results.innerHTML = ''; return; }
    try {
      const rows = await api('/api/admin/notifications/recipients?q=' + encodeURIComponent(q));
      results.innerHTML = rows.length ? rows.map(row => `<button type="button" class="recipient-option" data-id="${row.id}" data-name="${esc(row.name || 'Usuario')}" data-email="${esc(row.email)}"><strong>${esc(row.name || 'Usuario')}</strong><span>${esc(row.email)}</span></button>`).join('') : '<div class="muted recipient-none">No encontramos usuarios.</div>';
      results.querySelectorAll('.recipient-option').forEach(button => button.addEventListener('click', () => selectUser({ id:Number(button.dataset.id), name:button.dataset.name, email:button.dataset.email })));
    } catch (e) { results.innerHTML = `<div class="muted recipient-none">${esc(e.message)}</div>`; }
  }

  async function loadHistory() {
    const box = $w('warningHistory');
    try {
      const rows = await api('/api/admin/warnings');
      box.innerHTML = rows.length ? rows.map(row => `<div class="item warning-history-item"><div class="warning-history-top"><div><strong>${esc(row.userName || row.userEmail || 'Usuario')}</strong><span>${esc(row.category)}</span></div><span class="pill ${row.status === 'active' ? 'warn' : 'ok'}">${row.status === 'active' ? 'Activa' : 'Resuelta'}</span></div><p>${esc(row.message)}</p><div class="muted">${esc(row.userEmail || '')} · ${fmtDate(row.createdAt)}</div>${row.status === 'active' ? `<button class="btn ghost resolve-warning" type="button" data-id="${row.id}">Marcar como resuelta</button>` : ''}</div>`).join('') : '<div class="muted">Todavía no hay advertencias registradas.</div>';
      box.querySelectorAll('.resolve-warning').forEach(button => button.addEventListener('click', async () => {
        button.disabled = true;
        try { await api('/api/admin/warnings/' + button.dataset.id + '/resolve', 'PATCH', {}); await loadHistory(); }
        catch (e) { alert(e.message || 'No se pudo actualizar la advertencia.'); button.disabled = false; }
      }));
    } catch (e) { box.innerHTML = `<div class="muted">${esc(e.message)}</div>`; }
  }

  async function sendWarning() {
    const userId = Number($w('warningUserId').value);
    const category = $w('warningCategory').value;
    const message = $w('warningMessage').value.trim();
    if (!userId) return status('Selecciona un usuario.', 'error');
    if (!category) return status('Selecciona un motivo.', 'error');
    if (message.length < 4) return status('Escribe una explicación breve.', 'error');
    const ok = confirm('¿Registrar esta advertencia?\n\nEl usuario recibirá una notificación con el motivo y la explicación.');
    if (!ok) return;
    const button = $w('sendUserWarning');
    button.disabled = true;
    status('Registrando…');
    try {
      const result = await api('/api/admin/warnings', 'POST', { userId, category, message });
      status(result.message || 'Advertencia registrada.', 'ok');
      $w('warningMessage').value = '';
      $w('warningCategory').value = '';
      await Promise.allSettled([loadHistory(), typeof loadActivity === 'function' ? loadActivity() : Promise.resolve()]);
    } catch (e) { status(e.message || 'No se pudo registrar.', 'error'); }
    finally { button.disabled = false; }
  }

  $w('warningUserSearch').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(searchUsers, 250); });
  $w('sendUserWarning').addEventListener('click', sendWarning);
  $w('refreshWarningHistory').addEventListener('click', loadHistory);
  loadHistory();
})();
