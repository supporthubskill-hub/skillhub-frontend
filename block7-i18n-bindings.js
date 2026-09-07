(()=>{'use strict';
const core=()=>window.ZeqviroI18nCore;
const t=(k,f='')=>core()?.t?.(k)||f;
const set=(sel,key,prefix='')=>{const e=document.querySelector(sel);if(e){e.dataset.i18n=key;e.textContent=prefix+t(key,e.textContent.replace(prefix,''));}};
const labelFor=(id,key)=>{const e=document.getElementById(id);const l=e?.closest('.form-group')?.querySelector('label');if(l){l.dataset.i18n=key;l.textContent=t(key,l.textContent);}};
const placeholder=(id,key)=>{const e=document.getElementById(id);if(e){e.dataset.i18nPlaceholder=key;e.placeholder=t(key,e.placeholder);}};
const nav=(tab,key)=>{const e=document.querySelector(`.bottom-nav [data-tab="${tab}"]`);if(!e)return;const icon=e.querySelector('span')?.textContent||'';e.dataset.i18nNav=key;const text=[...e.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(text)text.nodeValue=t(key);else e.append(document.createTextNode(t(key)));if(icon&&e.querySelector('span'))e.querySelector('span').textContent=icon;};
function search(){
 set('.marketplace-eyebrow','search.eyebrow');set('#marketplaceHeroTitle','search.title');set('.marketplace-hero-copy > p','search.subtitle');
 const actions=document.querySelectorAll('.marketplace-hero-actions button');if(actions[0]){actions[0].dataset.i18n='search.button';actions[0].textContent=t('search.button');}if(actions[1]){actions[1].dataset.i18n='search.offer';actions[1].textContent=t('search.offer');}
 const cats=document.querySelectorAll('.marketplace-categories button');[['search.all','✨ '],['search.development','💻 '],['search.home','🏠 '],['search.education','📚 ']].forEach(([k,p],i)=>{if(cats[i]){cats[i].dataset.i18n=k;cats[i].textContent=p+t(k);}});
 placeholder('searchInput','search.placeholder');set('#block6FilterToggle','search.filters');
 const f=document.getElementById('block6FavoritesBar');if(f){const s=f.querySelector('strong');if(s)s.textContent='❤️ '+t('favorites.title');const h=document.getElementById('block6FavoritesHint');if(h&&!window.session?.token)h.textContent=t('favorites.signIn');}
 const r=document.getElementById('block6RequestsBar');if(r){const s=r.querySelector('strong'),p=r.querySelector('span'),b=r.querySelector('button');if(s)s.textContent='📝 '+t('requests.title');if(p)p.textContent=t('requests.copy');if(b)b.textContent=t('requests.view');}
 document.querySelectorAll('.block6-no-results').forEach(e=>{const a=e.querySelector('strong'),b=e.querySelector('span');if(a)a.textContent=t('search.noServices');if(b)b.textContent=t('search.expandFilters');});
}
function services(){
 set('#tab-publish .marketplace-hero .marketplace-section-kicker','services.yourServices');set('#tab-publish .marketplace-hero h1, #tab-publish .marketplace-hero h2','services.publish');
 const form=document.getElementById('serviceForm');if(form){labelFor('serviceName','services.name');labelFor('serviceDesc','services.description');labelFor('serviceCat','services.category');labelFor('serviceType','services.type');labelFor('servicePrice','services.fixedPrice');labelFor('serviceHourly','services.hourlyPrice');labelFor('serviceArea','services.area');}
 labelFor('availabilityService','services.service');labelFor('availabilityStart','services.exactTime');labelFor('availabilityDuration','services.duration');
 const add=document.querySelector('#availabilityForm button[type="submit"], #addAvailabilityButton');if(add)add.textContent=t('services.addTime');
 const booking=document.getElementById('bookingsList');if(booking&&/Inicia sesión|Sign in|Entre|Connectez|登录/.test(booking.textContent))booking.textContent=t('services.bookingSignIn');
}
function chat(){
 set('#tab-chat .card > h3','chat.messages','💬 ');const login=document.getElementById('chatLoginNotice');if(login)login.textContent=t('chat.accountCopy');
 set('#chatTitle','chat.select');set('#chatSafetyBar strong','chat.protected','🛡️ ');set('#chatSafetyCopy','chat.protectedCopy');set('#chatReportUser','chat.report');set('#chatBlockUser','chat.block');
 const empty=document.querySelector('#tab-chat .chat-box .chat-empty, #tab-chat .chat-empty:not(#chatLoginNotice)');if(empty&&/mensajes|messages|mensagens|messages|消息/i.test(empty.textContent))empty.textContent=t('chat.empty');
 const input=document.getElementById('chatInput');if(input)input.placeholder=t('chat.messages');const send=document.querySelector('#tab-chat button[onclick*="send"], #tab-chat .chat-panel .btn');if(send&&/Enviar|Send|Envoyer|发送/.test(send.textContent))send.textContent=t('chat.send');
}
function profile(){
 set('#tab-profile .card > h3','profile.yourProfile','👤 ');const intro=document.querySelector('#tab-profile .card > p.service-meta');if(intro)intro.textContent=t('profile.subtitle');const login=document.getElementById('profilePageLogin');if(login)login.textContent=t('profile.signIn');
}
function help(){
 const beta=document.querySelector('.beta-readiness-card');if(beta){set('.beta-readiness-head .marketplace-section-kicker','help.center');set('.beta-readiness-head h2','help.safeTitle');const cells=beta.querySelectorAll('.beta-safety-grid > div');[['help.review','help.reviewCopy'],['help.context','help.contextCopy'],['help.report','help.reportCopy']].forEach(([a,b],i)=>{if(cells[i]){const s=cells[i].querySelector('strong'),p=cells[i].querySelector('span');if(s)s.textContent=t(a);if(p)p.textContent=t(b);}});const note=beta.querySelector('.beta-payment-note');if(note){const s=note.querySelector('strong'),p=note.querySelector('span');if(s)s.textContent=t('help.payments');if(p)p.textContent=t('help.paymentsCopy');}}
 const cards=document.querySelectorAll('#tab-dashboard > .card');if(cards[0]){const h=cards[0].querySelector('h3'),p=cards[0].querySelector('p'),b=cards[0].querySelector('button');if(h)h.textContent='🧭 '+t('help.help');if(p)p.textContent=t('help.helpCopy');if(b)b.textContent='⭐ '+t('favorites.title').replace(t('favorites.title'),'')+(core()?.language?.()==='es'?'Mis reseñas':core()?.language?.()==='en'?'My reviews':core()?.language?.()==='pt'?'Minhas avaliações':core()?.language?.()==='fr'?'Mes avis':'我的评价');}
 if(cards[1]){const h=cards[1].querySelector('h3'),b=cards[1].querySelector('#verifyButton'),h4=cards[1].querySelector('h4');if(h)h.textContent='🛡️ '+t('help.security');if(b)b.textContent=t('help.verifyIdentity');if(h4)h4.textContent=t('help.reports');}
 if(cards[2]){const h=cards[2].querySelector('h3'),p=cards[2].querySelector('p'),labels=cards[2].querySelectorAll('label'),b=cards[2].querySelector('button[type="submit"]');if(h)h.textContent='🆘 '+t('help.support');if(p)p.textContent=t('help.supportCopy');if(labels[0])labels[0].textContent=t('help.email');if(labels[1])labels[1].textContent=t('help.subject');if(labels[2])labels[2].textContent=t('help.message');if(b)b.textContent=t('help.contact');}
}
function header(){const auth=document.getElementById('authButton');if(auth&&!window.session?.token)auth.textContent='👤 '+t('header.signIn');const mode=document.querySelector('.header-actions button[onclick*="toggleDarkMode"]');if(mode)mode.textContent='🌙 '+t('header.mode');nav('tab-search','nav.search');nav('tab-publish','nav.services');nav('tab-chat','nav.chat');nav('tab-profile','nav.profile');nav('tab-dashboard','nav.help');}
function legal(){document.querySelectorAll('a').forEach(a=>{const s=a.textContent.trim();if(['Términos','Terms','Termos','Conditions','条款'].includes(s))a.textContent=t('legal.terms');if(['Privacidad','Privacy','Privacidade','Confidentialité','隐私'].includes(s))a.textContent=t('legal.privacy');if(['Normas de la comunidad','Community Guidelines','Diretrizes da comunidade','Règles de la communauté','社区准则'].includes(s))a.textContent=t('legal.guidelines');});document.querySelectorAll('footer, .legal-footer').forEach(f=>{[...f.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).forEach(n=>{if(/Zeqviro/.test(n.nodeValue||''))n.nodeValue=t('legal.footer');});});}
function apply(){if(!core())return;header();search();services();chat();profile();help();legal();core().apply();}
let q=false;function schedule(){if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply();});}
function start(){apply();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});document.addEventListener('zeqviro:languagechange',apply);}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start):start();window.ZeqviroI18nBindings={apply};
})();