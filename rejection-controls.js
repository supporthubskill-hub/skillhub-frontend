(() => {
  const originalLoadCalendar = window.loadCalendar;
  const originalOpenBookingChat = window.openBookingChat;
  let bookingRows = [];

  function ensureRejectDialog() {
    let dialog = document.getElementById('rejectBookingDialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'rejectBookingDialog';
    dialog.innerHTML = `
      <form class="dialog-body" id="rejectBookingForm">
        <h3>Rechazar solicitud</h3>
        <p class="service-meta" style="margin-top:8px;">Indica por qué no puedes aceptar esta solicitud.</p>
        <div class="form-group" style="margin-top:14px;">
          <label for="rejectReason">Motivo</label>
          <select id="rejectReason" required>
            <option value="">Selecciona un motivo</option>
            <option value="No estoy disponible en ese horario">No estoy disponible en ese horario</option>
            <option value="No puedo realizar este trabajo en este momento">No puedo realizar este trabajo en este momento</option>
            <option value="Necesito más información antes de aceptar">Necesito más información antes de aceptar</option>
            <option value="Otro motivo">Otro motivo</option>
          </select>
        </div>
        <div class="form-group" id="rejectOtherWrap" hidden>
          <label for="rejectOther">Explica brevemente</label>
          <textarea id="rejectOther" maxlength="300" rows="3" placeholder="Escribe el motivo"></textarea>
        </div>
        <label style="display:flex;gap:9px;align-items:flex-start;margin-top:12px;font-weight:600;">
          <input id="blockFutureRequests" type="checkbox" style="width:auto;margin-top:3px;">
          <span>No aceptar más solicitudes de este usuario para este servicio</span>
        </label>
        <p class="service-meta" style="margin-top:8px;">Si no marcas esta opción, el cliente podrá volver a solicitar después del tiempo de espera.</p>
        <p id="rejectBookingStatus" class="form-error"></p>
        <div class="dialog-actions">
          <button class="btn btn-secondary" type="button" id="rejectCancel">Cancelar</button>
          <button class="btn btn-danger" type="submit">Rechazar solicitud</button>
        </div>
      </form>`;
    document.body.appendChild(dialog);
    dialog.querySelector('#rejectReason').addEventListener('change', (event) => {
      dialog.querySelector('#rejectOtherWrap').hidden = event.target.value !== 'Otro motivo';
    });
    return dialog;
  }

  function askRejection() {
    return new Promise((resolve) => {
      const dialog = ensureRejectDialog();
      const form = dialog.querySelector('#rejectBookingForm');
      const reasonSelect = dialog.querySelector('#rejectReason');
      const other = dialog.querySelector('#rejectOther');
      const block = dialog.querySelector('#blockFutureRequests');
      const status = dialog.querySelector('#rejectBookingStatus');
      form.reset();
      dialog.querySelector('#rejectOtherWrap').hidden = true;
      status.textContent = '';
      const finish = (value) => {
        form.onsubmit = null;
        dialog.querySelector('#rejectCancel').onclick = null;
        dialog.close();
        resolve(value);
      };
      dialog.querySelector('#rejectCancel').onclick = () => finish(null);
      form.onsubmit = (event) => {
        event.preventDefault();
        const reason = reasonSelect.value === 'Otro motivo' ? other.value.trim() : reasonSelect.value;
        if (reason.length < 3) {
          status.textContent = 'Escribe o selecciona un motivo.';
          return;
        }
        finish({ reason, blockFutureRequests: block.checked });
      };
      dialog.showModal();
    });
  }

  window.updateBookingStatus = async function(id, status) {
    let extra = {};
    if (status === 'rejected') {
      const rejection = await askRejection();
      if (!rejection) return;
      extra = rejection;
    }
    const card = [...document.querySelectorAll('#bookingsList .booking-request-card')].find((node) => node.dataset.bookingId === String(id));
    const buttons = card ? [...card.querySelectorAll('button')] : [];
    buttons.forEach((button) => { button.disabled = true; });
    try {
      const response = await fetch(`${API_URL}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ status, ...extra })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'No se pudo actualizar la solicitud');
      await window.loadCalendar();
      await fetchServicesFromAPI();
    } catch (error) {
      const statusBox = document.getElementById('availabilityStatus');
      if (statusBox) {
        statusBox.style.color = 'var(--danger)';
        statusBox.textContent = error.message;
      }
      buttons.forEach((button) => { button.disabled = false; });
    }
  };

  window.loadCalendar = async function() {
    await originalLoadCalendar();
    if (!session || session.user.role === 'admin') return;
    try {
      const response = await fetch(`${API_URL}/api/bookings/me`, { headers: { Authorization: `Bearer ${session.token}` } });
      const rows = await response.json();
      if (!response.ok || !Array.isArray(rows)) return;
      bookingRows = rows;
      const cards = [...document.querySelectorAll('#bookingsList .booking-request-card')];
      cards.forEach((card, index) => {
        const item = rows[index];
        if (!item) return;
        card.dataset.bookingId = String(item.id);
        if (item.status === 'rejected' && item.rejectionReason) {
          const note = document.createElement('p');
          note.className = 'service-meta';
          note.style.marginTop = '9px';
          note.textContent = `Motivo del rechazo: ${item.rejectionReason}`;
          card.querySelector('.booking-request-head')?.after(note);
        }
        if (item.perspective === 'provider' && item.status === 'confirmed' && new Date(item.date).getTime() > Date.now()) {
          const completeButton = [...card.querySelectorAll('button')].find((button) => button.textContent.includes('Marcar completada'));
          if (completeButton) {
            completeButton.disabled = true;
            completeButton.textContent = 'Disponible después de la cita';
            completeButton.title = 'Podrás completar la reserva cuando llegue la fecha y hora programadas.';
          }
        }
      });
    } catch (error) {
      console.error('No se pudieron aplicar los controles de reserva', error);
    }
  };

  window.openBookingChat = async function(serviceId, otherUserId) {
    await originalOpenBookingChat(serviceId, otherUserId);
    const related = bookingRows.find((item) => Number(item.serviceId) === Number(serviceId) && Number(item.otherUserId) === Number(otherUserId));
    if (!related) return;
    const title = document.getElementById('chatTitle');
    const small = title?.querySelector('small');
    if (small) small.textContent = `${related.serviceName} · ${related.perspective === 'provider' ? 'Cliente' : 'Proveedor'}`;
  };

  const reserveButton = [...document.querySelectorAll('#serviceDialog .dialog-actions button')].find((button) => button.textContent.includes('Reservar'));
  if (reserveButton) reserveButton.textContent = '📅 Solicitar reserva';
})();
