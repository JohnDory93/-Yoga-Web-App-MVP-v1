const DEFAULT_IMG = 'assets/hero-yoga.jpg';
const DB_NAME = 'YogaStudioDB';
const STORE = 'media';

const seed = {
  videos: [
    {id:'v1',title:'Morning Reset',description:'A gentle full-body wake-up flow.',duration:15,level:'Beginner',category:'Morning',access:'Free',price:0,image:DEFAULT_IMG,videoKey:null,published:true},
    {id:'v2',title:'Strong & Grounded',description:'A steady practice for core strength and balance.',duration:24,level:'Intermediate',category:'Strength',access:'Member',price:0,image:DEFAULT_IMG,videoKey:null,published:true},
    {id:'v3',title:'Hip Release',description:'Slow mobility for hips, glutes and lower back.',duration:18,level:'Beginner',category:'Mobility',access:'Member',price:0,image:DEFAULT_IMG,videoKey:null,published:true},
    {id:'v4',title:'Evening Unwind',description:'A calming flow to close the day.',duration:22,level:'All levels',category:'Rest',access:'Free',price:0,image:DEFAULT_IMG,videoKey:null,published:true},
    {id:'v5',title:'Power Flow',description:'A dynamic sequence for energy and focus.',duration:30,level:'Intermediate',category:'Vinyasa',access:'Member',price:0,image:DEFAULT_IMG,videoKey:null,published:true}
  ],
  shop: [
    {id:'s1',type:'Program',title:'7-Day Morning Reset',subtitle:'Seven short guided practices',price:39,image:DEFAULT_IMG},
    {id:'s2',type:'Object',title:'Cork Yoga Block',subtitle:'Support, stability and comfort',price:24,image:DEFAULT_IMG},
    {id:'s3',type:'Clothing',title:'Soft Flow Set',subtitle:'Seamless top and leggings',price:89,image:DEFAULT_IMG},
    {id:'s4',type:'Beauty',title:'Evening Ritual Oil',subtitle:'Lavender and jojoba blend',price:28,image:DEFAULT_IMG}
  ],
  favourites:['v3'], completed:['v1'], heroImage:DEFAULT_IMG,
  activity:{steps:6842,walking:4.8,running:1.6,practice:32,streak:4}
};

let state = loadState();
let selectedShopType = 'Program';

function loadState(){
  try { return {...structuredClone(seed), ...JSON.parse(localStorage.getItem('yoga-state-v2')||'{}')}; }
  catch { return structuredClone(seed); }
}
function save(){ localStorage.setItem('yoga-state-v2',JSON.stringify(state)); }
function route(){ return (location.hash||'#home').slice(1).split('/'); }
function navigate(path){ location.hash='#'+path; }
function toast(msg){ const e=document.createElement('div');e.className='toast';e.textContent=msg;document.body.appendChild(e);setTimeout(()=>e.remove(),2200); }
function money(n){ return `CHF ${Number(n).toFixed(0)}`; }
function icon(n){ return ({home:'⌂',explore:'⌕',shop:'◇',practice:'◌',admin:'⚙',play:'▶'})[n]||'•'; }

function openDb(){ return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}); }
async function putMedia(k,f){const db=await openDb();return new Promise((res,rej)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(f,k);tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});}
async function getMedia(k){if(!k)return null;const db=await openDb();return new Promise((res,rej)=>{const r=db.transaction(STORE).objectStore(STORE).get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
function fileToDataUrl(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file);});}

function topbar(active){
 const nav=[['home','Home'],['explore','Explore'],['shop','Shop'],['practice','My practice']];
 return `<header class="topbar"><a class="brand" href="#home"><span class="brand-dot"></span><span>lina<span class="brand-light"> studio</span></span></a><nav>${nav.map(([r,l])=>`<a class="${active===r?'active':''}" href="#${r}">${l}</a>`).join('')}</nav><a class="creator-link ${active==='admin'?'active':''}" href="#admin">Creator access</a></header>`;
}
function mobileNav(active){return `<nav class="mobile-nav">${[['home','Home'],['explore','Explore'],['shop','Shop'],['practice','Practice']].map(([r,l])=>`<a class="${active===r?'active':''}" href="#${r}"><span>${icon(r)}</span>${l}</a>`).join('')}</nav>`;}
function layout(content,active){return `<div class="app-shell">${topbar(active)}<main class="screen">${content}</main>${mobileNav(active)}</div>`;}

