import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import worker from '../dist/server/index.js';import {TestBucket} from './test-bucket.mjs';
const BUCKET=new TestBucket(),origin='https://example.test';
const c={window:{}};vm.runInNewContext(fs.readFileSync('public/data.js','utf8'),c);const banks=c.window.EXAMS;
async function api(action,data={},headers={}){return worker.fetch(new Request(origin+'/api/exam/'+action,{method:'POST',headers:{origin,'X-AIpath-Exam':'1',...headers},body:JSON.stringify(data)}),{BUCKET})}
const forbidden=['keys','answer','explanation','tags','tagging','scaling','difficulty'];
for(const lang of ['ko','en'])for(const bank of banks){
 const guide=await worker.fetch(new Request(origin+'/courses/'+lang+'/'+bank.code+'.json'),{});assert.deepEqual(Object.keys(await guide.json()),['guide']);
 const start=await api('start',{code:bank.code,mode:'demo',lang});assert.equal(start.status,201);const s=await start.json(),auth={id:s.id,token:s.token,lang};assert.equal(s.questions.length,10);
 for(const q of s.questions)for(const key of forbidden)assert(!(key in q),key);
 const restored=await (await api('restore',auth)).json();assert.deepEqual(restored.questions,s.questions);assert(!restored.token);
 const bad=await api('restore',{...auth,token:'a'.repeat(64)});assert.equal(bad.status,400);
 const answers=s.questions.map(q=>bank.questions.find(x=>x.id===q.id).keys);
 await api('save',{...auth,answers});const paused=await (await api('pause',auth)).json();assert(paused.paused);const resumed=await (await api('resume',auth)).json();assert(!resumed.paused);
 const submitted=await (await api('submit',{...auth,answers,score:9999,questionOrder:[9999]})).json();assert.equal(submitted.result.score,1000);assert.equal(submitted.result.count,10);assert(submitted.questions.every(q=>q.explanation&&q.keys));
 const repeated=await (await api('submit',{...auth,answers:s.questions.map(()=>[])})).json();assert.deepEqual(repeated.result,submitted.result);
 const lateSave=await (await api('save',{...auth,answers:s.questions.map(()=>[])})).json();assert.deepEqual(lateSave.result,submitted.result);
}
// Racing submissions commit exactly one answer set; neither can overwrite it.
const s=await (await api('start',{code:'ALF',mode:'full',candidateName:'QA'})).json(),auth={id:s.id,token:s.token},correct=s.questions.map(q=>banks[0].questions.find(x=>x.id===q.id).keys),empty=s.questions.map(()=>[]);
const results=await Promise.all([api('submit',{...auth,answers:correct}),api('submit',{...auth,answers:empty})]);const a=await results[0].json(),b=await results[1].json();assert.deepEqual(a.result,b.result);
assert.equal((await api('start',{code:'ALF',mode:'demo'},{origin:'https://evil.test'})).status,403);
assert.equal((await api('start',{code:'NOPE',mode:'full'})).status,400);
assert.equal((await api('start',{code:'ALF',mode:'full'})).status,400);
assert.equal((await api('start',{payload:'x'.repeat(45000)})).status,413);
for(const path of ['/data.js','/data-en.js','/djemdls','/review.html','/preview-mocks.js','/exam-preview.html','/content/ko/ALF.json'])assert.equal((await worker.fetch(new Request(origin+path),{})).status,404,path);
for(const lang of ['ko','en']){const ctx={window:{}};vm.runInNewContext(fs.readFileSync('public/catalog-'+lang+'.js','utf8'),ctx);for(const e of ctx.window.EXAMS){assert.equal(e.questions.length,0);assert.deepEqual(Object.keys(e.scaling),['version'])}}
// Original source evidence and all option identifiers survive normalization.
for(const bank of banks)for(const q of bank.questions){assert(!/\\[\[\]~_*]/.test(q.title));for(const line of q.explanation.split('\n').filter(l=>/(근거 문서|Sources?|Evidence|References?)/i.test(l))){const plain=line.replace(/\[[^\]]+\]\(https?:\/\/[^\s)]+\)|`[^`]*`/g,'');assert(!/https?:\/\//.test(plain),bank.code+':'+q.id)}}
// A page refresh/re-render may keep the values, but fresh checks cover all positions.
const lc={window:{}};vm.runInNewContext(fs.readFileSync('public/lesson-ui.js','utf8'),lc);const seen=new Set();for(let i=0;i<100;i++){const html=lc.window.LessonUI.check({type:'mcq',q:'Q',options:['a','b','c','d'],answer:1},'x');const values=[...html.matchAll(/value="(\d)"/g)].map(x=>Number(x[1]));assert.deepEqual([...values].sort(),[0,1,2,3]);seen.add(values.indexOf(1))}assert.equal(seen.size,4);
console.log('PASS: all 24 bilingual banks, private payloads, server grading, immutable retries/concurrency, pause/resume, origin/size/token checks, blocked bank routes, evidence links, titles and lesson shuffle.');
