// Version references after transforming their dependencies. HTML always revalidates;
// unchanged resources keep exactly the same content-based URL across deployments.
const crypto=require('crypto'),zlib=require('zlib');
module.exports=function versionAssets(assets){
 const read=a=>a.gzip?zlib.gunzipSync(Buffer.from(a.data,'base64')):Buffer.from(a.data,'base64');
 function write(a,text){const bytes=Buffer.from(text);a.data=(a.gzip?zlib.gzipSync(bytes,{level:9}):bytes).toString('base64');a.etag='"'+crypto.createHash('sha256').update(bytes).digest('hex').slice(0,24)+'"'}
 function version(ref){
  if(/^(?:[a-z]+:|\/\/|#)/i.test(ref))return ref;
  const u=new URL(ref,'https://assets.local/'),asset=assets[u.pathname];
  if(!asset||asset.type.startsWith('text/html'))return ref;
  u.searchParams.set('v',asset.etag.slice(1,-1));return u.pathname+u.search+u.hash;
 }
 function css(text){return text.replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(_,q,ref)=>'url('+q+version(ref)+q+')')}
 for(const a of Object.values(assets))if(a.type.startsWith('text/css'))write(a,css(read(a).toString()));
 for(const a of Object.values(assets))if(a.type.startsWith('text/html'))write(a,css(read(a).toString()).replace(/\b(src|href)=(['"])([^'"]+)\2/g,(_,attr,q,ref)=>attr+'='+q+version(ref)+q));
};
