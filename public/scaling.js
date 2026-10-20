/* Shared, deterministic browser/Worker scoring. No population-response claims. */
const EvidenceScaling = (() => {
  function build(bank) {
    const qs = [...bank.questions].sort((a,b)=>String(a.id).localeCompare(String(b.id),'en'));
    if (!qs.length || new Set(qs.map(q=>q.id)).size!==qs.length) throw Error('Invalid bank');
    const mass={}, evidence={};
    for(const q of qs){
      if(!/^L[1-4]$/.test(q.difficulty))throw Error('Invalid difficulty '+bank.code+':'+q.id);
      const lower=qs.filter(x=>x.difficulty<q.difficulty).length;
      const same=qs.filter(x=>x.difficulty===q.difficulty).length;
      const d=-Math.log1p(-(lower+same/2)/qs.length);
      // Only explicitly reviewed, stable IDs are eligible. Search tags are not.
      const features=[...new Set(['domain:'+q.domain,'type:'+q.type,...(q.scoringConceptIds||[]).map(x=>'concept:'+x)])].sort();
      evidence[q.id]={};
      for(const f of features){
        mass[f]=(mass[f]||0)+1/features.length;
        evidence[q.id][f]=d/features.length;
      }
    }
    const total=Object.values(mass).reduce((a,b)=>a+b,0);
    const weights=Object.fromEntries(Object.keys(mass).sort().map(f=>[f,mass[f]/total]));
    return {version:'evidence-scaling-v1',passScore:bank.threshold*10,weights,evidence};
  }
  function grade(model, ids, outcomes) {
    if(!model||!ids.length||ids.length!==outcomes.length||new Set(ids).size!==ids.length)throw Error('Invalid scoring input');
    const ordered=ids.map((id,i)=>({id,ok:outcomes[i]})).sort((a,b)=>String(a.id).localeCompare(String(b.id),'en'));
    const available={},earned={};
    for(const {id,ok} of ordered){
      if(!model.evidence[id]||typeof ok!=='boolean')throw Error('Unknown scoring question');
      for(const [f,v] of Object.entries(model.evidence[id])){
        available[f]=(available[f]||0)+v;
        earned[f]=(earned[f]||0)+(ok?v:0);
      }
    }
    let numerator=0,denominator=0;
    for(const f of Object.keys(available).sort()){
      denominator+=model.weights[f]*Math.log1p(available[f]);
      numerator+=model.weights[f]*Math.log1p(earned[f]);
    }
    if(!(denominator>0))throw Error('Invalid scoring model');
    const count=outcomes.filter(Boolean).length;
    const exactScore=count===0?0:count===ids.length?1000:Math.max(0,Math.min(1000,1000*numerator/denominator));
    // Canonical 12-decimal numerical cleanup, then floor: no pass-by-rounding.
    const score=Math.floor(Number(exactScore.toFixed(12)));
    const contributions={};
    for(const {id,ok} of ordered){
      contributions[id]=0;
      if(ok)for(const [f,v] of Object.entries(model.evidence[id])){
        contributions[id]+=1000*model.weights[f]*Math.log1p(earned[f])/denominator*v/earned[f];
      }
    }
    const integerContributions=Object.fromEntries(ordered.map(({id})=>[id,Math.floor(contributions[id])]));
    let remaining=score-Object.values(integerContributions).reduce((a,b)=>a+b,0);
    const ranked=ordered.filter(x=>x.ok).sort((a,b)=>(contributions[b.id]%1-contributions[a.id]%1)||String(a.id).localeCompare(String(b.id),'en'));
    for(let i=0;i<remaining;i++)integerContributions[ranked[i%ranked.length].id]++;
    return {scoringVersion:model.version,score,maxScore:1000,passScore:model.passScore,pass:score>=model.passScore,count,total:ids.length,contributions,integerContributions,exactScore};
  }
  return {build,grade};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=EvidenceScaling;
