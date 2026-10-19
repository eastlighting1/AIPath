const fs=require('fs'),path=require('path');
const pub=path.resolve(__dirname,'../public');
const original=fs.readFileSync(path.join(pub,'index.html'),'utf8');
const page=original.replace('<head>','<head><base href="/">').replace('</head>','<link rel="stylesheet" href="/about.css?v=1"></head>').replace(/<script src="language\.js[^\"]*"><\/script>/,'<script src="/about.js?v=1"></script>');
if(page===original||page.includes('<script src="language.js'))throw Error('About shell build failed');
fs.writeFileSync(path.join(pub,'about.html'),page);
console.log('Built bilingual about page with unchanged header and footer.');
