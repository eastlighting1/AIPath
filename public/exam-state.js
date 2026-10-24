// Private browser-local attempt snapshots and URL/history navigation.
let attemptId='',examRouteReady=false,examRouteRestoring=false,examRouteIndex=0,examRouteURL='',examPopIgnore=false;
const attemptStoreKey='aipath-exam-attempts-v1';
function readAttempts(){try{const raw=localStorage.getItem(attemptStoreKey);if(!raw||raw.length>1500000)return [];const list=JSON.parse(raw);return Array.isArray(list)?list.filter(x=>x&&typeof x.id==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(x.id)&&typeof x.code==='string'&&x.state?.version===2&&Array.isArray(x.state.answers)&&Array.isArray(x.state.questionOrder)).slice(0,12):[]}catch{return []}}
function writeAttempts(list){try{localStorage.setItem(attemptStoreKey,JSON.stringify(list.slice(0,12)));return true}catch{return false}}
function newAttemptId(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}
function snapshotAttempt(){return {version:2,attemptId,serverToken,scoringVersion:exams[selected]?.scaling?.version,paused,pausedRemainingMs,examMode,candidateName,registrationName,view,selected,current,answers,questionOrder,choiceOrder,flags:[...flags],deadline,lastResult,active,filter,reviewFilter}}
function persistAttempt(){
 if(window.REVIEW_PREVIEW||!attemptId||(!active&&view!=='result'))return;
 saveServerAnswers();
 const record={id:attemptId,code:exams[selected].code,savedAt:Date.now(),state:snapshotAttempt()};
 const ok=writeAttempts([record,...readAttempts().filter(x=>x.id!==attemptId)]);
 const node=document.getElementById('attempt-storage-status');if(node)node.textContent=ok?tr('이 브라우저에 저장됨 · 새로고침 후 홈에서 이어가기','Saved in this browser · resume from home after refreshing'):tr('저장 공간을 사용할 수 없습니다. 창을 닫으면 복구할 수 없습니다.','Browser storage is unavailable. Closing this page will lose this attempt.');
}
function savedAttemptsPanel(){
 const saved=readAttempts().filter(r=>r.state.active);if(!saved.length)return '';
 return '<section class="wrap section saved-attempts"><div class="section-head"><div><h2>'+tr('저장된 시험 이어가기','Resume a saved exam')+'</h2><p class="sub">'+tr('자동으로 재개하지 않습니다. 실행 중이던 타이머는 창을 닫아도 계속 흐르며, 일시정지한 시험은 남은 시간을 유지합니다.','Attempts do not resume automatically. A running timer keeps counting while the page is closed; a paused exam keeps its remaining time.')+'</p></div></div>'+saved.map(r=>'<div class="saved-attempt"><div><strong>'+esc(r.code)+' · '+modeLabel(r.state.examMode)+'</strong><p class="note">'+tr('답안 ','Answers ')+r.state.answers.filter(a=>Array.isArray(a)&&a.some(Boolean)).length+' / '+r.state.questionOrder.length+' · '+(r.state.paused?tr('일시정지','Paused'):r.state.deadline<=Date.now()?tr('시간 종료 · 결과 확인 가능','Time expired · results available'):tr('진행 중','In progress'))+'</p></div><button class="btn secondary" onclick="resumeSavedAttempt(\''+esc(r.id)+'\')">'+tr('이어서 응시하기','Resume attempt')+' →</button><button class="smallbtn" onclick="discardSavedAttempt(\''+esc(r.id)+'\')">'+tr('저장 삭제','Remove saved attempt')+'</button></div>').join('')+'</section>';
}
function discardSavedAttempt(id){showSiteModal({title:tr('저장된 시험을 삭제할까요?','Remove this saved attempt?'),message:tr('이 브라우저에 저장한 해당 시험의 답안과 진행 기록을 삭제합니다.','This removes the answers and progress for this saved attempt from this browser.'),cancelLabel:tr('취소','Cancel'),confirmLabel:tr('삭제','Remove'),onConfirm:()=>{writeAttempts(readAttempts().filter(x=>x.id!==id));home(filter)}})}
async function restoreSavedAttempt(id,{resultOnly=false}={}){
 const record=readAttempts().find(x=>x.id===id),index=record?exams.findIndex(e=>e.code===record.code):-1;
 if(!record||index<0){home();showSiteModal({title:tr('저장된 기록을 찾을 수 없습니다','Saved attempt not found'),message:tr('이 주소는 해당 브라우저에 저장된 기록을 엽니다. 다른 사람에게는 결과 화면의 공유 링크를 전달해 주세요.','This address opens a record saved in its original browser. Use the result screen’s share link to share with someone else.')});return false}
 if(record.state.scoringVersion!==exams[index].scaling?.version){home();showSiteModal({title:tr('채점 기준이 변경되었습니다','Scoring has changed'),message:tr('이전 기록은 새 채점 기준으로 복원하지 않습니다. 새 시험을 시작해 주세요.','This attempt cannot be restored under the new scoring rules. Start a new exam.')});return false}
 if(!window.REVIEW_PREVIEW){record.state.selected=index;record.state.attemptId=record.id;return secureRestore(record.state)}
 const epoch=renderEpoch;await ensureCourse(index);if(epoch!==renderEpoch)return false;
 const saved=record.state,size=saved.examMode==='full'?exams[index].count:10,pool=originalQuestions[index];
 if(!['full','demo'].includes(saved.examMode)||!Array.isArray(saved.questionOrder)||saved.questionOrder.length!==size||new Set(saved.questionOrder).size!==size||saved.questionOrder.some(id=>!pool.some(q=>q.id===id))||!Array.isArray(saved.answers)||saved.answers.length!==size||saved.answers.some(a=>!Array.isArray(a)||a.length>12||a.some(v=>v!==null&&(typeof v!=='string'||v.length>20)))||!Number.isFinite(saved.deadline)||!Number.isInteger(saved.current)||saved.current<0||saved.current>=size){home();showSiteModal({title:tr('저장된 기록을 복원하지 못했습니다','Could not restore this attempt'),message:tr('저장된 시험 형식이 유효하지 않습니다. 새 시험을 시작해 주세요.','The saved attempt is invalid. Please start a new exam.')});return false}
 if(resultOnly&&(saved.active||!saved.lastResult)){home();return false}
 saved.selected=index;saved.attemptId=record.id;saved.candidateName=cleanCandidate(saved.candidateName).slice(0,40);saved.registrationName=saved.candidateName;saved.answers=saved.answers.map(a=>a.map(x=>x||''));saved.flags=(Array.isArray(saved.flags)?saved.flags:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<size);
 if(!saved.active&&saved.lastResult){const qs=saved.questionOrder.map(id=>pool.find(q=>q.id===id));saved.lastResult={...saved.lastResult,...grade({...exams[index],questions:qs},saved.answers),exam:index,answers:saved.answers,questionOrder:saved.questionOrder,choiceOrder:saved.choiceOrder,candidateName:saved.candidateName};saved.view='result'}
 restoreLanguageState(saved);return true;
}
function resumeSavedAttempt(id){if(active&&!leave(()=>resumeSavedAttempt(id)))return;restoreSavedAttempt(id).catch(()=>showSiteModal({title:tr('시험을 불러오지 못했습니다','Could not load the exam'),message:tr('연결 상태를 확인한 뒤 다시 시도해 주세요.','Check your connection and try again.')}))}
function assessmentNotice(){return '<p class="assessment-notice">'+tr('SPECORY 자체 학습 인증 · 본인 확인이나 시험 감독 없이 진행하는 온라인 자가평가입니다. 제공사 공식 자격을 부여하지 않습니다.','SPECORY learning credential · an online self-assessment without identity verification or proctoring. It does not award an official vendor certification.')+'</p>'}
function resultStatus(r,i){return !r.answers[i]?.some(Boolean)?'unanswered':r.outcomes[i]?'correct':'wrong'}
function statusLabel(status){return status==='unanswered'?tr('미응답','Unanswered'):status==='correct'?tr('정답','Correct'):tr('오답','Incorrect')}
function resultCount(r,status){return r.outcomes.reduce((n,_,i)=>n+(resultStatus(r,i)===status),0)}
function routeAddress(){const u=new URL(location.href);u.pathname='/';u.hash='';for(const key of ['view','cert','attempt','q','level'])u.searchParams.delete(key);u.searchParams.set('lang',window.APP_LANG||'ko');if(view==='home'&&filter!=='all')u.searchParams.set('level',filter);if(view==='detail'){u.searchParams.set('cert',exams[selected].code)}else if(view!=='home'){u.searchParams.set('view',view);if(view!=='exams')u.searchParams.set('cert',exams[selected].code);if(view==='exam'||view==='result'){if(attemptId)u.searchParams.set('attempt',attemptId);if(view==='exam')u.searchParams.set('q',String(current+1))}}return u}
function syncExamRoute(){
 const labels={home:tr('자격증 둘러보기','Explore certifications'),detail:exams[selected]?.name,exams:tr('시험 응시하기','Take an exam'),enroll:tr('응시자 정보','Candidate details'),confirm:tr('응시 내용 확인','Review registration'),exam:exams[selected]?.code+' · '+modeLabel(),result:exams[selected]?.code+' · '+tr('시험 결과','Exam result')};
 document.title=(labels[view]||'SPECORY')+' — SPECORY';
 if(typeof history==='undefined'||typeof location==='undefined'||window.REVIEW_PREVIEW)return;
 const u=routeAddress(),old=examRouteURL?new URL(examRouteURL):new URL(location.href),sameView=old.searchParams.get('view')===u.searchParams.get('view')&&old.searchParams.get('cert')===u.searchParams.get('cert')&&old.searchParams.get('attempt')===u.searchParams.get('attempt');
 const replace=!examRouteReady||examRouteRestoring||sameView;
 if(!replace)examRouteIndex++;
 if(u.href!==location.href||!examRouteReady)history[replace?'replaceState':'pushState']({...history.state,examIndex:examRouteIndex},'',u.href);
 examRouteURL=u.href;examRouteReady=true;
}
async function openExamRoute(url,{initial=false}={}){
 const u=new URL(url),target=u.searchParams.get('view'),code=u.searchParams.get('cert'),index=exams.findIndex(e=>e.code===code),id=u.searchParams.get('attempt');
 if(target==='exam'){
  if(initial){home();return}
  if(id&&active&&id===attemptId){current=Math.max(0,Math.min(exams[selected].questions.length-1,(Number.isInteger(Number(u.searchParams.get('q')))&&Number(u.searchParams.get('q'))>0?Number(u.searchParams.get('q')):1)-1));exam();return}
  if(id){await restoreSavedAttempt(id);return}home();return;
 }
 if(target==='result'&&id){await restoreSavedAttempt(id,{resultOnly:true});return}
 if(target==='exams'){examCatalog();return}
 if(index>=0&&(target==='enroll'||target==='confirm')){enroll(index,target==='confirm'&&!!registrationName);return}
 if(index>=0&&!target){await detail(index);return}
 home(['Fundamental','Associate','Professional','Specialty'].includes(u.searchParams.get('level'))?u.searchParams.get('level'):'all');
}
function bootSite(){
 if(typeof location==='undefined'||typeof history==='undefined'){restoreLanguageState();return}
 examRouteIndex=history.state?.examIndex||0;
 let languageState;try{languageState=JSON.parse(sessionStorage.getItem('aipath-language-state'));sessionStorage.removeItem('aipath-language-state')}catch{}
 examRouteRestoring=true;
 const ready=(languageState?Promise.resolve(restoreLanguageState(languageState)):openExamRoute(location.href,{initial:!window.SiteRouter?.restoring})).catch(()=>home()).finally(()=>examRouteRestoring=false);
 window.addEventListener('popstate',()=>{
  if(examPopIgnore){examPopIgnore=false;return}
  const target=location.href,targetIndex=history.state?.examIndex??0,delta=examRouteIndex-targetIndex;
  if(active&&target!==examRouteURL){
   if(delta){examPopIgnore=true;history.go(delta)}else history.replaceState({examIndex:examRouteIndex},'',examRouteURL);
   leave(()=>{if(delta)history.go(-delta);else{history.replaceState({examIndex:targetIndex},'',target);examRouteIndex=targetIndex;examRouteRestoring=true;openExamRoute(target).finally(()=>examRouteRestoring=false)}});return;
  }
  examRouteIndex=targetIndex;examRouteRestoring=true;openExamRoute(target).catch(()=>home()).finally(()=>{examRouteRestoring=false;window.SiteRouter?.restorePosition()});
 });
 window.addEventListener('pagehide',persistAttempt);
 return ready;
}