function classCard(v,large=false){return `<article class="class-card ${large?'featured':''}" onclick="navigate('watch/${v.id}')"><img src="${v.image||DEFAULT_IMG}" alt="${v.title}"><div class="shade"></div><div class="card-overlay"><span class="card-kicker">${v.category} · ${v.duration} min</span><h3>${v.title}</h3><div class="card-foot"><span>${v.level}</span><button aria-label="Play">▶</button></div></div></article>`;}

function home(){
 const featured=state.videos[0], mini=state.videos.slice(1,4);
 return layout(`<section class="home-layout">
   <article class="home-hero"><img src="${state.heroImage}" alt="Yoga practice"><div class="hero-wash"></div><div class="hero-content"><span class="eyebrow">MOVE WITH INTENTION</span><h1>Feel at home<br>in your body.</h1><p>Short, thoughtful practices for strength, calm and everyday movement.</p><button class="primary" onclick="navigate('watch/${featured.id}')">Start today <span>→</span></button></div></article>
   <aside class="home-side">
     <div class="side-heading"><div><span class="eyebrow">FOR YOU</span><h2>Today’s practice</h2></div><span class="date-chip">15 min</span></div>
     ${classCard(featured,true)}
     <div class="quick-row">${mini.map(v=>`<button onclick="navigate('watch/${v.id}')"><img src="${v.image}"><span><b>${v.title}</b><small>${v.duration} min · ${v.level}</small></span><i>→</i></button>`).join('')}</div>
   </aside>
 </section>`,'home');
}

function explore(){
 return layout(`<section class="module-layout"><header class="module-head"><div><span class="eyebrow">LIBRARY</span><h1>Explore</h1></div><div class="search"><span>⌕</span><input id="search" placeholder="Search practices" oninput="filterExplore()"></div></header>
 <div class="filter-line"><button class="chip active" data-filter="all" onclick="setExploreFilter(this,'all')">All</button>${['Morning','Strength','Mobility','Rest','Vinyasa'].map(x=>`<button class="chip" data-filter="${x}" onclick="setExploreFilter(this,'${x}')">${x}</button>`).join('')}</div>
 <div id="explore-grid" class="explore-grid">${state.videos.filter(v=>v.published).map(v=>classCard(v)).join('')}</div></section>`,'explore');
}
let exploreFilter='all';
window.setExploreFilter=(el,f)=>{exploreFilter=f;document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));el.classList.add('active');filterExplore();};
window.filterExplore=()=>{const q=(document.querySelector('#search')?.value||'').toLowerCase();const list=state.videos.filter(v=>v.published&&(exploreFilter==='all'||v.category===exploreFilter)&&(!q||(v.title+' '+v.description).toLowerCase().includes(q)));document.querySelector('#explore-grid').innerHTML=list.map(v=>classCard(v)).join('')||'<div class="empty">No practices found.</div>';};

function shop(){
 const types=['Program','Object','Clothing','Beauty'];
 const items=state.shop.filter(x=>x.type===selectedShopType);
 return layout(`<section class="module-layout"><header class="module-head"><div><span class="eyebrow">LINA EDIT</span><h1>Shop</h1></div><p class="module-note">Courses and considered essentials for your practice.</p></header>
 <div class="shop-tabs">${types.map(t=>`<button class="${selectedShopType===t?'active':''}" onclick="selectShop('${t}')">${t}${t==='Program'?'s':''}</button>`).join('')}</div>
 <div class="shop-stage">${items.map(item=>`<article class="shop-card"><div class="shop-image"><img src="${item.image}"><span>${item.type}</span></div><div class="shop-copy"><div><h2>${item.title}</h2><p>${item.subtitle}</p></div><div class="shop-buy"><strong>${money(item.price)}</strong><button onclick="toast('Added to your bag')">Add to bag</button></div></div></article>`).join('')}</div></section>`,'shop');
}
window.selectShop=(t)=>{selectedShopType=t;render();};

