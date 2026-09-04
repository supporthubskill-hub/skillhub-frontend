(()=>{
  const STORAGE_KEY='zeqviroLanguage';
  const supported=['es','en','pt','fr','zh'];

  const strings={
    en:{
      'Pendiente':'Pending','Confirmada':'Confirmed','Rechazada':'Rejected','Cancelada':'Cancelled','Completada':'Completed','Disponible':'Available','Apartado por una solicitud':'Held for a request',
      'Solicitud de cliente':'Client request','Tu solicitud':'Your request','✓ Aceptar':'✓ Accept','Rechazar':'Reject','Cancelar solicitud':'Cancel request','Marcar completada':'Mark completed','Cancelar':'Cancel','⭐ Dejar reseña':'⭐ Leave review','¿Tuviste un problema? Abrir disputa':'Had a problem? Open dispute','💬 Abrir chat':'💬 Open chat',
      '🛡️ Chat protegido':'🛡️ Protected chat','Mantén pagos, acuerdos y conversaciones dentro de Zeqviro.':'Keep payments, agreements, and conversations inside Zeqviro.','Protección juvenil activa: no compartas teléfono, correo, redes sociales ni ubicación exacta.':'Youth protection active: do not share phone numbers, email, social accounts, or exact location.','Reportar':'Report','Bloquear':'Block','Bloqueando…':'Blocking…','Usuario bloqueado. Esta conversación ya no podrá continuar.':'User blocked. This conversation can no longer continue.','⚑ Reportar usuario del chat':'⚑ Report chat user','El reporte se enviará al equipo de moderación de Zeqviro.':'The report will be sent to Zeqviro moderation.','Motivo':'Reason','Detalles':'Details','Enviar reporte':'Send report','Reporte enviado a moderación.':'Report sent to moderation.',
      'Comportamiento inapropiado':'Inappropriate behavior','Intento de fraude':'Fraud attempt','Solicita información personal':'Requests personal information','Acoso o amenazas':'Harassment or threats','Otro':'Other',
      'Por seguridad, no compartas teléfonos, correos ni contactos externos desde una cuenta juvenil.':'For safety, youth accounts cannot share phone numbers, email addresses, or external contact handles.',
      'Fecha de nacimiento':'Date of birth','Estado / región':'State / region','Nueva York':'New York','Otro':'Other','Acepto los Términos, la Política de Privacidad y las Normas de la comunidad.':'I accept the Terms, Privacy Policy, and Community Guidelines.','Privacidad por edad:':'Age-based privacy:','la fecha de nacimiento se usa para aplicar protecciones y no se muestra públicamente. Durante la beta, las cuentas nuevas deben tener al menos 14 años.':'date of birth is used to apply protections and is not shown publicly. During beta, new accounts must be at least 14.','Ingresa tu fecha de nacimiento para continuar.':'Enter your date of birth to continue.','Las cuentas nuevas de la beta requieren 14 años o más.':'New beta accounts require age 14 or older.','Tu cuenta tendrá protecciones juveniles adicionales.':'Your account will have additional youth protections.','Edad verificada para el registro.':'Age verified for registration.',
      'Términos':'Terms','Privacidad':'Privacy','Normas de la comunidad':'Community Guidelines'
    },
    pt:{
      'Pendiente':'Pendente','Confirmada':'Confirmada','Rechazada':'Recusada','Cancelada':'Cancelada','Completada':'Concluída','Disponible':'Disponível','Apartado por una solicitud':'Reservado por uma solicitação','Solicitud de cliente':'Solicitação de cliente','Tu solicitud':'Sua solicitação','✓ Aceptar':'✓ Aceitar','Rechazar':'Recusar','Cancelar solicitud':'Cancelar solicitação','Marcar completada':'Marcar como concluída','Cancelar':'Cancelar','⭐ Dejar reseña':'⭐ Avaliar','¿Tuviste un problema? Abrir disputa':'Teve um problema? Abrir disputa','💬 Abrir chat':'💬 Abrir chat','🛡️ Chat protegido':'🛡️ Chat protegido','Mantén pagos, acuerdos y conversaciones dentro de Zeqviro.':'Mantenha pagamentos, acordos e conversas dentro da Zeqviro.','Reportar':'Denunciar','Bloquear':'Bloquear','Motivo':'Motivo','Detalles':'Detalhes','Enviar reporte':'Enviar denúncia','Otro':'Outro','Fecha de nacimiento':'Data de nascimento','Estado / región':'Estado / região','Nueva York':'Nova York','Términos':'Termos','Privacidad':'Privacidade','Normas de la comunidad':'Diretrizes da comunidade'
    },
    fr:{
      'Pendiente':'En attente','Confirmada':'Confirmée','Rechazada':'Refusée','Cancelada':'Annulée','Completada':'Terminée','Disponible':'Disponible','Apartado por una solicitud':'Réservé par une demande','Solicitud de cliente':'Demande client','Tu solicitud':'Votre demande','✓ Aceptar':'✓ Accepter','Rechazar':'Refuser','Cancelar solicitud':'Annuler la demande','Marcar completada':'Marquer terminée','Cancelar':'Annuler','⭐ Dejar reseña':'⭐ Laisser un avis','¿Tuviste un problema? Abrir disputa':'Un problème ? Ouvrir un litige','💬 Abrir chat':'💬 Ouvrir le chat','🛡️ Chat protegido':'🛡️ Chat protégé','Mantén pagos, acuerdos y conversaciones dentro de Zeqviro.':'Gardez les paiements, accords et conversations dans Zeqviro.','Reportar':'Signaler','Bloquear':'Bloquer','Motivo':'Motif','Detalles':'Détails','Enviar reporte':'Envoyer le signalement','Otro':'Autre','Fecha de nacimiento':'Date de naissance','Estado / región':'État / région','Nueva York':'New York','Términos':'Conditions','Privacidad':'Confidentialité','Normas de la comunidad':'Règles de la communauté'
    },
    zh:{
      'Pendiente':'待处理','Confirmada':'已确认','Rechazada':'已拒绝','Cancelada':'已取消','Completada':'已完成','Disponible':'可用','Apartado por una solicitud':'已被请求占用','Solicitud de cliente':'客户请求','Tu solicitud':'你的请求','✓ Aceptar':'✓ 接受','Rechazar':'拒绝','Cancelar solicitud':'取消请求','Marcar completada':'标记为已完成','Cancelar':'取消','⭐ Dejar reseña':'⭐ 评价','¿Tuviste un problema? Abrir disputa':'遇到问题？发起争议','💬 Abrir chat':'💬 打开聊天','🛡️ Chat protegido':'🛡️ 受保护的聊天','Mantén pagos, acuerdos y conversaciones dentro de Zeqviro.':'请将付款、约定和对话保留在 Zeqviro 内。','Reportar':'举报','Bloquear':'屏蔽','Motivo':'原因','Detalles':'详情','Enviar reporte':'提交举报','Otro':'其他','Fecha de nacimiento':'出生日期','Estado / región':'州 / 地区','Nueva York':'纽约','Términos':'条款','Privacidad':'隐私','Normas de la comunidad':'社区准则'
    }
  };

  const statusKeys={
    pending:{es:'Pendiente',en:'Pending',pt:'Pendente',fr:'En attente',zh:'待处理'},
    confirmed:{es:'Confirmada',en:'Confirmed',pt:'Confirmada',fr:'Confirmée',zh:'已确认'},
    rejected:{es:'Rechazada',en:'Rejected',pt:'Recusada',fr:'Refusée',zh:'已拒绝'},
    cancelled:{es:'Cancelada',en:'Cancelled',pt:'Cancelada',fr:'Annulée',zh:'已取消'},
    completed:{es:'Completada',en:'Completed',pt:'Concluída',fr:'Terminée',zh:'已完成'},
    open:{es:'Abierto',en:'Open',pt:'Aberto',fr:'Ouvert',zh:'开放'},
    reviewing:{es:'En revisión',en:'Under review',pt:'Em análise',fr:'En examen',zh:'审核中'},
    resolved:{es:'Resuelto',en:'Resolved',pt:'Resolvido',fr:'Résolu',zh:'已解决'},
    dismissed:{es:'Cerrado sin acción',en:'Dismissed',pt:'Encerrado sem ação',fr:'Classé sans suite',zh:'已驳回'},
    unverified:{es:'Sin verificar',en:'Unverified',pt:'Não verificado',fr:'Non vérifié',zh:'未验证'},
    verified:{es:'Verificado',en:'Verified',pt:'Verificado',fr:'Vérifié',zh:'已验证'}
  };

  function language(){
    const current=window.ZeqviroI18n?.language||localStorage.getItem(STORAGE_KEY)||'es';
    return supported.includes(current)?current:'es';
  }

  function translateText(value){
    const lang=language();
    if(lang==='es'||!value) return value;
    const trimmed=String(value).trim();
    const translated=strings[lang]?.[trimmed];
    if(!translated) return value;
    const start=String(value).indexOf(trimmed);
    return String(value).slice(0,start)+translated+String(value).slice(start+trimmed.length);
  }

  function applyNode(root){
    if(!root) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(node.parentElement?.matches('script,style,textarea,input,option')) return;
      const next=translateText(node.nodeValue);
      if(next!==node.nodeValue) node.nodeValue=next;
    });
    if(root.querySelectorAll){
      root.querySelectorAll('option').forEach(option=>{const next=translateText(option.textContent);if(next!==option.textContent)option.textContent=next;});
      root.querySelectorAll('[placeholder]').forEach(el=>{const next=translateText(el.placeholder);if(next!==el.placeholder)el.placeholder=next;});
      root.querySelectorAll('[title]').forEach(el=>{const next=translateText(el.title);if(next!==el.title)el.title=next;});
    }
  }

  function apply(){applyNode(document.body);}

  const observer=new MutationObserver(mutations=>{
    for(const mutation of mutations){
      mutation.addedNodes.forEach(node=>{if(node.nodeType===1) applyNode(node); else if(node.nodeType===3&&node.parentElement) applyNode(node.parentElement);});
    }
  });

  function start(){
    apply();
    observer.observe(document.body,{childList:true,subtree:true});
    document.addEventListener('change',event=>{
      if(event.target?.id==='zeqviroLanguageSelect') setTimeout(apply,0);
    });
  }

  window.ZeqviroStatusLabel=(status,lang=language())=>statusKeys[String(status||'').toLowerCase()]?.[lang]||String(status||'');
  window.ZeqviroBlock5I18n={apply,statusLabel:window.ZeqviroStatusLabel};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
