// Private bank and attempt state never enter the static asset map.
const examShuffle=xs=>{const a=[...xs];for(let i=a.length-1;i>0;i--){const n=new Uint32Array(1);crypto.getRandomValues(n);const j=n[0]%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const tokenHash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
async function readExamAttempt(env,raw){
 if(!/^[0-9a-f-]{36}$/.test(raw.id||'')||typeof raw.token!=='string'||raw.token.length!==64)throw Error('Invalid attempt');
 const obj=await env.BUCKET.get('attempts/'+raw.id+'.json');if(!obj)throw Error('Attempt not found');const state=await obj.json();
 if(state.tokenHash!==await tokenHash(raw.token))throw Error('Attempt unavailable');return {state,obj};
}
function attemptQuestions(s,lang,review=false){const bank=EXAM_BANKS[lang].find(e=>e.code===s.code);return s.ids.map(id=>{const q=bank.questions.find(q=>q.id===id);if(review)return q;return {id:q.id,title:q.title,type:q.type,domain:q.domain,prompt:q.prompt,context:q.context,options:q.options.map(o=>({id:o.id,text:o.text})),items:q.items.map(o=>({id:o.id,text:o.text})),answerCount:q.keys.length}})}
function attemptResponse(s,lang){return {id:s.id,code:s.code,mode:s.mode,candidateName:s.candidateName,deadline:s.deadline,paused:s.paused,remaining:s.remaining,questions:attemptQuestions(s,lang,!!s.result),choiceOrder:s.choiceOrder,result:s.result||null}}
function validAnswers(answers,qs){if(!Array.isArray(answers)||answers.length!==qs.length)throw Error('Invalid answers');return answers.map((a,i)=>{const q=qs[i],pool=q.type==='진술 판정'?['Yes','No']:(q.type==='순서 배열'?q.items:q.options).map(o=>o.id);if(!Array.isArray(a)||a.length>q.keys.length||a.some(x=>x!==null&&x!==''&&!pool.includes(x)))throw Error('Invalid answer');return a.map(x=>x||'')})}
async function examApi(request,env,url){
 if(request.method!=='POST')return json({error:'Method not allowed'},405);
 if(request.headers.get('origin')!==url.origin||request.headers.get('X-AIpath-Exam')!=='1')return json({error:'Invalid origin'},403);
 if(!env.BUCKET)return json({error:'Storage unavailable'},503);
 const reader=request.body?.getReader();if(!reader)return json({error:'Invalid body'},400);let text='',size=0;const decoder=new TextDecoder();for(;;){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>40000){await reader.cancel();return json({error:'Payload too large'},413)}text+=decoder.decode(value,{stream:true})}text+=decoder.decode();
 let raw;try{raw=JSON.parse(text)}catch{return json({error:'Invalid JSON'},400)}const lang=raw.lang==='en'?'en':'ko',action=url.pathname.split('/').pop();
 try{
  if(action==='start'){
   const e=EXAM_BANKS.ko.find(e=>e.code===raw.code);if(!e||!['full','demo'].includes(raw.mode))throw Error('Invalid exam');
   const name=String(raw.candidateName||'').normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f]/g,'').trim();if(name.length>40||(raw.mode==='full'&&!name))throw Error('Invalid candidate');
   const n=raw.mode==='full'?e.count:10;let qs=examShuffle(e.questions).slice(0,n);
   if(e.code==='ASF')qs=sampleServerASF(e.questions,raw.mode).map(id=>e.questions.find(q=>q.id===id));
   const id=crypto.randomUUID(),token=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-',''),now=Date.now(),duration=(raw.mode==='full'?e.minutes:Math.ceil(e.minutes*10/e.count))*60000;
   const s={id,tokenHash:await tokenHash(token),code:e.code,mode:raw.mode,candidateName:name,ids:qs.map(q=>q.id),choiceOrder:Object.fromEntries(qs.map(q=>[q.id,examShuffle((q.type==='진술 판정'?[{id:'Yes'},{id:'No'}]:q.type==='순서 배열'?q.items:q.options).map(o=>o.id))])),duration,deadline:now+duration,remaining:duration,paused:false,expiresAt:now+30*86400000,answers:qs.map(()=>[])};
   await env.BUCKET.put('attempts/'+id+'.json',JSON.stringify(s),{onlyIf:new Headers({'If-None-Match':'*'})});return json({...attemptResponse(s,lang),token},201);
  }
  if(!['restore','pause','resume','save','submit'].includes(action))return json({error:'Not found'},404);
  for(let retry=0;retry<4;retry++){
   const {state:s,obj}=await readExamAttempt(env,raw);if(action==='restore'||s.result)return json(attemptResponse(s,lang));
   const now=Date.now(),qs=attemptQuestions(s,'ko',true),expired=!s.paused&&now>s.deadline;
   if(raw.answers&&!expired)s.answers=validAnswers(raw.answers,qs);
   if(action==='pause'&&!s.paused&&!expired){s.remaining=Math.max(0,s.deadline-now);s.paused=true}
   if(action==='resume'&&s.paused){s.deadline=now+s.remaining;s.paused=false}
   if(action==='submit'){
    if(s.paused)throw Error('Resume before submitting');
    const e=EXAM_BANKS.ko.find(e=>e.code===s.code),outcomes=qs.map((q,i)=>{const a=s.answers[i];return a.length===q.keys.length&&(q.type==='복수 선택'?[...a].sort().join('|')===[...q.keys].sort().join('|'):a.every((x,j)=>x===q.keys[j]))});
    s.result={...EvidenceScaling.grade(e.scaling,s.ids,outcomes),outcomes,mode:s.mode,candidateName:s.candidateName,questionOrder:s.ids,choiceOrder:s.choiceOrder,answers:s.answers,elapsed:Math.min(s.duration,Math.max(0,s.duration-(s.deadline-now)))/1000|0,expired};
   }
   const saved=await env.BUCKET.put('attempts/'+s.id+'.json',JSON.stringify(s),{onlyIf:{etagMatches:obj.etag}});if(saved)return json(action==='save'?{saved:true}:attemptResponse(s,lang));
  }return json({error:'Please retry'},409);
 }catch{return json({error:'Invalid or unavailable attempt'},400)}
}
async function submittedReport(env,raw){const {state:s}=await readExamAttempt(env,raw);if(!s.result)throw Error('Not submitted');const e=EXAM_KEYS.find(e=>e.code===s.code),r=s.result,en=raw.lang==='en',earned=s.mode==='full'&&r.pass;return {...r,correct:r.count,code:s.code,name:e.name,lang:en?'en':'ko',earned,title:earned?(en?'I earned the '+e.name+' certification.':e.name+'을 취득하였습니다.'):(en?'I completed the '+e.name+' exam.':e.name+' 시험에 응시했습니다.'),createdAt:new Date().toISOString(),answers:undefined,questionOrder:undefined,choiceOrder:undefined,outcomes:undefined}}

