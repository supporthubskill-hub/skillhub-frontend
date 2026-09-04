(() => {
  if (typeof api !== 'function' || typeof askConfirm !== 'function') return;

  const dialog = document.createElement('dialog');
  dialog.id = 'sanctionDialog';
  dialog.innerHTML = `
    <div class="dialog-body">
      <h3>Suspender cuenta</h3>
      <p class="muted">Elige el motivo y cuánto tiempo debe durar la suspensión.</p>
      <label for="sanctionReason"><strong>Motivo</strong></label>
      <select id="sanctionReason" style="width:100%;margin:8px 0 14px">
        <option value="">Selecciona un motivo</option>
        <option>Fraude o engaño</option>
        <option>Abuso o acoso</option>
        <option>Spam o actividad sospechosa</option>
        <option>Incumplimiento de las reglas</option>
        <option>Múltiples reportes</option>
        <option>Otro motivo administrativo</option>
      </select>
      <label for="sanctionDuration"><strong>Duración</strong></label>
      <select id="sanctionDuration" style="width:100%;margin-top:8px">
        <option value="24">24 horas</option>
        <option value="72">3 días</option>
        <option value="168">7 días</option>
        <option value="720">30 días</option>
        <option value="">Hasta que un Admin la reactive</option>
      </select>
      <p class="muted" style="margin-top:12px">La persona recibirá una notificación con el motivo. Las suspensiones temporales se reactivan automáticamente cuando vence el plazo.</p>
    </div>
    <div class="dialog-actions"><button id="cancelSanction" class="btn ghost" type="button">Cancelar</button><button id="confirmSanction" class="btn danger" type="button">Suspender cuenta</button></div>`;
  document.body.appendChild(dialog);

  function requestSanction() {
    return new Promise(resolve => {
      const reason = document.getElementById('sanctionReason');
      const duration = document.getElementById('sanctionDuration');
      const cancel = document.getElementById('cancelSanction');
      const confirm = document.getElementById('confirmSanction');
      reason.value = '';
      duration.value = '24';
      const finish = value => {
        cancel.removeEventListener('click', onCancel);
        confirm.removeEventListener('click', onConfirm);
        if (dialog.open) dialog.close();
        resolve(value);
      };
      const onCancel = () => finish(null);
      const onConfirm = () => {
        if (!reason.value) { reason.focus(); return; }
        finish({ reason: reason.value, durationHours: duration.value === '' ? null : Number(duration.value) });
      };
      cancel.addEventListener('click', onCancel);
      confirm.addEventListener('click', onConfirm);
      dialog.showModal();
    });
  }

  window.userStatus = async function(id, status) {
    let reason = 'Cuenta reactivada desde el panel administrativo';
    let durationHours = null;
    if (status === 'suspended') {
      const choice = await requestSanction();
      if (!choice) return;
      reason = choice.reason;
      durationHours = choice.durationHours;
    } else {
      const ok = await askConfirm({ title:'Reactivar esta cuenta', message:'La persona podrá volver a iniciar sesión y usar Zeqviro.', confirmText:'Reactivar cuenta' });
      if (!ok) return;
    }
    try {
      await api('/api/admin/users/' + id + '/status', 'PATCH', { status, reason, durationHours });
      await Promise.allSettled([loadUsers(), loadStats(), loadActivity(), loadCases()]);
    } catch (e) {
      alert(e.message || 'No se pudo actualizar la cuenta.');
    }
  };
})();
