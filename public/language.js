(()=>{
 const params=new URLSearchParams(location.search);
 let saved;try{saved=localStorage.getItem('aipath-language');}catch{}
 const requested=params.get('lang');
 const lang=['ko','en'].includes(requested)?requested:['ko','en'].includes(saved)?saved:(navigator.language||'en').toLowerCase().startsWith('ko')?'ko':'en';
 window.APP_LANG=lang;try{localStorage.setItem('aipath-language',lang);}catch{}
 document.documentElement.lang=lang;
 document.title=lang==='en'?'AIpath — AI Certifications':'AIpath — AI 자격증';
 const description=document.querySelector('meta[name="description"]');if(description)description.content=lang==='en'?'Build generative AI skills across foundations, development, architecture, security, and governance. Explore twelve certifications and 1185 practice questions.':'생성형 AI 기초부터 개발, 아키텍처, 보안, 거버넌스까지. 12개 자격 과정과 1185개 연습 문항으로 다음 목표를 준비하세요.';
 document.getElementById('nav-exams').textContent=lang==='en'?'Take an exam':'시험 응시하기';
 const nav=document.getElementById('nav-home');nav.textContent=lang==='en'?'Explore certifications':'자격증 둘러보기';
 document.querySelector('.brand').setAttribute('aria-label',lang==='en'?'AIpath home':'AIpath 홈');
 const select=document.getElementById('language-select');select.disabled=true;select.value=lang;select.setAttribute('aria-label',lang==='en'?'Language':'언어');
 document.getElementById('app').innerHTML='<section class="wrap section" role="status" aria-live="polite"><p>'+(lang==='en'?'Preparing your certification paths…':'자격증 과정을 준비하고 있습니다…')+'</p><div class="loading-bars" aria-hidden="true"><i></i><i></i><i></i></div></section>';
 const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);});
 Promise.all([load('catalog-'+lang+'.js?v=scaling-20261020'),load('app-'+lang+'.js?v=scaling-20261020')]).then(()=>load('pages-share.js')).then(()=>{select.disabled=false;const target=params.get('cert'),destination=params.get('view');if(target||destination==='exams'){const clean=new URL(location.href);clean.searchParams.delete('cert');clean.searchParams.delete('view');history.replaceState(null,'',clean);const i=window.EXAMS.findIndex(e=>e.code===target);if(i>=0)detail(i);else if(destination==='exams')examCatalog();}}).catch(()=>{document.getElementById('app').innerHTML='<div class="wrap section"><p>'+(lang==='en'?'Could not load the page. Please refresh and try again.':'페이지를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.')+'</p><button class="btn" onclick="location.reload()">'+(lang==='en'?'Try again':'다시 시도')+'</button></div>';});
})();
