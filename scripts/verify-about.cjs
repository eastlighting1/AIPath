const fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
 const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
 const index=read('public/index.html'),about=read('public/about.html');
 for(const tag of ['header','footer'])assert.equal(about.match(new RegExp('<'+tag+'>[\\s\\S]*?</'+tag+'>'))[0],index.match(new RegExp('<'+tag+'>[\\s\\S]*?</'+tag+'>'))[0],tag+' must remain unchanged');
 assert(!about.includes('src="language.js'));assert(!about.includes('catalog-ko.js'));
 const worker=(await import('data:text/javascript;base64,'+Buffer.from(read('dist/server/index.js')).toString('base64'))).default;
 for(const p of ['/about','/about/','/about.html','/about?lang=en','/about.css','/about.js']){
  const r=await worker.fetch(new Request('https://example.test'+p),{});assert.equal(r.status,200,p);const body=await r.text();assert(body.length>100,p);if(p.includes('css'))assert(r.headers.get('content-type').startsWith('text/css'));else if(!p.includes('.js'))assert(body.includes('/about.js'));
 }
 for(const code of ['ALF','ASF','WFA','ADA','SDA','AEP','SDP','SES','AGS','MOS']){
  assert(read('public/about.js').includes("['"+code+"',"));assert(fs.existsSync(path.join(root,'public/badges',code+'-symbol.svg')));assert(fs.existsSync(path.join(root,'content/en',code+'.json')));
 }
 console.log('About checks passed: unchanged header/footer, independent page bundle, all routes/MIME types, ten certification targets and badges.');
})().catch(e=>{console.error(e);process.exit(1)});
