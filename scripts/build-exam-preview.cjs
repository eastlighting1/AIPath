const fs=require('fs'),path=require('path');
const pub=path.resolve(__dirname,'../public');
const html=fs.readFileSync(path.join(pub,'index.html'),'utf8')
 .replace('<head>','<head><base href="/"><meta name="robots" content="noindex,nofollow">')
 .replace(/<script src="language\.js[^\"]*"><\/script>/,'<script src="/exam-preview.js"></script>');
if(!html.includes('src="/exam-preview.js"'))throw Error('Preview entry point missing');
fs.writeFileSync(path.join(pub,'exam-preview.html'),html);