function practice(){
 const recent=state.videos.slice(0,3);
 return layout(`<section class="practice-layout"><header class="module-head"><div><span class="eyebrow">YOUR SPACE</span><h1>My practice</h1></div><div class="sync-pill"><span></span> Activity overview</div></header>
 <div class="practice-grid">
   <article class="activity-panel"><div class="panel-title"><div><span class="eyebrow">TODAY</span><h2>Daily movement</h2></div><button onclick="editActivity()">Edit</button></div>
     <div class="activity-main"><div class="ring"><div><b>${state.activity.steps.toLocaleString()}</b><small>steps</small></div></div><div class="activity-list"><p><span>Walking</span><b>${state.activity.walking} km</b></p><p><span>Running</span><b>${state.activity.running} km</b></p><p><span>Yoga</span><b>${state.activity.practice} min</b></p></div></div>
     <div class="week-row">${['M','T','W','T','F','S','S'].map((d,i)=>`<div><span class="${i<4?'done':''}">${i<4?'✓':''}</span><small>${d}</small></div>`).join('')}</div>
   </article>
   <article class="continue-panel"><div class="panel-title"><div><span class="eyebrow">CONTINUE</span><h2>Pick up where you left off</h2></div><span>${state.activity.streak} day streak</span></div>${classCard(recent[1],true)}</article>
   <article class="saved-panel"><div class="panel-title"><div><span class="eyebrow">SAVED</span><h2>Your favourites</h2></div><a href="#explore">See all</a></div><div class="saved-list">${recent.map(v=>`<button onclick="navigate('watch/${v.id}')"><img src="${v.image}"><span><b>${v.title}</b><small>${v.duration} min · ${v.category}</small></span><i>▶</i></button>`).join('')}</div></article>
 </div></section>`,'practice');
}
window.editActivity=()=>{const value=prompt('Today’s steps',state.activity.steps);if(value!==null&&!isNaN(value)){state.activity.steps=Number(value);save();render();}};

async function watch(id){
 const v=state.videos.find(x=>x.id===id)||state.videos[0];
 let media='<div class="video-placeholder"><span>▶</span><p>Upload a video in Creator access<br>to preview it here.</p></div>';
 if(v.videoKey){const f=await getMedia(v.videoKey);if(f){const u=URL.createObjectURL(f);media=`<video controls playsinline src="${u}"></video>`;}}
 document.querySelector('#app').innerHTML=layout(`<section class="watch-layout"><div class="watch-player">${media}</div><aside class="watch-info"><a href="#explore" class="back">← Back to explore</a><span class="eyebrow">${v.category.toUpperCase()}</span><h1>${v.title}</h1><p>${v.description}</p><div class="watch-meta"><span>${v.duration} minutes</span><span>${v.level}</span></div><button class="primary wide" onclick="completeVideo('${v.id}')">${state.completed.includes(v.id)?'Completed ✓':'Mark as complete'}</button><div class="up-next"><small>UP NEXT</small>${state.videos.filter(x=>x.id!==v.id).slice(0,2).map(x=>`<button onclick="navigate('watch/${x.id}')"><img src="${x.image}"><span><b>${x.title}</b><small>${x.duration} min</small></span><i>→</i></button>`).join('')}</div></aside></section>`,'explore');
}
window.completeVideo=(id)=>{if(!state.completed.includes(id))state.completed.push(id);save();toast('Practice completed');render();};

