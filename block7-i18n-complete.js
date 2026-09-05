(()=>{
const L={
'Tus mensajes aparecerán aquí.':{en:'Your messages will appear here.',pt:'Suas mensagens aparecerão aqui.',fr:'Vos messages apparaîtront ici.',zh:'你的消息会显示在这里。'},
'Inicia sesión para ver tus reservaciones.':{en:'Sign in to view your bookings.',pt:'Entre para ver suas reservas.',fr:'Connectez-vous pour voir vos réservations.',zh:'登录以查看你的预订。'},
'Inicia sesión':{en:'Sign in',pt:'Entrar',fr:'Se connecter',zh:'登录'},
'Filtros':{en:'Filters',pt:'Filtros',fr:'Filtres',zh:'筛选'},
'Mis favoritos':{en:'My favorites',pt:'Meus favoritos',fr:'Mes favoris',zh:'我的收藏'},
'Inicia sesión para guardar favoritos.':{en:'Sign in to save favorites.',pt:'Entre para salvar favoritos.',fr:'Connectez-vous pour enregistrer des favoris.',zh:'登录以保存收藏。'},
'Los pagos reales siguen desactivados.':{en:'Real payments remain disabled.',pt:'Os pagamentos reais continuam desativados.',fr:'Les paiements réels restent désactivés.',zh:'真实付款仍处于停用状态。'},
'Buscar':{en:'Search',pt:'Buscar',fr:'Rechercher',zh:'搜索'},
'Servicios':{en:'Services',pt:'Serviços',fr:'Services',zh:'服务'},
'Chat':{en:'Chat',pt:'Chat',fr:'Chat',zh:'聊天'},
'Perfil':{en:'Profile',pt:'Perfil',fr:'Profil',zh:'个人资料'},
'Ayuda':{en:'Help',pt:'Ajuda',fr:'Aide',zh:'帮助'},
'Correo verificado':{en:'Verified email',pt:'E-mail verificado',fr:'E-mail vérifié',zh:'邮箱已验证'},
'Agregar este horario':{en:'Add this time',pt:'Adicionar este horário',fr:'Ajouter ce créneau',zh:'添加此时间'},
'Solicitudes y reservas':{en:'Requests and bookings',pt:'Solicitações e reservas',fr:'Demandes et réservations',zh:'请求和预订'},
'Aquí puedes ver quién solicita tu servicio y aceptar, rechazar o abrir el chat.':{en:'Here you can see who requests your service and accept, reject, or open the chat.',pt:'Aqui você pode ver quem solicita seu serviço e aceitar, rejeitar ou abrir o chat.',fr:'Ici, vous pouvez voir qui demande votre service et accepter, refuser ou ouvrir le chat.',zh:'你可以在这里查看服务请求，并接受、拒绝或打开聊天。'},
'Términos':{en:'Terms',pt:'Termos',fr:'Conditions',zh:'条款'},
'Privacidad':{en:'Privacy',pt:'Privacidade',fr:'Confidentialité',zh:'隐私'},
'Normas de la comunidad':{en:'Community Guidelines',pt:'Diretrizes da comunidade',fr:'Règles de la communauté',zh:'社区准则'}
};
const reverse=new Map();Object.entries(L).forEach(([es,v])=>{reverse.set(es,es);Object.values(v).forEach(x=>reverse.set(x,es));});
const lang=()=>{const x=window.ZeqviroI18n?.language||localStorage.getItem('zeqviroLanguage')||'es';return ['es','en','pt','fr','zh'].includes(x)?x:'es';};
function tr(s){if(!s)return s;const raw=String(s),t=raw.trim(),es=reverse.get(t);if(!es)return s;const out=lang()==='es'?es:(L[es]?.[lang()]||es);return raw.replace(t,out);}
function skip(el){return !el||el.closest?.('.msg,.block6-service-description,.profile-copy,.profile-review,[data-user-content],script,style,textarea');}
function apply(root=document.body){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(n=>{if(skip(n.parentElement))return;const x=tr(n.nodeValue);if(x!==n.nodeValue)n.nodeValue=x;});root.querySelectorAll?.('option,[placeholder],[title],[aria-label]').forEach(el=>{if(el.matches('option')){const x=tr(el.textContent);if(x!==el.textContent)el.textContent=x;}['placeholder','title','aria-label'].forEach(k=>{if(el.hasAttribute?.(k)){const x=tr(el.getAttribute(k));if(x!==el.getAttribute(k))el.setAttribute(k,x);}});});document.documentElement.lang=lang();}
let q=false;const schedule=()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply();});};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
document.addEventListener('change',e=>{if(e.target?.id==='zeqviroLanguageSelect')setTimeout(apply,0);});
window.ZeqviroBlock7I18n={apply,translate:tr};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply());else apply();
})();
