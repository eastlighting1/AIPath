const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm');
const root=path.resolve(__dirname,'..'),expected={AOP:14,AEP:22,SDP:22,SES:22,MOS:20,AGS:15};
const levels={L3:0,L4:0};let total=0,setQuestions=0;
const links=s=>(s.match(/https?:\/\/[^\s)`]+/g)||[]).sort();
for(const [code,count]of Object.entries(expected)){
 const ko=JSON.parse(fs.readFileSync(path.join(root,'content/ko',code+'.json'))),en=JSON.parse(fs.readFileSync(path.join(root,'content/en',code+'.json')));
 const qs=ko.questions.filter(q=>q.sourceImport==='indirect-20261020');
 assert.equal(qs.length,count);assert.equal(new Set(ko.questions.map(q=>q.id)).size,ko.questions.length);
 assert.equal(new Set(ko.questions.map(q=>q.sourceId).filter(Boolean)).size,ko.questions.filter(q=>q.sourceId).length);
 for(const q of qs){
  const e=en.questions.find(x=>x.id===q.id);assert(e);levels[q.difficulty]++;total++;
  for(const k of ['id','sourceId','type','category','indirectType','domain','difficulty','caseSet','sourceImport'])assert.equal(q[k],e[k]);
  assert.deepEqual(q.keys,e.keys);assert.equal(q.type,'단일 선택');assert.equal(q.keys.length,1);
  assert(ko.domains.some(d=>d.id===q.domain));assert.equal(q.options.length,5);assert(q.options.some(o=>o.id===q.keys[0]));
  if(q.caseSet){setQuestions++;assert(q.context.length>80);assert(e.context.length>80);}
  for(const field of ['title','prompt','context','explanation','sourceTopic']){
   assert.equal(typeof e[field],'string');assert(!/[가-힣]/.test(e[field]),code+':'+q.id+' '+field);
   assert.deepEqual(links(q[field]),links(e[field]));
   assert.equal((q[field].match(/^\|/gm)||[]).length,(e[field].match(/^\|/gm)||[]).length,'Table rows');
  }
  q.options.forEach((o,i)=>{assert.equal(e.options[i].id,o.id);assert(!/[가-힣]/.test(e.options[i].text));});
  for(const option of 'ABCDE')assert(q.explanation.includes('{{option:'+option+'}}')&&e.explanation.includes('{{option:'+option+'}}'));
  assert(q.tags.includes('간접'));assert(e.tags.includes('Indirect reasoning'));assert(e.tags.includes(q.indirectType));
 }
}
assert.equal(total,115);assert.deepEqual(levels,{L3:70,L4:45});assert(setQuestions>0);
for(const lang of ['ko','en']){
 const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'public',lang==='ko'?'data.js':'data-en.js'),'utf8'),c);
 assert.equal(c.window.EXAMS.length,12);assert.equal(c.window.EXAMS.reduce((n,e)=>n+e.questions.length,0),1300);
 for(const e of c.window.EXAMS)for(const q of e.questions)assert(e.scaling.evidence[q.id]);
}
console.log('115 indirect questions passed: 70 L3 / 45 L4, bilingual metadata, contexts/tables, answer tokens, domains/tags, IDs and 1300-question scoring coverage.');
