import pathlib
exec(pathlib.Path(__file__).with_name('correct-learning-20261023.py').read_text(encoding='utf-8').split("replace('2|0|4|2'")[0])
def setfields(k,values):
    for p,v in values.items():put(k,p,v,'RSP v3.4, current versus historical policy')
rsp='2026-10 기준 RSP v3.4는 위험 완화 조치, Frontier Safety Roadmap, Risk Reports를 함께 읽는 정책입니다. 과거 ASL 단계 설명만으로 현재의 모든 훈련·배포 조건을 단정하지 않습니다.'
topics='화학·생물 위험, 자동화된 연구개발, 고위험 오정렬 등'
for k in ['2|0|4|3','1|16|2','2|7|5|2','2|7|5|3','2|10|4|1','2|10|4|2','2|10|4|3']:
    lead=lessons[k]['screens'][0].get('lead','')
    if rsp not in lead:put(k,'screens.0.lead',lead+'\n\n'+rsp,'RSP version scope')
setfields('2|0|4|3',{
 'screens.2.data.rows.2.2':topics,
 'screens.2.data.rows.3.2':'위험 완화 조치와 안전 로드맵·위험 보고서',
 'screens.2.data.rows.4.2':'현재 정책의 조치·목표·위험 판단을 구분해 공개',
 'glossary.1.def':'Anthropic의 위험 거버넌스 정책입니다. 적용 버전과 구체적인 조치·목표를 구분해서 읽습니다.'})
replace('2|0|4|3','Anthropic 소개글은 자율적 AI 연구개발과 화학·생물·방사능·핵 무기 분야에서 임계치를 정해 이를 넘으면 더 강한 보안과 배포 안전장치를 요구한다고 밝힙니다.','Anthropic은 현재 RSP의 위험 범주와 조치, 공개 보고서를 기준으로 판단해야 합니다.')
replace('2|0|4|3','세 회사는 용어가 달라도 측정, 임계치, 안전장치라는 같은 뼈대를 쓰므로 비교해서 읽을 수 있습니다.','세 회사를 측정·완화·판단·공개라는 질문으로 비교하되, 의무와 목표의 강도가 같다고 가정하지 않습니다.')
replace('2|0|4|3','이름은 다르지만 위험 영역을 정하고, 능력을 측정하고, 임계치에 이르면 더 강한 안전장치를 거는 같은 뼈대를 씁니다.','위험을 평가하고 대응을 설명하지만, 구체적인 임계 조건과 의무·목표는 서로 다릅니다.')
setfields('1|16|2',{
 'screens.3.data.steps.0.body':rsp,
 'screens.3.data.steps.2.title':'위험 평가와 완화 조치',
 'screens.3.data.steps.2.body':'어떤 위험을 어떤 증거로 평가하고 대응하는지 확인합니다. 위험 이름이 비슷해도 과거 버전의 범주와 현재 버전의 범주를 그대로 대응시키지 않습니다.',
 'screens.3.data.steps.3.title':'안전 로드맵과 약속의 구분',
 'screens.3.data.steps.3.body':'로드맵의 목표와 정책상 요구 조치를 구분합니다. 개선 목표를 곧바로 일괄적인 훈련·배포 중단 의무로 읽지 않습니다.',
 'screens.5.data.rows.1.1':topics,
 'screens.5.data.rows.1.2':'위험 완화 조치·안전 로드맵·위험 보고서',
 'screens.8.data.cards.1.back':'대응을 바꾸는 조건을 묻습니다. OpenAI의 High·Critical, Google DeepMind의 CCL과 Anthropic의 현재 정책상 조건을 구분해 읽습니다.',
 'screens.9.data.paragraphs.0':'세 프레임워크를 위험 식별, 평가, 완화, 판단과 공개라는 같은 질문으로 비교합니다. OpenAI의 High·Critical, Google DeepMind의 CCL, Anthropic RSP의 조치·로드맵·보고서는 서로 같은 단계표가 아닙니다.',
 'checks.1.q':'제공사와 이 수업에서 살펴본 정책 요소를 연결해 보세요.',
 'checks.1.right.0':'위험 완화 조치·안전 로드맵·위험 보고서',
 'checks.1.explain':'각 정책의 용어와 의무 수준은 다릅니다. 현재 버전에서 무엇이 요구사항이고 무엇이 목표인지 구분합니다.'})
