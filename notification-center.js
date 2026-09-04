(() => {
  const getSession = () => {
    try { return JSON.parse(sessionStorage.getItem('skillhubSession') || 'null'); }
    catch { return null; }
  };
  const apiBase = typeof API_URL === 'string' ? API_URL : 'https://skillhub-backend-b5iy.onrender.com';
  const escText = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const formatDate = (value) => value ? new Date(value).toLocaleString('es-US', { dateStyle:'medium', timeStyle:'short' }) : '';

  async function request(path, method='GET') {
    const session = getSession();
    if (!session?.token) throw new Error('Inicia sesión para ver tus notificaciones.');
    const response = await fetch(apiBase + path, { method, headers: { 'Authorization': 'Bearer ' + session.token, 'Content-Type':'application/json' } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'No se pudieron cargar las notificaciones.');
    return data;
  }

  function renderCenter(data) {
    const tab = document.getElementById('tab-notifications');
    if (!tab) return;
    const rows = Array.isArray(data.notifications) ? data.notifications : [];
    const session = getSession();
    const inner = !session?.token
      ? '<div class="notification-empty"><strong>🔔 Tus avisos aparecerán aquí</strong><span>Inicia sesión para ver mensajes de Zeqviro.</span></div>'
      : rows.length
        ? `<div class="notification-toolbar"><span>${data.unreadCount || 0} sin leer</span>${data.unreadCount ? '<button type="button" class="notification-link" id="markAllNotifications">Marcar todo como leído</button>' : ''}</div><div class="notification-list">${rows.map(row => `<button type="button" class="notification-item ${row.readAt ? '' : 'unread'}" data-notification-id="${row.id}"><span class="notification-dot" aria-hidden="true"></span><span class="notification-copy"><strong>${escText(row.title)}</strong><span>${escText(row.body)}</span><small>${escText(formatDate(row.createdAt))}</small></span></button>`).join('')}</div>`
        : '<div class="notification-empty"><strong>✨ Todo al día</strong><span>No tienes notificaciones por ahora.</span></div>';
    tab.innerHTML = `<div class="notification-hero"><span>🔔 Centro de notificaciones</span><h2>Mensajes importantes de Zeqviro</h2><p>Aquí verás avisos enviados por el equipo de Zeqviro sobre tu cuenta, reservas o novedades de la plataforma.</p></div><div class="card notification-card">${inner}</div>`;
    bindNotificationActions();
  }

  function updateBadge(count) {
    const badge = document.getElementById('notif-count');
    if (!badge) return;
    const n = Number(count || 0);
    badge.textContent = String(n);
    badge.parentElement?.classList.toggle('has-notifications', n > 0);
  }

  async function loadNotifications() {
    const session = getSession();
    if (!session?.token) { updateBadge(0); renderCenter({ notifications:[], unreadCount:0 }); return; }
    try {
      const data = await request('/api/notifications');
      updateBadge(data.unreadCount);
      renderCenter(data);
    } catch (error) {
      const tab = document.getElementById('tab-notifications');
      if (tab) tab.innerHTML = `<div class="card notification-card"><div class="notification-empty"><strong>No pudimos cargar tus notificaciones</strong><span>${escText(error.message)}</span><button type="button" class="btn" onclick="window.loadZeqviroNotifications?.()">Intentar otra vez</button></div></div>`;
    }
  }

  async function markRead(id) {
    try { await request(`/api/notifications/${id}/read`, 'PATCH'); await loadNotifications(); }
    catch (error) { console.error(error); }
  }

  async function markAllRead() {
    try { await request('/api/notifications/read-all', 'PATCH'); await loadNotifications(); }
    catch (error) { console.error(error); }
  }

  function bindNotificationActions() {
    document.querySelectorAll('[data-notification-id].unread').forEach(el => el.addEventListener('click', () => markRead(el.dataset.notificationId)));
    document.getElementById('markAllNotifications')?.addEventListener('click', markAllRead);
  }

  const originalSwitchTab = window.switchTab;
  if (typeof originalSwitchTab === 'function') {
    window.switchTab = function(tabId, button) {
      const result = originalSwitchTab.apply(this, arguments);
      if (tabId === 'tab-notifications') loadNotifications();
      return result;
    };
  }

  window.loadZeqviroNotifications = loadNotifications;
  setTimeout(loadNotifications, 350);
  setInterval(() => { if (getSession()?.token) loadNotifications(); }, 60000);
})();
