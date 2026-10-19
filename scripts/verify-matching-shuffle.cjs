const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');const root=path.resolve(__dirname,'../public');let total=0;
for(const lang of ['ko','en']){const node={innerHTML:'',classList:{add(){},remove(){}}};const c={window:{APP_LANG:lang,scrollTo(){},addEventListener(){}},document:{getElementById:()=>node,querySelectorAll:()=>[]},sessionStorage:{getItem(){return null},removeItem(){}},clearInterval(){},URL};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,lang==='en'?'data-en.js':'data.js'),'utf8'),c);vm.runInContext(fs.readFileSync(path.join(root,'app-'+lang+'.js'),'utf8'),c);
const result=vm.runInContext(`(()=>{let total=0;for(const e of exams)for(const q of e.questions){if(q.type!=='매칭'){if(md(q.type==='순서 배열'?attemptText(q,q.prompt,false):q.prompt)!==questionPrompt(q))throw Error('Changed non-matching prompt');continue;}total++;const ids=q.options.map(o=>o.id),labels=ids.slice().sort(),unused=ids.filter(id=>!q.keys.includes(id)),positions=new Set();
for(let shift=0;shift<ids.length;shift++){
 choiceOrder[q.id]=ids.slice(shift).concat(ids.slice(0,shift));const ordered=choicesFor(q),body=questionPrompt(q),dropdown=answerChoicesHTML(q,q.keys,0),explanation=attemptExplanation(q);
 if((body.match(/<table>/g)||[]).length!==2)throw Error('Expected two matching tables');
 for(const row of [...q.items,...q.options])if(!body.includes(inline(row.text)))throw Error(e.code+q.id+' missing content '+row.id);
 ordered.forEach((o,index)=>{if(matchingLabel(q,o.id)!==itemLabel(labels[index]))throw Error('Labels not ascending');if(!body.includes('<th scope="row">'+esc(itemLabel(labels[index]))+'</th><td>'+inline(o.text)))throw Error('Wrong table binding');});
 const values=[...dropdown.matchAll(/data-option-id="([^"]+)"/g)].map(m=>m[1]);if(JSON.stringify(values)!==JSON.stringify(ordered.map(o=>o.id)))throw Error('Dropdown/table mismatch');
 if(!correct(q,q.keys))throw Error('Grading changed');if(!formatAnswer(q,q.keys).includes(matchingLabel(q,q.keys[0])))throw Error('Review mismatch');
 for(const token of q.explanation.matchAll(/\\{\\{option:([a-g])\\}\\}/g)){if(attemptText(q,token[0])!==matchingLabel(q,token[1]))throw Error('Explanation reference mismatch');}
 if(explanation.includes('{{option:'))throw Error('Unresolved explanation');
 const protectedText=t=>t.match(/\x60[^\x60]*\x60|https?:\\/\\/[^\\s)]+/g)||[];if(JSON.stringify(protectedText(q.explanation))!==JSON.stringify(protectedText(explanation)))throw Error('Changed code or URL');
 if(unused.length===1)positions.add(matchingLabel(q,unused[0]));
}
if(unused.length===1&&positions.size!==ids.length)throw Error('Unused option has a fixed position');
}return total;})()`,c);total+=result;console.log(lang+': '+result+' matching questions validated through every cyclic permutation');}
assert.equal(total,84);console.log('All matching tables, dropdowns, review labels, explanation tokens, grading and unused-option positions agree.');
