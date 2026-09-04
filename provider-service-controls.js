(() => {
  const API = 'https://skillhub-backend-b5iy.onrender.com';

  function sessionData() {
    try { return JSON.parse(sessionStorage.getItem('skillhubSession') || 'null'); } catch { return null; }
  }

  function renderQuota() {
    const source = document.getElementById('serviceLimitStatus');
    if (!source) return;
    const text = String(source.textContent || '');
    const match = text.match(/(\d+)\/5[\s\S]*?Te quedan\s+(\d+)/i);
    if (!match) return;
    const used = Math.max(0, Math.min(5, Number(match[1]) || 0));
    const remaining = Math.max(0, Math.min(5, Number(match[2]) || 0));
    let card = document.getElementById('serviceQuotaCard');
    if (!card) {
      card = document.createElement('div');
      card.id = 'serviceQuotaCard';
      card.className = 'service-quota-card';
      source.insertAdjacentElement('afterend', card);
    }
    card.innerHTML = `<div class="service-quota-main"><div><span class="service-quota-label">Intentos de publicación · últimas 24 h</span><strong>${used}<small>/5 usados</small></strong></div><div class="service-quota-remaining">${remaining}<span>disponibles</span></div></div><div class="service-quota-track"><span style="width:${used * 20}%"></span></div><p>Crear un servicio usa 1 intento. <strong>Si lo eliminas, ese intento sigue contando hasta que pasen 24 horas.</strong> Editarlo no consume otro intento.</p>`;
    source.hidden = true;
  }

  async function removeService(id, name) {
    const session = sessionData();
    if (!session?.token) return alert('Inicia sesión para administrar tus servicios.');
    const ok = confirm(`¿Eliminar “${name || 'este servicio'}”?\n\nDejará de aparecer en el marketplace. El intento usado seguirá contando dentro del límite de 5 publicaciones por 24 horas.`);
    if (!ok) return;
    try {
      const response = await fetch(`${API}/api/services/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${session.token}` } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'No se pudo eliminar el servicio');
      if (typeof loadMyServices === 'function') await loadMyServices();
      if (typeof loadCalendar === 'function') await loadCalendar();
      if (typeof fetchServicesFromAPI === 'function') await fetchServicesFromAPI();
      alert('Servicio eliminado del marketplace. El intento seguirá contando durante 24 horas.');
    } catch (error) {
      alert(error.message || 'No se pudo eliminar el servicio.');
    }
  }

  function enhanceServiceCards() {
    document.querySelectorAll('#myServicesList .my-service').forEach((card) => {
      if (card.querySelector('.provider-delete-service')) return;
      const edit = Array.from(card.querySelectorAll('button')).find((button) => /editService\((\d+)\)/.test(button.getAttribute('onclick') || ''));
      const match = edit?.getAttribute('onclick')?.match(/editService\((\d+)\)/);
      if (!edit || !match) return;
      const id = Number(match[1]);
      const name = card.querySelector('strong')?.textContent?.trim() || 'este servicio';
      let actions = card.querySelector('.provider-service-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'provider-service-actions';
        edit.insertAdjacentElement('beforebegin', actions);
        actions.appendChild(edit);
      }
      edit.classList.add('provider-edit-service');
      edit.style.marginTop = '0';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn provider-delete-service';
      button.textContent = 'Eliminar servicio';
      button.addEventListener('click', () => removeService(id, name));
      actions.appendChild(button);
    });
  }

  const helpButton = document.querySelector('#chatContextStrip button');
  if (helpButton) {
    helpButton.removeAttribute('onclick');
    helpButton.addEventListener('click', () => {
      if (typeof switchTab === 'function') switchTab('tab-dashboard');
      setTimeout(() => document.getElementById('tab-dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    });
  }

  const originalLoadMyServices = typeof loadMyServices === 'function' ? loadMyServices : null;
  if (originalLoadMyServices) {
    window.loadMyServices = async function (...args) {
      const result = await originalLoadMyServices.apply(this, args);
      renderQuota();
      enhanceServiceCards();
      return result;
    };
  }

  const limit = document.getElementById('serviceLimitStatus');
  if (limit) new MutationObserver(() => renderQuota()).observe(limit, { childList: true, characterData: true, subtree: true });
  setTimeout(() => { renderQuota(); enhanceServiceCards(); }, 50);
})();
