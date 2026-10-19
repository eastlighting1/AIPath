const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm');
const root=path.resolve(__dirname,'..');const counts={ALF:15,ADA:27,SDA:15,WFA:11,SES:13,SDP:7,AEP:19,AGS:7};
for(const lang of ['ko','en']){
 const node={innerHTML:'',classList:{add(){},remove(){}}};const c={window:{APP_LANG:lang,scrollTo(){},addEventListener(){}},document:{getElementById:()=>node,querySelectorAll:()=>[]},sessionStorage:{getItem(){return null},removeItem(){}},clearInterval(){},URL};vm.createContext(c);
 for(const f of [lang==='ko'?'data.js':'data-en.js','app-'+lang+'.js'])vm.runInContext(fs.readFileSync(path.join(root,'public',f),'utf8'),c);
 for(const [code,count] of Object.entries(counts)){
  const e=JSON.parse(fs.readFileSync(path.join(root,'content',lang,code+'.json')));const qs=e.questions.filter(q=>q.sourceId);assert.equal(qs.length,count);assert.equal(new Set(e.questions.map(q=>q.id)).size,e.questions.length);
  for(const q of qs){assert(q.prompt.trim());if(q.context)assert(q.prompt.startsWith(q.title));c.fixture=q;assert(vm.runInContext('correct(fixture,fixture.keys)',c));assert(!vm.runInContext('correct(fixture,[])',c));assert(!vm.runInContext('attemptExplanation(fixture)',c).includes('{{option:'));}
  const served=JSON.parse(fs.readFileSync(path.join(root,'public/courses',lang,code+'.json')));assert.equal(served.questions.length,e.questions.length);assert.equal(served.guide,e.guide);
 }
 const g=JSON.parse(fs.readFileSync(path.join(root,'content',lang,'AGS.json'))).guide;assert(g.includes(lang==='ko'?'특정 국가 법률 조문을 사전 지식으로 두는 해석은 범위 밖입니다. 규제는 3사 문서가 언급하는 범위 혹은 조문 발췌본에서만 출제합니다.':'statutory excerpts supplied in the question'));
}
console.log('114 new questions in both languages: complete case prompts, grading, resolved explanation labels, served bank/guide parity, and AGS scope verified.');
