const fs=require('fs'),vm=require('vm'),assert=require('assert');const base=require('path').resolve(__dirname,'../public')+'/';const store=new Map(),storage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
function app(lang){const node={innerHTML:'',classList:{add(){},remove(){}},scrollIntoView(){}};const ctx={window:{APP_LANG:lang,scrollTo(){},addEventListener(){},confirm:()=>true},document:{getElementById:()=>node,querySelectorAll:()=>[]},sessionStorage:storage,localStorage:storage,location:{href:'https://example.test/?lang='+lang,replace(){}},URL,console,setInterval:()=>1,clearInterval(){},alert(m){throw Error(m)}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(base+(lang==='en'?'data-en.js':'data.js'),'utf8'),ctx);vm.runInContext(fs.readFileSync(base+'app-'+lang+'.js','utf8'),ctx);vm.runInContext('getReport=()=>Promise.resolve({url:"test-report.png"})',ctx);ctx.node=node;return ctx;}
for(const lang of ['ko','en']){const c=app(lang);vm.runInContext(`
 for(let i=0;i<exams.length;i++)for(const mode of ['demo','full']){const seen=new Set();for(let run=0;run<15;run++){
  active=false;registrationName='QA Candidate';start(i,mode,true);const n=mode==='full'?exams[i].count:10;if(questionOrder.length!==n||new Set(questionOrder).size!==n)throw Error('wrong sample');if(exams[i].questions.length!==n)throw Error('wrong active questions');seen.add(questionOrder.join(','));
  if(durationMinutes(i,mode)!==(mode==='full'?exams[i].minutes:Math.ceil(exams[i].minutes*10/exams[i].count)))throw Error('duration');
  for(const q of exams[i].questions)if(new Set(choicesFor(q).map(o=>o.id)).size!==choicePool(q).length)throw Error('choices');
  answers=exams[i].questions.map(q=>q.keys.slice());submit(false,true);if(lastResult.score!==100||lastResult.mode!==mode||lastResult.total!==n)throw Error('grading');
  const earned=shareText().includes(window.APP_LANG==='en'?'I earned':'취득하였습니다');if(earned!==(mode==='full'))throw Error('achievement must require full pass');
  if(mode==='demo'&&!app.innerHTML.includes(window.APP_LANG==='en'?'Demo exam':'데모 시험'))throw Error('demo result label');
 }if(seen.size<2)throw Error('not randomized');}
 active=false;registrationName='QA Candidate';start(0,'full',true);answers=exams[0].questions.map(()=>[]);submit(false,true);if(shareText().includes(window.APP_LANG==='en'?'I earned':'취득하였습니다'))throw Error('failure is not achievement');
 examCatalog();if(!app.innerHTML.includes("start(8,'full')"))throw Error('missing catalog');
 start(4,'demo');current=4;answers[4]=exams[4].questions[4].keys.slice();flags.add(4);changeLanguage(window.APP_LANG==='en'?'ko':'en');
`,c);const before=JSON.parse(store.get('aipath-language-state')),other=app(lang==='ko'?'en':'ko');const after=vm.runInContext('({examMode,questionOrder,choiceOrder,current,answers,deadline})',other);for(const key of Object.keys(after))assert.deepEqual(JSON.parse(JSON.stringify(after[key])),before[key]);}
console.log('540 attempts passed: demo/full sizes, random subsets, durations, grading, earned gating, all catalog entries and language state preservation.');

