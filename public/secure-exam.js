let serverToken='',secureBusy=false,saveQueue=Promise.resolve();
async function examRequest(action,extra={}){const response=await fetch('/api/exam/'+action,{method:'POST',keepalive:action==='save',signal:AbortSignal.timeout(20000),headers:{'Content-Type':'application/json','X-AIpath-Exam':'1'},body:JSON.stringify({id:attemptId,token:serverToken,lang:window.APP_LANG,...extra})});if(!response.ok)throw Error('Exam request failed');return response.json()}
function securePending(on){secureBusy=on;app.setAttribute('aria-busy',String(on));document.getElementById('secure-exam-status')?.remove();if(on){const status=document.createElement('div');status.id='secure-exam-status';status.setAttribute('role','status');status.textContent=tr('시험 기록을 처리하고 있습니다…','Updating your exam…');status.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 20px;background:#142427;color:#fff;border-radius:6px;z-index:1000;font-size:14px';document.body.append(status)}}
function secureError(){showSiteModal({title:tr('시험 연결을 확인해 주세요','Check your exam connection'),message:tr('답안은 이 브라우저에 보관됩니다. 연결을 확인한 뒤 다시 시도해 주세요.','Your answers remain in this browser. Check your connection and try again.')})}
function applyServerAttempt(data,saved={}){
 selected=exams.findIndex(e=>e.code===data.code);attemptId=data.id;serverToken=data.token||saved.serverToken||serverToken;examMode=data.mode;candidateName=data.candidateName;registrationName=candidateName;
 originalQuestions[selected]=data.questions;exams[selected].questions=data.questions;questionOrder=data.questions.map(q=>q.id);choiceOrder=data.choiceOrder;
 deadline=data.deadline;paused=data.paused;pausedRemainingMs=data.remaining;current=Math.max(0,Math.min(Number(saved.current)||0,data.questions.length-1));flags=new Set(saved.flags||[]);filter=saved.filter||'all';reviewFilter='all';
 answers=saved.answers?.length===data.questions.length?saved.answers:data.questions.map(()=>[]);
 if(data.result){answers=data.result.answers;lastResult={...data.result,exam:selected,serverToken,attemptId};active=false;stop();result()}else{lastResult=null;active=true;if(paused)renderPaused();else{exam();startTimer();if(secondsLeft()<=0)submit(true)}}
}
async function secureStart(i,mode,registered){
 if(mode==='full'&&(!registered||!cleanCandidate(registrationName)||cleanCandidate(registrationName).length>40)){enroll(i);return}
 if(active&&!leave(()=>secureStart(i,mode,registered)))return;if(secureBusy)return;securePending(true);
 const epoch=renderEpoch;try{const data=await examRequest('start',{code:exams[i].code,mode,candidateName:mode==='full'?cleanCandidate(registrationName):''});if(epoch===renderEpoch)applyServerAttempt(data)}catch{secureError()}finally{securePending(false)}
}
async function secureRestore(saved){
 if(!saved.serverToken){home();showSiteModal({title:tr('새 시험을 시작해 주세요','Please start a new exam'),message:tr('서버 채점 도입 전의 기록은 복원할 수 없습니다.','Attempts created before server grading cannot be restored.')});return false}
 try{const data=await examRequest('restore',{id:saved.attemptId,token:saved.serverToken});applyServerAttempt(data,saved);return true}catch{home();secureError();return false}
}
async function secureSubmit(){if(secureBusy)return;securePending(true);stop();persistAttempt();try{await saveQueue;const data=await examRequest('submit',{answers});applyServerAttempt(data,{serverToken,answers,current,flags:[...flags]})}catch{secureError()}finally{securePending(false);if(active&&secondsLeft()>0)startTimer()}}
async function securePause(resume=false){if(secureBusy||!active)return;securePending(true);try{await saveQueue;const data=await examRequest(resume?'resume':'pause',{answers});applyServerAttempt(data,{serverToken,answers,current,flags:[...flags]})}catch{secureError()}finally{securePending(false)}}
let lastSavedAnswers='';
function saveServerAnswers(){if(!active||!serverToken||paused)return;const encoded=JSON.stringify(answers);if(encoded===lastSavedAnswers)return;lastSavedAnswers=encoded;const id=attemptId,token=serverToken,payload=JSON.parse(encoded);saveQueue=saveQueue.catch(()=>{}).then(()=>examRequest('save',{id,token,answers:payload})).catch(()=>{lastSavedAnswers=''});}
