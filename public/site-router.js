(()=>{
const assets=__SITE_ASSET_URLS__,factories=new Map(),loads=new Map(),snapshots=new Map(),recent=new Map(),catalogs=new Map();
const root=document.getElementById('app'),push=history.pushState.bind(history),replace=history.replaceState.bind(history);
let runtime=null,scope=null,key='',currentURL=location.href,index=history.state?.journeyIndex||0,serial=0,ignorePop=false,restoring=false;
const preference=()=>{try{return localStorage.getItem('aipath-language')}catch{return 'ko'}};
const language=u=>u.searchParams.get('lang')==='en'?'en':u.searchParams.get('lang')==='ko'?'ko':preference()==='en'?'en':'ko';
const family=u=>/^\/learn\/?$/.test(u.pathname)?'learn':/^\/about\/?$/.test(u.pathname)?'about':'exam';
const routeKey=u=>family(u)+'-'+language(u);
const valid=u=>u.origin===location.origin&&/^\/(?:learn\/?|about\/?)?$/.test(u.pathname);
const newKey=()=>crypto.randomUUID();
if(!history.state?.journeyKey)replace({...history.state,journeyKey:newKey(),journeyIndex:index},'',location.href);
history.scrollRestoration='manual';
function focusIdentity(el){if(!el||el===document.body)return null;const node=el.closest('a,button,input,select,textarea,[tabindex]');return node?{id:node.id,href:node.getAttribute('href'),action:node.getAttribute('onclick'),text:node.textContent?.trim().slice(0,160)}:null}
function save(el=document.activeElement){if(restoring||!runtime)return;runtime.save?.();const id=history.state?.journeyKey;if(!id)return;const data={url:location.href,scroll:scrollY,focus:focusIdentity(el),state:runtime.capture?.()};snapshots.set(id,data);recent.set(location.href,data);while(snapshots.size>100){const old=snapshots.keys().next().value;snapshots.delete(old);try{sessionStorage.removeItem('aipath-view-'+old)}catch{}}while(recent.size>50)recent.delete(recent.keys().next().value);try{sessionStorage.setItem('aipath-view-'+id,JSON.stringify(data))}catch{}}
function snapshot(){const id=history.state?.journeyKey;try{return snapshots.get(id)||JSON.parse(sessionStorage.getItem('aipath-view-'+id))}catch{return null}}
function restorePosition(s=snapshot()){if(!s){restoring=false;return Promise.resolve()}return new Promise(resolve=>requestAnimationFrame(()=>{scrollTo({top:s.scroll||0,behavior:'instant'});restoring=false;const f=s.focus;if(!f){resolve();return;}let el=f.id&&document.getElementById(f.id);if(!el)el=[...root.querySelectorAll('a,button,input,[tabindex]')].find(n=>(f.href&&n.getAttribute('href')===f.href)||(f.action&&n.getAttribute('onclick')===f.action)||(!f.href&&!f.action&&n.textContent.trim()===f.text));el?.focus({preventScroll:true});resolve()}) )}
history.pushState=(state,unused,url)=>{index++;push({...state,journeyKey:newKey(),journeyIndex:index},unused,url);currentURL=location.href};
history.replaceState=(state,unused,url)=>{replace({...history.state,...state,journeyKey:history.state?.journeyKey||newKey(),journeyIndex:index},unused,url);currentURL=location.href};
function motion(kind,node=root){if(!node||matchMedia('(prefers-reduced-motion: reduce)').matches)return;node.animate?.([{opacity:kind==='lesson'?.8:.65},{opacity:1}],{duration:kind==='lesson'?90:kind==='result'?180:120,easing:'ease-out'})}
function load(path){if(loads.has(path))return loads.get(path);const task=new Promise((resolve,reject)=>{const el=document.createElement(path.endsWith('.css')?'link':'script');if(el.tagName==='LINK'){el.rel='stylesheet';el.href=assets[path]}else{el.src=assets[path];el.async=false}el.onload=resolve;el.onerror=()=>{el.remove();loads.delete(path);reject(Error('load'))};document.head.append(el)});loads.set(path,task);return task}
function createScope(){const controller=new AbortController(),exported={};return {on(target,event,fn,options={}){target.addEventListener(event,fn,{...(typeof options==='boolean'?{capture:options}:options),signal:controller.signal})},expose(values){Object.assign(exported,values);Object.assign(window,values)},dispose(){controller.abort();for(const [name,value] of Object.entries(exported))if(window[name]===value)delete window[name]}}}
async function prepare(u){const lang=language(u),f=family(u);if(f==='exam'){await load('/catalog-'+lang+'.js');if(!catalogs.has(lang))catalogs.set(lang,window.EXAMS);window.EXAMS=catalogs.get(lang);await load('/app-'+lang+'.js')}else if(f==='learn'){await Promise.all([load('/learn.css'),load('/learn-data.js'),load('/lesson-ui.js')]);await load('/learn.js')}else{await load('/about.css');await load('/about.js')}return factories.get(f==='exam'?'exam-'+lang:f)}
function markPending(on){root.setAttribute('aria-busy',String(on));document.querySelector('#journey-status')?.remove();if(on&&!root.querySelector('.journey-placeholder')){const el=document.createElement('div');el.id='journey-status';el.className='journey-status';el.setAttribute('role','status');el.textContent=document.documentElement.lang==='en'?'Opening page…':'페이지를 준비하고 있습니다…';document.body.append(el)}}
async function mount(u,{pop=false,initial=false,replaceURL=false,languageChange=false}={}){
 const ticket=++serial;markPending(true);let factory;try{factory=await prepare(u)}catch{if(ticket!==serial)return;markPending(false);const box=document.createElement('div');box.className='journey-error';box.setAttribute('role','alert');const text=document.createElement('p');text.textContent=language(u)==='en'?'Could not load the page. Your current page is still available.':'페이지를 불러오지 못했습니다. 현재 화면은 그대로 유지됩니다.';const retry=document.createElement('button');retry.className='btn secondary';retry.textContent=language(u)==='en'?'Try again':'다시 시도';retry.onclick=()=>{box.remove();mount(u,{pop,initial,replaceURL,languageChange})};box.append(text,retry);root.prepend(box);if(pop){replace({...history.state},'',currentURL)}return}
 if(ticket!==serial)return;
 if(!pop&&!initial){save();history[replaceURL?'replaceState':'pushState']({},'',u)}
 const saved=snapshot();restoring=pop||languageChange;runtime?.dispose?.();scope?.dispose();scope=createScope();runtime=null;
 const heldHeight=Math.max(root.getBoundingClientRect().height,scrollY+innerHeight-root.offsetTop);root.style.minHeight=heldHeight+'px';
 document.body.classList.remove('lp-reading','lp-focus','lp-menu-open');root.className='';root.replaceChildren(document.getElementById('journey-placeholder-template').content.cloneNode(true));delete root.dataset.view;
 const lang=language(u);window.APP_LANG=lang;document.documentElement.lang=lang;try{localStorage.setItem('aipath-language',lang)}catch{}
 document.getElementById('language-select').value=lang;document.getElementById('language-select').disabled=false;
 document.getElementById('nav-home').textContent=lang==='en'?'Explore certifications':'자격증 둘러보기';document.getElementById('nav-exams').textContent=lang==='en'?'Take an exam':'시험 응시하기';document.querySelector('.brand').setAttribute('aria-label',lang==='en'?'SPECORY home':'SPECORY 홈');document.getElementById('language-select').setAttribute('aria-label',lang==='en'?'Language':'언어');
 document.querySelectorAll('header nav [aria-current]').forEach(n=>n.removeAttribute('aria-current'));document.querySelectorAll('header nav .active').forEach(n=>n.classList.remove('active'));
 key=routeKey(u);currentURL=location.href;runtime=factory(scope,saved?.state);await runtime?.ready;
 if(ticket!==serial)return;markPending(false);if(pop||languageChange)await restorePosition();else{if(family(u)!=='learn')scrollTo({top:0,behavior:'instant'});const h=root.querySelector('h1,h2');if(h&&!u.searchParams.has('focusLesson')){h.tabIndex=-1;h.focus({preventScroll:true})}if(!initial)motion('page')}
 if(ticket!==serial)return;root.style.minHeight='';restoring=false;
}
function go(target,options={}){const u=new URL(target,location.href);if(!valid(u)){location.assign(u);return}if(runtime?.busy?.())return;if(!options.authorized&&!options.language&&runtime?.guard&&!runtime.guard(()=>go(u,{...options,authorized:true})))return;
 if(routeKey(u)===key&&!options.language){save();history[options.replace?'replaceState':'pushState']({},'',u);runtime?.route?.(u);return}
 return mount(u,{replaceURL:options.replace,languageChange:options.language})
}
window.SiteRouter={register:(name,factory)=>factories.set(name,factory),go,save,restorePosition,restoreRecent:url=>{const s=recent.get(new URL(url,location.href).href);if(s)restorePosition(s)},motion,get restoring(){return restoring}};
document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;save(e.target);const a=e.target.closest('a[href]');if(!a||a.target||a.hasAttribute('download'))return;const u=new URL(a.href);if(!valid(u))return;if(routeKey(u)===key&&family(u)!=='exam')return;e.preventDefault();go(u)},true);
let scrollPending=false;window.addEventListener('scroll',()=>{if(scrollPending||restoring)return;scrollPending=true;requestAnimationFrame(()=>{scrollPending=false;save()})},{passive:true});
window.addEventListener('pagehide',()=>save());
window.addEventListener('popstate',e=>{if(ignorePop){ignorePop=false;e.stopImmediatePropagation();return}const u=new URL(location.href),targetIndex=history.state?.journeyIndex||0;if(routeKey(u)===key){index=targetIndex;currentURL=location.href;restoring=!runtime?.active?.();return}e.stopImmediatePropagation();const delta=index-targetIndex;
 if(runtime?.active?.()&&delta){ignorePop=true;history.go(delta);runtime.guard(()=>history.go(-delta));return}
 index=targetIndex;mount(u,{pop:true});
},true);
mount(new URL(location.href),{initial:true});
})();