setfields('2|7|5|2',{
 'screens.2.data.cards.2.back':rsp,
 'screens.2.data.cards.4.back':'위험 평가와 대응을 배포 판단에 연결한다는 질문은 공통입니다. 하지만 조치의 강제성, 검토 주체와 공개 절차까지 같다고 가정하면 안 됩니다.',
 'screens.3.data.rows.0.2':'현재 RSP의 화학·생물 위험별 기준과 완화 조치를 확인',
 'screens.3.data.rows.2.2':'자동화된 연구개발 위험의 평가와 대응을 확인',
 'screens.3.data.rows.3.2':'고위험 오정렬 관련 평가와 완화 조치를 확인',
 'screens.3.data.notes':'Anthropic 열은 RSP v3.4 기준입니다. 과거 CBRN·ASL-4 설명을 현행 분류에 그대로 적용하지 않습니다. 같은 이름이 없는 항목은 위험이 없다는 뜻이 아니므로 원문의 분류와 적용 범위를 따로 확인합니다.',
 'screens.4.data.items.2.body':'접근 제한과 이용 조건은 업무 설계의 제약으로 기록합니다. 회사별 정책의 요구사항과 목표를 구분하고, 해당 모델에 실제로 적용되는 조치와 제공 범위를 확인합니다.',
 'checks.0.right.2':'위험 완화 조치·안전 로드맵·위험 보고서를 함께 읽는다',
 'glossary.1.def':'Anthropic의 위험 거버넌스 정책입니다. 현재 버전의 조치·목표·공개 보고서를 구분해 읽습니다.'})
replace('2|7|5|2','Anthropic도 적절한 안전·보안 조치를 갖추지 않으면 모델을 학습하거나 배포하지 않겠다는 약속을 유지한다고 밝힙니다.','Anthropic은 현행 RSP와 위험 보고서의 판단을 별도로 확인해야 합니다.')
setfields('2|7|5|3',{
 'screens.3.data.rows.1.1':'현재 RSP의 위험 평가·완화 조치·보고서',
 'screens.3.data.rows.1.2':'정책 버전과 보고서에서 판단 근거를 확인',
 'screens.3.data.rows.1.3':'현행 조치·목표를 구분하며 과거 ASL 일괄 조건으로 단정하지 않음',
 'screens.3.data.notes':'세 회사의 절차가 동일한 단일 게이트라는 뜻은 아닙니다. 조직은 각 제공사의 평가와 통제를 참고하되, 자체 출시 승인자와 평가·안전·운영 기준을 명시해야 합니다.'})
