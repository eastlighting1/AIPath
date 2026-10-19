const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const pub=path.resolve(__dirname,'../public');
function boot(lang,state){const storage=new Map(state?[['aipath-language-state',JSON.stringify(state)]]:[]),node={innerHTML:'',classList:{add(){},remove(){}}},requests=[];const ctx={window:{APP_LANG:lang,scrollTo(){},addEventListener(){},confirm:()=>true},document:{getElementById:()=>node,querySelectorAll:()=>[]},sessionStorage:{getItem:k=>storage.get(k),removeItem:k=>storage.delete(k)},console,setInterval:()=>1,clearInterval(){},fetch:url=>new Promise((resolve,reject)=>requests.push({url,resolve,reject}))};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(pub,'catalog-'+lang+'.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(path.join(pub,'app-'+lang+'.js'),'utf8'),ctx);const run=s=>vm.runInContext(s,ctx);const release=(n=0)=>requests[n].resolve({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(pub,requests[n].url.split('?')[0]),'utf8'))});return{ctx,node,requests,run,release};}
(async()=>{for(const lang of ['ko','en']){
 const a=boot(lang);assert.equal(a.requests.length,0);assert(a.node.innerHTML.includes('969'));
 const task=a.run('start(0)');assert.equal(a.requests.length,1);assert.equal(a.run('active'),false);assert.equal(a.run('deadline'),0);a.release();await task;assert.equal(a.run('active'),true);assert.equal(a.run('questionOrder.length'),10);
 a.run('active=false;home();start(0)');assert.equal(a.requests.length,1,'reuse loaded bank');
 const state=a.run('({version:2,selected,current:3,answers,deadline,active:true,view:"exam",questionOrder,choiceOrder,flags:[],examMode,filter,reviewFilter})');
 const b=boot(lang==='ko'?'en':'ko',state);assert.equal(b.requests.length,1);b.release();await new Promise(r=>setImmediate(r));assert.equal(b.run('current'),3);assert.equal(b.run('deadline'),state.deadline);assert.equal(JSON.stringify(b.run('questionOrder')),JSON.stringify(state.questionOrder));
 const c=boot(lang);const stale=c.run('start(1)');c.run('home()');c.release();await stale;assert.equal(c.run('active'),false,'late response must not navigate');assert.equal(c.run('view'),'home');
 const d=boot(lang);const fail=d.run('start(2)');d.requests[0].reject(Error('offline'));await fail;assert(d.node.innerHTML.includes('retry-course'));const retry=d.node.onclick();d.release(1);await retry;assert.equal(d.run('active'),true);
 }
 console.log('Lazy loading passed: no home question requests, timer gate, cache reuse, language-state restoration, navigation race and failed-request retry in both languages.');
})();
