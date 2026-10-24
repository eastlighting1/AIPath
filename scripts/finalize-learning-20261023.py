import pathlib
exec(pathlib.Path(__file__).with_name('correct-learning-20261023.py').read_text(encoding='utf-8').split("replace('2|0|4|2'")[0])
def note(k,text):
    lead=lessons[k]['screens'][0].get('lead','')
    if text not in lead:put(k,'screens.0.lead',lead+'\n\n'+text,'dated scope')
for old,new in [
 ('QoS 등급이 노드 압박 때의 축출 순서를 정합니다.','QoS만으로 노드 압박 때의 축출 순서를 정하지는 않습니다.'),
 ('QoS 등급이 축출 순서를 정합니다.','실제 축출 순위에는 request 초과 여부·Pod 우선순위·상대 사용량이 함께 작용합니다.'),
 ('노드 압박 때 축출 순서를 정합니다.','노드 압박 시 취약성을 가늠할 수 있지만 실제 축출 순서는 사용량과 우선순위 등을 함께 봅니다.'),
 ('노드 압박으로 축출될 때는 requests를 넘겨 쓰는 파드만 후보가 됩니다.','노드 압박 시에는 request를 초과해 쓰는 파드를 우선 고려하지만, 상황에 따라 request 이하의 파드도 축출될 수 있습니다.'),
 ('쿠버네티스는 QoS 등급에 따라 어느 파드를 먼저 내보낼지 정합니다.','kubelet은 request 초과 여부, Pod 우선순위와 상대 사용량으로 축출 순위를 정합니다.'),
 ('Guaranteed가 되어 가장 늦게 축출됩니다. 한도를 넘지 않는 한 보호됩니다.','Guaranteed가 되어 자원 요청·상한이 명확해집니다. 다만 축출되지 않는다는 보장은 아닙니다.'),
 ('BestEffort가 되어 가장 먼저 축출됩니다.','BestEffort가 되어 자원 압박에 취약해집니다.'),
 ('아무 requests·limits도 없어 노드 압박 시 가장 먼저 축출되는 파드','CPU·메모리 requests와 limits가 모두 없는 파드'),
 ('설정이 엄격할수록 높은 등급이며, 아무 설정이 없는 파드가 가장 먼저 축출된다.','등급은 request·limit 설정으로 구분합니다. 실제 축출 순위는 사용량·우선순위 등을 함께 고려합니다.')]:replace('1|13|1',old,new,required=False)
put('1|13|1','screens.7.data.rows.0.2','request·limit이 명확하지만 축출 면제는 아님')
put('1|13|1','screens.7.data.rows.1.2','request 초과 여부와 Pod 우선순위 등을 함께 고려')
put('1|13|1','screens.7.data.rows.2.2','request가 없어 압박에 취약; 고정된 최우선 순서는 아님')
replace('1|13|1','어떤 파드를 먼저 내보내는지 결정한다는 점','축출 판단에 어떻게 연관되는지')
note('1|11|4','2026-10 기준: Google Cloud는 2026-11-13부터 Gemini 4의 완료 출력이 32K 토큰을 넘으면, 이후 클라이언트·서버 시간 초과로 실패하더라도 회수 가능한 토큰 사용량에 과금한다고 예고했습니다. HTTP 200만 과금한다는 일반 안내의 예외입니다.')
for k in ['1|16|2','2|7|5|2']:
    note(k,'Google DeepMind FSF는 2026-04-17 v3.1에서 일부 영역에 추적 능력 수준(TCL)을 추가했습니다. CCL만 있는 체계로 읽지 말고 두 수준의 목적과 적용 영역을 구분하세요.')
for k in ['1|16|0']+[k for k in lessons if k.startswith('2|10|0|')]:
    note(k,'정책 기준일: 2026-10-23. 현재 적용 중인 판과 시행 예정 판을 구분하세요. Anthropic은 2026-11-12 시행판을 공개했으므로, 실제 운영 전에는 시행일과 고위험 분야·공개 의무의 변경을 다시 확인해야 합니다.')
note('2|1|0|0','이 레슨의 GPT-5.6 Sol 사례는 당시 모델·제품·플랜의 차이를 설명하는 출시 사례입니다. 최신 기본 모델 목록으로 읽지 말고, 2026-10 현재의 Chat·Work·Codex별 가용 모델과 관리자 설정을 별도로 확인하세요.')
replace('2|1|0|0','은퇴하지만','은퇴했지만',required=False)
replace('1|12|2','Amazon Bedrock과 Google Cloud는 자체 종료 일정을 정하므로','Amazon Bedrock과 Google이 관리하는 Google Cloud 제공 경로는 자체 종료 일정을 정하므로',required=False)
note('1|12|0','2026-10 기준 Google Cloud의 Claude는 Google 관리 경로와 Anthropic 관리 경로가 구분됩니다. 아래 Agent Platform·anthropic_version 예시는 Google 관리 경로이며, 운영 주체와 종료 일정은 실제 계약·접속 경로별로 확인합니다.')
for name,data in files.items():
    if name!='final1.json':(BASE/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
auditfile.write_text(json.dumps({'date':'2026-10-23','changes':changes},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Cumulative',len(changes),'fields;',len(set(c['lesson'] for c in changes)),'lessons')
