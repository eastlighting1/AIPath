// Previous codes remain valid for already-open clients and bookmarked asset URLs.
const LEGACY_CODES={AFP:'ALF',ASP:'ASF',AWB:'WFA',AIA:'SDA',AIP:'SDP',ASX:'SES',RGV:'AGS',MCS:'MOS'};
const currentCode=code=>LEGACY_CODES[code]||code;
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function sharePage(report,url){
 const en=report.lang==='en',title=escapeHtml(report.title),image=url.origin+url.pathname+'/image.png',description=(report.candidateName?report.candidateName+' · ':'')+report.correct+'/'+report.total+(en?' correct answers · ':'문항 정답 · ')+report.score+'/'+(report.maxScore||100)+' · SPECORY';
 return `<!doctype html><html lang="${report.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | SPECORY</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="noindex"><meta property="og:type" content="website"><meta property="og:site_name" content="SPECORY"><meta property="og:title" content="${title}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${escapeHtml(url.origin+url.pathname)}"><meta property="og:image" content="${escapeHtml(image)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/png"><meta property="og:image:alt" content="${escapeHtml(report.name)} — SPECORY"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:image" content="${escapeHtml(image)}"><link rel="icon" href="/specory-mark.svg"><style>@font-face{font-family:Pretendard;src:url('/fonts/PretendardVariable.woff2')}*{box-sizing:border-box}body{margin:0;background:#f7f9f8;color:#142427;font-family:Pretendard,Arial,sans-serif}main{max-width:1000px;margin:auto;padding:48px 24px 64px}.brand{width:168px}h1{font-size:clamp(27px,4vw,42px);line-height:1.4;letter-spacing:-.03em;margin:48px 0 16px}p{color:#607273;line-height:1.8}.report{display:block;width:100%;height:auto;border:1px solid #d8e2df;border-radius:8px;margin:28px 0}.actions{display:flex;gap:12px;flex-wrap:wrap}a{color:inherit}a.button{padding:14px 22px;background:#142427;color:white;border-radius:5px;text-decoration:none}a.secondary{background:#eae5db;color:#142427}</style></head><body><main><a href="/?lang=${report.lang}"><img class="brand" src="/specory-logo.svg" alt="SPECORY"></a>${report.candidateName?`<p style="margin-top:36px">${en?'CANDIDATE':'응시자'} · ${escapeHtml(report.candidateName)}</p>`:''}<h1>${title}</h1><p>${escapeHtml(description)}</p><img class="report" src="${escapeHtml(image)}" width="1200" height="630" alt="${escapeHtml(report.name)} ${en?'exam result':'시험 결과'}"><div class="actions"><a class="button" href="/?lang=${report.lang}">${en?'Explore certifications':'자격증 둘러보기'}</a><a class="button secondary" href="${escapeHtml(image)}?download=1" download="SPECORY-${report.code}.png">${en?'Save result image':'결과 이미지 저장'}</a></div><p style="font-size:12px;margin-top:30px">${en?"SPECORY learning credential · unproctored self-assessment without identity verification. Not affiliated with or endorsed by OpenAI, Anthropic, or Google; not an official vendor certification.":"SPECORY 자체 학습 인증 · 본인 확인·감독 없는 자가평가 결과입니다. OpenAI · Anthropic · Google과 제휴하거나 이들로부터 인증받지 않았으며, 제공사 공식 자격이 아닙니다."}</p></main></body></html>`;
}
export default {async fetch(request,env){
 try{
  const url=new URL(request.url),path=url.pathname;
  if(path.startsWith('/api/exam/'))return examApi(request,env,url);
  if(path==='/api/share'){
   if(request.method!=='POST')return json({error:'Method not allowed'},405);
   if(request.headers.get('origin')!==url.origin||request.headers.get('X-AIpath-Share')!=='1')return json({error:'Invalid origin'},403);
   if(Number(request.headers.get('content-length'))>2500000)return json({error:'Payload too large'},413);
   if(!env.BUCKET)return json({error:'Storage unavailable'},503);
   // Bound streamed uploads as well as Content-Length before parsing multipart.
   const reader=request.body.getReader();let length=0;const chunks=[];for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>2500000){await reader.cancel();return json({error:'Payload too large'},413);}chunks.push(value);}
   const body=new Uint8Array(length);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}
   const form=await new Response(body,{headers:{'content-type':request.headers.get('content-type')||''}}).formData();const image=form.get('image'),raw=form.get('result');
   if(typeof raw!=='string'||raw.length>30000||!image||typeof image==='string'||image.type!=='image/png'||image.size>2200000)return json({error:'Invalid report'},400);
   let report;try{report=await submittedReport(env,JSON.parse(raw));}catch{return json({error:'Invalid result'},400);}
   const bytes=new Uint8Array(await image.arrayBuffer()),view=new DataView(bytes.buffer);if(bytes.length<24||[137,80,78,71,13,10,26,10].some((v,i)=>bytes[i]!==v)||view.getUint32(16)!==1200||view.getUint32(20)!==630)return json({error:'Invalid image'},400);
   const id=crypto.randomUUID(),prefix='reports/'+id;
   await env.BUCKET.put(prefix+'.png',bytes,{httpMetadata:{contentType:'image/png'}});await env.BUCKET.put(prefix+'.json',JSON.stringify(report),{httpMetadata:{contentType:'application/json'}});
   return json({url:url.origin+'/share/'+id},201);
  }
  const share=path.match(/^\/share\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(\/image\.png)?$/);
  if(share){
   if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
   if(!env.BUCKET)return new Response('Unavailable',{status:503});
   const object=await env.BUCKET.get('reports/'+share[1]+(share[2]?'.png':'.json'));if(!object)return new Response('Report not found',{status:404});
   if(share[2])return new Response(request.method==='HEAD'?null:object.body,{headers:{'content-type':'image/png','cache-control':'public,max-age=31536000,immutable','x-content-type-options':'nosniff',...(url.searchParams.has('download')?{'content-disposition':'attachment; filename="SPECORY-report.png"'}:{})}});
   const report=await object.json();return new Response(request.method==='HEAD'?null:sharePage(report,url),{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public,max-age=3600','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin'}});
  }
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  const assetPath=path.replace(/^(\/badges\/|\/courses\/(?:ko|en)\/)([A-Z]{3})(?=[.-])/,(_,prefix,code)=>prefix+currentCode(code));
  const asset=ASSETS[/^\/learn\/?$/.test(path)?'/learn.html':/^\/djemdls\/?$/.test(path)?'/review.html':path==='/'?'/index.html':/^\/about\/?$/.test(path)?'/about.html':assetPath];if(!asset)return new Response('Not found',{status:404});
  const version=url.searchParams.get('v'),immutable=version===asset.etag.slice(1,-1)&&!asset.type.startsWith('text/html');
  const headers={'content-type':asset.type,'cache-control':immutable?'public,max-age=31536000,immutable':version?'no-store':/\.woff2$|\.svg$/.test(path)?'public,max-age=86400':'public,max-age=0,must-revalidate','x-content-type-options':'nosniff','etag':asset.etag};
  if(/^\/(djemdls\/?|review\.(html|js|css)|exam-preview\.(html|js)|review-preview\.js)$/.test(path))headers['x-robots-tag']='noindex, nofollow, noarchive';
  if(request.headers.get('if-none-match')===asset.etag)return new Response(null,{status:304,headers});
  if(request.method==='HEAD')return new Response(null,{headers});
  // Emit decoded asset bytes. The hosting edge owns transport compression.
  const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));if(asset.gzip)return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')),{headers});
  return new Response(bytes,{headers});
 }catch{return json({error:'Could not process request'},500);}
}};
