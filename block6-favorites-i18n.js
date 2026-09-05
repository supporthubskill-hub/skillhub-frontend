(()=>{
  const STORAGE_KEY='zeqviroLanguage';
  const supported=['es','en','pt','fr','zh'];
  const table={
    'Mis favoritos':{en:'My favorites',pt:'Meus favoritos',fr:'Mes favoris',zh:'我的收藏'},
    'Todos los servicios':{en:'All services',pt:'Todos os serviços',fr:'Tous les services',zh:'所有服务'},
    'Guarda servicios para encontrarlos fácilmente después.':{en:'Save services so you can find them easily later.',pt:'Salve serviços para encontrá-los facilmente depois.',fr:'Enregistrez des services pour les retrouver facilement plus tard.',zh:'收藏服务，方便以后快速找到。'},
    'Inicia sesión para guardar favoritos.':{en:'Sign in to save favorites.',pt:'Entre para salvar favoritos.',fr:'Connectez-vous pour enregistrer des favoris.',zh:'登录后即可收藏服务。'},
    'Guardar en favoritos':{en:'Save to favorites',pt:'Salvar nos favoritos',fr:'Ajouter aux favoris',zh:'添加到收藏'},
    'Quitar de favoritos':{en:'Remove from favorites',pt:'Remover dos favoritos',fr:'Retirer des favoris',zh:'从收藏中移除'},
    'No tienes servicios favoritos disponibles.':{en:'You do not have any favorite services available.',pt:'Você não tem serviços favoritos disponíveis.',fr:'Vous n’avez aucun service favori disponible.',zh:'你目前没有可用的收藏服务。'},
    'Guarda servicios con el corazón para volver a ellos después.':{en:'Save services with the heart so you can return to them later.',pt:'Salve serviços com o coração para voltar a eles depois.',fr:'Ajoutez des services avec le cœur pour les retrouver plus tard.',zh:'点击爱心收藏服务，之后可以快速返回。'},
    'favorito':{en:'favorite',pt:'favorito',fr:'favori',zh:'个收藏'},
    'favoritos':{en:'favorites',pt:'favoritos',fr:'favoris',zh:'个收藏'}
  };
  const reverse=new Map();
  Object.entries(table).forEach(([es,values])=>{reverse.set(es,es);Object.values(values).forEach(value=>reverse.set(value,es));});
  const language=()=>{const value=window.ZeqviroI18n?.language||localStorage.getItem(STORAGE_KEY)||'es';return supported.includes(value)?value:'es';};
  function translate(value){
    if(!value)return value;
    const raw=String(value),trimmed=raw.trim();
    let canonical=reverse.get(trimmed);
    if(!canonical){
      const match=trimmed.match(/^Mis favoritos \((\d+)\)$/)||trimmed.match(/^My favorites \((\d+)\)$/)||trimmed.match(/^Meus favoritos \((\d+)\)$/)||trimmed.match(/^Mes favoris \((\d+)\)$/);
      if(match){const label=language()==='es'?'Mis favoritos':(table['Mis favoritos'][language()]||'Mis favoritos');return raw.replace(trimmed,`${label} (${match[1]})`);}
      const count=trimmed.match(/^(\d+) (favorito|favoritos|favorite|favorites|favori|favoris)$/);
      if(count){const key=Number(count[1])===1?'favorito':'favoritos';const label=language()==='es'?key:(table[key][language()]||key);return raw.replace(trimmed,`${count[1]} ${label}`);}
      return value;
    }
    const lang=language();const next=lang==='es'?canonical:(table[canonical]?.[lang]||canonical);return raw.replace(trimmed,next);
  }
  function apply(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{if(!node.parentElement?.closest('#block6FavoritesBar,.block6-favorite-button,.block6-favorites-empty,#block6FilterSummary'))return;const next=translate(node.nodeValue);if(next!==node.nodeValue)node.nodeValue=next;});
    root.querySelectorAll?.('.block6-favorite-button').forEach(el=>{['title','aria-label'].forEach(attr=>{const value=el.getAttribute(attr);const next=translate(value);if(next!==value)el.setAttribute(attr,next);});});
  }
  let scheduled=false;const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply();});};
  const observer=new MutationObserver(schedule);
  function start(){apply();observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','aria-label']});document.addEventListener('change',event=>{if(event.target?.id==='zeqviroLanguageSelect')setTimeout(apply,0);});}
  window.ZeqviroFavoritesI18n={apply,translate};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
