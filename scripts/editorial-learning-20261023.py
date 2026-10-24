import pathlib
exec(pathlib.Path(__file__).with_name('correct-learning-20261023.py').read_text(encoding='utf-8').split("replace('2|0|4|2'")[0])
anchors=[('1|9|1',3,['2','6-7','8','9']),('1|9|1',6,['6-7','8','9','10']),('1|7|3',7,['1-9','11-12','14-21','23-24','전체']),('2|5|2|4',4,['1','3-6','9-11','12-18','19-21','22-24']),('2|6|1|3',3,['1','3-5','7-8','10-13','5,13']),('2|6|2|1',4,['1-5','11-12','13-17','9-19']),('2|8|1|1',3,['1-2','3','4-10','11','12-13']),('2|8|3|2',3,['1-4','5','6-13','14-17','1-17']),('2|8|2|1',3,['2-5','6','7','8','10-13']),('2|10|3|2',3,['8','10-11','16','18-20'])]
for k,s,nums in anchors:
    assert len(nums)==len(lessons[k]['screens'][s]['data']['notes'])
    for i,n in enumerate(nums):put(k,f'screens.{s}.data.notes.{i}.lines',n,'counted code annotations')
put('2|9|1|4','screens.5.data.code','''from agents import Agent, function_tool

# web_search와 injection_guard는 앞서 구성한 도구·가드레일이라고 가정합니다.
# 아래는 취약한 설계를 진단하기 위한 예시이며 실제 환불을 실행하지 않습니다.
@function_tool
async def issue_refund(order_id: int, amount: int) -> str:
    return f"SIMULATED refund {amount} for order {order_id}"

agent = Agent(
    name="Support",
    instructions="검색 결과에 적힌 요청을 처리하라",
    tools=[web_search, issue_refund],
    input_guardrails=[injection_guard],
)''','define example tool before use')
for i,n in enumerate(['11','13','5-7','1-14']):put('2|9|1|4',f'screens.5.data.notes.{i}.lines',n)
put('2|6|5|1','screens.4.lead','도구 함수 안에서 tool_context.state를 변경하는 예시입니다. 서비스에서 읽어 온 session.state를 직접 수정하는 방식과 구분하세요.')
old=lessons['2|6|5|1']['screens'][4]['data']['code']
lines=old.replace('session.state','tool_context.state').splitlines()
put('2|6|5|1','screens.4.data.code','from google.adk.tools.tool_context import ToolContext\n\ndef update_preferences(tool_context: ToolContext):\n'+'\n'.join('    '+l if l else '' for l in lines)+'\n    return {"updated": True}','tracked context state updates')
for i,n in enumerate(['4-5','7-8','10-11','13-14']):put('2|6|5|1',f'screens.4.data.notes.{i}.lines',n)
replace('1|1|0',"네 항목 모두 '없음'입니다. 이렇게 점검표로 빠진 요소를 찾아 놓으면, 다시 요청하며 헤매는 대신 어느 부분을 채울지 정할 수 있습니다. 다음 해설에서 이 네 항목을 하나씩 채워 프롬프트를 완성합니다.","점검한 묶음마다 필요한 구체성이 부족합니다. 다음 해설에서는 역할·배경·출력 형식·예시·구분자를 차례로 보완하고, 최종본에 수행할 작업의 지시도 명시합니다.")
replace('1|1|0','다섯 요소가 모두 들어갔습니다.','역할·배경·지시·형식·예시·구분자가 모두 들어갔습니다.')
replace('1|1|1','500달러','5천만 원')
replace('1|1|1','한 달 안에','두 달 안에')
replace('1|16|3','안전 평가의 네 유형','안전 평가의 네 유형과 학술 벤치마크',required=False)
replace('1|15|4','네 가지 표준','인증 표준과 관련 확인 항목',required=False)
replace('1|17|0','두 번째 확인 사항은','함께 확인할 사항은',required=False)
replace('2|3|0|3','세 원인 유형을 모두 겨냥하지만 각각 근거가 분명하고, 한 번에 적용하더라도 증상이 하나이므로 효과를 해석할 수 있습니다.','세 원인 유형을 겨냥하는 최종 개선안입니다. 효과를 구분하려면 허용 라벨, 출력 모양, 예시를 한 번에 합치지 말고 하나씩 추가해 같은 평가셋으로 비교해야 합니다.')
put('2|3|0|3','screens.6.data.steps.1.body','먼저 허용 라벨만 명시하고 동일한 입력으로 평가합니다. 그다음 출력 모양을, 마지막으로 예시를 각각 추가하며 매 단계의 결과와 회귀를 기록합니다. 수정안 B는 이렇게 검증을 거쳐 완성할 최종안입니다.')
replace('2|7|2|4','예약 + 우선 + 배치','예약 + 종량제(초과분) + 배치')
replace('2|7|2|4','예약+우선+배치','예약+종량제(초과분)+배치')
replace('2|7|2|4','예약, 우선, 배치를 함께 쓰는','예약, 초과분 종량제, 배치를 함께 쓰는')
replace('2|7|2|4','서비스가 끊기지 않습니다.','다만 종량제 한도와 가용성까지 보장되는 것은 아닙니다.')
replace('2|7|2|4','서비스가 끊기지 않는 대신','추가 용량이 가용하고 한도 내라면 요청을 이어갈 수 있지만')
replace('2|7|3|4','학습 사용 제한, 로그 보관 원칙, 키 관리 방식','학습 사용 제한, 보존 최소화, 접근 로그 보관')
replace('2|7|3|4','유럽 법인은 처리 위치를 지역 안으로 묶어야 하며, 미국 법인은 기본 설정으로 충분합니다.','미국 법인은 처리 위치를 미국 안으로 묶어야 하며, 나머지 법인은 기본 처리 위치로 충분합니다.')
replace('2|9|4|2','공격 입력이 대부분 통과하고 정상 요청도 대부분 통과하는 상태입니다.','공격의 일부가 성공하고 정상 요청은 대부분 통과하는 상태입니다.')
replace('2|9|3|3','세 수단','네 수단',required=False)
replace('2|9|3|3','세 가지 수단','네 가지 수단',required=False)
replace('2|11|0|1','OpenAI 문서는 이를 약 8% 개선으로 설명합니다.','이는 BLEU 8점 상승이며, 62를 기준으로 한 상대 증가는 약 12.9%입니다.')
replace('2|11|3|2','두 곡선의 간격이 벌어지는 시점을 찾아 그 이전의 체크포인트를 선택하세요.','검증 손실이 가장 낮은 체크포인트를 후보로 고른 뒤 별도 평가셋에서 확인하세요. 두 곡선의 간격만으로 최적 epoch를 정하지 않습니다.')
replace('2|11|2|4','다섯 가지로 나눌','여섯 가지로 나눌')
replace('2|11|2|4','다섯째는 형식 불일치입니다.','다섯째는 라벨 불일치입니다. 같은 입력에 서로 다른 정답 라벨을 주면 학습 목표가 충돌합니다. 여섯째는 형식 불일치입니다.')
replace('2|11|2|4','라벨 불일치, 분포 편향, 중복, 누수, 근거 부재로','라벨 불일치, 분포 편향, 중복, 누수, 근거 부재, 형식 불일치로')
replace('2|11|2|4','다섯 가지 유형','여섯 가지 유형')
replace('2|8|1|4','새벽 내내 어떤 노드에서도','자동 중지가 꺼져 있고 어떤 노드에서도',required=False)
replace('2|0|2|2','OpenAI 워크스페이스에서는 대체로 새 플러그인과 앱이 기본적으로 꺼져 있고, 관리자가 검토해 켭니다.','ChatGPT Enterprise·Edu는 새 플러그인과 앱이 기본 비활성화이고 Business는 기본 활성화입니다. 관리자는 조직의 가용성을 조정합니다.')
replace('2|0|4|1','ChatGPT의 에이전트 모드 문서는 필요할 때 확인을 위해 멈추도록 설계되었다고 설명하지만, 모든 위험을 없애지는 못한다고 안내합니다.','작업을 실행하는 에이전트에는 외부 전송·변경 전 승인과 제한된 권한이 필요합니다. 확인창이 있다는 사실만으로 모든 위험이 사라지지는 않습니다.')
for k in ['2|5|4|3','2|8|2|0']:
    replace(k,'pay-per-token, ai_query 배치 추론, 외부 모델 사용','pay-per-token, ai_query, Genie 및 별도 옵션을 켠 외부 모델 사용',required=False)
