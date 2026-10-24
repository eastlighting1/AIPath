// Register independent page runtimes behind the shared header and history layer.
const zlib=require('zlib'),crypto=require('crypto');
module.exports=function(assets){
 const read=p=>zlib.gunzipSync(Buffer.from(assets[p].data,'base64')).toString();
 const write=(p,s)=>{const bytes=Buffer.from(s);assets[p]={...assets[p],data:zlib.gzipSync(bytes,{level:9}).toString('base64'),gzip:true,etag:'"'+crypto.createHash('sha256').update(bytes).digest('hex').slice(0,24)+'"'}};
 const register=(name,body)=>`((factory)=>{if(window.SiteRouter)SiteRouter.register('${name}',factory);else factory({on:(target,event,fn,options)=>target.addEventListener(event,fn,options),expose:values=>Object.assign(window,values)});})(${body});`;
 const events=s=>s.replaceAll('window.addEventListener(','scope.on(window,').replaceAll('document.addEventListener(','scope.on(document,');
 for(const lang of ['ko','en']){
  let source=read('/app-'+lang+'.js');const names=[...source.matchAll(/^(?:async )?function (\w+)\(/gm)].map(m=>m[1]);
  source=events(source).replace('if(!window.REVIEW_PREVIEW)bootSite();',`scope.expose({${names.join(',')}});registrationName=saved?.registrationName||'';filter=saved?.filter||'all';const bootReady=window.REVIEW_PREVIEW?null:bootSite();`);
  write('/app-'+lang+'.js',register('exam-'+lang,`(scope,saved)=>{\n${source}\nreturn {ready:bootReady,active:()=>active,busy:()=>secureBusy,guard:leave,capture:()=>({registrationName,filter}),route:async u=>{examRouteRestoring=true;await openExamRoute(u.href);examRouteRestoring=false},dispose:()=>{persistAttempt();stop();renderEpoch++;active=false;lastResult=null;closeSiteModal();}};\n}`));
 }
 let learning=read('/learn.js').trim().replace(/^\(\(\)=>\{/, '').replace(/\}\)\(\);$/,'');learning=events(learning);
 learning=learning.replace('navigate(new URL(location.href),{initial:true});','const ready=navigate(new URL(location.href),{initial:true});');
 write('/learn.js',register('learn',`(scope)=>{\n${learning}\nscope.expose({home:window.home,examCatalog:window.examCatalog,changeLanguage:window.changeLanguage});return {ready,route:u=>navigate(u,{push:false}),save:saveView,dispose:()=>{rememberPage();++requestId;active=null;}};\n}`));
 write('/about.js',register('about',`(scope)=>{${events(read('/about.js'))}\nscope.expose({home:window.home,examCatalog:window.examCatalog,changeLanguage:window.changeLanguage});return {};}`));
 for(const path of ['/index.html','/learn.html','/about.html']){
  let html=read(path).replace(/<script\b[^>]*src=["'][^"']+["'][^>]*><\/script>/g,'');
  // Critical layout is in the HTML: reserve the body before any runtime downloads.
  const skeleton='<div class="journey-placeholder" role="status"><span class="journey-loading-label">Loading · 불러오는 중</span><div class="journey-placeholder-layout" aria-hidden="true"><aside><i></i><i></i><i></i><i></i></aside><section><i class="journey-placeholder-title"></i><i></i><i></i><i></i><i class="journey-placeholder-block"></i></section></div></div>';
  const critical='<style id="journey-critical">#app{min-height:calc(100vh - 70px);min-height:calc(100svh - 70px)}.journey-placeholder{position:sticky;top:0;min-height:calc(100svh - 70px);padding:48px max(6%,24px);color:#77766e}.journey-loading-label{font-size:13px}.journey-placeholder-layout{display:grid;grid-template-columns:220px minmax(0,1fr);gap:64px;max-width:1160px;margin:36px auto}.journey-placeholder i{display:block;height:14px;background:#e7e6de;border-radius:3px;margin-bottom:24px;width:85%}.journey-placeholder i:nth-child(even){width:65%}.journey-placeholder .journey-placeholder-title{height:38px;width:75%;margin-bottom:42px}.journey-placeholder .journey-placeholder-block{height:240px;width:100%;margin-top:40px}@media(max-width:700px){.journey-placeholder-layout{grid-template-columns:1fr;gap:0}.journey-placeholder aside{display:none}.journey-placeholder{padding-top:28px}}</style>';
  html=html.replace('</head>',critical+'</head>').replace(/(<main[^>]*id="app"[^>]*>)(\s*)(<\/main>)/,'$1'+skeleton+'$3').replace('</body>','<template id="journey-placeholder-template">'+skeleton+'</template></body>');
  html=html.replace('</head>','<link rel="stylesheet" href="/journey.css"></head>').replace('</body>','<script src="/learn-nav.js"></script><script src="/site-notice.js"></script><script src="/site-router.js"></script></body>');write(path,html);
 }
 const paths=['/catalog-ko.js','/catalog-en.js','/app-ko.js','/app-en.js','/learn-data.js','/lesson-ui.js','/learn.js','/learn.css','/about.js','/about.css'];
 write('/site-router.js',read('/site-router.js').replace('__SITE_ASSET_URLS__',JSON.stringify(Object.fromEntries(paths.map(p=>[p,p+'?v='+assets[p].etag.slice(1,-1)])))));
};
