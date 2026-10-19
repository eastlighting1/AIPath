const fs=require('fs'),vm=require('vm'),assert=require('assert');(async()=>{
 const source=fs.readFileSync(require('path').resolve(__dirname,'../dist/server/index.js'),'utf8'),worker=(await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))).default;
 const files=new Map(),BUCKET={async put(k,v){files.set(k,typeof v==='string'?new TextEncoder().encode(v):new Uint8Array(v));},async get(k){const b=files.get(k);return b?{body:b,json:async()=>JSON.parse(new TextDecoder().decode(b))}:null;}};
 const c={window:{}};vm.runInNewContext(fs.readFileSync(require('path').resolve(__dirname,'../public/data.js'),'utf8'),c);const e=c.window.EXAMS[0];
 const bytes=new Uint8Array(24);bytes.set([137,80,78,71,13,10,26,10]);new DataView(bytes.buffer).setUint32(16,1200);new DataView(bytes.buffer).setUint32(20,630);
 for(const lang of ['ko','en'])for(const mode of ['demo','full'])for(const pass of [true,false]){
  const questions=e.questions.slice(0,mode==='full'?e.count:10),form=new FormData();form.set('image',new Blob([bytes],{type:'image/png'}),'report.png');form.set('result',JSON.stringify({code:e.code,candidateName:'QA <Candidate>',lang,mode,questionOrder:questions.map(q=>q.id),answers:questions.map(q=>pass?q.keys:[]),elapsed:10}));
  const req=new Request('https://example.test/api/share',{method:'POST',headers:{Origin:'https://example.test','X-AIpath-Share':'1'},body:form});const response=await worker.fetch(req,{BUCKET});assert.equal(response.status,201,await response.clone().text());const {url}=await response.json();
  const page=await worker.fetch(new Request(url),{BUCKET}),html=await page.text();assert.equal(page.status,200);assert(html.includes('property="og:image"'));assert(html.includes('QA &lt;Candidate&gt;'));assert(html.includes('1200'));assert.equal(html.includes(lang==='en'?'I earned':'취득하였습니다'),mode==='full'&&pass);
  const image=await worker.fetch(new Request(url+'/image.png'),{BUCKET});assert.deepEqual(new Uint8Array(await image.arrayBuffer()),bytes);
 }
 const bad=new Request('https://example.test/api/share',{method:'POST',headers:{Origin:'https://evil.test','X-AIpath-Share':'1'},body:'x'});assert.equal((await worker.fetch(bad,{BUCKET})).status,403);
 const bad2=new FormData();bad2.set('image',new Blob([bytes],{type:'image/png'}),'report.png');bad2.set('result',JSON.stringify({code:'ALF',lang:'en',mode:'full',questionOrder:[1],answers:[['C']],elapsed:10}));assert.equal((await worker.fetch(new Request('https://example.test/api/share',{method:'POST',headers:{Origin:'https://example.test','X-AIpath-Share':'1'},body:bad2}),{BUCKET})).status,400);
 for(const path of ['/','/language.js','/catalog-ko.js','/courses/en/WFA.json','/app-ko.js','/badges/ALF-symbol.svg','/fonts/InterVariable.woff2']){const r=await worker.fetch(new Request('https://example.test'+path),{BUCKET});assert.equal(r.status,200,path);assert((await r.arrayBuffer()).byteLength>0);}
 console.log('Worker checks passed: 8 bilingual sharing scenarios, exact image bytes, server grading, invalid origins/results, static assets and OG metadata.');
})();

