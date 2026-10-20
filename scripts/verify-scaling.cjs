const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..'),S=require('../public/scaling.js');
const banks=lang=>{const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'public',lang==='ko'?'data.js':'data-en.js'),'utf8'),c);return JSON.parse(JSON.stringify(c.window.EXAMS));};
const ko=banks('ko'),en=banks('en');
const worker={console,URL,Response,Request,Headers,Blob,FormData,atob,DecompressionStream,crypto:require('crypto').webcrypto};
vm.createContext(worker);vm.runInContext(fs.readFileSync(path.join(root,'dist/server/index.js'),'utf8').replace('export default','const workerDefault ='),worker);
function app(lang){
 const node={innerHTML:'',classList:{add(){},remove(){}}};
 const c={window:{APP_LANG:lang,scrollTo(){},addEventListener(){}},document:{getElementById:()=>node,querySelectorAll:()=>[]},sessionStorage:{getItem(){return null},removeItem(){}},console,setInterval:()=>1,clearInterval(){},URL};
 vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'public',lang==='ko'?'data.js':'data-en.js'),'utf8'),c);
 vm.runInContext(fs.readFileSync(path.join(root,'public','app-'+lang+'.js'),'utf8'),c);
 return c;
}
const clients=[app('ko'),app('en')];let checks=0;
for(let index=0;index<ko.length;index++){
 const e=ko[index],m=e.scaling;assert.deepStrictEqual(m,en[index].scaling);
 for(const n of [10,e.count]){
  for(let form=0;form<8;form++){
   const qs=e.questions.slice(form).concat(e.questions.slice(0,form)).slice(0,n),ids=qs.map(q=>q.id);
   assert.equal(S.grade(m,ids,ids.map(()=>false)).score,0);
   assert.equal(S.grade(m,ids,ids.map(()=>true)).score,1000);
   for(let pattern=0;pattern<5;pattern++){
    const outcomes=ids.map((id,i)=>(i+pattern)%5<pattern),r=S.grade(m,ids,outcomes);
    assert.equal(Object.values(r.integerContributions).reduce((a,b)=>a+b,0),r.score);
    assert(Math.abs(Object.values(r.contributions).reduce((a,b)=>a+b,0)-r.exactScore)<1e-8);
    assert.equal(r.pass,r.score>=m.passScore);
    const reverse=S.grade(m,[...ids].reverse(),[...outcomes].reverse());assert.equal(reverse.score,r.score);
    for(let j=0;j<n;j++)if(!outcomes[j]){const improved=[...outcomes];improved[j]=true;assert(S.grade(m,ids,improved).score>=r.score);}
    for(const [l,c] of clients.entries()){
     c.input={index,ids,answers:qs.map((q,i)=>outcomes[i]?q.keys:[])};
     const client=vm.runInContext('grade({...exams[input.index],questions:input.ids.map(id=>originalQuestions[input.index].find(q=>q.id===id))},input.answers)',c);
     assert.equal(client.score,r.score);
     worker.raw={code:e.code,lang:l?'en':'ko',mode:n===10?'demo':'full',scoringVersion:m.version,questionOrder:ids,answers:c.input.answers,elapsed:0};
     const server=vm.runInContext('validatedResult(raw)',worker);
     assert.equal(server.score,r.score);assert.equal(server.pass,r.pass);
     assert.equal(server.scoringVersion,m.version);
    }
    checks++;
   }
  }
 }
}
const fixture={threshold:70,questions:[1,2,3,4].map((v,i)=>({id:i,difficulty:'L'+v,domain:1,type:'single'}))};
const fm=S.build(fixture);
assert(S.grade(fm,[0,1,2,3],[false,false,true,true]).score>S.grade(fm,[0,1,2,3],[true,true,false,false]).score);
assert.throws(()=>S.grade(fm,[0,0],[true,true]));
assert.throws(()=>S.grade(fm,[999],[true]));
for(const c of clients){
 vm.runInContext(`selected=0;exams[0].questions=originalQuestions[0].slice(0,10);lastResult={...grade(exams[0],exams[0].questions.map(q=>q.keys)),exam:0,mode:'demo',elapsed:10,answers:exams[0].questions.map(q=>q.keys)};renderResult();if(!app.innerHTML.includes('1,000')||!app.innerHTML.includes('1000'))throw Error('Result scale');if(shareText().includes('/100\\n'))throw Error('Share scale');`,c);
}
console.log(`${checks} answer patterns across 12 certifications passed: endpoints, monotonicity, contribution sums, order invariance, bilingual and server parity, UI and sharing.`);
