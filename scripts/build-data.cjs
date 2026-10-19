const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),codes=['ALF','WFA','ADA','SDA','AEP','SDP','SES','AGS','MOS','ASF'];
for(const lang of ['ko','en']){
 const exams=codes.map(code=>JSON.parse(fs.readFileSync(path.join(root,'content',lang,code+'.json'),'utf8')));
 // These option bodies explicitly refer to another option; preserve the stable
 // ID in a token so the UI can label it using the current attempt's order.
 if(lang==='ko')for(const e of exams)for(const q of e.questions)for(const o of q.options){
  if((e.code==='WFA'&&q.id===51&&o.id==='C')||(e.code==='SES'&&q.id===8&&o.id==='D')||(e.code==='AGS'&&q.id===36&&['B','D'].includes(o.id)))o.text=o.text.replace(/([A-F])(와 같)/g,'{{option:$1}}$2');
 }
 // Case questions can be sampled independently. Repeat the required premise
 // instead of referring to a preceding source question that may not be drawn.
 for(const e of exams)for(const q of e.questions){
  if(lang==='ko'){
   // AGS 3 also names scenario constraints A–C; only answer headings refer
   // to shuffled choices. Explicit tokens keep those constraint names intact.
   if(e.code==='AGS'&&q.id===3)q.explanation=q.explanation.replace(/\*\*([A-D]) \(/g,'**{{option:$1}} (');
   if(e.code==='AEP'&&q.id===20)q.prompt=q.prompt.replace('Q19의 구성(Managed Agents + 자체 호스팅 샌드박스)','Managed Agents + 자체 호스팅 샌드박스 구성');
   if(e.code==='AEP'&&q.id===35)q.prompt=q.prompt.replace('Q34의 구조','리드 에이전트가 문서 묶음을 정하고 서브에이전트가 각 묶음을 검토한 뒤 결과를 종합하는 구조');
   if(e.code==='SDP'&&q.id===32)q.prompt=q.prompt.replace('Q31의 구성에 따라 ','');
   if(e.code==='MOS'&&q.id===52)q.prompt=q.prompt.replace('앞 문항과 같은 팀이 이제','Agent Platform에서 튜닝을 운영하는 팀이');
   if(e.code==='MOS'&&q.id===66)q.prompt=q.prompt.replace('Q65에서 정한 쌍 구성, 즉 ','');
  }else{
   if(e.code==='AEP'&&q.id===20)q.prompt=q.prompt.replace('the Q19 configuration:','the following configuration:');
   if(e.code==='AEP'&&q.id===35)q.prompt=q.prompt.replace("Q34's architecture",'an architecture where a lead agent identifies document bundles, delegates each to a subagent, and consolidates their results');
   if(e.code==='SDP'&&q.id===32)q.prompt=q.prompt.replace('Following the configuration in source question Q31, design','Design');
   if(e.code==='MOS'&&q.id===52)q.prompt=q.prompt.replace('The same team as in the preceding source question is now','A team operating tuning on Agent Platform is');
  }
 }
 // Mark matching-option references once, without changing code or link targets.
 for(const e of exams)for(const q of e.questions)if(q.type==='매칭'){
  const mark=id=>'{{option:'+id+'}}';
  if(lang==='ko')q.explanation=q.explanation.replace(/\{\{option:[^}]+\}\}|`[^`]*`|https?:\/\/[^\s)]+|(?<![A-Za-z0-9_])[a-g](?![A-Za-z0-9_])/g,t=>q.options.some(o=>o.id===t)?mark(t):t);
  else if(!q.explanation.includes('{{option:')){
   q.explanation=q.explanation.replace(/(\|\s*)([a-g])(?=[:\s|])/g,(_,p,id)=>p+mark(id)).replace(/(→\s*)([a-g])(?=\s*\|)/g,(_,p,id)=>p+mark(id));
   if(e.code==='SDP'&&q.id===29)q.explanation=q.explanation.replace('Marketplace-billed a.','Marketplace-billed '+mark('a')+'.');
   if(e.code==='SDP'&&q.id===58)q.explanation=q.explanation.replace('multiplier in f applies','multiplier in '+mark('f')+' applies');
  }
 }
 fs.writeFileSync(path.join(root,'public',lang==='ko'?'data.js':'data-en.js'),'window.EXAMS = '+JSON.stringify(exams)+';\n');
 const dir=path.join(root,'public','courses',lang);fs.mkdirSync(dir,{recursive:true});
 for(const e of exams)fs.writeFileSync(path.join(dir,e.code+'.json'),JSON.stringify({questions:e.questions,guide:e.guide}));
 const catalog=exams.map(({questions,guide,...e})=>({...e,bankCount:questions.length,questions:[]}));
 fs.writeFileSync(path.join(root,'public','catalog-'+lang+'.js'),'window.EXAMS = '+JSON.stringify(catalog)+';\n');
 console.log(lang+': '+exams.reduce((n,e)=>n+e.questions.length,0)+' questions');
}
