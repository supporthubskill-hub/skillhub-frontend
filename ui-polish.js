(() => {
  function addHero(tabId, kicker, title, copy) {
    const tab = document.getElementById(tabId);
    if (!tab || tab.querySelector(':scope > .section-hero')) return;
    tab.insertAdjacentHTML('afterbegin', `<div class="section-hero"><span class="section-hero-kicker">${kicker}</span><h2>${title}</h2><p>${copy}</p></div>`);
  }

  addHero('tab-chat', '💬 Conversaciones', 'Habla con claridad antes de confirmar', 'Mantén los detalles del servicio y la reserva dentro de Zeqviro para que ambas partes tengan el mismo contexto.');
  addHero('tab-dashboard', '🛡️ Centro de confianza', 'Ayuda, seguridad y soporte en un solo lugar', 'Revisa el estado de tu cuenta, consulta tus reportes o disputas y contacta a soporte cuando lo necesites.');

  const dashboard = document.getElementById('tab-dashboard');
  if (dashboard) {
    const firstCard = dashboard.querySelector(':scope > .card');
    if (firstCard && !firstCard.querySelector('.help-quick-grid')) {
      firstCard.insertAdjacentHTML('beforeend', `<div class="help-quick-grid"><div class="help-quick"><strong>💬 Usa el chat</strong><span>Confirma los detalles importantes dentro de la conversación.</span></div><div class="help-quick"><strong>⚑ Reporta problemas</strong><span>Usa reportes o disputas cuando algo no salga como esperabas.</span></div><div class="help-quick"><strong>🔒 Protege tu cuenta</strong><span>No compartas contraseñas ni códigos de verificación.</span></div></div>`);
    }
    const safetyCard = dashboard.querySelectorAll(':scope > .card')[1];
    if (safetyCard && !safetyCard.querySelector('.trust-note')) {
      safetyCard.insertAdjacentHTML('beforeend', `<div class="trust-note"><strong>Pagos reales todavía desactivados</strong>Zeqviro está en beta. No envíes dinero fuera de la plataforma por instrucciones recibidas en el chat.</div>`);
    }
  }

  const layout = document.getElementById('messagesLayout');
  if (layout && !layout.previousElementSibling?.classList?.contains('chat-shell-label')) {
    layout.insertAdjacentHTML('beforebegin', '<div class="chat-shell-label">Tus conversaciones</div>');
  }

  const chatTitle = document.getElementById('chatTitle');
  const chatBox = document.getElementById('chatBox');
  if (chatTitle && chatBox && !document.getElementById('chatContextStrip')) {
    chatTitle.insertAdjacentHTML('afterend', `<div id="chatContextStrip" class="chat-context-strip"><span><strong>Consejo:</strong> acuerda alcance, horario y cambios importantes dentro de este chat.</span><button type="button" onclick="switchTab('tab-dashboard', document.querySelector('.nav-item[data-tab=\'tab-dashboard\']'))">Ayuda y seguridad</button></div>`);
  }

  const input = document.getElementById('chatInput');
  if (input) input.placeholder = 'Escribe un mensaje sobre este servicio…';
})();
