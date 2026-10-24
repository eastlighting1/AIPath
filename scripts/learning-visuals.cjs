// Extract only balanced, explicitly quoted display labels. Never render prose
// between mismatched quote marks as user-facing illustration content.
const pairs={"'":"'",'"':'"','“':'”','‘':'’','「':'」'};
const instruction=/(?:그린다|그려\s*넣|배치한다|표시한다|붙인다|둔다|넣는다|강조한다|나란히\s*놓|라벨을|아이콘을|화살표를|카드\s*(?:아래|위|오른쪽|왼쪽)|강조색\s*밑줄)/;
function quotedLabels(text){
 const labels=[];
 for(let i=0;i<text.length;i++){
  const open=text[i],close=pairs[open];if(!close)continue;
  if((open==="'"||open==='"')&&/[\p{L}\p{N}]/u.test(text[i-1]||''))continue;
  let j=i+1;for(;j<text.length;j++)if(text[j]===close&&text[j-1]!=='\\'&&!(close==="'"&&/[A-Za-z]/.test(text[j-1]||'')&&/[A-Za-z]/.test(text[j+1]||'')))break;
  if(j===text.length)continue;
  const label=text.slice(i+1,j).trim();i=j;
  if(label.length<1||label.length>180||instruction.test(label))continue;
  if((label.match(/「/g)||[]).length!==(label.match(/」/g)||[]).length)continue;
  labels.push(label);
 }
 return [...new Set(labels)];
}
function compile(screen){
 const spec=screen.visual.spec||'',items=screen.data.steps||screen.data.tabs||screen.data.states||screen.data.stops||screen.data.markers||screen.data.cards||[];
 const quoted=quotedLabels(spec),labels=quoted.length?quoted:[...new Set(items.map(x=>x.title||x.label||x.value||x.front).filter(x=>typeof x==='string'&&!instruction.test(x)))];
 return {kind:screen.visual.kind,alt:screen.visual.alt,labels,layout:screen.ui==='hotspot'?'hotspot':/타임라인/.test(spec)?'timeline':/나란히|왼쪽.*오른쪽|두.*카드/.test(spec)?'compare':'flow'};
}
module.exports={compile,quotedLabels,instruction};
