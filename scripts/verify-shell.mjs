import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from '../dist/server/index.js';
const get=async path=>{const r=await worker.fetch(new Request('https://test.example'+path),{});assert.equal(r.status,200,path);return r.text()};
const router=await get('/site-router.js');new vm.Script(router);
const manifest=JSON.parse(router.match(/const assets=(\{[^;]+?\}),factories=/)[1]);
for(const [path,url] of Object.entries(manifest)){
 const r=await worker.fetch(new Request('https://test.example'+url),{});
 assert.equal(r.status,200,path);assert.match(r.headers.get('cache-control'),/immutable/,path);
 if(path.endsWith('.js'))new vm.Script(await r.text(),{filename:path});
}
for(const route of ['/','/learn','/about']){
 const html=await get(route);assert.match(html,/<style id="journey-critical">/);assert.match(html,/<main[^>]*id="app"[^>]*>\s*<div class="journey-placeholder"/);assert.match(html,/<template id="journey-placeholder-template">/);assert.match(html,/site-router\.js\?v=/);
 assert.doesNotMatch(html,/<script[^>]+src="[^\"]*(?:app-ko|app-en|learn\.js|about\.js)/);
}
for(const lang of ['ko','en']){
 let factory;const context={window:{APP_LANG:lang,REVIEW_PREVIEW:true,addEventListener(){}},SiteRouter:{register:(name,fn)=>{assert.equal(name,'exam-'+lang);factory=fn}},document:{getElementById:()=>({}),addEventListener(){}}};
 context.window.SiteRouter=context.SiteRouter;vm.createContext(context);vm.runInContext(await get('/catalog-'+lang+'.js'),context);vm.runInContext(await get('/app-'+lang+'.js'),context);
 const exposed={};const runtime=factory({on(){},expose:values=>Object.assign(exposed,values)},{registrationName:'Restored candidate'});
 assert.equal(runtime.capture().registrationName,'Restored candidate');
 assert.equal(typeof exposed.filterReview,'function');assert.equal(typeof exposed.returnCatalog,'function');
 let valid=false;exposed.updateCandidate({value:'Edited candidate',setCustomValidity:()=>valid=true});
 assert.equal(runtime.capture().registrationName,'Edited candidate');assert(valid);
 for(const method of ['route','dispose','guard','capture','active','busy'])assert.equal(typeof runtime[method],'function');
 delete context.window.SiteRouter;vm.runInContext(await get('/app-'+lang+'.js'),context);assert.equal(typeof context.window.updateCandidate,'function');
}
console.log('PASS: served shell/routes, lazy asset content hashes, script parsing, bilingual runtime registration and scoped form callbacks.');
