window.makePreviewMock=(type,length,lang)=>{
 const en=lang==='en',long=length==='long',t=(ko,eng)=>en?eng:ko;
 const q={id:1,title:'UI mock',type,domain:'D1',difficulty:'L1',keys:['A'],explanation:'Layout testing only.',options:[],prompt:''};
 const context=t('가상의 팀이 주간 업무 자료를 정리하고 있습니다. 담당자는 문서에 포함된 일정과 요청 사항을 확인한 뒤 공유용 요약을 작성해야 합니다. 개인정보는 제외하고, 확인되지 않은 내용은 별도로 표시하며, 최종 공유 전에 사람이 원문과 대조합니다.','A fictional team is organizing its weekly work documents. The coordinator must identify dates and requests before preparing a shared summary. Personal information is excluded, uncertain details are marked, and a person checks the final draft against the source.');
 const choices=[t('원문을 확인하고 핵심 내용을 요약한다.','Check the source and summarize the key points.'),t('확인되지 않은 내용을 사실처럼 추가한다.','Add unverified details as established facts.'),t('담당자의 검토 후 결과를 공유한다.','Share the result after the owner reviews it.'),t('출처를 삭제한 채 전체 자료를 공개한다.','Publish all material without its sources.')];
 const extra=t(' 이때 작업의 목적, 자료의 접근 범위, 검토 담당자와 공유 시점을 함께 확인하고 변경 이력을 남깁니다.',' Also verify the purpose, access scope, reviewer, and sharing schedule, and retain a change history.');
 q.prompt=(long?context+'\n\n':'')+t('다음 업무에서 적절한 처리 방법을 선택하세요.','Select the appropriate approach for this task.');
 q.options=choices.map((text,i)=>({id:String.fromCharCode(65+i),text:text+(long?extra:'')}));
 if(type==='복수 선택'){q.keys=['A','C'];q.prompt+=t(' 정답은 2개입니다.',' Select TWO answers.');}
 if(type==='매칭'){
 q.prompt=(long?context+'\n\n':'')+t('각 상황에 가장 알맞은 작업을 연결하세요. 보기 하나는 사용하지 않습니다.','Match each situation to the most suitable task. One option is unused.');
 q.items=[t('긴 회의 기록의 핵심 파악','Identify key points in meeting notes'),t('공유 전 사실 확인','Verify facts before sharing'),t('반복 요청의 처리 방식 정리','Organize a recurring request workflow')].map((text,i)=>({id:String(i+1),text:text+(long?extra:'')}));q.options=[t('요약 작성','Summarize'),t('원문 대조','Compare with the source'),t('절차 문서화','Document the procedure'),t('장식용 이미지 생성','Generate a decorative image')].map((text,i)=>({id:String.fromCharCode(97+i),text:text+(long?extra:'')}));q.keys=['a','b','c'];
 }
 if(type==='순서 배열'){q.prompt=(long?context+'\n\n':'')+t('자료를 검토하고 공유하는 절차를 순서대로 배열하세요.','Arrange the review and sharing steps in order.');q.items=[t('자료 수집','Collect sources'),t('초안 작성','Prepare a draft'),t('원문과 대조','Check against the source'),t('검토 후 공유','Share after review')].map((text,i)=>({id:String(i+1),text:text+(long?extra:'')}));q.keys=['1','2','3','4'];q.options=[];}
 if(type==='진술 판정'){q.prompt=(long?context+'\n\n':'')+t('각 진술의 적절성을 판단하세요.','Decide whether each statement is correct.');q.items=choices.map((text,i)=>({id:String(i+1),text:text+(long?extra:'')}));q.options=[{id:'Yes',text:'Yes'},{id:'No',text:'No'}];q.keys=['Yes','No','Yes','No'];}
 return q;
};
