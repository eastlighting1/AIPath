const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');const root=path.resolve(__dirname,'..');
const load=(lang,c)=>JSON.parse(fs.readFileSync(path.join(root,'content',lang,c+'.json')));
const links=s=>(s.match(/https?:\/\/[^\s)\x60]+/g)||[]).sort();
for(const code of ['AOA','AOP']){
 const ko=load('ko',code),en=load('en',code);assert.equal(ko.questions.length,code==='AOA'?85:95);assert.equal(en.questions.length,ko.questions.length);
 assert.equal(ko.count,code==='AOA'?65:75);assert.equal(ko.minutes,code==='AOA'?130:180);assert.equal(ko.threshold,code==='AOA'?72:75);
 for(const k of ['code','name','level','count','minutes','threshold'])assert.equal(ko[k],en[k]);
 assert(Math.abs(ko.domains.reduce((s,d)=>s+d.weight,0)-100)<.001);
 for(const lang of [ko,en]){assert.equal((lang.guide.match(/^### [1-4]\. /gm)||[]).length,4);assert(!/최종 설계안|embedded content|열린 질문|가상|검수 메모/.test(lang.guide));}
 assert.deepEqual(links(ko.guide),links(en.guide));
 for(let i=0;i<ko.questions.length;i++){
  const a=ko.questions[i],b=en.questions[i],label=code+' '+a.id;assert.equal(a.id,i+1);for(const k of ['sourceId','type','domain','difficulty','format','caseSet'])assert.equal(a[k],b[k],label+' '+k);
  assert.deepEqual(a.keys,b.keys);assert.equal(a.options.length,5);assert(a.options.some(o=>o.id===a.keys[0]));if(a.caseSet)assert(a.context.length>50);
  for(const k of ['title','prompt','context','explanation']){assert.equal(typeof b[k],'string');assert(!/[가-힣]/.test(b[k]),label+' untranslated '+k);assert.deepEqual(links(a[k]),links(b[k]),label+' links '+k);if(a[k])assert(b[k].length>0);assert.equal((a[k].match(/```/g)||[]).length,(b[k].match(/```/g)||[]).length,label+' fences '+k);}
  a.options.forEach((o,j)=>{assert.equal(o.id,b.options[j].id);assert(!/[가-힣]/.test(b.options[j].text),label+' option '+o.id);assert.deepEqual(links(o.text),links(b.options[j].text));});
  assert(a.tags?.includes(code));assert(b.tags?.includes(code));
 }
 const badge=fs.readFileSync(path.join(root,'public/badges',code+'-symbol.svg'),'utf8');assert(badge.includes('>'+code+'</text>'));assert(badge.includes('>Operations</text>'));
}
for(const lang of ['ko','en']){
 const node={innerHTML:'',classList:{add(){},remove(){}},scrollIntoView(){}};const store={getItem:()=>null,setItem(){},removeItem(){}};
 const c={window:{APP_LANG:lang,scrollTo(){},addEventListener(){}},document:{getElementById:()=>node,querySelectorAll:()=>[]},localStorage:store,sessionStorage:store,location:{href:'https://test/?lang='+lang},URL,console,setInterval:()=>1,clearInterval(){}};vm.createContext(c);
 vm.runInContext(fs.readFileSync(path.join(root,'public',lang==='ko'?'data.js':'data-en.js'),'utf8'),c);vm.runInContext(fs.readFileSync(path.join(root,'public/app-'+lang+'.js'),'utf8'),c);
 vm.runInContext(`
 if(exams.length!==12||originalQuestions.reduce((n,qs)=>n+qs.length,0)!==1185)throw Error('Catalog totals');
 for(const code of ['AOA','AOP']){selected=exams.findIndex(e=>e.code===code);const all=originalQuestions[selected];
 for(const mode of ['demo','full']){const seen=new Set();for(let run=0;run<20;run++){examMode=mode;randomizeAttempt(selected);if(questionOrder.length!==(mode==='demo'?10:exams[selected].count)||new Set(questionOrder).size!==questionOrder.length)throw Error('sample');seen.add(questionOrder.join(','));}if(seen.size<2)throw Error('randomness');}
 exams[selected].questions=all.slice();for(const q of all){current=all.indexOf(q);active=true;paused=false;answers=all.map(()=>[]);choiceOrder[q.id]=q.options.map(o=>o.id).reverse();const html=inputUI(q,[]);if((html.match(/class="option /g)||[]).length!==5)throw Error('options '+q.sourceId);if(q.options.some(o=>o.text.includes('\x60\x60\x60'))&&!html.includes('<pre'))throw Error('code choice rendering');choose(q.options.find(o=>o.id!==q.keys[0]).id);choose(q.keys[0]);if(!correct(q,answers[current])||answers[current].length!==1)throw Error('answer replacement');if(attemptExplanation(q).includes('{{option:'))throw Error('explanation token');if(q.context&&!md(q.context).includes('<p>'))throw Error('context');}
 active=false;
 }
 `,c);
}
console.log('AOA/AOP: 180 bilingual questions, source links, guides, badges, random sampling, option code rendering, answer replacement and shuffled explanations passed.');
