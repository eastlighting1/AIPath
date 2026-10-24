"""Explicit, reviewable corrections to authored lessons. Run once per source revision."""
import json, pathlib, re, copy
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'content/learning'
files={n:json.loads((BASE/n).read_text(encoding='utf-8')) for n in ['final1.json','final2.json','curriculum1-final.json']}
lessons={**files['final2.json'],**files['curriculum1-final.json']['lessons']}
auditfile=BASE/'corrections-20261023.json'
changes=json.loads(auditfile.read_text(encoding='utf-8'))['changes'] if auditfile.exists() else []
def put(key,path,value,reason='content correction'):
    obj=lessons[key]; bits=path.split('.')
    for b in bits[:-1]:obj=obj[int(b)] if isinstance(obj,list) else obj[b]
    b=int(bits[-1]) if isinstance(obj,list) else bits[-1]
    old=copy.deepcopy(obj[b])
    if old==value:return
    obj[b]=value;changes.append(dict(lesson=key,path=path,before=old,after=value,reason=reason))
def replace(key,old,new,reason='content correction',required=True):
    found=[]
    def visit(o,p=''):
        if isinstance(o,str):
            if old in o:found.append((p,o.replace(old,new)))
        elif isinstance(o,dict):
            for k,v in o.items():
                if k!='docs':visit(v,f'{p}.{k}' if p else k)
        elif isinstance(o,list):
            for i,v in enumerate(o):visit(v,f'{p}.{i}')
    visit(lessons[key])
    if required and not found:assert new in json.dumps(lessons[key],ensure_ascii=False),(key,old)
    for p,v in found:put(key,p,v,reason)