function admin(){
 return `<div class="creator-shell"><aside class="creator-side"><a class="brand dark" href="#home"><span class="brand-dot"></span><span>lina studio</span></a><nav><a class="active" href="#admin">Overview</a><a href="#admin/videos">Classes</a><a href="#admin/shop">Shop</a><a href="#admin/brand">Brand</a></nav><a class="back-site" href="#home">← View website</a></aside><main class="creator-main"><header><div><span class="eyebrow">CREATOR ACCESS</span><h1>Overview</h1></div><button class="primary" onclick="navigate('admin/new')">+ Add class</button></header><div class="creator-stats"><div><span>Published classes</span><b>${state.videos.filter(v=>v.published).length}</b></div><div><span>Shop items</span><b>${state.shop.length}</b></div><div><span>Completed sessions</span><b>${state.completed.length}</b></div></div><section class="creator-panel"><div class="panel-title"><div><span class="eyebrow">CONTENT</span><h2>Your classes</h2></div><a href="#admin/videos">Manage all</a></div><div class="creator-list">${state.videos.slice(0,4).map(v=>`<button onclick="navigate('admin/edit/${v.id}')"><img src="${v.image}"><span><b>${v.title}</b><small>${v.duration} min · ${v.category}</small></span><em>${v.published?'Published':'Draft'}</em><i>›</i></button>`).join('')}</div></section></main></div>`;
}
function adminVideos(){return `<div class="creator-shell"><aside class="creator-side"><a class="brand dark" href="#home"><span class="brand-dot"></span><span>lina studio</span></a><nav><a href="#admin">Overview</a><a class="active" href="#admin/videos">Classes</a><a href="#admin/shop">Shop</a><a href="#admin/brand">Brand</a></nav><a class="back-site" href="#home">← View website</a></aside><main class="creator-main"><header><div><span class="eyebrow">CONTENT</span><h1>Classes</h1></div><button class="primary" onclick="navigate('admin/new')">+ Add class</button></header><section class="creator-panel fill"><div class="creator-list large">${state.videos.map(v=>`<button onclick="navigate('admin/edit/${v.id}')"><img src="${v.image}"><span><b>${v.title}</b><small>${v.description}</small></span><em>${v.published?'Published':'Draft'}</em><i>›</i></button>`).join('')}</div></section></main></div>`;}
function adminShop(){return `<div class="creator-shell"><aside class="creator-side"><a class="brand dark" href="#home"><span class="brand-dot"></span><span>lina studio</span></a><nav><a href="#admin">Overview</a><a href="#admin/videos">Classes</a><a class="active" href="#admin/shop">Shop</a><a href="#admin/brand">Brand</a></nav><a class="back-site" href="#home">← View website</a></aside><main class="creator-main"><header><div><span class="eyebrow">COMMERCE</span><h1>Shop</h1></div><button class="primary" onclick="addShopItem()">+ Add item</button></header><section class="creator-panel fill"><div class="shop-admin-grid">${state.shop.map(x=>`<article><img src="${x.image}"><span>${x.type}</span><h3>${x.title}</h3><p>${x.subtitle}</p><b>${money(x.price)}</b></article>`).join('')}</div></section></main></div>`;}
window.addShopItem=()=>{const title=prompt('Item name');if(!title)return;state.shop.push({id:'s'+Date.now(),type:'Object',title,subtitle:'New shop item',price:29,image:state.heroImage});save();render();toast('Shop item added');};
function adminBrand(){return `<div class="creator-shell"><aside class="creator-side"><a class="brand dark" href="#home"><span class="brand-dot"></span><span>lina studio</span></a><nav><a href="#admin">Overview</a><a href="#admin/videos">Classes</a><a href="#admin/shop">Shop</a><a class="active" href="#admin/brand">Brand</a></nav><a class="back-site" href="#home">← View website</a></aside><main class="creator-main"><header><div><span class="eyebrow">APPEARANCE</span><h1>Brand</h1></div></header><section class="brand-editor"><div class="brand-preview"><img src="${state.heroImage}" id="brand-preview"><div><span>Homepage cover</span><h2>Feel at home in your body.</h2></div></div><div class="brand-controls"><h2>Homepage image</h2><p>Choose a vertical or landscape image. It updates immediately across the site.</p><input id="brand-file" type="file" accept="image/*"><button class="primary" onclick="saveBrandImage()">Save image</button></div></section></main></div>`;}
window.saveBrandImage=async()=>{const f=document.querySelector('#brand-file').files[0];if(!f)return toast('Choose an image first');state.heroImage=await fileToDataUrl(f);save();render();toast('Brand image updated');};