function sampleServerASF(pool,mode){
 const full=mode==='full',types=['단일 선택','복수 선택','순서 배열','매칭'],groups=['openai','anthropic','google','cross',2,3],sizes=full?[12,12,12,6,12,6]:[2,2,2,1,2,1],target=full?[42,12,3,3]:(Math.random()<.5?[7,2,1,0]:[7,2,0,1]);
 const buckets=groups.map(g=>types.map(t=>examShuffle(pool.filter(q=>(typeof g==='number'?q.domain===g:q.provider===g)&&q.type===t))));
 const plans=buckets.map((b,g)=>{const out=[];function enumerate(t,left,counts){if(t===3){if(left>=0&&left<=b[t].length)out.push([...counts,left]);return;}for(let n=0;n<=Math.min(left,b[t].length);n++)enumerate(t+1,left-n,[...counts,n]);}enumerate(0,sizes[g],[]);return examShuffle(out);});
 const failed=new Set();function solve(g,remaining){if(g===groups.length)return remaining.every(n=>n===0)?[]:null;const key=g+':'+remaining;if(failed.has(key))return null;for(const counts of plans[g]){const next=remaining.map((n,t)=>n-counts[t]);if(next.some((n,t)=>n<0||n>buckets.slice(g+1).reduce((sum,b)=>sum+b[t].length,0)))continue;const rest=solve(g+1,next);if(rest)return [counts,...rest];}failed.add(key);return null;}
 const allocation=solve(0,target);if(!allocation)throw Error('ASF question quotas cannot be satisfied');return examShuffle(allocation.flatMap((counts,g)=>counts.flatMap((n,t)=>buckets[g][t].slice(0,n).map(q=>q.id))));
}
