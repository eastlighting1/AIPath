const fs=require('fs'),cp=require('child_process'),assert=require('assert');
for(const lang of ['ko','en']){
 const p='content/'+lang+'/ASF.json',now=JSON.parse(fs.readFileSync(p,'utf8'));
 const before=JSON.parse(cp.execFileSync('C:/Program Files/Git/bin/git.exe',['show','HEAD:'+p],{encoding:'utf8'}));
 assert.deepStrictEqual({...now,guide:null},{...before,guide:null});
 assert.equal((now.guide.match(/^### /gm)||[]).length,4);
 assert(!/최종 설계안|포지셔닝|초안|@Mathmedix|Final Design|initial draft|items for confirmation|Question maintenance/.test(now.guide));
 console.log(lang+': candidate guide has four sections; questions, scoring and metadata unchanged');
}
