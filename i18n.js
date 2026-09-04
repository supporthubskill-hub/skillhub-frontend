(() => {
  const STORAGE_KEY = 'zeqviroLanguage';
  const supported = ['es','en','pt','fr','zh'];
  const labels = { es:'Español', en:'English', pt:'Português', fr:'Français', zh:'中文' };
  const locales = { es:'es-US', en:'en-US', pt:'pt-BR', fr:'fr-FR', zh:'zh-CN' };

  const t = {
    en: {
      'Inicio':'Home','Buscar':'Search','Publicar':'Services','Mensajes':'Messages','Perfil':'Profile','Ayuda':'Help','Notificaciones':'Notifications','Cerrar sesión':'Sign out','Iniciar sesión':'Sign in','Entrar':'Sign in','Registrarse':'Create account',
      'Publica y administra tus servicios':'Publish and manage your services','Primero explica qué haces. Después añade un horario para empezar a recibir solicitudes.':'First explain what you do. Then add availability to start receiving requests.','🛠️ Tus servicios':'🛠️ Your services',
      'Ayuda a las personas a conocerte':'Help people get to know you','Añade solo la información que quieras mostrar. Un perfil claro genera más confianza.':'Only add information you want to display. A clear profile builds more trust.','👤 Tu perfil':'👤 Your profile',
      'Habla con claridad antes de confirmar':'Talk clearly before confirming','Mantén aquí los detalles del servicio y de la reserva para que ambas partes tengan el mismo contexto.':'Keep service and booking details here so both sides have the same context.','💬 Conversaciones':'💬 Conversations',
      'Ayuda, seguridad y soporte en un solo lugar':'Help, safety and support in one place','Revisa tu cuenta, tus reportes o disputas y contacta a soporte cuando lo necesites.':'Review your account, reports or disputes, and contact support when needed.','🛡️ Centro de confianza':'🛡️ Trust center',
      'Busca un servicio':'Find a service','Escribe lo que necesitas y, si quieres, tu zona.':'Describe what you need and, if you want, your area.','Buscar servicios':'Search services','¿Ofreces un servicio? Publicar servicio':'Offer a service? Publish it','⚙️ Filtros opcionales':'⚙️ Optional filters','Categoría, modalidad y orden':'Category, format and sorting',
      'Describe tu servicio':'Describe your service','Cuéntale al cliente qué haces, cuánto cuesta y dónde puedes hacerlo.':'Tell clients what you do, how much it costs, and where you can do it.','Guardar servicio':'Save service','Añade tus horarios':'Add your availability','¿Cuándo puedes trabajar?':'When can you work?','Añade al menos un horario futuro para poder recibir solicitudes.':'Add at least one future time slot to receive requests.','Elige el servicio, la fecha, la hora y cuánto durará aproximadamente.':'Choose the service, date, time, and approximate duration.','Añadir este horario':'Add this time','Solicitudes y reservas':'Requests and bookings','Aquí verás quién solicita tu servicio y podrás aceptar, rechazar o abrir el chat.':'Here you can see who requests your service and accept, reject, or open the chat.',
      'Completa tu perfil':'Complete your profile','Todo excepto tu nombre es opcional. Añade lo que ayude a explicar quién eres y qué servicios puedes ofrecer.':'Everything except your name is optional. Add what helps explain who you are and what services you offer.','No tienes que llenarlo todo.':'You do not have to fill everything in.','Empieza con tu título, una biografía corta y tu ciudad. Puedes completar el resto después.':'Start with your title, a short bio, and your city. You can complete the rest later.','Guardar cambios':'Save changes',
      '💬 Usa el chat':'💬 Use chat','Confirma los detalles importantes dentro de la conversación.':'Confirm important details inside the conversation.','⚑ Reporta problemas':'⚑ Report problems','Usa reportes o disputas cuando algo no salga como esperabas.':'Use reports or disputes when something does not go as expected.','🔒 Protege tu cuenta':'🔒 Protect your account','No compartas contraseñas ni códigos de verificación.':'Do not share passwords or verification codes.','Pagos reales todavía desactivados':'Real payments are still disabled','Zeqviro está en beta. No envíes dinero fuera de la plataforma por instrucciones recibidas en el chat.':'Zeqviro is in beta. Do not send money outside the platform based on instructions received in chat.','Tus conversaciones':'Your conversations','Consejo:':'Tip:','acuerda el trabajo, el horario y cualquier cambio dentro de este chat.':'agree on the work, schedule, and any changes inside this chat.','Ayuda y seguridad':'Help and safety',
      'Vista previa':'Preview','⏸️ Pausar':'⏸️ Pause','▶️ Reactivar':'▶️ Reactivate','Eliminar servicio':'Delete service','Editar servicio':'Edit service','🟢 Publicado':'🟢 Published','🟡 Falta disponibilidad':'🟡 Missing availability','⏸ Pausado':'⏸ Paused','No visible para clientes hasta que lo reactives':'Hidden from clients until you reactivate it','Vista previa del servicio':'Service preview','Vista del cliente':'Client view','Así se presenta la información principal de tu servicio. Puedes editarlo antes de recibir solicitudes.':'This is how the main service information appears. You can edit it before receiving requests.','Eliminar servicio':'Delete service','Cerrar':'Close','Confirmar':'Confirm','Servicios':'Services','Solicitudes pendientes':'Pending requests','por revisar':'to review','Próxima reserva':'Next booking','confirmada':'confirmed','pausado':'paused','pausados':'paused',
      '🔔 Centro de notificaciones':'🔔 Notification center','Mensajes importantes de Zeqviro':'Important Zeqviro messages','Aquí verás avisos enviados por el equipo de Zeqviro sobre tu cuenta, reservas o novedades de la plataforma.':'Here you will see messages from the Zeqviro team about your account, bookings, or platform updates.','Marcar todo como leído':'Mark all as read','✨ Todo al día':'✨ All caught up','No tienes notificaciones por ahora.':'You have no notifications right now.','🔔 Tus avisos aparecerán aquí':'🔔 Your notices will appear here','Inicia sesión para ver mensajes de Zeqviro.':'Sign in to see Zeqviro messages.','No pudimos cargar tus notificaciones':'We could not load your notifications','Intentar otra vez':'Try again',
      'Idioma':'Language','La interfaz cambió de idioma. Los mensajes, biografías y descripciones escritos por usuarios no se traducen automáticamente.':'The interface language changed. User-written messages, bios, and service descriptions are not translated automatically.'
    },
    pt: {
      'Inicio':'Início','Buscar':'Buscar','Publicar':'Serviços','Mensajes':'Mensagens','Perfil':'Perfil','Ayuda':'Ajuda','Notificaciones':'Notificações','Cerrar sesión':'Sair','Iniciar sesión':'Entrar','Entrar':'Entrar','Registrarse':'Criar conta',
      'Publica y administra tus servicios':'Publique e gerencie seus serviços','Primero explica qué haces. Después añade un horario para empezar a recibir solicitudes.':'Primeiro explique o que você faz. Depois adicione horários para começar a receber solicitações.','🛠️ Tus servicios':'🛠️ Seus serviços','Ayuda a las personas a conocerte':'Ajude as pessoas a conhecer você','Añade solo la información que quieras mostrar. Un perfil claro genera más confianza.':'Adicione apenas as informações que deseja mostrar. Um perfil claro gera mais confiança.','👤 Tu perfil':'👤 Seu perfil','Habla con claridad antes de confirmar':'Converse com clareza antes de confirmar','Mantén aquí los detalles del servicio y de la reserva para que ambas partes tengan el mismo contexto.':'Mantenha aqui os detalhes do serviço e da reserva para que ambos tenham o mesmo contexto.','💬 Conversaciones':'💬 Conversas','Ayuda, seguridad y soporte en un solo lugar':'Ajuda, segurança e suporte em um só lugar','Revisa tu cuenta, tus reportes o disputas y contacta a soporte cuando lo necesites.':'Revise sua conta, denúncias ou disputas e fale com o suporte quando precisar.','🛡️ Centro de confianza':'🛡️ Central de confiança',
      'Busca un servicio':'Encontre um serviço','Escribe lo que necesitas y, si quieres, tu zona.':'Digite o que precisa e, se quiser, sua região.','Buscar servicios':'Buscar serviços','¿Ofreces un servicio? Publicar servicio':'Oferece um serviço? Publicar serviço','⚙️ Filtros opcionales':'⚙️ Filtros opcionais','Categoría, modalidad y orden':'Categoria, modalidade e ordem','Describe tu servicio':'Descreva seu serviço','Guardar servicio':'Salvar serviço','Añade tus horarios':'Adicione seus horários','¿Cuándo puedes trabajar?':'Quando você pode trabalhar?','Añade al menos un horario futuro para poder recibir solicitudes.':'Adicione pelo menos um horário futuro para receber solicitações.','Elige el servicio, la fecha, la hora y cuánto durará aproximadamente.':'Escolha o serviço, a data, a hora e a duração aproximada.','Añadir este horario':'Adicionar este horário','Solicitudes y reservas':'Solicitações e reservas','Completa tu perfil':'Complete seu perfil','No tienes que llenarlo todo.':'Você não precisa preencher tudo.','Guardar cambios':'Salvar alterações','Tus conversaciones':'Suas conversas','Ayuda y seguridad':'Ajuda e segurança','Pagos reales todavía desactivados':'Pagamentos reais ainda estão desativados',
      'Vista previa':'Prévia','⏸️ Pausar':'⏸️ Pausar','▶️ Reactivar':'▶️ Reativar','Eliminar servicio':'Excluir serviço','Editar servicio':'Editar serviço','🟢 Publicado':'🟢 Publicado','🟡 Falta disponibilidad':'🟡 Falta disponibilidade','⏸ Pausado':'⏸ Pausado','No visible para clientes hasta que lo reactives':'Oculto dos clientes até você reativá-lo','Vista previa del servicio':'Prévia do serviço','Vista del cliente':'Visão do cliente','Cerrar':'Fechar','Confirmar':'Confirmar','Servicios':'Serviços','Solicitudes pendientes':'Solicitações pendentes','por revisar':'para revisar','Próxima reserva':'Próxima reserva','confirmada':'confirmada','pausado':'pausado','pausados':'pausados',
      '🔔 Centro de notificaciones':'🔔 Central de notificações','Mensajes importantes de Zeqviro':'Mensagens importantes da Zeqviro','Marcar todo como leído':'Marcar tudo como lido','✨ Todo al día':'✨ Tudo em dia','No tienes notificaciones por ahora.':'Você não tem notificações agora.','Intentar otra vez':'Tentar novamente','Idioma':'Idioma','La interfaz cambió de idioma. Los mensajes, biografías y descripciones escritos por usuarios no se traducen automáticamente.':'A interface mudou de idioma. Mensagens, biografias e descrições escritas por usuários não são traduzidas automaticamente.'
    },
    fr: {
      'Inicio':'Accueil','Buscar':'Rechercher','Publicar':'Services','Mensajes':'Messages','Perfil':'Profil','Ayuda':'Aide','Notificaciones':'Notifications','Cerrar sesión':'Se déconnecter','Iniciar sesión':'Se connecter','Entrar':'Se connecter','Registrarse':'Créer un compte',
      'Publica y administra tus servicios':'Publiez et gérez vos services','Primero explica qué haces. Después añade un horario para empezar a recibir solicitudes.':'Expliquez d’abord ce que vous faites, puis ajoutez des disponibilités pour recevoir des demandes.','🛠️ Tus servicios':'🛠️ Vos services','Ayuda a las personas a conocerte':'Aidez les gens à vous connaître','Añade solo la información que quieras mostrar. Un perfil claro genera más confianza.':'Ajoutez seulement les informations que vous souhaitez afficher. Un profil clair inspire davantage confiance.','👤 Tu perfil':'👤 Votre profil','Habla con claridad antes de confirmar':'Échangez clairement avant de confirmer','💬 Conversaciones':'💬 Conversations','Ayuda, seguridad y soporte en un solo lugar':'Aide, sécurité et assistance au même endroit','🛡️ Centro de confianza':'🛡️ Centre de confiance',
      'Busca un servicio':'Trouver un service','Escribe lo que necesitas y, si quieres, tu zona.':'Décrivez votre besoin et, si vous le souhaitez, votre zone.','Buscar servicios':'Rechercher des services','¿Ofreces un servicio? Publicar servicio':'Vous proposez un service ? Publiez-le','⚙️ Filtros opcionales':'⚙️ Filtres optionnels','Categoría, modalidad y orden':'Catégorie, modalité et tri','Describe tu servicio':'Décrivez votre service','Guardar servicio':'Enregistrer le service','Añade tus horarios':'Ajoutez vos disponibilités','¿Cuándo puedes trabajar?':'Quand pouvez-vous travailler ?','Añade al menos un horario futuro para poder recibir solicitudes.':'Ajoutez au moins un créneau futur pour recevoir des demandes.','Añadir este horario':'Ajouter ce créneau','Solicitudes y reservas':'Demandes et réservations','Completa tu perfil':'Complétez votre profil','No tienes que llenarlo todo.':'Vous n’avez pas besoin de tout remplir.','Guardar cambios':'Enregistrer les modifications','Tus conversaciones':'Vos conversations','Ayuda y seguridad':'Aide et sécurité','Pagos reales todavía desactivados':'Les paiements réels sont encore désactivés',
      'Vista previa':'Aperçu','⏸️ Pausar':'⏸️ Mettre en pause','▶️ Reactivar':'▶️ Réactiver','Eliminar servicio':'Supprimer le service','Editar servicio':'Modifier le service','🟢 Publicado':'🟢 Publié','🟡 Falta disponibilidad':'🟡 Disponibilités manquantes','⏸ Pausado':'⏸ En pause','No visible para clientes hasta que lo reactives':'Invisible pour les clients jusqu’à sa réactivation','Vista previa del servicio':'Aperçu du service','Vista del cliente':'Vue client','Cerrar':'Fermer','Confirmar':'Confirmer','Servicios':'Services','Solicitudes pendientes':'Demandes en attente','por revisar':'à examiner','Próxima reserva':'Prochaine réservation','confirmada':'confirmée','pausado':'en pause','pausados':'en pause',
      '🔔 Centro de notificaciones':'🔔 Centre de notifications','Mensajes importantes de Zeqviro':'Messages importants de Zeqviro','Marcar todo como leído':'Tout marquer comme lu','✨ Todo al día':'✨ Tout est à jour','No tienes notificaciones por ahora.':'Vous n’avez aucune notification pour le moment.','Intentar otra vez':'Réessayer','Idioma':'Langue','La interfaz cambió de idioma. Los mensajes, biografías y descripciones escritos por usuarios no se traducen automáticamente.':'La langue de l’interface a changé. Les messages, biographies et descriptions écrits par les utilisateurs ne sont pas traduits automatiquement.'
    },
    zh: {
      'Inicio':'首页','Buscar':'搜索','Publicar':'服务','Mensajes':'消息','Perfil':'个人资料','Ayuda':'帮助','Notificaciones':'通知','Cerrar sesión':'退出登录','Iniciar sesión':'登录','Entrar':'登录','Registrarse':'创建账户',
      'Publica y administra tus servicios':'发布并管理你的服务','Primero explica qué haces. Después añade un horario para empezar a recibir solicitudes.':'先说明你提供的服务，然后添加可用时间以开始接收请求。','🛠️ Tus servicios':'🛠️ 你的服务','Ayuda a las personas a conocerte':'帮助别人了解你','Añade solo la información que quieras mostrar. Un perfil claro genera más confianza.':'只添加你愿意公开的信息。清晰的个人资料更容易建立信任。','👤 Tu perfil':'👤 你的个人资料','Habla con claridad antes de confirmar':'确认前请充分沟通','💬 Conversaciones':'💬 对话','Ayuda, seguridad y soporte en un solo lugar':'帮助、安全与支持集中在一个地方','🛡️ Centro de confianza':'🛡️ 信任中心',
      'Busca un servicio':'查找服务','Escribe lo que necesitas y, si quieres, tu zona.':'输入你需要的服务，也可以填写所在区域。','Buscar servicios':'搜索服务','¿Ofreces un servicio? Publicar servicio':'提供服务？发布服务','⚙️ Filtros opcionales':'⚙️ 可选筛选','Categoría, modalidad y orden':'类别、形式和排序','Describe tu servicio':'描述你的服务','Guardar servicio':'保存服务','Añade tus horarios':'添加可用时间','¿Cuándo puedes trabajar?':'你什么时候可以工作？','Añade al menos un horario futuro para poder recibir solicitudes.':'至少添加一个未来时间段才能接收请求。','Añadir este horario':'添加此时间','Solicitudes y reservas':'请求与预订','Completa tu perfil':'完善个人资料','No tienes que llenarlo todo.':'不需要填写所有内容。','Guardar cambios':'保存更改','Tus conversaciones':'你的对话','Ayuda y seguridad':'帮助与安全','Pagos reales todavía desactivados':'真实支付目前仍未启用',
      'Vista previa':'预览','⏸️ Pausar':'⏸️ 暂停','▶️ Reactivar':'▶️ 重新启用','Eliminar servicio':'删除服务','Editar servicio':'编辑服务','🟢 Publicado':'🟢 已发布','🟡 Falta disponibilidad':'🟡 缺少可用时间','⏸ Pausado':'⏸ 已暂停','No visible para clientes hasta que lo reactives':'重新启用前客户不可见','Vista previa del servicio':'服务预览','Vista del cliente':'客户视图','Cerrar':'关闭','Confirmar':'确认','Servicios':'服务','Solicitudes pendientes':'待处理请求','por revisar':'待审核','Próxima reserva':'下一笔预订','confirmada':'已确认','pausado':'已暂停','pausados':'已暂停',
      '🔔 Centro de notificaciones':'🔔 通知中心','Mensajes importantes de Zeqviro':'Zeqviro 重要消息','Marcar todo como leído':'全部标为已读','✨ Todo al día':'✨ 已全部查看','No tienes notificaciones por ahora.':'你目前没有通知。','Intentar otra vez':'重试','Idioma':'语言','La interfaz cambió de idioma. Los mensajes, biografías y descripciones escritos por usuarios no se traducen automáticamente.':'界面语言已更改。用户撰写的消息、个人简介和服务描述不会自动翻译。'
    }
  };

  const placeholders = {
    en:{'¿Qué servicio necesitas?':'What service do you need?','¿En qué ciudad o área? (opcional)':'What city or area? (optional)','Escribe un mensaje sobre este servicio…':'Write a message about this service…','Buscar por nombre o correo':'Search by name or email'},
    pt:{'¿Qué servicio necesitas?':'Qual serviço você precisa?','¿En qué ciudad o área? (opcional)':'Em qual cidade ou região? (opcional)','Escribe un mensaje sobre este servicio…':'Escreva uma mensagem sobre este serviço…','Buscar por nombre o correo':'Buscar por nome ou e-mail'},
    fr:{'¿Qué servicio necesitas?':'De quel service avez-vous besoin ?','¿En qué ciudad o área? (opcional)':'Dans quelle ville ou zone ? (optionnel)','Escribe un mensaje sobre este servicio…':'Écrivez un message à propos de ce service…','Buscar por nombre o correo':'Rechercher par nom ou e-mail'},
    zh:{'¿Qué servicio necesitas?':'你需要什么服务？','¿En qué ciudad o área? (opcional)':'你所在的城市或区域？（可选）','Escribe un mensaje sobre este servicio…':'输入关于此服务的消息…','Buscar por nombre o correo':'按姓名或邮箱搜索'}
  };

  const skipSelector = '.msg,.notification-copy,.service-card p,.service-card h4,.profile-copy,.profile-service-card,.profile-review,#chatBox,#providerProfileContent,[data-user-content]';
  let current = supported.includes(localStorage.getItem(STORAGE_KEY)) ? localStorage.getItem(STORAGE_KEY) : 'es';
  let applying = false;

  function translateText(value, lang=current) {
    if (lang === 'es') return value;
    const trimmed = String(value || '').trim();
    if (!trimmed) return value;
    const exact = t[lang]?.[trimmed];
    if (exact) return String(value).replace(trimmed, exact);
    const unread = trimmed.match(/^(\d+) sin leer$/);
    if (unread) return lang==='en'?`${unread[1]} unread`:lang==='pt'?`${unread[1]} não lidas`:lang==='fr'?`${unread[1]} non lue(s)`:`${unread[1]} 条未读`;
    const attempts = trimmed.match(/^Intentos de publicación · últimas 24 h$/);
    if (attempts) return lang==='en'?'Publishing attempts · last 24 h':lang==='pt'?'Tentativas de publicação · últimas 24 h':lang==='fr'?'Tentatives de publication · dernières 24 h':'发布次数 · 最近24小时';
    return value;
  }

  function translateNode(node) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (!parent || parent.closest(skipSelector) || parent.closest('.zeqviro-language-switcher,.zeqviro-language-note')) return;
      const original = node.__zeqviroOriginal ?? node.nodeValue;
      node.__zeqviroOriginal = original;
      node.nodeValue = current === 'es' ? original : translateText(original, current);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE || node.matches(skipSelector) || node.closest(skipSelector)) return;
    node.childNodes.forEach(translateNode);
    ['placeholder','aria-label','title'].forEach(attr => {
      if (!node.hasAttribute?.(attr)) return;
      const key = `__zeqviro_${attr}`;
      const original = node[key] ?? node.getAttribute(attr);
      node[key] = original;
      node.setAttribute(attr, current === 'es' ? original : (placeholders[current]?.[original] || t[current]?.[original] || original));
    });
  }

  function translateDocument() {
    if (applying) return;
    applying = true;
    document.documentElement.lang = current === 'zh' ? 'zh-CN' : current;
    translateNode(document.body);
    const titles = {es:'Zeqviro | Servicios cerca de ti y en línea',en:'Zeqviro | Services near you and online',pt:'Zeqviro | Serviços perto de você e online',fr:'Zeqviro | Services près de chez vous et en ligne',zh:'Zeqviro | 附近与在线服务'};
    document.title = titles[current];
    const select = document.getElementById('zeqviroLanguage'); if (select) select.value = current;
    applying = false;
  }

  function addSwitcher() {
    if (document.getElementById('zeqviroLanguage')) return;
    const wrap = document.createElement('div');
    wrap.className = 'zeqviro-language-switcher';
    wrap.innerHTML = `<label for="zeqviroLanguage">🌐 <span>${current==='es'?'Idioma':t[current]?.Idioma || 'Language'}</span></label><select id="zeqviroLanguage" aria-label="Idioma">${supported.map(code=>`<option value="${code}">${labels[code]}</option>`).join('')}</select>`;
    const note = document.createElement('div'); note.className='zeqviro-language-note'; note.id='zeqviroLanguageNote';
    document.body.append(wrap,note);
    const select = wrap.querySelector('select'); select.value=current;
    select.addEventListener('change', () => {
      current = supported.includes(select.value) ? select.value : 'es';
      localStorage.setItem(STORAGE_KEY,current);
      translateDocument();
      const text = 'La interfaz cambió de idioma. Los mensajes, biografías y descripciones escritos por usuarios no se traducen automáticamente.';
      note.textContent = current==='es' ? text : (t[current]?.[text] || text);
      note.classList.add('show'); setTimeout(()=>note.classList.remove('show'),4200);
      window.dispatchEvent(new CustomEvent('zeqviro:languagechange',{detail:{language:current,locale:locales[current]}}));
    });
  }

  addSwitcher();
  translateDocument();
  const observer = new MutationObserver((mutations) => {
    if (applying) return;
    applying=true;
    for (const m of mutations) m.addedNodes.forEach(n => translateNode(n));
    applying=false;
  });
  observer.observe(document.body,{childList:true,subtree:true});

  window.ZeqviroI18n = { get language(){return current;}, get locale(){return locales[current];}, translate:translateText, apply:translateDocument, supported:[...supported] };
})();
