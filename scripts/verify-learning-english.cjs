const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const ctx={window:{},document:{documentElement:{lang:'en'}}};
for(const file of ['learn-data.js','lesson-ui.js'])vm.runInNewContext(fs.readFileSync('public/'+file,'utf8'),ctx);
const paths=ctx.window.LEARNING_PATHS,U=ctx.window.LessonUI;
for(const course of paths){for(const key of ['titleEn','descriptionEn','outcomesEn'])assert(course[key]&&!/[가-힣]/.test(JSON.stringify(course[key])),course.id+' '+key);for(const module of course.modules)assert(module.titleEn&&!/[가-힣]/.test(module.titleEn),course.id+' module title')}
let lessons=0,screens=0,checks=0;const hangul=[];
function compare(a,b,p){assert.equal(typeof a,typeof b,p);if(Array.isArray(a)){assert.equal(a.length,b.length,p);a.forEach((x,i)=>compare(x,b[i],p+'.'+i))}else if(a&&typeof a==='object'){assert.deepEqual(Object.keys(a),Object.keys(b),p);for(const k of Object.keys(a))compare(a[k],b[k],p+'.'+k)}else if(typeof a!=='string'||!/[가-힣]/.test(a)){if(!p.endsWith('.title'))assert.equal(a,b,p)}if(typeof b==='string'){if(/[가-힣一-龥]/.test(b))hangul.push({path:p,text:b});assert(!/ZXQ(?:LIT|TERM)[A-Z0-9]+|\[\[\[S\d+\]\]\]/i.test(b),p+' placeholder leak')}}
for(const course of paths)for(const meta of course.lessons){
 assert(meta.fileEn&&meta.fileEn.includes('/learning/en/'),meta.key);
 const ko=JSON.parse(fs.readFileSync('public'+meta.file.split('?')[0],'utf8')),en=JSON.parse(fs.readFileSync('public'+meta.fileEn.split('?')[0],'utf8'));
 compare(ko,en,meta.key);assert.equal(en.title,meta.titleEn);
 en.screens.forEach((screen,i)=>{const html=U.render(screen,'qa');assert(html.length);if(['hover','highlight'].includes(screen.ui)){const items=screen.ui==='hover'?screen.data.terms:screen.data.marks;for(const item of items)assert(screen.data.text.includes(item.term||item.span),meta.key+' glossary binding')}if(screen.ui==='code'){assert.equal(screen.data.code.split('\n').length,ko.screens[i].data.code.split('\n').length,meta.key+' code line count')}screens++});
 en.checks.forEach((check,i)=>{assert(U.check(check,'qa').length);for(const field of ['options','left','right','items'])if(Array.isArray(check[field])&&new Set(ko.checks[i][field]).size===ko.checks[i][field].length)assert.equal(new Set(check[field].map(s=>s.trim())).size,check[field].length,meta.key+' check '+i+' translated '+field+' collide');for(const k of ['answer','pairs','after','type'])assert.deepEqual(check[k],ko.checks[i][k],meta.key+' answer structure');checks++});lessons++;
}
fs.writeFileSync('content/learning/english/remaining-korean.json',JSON.stringify(hangul,null,2));
assert.equal(lessons,358);assert.equal(hangul.length,0,'Untranslated Korean remains: see internal report');
console.log(JSON.stringify({lessons,screens,checks,korean:hangul.length,answerKeys:'unchanged',glossaryLinks:'passed',codeLines:'preserved'}));
