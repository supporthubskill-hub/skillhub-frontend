(() => {
  const statusLabel = (status) => window.ZeqviroStatusLabel ? window.ZeqviroStatusLabel(status) : ({
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    rejected: 'Rechazada',
    cancelled: 'Cancelada',
    completed: 'Completada'
  }[status] || status);
  const formatDateTime = (value) => new Date(value).toLocaleString(window.ZeqviroI18n?.locale || 'es-US');

  window.renderServices = function(items) {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = '';
    items.forEach((s) => {
      const cleanName = escapeHtml(filterOffensiveContent(s.name));
      const cleanDesc = escapeHtml(filterOffensiveContent(s.desc));
      const cleanCat = escapeHtml(s.cat || s.category || 'Servicio');
      const cleanArea = escapeHtml(s.area || 'Remoto');
      const price = Number(s.price) || 0;
      const hourly = Number(s.hourly) || 0;
      const hasAvailability = s.hasAvailability !== false;
      grid.innerHTML += `
        <div class="service-card">
          <div>
            <span class="service-tag">${cleanCat} · ${cleanArea}</span>
            <h4 style="margin-top:8px;">${cleanName}</h4>
            <p class="service-description">${cleanDesc}</p>
            <div class="rating" style="margin-top:8px;">⭐ ${s.rating || 5.0}</div>
          </div>
          <div>
            <div class="price">${price.toFixed(2)} USD <span class="hourly-price">(${hourly.toFixed(2)}/hr)</span></div>
            <button class="conversation-item provider-link" onclick="openProviderProfile(${Number(s.providerId)})">Por ${escapeHtml(s.providerName || 'Proveedor de Zeqviro')} · Ver perfil</button>
            ${hasAvailability ? '<p class="availability-ready">● Horarios disponibles</p>' : '<p class="availability-empty">Sin horarios disponibles por ahora</p>'}
            <div class="service-actions">
              <button class="btn btn-secondary" onclick="openServiceDialog(${Number(s.id)})">Ver detalles</button>
              ${hasAvailability
                ? `<button class="btn btn-success" onclick="openServiceDialog(${Number(s.id)}, true)">Solicitar reserva</button>`
                : `<button class="btn" onclick="openServiceDialog(${Number(s.id)})">Contactar</button>`}
            </div>
          </div>
        </div>`;
    });
  };

  window.loadConversations = async function(targetConversation = null) {
    const notice = document.getElementById('chatLoginNotice');
    const layout = document.getElementById('messagesLayout');
    if (!session || session.user.role === 'admin') {
      notice.hidden = false;
      layout.hidden = true;
      return [];
    }
    notice.hidden = true;
    layout.hidden = false;
    const list = document.getElementById('conversationList');
    list.innerHTML = '<div class="chat-empty">Cargando conversaciones…</div>';
    try {
      const response = await fetch(`${API_URL}/api/conversations`, { headers: { Authorization: `Bearer ${session.token}` } });
      const items = await response.json();
      if (!response.ok) throw new Error(items.error || 'No se pudieron cargar las conversaciones');
      list.innerHTML = '';
      if (!items.length) {
        list.innerHTML = '<div class="chat-empty">Aún no tienes conversaciones.</div>';
        return [];
      }
      let targetButton = null;
      let targetItem = null;
      items.forEach((item) => {
        const button = document.createElement('button');
        button.className = 'conversation-item conversation-card';
        button.innerHTML = `<div class="conversation-avatar">${escapeHtml((item.otherUserName || 'U').slice(0,1).toUpperCase())}</div><div class="conversation-copy"><strong>${escapeHtml(item.otherUserName)}</strong><small>${escapeHtml(item.serviceName)}</small><small class="conversation-preview">${escapeHtml(item.lastMessage)}</small></div>`;
        button.onclick = () => openConversation(item, button);
        list.appendChild(button);
        if (targetConversation && Number(item.serviceId) === Number(targetConversation.serviceId) && Number(item.otherUserId) === Number(targetConversation.otherUserId)) {
          targetButton = button;
          targetItem = item;
        }
      });
      if (targetItem && targetButton) await openConversation(targetItem, targetButton);
      return items;
    } catch (error) {
      document.getElementById('chatStatus').textContent = error.message;
      return [];
    }
  };

  window.openConversation = async function(item, button) {
    activeConversation = item;
    document.querySelectorAll('.conversation-item').forEach((el) => el.classList.remove('active'));
    if (button) button.classList.add('active');
    document.getElementById('chatTitle').innerHTML = `<span class="chat-person">${escapeHtml(item.otherUserName)}</span><small>${escapeHtml(item.serviceName)}</small>`;
    const box = document.getElementById('chatBox');
    box.innerHTML = '<div class="chat-empty">Cargando mensajes…</div>';
    try {
      const response = await fetch(`${API_URL}/api/messages/${item.serviceId}/${item.otherUserId}`, { headers: { Authorization: `Bearer ${session.token}` } });
      const messages = await response.json();
      if (!response.ok) throw new Error(messages.error || 'No se pudo abrir la conversación');
      box.innerHTML = '';
      messages.forEach((msg) => {
        const node = document.createElement('div');
        node.className = String(msg.senderId) === String(session.user.id) ? 'msg me' : 'msg';
        node.textContent = msg.body;
        box.appendChild(node);
      });
      if (!messages.length) box.innerHTML = '<div class="chat-empty">Empieza la conversación.</div>';
      box.scrollTop = box.scrollHeight;
    } catch (error) {
      document.getElementById('chatStatus').textContent = error.message;
    }
  };

  window.bookService = async function() {
    const status = document.getElementById('serviceDialogStatus');
    if (!session || session.user.role === 'admin') {
      status.textContent = 'Inicia sesión para solicitar una reserva.';
      return;
    }
    const date = document.getElementById('bookingDate').value;
    const notes = document.getElementById('sellerMessage').value.trim();
    if (!date) {
      status.textContent = 'Selecciona una fecha y hora.';
      return;
    }
    status.style.color = 'var(--text)';
    status.textContent = 'Enviando solicitud…';
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ serviceId: selectedServiceId, date, notes })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'No se pudo enviar la solicitud');
      document.getElementById('serviceDialog').close();
      await fetchServicesFromAPI();
      await switchTab('tab-chat', document.querySelector('.nav-item[data-tab="tab-chat"]'));
      if (data.conversation) await loadConversations(data.conversation);
      document.getElementById('chatStatus').style.color = 'var(--success)';
      document.getElementById('chatStatus').textContent = 'Solicitud enviada. Habla con el proveedor mientras decide si acepta.';
    } catch (error) {
      status.style.color = 'var(--danger)';
      status.textContent = error.message;
    }
  };

  window.openBookingChat = async function(serviceId, otherUserId) {
    await switchTab('tab-chat', document.querySelector('.nav-item[data-tab="tab-chat"]'));
    await loadConversations({ serviceId, otherUserId });
  };

  window.loadCalendar = async function() {
    const serviceSelect = document.getElementById('availabilityService');
    const list = document.getElementById('availabilityList');
    const bookings = document.getElementById('bookingsList');
    if (!session || session.user.role === 'admin') {
      serviceSelect.innerHTML = '<option value="">Inicia sesión</option>';
      list.innerHTML = '';
      bookings.innerHTML = '<div class="chat-empty">Inicia sesión para ver tus reservaciones.</div>';
      return;
    }
    if (!myServicesData.length) await loadMyServices();
    serviceSelect.innerHTML = '<option value="">Selecciona un servicio</option>';
    myServicesData.filter((x) => x.active !== false).forEach((x) => serviceSelect.add(new Option(x.name, x.id)));
    try {
      const headers = { Authorization: `Bearer ${session.token}` };
      const [sr, br] = await Promise.all([
        fetch(`${API_URL}/api/availability/me`, { headers }),
        fetch(`${API_URL}/api/bookings/me`, { headers })
      ]);
      const slots = await sr.json();
      const rows = await br.json();
      if (!sr.ok) throw new Error(slots.error || 'No se pudo cargar la disponibilidad');
      if (!br.ok) throw new Error(rows.error || 'No se pudieron cargar las reservas');
      myAvailabilityData = slots;
      list.innerHTML = slots.length ? slots.map((x) => `<div class="booking-slot-card"><strong>${escapeHtml(x.serviceName)}</strong><p class="service-meta">${formatDateTime(x.startsAt)} · ${x.durationMinutes} min</p><span class="booking-status ${x.available ? 'status-open' : 'status-held'}">${x.available ? 'Disponible' : 'Apartado por una solicitud'}</span>${x.available ? `<div class="dialog-actions"><button class="btn btn-secondary" onclick="editAvailability(${x.id})">Editar</button><button class="btn btn-danger" onclick="deleteAvailability(${x.id})">Eliminar</button></div>` : ''}</div>`).join('') : '<div class="chat-empty">No has añadido horarios.</div>';

      bookings.innerHTML = rows.length ? rows.map((item) => {
        const status = statusLabel(item.status);
        const chatButton = item.serviceId && item.otherUserId ? `<button class="btn btn-secondary" onclick="openBookingChat(${Number(item.serviceId)},${Number(item.otherUserId)})">💬 Abrir chat</button>` : '';
        let actions = chatButton;
        if (item.perspective === 'provider' && item.status === 'pending') {
          actions += `<button class="btn btn-success" onclick="updateBookingStatus(${item.id},'confirmed')">✓ Aceptar</button><button class="btn btn-danger" onclick="updateBookingStatus(${item.id},'rejected')">Rechazar</button>`;
        } else if (item.perspective === 'client' && item.status === 'pending') {
          actions += `<button class="btn btn-danger" onclick="updateBookingStatus(${item.id},'cancelled')">Cancelar solicitud</button>`;
        } else if (item.perspective === 'provider' && item.status === 'confirmed') {
          actions += `<button class="btn btn-success" onclick="updateBookingStatus(${item.id},'completed')">Marcar completada</button><button class="btn btn-danger" onclick="updateBookingStatus(${item.id},'cancelled')">Cancelar</button>`;
        } else if (item.perspective === 'client' && item.status === 'confirmed') {
          actions += `<button class="btn btn-danger" onclick="updateBookingStatus(${item.id},'cancelled')">Cancelar</button>`;
        } else if (item.perspective === 'client' && item.status === 'completed') {
          actions += `<button class="btn" onclick="switchTab('tab-reviews')">⭐ Dejar reseña</button>`;
        }
        if (item.status === 'confirmed' || item.status === 'completed') {
          actions += `<button class="booking-link" onclick="openDisputeDialog(${item.id})">¿Tuviste un problema? Abrir disputa</button>`;
        }
        return `<div class="booking-request-card"><div class="booking-request-head"><div><strong>${escapeHtml(item.serviceName)}</strong><p class="service-meta">${formatDateTime(item.date)} · ${item.perspective === 'provider' ? 'Solicitud de cliente' : 'Tu solicitud'}</p></div><span class="booking-status status-${escapeHtml(item.status)}">${escapeHtml(status)}</span></div><div class="booking-actions">${actions}</div></div>`;
      }).join('') : '<div class="chat-empty">Aún no tienes solicitudes o reservas.</div>';
    } catch (error) {
      const status = document.getElementById('availabilityStatus');
      if (status) status.textContent = error.message;
    }
  };
})();
