const fs=require('fs'),path=require('path');
const base=(process.env.PAGES_BASE_PATH||'/AIPath/').replace(/\/?$/,'/'),out=path.resolve('_site');
fs.mkdirSync(out,{recursive:true});fs.cpSync('public',out,{recursive:true});
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory()){walk(p);continue;}if(!/\.(html|js|css)$/.test(p))continue;let s=fs.readFileSync(p,'utf8');
s=s.replace(/(["'`(=])\/(?!\/)(?=(?:about|djemdls|courses|badges|fonts|review|exam-preview|preview-mocks|admin-|catalog-|app-|language|brand-|favicon|index|\?))/g,(_,lead)=>lead+base);
s=s.replaceAll('https://aipath.dongle.chatgpt.site', 'https://eastlighting1.github.io'+base.slice(0,-1));
if(p.endsWith('.html'))s=s.replace('<head>','<head><base href="'+base+'">');
fs.writeFileSync(p,s);
}}
walk(out);
for(const [route,file] of [['about','about.html'],['djemdls','review.html']]){fs.mkdirSync(path.join(out,route),{recursive:true});fs.copyFileSync(path.join(out,file),path.join(out,route,'index.html'));}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log('GitHub Pages build: '+base);
