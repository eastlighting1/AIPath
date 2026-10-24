(()=>{
 const footer=document.querySelector('footer');if(!footer)return;
 const note=document.createElement('p');note.className='site-assessment-note';footer.append(note);
 const update=()=>{note.textContent=document.documentElement.lang==='en'?'SPECORY is an independent learning and self-assessment service, not affiliated with or endorsed by OpenAI, Anthropic, or Google. SPECORY learning credentials are based on unproctored online assessments without identity verification; they are not official vendor certifications.':'SPECORY는 OpenAI · Anthropic · Google과 제휴하거나 이들로부터 인증받지 않은 독립 학습·자가평가 서비스입니다. SPECORY 자체 학습 인증은 본인 확인과 시험 감독 없이 진행하는 온라인 평가 결과이며, 제공사의 공식 자격이 아닙니다.'};
 update();new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