replace('2|0|4|2','25분이 줄었으니 작업당 시간이 3분의 1 이하가 되었습니다.','25분, 즉 62.5%가 줄어 도입 전 시간의 37.5%가 남았습니다.','40 → 15 arithmetic')
replace('2|0|0|2','그 대가로 토큰은 모델이 글을 나눠 처리하는 단위입니다. 생각에 쓴 토큰은','이 과정에는 추가 자원이 듭니다. 생각에 쓴 토큰은')
replace('2|0|0|2','생각을 많이 할수록 정확도는 오르지만 시간과 비용이 늘어납니다.','추론을 늘리면 어려운 문제의 정확도를 높일 수 있지만, 개선이 보장되지는 않으며 시간과 비용이 늘어납니다.')
put('2|0|1|4','screens.6.data.items.0.answer','피드백은 "친구에게 말하듯, 존댓말로 부드럽게 바꿔 줘. 대상과 장점은 그대로"였습니다. 수정본은 "점심시간이 10분이나 늘어나요. 줄 서지 마시고 미리 예약한 도시락을 받아 가세요!"(46자)입니다. 어조는 나아졌지만 두 문장이고 40자를 넘습니다. 어조만 바꾸려다가 문장 수와 길이 기준을 놓친 것입니다.')
copyline='줄 서지 않고 도시락을 받아 점심시간 10분을 아끼세요.'
assert len(copyline)<=35
put('2|0|1|4','screens.6.data.items.1.answer',f'이번에는 "점심시간을 아낀다는 장점과 존댓말은 유지하고, 한 문장·35자 이내로 다듬어 줘"라고 요청했습니다. 수정본은 "{copyline}"({len(copyline)}자)입니다. 장점을 유지하면서 문장 수와 길이 조건을 함께 바로잡았습니다.')
replace('1|17|3','둘 다 Enterprise 플랜 기능입니다.','IP 허용 목록은 Enterprise 기능이며, 테넌트 제한은 Enterprise 플랜과 Console 조직에서 사용할 수 있습니다.')
replace('2|1|3|2','새 플러그인과 앱은 기본적으로 비활성화되어 있고 관리자가 가용성을 바꿀 수 있습니다.','새 플러그인과 앱은 Enterprise·Edu에서 기본 비활성화, Business에서 기본 활성화되며 관리자가 가용성을 바꿀 수 있습니다. 사용할 수 있다는 것과 개인 계정 연결·동작 승인은 별개입니다.')
replace('1|7|3','세션 중에 바꿀 수 있는 것은 도구와 MCP 서버 설정뿐입니다.','도구와 MCP 서버 설정은 유휴 세션에서 갱신할 수 있고, 생성 시 붙인 예산도 변경하거나 제거할 수 있습니다.')
replace('1|8|3','프로토콜을 구현한 HTTP 엔드포인트로 요청을 처리하는 원격 에이전트입니다.','선택한 프로토콜 바인딩의 엔드포인트로 요청을 처리하는 원격 에이전트입니다.')
replace('1|8|3','전송은 HTTP(S)로 하고 요청과 응답의 페이로드는 JSON-RPC 2.0을 씁니다.','A2A v1.0은 JSON-RPC, gRPC, HTTP+JSON 바인딩을 지원합니다. JSON-RPC 바인딩은 HTTP(S) 위에서 JSON-RPC 2.0 메시지를 사용합니다.')
replace('1|8|3','A2A의 모든 요청과 응답에 쓰이는 페이로드 형식입니다','A2A의 JSON-RPC 바인딩에서 쓰이는 메시지 형식입니다')
put('2|4|3|0','screens.2.data.rows.3.1','Anthropic API의 입력·출력은 기본적으로 수신·생성 후 30일 이내에 삭제합니다. Files API, 별도 계약, 정책 집행·법률상 보존 등은 예외이며, ZDR은 별도의 적용 조건을 확인해야 합니다.')
replace('2|5|0|0','예를 들어 `*.md`라고 적으면 확장자가 `.md`인 파일이 모두 제외됩니다.','`*.md`는 컨텍스트 루트의 Markdown 파일을 제외하고, 하위 폴더까지 제외하려면 `**/*.md`를 사용합니다.')
replace('2|5|0|0','`.git`, `notebooks/`, `*.md`','`.git`, `notebooks/`, `**/*.md`',required=False)
put('2|5|2|2','screens.4.data.notes.3.note','region 값을 함수 인수로 넘깁니다. 타입이 다르면 변환이 개입합니다. 변환할 수 없는 문자열은 ANSI 모드가 꺼져 있으면 NULL이 될 수 있지만, ANSI 모드가 켜져 있으면 오류가 납니다. 두 경우 모두 의도한 행 정책이 아니므로 타입을 맞춰야 합니다.')
replace('2|5|2|2','다음 설정을 줄 단위로 읽습니다.','ANSI 모드를 끄고 region에 NULL 또는 \'KR\' 같은 비숫자 문자열만 들어 있는 예제로 다음 설정을 읽습니다.')
replace('2|5|2|2',"'KR' 같은 문자열 값은 INT로 바뀌지 못해 NULL이 되고,", "이 예제처럼 ANSI 모드가 꺼져 있으면 'KR' 같은 비숫자 문자열은 INT 변환에 실패해 NULL이 되고,")
replace('2|5|2|2','필터가 동작하지 않은 것이 아니라 입력이 조용히 바뀐 것이 원인입니다.','ANSI 모드를 켜면 같은 변환은 오류를 냅니다. 숫자로 변환 가능한 문자열까지 모두 NULL이 되는 것은 아닙니다.')
replace('2|5|2|2','다음 필터를 STRING 컬럼 region에 연결했더니','ANSI 모드를 끄고 region에 NULL 또는 비숫자 문자열만 있는 상황에서 다음 필터를 STRING 컬럼 region에 연결했더니')
put('2|5|2|2','checks.1.explain','이 문제는 ANSI 모드가 꺼져 있고 region이 NULL 또는 비숫자 문자열인 경우입니다. INT 변환에 실패한 값이 NULL이 되어 IS NULL이 TRUE가 됩니다. ANSI 모드가 켜져 있으면 오류가 나며, 숫자 문자열은 INT로 변환될 수 있습니다. 함수 인수를 STRING으로 맞춰야 합니다.')
put('2|5|2|2','misconceptions.3.fact','타입이 다르면 암묵적 변환이 개입합니다. 잘못된 변환은 ANSI 모드에 따라 오류 또는 NULL을 만들 수 있으므로, 함수 인수 타입과 컬럼 타입을 맞추고 결과를 확인합니다.')
put('2|5|4|3','screens.3.data.rows.3.1','사용자별 크레딧 한도. 쿼터 하나는 웨어하우스 또는 AI 영역 중 한쪽을 추적')
put('2|5|4|3','screens.3.data.rows.3.2','AI 영역만 사용 차단 가능; 웨어하우스는 추적·알림')
put('2|6|1|4','screens.2.data.notes.0.note','Agent는 하위 에이전트를 호출하는 도구입니다. allowed_tools는 도구의 존재 여부가 아니라 자동 승인 규칙을 정합니다. Agent를 목록에서 뺀 것만으로 위임 기능이 사라지지는 않습니다.')
replace('2|6|2|4','좌표는 0~1000','좌표는 0~999')
for k in ['2|6|0|4','2|6|0|0']:
    replace(k,'대부분의 응용','많은 응용',required=False)
    replace(k,'대부분의 단순한 응용','많은 단순한 응용',required=False)
