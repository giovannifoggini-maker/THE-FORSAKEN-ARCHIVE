/* THE FORSAKEN ARCHIVE — FogLabs
   Vanilla JS, static JSON datasets, localStorage preferences. */
(() => {
  'use strict';

  const DATASET_NAMES = ['characters','survivors','killers','skins','abilities','maps','items','effects','emotes','lore','badges','events','updates','guides','tierlists','sources'];
  const CATEGORY_META = {
    survivors:{title:'Survivors',subtitle:'Personaggi giocabili, ruoli, statistiche note e strumenti di sopravvivenza.',icon:'shield',type:'characters',filter:'role'},
    killers:{title:'Killers',subtitle:'Roster Killer, stili di gioco, statistiche pubblicate e kit documentati.',icon:'skull',type:'characters',filter:'role'},
    skins:{title:'Skins & Milestones',subtitle:'Archivio cosmetici e progressione. Le voci non verificate restano segnalate.',icon:'layers'},
    abilities:{title:'Abilities',subtitle:'Indice dei nomi delle abilità e dei personaggi a cui sono collegate.',icon:'spark'},
    maps:{title:'Maps',subtitle:'Ambientazioni, layout, obiettivi secondari e stato della rotazione.',icon:'map'},
    items:{title:'Items',subtitle:'Oggetti e pickup documentati nelle fonti community.',icon:'box'},
    effects:{title:'Status Effects',subtitle:'Effetti di stato citati nelle abilità e nei pericoli delle mappe.',icon:'activity'},
    emotes:{title:'Emotes',subtitle:'Emote citate nelle note degli aggiornamenti e nelle guide.',icon:'smile'},
    lore:{title:'Lore',subtitle:'Storie e retroscena, separando la lore community dai fatti del gioco.',icon:'book'},
    badges:{title:'Badges & Achievements',subtitle:'Obiettivi documentati e ricompense collegate.',icon:'award'},
    events:{title:'Events',subtitle:'Eventi stagionali e aggiornamenti speciali.',icon:'calendar'},
    updates:{title:'Updates & Patch Notes',subtitle:'Cronologia patch con versione, mese e modifiche riportate.',icon:'file'},
    guides:{title:'Guides',subtitle:'Guide per iniziare, capire le meccaniche e approfondire le mappe.',icon:'compass'},
    tierlists:{title:'Tier Lists',subtitle:'Confronti trasparenti: nessun ranking viene inventato senza criteri e dati.',icon:'chart'}
  };
  const I18N = {
    it:{explore:'ESPLORA ARCHIVIO',overview:'Panoramica',personal:'PERSONALE',compare:'Confronta personaggi',favorites:'Preferiti',history:'Cronologia',search:'Cerca personaggi, mappe, abilità...',searchResults:'RISULTATI',noResults:'Nessun risultato',all:'Tutte le categorie',role:'Ruolo / categoria',status:'Attendibilità',sort:'Ordina',newest:'Più recenti',az:'Nome A–Z',za:'Nome Z–A',open:'Apri scheda',verified:'Community verificato',partial:'Parziale',flagged:'Da verificare',missing:'Non disponibile',dataNote:'Dato non documentato nelle fonti consultate.',compareTitle:'Confronto personaggi',save:'Salva modifiche',export:'Esporta JSON',favorite:'Aggiungi ai preferiti',removeFavorite:'Rimuovi dai preferiti',emptyFavorites:'Non hai ancora salvato preferiti.',emptyHistory:'La cronologia è vuota.',home:'Panoramica',source:'Fonte',back:'Torna alla categoria',editor:'Editor database locale'},
    en:{explore:'EXPLORE ARCHIVE',overview:'Overview',personal:'PERSONAL',compare:'Character comparison',favorites:'Favorites',history:'Recently viewed',search:'Search characters, maps, abilities...',searchResults:'RESULTS',noResults:'No results',all:'All categories',role:'Role / category',status:'Verification',sort:'Sort',newest:'Newest',az:'Name A–Z',za:'Name Z–A',open:'Open entry',verified:'Community verified',partial:'Partial',flagged:'Needs review',missing:'Unavailable',dataNote:'Not documented in the consulted sources.',compareTitle:'Character comparison',save:'Save changes',export:'Export JSON',favorite:'Add to favorites',removeFavorite:'Remove from favorites',emptyFavorites:'No favorites saved yet.',emptyHistory:'Your history is empty.',home:'Overview',source:'Source',back:'Back to category',editor:'Local database editor'}
  };
  const icons = {
    home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/>',
    shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    skull:'<circle cx="12" cy="10" r="8"/><path d="M8 16v4h8v-4M9 9h.01M15 9h.01M9 13h6"/>',
    layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
    spark:'<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z"/>',
    map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/>',
    box:'<path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
    activity:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    book:'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z"/><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20"/>',
    award:'<circle cx="12" cy="8" r="6"/><path d="m8.2 13-1 8L12 18l4.8 3-1-8"/>',
    calendar:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>',
    chart:'<path d="M4 19V5M4 19h17"/><path d="m7 15 4-5 3 2 5-7"/>',
    compare:'<path d="M4 6h16M4 12h16M4 18h16"/><path d="m8 3-4 3 4 3M16 9l4 3-4 3"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    moon:'<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    filter:'<path d="M4 5h16M7 12h10m-7 7h4"/>',
    close:'<path d="m18 6-12 12M6 6l12 12"/>'
  };
  const svgIcon = (name, cls='') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.file}</svg>`;
  document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = svgIcon(el.dataset.icon));

  let db = {};
  let lang = localStorage.getItem('fa-lang') || 'it';
  let currentTheme = localStorage.getItem('fa-theme') || 'dark';
  let lastCategoryFilters = {};
  let searchActiveIndex = -1;

  const clone = obj => JSON.parse(JSON.stringify(obj));
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label = key => (I18N[lang] && I18N[lang][key]) || key;
  const $ = sel => document.querySelector(sel);
  const getItems = key => (db[key] && Array.isArray(db[key].items)) ? db[key].items : [];
  const categoryForRoute = route => route.split('/')[0];
  const toTitle = s => String(s||'').replace(/[-_]/g,' ').replace(/\b\w/g,m=>m.toUpperCase());

  async function initDatabase(){
    db = clone(window.FA_LOCAL_DATA || {});
    if(location.protocol !== 'file:' && window.fetch){
      try{
        const manifestResponse = await fetch('data/manifest.json',{cache:'no-cache'});
        if(manifestResponse.ok){
          const manifest = await manifestResponse.json();
          const names = manifest.meta.datasets || DATASET_NAMES;
          const fetched = await Promise.all(names.map(async name => {
            try{const r=await fetch(`data/${name}.json`,{cache:'no-cache'});if(r.ok)return [name,await r.json()];}catch(e){}
            return [name,db[name]];
          }));
          fetched.forEach(([name,data])=>{if(data)db[name]=data;});
        }
      }catch(e){console.warn('Archive JSON fallback active:',e.message);}
    }
    DATASET_NAMES.forEach(name=>{
      const override=localStorage.getItem(`fa-override-${name}`);
      if(override){try{db[name]=JSON.parse(override);}catch(e){console.warn(`Override non valido: ${name}`);}}
    });
  }

  function getRoute(){
    const raw=(location.hash||'#home').slice(1);
    return raw || 'home';
  }
  function setRoute(route){location.hash=route;}
  function setCurrentNav(route){
    const parts=route.split('/');
    let base=parts[0];
    if(base==='character'){
      const character=getItems('characters').find(item=>item.id===parts[1]);
      base=character?.side==='Killer'?'killers':character?.side==='Survivor'?'survivors':'home';
    } else if(base==='entry') {
      base=parts[1]||'home';
    }
    document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.dataset.route===base));
    let pretty=route==='home'?'ARCHIVE':base.replace(/-/g,' ').toUpperCase();
    if(parts[0]==='character'){
      const character=getItems('characters').find(item=>item.id===parts[1]);
      if(character)pretty=`${base.toUpperCase()} / ${character.name.toUpperCase()}`;
    } else if(parts[0]==='entry' && parts[2]) {
      const item=getItems(parts[1]).find(entry=>entry.id===parts[2]);
      if(item)pretty=`${base.toUpperCase()} / ${(item.name||item.title||item.version||'ENTRY').toUpperCase()}`;
    }
    $('#breadcrumbCurrent').textContent=pretty;
  }
  function applyPreferences(){
    document.documentElement.dataset.theme=currentTheme;
    $('#themeToggle').innerHTML=svgIcon(currentTheme==='dark'?'sun':'moon');
    $('#langToggle').textContent=lang.toUpperCase();
    document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=label(el.dataset.i18n);});
    $('#globalSearch').placeholder=label('search');
  }
  function toast(message){
    const region=$('#toastRegion');const el=document.createElement('div');el.className='toast';el.textContent=message;region.appendChild(el);setTimeout(()=>el.remove(),2600);
  }
  function statusClass(status){
    if(['verified-community','confirmed-update','community-confirmed','community-lore','community-guide','confirmed-community-index'].includes(status))return 'verified';
    if(['flagged','conflict','needs-review'].includes(status))return 'flagged';
    return 'partial';
  }
  function statusText(status){
    const c=statusClass(status);
    if(c==='verified')return label('verified');if(c==='flagged')return label('flagged');return label('partial');
  }
  function statusPill(status){return `<span class="status-label ${statusClass(status)}">${safe(statusText(status))}</span>`;}
  function imageTag(url,alt,cls=''){
    const src=url?safe(url):'assets/images/character-placeholder.svg';
    return `<img class="${cls}" src="${src}" alt="${safe(alt)}" loading="lazy" onerror="this.onerror=null;this.src='assets/images/character-placeholder.svg'">`;
  }
  function sourceLinks(ids){
    const all=getItems('sources');
    const found=(ids||[]).map(id=>all.find(s=>s.id===id)).filter(Boolean);
    if(!found.length)return `<span class="muted">${label('missing')}</span>`;
    return found.map(s=>`<a class="source-chip" href="${safe(s.url)}" target="_blank" rel="noopener">${safe(s.title)} ↗</a>`).join('');
  }
  function allSearchable(){
    const categories=['characters','skins','abilities','maps','items','effects','emotes','lore','badges','events','updates','guides','tierlists'];
    const list=[];
    categories.forEach(key=>getItems(key).forEach(item=>list.push({item,key})));
    return list;
  }
  function openEntry(route){
    if(route.startsWith('character/')){
      const id=route.split('/')[1];const item=getItems('characters').find(x=>x.id===id);
      if(item)saveHistory({id:item.id,name:item.name,route:`character/${item.id}`,kind:item.side});
    } else if(route.startsWith('entry/')){
      const [,cat,id]=route.split('/');const item=getItems(cat).find(x=>x.id===id);
      if(item)saveHistory({id:item.id,name:item.name||item.title||item.version,route,kind:cat});
    }
  }
  function getHistory(){try{return JSON.parse(localStorage.getItem('fa-history')||'[]')}catch(e){return[]}}
  function saveHistory(record){
    let hist=getHistory().filter(x=>x.route!==record.route);hist.unshift({...record,at:Date.now()});hist=hist.slice(0,18);localStorage.setItem('fa-history',JSON.stringify(hist));
  }
  function getFavorites(){try{return JSON.parse(localStorage.getItem('fa-favorites')||'[]')}catch(e){return[]}}
  function isFavorite(id){return getFavorites().includes(id)}
  function toggleFavorite(id){
    let f=getFavorites();if(f.includes(id)){f=f.filter(x=>x!==id);toast('Rimosso dai preferiti.')}else{f.unshift(id);toast('Aggiunto ai preferiti.');}
    localStorage.setItem('fa-favorites',JSON.stringify(f));$('#favoriteCount').textContent=f.length;render();
  }
  function favoriteButton(id){return `<button class="favorite-toggle ${isFavorite(id)?'is-favorite':''}" data-fav="${safe(id)}" title="${isFavorite(id)?label('removeFavorite'):label('favorite')}" aria-label="${label('favorite')}">${svgIcon('heart')}</button>`;}
  function characterSideCounts(){return {survivors:getItems('survivors').length,killers:getItems('killers').length};}

  function renderHome(){
    const counts=characterSideCounts();
    const latest=getItems('updates').slice(0,3);
    const mainCards=[
      ['survivors','Survivors','Ruoli, schede individuali, abilità documentate e statistiche note.','shield'],
      ['killers','Killers','Roster, stili di gioco e dati di bilanciamento disponibili.','skull'],
      ['skins','Skins & Milestones','Cosmetici recenti, milestone e metodi di sblocco.','layers'],
      ['abilities','Abilities','Indice delle abilità con collegamenti ai personaggi.','spark'],
      ['maps','Maps','Ambientazioni, layout, obiettivi e rotazione da verificare.','map'],
      ['guides','Guides','Guide introduttive e approfondimenti community.','compass']
    ];
    return `
      <section class="hero-panel"><div class="hero-grid">
        <div class="hero-copy">
          <div class="hero-kicker">FOGLABS PRESENTS · UNOFFICIAL COMMUNITY ENCYCLOPEDIA</div>
          <h1 class="hero-title">THE FORSAKEN <span>ARCHIVE</span></h1>
          <p class="hero-description">Un archivio indipendente dedicato a <strong>Forsaken</strong> su Roblox. Personaggi, mappe, abilità, cosmetici e lore raccolti in un’unica enciclopedia, con fonti e attendibilità visibili.</p>
          <div class="hero-actions"><a class="primary-btn" href="#survivors">Esplora l’archivio ${svgIcon('arrow')}</a><a class="secondary-btn" href="#updates">Ultimi aggiornamenti</a></div>
          <div class="hero-stamp" style="margin-top:21px"><b>●</b> DATASET COMMUNITY <span>·</span> LAST REVIEW 18 NOV 2026 <span>·</span> GAME INDEX 5.4.2</div>
        </div>
        <div class="hero-art" aria-label="Personaggi Forsaken">
          <div class="hero-portrait first">${imageTag('https://rowikis.com/forsaken/img/characters/1x1x1x1.webp','1x1x1x1')}</div>
          <div class="hero-portrait second">${imageTag('https://rowikis.com/forsaken/img/characters/007n7.webp','007n7')}<div class="portrait-caption">007n7</div></div>
        </div>
      </div></section>
      <section class="metrics-grid">
        <div class="metric-card"><div class="metric-icon">${svgIcon('skull')}</div><div><div class="metric-value">${String(counts.killers).padStart(2,'0')}</div><div class="metric-label">Killers indicizzati</div></div></div>
        <div class="metric-card"><div class="metric-icon">${svgIcon('shield')}</div><div><div class="metric-value">${String(counts.survivors).padStart(2,'0')}</div><div class="metric-label">Survivors indicizzati</div></div></div>
        <div class="metric-card"><div class="metric-icon">${svgIcon('map')}</div><div><div class="metric-value">${String(getItems('maps').length).padStart(2,'0')}</div><div class="metric-label">Mappe in archivio</div></div></div>
        <div class="metric-card"><div class="metric-icon">${svgIcon('layers')}</div><div><div class="metric-value">14</div><div class="metric-label">Sezioni enciclopediche</div></div></div>
      </section>
      <div class="content-grid"><div>
        <div class="section-head" style="margin-top:0"><div><div class="eyebrow">ARCHIVE INDEX</div><h2>Esplora l’enciclopedia</h2><p>Accedi rapidamente alle categorie principali.</p></div><a class="text-link" href="#sources">METODOLOGIA E FONTI ↗</a></div>
        <div class="feature-grid">${mainCards.map(([route,title,desc,icon])=>`<a class="feature-card" href="#${route}"><div class="feature-icon">${svgIcon(icon)}</div><h3>${title}</h3><p>${desc}</p></a>`).join('')}</div>
        <div class="section-head"><div><div class="eyebrow">FULL INDEX</div><h2>Tutte le sezioni</h2><p>14 aree per esplorare ogni aspetto documentato del gioco.</p></div></div>
        <div class="tag-row">${Object.entries(CATEGORY_META).map(([key,m])=>`<a class="tag" href="#${key}">${safe(m.title)}</a>`).join('')}</div>
        <div class="accuracy-note"><div class="note-mark">ⓘ</div><div><strong>TRASPARENZA DEI DATI</strong><p>Questa è una prima edizione dell’archivio, non una wiki completa. Le fonti community non concordano su tutti i conteggi e alcuni valori potrebbero essere superati. Ogni scheda mostra lo stato della verifica; i dati mancanti non vengono inventati.</p></div></div>
      </div><aside class="side-panel"><div class="side-panel-head"><h3>Ultimi aggiornamenti</h3><a class="text-link" href="#updates">TUTTI ↗</a></div>${latest.map(u=>`<a class="update-row" href="#entry/updates/${u.id}"><div class="update-version">${safe(u.version)}</div><div><h4>${safe(u.title)}</h4><p>${safe(u.summary)}</p><small>${safe(u.date)} · COMMUNITY CHANGELOG</small></div></a>`).join('')}<div class="side-panel-head"><h3>In evidenza</h3></div><a class="update-row" href="#character/007n7"><div class="update-version">01</div><div><h4>007n7</h4><p>Una scheda personaggio con dati, abilità e fonti collegate.</p><small>SURVIVOR · SURVIVALIST</small></div></a><a class="update-row" href="#maps"><div class="update-version">19</div><div><h4>Map archive</h4><p>Mappe e varianti raccolte, con rotazione separata.</p><small>MAP DATABASE</small></div></a></aside></div>`;
  }

  function renderCategory(route){
    const meta=CATEGORY_META[route];if(!meta)return render404();
    const items=getItems(route);
    const isChars=route==='survivors'||route==='killers';
    const filters=lastCategoryFilters[route]||{q:'',status:'all',role:'all',sort:'az'};
    const roleOpts=isChars?[...new Set(items.map(x=>x.role).filter(Boolean))]:[];
    const statusOpts=[...new Set(items.map(x=>x.status).filter(Boolean))];
    return `<div class="page-heading"><div><div class="eyebrow">DATABASE / ${route.toUpperCase()}</div><h1>${safe(meta.title)}</h1><p>${safe(meta.subtitle)}</p></div><div class="heading-actions">${isChars?`<a class="secondary-btn" href="#compare">${svgIcon('compare')} Confronta</a>`:''}<span class="status-label partial">${items.length} record iniziali</span></div></div>
      <div class="filterbar"><div class="filter-search">${svgIcon('search')}<input id="categorySearch" type="search" value="${safe(filters.q)}" placeholder="Cerca nella sezione..." aria-label="Cerca nella sezione"></div>
      ${isChars?`<select id="roleFilter" aria-label="Ruolo"><option value="all">Tutti i ruoli</option>${roleOpts.map(x=>`<option value="${safe(x)}" ${filters.role===x?'selected':''}>${safe(x)}</option>`).join('')}</select>`:''}
      <select id="statusFilter" aria-label="Attendibilità"><option value="all">Tutti gli stati</option>${statusOpts.map(x=>`<option value="${safe(x)}" ${filters.status===x?'selected':''}>${safe(statusText(x))}</option>`).join('')}</select>
      <select id="sortFilter" aria-label="Ordinamento"><option value="az" ${filters.sort==='az'?'selected':''}>Nome A–Z</option><option value="za" ${filters.sort==='za'?'selected':''}>Nome Z–A</option><option value="newest" ${filters.sort==='newest'?'selected':''}>Più recenti</option></select><span class="filter-result" id="filterResult">${items.length} voci</span></div>
      <div id="categoryGrid">${renderCategoryGrid(route,items,filters)}</div>
      <div class="accuracy-note"><div class="note-mark">ⓘ</div><div><strong>LEGGI LO STATO DELLA SCHEDA</strong><p>“Community verificato” significa che il dato compare in una o più fonti community consultate; non equivale a una conferma ufficiale degli sviluppatori. “Parziale” indica che mancano dettagli o conferme aggiornate.</p></div></div>`;
  }
  function renderCategoryGrid(route,items,filters){
    let list=items.filter(x=>{
      const name=x.name||x.title||x.version||'';const desc=x.description||x.summary||'';const q=(filters.q||'').toLowerCase();
      const roleOk=filters.role==='all'||!filters.role||x.role===filters.role;
      const statusOk=filters.status==='all'||!filters.status||x.status===filters.status;
      return roleOk&&statusOk&&(`${name} ${desc} ${(x.tags||[]).join(' ')}`).toLowerCase().includes(q);
    });
    list.sort((a,b)=>{
      const an=a.name||a.title||a.version||'';const bn=b.name||b.title||b.version||'';
      if(filters.sort==='za')return bn.localeCompare(an);if(filters.sort==='newest')return String(b.date||b.lastVerified||'').localeCompare(String(a.date||a.lastVerified||''));return an.localeCompare(bn);
    });
    if(!list.length)return `<div class="empty-state"><div class="empty-icon">⌕</div><h3>${label('noResults')}</h3><p>Modifica la ricerca o i filtri selezionati.</p></div>`;
    if(route==='survivors'||route==='killers')return `<div class="card-grid">${list.map(renderCharacterCard).join('')}</div>`;
    return `<div class="compact-grid">${list.map(x=>renderCompactCard(route,x)).join('')}</div>`;
  }
  function renderCharacterCard(c){
    const img=c.image||null;const price=c.unlock||'Sblocco da verificare';const description=c.description||'Descrizione non documentata.';
    return `<article class="entity-card"><a href="#character/${safe(c.id)}" aria-label="Apri ${safe(c.name)}"><div class="entity-card-image">${imageTag(img,c.name)}<span class="card-flag">${statusPill(c.status)}</span></div></a>${favoriteButton(c.id)}<div class="entity-card-body"><div class="entity-card-title"><div><h3>${safe(c.name)}</h3><small>${safe(c.role||c.side)}</small></div></div><p>${safe(description)}</p><div class="tag-row"><span class="tag">${safe(c.side)}</span>${(c.tags||[]).slice(1,3).map(t=>`<span class="tag purple">${safe(t)}</span>`).join('')}</div><div class="entity-card-foot"><span class="card-meta">${safe(price)}</span><a class="card-open" href="#character/${safe(c.id)}">${label('open')} ${svgIcon('arrow')}</a></div></div></article>`;
  }
  function renderCompactCard(category,item){
    const name=item.name||item.title||item.version||'Voce senza nome';const summary=item.description||item.summary||item.environment||'Scheda in corso di documentazione.';
    const id=item.id||'';
    return `<a class="compact-card" href="#entry/${safe(category)}/${safe(id)}" aria-label="Apri scheda ${safe(name)}"><div class="compact-card-top">${statusPill(item.status)}<span class="faint mono">${safe((item.version||item.date||'').toString())}</span></div><h3>${safe(name)}</h3><p>${safe(summary)}</p><div class="compact-card-meta">${item.role?`<span class="tag">${safe(item.role)}</span>`:''}${item.type?`<span class="tag purple">${safe(item.type)}</span>`:''}${item.unlock?`<span class="tag">${safe(item.unlock)}</span>`:''}${item.category?`<span class="tag">${safe(item.category)}</span>`:''}</div></a>`;
  }

  function renderCharacterDetail(id){
    const c=getItems('characters').find(x=>x.id===id);if(!c)return render404();
    const stats=c.stats||{};const val=v=>(v===null||v===undefined||v==='')?label('missing'):safe(v);
    const statDefs=[['Health / HP',stats.health],['Walk speed',stats.walkSpeed],['Sprint speed',stats.sprintSpeed],['Stamina',stats.stamina],['Difficulty',stats.difficulty]];
    if(c.side==='Killer')statDefs.push(['Terror radius',stats.terrorRadius===null||stats.terrorRadius===undefined?null:`${stats.terrorRadius} studs`]);
    const abilities=(c.abilities||[]).filter(x=>!String(x).startsWith('('));
    const sideRoute=c.side==='Killer'?'killers':'survivors';
    return `<a class="back-link" href="#${sideRoute}">← ${label('back')} · ${safe(c.side)}</a>
      <section class="detail-hero"><div><div class="eyebrow">CHARACTER ARCHIVE / ${safe(c.side.toUpperCase())}</div><div class="detail-title">${safe(c.name)}</div><div class="tag-row"><span class="tag red">${safe(c.side)}</span><span class="tag purple">${safe(c.role)}</span>${(c.tags||[]).slice(2,4).map(t=>`<span class="tag">${safe(t)}</span>`).join('')}</div><p class="detail-description">${safe(c.description||label('dataNote'))}</p><div class="detail-actions">${favoriteButton(c.id)}<a class="secondary-btn" href="#compare" data-compare-id="${safe(c.id)}">${svgIcon('compare')} Confronta personaggio</a>${statusPill(c.status)}</div></div><div class="detail-portrait">${imageTag(c.image,c.name)}<span class="detail-image-credit">${c.imageCredit?'Immagine community · fallback se non disponibile':'Placeholder · immagine non verificata'}</span></div></section>
      <div class="stat-grid">${statDefs.map(([n,v])=>`<div class="stat-box"><small>${safe(n)}</small><strong>${val(v)}</strong></div>`).join('')}</div>
      <div class="detail-columns"><section class="detail-panel"><div class="detail-panel-head"><h3>Abilities & kit</h3><span class="tag">${abilities.length} nomi indicizzati</span></div><div class="detail-panel-body">${abilities.length?`<div class="ability-list">${abilities.map(name=>{const ability=getItems('abilities').find(entry=>entry.characterId===c.id&&String(entry.name).toLowerCase()===String(name).toLowerCase());return `<a class="ability-row" href="${ability?`#entry/abilities/${safe(ability.id)}`:'#abilities'}"><strong>${safe(name)}</strong><small>${ability?'APRI SCHEDA ABILITÀ ↗':'DETTAGLI DA SINCRONIZZARE ↗'}</small></a>`;}).join('')}</div>`:`<p class="muted">${label('dataNote')}</p>`}<p class="muted" style="font-size:9px;margin:12px 0 0">Cooldown, effetti e descrizioni dettagliate sono mostrati solo quando supportati da una fonte verificabile. In questa build molti parametri restano intenzionalmente non compilati.</p></div></section>
      <section class="detail-panel"><div class="detail-panel-head"><h3>Unlock & record</h3></div><div class="detail-panel-body"><div class="data-row"><span>Metodo di sblocco</span><strong>${safe(c.unlock||label('missing'))}</strong></div><div class="data-row"><span>Game version</span><strong>${safe(c.gameVersion||'—')}</strong></div><div class="data-row"><span>Ultima revisione archivio</span><strong>${safe(c.lastVerified||'—')}</strong></div><div class="data-row"><span>Skin catalogate qui</span><strong>${getItems('skins').filter(s=>s.characterId===c.id).length||'—'}</strong></div><div class="data-row"><span>Lore</span><strong>${c.lore?safe(c.lore):label('missing')}</strong></div><div class="data-row"><span>Fonti</span><strong>${(c.sourceIds||[]).length} collegate</strong></div></div></section></div>
      <section class="detail-panel" style="margin-top:14px"><div class="detail-panel-head"><h3>Fonti e attendibilità</h3>${statusPill(c.status)}</div><div class="detail-panel-body"><div class="source-list">${sourceLinks(c.sourceIds)}</div><p class="muted" style="font-size:9px;margin:12px 0 0">I dati statistici sono riportati da guide e wiki community. Non rappresentano un controllo automatico del client Roblox; controlla sempre la versione del gioco prima di usare i numeri come riferimento.</p></div></section>`;
  }

  function renderEntryDetail(category,id){
    const item=getItems(category).find(x=>x.id===id);if(!item)return render404();
    const name=item.name||item.title||item.version||'Voce archivio';
    let extra='';
    if(category==='maps'){
      extra=`<div class="detail-columns"><section class="detail-panel"><div class="detail-panel-head"><h3>Layout & punti di interesse</h3></div><div class="detail-panel-body"><p class="muted" style="font-size:10px">${item.layout?safe(item.layout):'Layout dettagliato non ancora verificato per questa mappa.'}</p>${(item.pointsOfInterest||[]).length?item.pointsOfInterest.map(p=>`<div class="data-row"><span>Punto d’interesse</span><strong>${safe(p)}</strong></div>`).join(''):''}</div></section><section class="detail-panel"><div class="detail-panel-head"><h3>Strategie & varianti</h3></div><div class="detail-panel-body"><div class="data-row"><span>Survivor</span><strong>${item.survivorStrategy?safe(item.survivorStrategy):'Da documentare'}</strong></div><div class="data-row"><span>Killer</span><strong>${item.killerStrategy?safe(item.killerStrategy):'Da documentare'}</strong></div><div class="data-row"><span>Rotazione</span><strong>${safe(item.rotationStatus||'Da verificare')}</strong></div><div class="data-row"><span>Varianti registrate</span><strong>${(item.variants||[]).length||'—'}</strong></div></div></section></div>`;
    } else if(category==='abilities'){
      const related=getItems('characters').find(c=>c.id===item.characterId);
      extra=`<div class="detail-panel" style="margin-top:14px"><div class="detail-panel-head"><h3>Collegamenti</h3></div><div class="detail-panel-body">${related?`<a class="source-chip" href="#character/${safe(related.id)}">${safe(related.name)} · ${safe(related.side)} ↗</a>`:'Personaggio collegato non disponibile'}<div class="data-row"><span>Cooldown</span><strong>${item.cooldown??label('missing')}</strong></div><div class="data-row"><span>Effetti</span><strong>${(item.effects||[]).join(', ')||label('missing')}</strong></div></div></div>`;
    } else if(category==='skins'){
      const related=getItems('characters').find(c=>c.id===item.characterId);
      extra=`<div class="detail-panel" style="margin-top:14px"><div class="detail-panel-head"><h3>Personaggio collegato</h3></div><div class="detail-panel-body">${related?`<a class="source-chip" href="#character/${safe(related.id)}">${safe(related.name)} ↗</a>`:'—'}<div class="data-row"><span>Categoria</span><strong>${safe(item.category||'—')}</strong></div><div class="data-row"><span>Sblocco</span><strong>${safe(item.unlock||label('missing'))}</strong></div></div></div>`;
    }
    return `<a class="back-link" href="#${safe(category)}">← ${label('back')} · ${safe(CATEGORY_META[category]?.title||category)}</a><div class="page-heading"><div><div class="eyebrow">ARCHIVE ENTRY / ${safe(category.toUpperCase())}</div><h1>${safe(name)}</h1><p>${safe(item.description||item.summary||'Scheda descrittiva in aggiornamento.')}</p></div>${statusPill(item.status)}</div>
      <div class="detail-panel"><div class="detail-panel-head"><h3>Record</h3><span class="tag">${safe(item.gameVersion||'Forsaken')}</span></div><div class="detail-panel-body">${Object.entries(item).filter(([k,v])=>!['id','name','title','description','summary','sourceIds','status','gameVersion','lastVerified','image','imageCredit','layout','pointsOfInterest','survivorStrategy','killerStrategy','variants','effects','sections'].includes(k)&&v!==null&&v!==''&&typeof v!=='object').map(([k,v])=>`<div class="data-row"><span>${safe(toTitle(k))}</span><strong>${safe(v)}</strong></div>`).join('')}<div class="data-row"><span>Ultima revisione</span><strong>${safe(item.lastVerified||'—')}</strong></div></div></div>${extra}
      <section class="detail-panel" style="margin-top:14px"><div class="detail-panel-head"><h3>Fonti</h3>${statusPill(item.status)}</div><div class="detail-panel-body"><div class="source-list">${sourceLinks(item.sourceIds)}</div></div></section>`;
  }

  function renderCompare(){
    const chars=getItems('characters');
    const survivors=chars.filter(c=>c.side==='Survivor');
    const killers=chars.filter(c=>c.side==='Killer');
    const storedA=localStorage.getItem('fa-compare-a');
    const selectedA=chars.some(c=>c.id===storedA)?storedA:(chars[0]?.id||'');
    const storedB=localStorage.getItem('fa-compare-b');
    const selectedB=chars.some(c=>c.id===storedB&&c.id!==selectedA)?storedB:(chars.find(c=>c.id!==selectedA)?.id||selectedA);
    const options=(list,selected)=>list.map(c=>`<option value="${safe(c.id)}" ${c.id===selected?'selected':''}>${safe(c.name)}</option>`).join('');
    return `<div class="page-heading"><div><div class="eyebrow">TOOLS / CHARACTER DATA</div><h1>${label('compareTitle')}</h1><p>Confronta qualsiasi coppia di personaggi, anche di lati diversi. I campi mancanti restano visibili come tali e non vengono stimati.</p></div><span class="status-label partial">Stat comparison</span></div><div class="compare-stage"><div class="compare-pickers"><label>Personaggio A<select id="compareA"><optgroup label="Survivors">${options(survivors,selectedA)}</optgroup><optgroup label="Killers">${options(killers,selectedA)}</optgroup></select></label><div class="versus">VS</div><label>Personaggio B<select id="compareB"><optgroup label="Survivors">${options(survivors,selectedB)}</optgroup><optgroup label="Killers">${options(killers,selectedB)}</optgroup></select></label></div><div id="compareResult"></div><p class="compare-hint">Nota: statistiche raccolte da fonti community con date diverse; non è un giudizio di forza e non costituisce una tier list. I dati non disponibili non vengono stimati.</p></div>`;
  }
  function updateCompare(){
    const chars=getItems('characters');
    const a=chars.find(c=>c.id===$('#compareA')?.value);
    let b=chars.find(c=>c.id===$('#compareB')?.value);
    if(!a)return;
    if(b&&a.id===b.id){
      b=chars.find(c=>c.id!==a.id);
      if(b&&$('#compareB'))$('#compareB').value=b.id;
    }
    if(!b)return;
    localStorage.setItem('fa-compare-a',a.id);localStorage.setItem('fa-compare-b',b.id);
    const rows=[['Lato',a.side,b.side],['Ruolo',a.role,b.role],['Health / HP',a.stats?.health,b.stats?.health],['Walk speed',a.stats?.walkSpeed,b.stats?.walkSpeed],['Sprint speed',a.stats?.sprintSpeed,b.stats?.sprintSpeed],['Stamina',a.stats?.stamina,b.stats?.stamina],['Difficulty',a.stats?.difficulty,b.stats?.difficulty],['Unlock',a.unlock,b.unlock]];
    $('#compareResult').innerHTML=`<table class="compare-table"><thead><tr><th>Parametro</th><th>${safe(a.name)}</th><th>${safe(b.name)}</th></tr></thead><tbody>${rows.map(([l,av,bv])=>`<tr><td>${safe(l)}</td><td>${av===null||av===undefined?'Non verificato':safe(av)}</td><td>${bv===null||bv===undefined?'Non verificato':safe(bv)}</td></tr>`).join('')}</tbody></table>`;
  }
  function renderPersonal(which){
    let records=[];
    if(which==='favorites'){
      const ids=getFavorites();records=ids.map(id=>getItems('characters').find(c=>c.id===id)||allSearchable().find(x=>x.item.id===id)?.item).filter(Boolean);
    }else{
      records=getHistory().map(h=>({...h,_history:true}));
    }
    if(!records.length)return `<div class="page-heading"><div><div class="eyebrow">PERSONAL ARCHIVE</div><h1>${which==='favorites'?label('favorites'):label('history')}</h1><p>Salvati solo in questo browser tramite LocalStorage.</p></div></div><div class="empty-state"><div class="empty-icon">${which==='favorites'?'♡':'◷'}</div><h3>${which==='favorites'?label('emptyFavorites'):label('emptyHistory')}</h3><p>Apri una scheda per aggiungerla alla tua cronologia o premi il cuore per salvarla.</p></div>`;
    return `<div class="page-heading"><div><div class="eyebrow">PERSONAL ARCHIVE</div><h1>${which==='favorites'?label('favorites'):label('history')}</h1><p>Salvati solo in questo browser tramite LocalStorage.</p></div><button class="ghost-btn" data-action="clear-${which}">Svuota</button></div><div class="compact-grid">${records.map(r=>{
      const route=r.route||`character/${r.id}`;const name=r.name||'Voce';const meta=r.kind||'Record';
      return `<a class="compact-card" href="#${safe(route)}"><div class="compact-card-top"><span class="tag">${safe(meta)}</span>${r._history?`<span class="faint">${new Date(r.at).toLocaleDateString(lang==='it'?'it-IT':'en-US')}</span>`:statusPill(r.status)}</div><h3>${safe(name)}</h3><p>${safe(r.description||'Apri la scheda per consultare i dettagli e le fonti.')}</p><div class="compact-card-meta"><span class="card-open">${label('open')} ${svgIcon('arrow')}</span></div></a>`;
    }).join('')}</div>`;
  }
  function renderSources(){
    const items=getItems('sources');
    return `<div class="page-heading"><div><div class="eyebrow">EDITORIAL POLICY</div><h1>Fonti & attendibilità</h1><p>Le informazioni sono raccolte da pagine community e dalla pagina del gioco. Nessuna collaborazione ufficiale è implicita.</p></div><span class="status-label verified">Source index</span></div><div class="accuracy-note" style="margin:0 0 18px"><div class="note-mark">ⓘ</div><div><strong>COME LEGGERE LE ETICHETTE</strong><p><b>Community verificato</b>: il dato compare in una fonte community identificata. <b>Parziale</b>: mancano parametri, la pagina è datata o le fonti non concordano. <b>Da verificare</b>: c’è una discrepanza o un valore anomalo. Nessuna di queste etichette equivale a una conferma del team di sviluppo.</p></div></div><div class="compact-grid">${items.map(s=>`<article class="source-card"><h3>${safe(s.title)}</h3><p>${safe(s.licenseNote||s.kind||'Fonte consultata.')}</p><span class="tag">${safe(s.kind)}</span><div style="margin-top:12px"><a href="${safe(s.url)}" target="_blank" rel="noopener">Apri fonte originale ↗</a></div></article>`).join('')}</div><div class="section-head"><div><h2>Discrepanze note</h2><p>Conflitti rilevati durante l’avvio del progetto.</p></div></div><div class="detail-panel"><div class="detail-panel-body"><div class="data-row"><span>Conteggio Survivor</span><strong>12 vs 13 in fonti community differenti</strong></div><div class="data-row"><span>Conteggio mappe</span><strong>17 in un indice dettagliato; 19 in un altro indice</strong></div><div class="data-row"><span>Conteggio skin</span><strong>Cataloghi con snapshot e conteggi diversi</strong></div><div class="data-row"><span>Statistiche</span><strong>Alcuni numeri derivano da snapshot del 28 agosto 2026</strong></div></div></div>`;
  }
  function renderEditor(){
    const keys=DATASET_NAMES.filter(k=>k!=='sources');
    return `<div class="page-heading"><div><div class="eyebrow">LOCAL TOOLS / DATA MANAGEMENT</div><h1>${label('editor')}</h1><p>Modifica una copia locale del database. Le modifiche sono salvate nel LocalStorage di questo browser e possono essere esportate in JSON.</p></div><span class="status-label partial">Local only</span></div><div class="editor-layout"><aside class="editor-help"><h3>Editor locale</h3><p>Questo strumento non invia dati a server e non aggiorna automaticamente GitHub o Cloudflare.</p><ul><li>Seleziona un dataset.</li><li>Modifica il JSON e valida la sintassi.</li><li>Salva la copia in questo browser.</li><li>Esporta il file e sostituisci il JSON nel progetto per pubblicare i cambiamenti.</li></ul><p><b>Per il test locale:</b> dopo aver sostituito i JSON, esegui <span class="mono">python tools/generate-local-bundle.py</span> per aggiornare il fallback di <span class="mono">file://</span>.</p></aside><section class="editor-workspace"><div class="editor-toolbar"><select class="field-select" id="editorDataset">${keys.map(k=>`<option value="${k}">${k}.json</option>`).join('')}</select><button class="secondary-btn" data-action="editor-load">Carica</button><button class="secondary-btn" data-action="editor-validate">Valida JSON</button><button class="primary-btn" data-action="editor-save">${label('save')}</button><button class="ghost-btn" data-action="editor-export">${label('export')}</button><label class="ghost-btn" for="editorImport">Importa file</label><input id="editorImport" type="file" accept="application/json,.json" hidden></div><textarea id="editorText" spellcheck="false" aria-label="JSON editor"></textarea><div class="editor-msg" id="editorMessage">Seleziona un dataset per iniziare.</div></section></div>`;
  }
  function render404(){return `<div class="empty-state" style="margin:40px auto;max-width:620px"><div class="empty-icon">404</div><h3>Pagina non trovata</h3><p>La voce richiesta non esiste nel database o il collegamento non è più valido.</p><div style="margin-top:15px"><a class="primary-btn" href="#home">Torna alla home</a></div></div>`;}

  function render(){
    const route=getRoute();setCurrentNav(route);$('#favoriteCount').textContent=getFavorites().length;
    if(route.startsWith('character/')){$('#appMain').innerHTML=renderCharacterDetail(route.split('/')[1]);openEntry(route);}
    else if(route.startsWith('entry/')){const [,cat,id]=route.split('/');$('#appMain').innerHTML=renderEntryDetail(cat,id);openEntry(route);}
    else if(CATEGORY_META[route])$('#appMain').innerHTML=renderCategory(route);
    else if(route==='home')$('#appMain').innerHTML=renderHome();
    else if(route==='compare'){$('#appMain').innerHTML=renderCompare();updateCompare();}
    else if(route==='favorites'||route==='history')$('#appMain').innerHTML=renderPersonal(route);
    else if(route==='sources')$('#appMain').innerHTML=renderSources();
    else if(route==='admin')$('#appMain').innerHTML=renderEditor();
    else $('#appMain').innerHTML=render404();
    bindPageEvents(route);
    $('#searchSuggestions').hidden=true;
    applyPreferences();
  }

  function bindPageEvents(route){
    if(CATEGORY_META[route]){
      const search=$('#categorySearch'),role=$('#roleFilter'),status=$('#statusFilter'),sort=$('#sortFilter');
      const apply=()=>{
        const filters={q:search?.value||'',role:role?.value||'all',status:status?.value||'all',sort:sort?.value||'az'};lastCategoryFilters[route]=filters;
        const total=renderCategoryGrid(route,getItems(route),filters);$('#categoryGrid').innerHTML=total;$('#filterResult').textContent=`${$('#categoryGrid').querySelectorAll('.entity-card,.compact-card').length} voci`;
      };
      [search,role,status,sort].filter(Boolean).forEach(el=>el.addEventListener(el===search?'input':'change',apply));
    }
    if(route==='compare'){$('#compareA')?.addEventListener('change',updateCompare);$('#compareB')?.addEventListener('change',updateCompare);}
    if(route==='admin'){
      loadEditor();
      $('#editorDataset')?.addEventListener('change',loadEditor);
      $('#editorImport')?.addEventListener('change',importEditorFile);
    }
  }

  function globalSearch(query){
    const q=query.trim().toLowerCase();const wrap=$('#searchSuggestions');if(!q){wrap.hidden=true;return;}
    const matches=allSearchable().filter(({item})=>`${item.name||''} ${item.title||''} ${item.version||''} ${item.description||''} ${item.summary||''} ${(item.tags||[]).join(' ')}`.toLowerCase().includes(q)).slice(0,8);
    if(!matches.length){wrap.innerHTML=`<div class="suggestion-row"><span class="suggestion-type">${label('noResults')}</span><span class="suggestion-name">Prova un altro termine</span></div>`;wrap.hidden=false;return;}
    wrap.innerHTML=`<div class="side-label">${label('searchResults')}</div>${matches.map(({item,key})=>{const isCharacter=key==='characters';const route=isCharacter?`character/${item.id}`:`entry/${key}/${item.id}`;return `<a class="suggestion-row" href="#${safe(route)}"><span class="suggestion-type">${safe(isCharacter?item.side:key)}</span><span class="suggestion-name">${safe(item.name||item.title||item.version)}</span><span class="suggestion-meta">↗</span></a>`;}).join('')}`;wrap.hidden=false;
  }

  function loadEditor(){
    const key=$('#editorDataset')?.value;if(!key||!$('#editorText'))return;
    $('#editorText').value=JSON.stringify(db[key]||{meta:{},items:[]},null,2);$('#editorMessage').textContent=`Dataset ${key}.json caricato.`;
  }
  function validateEditor(){
    try{const obj=JSON.parse($('#editorText').value);if(!obj||!Array.isArray(obj.items))throw new Error('Il JSON deve contenere un array "items".');$('#editorMessage').textContent=`JSON valido · ${obj.items.length} record.`;return obj;}
    catch(e){$('#editorMessage').textContent=`Errore: ${e.message}`;return null;}
  }
  function saveEditor(){
    const obj=validateEditor();if(!obj)return;const key=$('#editorDataset').value;localStorage.setItem(`fa-override-${key}`,JSON.stringify(obj));db[key]=obj;$('#editorMessage').textContent=`${key}.json salvato in LocalStorage. Esporta il file per pubblicarlo.`;toast('Modifica locale salvata.');
  }
  function exportEditor(){
    const obj=validateEditor();if(!obj)return;const key=$('#editorDataset').value;download(`${key}.json`,JSON.stringify(obj,null,2),'application/json');
  }
  function download(filename,content,type){
    const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  }
  async function importEditorFile(e){
    const file=e.target.files?.[0];if(!file)return;try{const text=await file.text();JSON.parse(text);$('#editorText').value=text;$('#editorMessage').textContent=`File ${file.name} importato nell’editor. Premi Salva per applicarlo.`;}catch(err){$('#editorMessage').textContent=`File non valido: ${err.message}`;}e.target.value='';
  }

  // Global events and real interactions
  window.addEventListener('hashchange',()=>{render();$('#appMain').focus({preventScroll:true});window.scrollTo(0,0);});
  $('#globalSearch').addEventListener('input',e=>globalSearch(e.target.value));
  $('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const first=$('#searchSuggestions a');if(first)first.click();}if(e.key==='Escape')$('#searchSuggestions').hidden=true;});
  document.addEventListener('click',e=>{
    const compare=e.target.closest('[data-compare-id]');
    if(compare){e.preventDefault();localStorage.setItem('fa-compare-a',compare.dataset.compareId);localStorage.removeItem('fa-compare-b');setRoute('compare');return;}
    const fav=e.target.closest('[data-fav]');if(fav){e.preventDefault();e.stopPropagation();toggleFavorite(fav.dataset.fav);return;}
    const go=e.target.closest('[data-go]');if(go){setRoute(go.dataset.go);return;}
    const action=e.target.closest('[data-action]')?.dataset.action;
    if(!action)return;
    if(action==='clear-favorites'){localStorage.removeItem('fa-favorites');render();toast('Preferiti svuotati.');}
    if(action==='clear-history'){localStorage.removeItem('fa-history');render();toast('Cronologia svuotata.');}
    if(action==='editor-load')loadEditor();
    if(action==='editor-validate')validateEditor();
    if(action==='editor-save')saveEditor();
    if(action==='editor-export')exportEditor();
  });
  $('#themeToggle').addEventListener('click',()=>{currentTheme=currentTheme==='dark'?'light':'dark';localStorage.setItem('fa-theme',currentTheme);applyPreferences();});
  $('#langToggle').addEventListener('click',()=>{lang=lang==='it'?'en':'it';localStorage.setItem('fa-lang',lang);render();});
  $('#adminShortcut').addEventListener('click',()=>setRoute('admin'));
  $('#mobileMenu').addEventListener('click',()=>{$('#sidebar').classList.add('open');$('#mobileBackdrop').classList.add('show');});
  $('#sidebarClose').addEventListener('click',closeMobileMenu);
  $('#mobileBackdrop').addEventListener('click',closeMobileMenu);
  function closeMobileMenu(){$('#sidebar').classList.remove('open');$('#mobileBackdrop').classList.remove('show');}
  document.addEventListener('click',e=>{if(e.target.closest('.nav-link'))closeMobileMenu();if(!e.target.closest('#globalSearchWrap'))$('#searchSuggestions').hidden=true;});
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#globalSearch').focus();}if(e.key==='Escape')$('#searchSuggestions').hidden=true;});

  (async()=>{await initDatabase();applyPreferences();render();})();
})();
