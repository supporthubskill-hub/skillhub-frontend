(()=>{
  const money=(value)=>Number.isFinite(Number(value))?Number(value):0;
  const text=(value)=>String(value||'').toLowerCase().trim();

  function ensureAdvancedFilters(){
    if(document.getElementById('block6AdvancedFilters')) return;
    const search=document.getElementById('searchInput');
    const category=document.getElementById('categoryFilter');
    const type=document.getElementById('typeFilter');
    const sort=document.getElementById('sortFilter');
    if(!search||!category||!type||!sort) return;

    const container=search.parentElement;
    if(!container) return;
    container.classList.add('block6-search-panel');

    const oldArea=document.getElementById('areaFilter');
    const oldRow=category.parentElement;
    if(oldArea) oldArea.remove();
    if(oldRow) oldRow.remove();

    const toggle=document.createElement('button');
    toggle.id='block6FilterToggle';
    toggle.type='button';
    toggle.className='btn btn-secondary block6-filter-toggle';
    toggle.setAttribute('aria-expanded','false');
    toggle.textContent='Filtros';

    const advanced=document.createElement('div');
    advanced.id='block6AdvancedFilters';
    advanced.className='block6-advanced-filters';

    const row=document.createElement('div');
    row.className='block6-search-row';
    row.innerHTML=`
      <div class="block6-filter-group"><label for="categoryFilter">Categoría</label></div>
      <div class="block6-filter-group"><label for="typeFilter">Modalidad</label></div>
      <div class="block6-filter-group"><label for="block6MinRating">Calificación mínima</label><select id="block6MinRating"><option value="0">Cualquier calificación</option><option value="4">4.0 o más</option><option value="4.5">4.5 o más</option></select></div>
      <div class="block6-filter-group"><label for="sortFilter">Ordenar</label></div>`;
    row.children[0].appendChild(category);
    row.children[1].appendChild(type);
    row.children[3].appendChild(sort);

    const second=document.createElement('div');
    second.className='block6-search-row';
    second.innerHTML=`
      <div class="block6-filter-group"><label>Rango de precio</label><div class="block6-price-pair"><input id="block6MinPrice" type="number" min="0" step="1" inputmode="decimal" placeholder="Mín. $"><input id="block6MaxPrice" type="number" min="0" step="1" inputmode="decimal" placeholder="Máx. $"></div></div>
      <div class="block6-filter-group"><label>Disponibilidad</label><label class="block6-filter-check"><input id="block6AvailableOnly" type="checkbox"> Mostrar solo servicios con horarios disponibles</label></div>`;

    const area=document.createElement('input');
    area.type='search';area.id='areaFilter';area.placeholder='Ciudad o área general';
    const areaWrap=document.createElement('div');
    areaWrap.className='block6-filter-group';areaWrap.innerHTML='<label for="areaFilter">Ubicación</label>';areaWrap.appendChild(area);
    second.insertBefore(areaWrap,second.firstChild);

    const actions=document.createElement('div');
    actions.className='block6-filter-actions';
    actions.innerHTML='<span id="block6FilterSummary" class="block6-filter-summary" aria-live="polite"></span><button id="block6ClearFilters" type="button" class="btn btn-secondary block6-clear-filters">Limpiar filtros</button>';

    advanced.append(row,second,actions);
    container.append(toggle,advanced);

    toggle.addEventListener('click',()=>{
      const open=advanced.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.textContent=open?'Ocultar filtros':'Filtros';
    });

    [search,area,category,type,sort,document.getElementById('block6MinRating'),document.getElementById('block6MinPrice'),document.getElementById('block6MaxPrice'),document.getElementById('block6AvailableOnly')].forEach(el=>{
      if(!el) return;
      el.removeAttribute('oninput');el.removeAttribute('onchange');
      el.addEventListener(el.tagName==='INPUT'?'input':'change',()=>window.filterServices?.());
      if(el.type==='checkbox') el.addEventListener('change',()=>window.filterServices?.());
    });
    document.getElementById('block6ClearFilters')?.addEventListener('click',clearAdvancedFilters);
  }

  function clearAdvancedFilters(){
    const ids=['searchInput','areaFilter','categoryFilter','typeFilter','block6MinRating','block6MinPrice','block6MaxPrice','block6AvailableOnly'];
    ids.forEach(id=>{const el=document.getElementById(id);if(!el)return;if(el.type==='checkbox')el.checked=false;else el.value=id==='block6MinRating'?'0':'';});
    const sort=document.getElementById('sortFilter');if(sort)sort.value='default';
    window.filterServices?.();
  }

  window.filterServices=function(){
    const list=Array.isArray(window.servicesData)?window.servicesData:(typeof servicesData!=='undefined'&&Array.isArray(servicesData)?servicesData:[]);
    const query=text(document.getElementById('searchInput')?.value);
    const cat=document.getElementById('categoryFilter')?.value||'';
    const area=text(document.getElementById('areaFilter')?.value);
    const type=document.getElementById('typeFilter')?.value||'';
    const sort=document.getElementById('sortFilter')?.value||'default';
    const minRating=money(document.getElementById('block6MinRating')?.value);
    const minPrice=money(document.getElementById('block6MinPrice')?.value);
    const maxPriceRaw=document.getElementById('block6MaxPrice')?.value;
    const maxPrice=maxPriceRaw===''||maxPriceRaw==null?Infinity:money(maxPriceRaw);
    const availableOnly=Boolean(document.getElementById('block6AvailableOnly')?.checked);

    let filtered=list.filter(s=>{
      const haystack=[s.name,s.desc,s.cat,s.category,s.providerName,s.area,s.type].map(text).join(' ');
      const matchesQuery=!query||haystack.includes(query);
      const matchesCat=!cat||(s.cat||s.category)===cat;
      const matchesArea=!area||text(s.area).includes(area);
      const matchesType=!type||s.type===type;
      const rating=money(s.rating);
      const price=money(s.price);
      return matchesQuery&&matchesCat&&matchesArea&&matchesType&&rating>=minRating&&price>=minPrice&&price<=maxPrice&&(!availableOnly||s.hasAvailability!==false);
    });

    filtered=[...filtered].sort((a,b)=>{
      if(sort==='price-asc') return money(a.price)-money(b.price);
      if(sort==='rating') return money(b.rating)-money(a.rating)||money(b.reviewCount)-money(a.reviewCount);
      if(sort==='price-desc') return money(b.price)-money(a.price);
      if(sort==='reviews') return money(b.reviewCount)-money(a.reviewCount);
      if(sort==='available') return Number(b.hasAvailability!==false)-Number(a.hasAvailability!==false);
      return 0;
    });

    const sortEl=document.getElementById('sortFilter');
    if(sortEl&&!sortEl.querySelector('option[value="price-desc"]')) sortEl.insertAdjacentHTML('beforeend','<option value="price-desc">Precio: Mayor a Menor</option><option value="reviews">Más reseñas</option><option value="available">Disponibilidad primero</option>');
    if(typeof window.renderServices==='function') window.renderServices(filtered);
    const grid=document.getElementById('servicesGrid');
    if(grid&&filtered.length===0) grid.innerHTML='<div class="block6-no-results"><strong>No encontramos servicios con esos filtros.</strong><span>Prueba ampliar el precio, la ubicación o quitar algún filtro.</span></div>';
    const summary=document.getElementById('block6FilterSummary');
    if(summary) summary.textContent=`${filtered.length} servicio${filtered.length===1?'':'s'} encontrado${filtered.length===1?'':'s'}`;
  };

  function boot(){ensureAdvancedFilters();setTimeout(()=>window.filterServices?.(),0);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();