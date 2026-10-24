// Materialize English at build time; no translation requests from visitors.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
module.exports=function(catalog){
 const root=path.resolve(__dirname,'..'),base=path.join(root,'content/learning/english'),memory=new Map();
 for(const line of fs.readFileSync(path.join(base,'memory.jsonl'),'utf8').trim().split('\n')){const r=JSON.parse(line);memory.set(r.source,r.english)}
 const overrides=path.join(base,'overrides.json');if(fs.existsSync(overrides))for(const [ko,en] of Object.entries(JSON.parse(fs.readFileSync(overrides,'utf8'))))memory.set(ko,en);
 const tr=s=>{if(!/[가-힣]/.test(s))return s;assert(memory.has(s),'Missing English: '+s.slice(0,100));let en=memory.get(s);if(s.includes('지식 기준일'))en=en.replace(/knowledge (?:base date|reference date|baseline|cut-off date)/gi,'knowledge cutoff');if(s.includes('추론 강도'))en=en.replace(/reasoning intensity/gi,'reasoning effort');if(s.includes('보상 해킹'))en=en.replace(/compensation hacking/gi,'reward hacking');if(s.includes('폴백')&&!/롤백|rollback/i.test(s))en=en.replace(/rollback/gi,'fallback');if(s.includes('파드')&&!/\bpad\b/i.test(s))en=en.replace(/\bpads?\b/gi,m=>/^P/.test(m)?(m.endsWith('s')?'Pods':'Pod'):(m.endsWith('s')?'pods':'pod'));return en};
 const codePattern=/"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\/\/[^\n]*/g;
 function code(s,language){
 if(/^(text|plaintext|markdown)$/i.test(language))return s.split('\n').map(line=>/[가-힣]/.test(line)?line.match(/^\s*/)[0]+tr(line.trim()).replace(/\n/g,' '):line).join('\n');
 if(/^sql$/i.test(language))s=s.replace(/^(\s*--)(.*)$/gm,(_,prefix,body)=>prefix+tr(body).replace(/\n/g,' '));
 if(/^ya?ml$/i.test(language))s=s.replace(/^([ \t]*(?:- )?[a-zA-Z_]+:[ \t]*)(.*)$/gm,(_,prefix,value)=>{if(!/[가-힣]/.test(value)||/^["']/.test(value))return prefix+value;const split=value.indexOf(' #'),body=split<0?value:value.slice(0,split),tail=split<0?'':value.slice(split);let translated=tr(body).replace(/\n/g,' ');if(!body.startsWith('['))translated=JSON.stringify(translated);return prefix+translated+tail});
 return s.replace(codePattern,part=>{if(!/[가-힣]/.test(part))return part;const q=part.startsWith('"""')||part.startsWith("'''")?3:/^["']/.test(part)?1:part.startsWith('//')?2:1,end=/^["']/.test(part)?q:0;const body=part.slice(q,end?-end:undefined).split('\n').map(line=>{let result=tr(line).replace(/\n/g,' ');if(end){const quote=part[0];result=result.replace(new RegExp('(?<!\\\\)'+quote,'g'),/sql/i.test(language)?quote+quote:'\\'+quote)}return result}).join('\n');return part.slice(0,q)+body+(end?part.slice(-end):'')})}
 function walk(v,key='',language=''){if(typeof v==='string')return key==='code'?code(v,language):tr(v);if(Array.isArray(v))return v.map(x=>walk(x,key,language));if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,walk(x,k,v.language||language)]));return v}
 const out=path.join(root,'public/learning/en');fs.mkdirSync(out,{recursive:true});let total=0;
 for(const p of catalog)for(const meta of p.lessons){
  const source=JSON.parse(fs.readFileSync(path.join(root,'public',meta.file.split('?')[0]),'utf8')),english=walk(source);english.title=meta.titleEn;
  source.screens.forEach((s,index)=>{if(!['hover','highlight'].includes(s.ui))return;const items=s.ui==='highlight'?s.data.marks:s.data.terms,terms=items.map(x=>x.span||x.term);let text=s.data.text;const pattern=new RegExp([...terms].sort((a,b)=>b.length-a.length).map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');text=text.replace(pattern,term=>'ZXQTERM'+String(terms.indexOf(term)).padStart(4,'0')+'QXZ');text=tr(text);terms.forEach((term,i)=>text=text.split('ZXQTERM'+String(i).padStart(4,'0')+'QXZ').join(tr(term)));english.screens[index].data.text=text;});
  const file=meta.key.replaceAll('|','-')+'.json',body=JSON.stringify(english);fs.writeFileSync(path.join(out,file),body);meta.fileEn='/learning/en/'+file+'?v='+crypto.createHash('sha256').update(body).digest('hex').slice(0,24);total++;
 }
 console.log('Built '+total+' English lessons.');
};