function classForm(id){const v=id?state.videos.find(x=>x.id===id):null;return `<div class="creator-shell"><aside class="creator-side"><a class="brand dark" href="#home"><span class="brand-dot"></span><span>lina studio</span></a><nav><a href="#admin">Overview</a><a class="active" href="#admin/videos">Classes</a><a href="#admin/shop">Shop</a><a href="#admin/brand">Brand</a></nav><a class="back-site" href="#admin/videos">← Back to classes</a></aside><main class="creator-main form-page"><header><div><span class="eyebrow">${v?'EDIT':'NEW'} CLASS</span><h1>${v?'Edit class':'Add class'}</h1></div></header><form id="class-form" class="editor-grid" onsubmit="saveClass(event,'${id||''}')"><section class="editor-media"><div class="image-drop"><img id="cover-preview" src="${v?.image||state.heroImage}"><label>Change cover<input id="cover-file" type="file" accept="image/*" onchange="previewCover()"></label></div><div class="video-drop"><span>▶</span><div><b>${v?.videoKey?'Video attached':'Upload class video'}</b><small>MP4, MOV or WebM</small></div><label>Choose file<input id="video-file" type="file" accept="video/*"></label></div></section><section class="editor-fields"><label>Title<input name="title" required value="${v?.title||''}" placeholder="Morning full body flow"></label><label>Description<textarea name="description" rows="3" placeholder="A short description of the practice">${v?.description||''}</textarea></label><div class="two"><label>Duration<input name="duration" type="number" min="1" value="${v?.duration||20}"></label><label>Level<select name="level">${['Beginner','Intermediate','All levels'].map(x=>`<option ${v?.level===x?'selected':''}>${x}</option>`).join('')}</select></label></div><div class="two"><label>Category<select name="category">${['Morning','Strength','Mobility','Rest','Vinyasa'].map(x=>`<option ${v?.category===x?'selected':''}>${x}</option>`).join('')}</select></label><label>Access<select name="access">${['Free','Member'].map(x=>`<option ${v?.access===x?'selected':''}>${x}</option>`).join('')}</select></label></div><label class="publish-row"><input name="published" type="checkbox" ${v?.published!==false?'checked':''}> Publish this class</label><div class="form-actions"><button type="button" class="secondary" onclick="navigate('admin/videos')">Cancel</button><button class="primary">Save class</button></div></section></form></main></div>`;}
window.previewCover=()=>{const f=document.querySelector('#cover-file').files[0];if(f)document.querySelector('#cover-preview').src=URL.createObjectURL(f);};
window.saveClass=async(e,id)=>{e.preventDefault();const fd=new FormData(e.target);let v=id?state.videos.find(x=>x.id===id):null;if(!v){v={id:'v'+Date.now(),image:state.heroImage,videoKey:null};state.videos.unshift(v);}const cover=document.querySelector('#cover-file').files[0];if(cover)v.image=await fileToDataUrl(cover);const video=document.querySelector('#video-file').files[0];if(video){v.videoKey='media-'+v.id;await putMedia(v.videoKey,video);}Object.assign(v,{title:fd.get('title'),description:fd.get('description'),duration:Number(fd.get('duration')),level:fd.get('level'),category:fd.get('category'),access:fd.get('access'),price:0,published:fd.get('published')==='on'});save();navigate('admin/videos');toast('Class saved');};

async function render(){const [r,a,b]=route();const app=document.querySelector('#app');if(r==='home')app.innerHTML=home();else if(r==='explore')app.innerHTML=explore();else if(r==='shop')app.innerHTML=shop();else if(r==='practice')app.innerHTML=practice();else if(r==='watch')await watch(a);else if(r==='admin'&&!a)app.innerHTML=admin();else if(r==='admin'&&a==='videos')app.innerHTML=adminVideos();else if(r==='admin'&&a==='shop')app.innerHTML=adminShop();else if(r==='admin'&&a==='brand')app.innerHTML=adminBrand();else if(r==='admin'&&a==='new')app.innerHTML=classForm();else if(r==='admin'&&a==='edit')app.innerHTML=classForm(b);else navigate('home');}
window.addEventListener('hashchange',render);window.addEventListener('DOMContentLoaded',render);
