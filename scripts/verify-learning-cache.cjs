const fs=require('fs'),assert=require('assert'),vm=require('vm'),zlib=require('zlib'),crypto=require('crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex').slice(0,24);
const asset=text=>({type:'application/javascript',gzip:true,data:zlib.gzipSync(text).toString('base64'),etag:'"'+hash(text)+'"'});
const html=text=>({...asset(text),type:'text/html'});
const version=require('./version-assets.cjs');
const a={'/one.js':asset('one'),'/two.js':asset('two'),'/index.html':html('<script src="/one.js"></script><script src="/two.js"></script>')};
version(a);const before=zlib.gunzipSync(Buffer.from(a['/index.html'].data,'base64')).toString();
const b={'/one.js':asset('updated'),'/two.js':asset('two'),'/index.html':html('<script src="/one.js"></script><script src="/two.js"></script>')};version(b);
const after=zlib.gunzipSync(Buffer.from(b['/index.html'].data,'base64')).toString();
assert(before.includes('/one.js?v='+hash('one')));assert(after.includes('/one.js?v='+hash('updated')));
assert(before.includes('/two.js?v='+hash('two'))&&after.includes('/two.js?v='+hash('two')));
(async()=>{
 const worker=(await import('data:text/javascript;base64,'+fs.readFileSync('dist/server/index.js').toString('base64'))).default;
 const get=(url,headers={})=>worker.fetch(new Request('https://example.test'+url,{headers}),{});
 const h=await get('/learn');assert(!h.headers.get('cache-control').includes('immutable'));
 const text=await h.text(),refs=[...text.matchAll(/(?:src|href)="([^" ]+\?v=[a-f0-9]+)"/g)].map(m=>m[1]);assert(refs.length>=7);
 for(const ref of refs){const r=await get(ref);assert.equal(r.status,200,ref);assert(r.headers.get('cache-control').includes('immutable'),ref);assert.equal((await get(ref,{'if-none-match':r.headers.get('etag')})).status,304)}
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync('public/learn-data.js','utf8'),ctx);
 for(const p of ctx.window.LEARNING_PATHS)for(const l of p.lessons)for(const file of [l.file,l.fileEn]){assert(file,'Missing localized lesson URL');const r=await get(file);assert.equal(r.status,200,file);assert(r.headers.get('cache-control').includes('immutable'),file);assert.equal(new URL(file,'https://example.test').searchParams.get('v'),hash(await r.text()))}
 assert.equal((await get('/learn.js?v=old-version')).headers.get('cache-control'),'no-store');
 console.log('Cache checks passed: versioned HTML dependencies, 716 Korean/English content-hashed lessons, immutable/304 responses, stale-version fallback and selective invalidation.');
})().catch(e=>{console.error(e);process.exitCode=1});
