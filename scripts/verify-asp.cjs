const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),root=path.resolve(__dirname,'..');
function boot(lang){const node={innerHTML:'',classList:{add(){},remove(){}}},c={window:{APP_LANG:lang,scrollTo(){},addEventListener(){},confirm:()=>true},document:{getElementById:()=>node,querySelectorAll:()=>[]},sessionStorage:{getItem(){return null},removeItem(){}},console,setInterval:()=>1,clearInterval(){},URL};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'public',lang==='ko'?'data.js':'data-en.js'),'utf8'),c);vm.runInContext(fs.readFileSync(path.join(root,'public','app-'+lang+'.js'),'utf8'),c);vm.runInContext('getReport=()=>Promise.resolve({url:"test.png"})',c);return c;}
for(const lang of ['ko','en']){const c=boot(lang);vm.runInContext(`
 const aspIndex=exams.findIndex(e=>e.code==='ASF'),source=originalQuestions[aspIndex],seen=new Set();if(source.length!==80)throw Error('Bank size');
 for(const mode of ['demo','full'])for(let run=0;run<250;run++){
  active=false;registrationName='ASF Candidate';start(aspIndex,mode,true);const e=exams[aspIndex],qs=e.questions,n=mode==='full'?60:10;
  if(qs.length!==n||new Set(questionOrder).size!==n)throw Error('Sample size');
  const domains=[1,2,3].map(d=>qs.filter(q=>q.domain===d).length),providers=['openai','anthropic','google','cross'].map(p=>qs.filter(q=>q.provider===p).length),types=['단일 선택','복수 선택','순서 배열','매칭'].map(t=>qs.filter(q=>q.type===t).length);
  if(JSON.stringify(domains)!==JSON.stringify(mode==='full'?[42,12,6]:[7,2,1]))throw Error('Domain quota');if(JSON.stringify(providers)!==JSON.stringify(mode==='full'?[12,12,12,6]:[2,2,2,1]))throw Error('Provider quota');if(types[0]!==n*.7||types[1]!==n*.2||types[2]+types[3]!==n*.1)throw Error('Type quota');
  if(mode==='full'&&(types[2]!==3||types[3]!==3))throw Error('Structured quota');
  for(const q of qs){seen.add(q.id);if(questionPoints(q)!==1)throw Error('Unequal points');if(questionPrompt(q).includes('{{option:'))throw Error('Visible prompt token');}
  const result=grade(e,qs.map((q,i)=>i<n*.7?q.keys:[]));if(!result.pass||result.score!==70||result.scoringVersion!=='equal-v1'||result.totalPoints!==n)throw Error('70% grading');if(grade(e,qs.map((q,i)=>i<n*.7-1?q.keys:[])).pass)throw Error('Below threshold passed');
 }
 if(seen.size!==80)throw Error('Unreachable questions');active=false;detail(aspIndex);if(!app.innerHTML.includes('2026-10-18'))throw Error('Guide date');if(!app.innerHTML.includes(window.APP_LANG==='en'?'equal weight':'동일 배점'))throw Error('Scoring info');
 registrationName='ASF Candidate';start(aspIndex,'full',true);answers=exams[aspIndex].questions.map(q=>q.keys);submit(false,true);if(lastResult.score!==100||!shareText().includes('AI Services'))throw Error('Result/share');
 `,c);console.log(lang+': ASF passed 500 stratified attempts, all questions reachable, equal-point thresholds, guide and result flow.');}
