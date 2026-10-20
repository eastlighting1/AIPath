const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..'),dist=path.join(root,'public');let source=fs.readFileSync(path.join(dist,'app.js'),'utf8');
source=fs.readFileSync(path.join(dist,'scaling.js'),'utf8')+'\n'+source;
const types=['코드 빈칸','단일 선택','복수 선택','매칭','순서 배열','진술 판정'];
let en=source.replace(String.raw`e.purpose.replace(/^이 시험에서는 응시자가 /,'').replace(/ 확인합니다\.$/,' 확인합니다.')`,'e.purpose');types.forEach((t,i)=>{en=en.replaceAll("'"+t+"'","'__TYPE_"+i+"__'");});
const translations=JSON.parse(fs.readFileSync(path.join(__dirname,'ui-translations.json'),'utf8'));
for(const [ko,text] of Object.entries(translations).sort((a,b)=>b[0].length-a[0].length))en=en.split(ko).join(text);
types.forEach((t,i)=>{en=en.replaceAll('__TYPE_'+i+'__',t);});
// Whole-template refinements keep English grammar natural around dynamic values.
en=en.replace('${modeLabel(r.mode)} 결과','${modeLabel(r.mode)} result');
en=en.replace('AI fluency,,<br>proven through practice.','Understand AI.<br>Prove your skills.');
en=en.replace('Generative AI foundations, development, architecture, and security.<br>9 certification paths to find your next goal.','From AI foundations to development, architecture, and security.<br>Find your next goal across nine certification paths.');
en=en.replace('OpenAI · Anthropic · Google across generative AI  skills.','Build generative AI skills across OpenAI, Anthropic, and Google.');
en=en.replace('AFPStart with →','Start with ALF →');
en=en.replace('${i+1} step','Step ${i+1}').replace('${typeLabel(q.type)} ${i+1} answer','${typeLabel(q.type)} answer ${i+1}');
en=en.replace('${i+1} question','Question ${i+1}');
en=en.replace('Correct ${q.keys.length} answers to select.','Select ${q.keys.length} correct answers.');
en=en.replace('${q.keys.length} selections maximum. Deselect an answer before choosing another.','You can select up to ${q.keys.length} answers. Deselect an answer before choosing another.');
en=en.replace('Share your learning progress on SNS and LinkedIn.','Share your learning progress on social media and LinkedIn.');
en=en.replace('in &nbsp; LinkedInShare on','in &nbsp; Share on LinkedIn').replace('↗ SNS Share','↗ Share').replaceAll('PASSED · Pass','PASSED').replaceAll('NOT PASSED · Not passed','NOT PASSED');
en=en.replace('100 points possible','out of 100');
en=en.replace("text('Practice exam report',846,1384,17,muted)","text('Practice exam report',846,1384,17,muted)");
en=en.replace("'-practice-report.png'","'-practice-report-en.png'");
fs.writeFileSync(path.join(dist,'app-ko.js'),source);fs.writeFileSync(path.join(dist,'app-en.js'),en);console.log('Built Korean and English application bundles.');