put('2|3|2|1','screens.3.data.marks.3.note','한 user 메시지에서는 모든 tool_result 블록을 text보다 먼저 둡니다. text를 앞에 두면 API 형식 오류(400)가 날 수 있습니다. 결과를 여러 user 메시지로 나눌 때 생기는 병렬 호출 문제와 구분하세요.')
put('2|3|2|1','misconceptions.3.fact','tool_result는 같은 user 메시지의 text보다 먼저 와야 합니다. 이 순서는 API 요청 형식의 요구사항이며, 어기면 400 오류가 납니다.')
replace('2|7|1|0','지원 범위는 ADK로 만든 에이전트로 한정됩니다.','인라인 ingress 보호는 ADK 에이전트로 한정됩니다. 이것이 Model Armor 전체의 제한은 아니며, egress 보호에는 MCP 서버·OpenAI 형식 서비스·A2A 트래픽도 포함됩니다.')
replace('2|7|1|0','서비스와 그룹, 조직 단위로','사용자·RBAC 그룹·조직 범위로')
replace('2|7|1|0','한 서비스가 일일 지출 한도를 넘었다','한 사용자가 자신에게 적용된 일일 지출 한도를 넘었다')
replace('2|7|1|0','서비스·그룹별 지출 한도 설정','사용자·RBAC 그룹·조직 범위의 사용자별 지출 한도 설정')
replace('2|7|1|0','초과하면 게이트웨이가 429를','그룹·조직 설정은 공동 지출 풀이 아니라 사용자별 기본 한도입니다. 초과하면 게이트웨이가 429를')
put('2|6|3|2','screens.2.data.notes.1.note','ask 규칙은 해당 명령을 자동 승인하지 않습니다. dontAsk 모드에서는 확인창을 띄우지 않고 거부합니다. 다른 모드에서는 해당 승인·검토 경로를 따릅니다.')
replace('2|9|2|3','Claude 플랫폼과 OpenAI Responses API는 원격 MCP 서버를 `server_url`로 연결하는 방식을 제공하므로','Claude는 `mcp_servers` 항목의 `url`, OpenAI Responses API는 `server_url`로 원격 MCP 서버 주소를 지정하므로')
replace('2|9|4|0','범위와 규칙이 시나리오보다 먼저 정해져야 시도가 안전하게 진행됩니다.','시나리오 초안을 만들더라도 실제 시도를 실행하기 전에는 범위와 규칙을 확정해야 합니다.')
replace('2|9|4|0','범위와 규칙이 시나리오보다 먼저 정해지고,','범위와 규칙은 시나리오를 실행하기 전에 확정하며,')
replace('2|9|0|2','보증과 거버넌스 통제는 특정 위험에 묶이지 않고 모든 위험과 모든 단계에 공통으로 적용됩니다.','보증과 여러 거버넌스 통제는 폭넓게 적용됩니다. 다만 사용자 정책·교육처럼 위험에 따라 적용 범위가 달라지는 항목도 있으므로 개별 통제의 대응표를 확인합니다.')
replace('2|9|0|2','보증과 거버넌스 통제는 모든 위험에 공통이므로, 이 표의 모든 행에 붙는 기본값으로 둡니다.','보증·거버넌스 통제도 항목별 적용 범위를 확인해 필요한 행에 연결합니다.')
replace('2|9|0|2','보증과 거버넌스 통제는 모든 위험에 공통으로 적용되고,','보증과 거버넌스 통제는 항목별 적용 범위를 확인하며,')
replace('2|9|0|2','보증과 거버넌스 통제는 모든 위험에 공통으로 적용됩니다.','보증·거버넌스 통제의 폭넓은 적용과 사용자 정책·교육 등의 위험별 차이를 구분합니다.')
replace('2|8|4|3','정정이 필요하면 Databricks는 레코드를 두 개 추가합니다.','정정할 때 RETRACTION과 RESTATEMENT를 추가하기도 하고, 잘못된 사용량을 취소하는 RETRACTION만 추가하기도 합니다.')
replace('2|8|4|3','정정 후 값만 남습니다.','대체 값이 있으면 그 값만 남고, 취소만 한 경우에는 해당 사용량이 상쇄됩니다.')
replace('2|5|1|2','노드의 자원이 부족해지면 쿠버네티스는 파드를 QoS 클래스에 따라 순서대로 퇴출합니다.','노드 압박 시 kubelet은 해당 자원의 request 초과 여부, Pod 우선순위, request 대비 사용량을 고려해 퇴출 순위를 정합니다.')
replace('2|5|1|2','노드가 압박을 받으면 `BestEffort` 파드를 모두 퇴출한 뒤에야 대상이 됩니다.','노드 압박 시에는 request 초과 여부와 Pod 우선순위 등을 함께 보므로, QoS 클래스만으로 퇴출 순서를 단정할 수 없습니다.')
put('2|5|1|2','screens.3.data.tabs.2.body','CPU와 메모리의 request와 limit이 전혀 없는 파드는 `BestEffort`입니다. 남은 자원을 사용할 수 있지만, request가 없어 자원을 사용하면 request를 초과하게 됩니다. 따라서 노드 압박에 취약하며, 실제 퇴출 순위는 자원별 사용량과 Pod 우선순위 등으로 결정됩니다.')
replace('2|5|1|2','노드 자원이 부족할 때 `BestEffort`, `Burstable`, `Guaranteed` 순으로 퇴출 대상이 됩니다.','실제 노드 압박 퇴출 순위는 request 초과 여부·Pod 우선순위·상대 사용량을 함께 보며 QoS 순서만으로 정하지 않습니다.')
put('2|5|1|2','checks.1.explain','QoS 클래스는 request와 limit의 설정으로 결정됩니다. 다만 노드 압박 시 퇴출은 request 초과 여부, Pod 우선순위, 상대 사용량을 함께 보므로 세 클래스의 고정 순서로 단정하지 않습니다.')

def save():
    for name,data in files.items():
        if name=='final1.json':continue
        (BASE/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (BASE/'corrections-20261023.json').write_text(json.dumps({'date':'2026-10-23','changes':changes},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

if __name__=='__main__':
    save()
    print(f'Updated {len(changes)} fields in {len(set(c["lesson"] for c in changes))} lessons')
