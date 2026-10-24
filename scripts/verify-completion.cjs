const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const metadata={window:{}};vm.runInNewContext(fs.readFileSync('public/learn-data.js','utf8'),metadata);
const source=fs.readFileSync('public/learn.js','utf8');
const panel=source.slice(source.indexOf('function completionPanel'),source.indexOf('async function bindCompletion'));
for(const p of metadata.window.LEARNING_PATHS){
 const context={count:()=>p.lessons.length-1,t:(ko,en)=>en};vm.createContext(context);vm.runInContext(panel,context);
 assert.equal(context.completionPanel(p),'',p.id+' must hide sharing until all lessons finish');
 context.count=()=>p.lessons.length;assert.match(context.completionPanel(p),/data-completion-download/);
}
for(const code of ['ALF','ASF','WFA','ADA','SDA','AOA','AEP','SDP','AOP','SES','AGS','MOS']){
 const svg=fs.readFileSync('public/badges/'+code+'-specory.svg','utf8');assert(!svg.includes('<text'),'Badge type must not depend on device fonts');assert(svg.includes('aria-label="'+code+'"'));
}
assert(source.includes("u.hash='completion'"));assert(!source.includes('class="lp-card-brand"'));assert(!source.includes('class="lp-card-art"'));
console.log('PASS: 27 path completion gates; 12 outlined badge families; clean catalogue and finish destination.');
