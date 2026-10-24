const fs=require('fs'),path=require('path'),assert=require('assert');
module.exports=function expandCore(catalog,publish){
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/learning/curriculum1-final.json'),'utf8'));
const translations=require('../content/learning/core-courses-en.cjs'),old=catalog.find(c=>c.id==='core');
const englishByKey=Object.fromEntries(old.lessons.map(l=>[l.key,l.titleEn]));
englishByKey['1n|ASI|0']='Common foundations of agent frameworks';
englishByKey['1n|LPC|0']='Tokens and the two phases of LLM inference';
const seen=new Set(),indexed=new Map(data.lesson_index.map(l=>[l.key,l]));
const expanded=data.courses.map(source=>{
 const e=translations[source.code];assert(e);assert.equal(e.modules.length,source.sections.length);assert.equal(e.goals.length,source.sections.length);
 const c={id:source.code.toLowerCase(),code:source.code,courseNo:source.no,kind:'core',level:'Integrated',title:source.ko,titleEn:source.en,description:source.sections[0].goal,descriptionEn:e.goals[0],modules:[],lessons:[],outcomes:source.sections.map(s=>s.goal),outcomesEn:e.goals};
 source.sections.forEach((section,i)=>{
 c.modules.push({index:i,title:section.title,titleEn:e.modules[i],goal:section.goal,goalEn:e.goals[i]});
 section.lessons.forEach(meta=>{
 const l=data.lessons[meta.key];assert(l,meta.key);assert(!seen.has(meta.key),'Duplicate '+meta.key);seen.add(meta.key);
 assert.equal(indexed.get(meta.key).course_code,source.code);assert.equal(meta.minutes,l.minutes);assert.equal(meta.title,l.title);
 assert(englishByKey[meta.key],meta.key+' missing English title');
 c.lessons.push({key:meta.key,title:l.title,titleEn:englishByKey[meta.key],mappedTitle:meta.no+'. '+l.title,number:meta.no,minutes:l.minutes,module:i,file:publish(meta.key,l),objectives:l.opening.objectives});
 });
 });c.minutes=c.lessons.reduce((n,l)=>n+l.minutes,0);return c;
});
assert.equal(seen.size,Object.keys(data.lessons).length);assert.equal(seen.size,data.lesson_index.length);
return {catalog:[...expanded,...catalog.filter(c=>c.kind==='cert')],legacyKeys:old.lessons.map(l=>l.key)};
};
