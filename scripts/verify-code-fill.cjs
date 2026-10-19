const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const root=path.resolve(__dirname,'..');let count=0;
for(const lang of ['ko','en']){
 const source=fs.readFileSync(path.join(root,'public/app-'+lang+'.js'),'utf8');
 const ctx={optionLabel:(q,id)=>String.fromCharCode(69-(id.charCodeAt(0)-65)),window:{APP_LANG:lang}};vm.createContext(ctx);
 for(const name of ['esc','inline','md']){const line=source.split('\n').find(l=>l.startsWith('function '+name+'(')||l.startsWith('const '+name+'='));assert(line,name);vm.runInContext(line,ctx);}
 vm.runInContext(source.slice(source.indexOf('function attemptText('),source.indexOf('\nfunction formatAnswer(')),ctx);
 for(const code of ['ADA','AEP','SES','MOS'])for(const q of JSON.parse(fs.readFileSync(path.join(root,'content',lang,code+'.json'))).questions.filter(q=>q.format==='code-fill')){
  count++;assert.equal(q.options.length,5);assert.equal(q.keys.length,1);assert(q.options.some(o=>o.id===q.keys[0]));
  assert(q.tags.includes(lang==='ko'?'코드 빈칸':'Code completion'));
  const html=ctx.md(q.prompt);assert(html.includes('<pre class="question-code"'));assert(html.includes('[A]'));assert(html.includes('[B]'));assert(!html.includes('<p>```'));
  for(const o of q.options)assert.equal(ctx.attemptText(q,o.text),o.text);
  assert.equal(ctx.attemptText(q,'[A] [B] {{option:A}}'), '[A] [B] E');
  assert(!ctx.attemptText(q,q.explanation).includes('{{option:'));
  if(lang==='en')assert(!/[가-힣]/.test(q.prompt+q.explanation+q.options.map(o=>o.text).join('')));
 }
 assert(ctx.md('```html\n<script>alert(1)</script>\n```').includes('&lt;script&gt;'));
}
assert.equal(count,72);console.log('36 questions × 2 languages: code rendering, escaping, tags, keys, English completeness and shuffled labels passed.');
