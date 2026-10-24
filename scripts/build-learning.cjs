const fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'content/learning');
const sources=[1,2].map(n=>JSON.parse(fs.readFileSync(path.join(dir,`final${n}.json`),'utf8'))),all=Object.assign({},...sources);
const rows=fs.readFileSync(path.join(dir,'mapping.md'),'utf8').split(/\r?\n/).filter(l=>/^\| `\d\|/.test(l)).map(l=>{const m=l.match(/^\| `([^`]+)` \| (.*) \|$/);assert(m,l);return {key:m[1],cells:m[2].split(' | ').map(s=>s.trim())}});
assert.equal(rows.length,Object.keys(all).length);assert.equal(new Set(rows.map(r=>r.key)).size,rows.length);
const courses=new Map(),out=path.join(root,'public/learning');fs.mkdirSync(out,{recursive:true});
function publishLesson(key,lesson){
const filename=key.replaceAll('|','-')+'.json';
// Source references and production instructions remain in private source for audit.
const published=JSON.parse(JSON.stringify(lesson,(k,v)=>k==='docs'?undefined:v));
for(const s of published.screens)if(s.visual)s.visual=require('./learning-visuals.cjs').compile(s);
const body=JSON.stringify(published);fs.writeFileSync(path.join(out,filename),body);
return '/learning/'+filename+'?v='+crypto.createHash('sha256').update(body).digest('hex').slice(0,24);
}
for(const {key,cells}of rows){const ids=key.split('|').map(Number),lesson=all[key];assert(lesson,key);const integrated=ids[0]===1,code=integrated?'CORE':cells[0].split(' ')[0],id=integrated?'core':code.toLowerCase();
if(!courses.has(id))courses.set(id,{id,code,kind:integrated?'core':'cert',title:integrated?'AI 통합 커리큘럼':cells[0],level:integrated?'Integrated':cells[0].split(' ').at(-1),description:integrated?'AI 기초부터 개발·에이전트·운영·보안까지, 전체 역량을 연결하는 통합 학습 경로입니다.':`${cells[0]}의 핵심 개념과 사례를 체계적으로 살펴보는 자격증별 학습 경로입니다.`,modules:[],lessons:[]});
const c=courses.get(id),moduleIndex=integrated?ids[1]:ids[2],moduleTitle=integrated?cells[0]:cells[1],mappedTitle=integrated?cells[1]:cells[2],mappedMinutes=Number(cells.at(-1));assert.equal(mappedMinutes,lesson.minutes,key+' duration');
if(!c.modules.some(m=>m.index===moduleIndex))c.modules.push({index:moduleIndex,title:moduleTitle});
const file=publishLesson(key,lesson);
c.lessons.push({key,title:lesson.title,mappedTitle,minutes:lesson.minutes,module:moduleIndex,file,objectives:lesson.opening.objectives});
}
let catalog=[...courses.values()];for(const c of catalog){if(c.kind==='cert'){const verb={Fundamental:'Understand',Foundational:'Understand',Associate:'Apply',Professional:'Master',Specialty:'Explore'}[c.level];assert(verb,c.level);c.subject=c.title.split(' ').slice(1,-1).join(' ');c.title='How to '+verb+' : '+c.subject;c.description=c.subject+'의 핵심 개념과 사례를 체계적으로 살펴보는 학습 경로입니다.';}c.descriptionEn=c.kind==='core'?'An integrated learning path connecting AI foundations with development, agents, operations, and security.':'A structured learning path exploring the key concepts and practical examples of '+c.subject+'.';c.minutes=c.lessons.reduce((n,l)=>n+l.minutes,0);c.outcomes=[...new Set(c.lessons.flatMap(l=>l.objectives||[]))].slice(0,4);}
const english=require('../content/learning/catalog-en.cjs');
for(const c of catalog){const e=english[c.id];assert(e,c.id);assert.equal(e.modules.length,c.modules.length,c.id+' modules');assert.equal(e.lessons.length,c.lessons.length,c.id+' lessons');assert.equal(e.outcomes.length,c.outcomes.length,c.id+' outcomes');c.titleEn=c.kind==='core'?'Integrated AI Curriculum':c.title;c.outcomesEn=e.outcomes;c.modules.forEach((m,i)=>m.titleEn=e.modules[i]);c.lessons.forEach((l,i)=>l.titleEn=e.lessons[i]);}
const expanded=require('./expand-core.cjs')(catalog,publishLesson);catalog=expanded.catalog;
const subjectsKo={'AI Literacy':'AI 리터러시','AI Services':'AI 서비스','Workflow Automation':'업무 자동화','Application Development':'애플리케이션 개발','Solution Design':'솔루션 설계','Agent Engineering':'에이전트 엔지니어링','AI Operations':'AI 운영','Security Engineering':'보안 엔지니어링','AI Governance':'AI 거버넌스','Model Optimization':'모델 최적화'};
for(const c of catalog){
 if(c.kind==='cert'){const verb={Fundamental:'이해하기',Foundational:'이해하기',Associate:'적용하기',Professional:'숙달하기',Specialty:'탐구하기'}[c.level];assert(subjectsKo[c.subject],c.subject);c.title=verb+' : '+subjectsKo[c.subject];c.description=subjectsKo[c.subject]+'의 핵심 개념과 사례를 체계적으로 살펴보는 학습 경로입니다.'}
 const within={};for(const l of c.lessons){l.displayNumber=c.code+' '+(l.module+1)+'-'+(within[l.module]=(within[l.module]||0)+1);l.mappedTitle=l.displayNumber+'. '+l.title;}
}
// Apply consistent list punctuation to course descriptions, objectives and all outline titles.
catalog=JSON.parse(JSON.stringify(catalog,(key,value)=>typeof value==='string'?value.replace(/[ \t]*·[ \t]*/g,' · '):value));
require('./build-learning-english.cjs')(catalog);
fs.writeFileSync(path.join(root,'public/learn-data.js'),'window.LEARNING_PATHS='+JSON.stringify(catalog)+';\nwindow.LEARNING_LEGACY_CORE_KEYS='+JSON.stringify(expanded.legacyKeys)+';\n');
console.log(`Imported ${catalog.length} paths, ${catalog.reduce((n,c)=>n+c.lessons.length,0)} lessons; mapping, identity and duration validated.`);