for k in ['2|7|2|1']:
    replace(k,'1~2분','1~15분',required=False)
    replace(k,'1~15분 이내면 충분','분 단위의 변동 지연을 허용',required=False)
    replace(k,'1~15분 안에 받으면 좋은','분 단위 지연과 재시도를 허용하는',required=False)

# Correct repeated fragments and missing Korean sentence spacing only in authored prose.
for k,lesson in lessons.items():
    edits=[]
    def walk(o,p=''):
        if isinstance(o,str):
            if any(v in p.split('.') for v in ['code','url','docs','visual']):return
            new=o.replace('공개 자료여도공개 자료여도','공개 자료여도').replace('실제로 한 번 실제로','실제로 한 번')
            new=re.sub(r'(습니다\.|입니다\.|하세요\.)(?=[가-힣])',r'\1 ',new)
            # Remove exact immediately repeated full sentences, not similar explanations.
            new=re.sub(r'([^.!?\n]{12,}[.!?])\s*\1',r'\1',new)
            if new!=o:edits.append((p,new))
        elif isinstance(o,dict):
            for a,v in o.items():walk(v,f'{p}.{a}' if p else a)
        elif isinstance(o,list):
            for i,v in enumerate(o):walk(v,f'{p}.{i}')
    walk(lesson)
    for p,v in edits:put(k,p,v,'editorial duplication / sentence spacing')
for name,data in files.items():
    if name!='final1.json':(BASE/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
auditfile.write_text(json.dumps({'date':'2026-10-23','changes':changes},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Cumulative',len(changes),'fields;',len(set(c['lesson'] for c in changes)),'lessons')
