import importlib.util, pathlib, json, re, ast
spec=importlib.util.spec_from_file_location('corrections',pathlib.Path(__file__).with_name('correct-learning-20261023.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
put,replace,D=m.put,m.replace,m.lessons
def note(k,text):
    body=D[k]['opening']['body']
    if text not in body:put(k,'opening.body',body+[text],'dated availability / version scope')
    lead=D[k]['screens'][0].get('lead','')
    if text not in lead:put(k,'screens.0.lead',lead+'\n\n'+text,'dated availability / version scope')

code='''from google.adk.agents import LlmAgent, LoopAgent, SequentialAgent
from google.adk.tools.tool_context import ToolContext

# MODEL에는 이 환경에서 지원되는 모델 ID를 지정합니다.
def exit_loop(tool_context: ToolContext):
    tool_context.actions.escalate = True
    return {}

initial_writer = LlmAgent(
    name="InitialWriter", model=MODEL,
    instruction="사용자 요청에 맞춰 근거, 길이, 어조 기준을 지킨 초안을 쓴다.",
    output_key="current_document",
)
critic = LlmAgent(
    name="Critic", model=MODEL,
    instruction="{current_document}를 근거, 길이, 어조 기준으로 검토한다. "
                "충족하면 exit_loop를 호출하고, 아니면 수정할 점을 적는다.",
    tools=[exit_loop], output_key="criticism",
)
writer = LlmAgent(
    name="Writer", model=MODEL,
    instruction="{criticism}을 반영해 {current_document}를 고쳐 쓴다.",
    output_key="current_document",
)
refine = LoopAgent(name="Refine", sub_agents=[critic, writer], max_iterations=5)
root_agent = SequentialAgent(name="DraftAndRefine", sub_agents=[initial_writer, refine])'''
ast.parse(code)
put('1|7|1','screens.4.data.code',code,'initialize state before LoopAgent')
put('1|7|1','screens.4.data.notes',[
 {'lines':'5-7','note':'종료 도구는 escalate로 반복을 끝냅니다.'},
 {'lines':'9-13','note':'초기 작성자가 먼저 current_document를 만듭니다. MODEL은 사용 환경에 맞는 모델 ID 변수입니다.'},
 {'lines':'14-19','note':'루프에서는 비평가가 먼저 실행되어 criticism을 기록합니다. 기준을 충족하면 종료 도구를 호출합니다.'},
 {'lines':'20-24','note':'개선자는 이미 기록된 초안과 비평을 읽어 문서를 수정합니다. 첫 반복에도 두 상태 키가 존재합니다.'},
 {'lines':'25-26','note':'초기 작성 → 비평 → 개선 순서입니다. 최대 5회 반복은 종료 신호가 나오지 않을 때의 상한이며, 평가에는 테스트·근거 같은 확인 가능한 신호가 필요합니다.'}])

rights='일반적인 스칼라 AI 함수는 계정의 USE AI FUNCTIONS 또는 해당 함수의 USE AI FUNCTION 권한과 적절한 데이터베이스 역할을 함께 확인합니다. AI_FUNCTIONS_USER는 스칼라 함수용이며 집계 함수는 별도로 봅니다. 현재 공식 안내는 USE AI FUNCTIONS가 있으면 CORTEX_USER 없이도 AI_AGG·AI_SUMMARIZE_AGG를 사용할 수 있는 예외를 명시합니다.'
put('1|5|4','screens.2.data.notes.4.note',rights)
put('1|5|4','screens.3.data.tabs.4.body','AI_COMPLETE·AI_CLASSIFY·AI_FILTER는 스칼라 함수이고 AI_AGG는 텍스트 열의 집계 함수입니다. 지역별 가용성과 함수별 권한 조건을 확인하세요. 집계 함수까지 동일한 데이터베이스 역할 규칙으로 단정하지 않습니다.')
put('1|5|4','misconceptions.1.fact','관리자는 PUBLIC의 포괄 권한을 회수하고 필요한 역할에 함수별 권한을 부여할 수 있습니다. 스칼라·집계 함수의 역할 조건은 다르므로 실제 호출 함수의 요구사항을 확인합니다.')
replace('1|5|4','AI 함수는 USE AI FUNCTIONS 권한과 데이터베이스 역할이 필요하고','AI 함수는 함수별 계정 권한·데이터베이스 역할 조건을 확인하고')

replace('1|0|0','Anthropic 문서는 분석이나 선택형 작업에는 temperature를 0.0에 가깝게, 창의적인 작업에는 1.0에 가깝게 쓰라고 안내합니다. 하지만 같은 문서는 temperature가 0.0이어도 결과가 완전히 결정적이지는 않다고 밝힙니다.','샘플링 값을 받는 모델에서는 낮은 temperature로 다양성을 줄일 수 있지만 완전히 결정적인 결과를 보장하지는 않습니다. 2026-10 기준 Claude Opus 4.7·4.8, Sonnet 5, Haiku 5.5 등은 비기본 샘플링 값을 거부할 수 있으므로 해당 파라미터를 보내기 전에 모델·SDK 지원 여부를 확인해야 합니다.')
replace('1|0|0','API로 모델을 호출하면서 같은 답을','temperature 조절을 지원하는 모델의 API로 같은 답을')
replace('1|0|0','API의 temperature 같은 설정으로','이를 지원하는 모델에서는 API의 temperature 같은 설정으로')
replace('1|1|2','Anthropic 문서는 일부 모델에서는 마지막 assistant 메시지를 미리 채우는 요청을 받지 않는다고 안내하고','Claude 4.6 이후 모델과 Mythos Preview는 마지막 assistant 턴의 프리필을 지원하지 않으며')
replace('1|1|2','이렇게 표 머리글까지 적어 두고 이어 쓰게 하면, 세 번 돌려도 같은 열을 가진 표가 나옵니다.','프리필을 지원하는 모델에서는 이런 머리글로 시작을 유도할 수 있지만, 같은 열의 출력을 보장하지는 않습니다.')
replace('1|1|2','예시와 프리필로 구조를 고정','예시·구조화 출력으로 구조를 고정')
replace('1|1|2','처방은 응답의 첫머리, 즉 표 머리글까지 미리 채워 두고 이어 쓰게 하는 프리필입니다.','처방은 열 이름을 예시와 출력 스키마로 명시하는 것입니다. 프리필은 이를 지원하는 모델에서만 보조 수단으로 씁니다.')
replace('1|1|2','형식 정의와 프리필로 모양을 고정','형식 정의와 지원되는 구조화 출력으로 모양을 고정')
replace('1|1|2','형식 지시와 예시, 프리필로 구조를 고정','형식 지시와 예시, 지원되는 구조화 출력으로 구조를 고정')
replace('1|1|2','출력 형식은 템플릿, 예시, 프리필로 고정합니다.','출력 형식은 템플릿·예시·구조화 출력으로 정하고, 프리필은 모델 지원 여부를 확인합니다.')
replace('2|3|0|3','응답 시작 부분을 prefill로 미리 채우기','지원 모델에서만 응답 시작을 prefill로 채우기(Claude 4.6 이후는 구조화 출력·형식 지시 사용)')
forced='2026-10 기준: Claude Opus 5.5·Sonnet 5.5·Fable 5.1·Mythos 5.1은 tool_choice의 any/tool을 400 오류로 거부합니다. auto와 strict 도구 입력 검증을 사용하되, strict가 호출 자체를 강제하지는 않습니다. 아래 네 값 비교는 강제 호출을 지원하는 모델에 한합니다.'
for k in ['1|4|0','2|3|2|0']:note(k,forced)
replace('1|4|0','들어오는 모든 고객 문의를','any/tool 강제 호출을 지원하는 모델에서 들어오는 모든 고객 문의를')
replace('1|4|0','내일 서울 날씨 알려줘','오늘 서울 날씨 알려줘',required=False)
replace('1|10|1','낯선 코드를 다룰 때 알맞은 안전한 기본값입니다.','낯선 코드를 직접 검토할 때 선택할 수 있는 보수적인 모드입니다. 최신 대화형 터미널·VS Code의 시작 모드는 auto이며, headless·SDK·관리 설정 등은 다를 수 있습니다.')
replace('1|7|4','질문에서 멈춥니다','승인 경로가 없으면 거부되어 작업이 막힙니다',required=False)
replace('1|7|4','질문에 멈출 수 있습니다','승인 경로가 없으면 해당 호출이 거부될 수 있습니다',required=False)
note('1|7|4','2026-10 기준: 일반 개인용 Google CLI 이용은 Antigravity CLI로 전환되었습니다. 아래 Gemini CLI 명령·GEMINI.md 예제는 계속 지원되는 Code Assist Standard·Enterprise 또는 유료 API 키 환경의 기존 도구를 다룹니다.')
for k in ['1|8|2','2|6|0|2']:note(k,'2026-10 기준: 예제의 gemini-2.5-flash는 기존 이용자 중심으로 제공됩니다. 새 프로젝트에서는 현재 접근 가능한 모델 ID를 확인해 교체한 뒤 예제를 실행하세요.')
for k in ['2|8|4|3']:
    replace(k,'RETRACTION의 음수 값이 원래 값을 상쇄하고 RESTATEMENT의 값만 남습니다.','RETRACTION이 원래 값을 상쇄하며, RESTATEMENT가 있을 때에는 그 대체 값이 남습니다.')
    replace(k,'정정은 음수 취소 행과 재작성 행이 함께 합산되어 반영된다.','정정은 음수 취소 행과, 있는 경우 재작성 행을 함께 합산해 반영한다.')
    replace(k,'정정은 음수 취소 행과 재작성 행의 합산으로 반영됩니다.','정정은 취소 행과, 있는 경우 재작성 행을 포함해 합산합니다.')
replace('2|5|4|3','차단이 지출 직후에 적용되므로','차단 평가는 지출 후 수분 내에 이루어지므로')
replace('2|5|4|3','쿼터 차단은 지출 직후에 걸려','쿼터 차단은 요청 시점이 아니라 수분 내 평가 후 적용되어')

evalnote='2026-10 기준: 이 레슨의 OpenAI Evals·grader 예시는 종료 예정 인터페이스를 읽는 사례입니다. 기존 Evals는 10월 31일부터 읽기 전용, 11월 30일 종료 예정이므로 새 평가 파이프라인은 다른 실행 도구로 구성하고 평가 데이터·판정 기준을 이관하세요.'
for k in ['2|6|4|1','2|6|4|2','2|6|4|3','2|3|4|0']:note(k,evalnote)
finenote='2026-10 기준: OpenAI 파인튜닝 실습은 신규 사용자가 실행할 수 없습니다. 자격을 유지한 기존 고객의 작업 생성도 2027-01-06까지입니다. 아래 코드는 데이터 형식과 학습 방식 비교용이며, 실행 전 계정·모델 가용성을 확인하세요.'
for k in ['2|11|2|0','2|11|2|1','2|11|2|2','2|11|2|3']:note(k,finenote)
gptnote='2026-10 기준: Custom GPT는 플러그인으로 이전하는 기능입니다. 아래 GPT 빌더 예시는 기존 워크플로를 이해·이관하기 위한 설명이며 신규 생성 가능 여부와 종료 일정은 워크스페이스 공지를 확인하세요. 지침·지식 파일을 이전한 뒤 사용자 지정 액션과 결과를 별도로 검증해야 합니다.'
gptkeys=['1|2|1']+[k for k,v in D.items() if k.startswith('2|2|') and re.search(r'GPT 빌더|GPT Instructions|GPT 지식|GPT의 Instructions|GPT를 만들',json.dumps(v,ensure_ascii=False))]
for k in gptkeys:note(k,gptnote)
gemnote='2026-10 기준: Gems는 skills로 전환 중입니다. 개인 계정은 2026년 11월부터, Workspace 업무용은 2027년 3월 이후에 전환됩니다. 아래 Gems 화면은 이전 전 환경 기준이며, 지침·파일을 옮긴 뒤 공유와 도구 동작을 다시 확인하세요.'
gemkeys=['1|2|1','2|1|2|1']+[k for k,v in D.items() if k.startswith('2|2|') and re.search(r'Gem은|Gemini에서는|Gem에서|Gems|Knowledge',json.dumps(v,ensure_ascii=False))]
for k in gemkeys:note(k,gemnote)
put('2|8|2|3','screens.3.data.tabs.0.body',"2026-10 기준 CORTEX_MODELS_ALLOWLIST는 폐지 절차에 있습니다. 2026년 8월 이후 새 모델 목록으로 바꿀 수 없고, 'None'으로 설정하는 변경만 허용됩니다. 기존 설정을 RBAC로 이전하는 점검 대상으로 다룹니다.\n\n```sql\nALTER ACCOUNT SET CORTEX_MODELS_ALLOWLIST = 'None';\n```")
note('2|8|2|3','2026-10 기준: 허용 목록은 폐지 예정입니다. 아래 All과 RBAC의 OR 결합 사례는 기존 허용 목록이 적용되는 계정의 이전 점검 사례입니다. 2026_07 변경 번들의 RBAC 전용 동작이 활성화된 계정에는 적용하지 않습니다.')
replace('2|8|2|3','현재 계정은 기본 설정이고 허용 목록은 `All`입니다.','이 사례는 레거시 허용 목록 `All`이 아직 적용되는 기존 계정입니다.')
replace('2|8|2|3','허용 목록이 All 이고 RBAC 로는','레거시 허용 목록이 여전히 적용되는 계정에서 목록이 All 이고 RBAC 로는')
replace('2|8|2|3','새 계정의 기본값이 `All`이므로 이 점을 먼저 확인해야 합니다.','기존 계정의 허용 목록과 변경 번들 적용 여부를 먼저 확인해야 합니다.')
put('2|8|2|3','closing.points.2','신규 모델 접근 제어는 RBAC로 설계하고, 기존 허용 목록의 적용 여부를 확인해 이전한다.')
m.save()
print('Cumulative',len(m.changes),'fields;',len(set(c['lesson'] for c in m.changes)),'lessons')
