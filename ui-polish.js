(() => {
  function addHero(tabId, kicker, title, copy) {
    const tab = document.getElementById(tabId);
    if (!tab || tab.querySelector(':scope > .section-hero')) return;
    tab.insertAdjacentHTML('afterbegin', `<div class="section-hero"><span class="section-hero-kicker">${kicker}</span><h2>${title}</h2><p>${copy}</p></div>`);
  }

  addHero('tab-publish', '🛠️ Tus servicios', 'Publica y administra tus servicios', 'Primero explica qué haces. Después añade un horario para empezar a recibir solicitudes.');
  addHero('tab-profile', '👤 Tu perfil', 'Ayuda a las personas a conocerte', 'Añade solo la información que quieras mostrar. Un perfil claro genera más confianza.');
  addHero('tab-chat', '💬 Conversaciones', 'Habla con claridad antes de confirmar', 'Mantén aquí los detalles del servicio y de la reserva para que ambas partes tengan el mismo contexto.');
  addHero('tab-dashboard', '🛡️ Centro de confianza', 'Ayuda, seguridad y soporte en un solo lugar', 'Revisa tu cuenta, tus reportes o disputas y contacta a soporte cuando lo necesites.');

  const searchTab = document.getElementById('tab-search');
  if (searchTab) {
    const hero = searchTab.querySelector('.marketplace-hero');
    const searchInput = document.getElementById('searchInput');
    const areaFilter = document.getElementById('areaFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchCard = searchInput?.closest('.card');

    if (hero && searchInput && areaFilter && !hero.querySelector('.hero-search-box')) {
      searchInput.placeholder = '¿Qué servicio necesitas?';
      searchInput.setAttribute('aria-label', 'Servicio que necesitas');
      areaFilter.placeholder = '¿En qué ciudad o área? (opcional)';
      areaFilter.setAttribute('aria-label', 'Ciudad o área opcional');

      const searchBox = document.createElement('div');
      searchBox.className = 'hero-search-box';
      searchBox.innerHTML = '<div class="hero-search-heading"><strong>Busca un servicio</strong><span>Escribe lo que necesitas y, si quieres, tu zona.</span></div><div class="hero-search-fields"></div><button class="btn hero-search-button" type="button">Buscar servicios</button>';
      const fields = searchBox.querySelector('.hero-search-fields');
      fields.append(searchInput, areaFilter);
      searchBox.querySelector('.hero-search-button').addEventListener('click', () => {
        if (typeof filterServices === 'function') filterServices();
        document.getElementById('servicesGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      const heroCopy = hero.querySelector('.marketplace-hero-copy') || hero;
      const actions = hero.querySelector('.marketplace-hero-actions');
      if (actions) heroCopy.insertBefore(searchBox, actions); else heroCopy.appendChild(searchBox);

      const primary = hero.querySelector('.marketplace-primary');
      if (primary) primary.hidden = true;
      const secondary = hero.querySelector('.marketplace-secondary');
      if (secondary) secondary.textContent = '¿Ofreces un servicio? Publicar servicio';
    }

    if (searchCard && categoryFilter && typeFilter && sortFilter && !searchCard.querySelector('.compact-filters')) {
      const details = document.createElement('details');
      details.className = 'compact-filters';
      details.innerHTML = '<summary><span>⚙️ Filtros opcionales</span><small>Categoría, modalidad y orden</small></summary><div class="compact-filter-grid"></div>';
      const grid = details.querySelector('.compact-filter-grid');
      grid.append(categoryFilter, typeFilter, sortFilter);
      searchCard.innerHTML = '';
      searchCard.classList.add('compact-filter-card');
      searchCard.appendChild(details);
    }
  }

  const publish = document.getElementById('tab-publish');
  if (publish) {
    const cards = publish.querySelectorAll(':scope > .card');
    const createCard = cards[0];
    const availabilityCard = cards[1];
    const bookingsCard = cards[2];
    if (createCard) {
      createCard.classList.add('guided-card','guided-create');
      const title = createCard.querySelector('#serviceFormTitle');
      if (title) title.innerHTML = '<span class="step-badge">1</span> Describe tu servicio';
      const intro = title?.nextElementSibling;
      if (intro) intro.textContent = 'Cuéntale al cliente qué haces, cuánto cuesta y dónde puedes hacerlo.';
      const limit = document.getElementById('serviceLimitStatus');
      if (limit) limit.classList.add('soft-info');
      const submit = document.getElementById('serviceSubmitButton');
      if (submit && !submit.dataset.clearLabel) { submit.textContent = 'Guardar servicio'; submit.dataset.clearLabel = '1'; }
    }
    if (availabilityCard) {
      availabilityCard.classList.add('guided-card','guided-availability');
      const h3 = availabilityCard.querySelector('h3');
      if (h3) h3.innerHTML = '<span class="step-badge">2</span> Añade tus horarios';
      const paragraphs = availabilityCard.querySelectorAll(':scope > p.service-meta');
      if (paragraphs[0]) paragraphs[0].innerHTML = '<strong>¿Cuándo puedes trabajar?</strong> Añade al menos un horario futuro para poder recibir solicitudes.';
      if (paragraphs[1]) paragraphs[1].textContent = 'Elige el servicio, la fecha, la hora y cuánto durará aproximadamente.';
      const button = document.getElementById('availabilitySubmitButton');
      if (button) button.textContent = 'Añadir este horario';
    }
    if (bookingsCard) {
      bookingsCard.classList.add('guided-card','guided-bookings');
      const h3 = bookingsCard.querySelector('h3');
      if (h3) h3.innerHTML = '<span class="step-badge">3</span> Solicitudes y reservas';
      if (!h3?.nextElementSibling?.classList?.contains('section-explainer')) h3?.insertAdjacentHTML('afterend','<p class="service-meta section-explainer">Aquí verás quién solicita tu servicio y podrás aceptar, rechazar o abrir el chat.</p>');
    }
  }

  const profile = document.getElementById('tab-profile');
  if (profile) {
    const card = profile.querySelector(':scope > .card');
    card?.classList.add('guided-card','profile-guided');
    const h3 = card?.querySelector('h3');
    if (h3) h3.textContent = 'Completa tu perfil';
    const intro = h3?.nextElementSibling;
    if (intro) intro.textContent = 'Todo excepto tu nombre es opcional. Añade lo que ayude a explicar quién eres y qué servicios puedes ofrecer.';
    const form = document.getElementById('profilePageForm');
    if (form && !form.querySelector('.profile-guide-note')) {
      form.insertAdjacentHTML('afterbegin','<div class="profile-guide-note"><strong>No tienes que llenarlo todo.</strong><span>Empieza con tu título, una biografía corta y tu ciudad. Puedes completar el resto después.</span></div>');
    }
    const save = form?.querySelector('button[type="submit"]');
    if (save) save.textContent = 'Guardar cambios';
  }

  const dashboard = document.getElementById('tab-dashboard');
  if (dashboard) {
    const firstCard = dashboard.querySelector(':scope > .card');
    if (firstCard && !firstCard.querySelector('.help-quick-grid')) firstCard.insertAdjacentHTML('beforeend', `<div class="help-quick-grid"><div class="help-quick"><strong>💬 Usa el chat</strong><span>Confirma los detalles importantes dentro de la conversación.</span></div><div class="help-quick"><strong>⚑ Reporta problemas</strong><span>Usa reportes o disputas cuando algo no salga como esperabas.</span></div><div class="help-quick"><strong>🔒 Protege tu cuenta</strong><span>No compartas contraseñas ni códigos de verificación.</span></div></div>`);
    const safetyCard = dashboard.querySelectorAll(':scope > .card')[1];
    if (safetyCard && !safetyCard.querySelector('.trust-note')) safetyCard.insertAdjacentHTML('beforeend', `<div class="trust-note"><strong>Pagos reales todavía desactivados</strong>Zeqviro está en beta. No envíes dinero fuera de la plataforma por instrucciones recibidas en el chat.</div>`);
  }

  const layout = document.getElementById('messagesLayout');
  if (layout && !layout.previousElementSibling?.classList?.contains('chat-shell-label')) layout.insertAdjacentHTML('beforebegin', '<div class="chat-shell-label">Tus conversaciones</div>');
  const chatTitle = document.getElementById('chatTitle');
  const chatBox = document.getElementById('chatBox');
  if (chatTitle && chatBox && !document.getElementById('chatContextStrip')) chatTitle.insertAdjacentHTML('afterend', `<div id="chatContextStrip" class="chat-context-strip"><span><strong>Consejo:</strong> acuerda el trabajo, el horario y cualquier cambio dentro de este chat.</span><button type="button" onclick="switchTab('tab-dashboard', document.querySelector('.nav-item[data-tab=\'tab-dashboard\']'))">Ayuda y seguridad</button></div>`);
  const input = document.getElementById('chatInput');
  if (input) input.placeholder = 'Escribe un mensaje sobre este servicio…';
})();
