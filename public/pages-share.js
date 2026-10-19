'use strict';
// A static Pages deployment has no upload API. A link carries the attempt,
// and the receiver recomputes the score from the same question bank.
getShareLink=async function(r=lastResult){
 const payload={v:1,code:exams[r.exam].code,mode:r.mode,name:r.candidateName||'',ids:r.questionOrder,choices:r.choiceOrder||{},answers:r.answers,elapsed:r.elapsed,lang:window.APP_LANG};
 const packed=btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(payload)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 return new URL(document.baseURI).href.split('?')[0].split('#')[0]+'?lang='+window.APP_LANG+'#report='+packed;
};
(async()=>{
 if(!location.hash.startsWith('#report='))return;
 try{
 const raw=location.hash.slice(8);if(raw.length>50000)throw Error();
 const p=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(raw.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0))));
 const i=exams.findIndex(e=>e.code===p.code);if(p.v!==1||i<0||!['demo','full'].includes(p.mode)||!Array.isArray(p.ids)||!Array.isArray(p.answers)||p.answers.length!==p.ids.length||p.answers.some(a=>!Array.isArray(a)||a.length>12||a.some(x=>typeof x!=='string'||x.length>10))||!Number.isFinite(p.elapsed)||p.elapsed<0)throw Error();
 const response=await fetch('courses/'+window.APP_LANG+'/'+p.code+'.json');if(!response.ok)throw Error();const bank=await response.json();
 originalQuestions[i]=bank.questions;exams[i].guide=bank.guide;selected=i;examMode=p.mode;questionOrder=p.ids;choiceOrder=p.choices&&typeof p.choices==='object'?p.choices:{};applyQuestionOrder(i);
 candidateName=cleanCandidate(String(p.name||'')).slice(0,40);answers=p.answers;
 lastResult={...grade(exams[i],answers),exam:i,mode:p.mode,candidateName,questionOrder:[...p.ids],choiceOrder,elapsed:Math.min(p.elapsed,durationMinutes(i)*60),answers,expired:false};active=false;result();
 const notice=document.createElement('p');notice.className='wrap note';notice.textContent=tr('공유 링크의 응시 데이터로 재계산한 결과입니다. 본인 확인이나 서버 인증을 거친 기록이 아닙니다.','Recomputed from the attempt data in this link. This is not an identity-verified or server-certified record.');document.getElementById('app').prepend(notice);
 }catch{showSiteModal({title:tr('공유 링크를 열 수 없습니다','Invalid share link'),message:tr('링크가 손상되었거나 현재 문제은행과 일치하지 않습니다.','This link is damaged or does not match the current question bank.')});}
})();
