(()=>{
  const STORAGE_KEY='zeqviroLanguage';
  const supported=['es','en','pt','fr','zh'];
  const table={
    'Seguridad':{en:'Security',pt:'Segurança',fr:'Sécurité',zh:'安全'},
    'Inicia sesión para ver tu seguridad.':{en:'Sign in to view your security settings.',pt:'Entre para ver suas configurações de segurança.',fr:'Connectez-vous pour voir vos paramètres de sécurité.',zh:'登录以查看你的安全设置。'},
    'Solicitar verificación de identidad':{en:'Request identity verification',pt:'Solicitar verificação de identidade',fr:'Demander la vérification d’identité',zh:'申请身份验证'},
    'Mis reportes y disputas':{en:'My reports and disputes',pt:'Meus relatórios e disputas',fr:'Mes signalements et litiges',zh:'我的举报和争议'},
    'Soporte':{en:'Support',pt:'Suporte',fr:'Assistance',zh:'支持'},
    '¿Tienes una duda o problema? Envía una consulta al equipo de Zeqviro. Nunca compartas contraseñas ni códigos de verificación.':{en:'Have a question or problem? Send a message to the Zeqviro team. Never share passwords or verification codes.',pt:'Tem uma dúvida ou problema? Envie uma mensagem à equipe da Zeqviro. Nunca compartilhe senhas nem códigos de verificação.',fr:'Une question ou un problème ? Envoyez un message à l’équipe Zeqviro. Ne partagez jamais vos mots de passe ni vos codes de vérification.',zh:'有疑问或问题？请联系 Zeqviro 团队。切勿分享密码或验证码。'},
    'Tu correo electrónico':{en:'Your email',pt:'Seu e-mail',fr:'Votre e-mail',zh:'你的电子邮箱'},
    'Asunto':{en:'Subject',pt:'Assunto',fr:'Objet',zh:'主题'},
    'Mensaje':{en:'Message',pt:'Mensagem',fr:'Message',zh:'消息'},
    'Contactar soporte':{en:'Contact support',pt:'Contatar suporte',fr:'Contacter l’assistance',zh:'联系支持'},
    'Centro de confianza':{en:'Trust center',pt:'Central de confiança',fr:'Centre de confiance',zh:'信任中心'},
    'Usa Zeqviro con más seguridad':{en:'Use Zeqviro more safely',pt:'Use a Zeqviro com mais segurança',fr:'Utilisez Zeqviro plus sereinement',zh:'更安全地使用 Zeqviro'},
    '1 · Revisa el perfil':{en:'1 · Review the profile',pt:'1 · Revise o perfil',fr:'1 · Consultez le profil',zh:'1 · 查看个人资料'},
    'Consulta descripción, experiencia, servicios y reseñas antes de reservar.':{en:'Review the description, experience, services, and reviews before booking.',pt:'Revise a descrição, experiência, serviços e avaliações antes de reservar.',fr:'Consultez la description, l’expérience, les services et les avis avant de réserver.',zh:'预订前请查看描述、经验、服务和评价。'},
    '2 · Mantén el contexto':{en:'2 · Keep the context',pt:'2 · Mantenha o contexto',fr:'2 · Gardez le contexte',zh:'2 · 保持上下文'},
    'Usa reservas y chat de Zeqviro para que la conversación quede organizada.':{en:'Use Zeqviro bookings and chat so the conversation stays organized.',pt:'Use reservas e o chat da Zeqviro para manter a conversa organizada.',fr:'Utilisez les réservations et le chat Zeqviro pour garder la conversation organisée.',zh:'使用 Zeqviro 的预订和聊天功能，让沟通保持有序。'},
    '3 · Reporta problemas':{en:'3 · Report problems',pt:'3 · Denuncie problemas',fr:'3 · Signalez les problèmes',zh:'3 · 举报问题'},
    'Ayuda incluye reportes, disputas y soporte para casos que necesiten revisión.':{en:'Help includes reports, disputes, and support for cases that need review.',pt:'A Ajuda inclui denúncias, disputas e suporte para casos que precisam de revisão.',fr:'L’aide comprend les signalements, litiges et l’assistance pour les cas nécessitant un examen.',zh:'帮助中心包含举报、争议和需要审核情况的支持。'},
    'Pagos reales desactivados durante la beta.':{en:'Real payments are disabled during beta.',pt:'Pagamentos reais estão desativados durante a beta.',fr:'Les paiements réels sont désactivés pendant la bêta.',zh:'测试期间真实付款已停用。'},
    'No introduzcas datos de tarjeta ni envíes dinero porque Zeqviro todavía no procesa pagos reales.':{en:'Do not enter card details or send money because Zeqviro does not process real payments yet.',pt:'Não insira dados de cartão nem envie dinheiro porque a Zeqviro ainda não processa pagamentos reais.',fr:'Ne saisissez pas de données de carte et n’envoyez pas d’argent car Zeqviro ne traite pas encore de paiements réels.',zh:'请勿输入银行卡信息或汇款，因为 Zeqviro 尚未处理真实付款。'},
    'Ayuda':{en:'Help',pt:'Ajuda',fr:'Aide',zh:'帮助'},
    'Encuentra aquí seguridad, reportes, disputas, reseñas y soporte de Zeqviro.':{en:'Find security, reports, disputes, reviews, and Zeqviro support here.',pt:'Encontre aqui segurança, denúncias, disputas, avaliações e suporte da Zeqviro.',fr:'Retrouvez ici la sécurité, les signalements, les litiges, les avis et l’assistance Zeqviro.',zh:'在这里查找安全、举报、争议、评价和 Zeqviro 支持。'},
    '⭐ Mis reseñas':{en:'⭐ My reviews',pt:'⭐ Minhas avaliações',fr:'⭐ Mes avis',zh:'⭐ 我的评价'},
    'Todos':{en:'All',pt:'Todos',fr:'Tous',zh:'全部'},
    'Desarrollo':{en:'Development',pt:'Desenvolvimento',fr:'Développement',zh:'开发'},
    'Hogar':{en:'Home',pt:'Casa',fr:'Maison',zh:'家居'},
    'Educación':{en:'Education',pt:'Educação',fr:'Éducation',zh:'教育'},
    'Filtros opcionales':{en:'Optional filters',pt:'Filtros opcionais',fr:'Filtres optionnels',zh:'可选筛选'},
    'Categoría, modalidad y orden':{en:'Category, format and sorting',pt:'Categoria, modalidade e ordem',fr:'Catégorie, modalité et tri',zh:'类别、形式和排序'},
    'Precio mínimo':{en:'Minimum price',pt:'Preço mínimo',fr:'Prix minimum',zh:'最低价格'},
    'Precio máximo':{en:'Maximum price',pt:'Preço máximo',fr:'Prix maximum',zh:'最高价格'},
    'Calificación mínima':{en:'Minimum rating',pt:'Avaliação mínima',fr:'Note minimale',zh:'最低评分'},
    'Cualquier calificación':{en:'Any rating',pt:'Qualquer avaliação',fr:'Toute note',zh:'任意评分'},
    'Solo con disponibilidad':{en:'Available only',pt:'Somente com disponibilidade',fr:'Avec disponibilité uniquement',zh:'仅显示有空档'},
    'Limpiar filtros':{en:'Clear filters',pt:'Limpar filtros',fr:'Effacer les filtres',zh:'清除筛选'},
    'resultados':{en:'results',pt:'resultados',fr:'résultats',zh:'个结果'},
    'resultado':{en:'result',pt:'resultado',fr:'résultat',zh:'个结果'},
    'Nombre del servicio':{en:'Service name',pt:'Nome do serviço',fr:'Nom du service',zh:'服务名称'},
    'Descripción del servicio':{en:'Service description',pt:'Descrição do serviço',fr:'Description du service',zh:'服务描述'},
    'Categoría':{en:'Category',pt:'Categoria',fr:'Catégorie',zh:'类别'},
    'Tipo':{en:'Type',pt:'Tipo',fr:'Type',zh:'类型'},
    'Remoto':{en:'Remote',pt:'Remoto',fr:'À distance',zh:'远程'},
    'Presencial':{en:'In person',pt:'Presencial',fr:'En présentiel',zh:'现场'},
    'Precio fijo ($)':{en:'Fixed price ($)',pt:'Preço fixo ($)',fr:'Prix fixe ($)',zh:'固定价格 ($)'},
    'Precio por hora ($)':{en:'Hourly price ($)',pt:'Preço por hora ($)',fr:'Prix horaire ($)',zh:'每小时价格 ($)'},
    'Ubicación / área':{en:'Location / area',pt:'Localização / área',fr:'Lieu / zone',zh:'位置 / 区域'},
    'Mis servicios':{en:'My services',pt:'Meus serviços',fr:'Mes services',zh:'我的服务'},
    'Inicia sesión para administrar tus servicios.':{en:'Sign in to manage your services.',pt:'Entre para gerenciar seus serviços.',fr:'Connectez-vous pour gérer vos services.',zh:'登录以管理你的服务。'},
    'Servicio':{en:'Service',pt:'Serviço',fr:'Service',zh:'服务'},
    'Fecha y hora exacta':{en:'Exact date and time',pt:'Data e hora exatas',fr:'Date et heure exactes',zh:'准确日期和时间'},
    'Duración (minutos)':{en:'Duration (minutes)',pt:'Duração (minutos)',fr:'Durée (minutes)',zh:'时长（分钟）'},
    'Mensajes':{en:'Messages',pt:'Mensagens',fr:'Messages',zh:'消息'},
    'El chat está disponible para cuentas de usuario. La cuenta administrativa se gestiona desde Admin.':{en:'Chat is available for user accounts. The administrative account is managed from Admin.',pt:'O chat está disponível para contas de usuário. A conta administrativa é gerenciada pelo Admin.',fr:'Le chat est disponible pour les comptes utilisateurs. Le compte administrateur se gère depuis Admin.',zh:'聊天功能适用于用户账户。管理员账户请在 Admin 中管理。'},
    'Tus conversaciones':{en:'Your conversations',pt:'Suas conversas',fr:'Vos conversations',zh:'你的对话'},
    'Selecciona una conversación':{en:'Select a conversation',pt:'Selecione uma conversa',fr:'Sélectionnez une conversation',zh:'选择一个对话'},
    'Chat protegido':{en:'Protected chat',pt:'Chat protegido',fr:'Chat protégé',zh:'受保护的聊天'},
    'Mantén acuerdos y conversaciones dentro de Zeqviro. Durante la beta, no envíes pagos externos.':{en:'Keep agreements and conversations inside Zeqviro. During beta, do not send external payments.',pt:'Mantenha acordos e conversas dentro da Zeqviro. Durante a beta, não envie pagamentos externos.',fr:'Gardez les accords et conversations dans Zeqviro. Pendant la bêta, n’envoyez pas de paiements externes.',zh:'请将约定和对话保留在 Zeqviro 内。测试期间请勿进行平台外付款。'},
    'Reportar':{en:'Report',pt:'Denunciar',fr:'Signaler',zh:'举报'},
    'Bloquear':{en:'Block',pt:'Bloquear',fr:'Bloquer',zh:'屏蔽'},
    'Ayuda y seguridad':{en:'Help and safety',pt:'Ajuda e segurança',fr:'Aide et sécurité',zh:'帮助与安全'}
  };

  const reverse=new Map();
  Object.entries(table).forEach(([es,values])=>{
    reverse.set(es,es);
    Object.values(values).forEach(value=>reverse.set(value,es));
  });

  function language(){
    const value=window.ZeqviroI18n?.language||localStorage.getItem(STORAGE_KEY)||'es';
    return supported.includes(value)?value:'es';
  }

  function translate(value){
    if(!value) return value;
    const raw=String(value),trimmed=raw.trim();
    const canonical=reverse.get(trimmed);
    if(!canonical) return value;
    const lang=language();
    const translated=lang==='es'?canonical:(table[canonical]?.[lang]||canonical);
    const start=raw.indexOf(trimmed);
    return raw.slice(0,start)+translated+raw.slice(start+trimmed.length);
  }

  function shouldSkip(el){
    return !el||el.closest?.('.msg,.block6-service-description,.profile-copy,.profile-review,[data-user-content],script,style,textarea');
  }

  function applyNode(root){
    if(!root) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(shouldSkip(node.parentElement)) return;
      const next=translate(node.nodeValue);
      if(next!==node.nodeValue) node.nodeValue=next;
    });
    if(root.querySelectorAll){
      root.querySelectorAll('option').forEach(el=>{const next=translate(el.textContent);if(next!==el.textContent)el.textContent=next;});
      root.querySelectorAll('[placeholder]').forEach(el=>{const next=translate(el.placeholder);if(next!==el.placeholder)el.placeholder=next;});
      root.querySelectorAll('[title]').forEach(el=>{const next=translate(el.title);if(next!==el.title)el.title=next;});
      root.querySelectorAll('[aria-label]').forEach(el=>{const next=translate(el.getAttribute('aria-label'));if(next!==el.getAttribute('aria-label'))el.setAttribute('aria-label',next);});
    }
  }

  function apply(){applyNode(document.body);document.documentElement.lang=language();}
  let scheduled=false;
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply();});}

  const observer=new MutationObserver(()=>schedule());
  function start(){
    apply();
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
    document.addEventListener('change',event=>{if(event.target?.id==='zeqviroLanguageSelect')setTimeout(apply,0);});
    window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY)apply();});
  }
  window.ZeqviroBlock6I18n={apply,translate};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