setfields('2|10|4|1',{
 'screens.2.data.cards':[
  {'front':'비례적 보호','back':'잠재적 위험에 맞춰 대응을 설계하는 원칙입니다. 현재 정책의 요구사항과 앞으로 개선하려는 목표는 구분해서 읽습니다.'},
  {'front':'과거 ASL 체계','back':'이전 버전에서 안전·보안 수준을 설명하던 틀입니다. 현행 정책 전체를 과거 단계표로 대체해서는 안 됩니다.'},
  {'front':'위험 완화 조치','back':'어떤 위험을 어떤 조건에서 낮추는지 구체적으로 확인합니다. 명칭보다 적용 대상·조건·검증 근거가 중요합니다.'},
  {'front':'Frontier Safety Roadmap','back':'위험 완화를 개선하기 위한 목표와 진행 상황을 읽습니다. 목표의 변경과 정책상 의무를 구분합니다.'},
  {'front':'Risk Reports','back':'모델과 활동의 위험, 완화 조치와 판단 근거를 살펴봅니다. 대상 모델과 기준일을 먼저 확인합니다.'}],
 'screens.3.lead':'현재 정책을 읽는 순서와 과거 버전을 비교할 때 주의할 점을 확인하세요.',
 'screens.3.data.tabs':[
  {'label':'현재 버전','body':'2026-10 기준 현행 문서는 RSP v3.4입니다. v3.0의 전면 개편 이후 구조를 기준으로 읽고, 이전 버전의 설명은 역사적 맥락으로 구분합니다.'},
  {'label':'위험과 조치','body':'위험 이름을 외우기보다 대상 능력, 평가 근거, 적용 조건과 대응을 표로 연결해 읽습니다.'},
  {'label':'보안과 배포','body':'가중치 보호 같은 보안 통제와 사용자 접근·모니터링 같은 배포 통제를 나누어 확인합니다.'},
  {'label':'로드맵과 보고서','body':'로드맵에서 개선 목표를, 위험 보고서에서 평가와 판단 근거를 읽습니다. 두 문서를 같은 성격의 약속으로 취급하지 않습니다.'},
  {'label':'과거 문구 비교','body':'과거의 ASL 설명이나 일괄 중단 약속을 현행 규칙이라고 인용하지 않습니다. 비교할 때에는 문서의 버전과 시행일을 함께 기록합니다.'}],
 'screens.6.data.paragraphs.0':rsp,
 'screens.6.data.callout.text':'버전·시행일·적용 범위·의무와 목표를 함께 기록하세요.',
 'checks.0.left':['비례적 보호','위험 완화 조치','Frontier Safety Roadmap','Risk Reports'],
 'checks.0.right':['모델·활동의 위험과 완화 조치 및 판단 근거를 설명','특정 위험을 낮추기 위해 적용하는 대응','위험에 맞춰 대응 강도를 설계하는 원칙','안전 개선 목표와 진행 상황을 확인하는 문서'],
 'checks.0.explain':'비례적 보호는 원칙, 완화 조치는 대응, 로드맵은 개선 목표, 위험 보고서는 평가와 판단 근거를 읽는 요소입니다.',
 'checks.0.incorrectFeedback':'원칙·대응·목표·판단 근거를 구분해 다시 연결해 보세요.',
 'glossary.1.def':'과거 정책의 안전·보안 수준을 설명하던 용어입니다. 현재 조치의 적용 범위는 현행 RSP에서 확인해야 합니다.',
 'closing.points.1':'현재 RSP의 조치·로드맵·위험 보고서를 구분한다.',
 'closing.points.2':'과거 ASL 설명을 현재 전체 정책과 동일시하지 않는다.'})
replace('2|10|4|1','정책 문서의 현재 문구가 아니라 안전 수준과 임계치 개념을 기준으로','정책의 현재 버전과 실제 적용 조건을 확인해')
replace('2|10|4|1','능력 임계치와 안전 수준이라는 개념이 변하지 않는 기준입니다.','개념뿐 아니라 현재 문구와 적용 조건을 함께 확인해야 합니다.')
replace('2|10|4|1','문구보다 개념을 기준으로 삼아야 합니다.','개념과 현재 적용 조건을 함께 확인해야 합니다.')
setfields('2|10|4|2',{
 'screens.4.data.rows.1.2':'위험 완화 조치·안전 로드맵·위험 보고서',
 'screens.4.data.rows.2.2':topics,
 'screens.4.data.rows.4.2':'현재 정책의 구체적인 조치와 위험 판단을 확인',
 'checks.0.right.2':'위험 완화 조치·안전 로드맵·위험 보고서'})
setfields('2|10|4|3',{
 'screens.2.data.items.1.title':'Anthropic: 현재 정책과 위험 판단을 확인한다',
 'screens.2.data.items.1.body':rsp})

for name,data in files.items():
    if name!='final1.json':(BASE/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
auditfile.write_text(json.dumps({'date':'2026-10-23','changes':changes},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Cumulative',len(changes),'fields;',len(set(c['lesson'] for c in changes)),'lessons')
