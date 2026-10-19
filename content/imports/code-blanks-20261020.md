# 코드 빈칸 채우기 · 36문항 (신규 유형)

공식 SDK·ADK·API 문서의 코드를 지문에 보여 주고 빈칸 \[A\], \[B\]에 들어갈 값을 고르는 문항 유형입니다. 서술형이 아니라 기존과 같은 5지선다 단일 선택이고 채점도 같습니다. 오답 선택지에는 다른 회사 SDK의 이름이나 지원 종료된 방식을 섞었습니다. 코드는 15줄 이내이고 각 문항의 근거 문서 줄에 확인한 SDK 버전을 적었습니다.

| 시험 | 문항 번호 | 문항 수 | 회사 배분 | 도메인 배분 |
| --- | --- | --- | --- | --- |
| ADA | Q01\~Q14 | 14 | OpenAI 5 · Anthropic 5 · Google 4 | ① 2 · ② 3 · ③ 4 · ④ 3 · ⑤ 2 |
| AEP | Q15\~Q26 | 12 | OpenAI 4 · Anthropic 4 · Google 4 | ① 3 · ② 2 · ③ 2 · ④ 2 · ⑤ 2 · ⑥ 1 |
| ASX | Q27\~Q31 | 5 | OpenAI 2 · Anthropic 2 · Google 1 | ② 2 · ③ 2 · ④ 1 |
| MCS | Q32\~Q36 | 5 | OpenAI 1 · Google 4 | ② 2 · ③ 2 · ④ 1 |

기준일은 2026-10-20입니다. 정규 시험 출제 비율 제안은 ADA 6문항, AEP 6문항, ASX 3문항, MCS 3문항입니다.

## Q01. 고객 응대 챗봇의 역할 지시 위치

단일 선택 · 코드 빈칸 · 도메인 1 · L1

Anthropic Python SDK로 Claude Messages API를 호출해 쇼핑몰 고객 응대 챗봇을 만든다. 챗봇의 역할과 말투 지시는 사용자 질문과 분리해 모델에 항상 적용되는 지시로 전달해야 한다.

```python
import anthropic

client = anthropic.Anthropic()
resp = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=512,
    [A]="당신은 Acme 쇼핑몰의 상담원입니다. 항상 존댓말로 답하세요.",
    messages=[{"role": [B], "content": "환불은 어떻게 하나요?"}],
)
print(resp.content[0].text)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `instructions`, \[B\] = `"user"`

B. \[A\] = `system_instruction`, \[B\] = `"user"`

C. \[A\] = `system`, \[B\] = `"user"`

D. \[A\] = `system`, \[B\] = `"developer"`

E. \[A\] = `instructions`, \[B\] = `"developer"`

**정답: C**

**상세 해설**

Claude Messages API는 시스템 지시를 최상위 `system` 파라미터로 받고, `messages` 배열에는 `user`와 `assistant` 역할만 번갈아 넣습니다. 그래서 역할·말투 지시는 `system`에, 사용자 질문은 `role: "user"` 메시지에 둡니다.

A (오답, `instructions`는 OpenAI Responses API의 파라미터 이름입니다): Anthropic SDK의 `messages.create`에는 없는 파라미터입니다.

B (오답, `system_instruction`은 Google GenAI SDK의 `GenerateContentConfig` 필드입니다): Anthropic 서명에 없는 이름이라 TypeError가 납니다.

C (정답): 시스템 지시는 `system`, 사용자 질문은 `"user"` 역할입니다.

D (오답, `developer` 역할은 OpenAI 모델용 메시지 역할입니다): `[A]`는 맞지만 Anthropic `messages`는 `user`/`assistant`만 허용합니다.

E (오답, 두 값 모두 OpenAI 방식입니다): 둘 다 Anthropic API에서는 쓰지 않습니다.

**근거 문서**: Claude API Docs › Messages API › system 파라미터 · Claude API Docs › Prompt engineering › Giving Claude a role with a system prompt (SDK 버전: anthropic 1.15.0)

---

## Q02. 이전 응답을 이어 받는 다중 턴 호출

단일 선택 · 코드 빈칸 · 도메인 1 · L1

OpenAI Python SDK의 Responses API로 두 번 호출한다. 첫 호출에서 사용자가 이름을 알려 주고, 두 번째 호출은 대화 기록을 직접 다시 보내지 않고 서버에 저장된 이전 응답의 맥락을 이어서 답해야 한다.

```python
from openai import OpenAI

client = OpenAI()
first = client.responses.create(
    model="gpt-6-astra",
    input="내 이름은 민수야. 기억해 줘.",
)
second = client.responses.create(
    model="gpt-6-astra",
    input="내 이름이 뭐지?",
    [A]=first.[B],
)
print(second.output_text)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `previous_response_id`, \[B\] = `id`

B. \[A\] = `conversation`, \[B\] = `id`

C. \[A\] = `thread_id`, \[B\] = `id`

D. \[A\] = `previous_response_id`, \[B\] = `output_text`

E. \[A\] = `parent_response_id`, \[B\] = `id`

**정답: A**

**상세 해설**

Responses API는 응답을 기본적으로 저장하고, 다음 요청에 `previous_response_id`로 이전 응답의 `id`를 넘기면 그 응답의 입력과 출력을 맥락으로 이어 받습니다. 값은 응답 객체의 `id` 필드(`resp_...`)입니다.

A (정답): 이전 응답의 `id`를 `previous_response_id`로 전달하는 방식입니다.

B (오답, `conversation`은 별도로 만든 Conversation 객체의 ID(`conv_...`)를 받는 파라미터입니다): 응답 `id`를 넘기는 용도가 아닙니다.

C (오답, `thread_id`는 지원이 종료된 Assistants API의 개념입니다): Responses API에는 없는 파라미터입니다.

D (오답, `output_text`는 모델이 생성한 문장 문자열입니다): 응답 식별자가 아니라 본문이라 ID 자리에 쓸 수 없습니다.

E (오답, 존재하지 않는 파라미터 이름입니다): 그럴듯하지만 SDK 서명에 없습니다.

**근거 문서**: OpenAI API Docs › Conversation state › Chaining responses with previous\_response\_id · OpenAI API Reference › Responses › Create (SDK 버전: openai 3.35.1)

---

## Q03. 티켓 분류 결과를 객체로 받기

단일 선택 · 코드 빈칸 · 도메인 2 · L2

OpenAI Python SDK로 문의 티켓을 분류한다. 결과는 Pydantic 모델 `Ticket`에 맞는 구조화된 출력으로 받아, 후처리 코드에서 JSON 문자열을 직접 파싱하지 않고 속성으로 바로 읽어야 한다.

```python
from openai import OpenAI
from pydantic import BaseModel

class Ticket(BaseModel):
    category: str
    urgent: bool

client = OpenAI()
resp = client.responses.[A](
    model="gpt-6-astra",
    input=[
        {"role": "system", "content": "문의 티켓을 분류하세요."},
        {"role": "user", "content": "결제가 두 번 됐어요. 빨리 확인해 주세요."},
    ],
    text_format=Ticket,
)
ticket = resp.[B]
print(ticket.urgent)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `create`, \[B\] = `output_parsed`

B. \[A\] = `parse`, \[B\] = `parsed`

C. \[A\] = `create`, \[B\] = `parsed`

D. \[A\] = `parse`, \[B\] = `output_text`

E. \[A\] = `parse`, \[B\] = `output_parsed`

**정답: E**

**상세 해설**

OpenAI SDK는 `client.responses.parse()`에 `text_format`으로 Pydantic 모델을 넘기면 스키마 변환과 응답 파싱을 해 주고, 파싱된 객체는 응답의 `output_parsed`로 읽습니다. `create()`에는 `text_format` 인자가 없습니다(대신 `text` 파라미터에 JSON 스키마를 직접 씁니다).

A (오답, `create`는 `text_format`을 받지 않습니다): `output_parsed`는 `parse()` 응답에서 쓰는 필드이므로 짝이 맞지 않습니다.

B (오답, `parsed`는 Google GenAI SDK의 `response.parsed` 이름입니다): OpenAI Responses 객체에는 없는 필드입니다.

C (오답, `create`와 `parsed` 모두 맞지 않습니다): 두 빈칸이 모두 틀렸습니다.

D (오답, `output_text`는 JSON 문자열입니다): `ticket.urgent`처럼 속성으로 읽을 수 없습니다.

E (정답): `parse()`로 호출하고 `output_parsed`로 읽습니다.

**근거 문서**: OpenAI API Docs › Structured Outputs › Examples (Responses API, `text_format`) · OpenAI Python SDK README › Structured Outputs Parsing Helpers (SDK 버전: openai 3.35.1)

---

## Q04. 긴 보고서 생성 응답의 스트리밍과 종료 사유 확인

단일 선택 · 코드 빈칸 · 도메인 2 · L2

Anthropic Python SDK로 긴 보고서를 생성한다. 사용자 화면에는 글자가 생성되는 대로 출력하고, 스트림이 끝난 뒤에는 전체 Message 객체에서 `stop_reason`을 확인해 `max_tokens`로 잘렸는지 판단해야 한다.

```python
import anthropic

client = anthropic.Anthropic()
with client.messages.[A](
    model="claude-sonnet-5-5",
    max_tokens=64000,
    messages=[{"role": "user", "content": "분기 실적 보고서를 작성해 줘."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.[B]()

if final.stop_reason == "max_tokens":
    print("\n[잘림] 이어서 요청 필요")
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `create`, \[B\] = `get_final_message`

B. \[A\] = `stream`, \[B\] = `get_final_message`

C. \[A\] = `stream`, \[B\] = `get_final_text`

D. \[A\] = `stream`, \[B\] = `get_final_response`

E. \[A\] = `create`, \[B\] = `final_message`

**정답: B**

**상세 해설**

Anthropic SDK의 `client.messages.stream()`은 컨텍스트 매니저로 쓰는 스트리밍 헬퍼이며, `text_stream`으로 텍스트 조각을 받고 `get_final_message()`로 `create()`와 같은 형태의 완성된 Message를 얻습니다. `stop_reason`은 Message 객체에 들어 있습니다.

A (오답, `create`는 `with`로 쓰는 스트림 헬퍼가 아닙니다): `create()`는 Message를 바로 반환하므로 `text_stream`이 없습니다.

B (정답): `stream()` 헬퍼와 `get_final_message()`의 조합입니다.

C (오답, `get_final_text()`는 문자열만 돌려줍니다): `stop_reason`을 읽을 수 없습니다.

D (오답, `get_final_response()`는 OpenAI Responses 스트림 헬퍼의 이름입니다): Anthropic 스트림에는 없는 메서드입니다.

E (오답, `final_message`라는 메서드는 없습니다): `[A]`도 틀립니다.

**근거 문서**: Claude API Docs › Streaming Messages › Streaming with SDKs (`text_stream`, `get_final_message`) · Claude API Docs › Handling stop reasons (SDK 버전: anthropic 1.15.0)

---

## Q05. Gemini 응답을 레시피 객체로 받기

단일 선택 · 코드 빈칸 · 도메인 2 · L2

Google Gen AI Python SDK(`google-genai`)로 Gemini API를 호출해 레시피 정보를 구조화된 출력으로 받는다. 스키마는 Pydantic 모델로 지정하고, 응답에서는 파싱된 객체를 바로 꺼내 `minutes`를 읽어야 한다.

```python
from google import genai
from google.genai import types
from pydantic import BaseModel

class Recipe(BaseModel):
    name: str
    minutes: int

client = genai.Client()
resp = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="김치볶음밥 레시피를 알려 줘.",
    config=types.GenerateContentConfig(
        response_mime_type=[A],
        response_schema=Recipe,
    ),
)
print(resp.[B].minutes)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"text/plain"`, \[B\] = `parsed`

B. \[A\] = `"application/json"`, \[B\] = `output_parsed`

C. \[A\] = `"application/json"`, \[B\] = `text`

D. \[A\] = `"application/json"`, \[B\] = `parsed`

E. \[A\] = `"json"`, \[B\] = `parsed`

**정답: D**

**상세 해설**

Gemini API에서 구조화된 출력을 쓰려면 `response_mime_type`을 `"application/json"`으로 두고 `response_schema`에 Pydantic 모델(또는 JSON 스키마)을 줍니다. Python SDK는 응답을 모델 인스턴스로 변환해 `response.parsed`에 담아 줍니다.

A (오답, `text/plain`이면 JSON 출력이 강제되지 않습니다): 스키마 제약이 적용되지 않습니다.

B (오답, `output_parsed`는 OpenAI `responses.parse` 응답의 필드입니다): Gemini 응답에는 없습니다.

C (오답, `resp.text`는 JSON 문자열입니다): `.minutes` 같은 속성 접근이 되지 않습니다.

D (정답): MIME 타입은 `"application/json"`, 파싱된 객체는 `parsed`입니다.

E (오답, `"json"`은 유효한 MIME 타입이 아닙니다): 요청이 거부됩니다.

**근거 문서**: Gemini API Docs › Structured output · Google Gen AI Python SDK Docs › JSON Response Schema (SDK 버전: google-genai 2.31.0)

---

## Q06. 병렬 도구 호출 결과 돌려주기

단일 선택 · 코드 빈칸 · 도메인 3 · L2

Anthropic Python SDK로 도구를 쓰는 에이전트 루프를 만든다. 한 번의 응답에 서로 독립적인 `tool_use` 블록이 여러 개 들어올 수 있고, 그 결과를 모두 모델에 돌려줘야 다음 응답을 받을 수 있다.

```python
resp = client.messages.create(
    model="claude-sonnet-5-5", max_tokens=1024, tools=tools, messages=messages
)
if resp.stop_reason == "tool_use":
    messages.append({"role": "assistant", "content": resp.content})
    results = [
        {
            "type": "tool_result",
            "tool_use_id": [A],
            "content": run_tool(b.name, b.input),
        }
        for b in resp.content if b.type == "tool_use"
    ]
    messages.append({"role": [B], "content": results})
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `b.id`, \[B\] = `"user"`

B. \[A\] = `b.name`, \[B\] = `"user"`

C. \[A\] = `b.id`, \[B\] = `"assistant"`

D. \[A\] = `resp.id`, \[B\] = `"user"`

E. \[A\] = `b.id`, \[B\] = `"tool"`

**정답: A**

**상세 해설**

`tool_result`는 어느 `tool_use` 블록에 대한 결과인지 그 블록의 `id`를 `tool_use_id`로 가리켜야 합니다. 병렬 호출의 결과는 하나의 `user` 메시지 안에 `tool_result` 블록들로 함께 담아 보냅니다.

A (정답): 각 블록의 `id`로 짝을 짓고, 결과 전체를 `user` 메시지 하나로 보냅니다.

B (오답, `name`은 도구 이름이라 같은 도구를 두 번 부르면 구분되지 않습니다): 짝을 짓는 키가 아닙니다.

C (오답, 도구 결과는 `assistant`가 아니라 `user` 쪽 메시지입니다): 역할이 잘못되었습니다.

D (오답, `resp.id`는 메시지 전체의 ID(`msg_...`)입니다): 개별 `tool_use` 블록과 짝지어지지 않습니다.

E (오답, `"tool"` 역할은 OpenAI Chat Completions의 도구 결과 메시지 역할입니다): Anthropic `messages`에서는 허용되지 않습니다.

**근거 문서**: Claude API Docs › Tool use › Handle tool calls (parallel tool use, `tool_result`) · Claude API Docs › Messages API › content block types (SDK 버전: anthropic 1.15.0)

---

## Q07. 함수 호출 결과를 모델에 돌려주기

단일 선택 · 코드 빈칸 · 도메인 3 · L1

OpenAI Python SDK의 Responses API로 함수 호출을 처리한다. 모델이 `function_call` 항목을 내면 앱이 함수를 실행하고, 그 결과를 다음 요청의 입력에 넣어 어느 호출에 대한 결과인지 모델이 알 수 있게 해야 한다.

```python
import json

input_list += response.output
for item in response.output:
    if item.type == "function_call":
        result = get_weather(**json.loads(item.arguments))
        input_list.append({
            "type": [A],
            "call_id": item.[B],
            "output": json.dumps(result),
        })
followup = client.responses.create(model="gpt-6-astra", tools=tools, input=input_list)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"tool_result"`, \[B\] = `id`

B. \[A\] = `"function_call_output"`, \[B\] = `id`

C. \[A\] = `"tool"`, \[B\] = `call_id`

D. \[A\] = `"function_call_output"`, \[B\] = `call_id`

E. \[A\] = `"function_result"`, \[B\] = `call_id`

**정답: D**

**상세 해설**

Responses API에서 함수 결과는 입력 항목 `{"type": "function_call_output", "call_id": ..., "output": ...}`로 돌려줍니다. 짝짓는 키는 `function_call` 항목의 `call_id`이고, 항목 자체의 `id`(`fc_...`)와는 다른 값입니다.

A (오답, `tool_result`는 Anthropic의 블록 타입입니다): Responses API 입력 항목 타입이 아니고 `id`도 짝짓는 키가 아닙니다.

B (오답, 타입은 맞지만 `item.id`는 항목 자체의 식별자입니다): 호출과 결과를 잇는 값은 `call_id`입니다.

C (오답, `"tool"`은 Chat Completions의 메시지 역할 값입니다): Responses의 `type` 값으로 쓰이지 않습니다.

D (정답): `function_call_output` 항목에 `item.call_id`를 넣습니다.

E (오답, `function_result`는 다른 API의 단계 이름입니다): OpenAI Responses 입력 타입에 없습니다.

**근거 문서**: OpenAI API Docs › Function calling › Handling function calls (Responses API) · OpenAI API Reference › Responses › input item `function_call_output` (SDK 버전: openai 3.35.1)

---

## Q08. 함수 호출을 직접 실행하는 Gemini 앱

단일 선택 · 코드 빈칸 · 도메인 3 · L3

Google Gen AI Python SDK에서 Python 함수 `get_weather`를 도구로 넘긴다. 감사 로깅과 사용자 권한 확인을 위해 함수 실행은 SDK가 아니라 앱이 직접 해야 하고, 이 요청에서는 모델이 텍스트로 답하지 않고 반드시 함수 호출을 반환해야 한다.

```python
config = types.GenerateContentConfig(
    tools=[get_weather],
    automatic_function_calling=types.AutomaticFunctionCallingConfig([A]=True),
    tool_config=types.ToolConfig(
        function_calling_config=types.FunctionCallingConfig(mode="[B]")
    ),
)
resp = client.models.generate_content(
    model="gemini-3.8-flash", contents="서울 날씨 알려 줘", config=config
)
call = resp.function_calls[0]
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `disable`, \[B\] = `AUTO`

B. \[A\] = `disable`, \[B\] = `ANY`

C. \[A\] = `ignore_call_history`, \[B\] = `ANY`

D. \[A\] = `disable`, \[B\] = `NONE`

E. \[A\] = `ignore_call_history`, \[B\] = `AUTO`

**정답: B**

**상세 해설**

Python 함수를 `tools`에 직접 넘기면 SDK가 기본으로 함수를 자동 실행하므로, 앱이 직접 실행하려면 `AutomaticFunctionCallingConfig(disable=True)`로 끕니다. 그러면 호출 요청이 `response.function_calls`에 담깁니다. 함수 호출 모드 `ANY`는 모델이 항상 함수 호출을 예측하게 강제합니다.

A (오답, `AUTO`는 모델이 텍스트로 답할 수도 있습니다): "반드시 함수 호출"이라는 제약을 만족하지 못합니다.

B (정답): 자동 실행은 `disable=True`로 끄고, 호출 강제는 모드 `ANY`로 합니다.

C (오답, `ignore_call_history`는 호출 기록 처리에 관한 옵션입니다): 자동 실행을 끄는 필드가 아닙니다.

D (오답, 모드 `NONE`은 함수 호출을 금지합니다): `function_calls`가 비어 `[0]` 접근에서 실패합니다.

E (오답, 두 값 모두 요구를 만족하지 못합니다): 자동 실행도 꺼지지 않고 호출도 강제되지 않습니다.

**근거 문서**: Google Gen AI Python SDK Docs › Function calling (automatic function calling, disable) · Gemini API Docs › Function calling › Function calling modes (SDK 버전: google-genai 2.31.0)

---

## Q09. 원격 MCP 도구 호출 전 사람 승인

단일 선택 · 코드 빈칸 · 도메인 3 · L3

OpenAI Python SDK의 Responses API에 원격 MCP 서버를 도구로 연결한다. 보안 정책상 서버의 모든 도구 호출은 실행 전에 사용자의 승인을 받아야 한다. 첫 응답에서 승인 요청 항목이 나오면, 승인 응답을 보내 같은 대화를 이어 가야 한다.

```python
tools = [{
    "type": "mcp", "server_label": "docs", "server_url": "https://example.com/mcp",
    "require_approval": "[A]",
}]
r1 = client.responses.create(model="gpt-6-astra", tools=tools, input="환불 정책 찾아 줘")
req = next(i for i in r1.output if i.type == "mcp_approval_request")
r2 = client.responses.create(
    model="gpt-6-astra", tools=tools, previous_response_id=r1.id,
    input=[{"type": "mcp_approval_response", "approve": True,
            "approval_request_id": req.[B]}],
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `never`, \[B\] = `id`

B. \[A\] = `always`, \[B\] = `call_id`

C. \[A\] = `always`, \[B\] = `id`

D. \[A\] = `ask`, \[B\] = `id`

E. \[A\] = `always`, \[B\] = `server_label`

**정답: C**

**상세 해설**

원격 MCP 도구의 `require_approval`을 `"always"`로 두면 도구를 호출하기 전에 `mcp_approval_request` 항목이 응답에 나옵니다. 승인은 `mcp_approval_response` 입력 항목에서 `approval_request_id`에 그 요청 항목의 `id`를 넣고 `approve`를 지정해 보내며, 이전 응답을 `previous_response_id`로 이어 줍니다.

A (오답, `never`는 승인 없이 바로 실행합니다): 승인 요청 항목이 생기지 않아 `next(...)`가 실패합니다.

B (오답, `mcp_approval_request` 항목에는 `call_id` 필드가 없습니다): 요청을 식별하는 값은 `id`입니다.

C (정답): 항상 승인을 요구하고, 요청 항목의 `id`로 승인 응답을 짝짓습니다.

D (오답, `ask`는 허용되는 값이 아닙니다): 값은 `always`, `never` 또는 도구별 필터 객체입니다.

E (오답, `server_label`은 MCP 서버의 이름표입니다): 개별 승인 요청을 가리키지 못합니다.

**근거 문서**: OpenAI API Docs › MCP and Connectors › Approvals · OpenAI API Reference › Responses › `mcp_approval_request`, `mcp_approval_response` (SDK 버전: openai 3.35.1)

---

## Q10. 질문과 문서를 다르게 임베딩하는 검색

단일 선택 · 코드 빈칸 · 도메인 4 · L1

Google Gen AI Python SDK로 사내 문서 질의응답용 검색을 만든다. 사용자의 질문으로 문서 조각을 찾는 구조이므로 질문 벡터와 문서 벡터를 각각 목적에 맞는 작업 유형으로 생성해야 한다.

```python
cfg = lambda t: types.EmbedContentConfig(task_type=t, output_dimensionality=768)

q_emb = client.models.embed_content(
    model="gemini-embedding-001", contents=question, config=cfg("[A]")
)
d_emb = client.models.embed_content(
    model="gemini-embedding-001", contents=chunks, config=cfg("[B]")
)
query_vec = q_emb.embeddings[0].values
doc_vecs = [e.values for e in d_emb.embeddings]
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `RETRIEVAL_DOCUMENT`, \[B\] = `RETRIEVAL_QUERY`

B. \[A\] = `RETRIEVAL_QUERY`, \[B\] = `RETRIEVAL_QUERY`

C. \[A\] = `CLASSIFICATION`, \[B\] = `CLUSTERING`

D. \[A\] = `RETRIEVAL_DOCUMENT`, \[B\] = `RETRIEVAL_DOCUMENT`

E. \[A\] = `RETRIEVAL_QUERY`, \[B\] = `RETRIEVAL_DOCUMENT`

**정답: E**

**상세 해설**

`gemini-embedding-001`은 `task_type`으로 용도에 맞게 최적화된 임베딩을 만듭니다. 검색 질의는 `RETRIEVAL_QUERY`, 검색 대상 문서는 `RETRIEVAL_DOCUMENT`로 만들어야 질문과 문서 사이의 유사도가 검색에 맞게 계산됩니다.

A (오답, 두 유형이 서로 바뀌었습니다): 질문을 문서용으로, 문서를 질문용으로 만들면 검색 품질이 떨어집니다.

B (오답, 문서 쪽도 질의용으로 만들었습니다): 문서에는 `RETRIEVAL_DOCUMENT`를 써야 합니다.

C (오답, 분류·군집화용 유형입니다): 질의-문서 검색에 맞춘 임베딩이 아닙니다.

D (오답, 질문 쪽도 문서용으로 만들었습니다): 질문에는 `RETRIEVAL_QUERY`를 써야 합니다.

E (정답): 질문은 `RETRIEVAL_QUERY`, 문서 조각은 `RETRIEVAL_DOCUMENT`입니다.

**근거 문서**: Gemini API Docs › Embeddings › Task types · Gemini API Docs › Embeddings › Controlling embedding size (SDK 버전: google-genai 2.31.0)

---

## Q11. 계약서 PDF에 근거를 달아 답하기

단일 선택 · 코드 빈칸 · 도메인 4 · L3

Anthropic Python SDK로 계약서 PDF를 base64로 보내 질문에 답하게 한다. 답변의 각 문장이 PDF의 어느 쪽에서 나왔는지 시작 쪽 번호를 화면에 표시해야 한다.

```python
resp = client.messages.create(
    model="claude-sonnet-5-5", max_tokens=1024,
    messages=[{"role": "user", "content": [
        {"type": "document",
         "source": {"type": "base64", "media_type": "application/pdf", "data": pdf_b64},
         "[A]": {"enabled": True}},
        {"type": "text", "text": "해지 통보 기한은?"},
    ]}],
)
for block in resp.content:
    if block.type == "text":
        for c in block.citations or []:
            if c.type == "[B]":
                print(c.start_page_number)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `citations`, \[B\] = `char_location`

B. \[A\] = `citations`, \[B\] = `page_location`

C. \[A\] = `references`, \[B\] = `page_location`

D. \[A\] = `citations`, \[B\] = `file_citation`

E. \[A\] = `citations`, \[B\] = `content_block_location`

**정답: B**

**상세 해설**

Claude의 인용 기능은 `document` 블록에 `citations: {"enabled": true}`를 지정하면 켜집니다. 응답의 텍스트 블록에 `citations` 목록이 붙고, 출처가 PDF이면 인용 타입은 `page_location`이며 `start_page_number`와 `end_page_number`(1부터 시작, 끝 번호는 미포함)를 가집니다.

A (오답, `char_location`은 일반 텍스트 문서의 문자 위치 인용입니다): PDF 인용에는 쪽 번호 필드가 있는 `page_location`이 쓰입니다.

B (정답): 인용을 켜는 키는 `citations`, PDF 인용 타입은 `page_location`입니다.

C (오답, `references`라는 키는 없습니다): 인용이 켜지지 않습니다.

D (오답, `file_citation`은 OpenAI 파일 검색 응답의 주석 타입입니다): Claude 인용 타입이 아닙니다.

E (오답, `content_block_location`은 사용자 지정 콘텐츠 문서의 블록 위치 인용입니다): 쪽 번호 필드가 없습니다.

**근거 문서**: Claude API Docs › Citations › Types of citations · Claude API Docs › PDF support (SDK 버전: anthropic 1.15.0)

---

## Q12. 사내 규정 파일 검색 결과까지 확인하기

단일 선택 · 코드 빈칸 · 도메인 4 · L2

OpenAI Python SDK의 Responses API로 이미 만들어 둔 벡터 스토어 `vs`를 검색해 사내 규정 질문에 답한다. 모델이 어떤 조각을 가져왔는지 디버깅하려면 검색 호출 항목에 결과 내용이 함께 오도록 요청해야 한다.

```python
resp = client.responses.create(
    model="gpt-6-astra",
    input="연차 이월 규정이 뭐야?",
    tools=[{"type": "[A]", "vector_store_ids": [vs.id], "max_num_results": 3}],
    include=["[B]"],
)
for item in resp.output:
    if item.type == "file_search_call":
        print(item.results)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `file_search`, \[B\] = `file_search_call.results`

B. \[A\] = `retrieval`, \[B\] = `file_search_call.results`

C. \[A\] = `file_search`, \[B\] = `file_citation`

D. \[A\] = `file_search`, \[B\] = `message.input_image.image_url`

E. \[A\] = `vector_search`, \[B\] = `file_search_call.results`

**정답: A**

**상세 해설**

Responses API의 파일 검색 도구는 `{"type": "file_search", "vector_store_ids": [...]}`로 지정하고 `max_num_results`로 가져오는 조각 수를 제한합니다. 기본 응답의 `file_search_call` 항목에는 검색 결과 본문이 없으므로, `include=["file_search_call.results"]`를 줘야 `results`가 채워집니다.

A (정답): 도구 타입은 `file_search`, 포함 옵션은 `file_search_call.results`입니다.

B (오답, `retrieval`은 Assistants API 시절의 도구 이름입니다): Responses API에서는 `file_search`를 씁니다.

C (오답, `file_citation`은 답변 텍스트에 붙는 주석 타입입니다): `include`에 넣을 수 있는 값이 아닙니다.

D (오답, 이미지 URL을 포함하는 옵션입니다): 파일 검색 결과와 무관합니다.

E (오답, `vector_search`라는 도구 타입은 없습니다): 지어낸 이름입니다.

**근거 문서**: OpenAI API Docs › File search › Retrieval customization (`max_num_results`) · OpenAI API Docs › File search › Include search results (SDK 버전: openai 3.35.1)

---

## Q13. 긴 정책 문서 캐시 유지와 적중률 계산

단일 선택 · 코드 빈칸 · 도메인 5 · L3

Anthropic Python SDK로 약 12k 토큰의 정책 문서를 시스템 프롬프트로 쓰는 상담 서비스를 만든다. 같은 문서를 쓰는 요청이 대략 20\~30분 간격으로 들어오므로 기본 유지 시간으로는 캐시가 자주 만료된다. 요청 후에는 전체 입력 토큰 대비 캐시에서 읽은 비율을 계산한다.

```python
resp = client.messages.create(
    model="claude-sonnet-5-5", max_tokens=512,
    system=[{"type": "text", "text": POLICY_DOC,
             "cache_control": {"type": "ephemeral", "ttl": "[A]"}}],
    messages=[{"role": "user", "content": question}],
)
u = resp.usage
total_input = [B]
print(u.cache_read_input_tokens / total_input)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `1h`, \[B\] = `u.input_tokens`

B. \[A\] = `3600s`, \[B\] = `u.input_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens`

C. \[A\] = `1h`, \[B\] = `u.input_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens`

D. \[A\] = `1h`, \[B\] = `u.input_tokens + u.cache_read_input_tokens`

E. \[A\] = `60m`, \[B\] = `u.input_tokens + u.cache_creation_input_tokens`

**정답: C**

**상세 해설**

Claude 프롬프트 캐싱은 기본 5분이고, `cache_control`의 `ttl`을 `"1h"`로 지정하면 1시간 캐시를 쓸 수 있습니다(허용 값은 `5m`과 `1h`). 사용량에서 `input_tokens`는 마지막 캐시 지점 뒤의 캐시 외 토큰만 뜻하므로, 전체 입력은 `cache_read_input_tokens`, `cache_creation_input_tokens`, `input_tokens`의 합입니다.

A (오답, `input_tokens`는 마지막 캐시 지점 뒤의 토큰뿐입니다): 캐시를 쓰면 전체 입력보다 훨씬 작아 비율이 1을 넘을 수 있습니다.

B (오답, `3600s`는 Google의 TTL 표기입니다): Anthropic은 `5m`/`1h`만 허용하므로 요청이 거부됩니다.

C (정답): TTL은 `1h`, 전체 입력은 세 필드의 합입니다.

D (오답, 새로 쓴 캐시 토큰이 빠졌습니다): 캐시 쓰기가 일어난 요청에서는 전체 입력이 과소 계산됩니다.

E (오답, `60m`은 허용 값이 아니고 읽은 토큰도 빠졌습니다): 두 빈칸이 모두 틀렸습니다.

**근거 문서**: Claude API Docs › Prompt caching › 1-hour cache duration · Claude API Docs › Prompt caching › Tracking cache performance (SDK 버전: anthropic 1.15.0)

---

## Q14. Gemini 컨텍스트 캐싱으로 반복 비용 줄이기

단일 선택 · 코드 빈칸 · 도메인 5 · L2

Google Gen AI Python SDK로 긴 제품 매뉴얼을 질문마다 다시 보내지 않도록 컨텍스트 캐시를 만든다. 캐시는 1시간 동안 유지하고, 이후 질문 요청에서는 만든 캐시를 참조해야 한다.

```python
cache = client.caches.create(
    model="gemini-3.8-flash",
    config=types.CreateCachedContentConfig(
        system_instruction="매뉴얼 기반으로만 답하세요.",
        contents=[manual_text],
        ttl=[A],
    ),
)
resp = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="전원이 안 켜질 때는?",
    config=types.GenerateContentConfig([B]=cache.name),
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"1h"`, \[B\] = `cached_content`

B. \[A\] = `"3600s"`, \[B\] = `cache_control`

C. \[A\] = `"ephemeral"`, \[B\] = `cached_content`

D. \[A\] = `"3600s"`, \[B\] = `cached_content`

E. \[A\] = `"3600s"`, \[B\] = `cache_id`

**정답: D**

**상세 해설**

Gemini 명시적 캐싱은 `client.caches.create()`에 `CreateCachedContentConfig`로 내용과 TTL을 지정해 만듭니다. TTL은 초 단위 문자열(예: `"3600s"`)이고, 이후 요청에서는 `GenerateContentConfig`의 `cached_content`에 캐시의 `name`을 넘겨 참조합니다.

A (오답, `"1h"`는 Anthropic식 표기이고 Gemini의 기간 값은 초 단위 문자열입니다): TTL 형식이 맞지 않습니다.

B (오답, `cache_control`은 Anthropic의 블록 필드입니다): `GenerateContentConfig`에는 없는 필드입니다.

C (오답, `"ephemeral"`은 Anthropic의 캐시 타입 값입니다): TTL 값이 될 수 없습니다.

D (정답): TTL은 `"3600s"`, 참조는 `cached_content=cache.name`입니다.

E (오답, `cache_id`라는 필드는 없습니다): 그럴듯하지만 SDK 서명에 없습니다.

**근거 문서**: Gemini API Docs › Context caching › Explicit caching · Google Gen AI Python SDK Docs › Caches (SDK 버전: google-genai 2.31.0)

---

## Q15. 에스컬레이션 핸드오프에 사유를 구조화해 넘기기

단일 선택 · 코드 빈칸 · 도메인 1 · L2

OpenAI Agents SDK(Python)로 일반 상담 에이전트가 사람 상담 에이전트에게 핸드오프하도록 구성합니다. 모델이 핸드오프를 호출할 때 에스컬레이션 사유(`reason`)를 호출 인자로 직접 채워야 하고, 핸드오프가 실제로 호출되는 시점에 그 값을 로그로 남겨야 합니다.

```python
from pydantic import BaseModel
from agents import Agent, RunContextWrapper, handoff

class EscalationData(BaseModel):
    reason: str

async def log_escalation(ctx: RunContextWrapper[None], data: EscalationData):
    print(f"escalated: {data.reason}")

human = Agent(name="Human Support", instructions="Handle escalated cases.")
triage = Agent(
    name="Triage",
    instructions="Answer simple questions. Escalate upset customers.",
    handoffs=[handoff(agent=human, [A]=log_escalation, [B]=EscalationData)],
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `input_filter`, \[B\] = `input_type`

B. \[A\] = `on_handoff`, \[B\] = `input_filter`

C. \[A\] = `on_handoff`, \[B\] = `input_type`

D. \[A\] = `before_tool_callback`, \[B\] = `input_type`

E. \[A\] = `on_handoff`, \[B\] = `output_type`

**정답: C**

**상세 해설**

OpenAI Agents SDK에서 핸드오프는 모델에게 `transfer_to_<agent_name>` 같은 도구로 보입니다. `handoff()`의 `input_type`에 Pydantic 모델을 주면 그 스키마가 핸드오프 도구의 인자 스키마로 노출되어 모델이 `reason`을 채우고, 핸드오프가 호출될 때 `on_handoff` 콜백이 실행되면서 파싱된 값을 두 번째 인자로 받습니다. 따라서 값을 만드는 쪽이 `input_type`, 호출 시점에 값을 쓰는 쪽이 `on_handoff`입니다.

A (오답, 역할 혼동): `input_filter`는 다음 에이전트가 받을 대화 이력(`HandoffInputData`)을 가공하는 함수를 받으며 호출 시점 로그용 콜백이 아닙니다.

B (오답, 스키마 없음): `input_filter`는 이력을 걸러낼 뿐 모델이 채울 인자 스키마를 정의하지 못하므로 `reason`이 생성되지 않고 `on_handoff`도 `data`를 받지 못합니다.

C (정답): `on_handoff`가 호출 시점의 콜백이고 `input_type`이 모델이 채울 인자 스키마입니다.

D (오답, 다른 회사 SDK): `before_tool_callback`은 Google ADK 에이전트의 콜백 이름으로, OpenAI `handoff()`에는 없는 파라미터입니다.

E (오답, 다른 대상): `output_type`은 에이전트의 최종 출력 스키마(`Agent`의 설정)이며 핸드오프 도구의 인자 스키마가 아닙니다.

**근거 문서**: OpenAI Agents SDK Handoffs › Customizing handoffs, Handoff inputs · OpenAI Agents SDK Handoffs › Handoffs are represented as tools (SDK 버전: openai-agents 0.24.0)

---

## Q16. 그래프 워크플로의 조건 분기

단일 선택 · 코드 빈칸 · 도메인 1 · L1

Google ADK(Python) 2.x의 그래프 기반 `Workflow`로 상담 흐름을 만듭니다. 분류 에이전트가 티켓 유형 문자열을 내보내면, 함수 노드가 그 값을 보고 환불 에이전트 또는 일반 상담 에이전트 중 하나만 실행되게 해야 합니다.

```python
from google.adk import Agent, Event, Workflow

def router(node_input: str):
    if "refund" in node_input.lower():
        return Event([A]="REFUND")
    return Event([A]="GENERAL")

root_agent = Workflow(
    name="support_flow",
    [B]=[
        ("START", classifier_agent, router),
        (router, {"REFUND": refund_agent, "GENERAL": general_agent}),
    ],
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `transfer_to_agent`, \[B\] = `sub_agents`

B. \[A\] = `output`, \[B\] = `nodes`

C. \[A\] = `route`, \[B\] = `sub_agents`

D. \[A\] = `next_node`, \[B\] = `edges`

E. \[A\] = `route`, \[B\] = `edges`

**정답: E**

**상세 해설**

ADK 2.0의 그래프 워크플로는 노드를 잇는 `edges` 목록으로 구성합니다. 분기는 노드가 `Event(route=...)`로 경로 값을 내보내고, 다음 간선 행이 "경로 값: 실행할 노드" 딕셔너리로 각 값에 맞는 노드를 연결하는 방식입니다. 그래서 `router`가 반환한 `route` 값이 딕셔너리의 키와 일치하는 노드만 실행됩니다.

A (오답, 이전 방식): `transfer_to_agent`는 LLM이 하위 에이전트로 제어를 넘기는 이벤트 액션 필드이고, `sub_agents`는 `Workflow`가 아니라 `LlmAgent`·템플릿 에이전트의 계층 구성에 쓰입니다.

B (오답, 없는 항목): 노드를 `nodes`로 나열하는 파라미터는 없고, 반환 값을 `output`으로 지정해도 간선 딕셔너리와 매칭되지 않습니다.

C (오답, 절반만 맞음): `route`는 맞지만 `Workflow`는 하위 에이전트 목록이 아니라 `edges`로 그래프를 정의합니다.

D (오답, 없는 이름): 경로 값을 담는 필드는 `route`이며 `next_node`라는 필드는 없습니다.

E (정답): 경로 값은 `Event(route=...)`로, 그래프 연결은 `edges`로 지정합니다.

**근거 문서**: ADK Graph workflows (adk.dev/graphs) › Edges · ADK Graph workflows › Routes (SDK 버전: google-adk 2.12.0)

---

## Q17. 읽기 전용 서브에이전트에 검토 위임하기

단일 선택 · 코드 빈칸 · 도메인 1 · L1

Claude Agent SDK(Python)로 코드 리뷰 에이전트를 만듭니다. 메인 에이전트는 보안 검토를 `security-reviewer` 서브에이전트에게 위임하며, 위임 호출은 승인 프롬프트 없이 실행되어야 합니다. 서브에이전트는 파일을 수정하거나 명령을 실행할 수 없어야 합니다.

```python
from claude_agent_sdk import query, ClaudeAgentOptions, AgentDefinition

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Grep", [A]],
    agents={
        "security-reviewer": AgentDefinition(
            description="Reviews code for security vulnerabilities.",
            prompt="You are a security reviewer. Report findings only.",
            tools=[B],
        )
    },
)
async for message in query(prompt="Review the auth module", options=options):
    ...
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"Agent"`, \[B\] = `["Read", "Grep", "Glob"]`

B. \[A\] = `"Skill"`, \[B\] = `["Read", "Grep", "Glob"]`

C. \[A\] = `"Agent"`, \[B\] = `["Read", "Grep", "Edit"]`

D. \[A\] = `"Agent"`, \[B\] = `["Read", "Grep", "Bash"]`

E. \[A\] = `"transfer_to_agent"`, \[B\] = `["Read", "Grep", "Glob"]`

**정답: A**

**상세 해설**

Claude Agent SDK에서 메인 에이전트는 `Agent` 도구로 서브에이전트를 호출하므로, 이 도구를 `allowed_tools`에 넣어야 위임이 프롬프트 없이 자동 승인됩니다. 서브에이전트의 `tools`에 나열한 도구만 그 서브에이전트의 세션에 존재하므로, 읽기 전용으로 만들려면 `Read`, `Grep`, `Glob`만 나열합니다.

A (정답): `Agent`가 서브에이전트 호출 도구이고, 읽기·검색 도구만으로 수정과 명령 실행이 구조적으로 불가능합니다.

B (오답, 다른 도구): `Skill`은 스킬을 호출하는 도구이며 서브에이전트를 띄우지 않습니다.

C (오답, 제약 위반): `Edit`을 넣으면 서브에이전트가 파일을 수정할 수 있습니다.

D (오답, 제약 위반): `Bash`를 넣으면 서브에이전트가 임의 명령을 실행할 수 있습니다.

E (오답, 다른 회사 SDK): `transfer_to_agent`는 Google ADK의 제어 이전 동작에 쓰이는 이름이며 Claude Agent SDK의 도구 이름이 아닙니다.

**근거 문서**: Claude Agent SDK › Subagents in the SDK › Programmatic definition, AgentDefinition configuration, Tool restrictions (SDK 버전: claude-agent-sdk 0.2.168)

---

## Q18. 직접 정한 시점에 대화를 요약해 교체하기

단일 선택 · 코드 빈칸 · 도메인 2 · L3

Claude API(Python SDK)로 에이전트 루프를 운영하는 팀이 서버가 자동으로 압축하는 방식 대신, 자체 토큰 카운터가 예산을 넘을 때만 요약을 요청하는 온디맨드 compaction(베타 헤더 `compact-2026-09-04`)을 씁니다. 요약 호출은 답변을 생성하지 않고 요약 블록만 돌려줘야 하며, 요약이 성공하면 기존 이력은 그 블록으로 교체해야 합니다.

```python
if conversation_tokens > BUDGET:
    summary = client.beta.messages.create(
        model=MODEL,
        max_tokens=4096,
        system=SYSTEM,
        betas=["compact-2026-09-04"],
        messages=history,
        [A]={"type": "summarize"},
    )
    if summary.stop_reason == [B]:
        history = [{"role": "assistant", "content": summary.content}]
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `context_management`, \[B\] = `"compaction"`

B. \[A\] = `compaction`, \[B\] = `"compaction"`

C. \[A\] = `compaction`, \[B\] = `"end_turn"`

D. \[A\] = `summarize`, \[B\] = `"pause_turn"`

E. \[A\] = `truncation`, \[B\] = `"max_tokens"`

**정답: B**

**상세 해설**

온디맨드 compaction은 요약을 요청하는 요청에 최상위 `compaction` 파라미터로 `{"type": "summarize"}`를 보냅니다. 이때 API는 모든 메시지를 한 번 요약하고 답변 없이 `compaction` 블록만 돌려주며 `stop_reason`이 `"compaction"`입니다. 그래서 이 값을 확인한 뒤에만 이력을 블록 하나로 교체하고, 요약이 오지 않으면 이력을 유지합니다.

A (오답, 다른 기능): `context_management`는 `compact_20260112` 같은 편집 전략을 쓰는 임계값 compaction의 파라미터이고, 온디맨드 `compaction`과는 한 요청에 함께 쓸 수 없습니다. `{"type": "summarize"}`는 편집 전략 형식이 아닙니다.

B (정답): 최상위 `compaction` 파라미터와 `stop_reason == "compaction"` 확인이 맞습니다.

C (오답, 잘못된 분기): `end_turn`은 모델이 정상적으로 답변을 마쳤을 때의 값이라 요약 블록이 왔다는 신호가 아닙니다.

D (오답, 없는 파라미터): `summarize`라는 최상위 파라미터는 없고, `pause_turn`은 서버 도구 사용 중 턴이 멈췄을 때의 값입니다.

E (오답, 다른 회사 SDK): `truncation`은 OpenAI Responses API의 입력 자르기 옵션 이름이며, `max_tokens`는 출력 토큰 한도에 닿았다는 뜻입니다.

**근거 문서**: Claude API Compaction on demand › Request, Placing the block in the next request, Compaction loop · Claude API Compaction at a token threshold › Basic usage (SDK 버전: anthropic 1.15.0)

---

## Q19. 이전 턴을 보지 않는 요약 에이전트와 상태 전달

단일 선택 · 코드 빈칸 · 도메인 2 · L2

Google ADK(Python)에서 한 세션에 여러 티켓이 쌓이는 상담 서비스를 운영합니다. 앱이 세션 상태 `ticket_text`에 현재 티켓을 넣어 두고, `summarizer`가 이를 두 문장으로 요약하면 이어서 `responder`가 그 요약으로 답변 초안을 씁니다(두 에이전트는 이 순서로 실행됩니다). `summarizer`는 앞선 티켓의 대화 이력을 모델에 보내지 않아야 하고, 요약 결과는 입력 상태를 덮어쓰지 않으면서 `responder`의 지침에 주입되어야 합니다.

```python
summarizer = LlmAgent(
    name="summarizer",
    model="gemini-flash-latest",
    instruction="Summarize this ticket in two sentences: {ticket_text}",
    include_contents=[A],
    output_key=[B],
)
responder = LlmAgent(
    name="responder",
    model="gemini-flash-latest",
    instruction="Draft a reply based on this summary: {ticket_summary}",
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"default"`, \[B\] = `"ticket_summary"`

B. \[A\] = `"none"`, \[B\] = `"summarizer"`

C. \[A\] = `"none"`, \[B\] = `"ticket_text"`

D. \[A\] = `"none"`, \[B\] = `"ticket_summary"`

E. \[A\] = `False`, \[B\] = `"ticket_summary"`

**정답: D**

**상세 해설**

`include_contents="none"`이면 에이전트는 이전 대화 이력 없이 현재 지침과 현재 턴의 입력만으로 동작하므로, 이전 티켓 내용이 모델에 전달되지 않습니다. 지침의 `{ticket_text}`는 세션 상태 값이 주입되는 템플릿이라 이력 없이도 현재 티켓을 볼 수 있습니다. `output_key`는 에이전트의 최종 응답을 그 이름의 상태 키에 저장하므로, `responder`의 `{ticket_summary}`가 해석되려면 같은 이름이어야 하고 입력 키와 달라야 합니다.

A (오답, 이력 전달): `"default"`는 관련 대화 이력을 모델에 보내므로 앞선 티켓이 섞입니다.

B (오답, 키 불일치): 상태 키는 에이전트 이름이 아니라 `output_key`로 정합니다. `"summarizer"`에 저장되면 `{ticket_summary}`가 상태에 없어 `responder`가 오류를 냅니다.

C (오답, 입력 덮어쓰기): `"ticket_text"`에 저장하면 입력 티켓 원문이 요약으로 바뀌고, `{ticket_summary}`는 여전히 없습니다.

D (정답): 이력 제외와 새 상태 키 저장이 모두 충족됩니다.

E (오답, 허용되지 않는 값): `include_contents`는 `'default'` 또는 `'none'`만 받으므로 `False`는 유효하지 않습니다.

**근거 문서**: ADK LLM agents › include\_contents, Instruction templating · ADK State › output\_key, Accessing state in instructions (SDK 버전: google-adk 2.12.0)

---

## Q20. 원격 MCP 서버에서 쓰기 도구만 승인받기

단일 선택 · 코드 빈칸 · 도메인 3 · L3

OpenAI Agents SDK(Python)에서 호스티드 MCP 도구로 CRM 원격 MCP 서버를 연결합니다. 이 서버에는 읽기 전용 도구 `get_account`, `list_orders`와 쓰기 도구 `update_record`가 있습니다. 읽기 도구는 승인 없이 실행되고, `update_record`는 앱의 승인 함수가 허용한 경우에만 실행되어야 합니다. 승인 함수는 이 도구 설정에서 지정합니다.

```python
from agents import HostedMCPTool, MCPToolApprovalFunctionResult, MCPToolApprovalRequest

def approve(req: MCPToolApprovalRequest) -> MCPToolApprovalFunctionResult:
    ok = req.data.name == "update_record" and change_ticket_is_open()
    return {"approve": ok}

crm = HostedMCPTool(
    tool_config={
        "type": "mcp",
        "server_label": "crm",
        "server_url": CRM_URL,
        "require_approval": {[A]: {"tool_names": ["get_account", "list_orders"]}},
    },
    [B]=approve,
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"always"`, \[B\] = `on_approval_request`

B. \[A\] = `"never"`, \[B\] = `needs_approval`

C. \[A\] = `"never"`, \[B\] = `on_approval_request`

D. \[A\] = `"never"`, \[B\] = `tool_filter`

E. \[A\] = `"auto"`, \[B\] = `on_approval_request`

**정답: C**

**상세 해설**

호스티드 MCP는 도구 호출이 OpenAI 인프라에서 일어나며, 기본값은 서버로 데이터를 보내기 전에 승인을 요청하는 것입니다. `require_approval`을 객체 형태로 주면 `"never"` 아래에 나열한 도구만 승인을 건너뛰므로, 읽기 전용 도구를 `"never"`에 넣으면 나머지인 `update_record`만 승인 요청이 발생합니다. 이 승인 요청을 앱 코드로 판단하게 하는 것이 `HostedMCPTool`의 `on_approval_request` 콜백입니다.

A (오답, 요구 위반): `"always"` 아래에 읽기 도구를 넣으면 읽기 도구까지 승인을 요구하게 되어 "읽기 도구는 승인 없이" 조건을 어깁니다.

B (오답, 없는 파라미터): `needs_approval`은 `function_tool`·`Agent.as_tool`의 파라미터이며 `HostedMCPTool`에는 없습니다.

C (정답): `"never"`로 읽기 도구만 승인에서 제외하고 `on_approval_request`로 쓰기 도구 승인을 판단합니다.

D (오답, 다른 대상): `tool_filter`는 로컬에서 도는 MCP 서버 클래스(`MCPServerStreamableHttp` 등)의 도구 필터이고 승인 함수를 받지 않습니다.

E (오답, 허용되지 않는 값): `require_approval`은 `"always"`, `"never"` 또는 `"never"`/`"always"` 아래에 `tool_names`를 두는 객체를 받고 `"auto"`는 없습니다.

**근거 문서**: OpenAI Agents SDK MCP › Hosted MCP server tools, Optional approval flows · OpenAI API Remote MCP and Connectors › Approvals (SDK 버전: openai-agents 0.24.0)

---

## Q21. SDK 내장 MCP 서버의 도구 이름과 병렬 실행

단일 선택 · 코드 빈칸 · 도메인 3 · L2

Claude Agent SDK(Python)에서 지연 시간을 조회하는 사용자 정의 도구를 프로세스 안 MCP 서버로 제공합니다. 이 도구는 상태를 바꾸지 않으므로 승인 프롬프트 없이 실행되고, Claude가 서비스 여러 개를 동시에 조회할 수 있어야 합니다.

```python
@tool(
    "get_p95",
    "Get p95 latency for a service",
    {"service": str},
    annotations=ToolAnnotations([B]=True),
)
async def get_p95(args):
    return {"content": [{"type": "text", "text": lookup(args["service"])}]}

metrics = create_sdk_mcp_server(name="metrics", tools=[get_p95])
options = ClaudeAgentOptions(
    mcp_servers={"obs": metrics},
    allowed_tools=[[A]],
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"mcp__metrics__get_p95"`, \[B\] = `readOnlyHint`

B. \[A\] = `"mcp__obs__get_p95"`, \[B\] = `idempotentHint`

C. \[A\] = `"mcp__obs__get_p95"`, \[B\] = `parallel_tool_calls`

D. \[A\] = `"obs.get_p95"`, \[B\] = `readOnlyHint`

E. \[A\] = `"mcp__obs__get_p95"`, \[B\] = `readOnlyHint`

**정답: E**

**상세 해설**

MCP 도구의 정규화된 이름은 `mcp__{서버 이름}__{도구 이름}`이며, 여기서 서버 이름은 `create_sdk_mcp_server(name=...)`가 아니라 `mcp_servers` 딕셔너리에 준 키(`obs`)입니다. 병렬 실행은 도구 어노테이션의 `readOnlyHint=True`로 상태를 바꾸지 않음을 알릴 때 읽기 전용 도구끼리 가능해집니다.

A (오답, 서버 이름 혼동): `metrics`는 `create_sdk_mcp_server`에 준 이름이고, 도구 이름에 쓰이는 것은 `mcp_servers`의 키 `obs`입니다.

B (오답, 효과 없음): `idempotentHint`는 반복 호출이 추가 효과가 없다는 정보용 힌트이며 병렬 실행을 제어하지 않습니다.

C (오답, 다른 회사 SDK): `parallel_tool_calls`는 OpenAI 쪽 모델 설정 이름으로, `ToolAnnotations`의 정의된 필드가 아니며 병렬 실행에 영향을 주지 못합니다.

D (오답, 형식 오류): MCP 도구 이름은 점 표기가 아니라 `mcp__서버__도구` 형식이어서 `allowed_tools`와 일치하지 않습니다.

E (정답): 키 `obs` 기반 이름과 `readOnlyHint`가 맞습니다.

**근거 문서**: Claude Agent SDK › Give Claude custom tools › Call a custom tool, Add tool annotations · Claude Agent SDK › Connect MCP servers › Tool naming convention (SDK 버전: claude-agent-sdk 0.2.168)

---

## Q22. 승인 없이 실행되는 파일 쓰기를 실행 전에 차단하기

단일 선택 · 코드 빈칸 · 도메인 4 · L2

Claude Agent SDK(Python)로 무인 실행되는 코드 수정 에이전트를 운영합니다. `Write`와 `Edit`은 `allowed_tools`에 있어 승인 프롬프트 없이 실행됩니다. 이 설정에서도 `.env` 파일에 대한 쓰기는 도구가 실행되기 전에 거부되어야 하고, 거부 사유는 Claude에게 전달되어야 합니다.

```python
async def block_env_write(input_data, tool_use_id, context):
    path = input_data["tool_input"].get("file_path", "")
    if path.endswith(".env"):
        return {"hookSpecificOutput": {
            "hookEventName": input_data["hook_event_name"],
            [B]: "deny",
            "permissionDecisionReason": "Cannot modify .env files",
        }}
    return {}

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Write", "Edit"],
    hooks={[A]: [HookMatcher(matcher="Write|Edit", hooks=[block_env_write])]},
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"PostToolUse"`, \[B\] = `permissionDecision`

B. \[A\] = `"PreToolUse"`, \[B\] = `permissionDecision`

C. \[A\] = `"PreToolUse"`, \[B\] = `decision`

D. \[A\] = `"PermissionRequest"`, \[B\] = `permissionDecision`

E. \[A\] = `"before_tool_callback"`, \[B\] = `permissionDecision`

**정답: B**

**상세 해설**

`PreToolUse` 훅은 도구 호출 요청 직후 도구가 실행되기 전에 불리며, `hookSpecificOutput` 안의 `permissionDecision`을 `"deny"`로 반환하면 호출이 막히고 `permissionDecisionReason`이 Claude에게 거부 메시지로 전달됩니다. 이 차단은 `allowed_tools` 자동 승인과 무관하게 먼저 적용되므로 무인 실행에서도 유효합니다. `matcher`는 도구 이름만 거르므로 파일 경로 검사는 콜백 안에서 합니다.

A (오답, 너무 늦음): `PostToolUse`는 도구가 이미 실행된 뒤의 훅이라 파일이 이미 써집니다.

B (정답): 실행 전 훅과 `permissionDecision` 필드가 맞습니다.

C (오답, 인식되지 않는 필드): `PreToolUse`의 `hookSpecificOutput`이 읽는 결정 필드는 `permissionDecision`이며, 그 안의 `decision`은 인식되지 않아 훅이 아무 효과를 내지 못합니다.

D (오답, 발동 안 함): `PermissionRequest`는 권한 판단이 필요한 호출에서만 불리는데, 이 도구들은 이미 자동 승인되어 훅이 호출되지 않습니다.

E (오답, 다른 회사 SDK): `before_tool_callback`은 Google ADK의 콜백 이름이고 Claude Agent SDK의 `hooks` 키가 아닙니다.

**근거 문서**: Claude Agent SDK › Intercept and control agent behavior with hooks › How hooks work, Matchers, Outputs · Claude Agent SDK › How the agent loop works › Hooks (SDK 버전: claude-agent-sdk 0.2.168)

---

## Q23. 금액이 큰 환불만 사람 확인을 받기

단일 선택 · 코드 빈칸 · 도메인 4 · L2

Google ADK(Python)의 환불 에이전트가 `issue_refund` 도구를 호출합니다. 금액이 1,000을 넘는 호출은 실행 전에 사람의 확인을 받아야 하고, 그 이하는 확인 없이 바로 실행되어야 합니다. 확인 필요 여부는 도구 입력값으로 판단하는 함수가 정하며, 함수가 참을 반환하면 확인을 요청합니다.

```python
from google.adk.agents import LlmAgent
from google.adk.tools import FunctionTool, ToolContext

async def needs_confirmation(amount: int, tool_context: ToolContext) -> bool:
    return [A]

def issue_refund(amount: int, order_id: str) -> dict:
    """Refund an order."""
    return {"status": "refunded", "amount": amount}

refund_agent = LlmAgent(
    name="refund_agent",
    model="gemini-flash-latest",
    tools=[FunctionTool(issue_refund, [B]=needs_confirmation)],
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `amount > 1000`, \[B\] = `require_confirmation`

B. \[A\] = `amount <= 1000`, \[B\] = `require_confirmation`

C. \[A\] = `amount > 1000`, \[B\] = `needs_approval`

D. \[A\] = `amount > 1000`, \[B\] = `before_tool_callback`

E. \[A\] = `amount <= 1000`, \[B\] = `needs_approval`

**정답: A**

**상세 해설**

ADK의 `FunctionTool`은 `require_confirmation`에 불리언 또는 함수를 받습니다. 함수를 주면 도구 입력값(예: `amount`)으로 호출되고, 참을 반환할 때만 실행 전에 확인 요청이 발생합니다. 따라서 1,000 초과일 때 참을 반환하는 `amount > 1000`을 `require_confirmation`에 연결합니다.

A (정답): 참일 때 확인을 요구하므로 초과 조건이 맞고, 파라미터 이름도 `require_confirmation`입니다.

B (오답, 극성 반대): `amount <= 1000`이면 소액만 확인을 요구하고 고액은 바로 실행됩니다.

C (오답, 다른 회사 SDK): `needs_approval`은 OpenAI Agents SDK `function_tool`의 파라미터이며 ADK `FunctionTool`에는 없어 `TypeError`가 납니다.

D (오답, 다른 위치): `before_tool_callback`은 `FunctionTool`이 아니라 `LlmAgent`에 다는 콜백이며 시그니처도 `(tool, args, tool_context)`로 다릅니다.

E (오답, 두 가지 모두 틀림): 조건이 반대이고 파라미터도 ADK에 없는 이름입니다.

**근거 문서**: ADK Tool confirmation › Boolean confirmation, Advanced confirmation with a callable (SDK 버전: google-adk 2.12.0)

---

## Q24. 핸드오프를 넘나드는 도구 호출 계측

단일 선택 · 코드 빈칸 · 도메인 5 · L2

OpenAI Agents SDK(Python)에서 트리아지 에이전트가 전문 에이전트로 핸드오프하는 서비스입니다. 어느 에이전트에서 도구가 끝나든 에이전트 이름, 도구 이름, 그 시점까지 누적된 총 토큰을 한 곳에서 로그로 남기려 합니다. 훅 객체는 실행 호출에서 한 번만 전달합니다.

```python
class Metrics([A]):
    async def on_tool_end(self, context, agent, tool, result):
        log.info("%s %s %d", agent.name, tool.name, context.usage.total_tokens)

result = await Runner.run(triage_agent, user_text, [B]=Metrics())
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `AgentHooks`, \[B\] = `hooks`

B. \[A\] = `RunHooks`, \[B\] = `run_hooks`

C. \[A\] = `TracingProcessor`, \[B\] = `hooks`

D. \[A\] = `RunHooks`, \[B\] = `hooks`

E. \[A\] = `RunHooks`, \[B\] = `run_config`

**정답: D**

**상세 해설**

`RunHooks`는 실행 전체의 수명주기 이벤트(에이전트 시작·종료, LLM 호출, 도구 시작·종료, 핸드오프)를 한 객체에서 받으며 `Runner.run(..., hooks=...)`로 전달합니다. 핸드오프로 에이전트가 바뀌어도 같은 훅 객체가 호출되고, `context.usage`에 실행 중 누적 사용량이 담깁니다. 반면 `AgentHooks`는 개별 에이전트의 `hooks`에 붙입니다.

A (오답, 범위 불일치): `AgentHooks`는 `Agent(..., hooks=...)`에 붙이는 에이전트 단위 훅이어서 실행 호출에 넘기면 `RunHooks` 인스턴스가 아니라는 `TypeError`가 납니다.

B (오답, 없는 파라미터): `Runner.run`의 파라미터 이름은 `run_hooks`가 아니라 `hooks`입니다.

C (오답, 다른 종류): `TracingProcessor`는 트레이스·스팬을 내보내는 처리기이며 `on_tool_end` 훅 메서드를 정의하지 않습니다.

D (정답): 실행 단위 훅 클래스 `RunHooks`를 `hooks`로 전달합니다.

E (오답, 잘못된 위치): `RunConfig`에는 훅 객체를 받는 설정이 없고 `run_config`에 `Metrics`를 넘기면 맞지 않습니다.

**근거 문서**: OpenAI Agents SDK Lifecycle › RunHooks, AgentHooks · OpenAI Agents SDK Running agents › Runner.run options (SDK 버전: openai-agents 0.24.0)

---

## Q25. 도구 호출 순서와 의미 일치를 함께 평가하기

단일 선택 · 코드 빈칸 · 도메인 5 · L3

Google ADK(Python)로 환불 에이전트를 평가합니다. 에이전트는 반드시 `verify_identity`를 `issue_refund`보다 먼저 호출해야 하며, 그 사이나 앞뒤에 `lookup_order` 같은 다른 도구를 호출하는 것은 허용합니다. 최종 답변은 표현이 달라도 기준 응답과 의미가 같으면 통과해야 합니다. 평가 세트 폴더에는 `test_config.json`이 있습니다.

```python
import json, pathlib
from google.adk.evaluation.agent_evaluator import AgentEvaluator

config = {"criteria": {
    "tool_trajectory_avg_score": {"threshold": 1.0, "match_type": [A]},
    [B]: 0.8,
}}
pathlib.Path("refund_agent/evals/test_config.json").write_text(json.dumps(config))

async def main():
    await AgentEvaluator.evaluate(
        agent_module="refund_agent",
        eval_dataset_file_path_or_dir="refund_agent/evals/",
    )
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"EXACT"`, \[B\] = `"final_response_match_v2"`

B. \[A\] = `"IN_ORDER"`, \[B\] = `"final_response_match_v2"`

C. \[A\] = `"ANY_ORDER"`, \[B\] = `"final_response_match_v2"`

D. \[A\] = `"IN_ORDER"`, \[B\] = `"response_match_score"`

E. \[A\] = `"IN_ORDER"`, \[B\] = `"hallucinations_v1"`

**정답: B**

**상세 해설**

`tool_trajectory_avg_score`의 `match_type`은 `EXACT`(추가·누락 호출 없이 완전 일치), `IN_ORDER`(기대 호출이 순서대로 나타나면 되고 사이의 다른 호출은 허용), `ANY_ORDER`(순서 무관)가 있습니다. 필수 호출의 순서는 지키되 다른 호출은 허용하는 요구는 `IN_ORDER`입니다. 의미 일치는 LLM 심사로 기준 응답과 의미가 같은지 보는 `final_response_match_v2`가 맞고, `response_match_score`는 ROUGE-1 단어 겹침이라 표현이 바뀌면 점수가 떨어집니다.

A (오답, 너무 엄격): `EXACT`는 `lookup_order` 같은 추가 호출이 있으면 실패합니다.

B (정답): 순서가 있는 부분 일치와 의미 일치 기준이 맞습니다.

C (오답, 순서 미검증): `ANY_ORDER`는 `issue_refund`가 먼저 호출되어도 통과해 "신원 확인이 먼저" 조건을 검증하지 못합니다.

D (오답, 표현에 민감): `response_match_score`는 ROUGE-1 기반이라 같은 의미의 다른 표현을 거짓 실패로 판정합니다.

E (오답, 다른 목적): `hallucinations_v1`은 답변이 도구 출력 같은 컨텍스트에 근거했는지 보는 기준이며 기준 응답과의 의미 일치를 판정하지 않습니다.

**근거 문서**: ADK Evaluation criteria › tool\_trajectory\_avg\_score, response\_match\_score, final\_response\_match\_v2, hallucinations\_v1 · ADK Evaluate agents › test\_config.json (SDK 버전: google-adk 2.12.0)

---

## Q26. 최대 턴을 넘기면 예외 대신 대체 응답 반환하기

단일 선택 · 코드 빈칸 · 도메인 6 · L3

OpenAI Agents SDK(Python)의 리서치 에이전트는 매 라운드마다 모델이 도구를 호출하고(병렬 호출 포함) 결과를 받는 순차 도구 라운드를 최대 3번까지 허용합니다. 3번의 도구 라운드 뒤에는 최종 답변을 내는 호출이 한 번 더 필요합니다. 네 번째 도구 라운드가 필요해지면 예외를 던지지 말고 고정 안내문을 최종 출력으로 돌려줘야 합니다.

```python
from agents import Agent, Runner, RunErrorHandlerInput, RunErrorHandlerResult

def on_limit(data: RunErrorHandlerInput[None]) -> RunErrorHandlerResult:
    return RunErrorHandlerResult(final_output="Request too broad. Please narrow it.")

result = await Runner.run(
    research_agent,
    user_request,
    max_turns=[A],
    error_handlers={[B]: on_limit},
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `4`, \[B\] = `"max_turns"`

B. \[A\] = `3`, \[B\] = `"max_turns"`

C. \[A\] = `4`, \[B\] = `"MaxTurnsExceeded"`

D. \[A\] = `5`, \[B\] = `"max_turns"`

E. \[A\] = `3`, \[B\] = `"MaxTurnsExceeded"`

**정답: A**

**상세 해설**

Agents SDK의 `max_turns`는 에이전트 루프의 LLM 호출 횟수를 셉니다. 도구 라운드 3번이면 LLM 호출이 3번, 최종 답변 호출이 1번이라 4번이 필요하므로 `max_turns=4`이며, 모델이 네 번째 도구 라운드를 요청하면 다섯 번째 호출이 한도를 넘어 처리기가 실행됩니다. 처리기는 `error_handlers` 딕셔너리에서 오류 종류 키 `"max_turns"`로 등록합니다.

A (정답): 도구 라운드 3번과 최종 답변 1번을 허용하고 네 번째 도구 라운드는 처리기로 보냅니다.

B (오답, 한도 부족): `3`이면 세 번째 도구 라운드 뒤의 최종 답변 호출이 네 번째 턴이어서 정상 실행이 대체 응답으로 바뀝니다.

C (오답, 잘못된 키): `error_handlers`의 키는 `"max_turns"`, `"model_refusal"`, `"invalid_final_output"`이며 예외 클래스 이름은 키가 아니라서 처리기가 등록되지 않고 `MaxTurnsExceeded`가 그대로 발생합니다.

D (오답, 한도 과다): `5`이면 네 번째 도구 라운드와 그 뒤 최종 호출까지 허용되어 "3번까지" 조건을 어깁니다.

E (오답, 두 가지 모두 틀림): 한도가 부족하고 키도 잘못되어 있습니다.

**근거 문서**: OpenAI Agents SDK Running agents › Max turns, Error handlers · OpenAI Agents SDK Exceptions › MaxTurnsExceeded (SDK 버전: openai-agents 0.24.0)

---

## Q27. 검색 문서를 에이전트에 넘기기 전 모더레이션 검사

단일 선택 · 코드 빈칸 · 도메인 2 · L1

OpenAI Python SDK를 쓰는 리서치 에이전트가 웹에서 가져온 본문을 모델에 넘기기 전에 Moderation API로 검사합니다. 아래 함수는 본문이 통과하면 `True`를, 유해 가능성이 있다고 판정되면 `False`를 돌려주어야 합니다.

```python
from openai import OpenAI

client = OpenAI()

def passes_screen(text: str) -> bool:
    resp = client.moderations.create(
        model="omni-moderation-latest",
        input=text,
    )
    result = resp.[A]
    return not result.[B]
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `results`, \[B\] = `flagged`

B. \[A\] = `data[0]`, \[B\] = `flagged`

C. \[A\] = `results[0]`, \[B\] = `flagged`

D. \[A\] = `results[0]`, \[B\] = `categories`

E. \[A\] = `results[0]`, \[B\] = `blocked`

**정답: C**

**상세 해설**

OpenAI Moderation 가이드에 따르면 응답은 `id`, `model`, `results` 목록으로 구성되고, 입력 하나에 대한 판정은 `results`의 항목에 담깁니다. 각 항목에는 전체 판정인 `flagged`(유해 가능성이 있으면 true), 범주별 true/false인 `categories`, 범주별 점수인 `category_scores`가 있습니다. 따라서 입력이 하나이면 `results[0]`을 꺼내 `flagged`로 분기하는 것이 맞습니다.

A (오답, 형 불일치): `results`는 목록이므로 `.flagged` 속성이 없어 AttributeError가 납니다.

B (오답, 다른 API의 응답 모양): `data[0]`은 임베딩 응답에서 쓰는 형태입니다. 모더레이션 응답에는 `data` 필드가 없습니다.

C (정답): `results[0].flagged`가 입력 전체에 대한 불리언 판정입니다.

D (오답, 항상 참): `categories`는 범주별 불리언을 담은 객체라 `not` 결과가 늘 `False`가 되어 모든 본문을 막습니다. 전체 판정 필드가 아닙니다.

E (오답, 없는 필드): `blocked`라는 필드는 응답에 없습니다.

**근거 문서**: OpenAI API Docs › Moderation › Quickstart · OpenAI API Docs › Moderation › The moderation endpoint (SDK 버전: openai 3.35.1)

---

## Q28. 웹 페이지 본문을 도구 결과로 돌려줄 때의 블록 구성

단일 선택 · 코드 빈칸 · 도메인 2 · L3

Anthropic Python SDK로 만든 요약 에이전트가 `fetch_page` 도구를 호출했고, 개발자가 가져온 외부 페이지 본문을 다음 요청에 담아 보냅니다. 페이지에는 공격자가 심어 둔 지시문이 있을 수 있습니다. 요구 사항은 다음과 같습니다.

- 외부 본문은 시스템 프롬프트나 일반 텍스트에 섞지 않고, 출처와 본문 경계가 분명한 구조로 전달한다.
- 개발자의 요약 요청은 외부 본문과 같은 블록에 넣지 않는다.

```python
tu = next(b for b in resp.content if b.type == "tool_use")
url = tu.input["url"]
page = fetch_page(url)
followup = client.messages.create(
    model=MODEL, max_tokens=1024, system=POLICY, tools=TOOLS,
    messages=[
        {"role": "user", "content": question},
        {"role": "assistant", "content": resp.content},
        {"role": "user", "content": [
            {"type": [A], "tool_use_id": tu.id, "content": [B]},
            {"type": "text", "text": "위 페이지를 세 줄로 요약해 줘."},
        ]},
    ],
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"tool_result"`, \[B\] = `json.dumps({"source": url, "text": page})`

B. \[A\] = `"text"`, \[B\] = `f"<page>{page}</page>"`

C. \[A\] = `"tool_result"`, \[B\] = `page + "\n\n세 줄로 요약하라."`

D. \[A\] = `"tool_use"`, \[B\] = `json.dumps({"source": url, "text": page})`

E. \[A\] = `"input_text"`, \[B\] = `page`

**정답: A**

**상세 해설**

Anthropic의 인젝션 완화 문서는 제3자 콘텐츠를 `tool_result` 블록에만 넣고 시스템 프롬프트나 일반 사용자 텍스트 블록에는 넣지 말라고 합니다. 또 신뢰할 수 없는 문자열은 가능하면 JSON 객체로 감싸 JSON 이스케이프가 경계 역할을 하게 하고 출처를 밝히며, 개발자의 지시는 도구 결과 안이 아니라 `tool_result` 뒤의 사용자 턴에 두라고 합니다. 코드는 `tool_result`를 `tool_use_id`로 호출과 묶고, 요약 요청을 같은 턴의 별도 `text` 블록에 둡니다.

A (정답): `tool_result` 블록에 출처와 본문을 JSON으로 감싸 넣었고, 지시는 별도 텍스트 블록에 있습니다.

B (오답, 블록 종류): 외부 본문을 일반 텍스트 블록에 넣는 방식은 문서가 피하라고 한 구조입니다. 태그 구분은 공격자가 닫는 태그를 흉내 낼 수 있어 JSON 이스케이프만큼 경계가 단단하지 않고, `tool_use_id`가 있는 자리에 `text`는 쓸 수 없습니다.

C (오답, 지시 혼입): 도구 결과 안에 개발자의 지시를 섞으면 어디까지가 본문인지 모호해지고, 같은 모양의 문장을 공격자도 본문에 심을 수 있습니다. 문서는 자기 지시를 도구 결과에 넣지 말라고 합니다.

D (오답, 방향이 반대): `tool_use`는 모델이 도구를 호출할 때 어시스턴트가 내는 블록이며, 도구 실행 결과를 돌려주는 블록이 아닙니다.

E (오답, 다른 회사 형식): `input_text`는 OpenAI Responses API의 입력 콘텐츠 형식이며 Anthropic Messages API의 블록 종류가 아닙니다.

**근거 문서**: Anthropic Docs › Mitigate jailbreaks and prompt injections › Prompt injection(Put untrusted content only in tool results, JSON-encode untrusted content, Don't put your own instructions in tool results) · Anthropic Docs › Tool use › Handle tool calls (SDK 버전: anthropic 1.15.0)

---

## Q29. 쓰기 도구를 실행 전에 거부하는 훅

단일 선택 · 코드 빈칸 · 도메인 3 · L2

Claude Agent SDK(Python)로 읽기 전용 점검 세션을 만듭니다. 모델이 `Write`나 `Edit` 도구를 부르면 실제 파일이 바뀌기 전에, 사용자 확인 창 없이 항상 거부되어야 합니다.

```python
from claude_agent_sdk import ClaudeAgentOptions, HookMatcher

async def deny_writes(input_data, tool_use_id, context):
    return {
        "hookSpecificOutput": {
            "hookEventName": input_data["hook_event_name"],
            "permissionDecision": [B],
            "permissionDecisionReason": "읽기 전용 세션입니다",
        }
    }

options = ClaudeAgentOptions(
    hooks={[A]: [HookMatcher(matcher="Write|Edit", hooks=[deny_writes])]}
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"PostToolUse"`, \[B\] = `"deny"`

B. \[A\] = `"PreToolUse"`, \[B\] = `"block"`

C. \[A\] = `"UserPromptSubmit"`, \[B\] = `"deny"`

D. \[A\] = `"PreToolUse"`, \[B\] = `"ask"`

E. \[A\] = `"PreToolUse"`, \[B\] = `"deny"`

**정답: E**

**상세 해설**

Agent SDK 훅 문서에 따르면 `PreToolUse`는 도구 호출 요청 시점에 실행되어 호출을 막거나 바꿀 수 있고, 콜백은 `hookSpecificOutput`에 `permissionDecision`(`allow`, `deny`, `ask`, `defer`)과 사유를 담아 돌려줍니다. `matcher`는 도구 이름에 적용되므로 `"Write|Edit"`는 두 도구에만 훅을 겁니다. 실행 전에 확인 없이 거부하려면 `PreToolUse`와 `deny` 조합이어야 합니다.

A (오답, 시점): `PostToolUse`는 도구가 실행된 뒤의 결과를 받는 이벤트라 이미 파일이 바뀐 다음입니다.

B (오답, 없는 값): `permissionDecision`에는 `block`이라는 값이 없고 `allow`, `deny`, `ask`, `defer` 중에서 고릅니다.

C (오답, 이벤트): `UserPromptSubmit`은 사용자 프롬프트 제출 시점의 이벤트라 도구 호출 단위로 걸리지 않습니다.

D (오답, 요구 불충족): `ask`는 사용자에게 승인을 묻는 결정이라 "확인 창 없이 항상 거부" 조건에 어긋납니다.

E (정답): 실행 전 이벤트에서 `deny`를 반환해 호출을 막습니다.

**근거 문서**: Claude Agent SDK Docs › Hooks › Configure hooks, Outputs, Add context and block a tool (SDK 버전: claude-agent-sdk 0.2.168)

---

## Q30. ADK 에이전트에서 쓰기 도구 호출 차단

단일 선택 · 코드 빈칸 · 도메인 3 · L2

Google ADK(Python)로 주문 조회 에이전트를 만듭니다. 읽기 전용 모드에서는 `update_order`와 `cancel_order` 함수가 실제로 실행되면 안 되고, 그 외 도구는 정상 실행되어야 합니다. 아래 콜백은 에이전트가 도구를 실행하기 직전에 호출됩니다.

```python
from google.adk.agents import LlmAgent

WRITE_TOOLS = {"update_order", "cancel_order"}

def guard(tool, args, tool_context):
    if tool.name in WRITE_TOOLS:
        return {"error": "읽기 전용 모드에서는 쓸 수 없습니다."}
    return [B]

agent = LlmAgent(
    name="orders", model="gemini-flash-latest",
    tools=[get_order, update_order, cancel_order],
    [A]=guard,
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `before_model_callback`, \[B\] = `None`

B. \[A\] = `before_tool_callback`, \[B\] = `None`

C. \[A\] = `before_tool_callback`, \[B\] = `{}`

D. \[A\] = `pre_tool_use`, \[B\] = `None`

E. \[A\] = `after_tool_callback`, \[B\] = `None`

**정답: B**

**상세 해설**

ADK 콜백 문서에 따르면 `before_tool_callback`은 `tool`, `args`, `tool_context`를 받아 도구 실행 직전에 호출되며, 딕셔너리를 반환하면 도구의 `run_async`가 건너뛰어지고 그 딕셔너리가 도구 결과가 됩니다. `None`을 반환하면 도구가 (수정된 `args`로) 실행됩니다. 문서는 `{}` 같은 빈 딕셔너리도 `None`이 아니므로 재정의로 취급된다고 하여, 실행을 허용하려면 `None`을 반환하라고 합니다.

A (오답, 콜백 종류): `before_model_callback`은 LLM 요청 직전에 호출되며 `tool`, `args`를 받지 않습니다.

B (정답): 도구 실행 직전 콜백이고, 허용 경로는 `None`으로 돌려 도구가 실행되게 합니다.

C (오답, 빈 딕셔너리): `{}`도 재정의로 취급되어 읽기 도구까지 실행되지 않고 빈 결과만 돌아갑니다.

D (오답, 다른 제품의 이름): `pre_tool_use`는 ADK의 `LlmAgent` 매개변수가 아닙니다. Claude 계열 훅 이름을 흉내 낸 것입니다.

E (오답, 시점): `after_tool_callback`은 도구가 이미 실행된 뒤에 호출되므로 쓰기가 막히지 않습니다.

**근거 문서**: Agent Development Kit Docs › Callbacks: Observe, Customize, and Control Agent Behavior › Before Tool Callback · Agent Development Kit Docs › Callbacks › Design Patterns and Best Practices(Guardrails) (SDK 버전: google-adk 2.12.0)

---

## Q31. 응답을 서버에 저장하지 않고 대화 잇기

단일 선택 · 코드 빈칸 · 도메인 4 · L3

OpenAI Python SDK의 Responses API를 쓰는 상담 서비스가 추론 모델로 두 턴 대화를 합니다. 개인정보 방침상 응답이 OpenAI 쪽에 저장되어서는 안 되며, 둘째 호출에서도 첫 호출의 추론 항목을 포함한 이력이 모델에 전달되어야 합니다.

```python
opts = {"model": MODEL, "reasoning": {"effort": "low"}, "store": [A]}
history = [{"role": "user", "content": "환불 규정을 알려 줘."}]

first = client.responses.create(input=history, **opts)
history += [B]
history.append({"role": "user", "content": "그럼 부분 환불은?"})

second = client.responses.create(input=history, **opts)
print(second.output_text)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `True`, \[B\] = `first.output`

B. \[A\] = `False`, \[B\] = `first.output_text`

C. \[A\] = `False`, \[B\] = `[first.id]`

D. \[A\] = `False`, \[B\] = `first.output`

E. \[A\] = `True`, \[B\] = `first.output_text`

**정답: D**

**상세 해설**

OpenAI 문서에 따르면 Responses API는 응답을 기본으로 30일 저장하며 `store`를 `false`로 보내면 저장하지 않습니다. 저장하지 않는 상태(stateless)에서는 애플리케이션이 이력을 직접 들고 있어야 하므로, 응답의 `output` 배열 항목을 모두 보존해 다음 요청의 `input`에 이어 붙입니다. 추론 모델은 이 `output`에 추론 항목(암호화된 추론 내용 포함)이 들어 있어 그대로 되돌려 보내야 합니다. `previous_response_id`로 잇는 방식은 서버에 저장된 응답을 전제로 합니다.

A (오답, 요구 위반): `store`가 `True`이면 응답이 저장되어 개인정보 방침을 어깁니다.

B (오답, 이력 손실): `output_text`는 문자열이라 목록에 `+=` 하면 글자 단위로 쪼개져 들어가고, 추론 항목도 전달되지 않습니다.

C (오답, 저장 전제): 응답 ID는 저장된 응답을 가리키는 값이라, 저장하지 않은 응답은 ID로 이어 갈 수 없고 입력 항목도 아닙니다.

D (정답): 저장을 끄고 `output` 항목 전체를 이력에 더해 둘째 호출에 전달합니다.

E (오답, 두 가지 모두): 저장이 켜져 있고 추론 항목도 빠집니다.

**근거 문서**: OpenAI API Docs › Reasoning models › Preserve reasoning without stored responses · OpenAI API Docs › Conversation state › Manually manage conversation state (SDK 버전: openai 3.35.1)

---

## Q32. 벡터 인덱스 차원에 맞춘 OpenAI 임베딩 생성

단일 선택 · 코드 빈칸 · 도메인 2 · L1

사내 문서 검색 서비스의 벡터 DB 인덱스가 256차원으로 고정되어 있습니다. 팀은 OpenAI Python SDK로 임베딩을 만들 때, 3072나 1536차원 벡터를 받아 직접 잘라 쓰지 않고 API 요청 단계에서 출력 차원을 줄이려 합니다.

- 사용 모델은 출력 벡터를 짧게 줄여도 의미 표현이 유지되도록 학습된 임베딩 모델이어야 합니다.

```python
from openai import OpenAI

client = OpenAI()
resp = client.embeddings.create(
    model=[A],
    input=chunks,
    [B]=256,
)
vectors = [d.embedding for d in resp.data]
print(len(vectors[0]))
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `text-embedding-ada-002`, \[B\] = `dimensions`

B. \[A\] = `text-embedding-3-small`, \[B\] = `dimensions`

C. \[A\] = `text-embedding-3-small`, \[B\] = `output_dimensionality`

D. \[A\] = `text-embedding-3-large`, \[B\] = `encoding_format`

E. \[A\] = `text-embedding-ada-002`, \[B\] = `output_dimensionality`

**정답: B**

**상세 해설**

OpenAI `embeddings.create`의 `dimensions` 파라미터는 출력 임베딩의 차원 수를 지정하며, `text-embedding-3` 이후 모델에서만 지원됩니다. 임베딩 가이드에 따르면 text-embedding-3-small과 text-embedding-3-large는 차원을 줄여도 개념 표현 특성을 잃지 않도록 학습되었고, 생성 시 `dimensions`를 쓰는 방식이 권장됩니다.

A (오답, 모델 오류): text-embedding-ada-002는 `dimensions`를 지원하지 않는 이전 세대 모델입니다. 파라미터 이름은 맞지만 모델이 맞지 않습니다.

B (정답): 차원 축소를 지원하는 text-embedding-3 계열 모델과 OpenAI의 파라미터 이름 `dimensions`가 모두 맞습니다.

C (오답, 다른 회사 파라미터): `output_dimensionality`는 Google Gemini 임베딩(google-genai `EmbedContentConfig`)의 이름이며 OpenAI SDK의 `embeddings.create`에는 없는 인자입니다.

D (오답, 다른 용도 파라미터): `encoding_format`은 `float` 또는 `base64` 같은 반환 형식을 정하는 인자이며 차원과 무관합니다. 256이라는 정수도 허용되지 않습니다.

E (오답, 모델과 파라미터 모두 오류): ada-002는 차원 축소를 지원하지 않고, `output_dimensionality`도 OpenAI SDK의 인자가 아닙니다.

**근거 문서**: OpenAI API Docs › Vector embeddings › Reducing embedding dimensions · OpenAI API Reference › Embeddings › Create embeddings (`dimensions`) (SDK 버전: openai 2.54.0)

---

## Q33. Gemini 임베딩의 작업 유형(task type) 지정

단일 선택 · 코드 빈칸 · 도메인 2 · L2

고객 지원 센터는 Google Gen AI Python SDK(google-genai)의 `gemini-embedding-001` 모델로 FAQ 문서를 미리 임베딩해 벡터 DB에 색인합니다. 사용자가 자연어로 질문을 입력하면 같은 모델로 질문을 임베딩해 가장 가까운 문서를 찾습니다. 문서 쪽과 질문 쪽은 검색 용도에 맞게 서로 다른 작업 유형을 지정해야 합니다. 대상 문서는 코드가 아니라 일반 안내문입니다.

```python
from google import genai
from google.genai import types

client = genai.Client()
doc_emb = client.models.embed_content(
    model="gemini-embedding-001",
    contents=faq_articles,
    config=types.EmbedContentConfig(task_type=[A]),
)
query_emb = client.models.embed_content(
    model="gemini-embedding-001",
    contents=user_question,
    config=types.EmbedContentConfig(task_type=[B]),
)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `"SEMANTIC_SIMILARITY"`, \[B\] = `"SEMANTIC_SIMILARITY"`

B. \[A\] = `"RETRIEVAL_QUERY"`, \[B\] = `"RETRIEVAL_DOCUMENT"`

C. \[A\] = `"CLASSIFICATION"`, \[B\] = `"CLUSTERING"`

D. \[A\] = `"RETRIEVAL_DOCUMENT"`, \[B\] = `"RETRIEVAL_QUERY"`

E. \[A\] = `"RETRIEVAL_DOCUMENT"`, \[B\] = `"CODE_RETRIEVAL_QUERY"`

**정답: D**

**상세 해설**

Gemini API 임베딩 가이드는 `gemini-embedding-001`에서 `task_type`으로 용도를 지정해 임베딩을 최적화할 수 있다고 설명합니다. 색인 대상 문서는 `RETRIEVAL_DOCUMENT`, 일반 검색 질의는 `RETRIEVAL_QUERY`를 씁니다. 문서와 질의를 서로 다른 유형으로 임베딩하는 비대칭 검색 구성입니다. 참고로 `gemini-embedding-2`는 `task_type` 필드를 쓸 수 없으므로 이 코드는 `gemini-embedding-001` 기준입니다.

A (오답, 검색 용도 미지정): `SEMANTIC_SIMILARITY`는 추천이나 중복 탐지처럼 텍스트 간 유사도를 보는 용도입니다. 문서와 질의를 구분하는 검색 최적화가 아닙니다.

B (오답, 순서 뒤바뀜): 문서를 질의 유형으로, 질의를 문서 유형으로 임베딩해 역할이 반대로 지정되었습니다.

C (오답, 다른 용도): `CLASSIFICATION`은 감성이나 스팸 같은 사전 라벨 분류용, `CLUSTERING`은 유사 텍스트 묶기용입니다. 검색 질의/문서 쌍으로 쓰지 않습니다.

D (정답): 문서는 `RETRIEVAL_DOCUMENT`, 질문은 `RETRIEVAL_QUERY`로 지정합니다.

E (오답, 코드 검색용 질의): `CODE_RETRIEVAL_QUERY`는 자연어 질의로 코드 블록을 찾을 때 쓰는 유형이며, 일반 안내문 검색에는 맞지 않습니다.

**근거 문서**: Gemini API Docs › Embeddings › Supported task types · Gemini API Docs › Embeddings › Embedding models (SDK 버전: google-genai 2.31.0)

---

## Q34. Gemini 지도 파인튜닝 작업 생성 (학습·검증 데이터)

단일 선택 · 코드 빈칸 · 도메인 3 · L2

팀은 Google Gen AI Python SDK(google-genai)로 Gemini Enterprise Agent Platform(구 Vertex AI)에서 지도 파인튜닝 작업을 만듭니다. 클라이언트는 `vertexai=True`로 초기화되어 있고 학습 파일과 별도 검증 파일은 Cloud Storage에 JSONL로 올려 두었습니다. 학습 데이터는 `tune()`의 `training_dataset`으로 넘기고, 검증 데이터와 학습 데이터 전체를 몇 번 반복할지는 `CreateTuningJobConfig` 안에서 지정하려 합니다.

```python
from google import genai
from google.genai import types

client = genai.Client(vertexai=True, project=PROJECT_ID, location="us-central1")
job = client.tunings.tune(
    base_model=BASE_MODEL,
    training_dataset=types.TuningDataset(gcs_uri="gs://my-bucket/train.jsonl"),
    config=types.CreateTuningJobConfig(
        [A]=types.TuningValidationDataset(gcs_uri="gs://my-bucket/val.jsonl"),
        [B]=3,
        tuned_model_display_name="faq-sft",
    ),
)
print(job.name)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `validation_dataset`, \[B\] = `epoch_count`

B. \[A\] = `validation_dataset`, \[B\] = `n_epochs`

C. \[A\] = `eval_dataset`, \[B\] = `epoch_count`

D. \[A\] = `validation_dataset`, \[B\] = `epochs`

E. \[A\] = `test_dataset`, \[B\] = `num_train_epochs`

**정답: A**

**상세 해설**

google-genai의 `client.tunings.tune()`은 `base_model`, `training_dataset`, `config`를 받습니다. 검증 데이터는 `CreateTuningJobConfig.validation_dataset`에 `TuningValidationDataset`(GCS URI의 JSONL)으로 넘기며, 학습 데이터 전체를 반복하는 횟수는 `epoch_count`입니다. 검증 데이터를 지정하면 학습 중 검증 지표를 볼 수 있습니다.

A (정답): `validation_dataset`과 `epoch_count`는 `CreateTuningJobConfig`의 실제 필드입니다.

B (오답, 다른 회사 이름): `n_epochs`는 OpenAI 파인튜닝의 하이퍼파라미터 이름입니다. OpenAI 파인튜닝은 신규 사용자에게 제공되지 않으므로 이 방식을 쓸 수도 없습니다.

C (오답, 존재하지 않는 필드): `eval_dataset`이라는 필드는 `CreateTuningJobConfig`에 없습니다.

D (오답, 다른 SDK의 인자): `epochs`는 Vertex AI SDK의 `sft.train()` 인자 이름이며, google-genai의 `CreateTuningJobConfig`에서는 `epoch_count`를 씁니다.

E (오답, 존재하지 않는 이름): `test_dataset`과 `num_train_epochs`는 이 설정 객체에 없는 이름이고, 후자는 오픈소스 학습 라이브러리 관례에서 온 이름입니다.

**근거 문서**: Gemini Enterprise Agent Platform Docs › Tune Gemini models by using supervised fine-tuning · googleapis/python-genai README › Tunings (SDK 버전: google-genai 2.31.0)

---

## Q35. 튜닝 작업 완료 대기와 튜닝된 모델 호출

단일 선택 · 코드 빈칸 · 도메인 3 · L3

google-genai 클라이언트(`vertexai=True`)로 Gemini 지도 파인튜닝 작업을 시작한 뒤 완료될 때까지 기다렸다가 튜닝된 모델로 응답을 생성하려 합니다. `job`은 작업을 만든 시점의 스냅샷이므로 반복할 때마다 서버에서 최신 상태를 다시 받아와야 하고, 생성 호출의 `model`에는 튜닝 결과로 배포된 호출 대상을 넘겨야 합니다.

```python
import time

done = {"JOB_STATE_SUCCEEDED", "JOB_STATE_FAILED", "JOB_STATE_CANCELLED"}
job = client.tunings.tune(base_model=BASE_MODEL, training_dataset=train_ds)
while job.state not in done:
    time.sleep(30)
    job = [A]
if job.state == "JOB_STATE_SUCCEEDED":
    resp = client.models.generate_content(model=[B], contents="환불 규정을 알려 주세요.")
    print(resp.text)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `client.tunings.get(name=job.tuned_model_display_name)`, \[B\] = `job.tuned_model.endpoint`

B. \[A\] = `client.tunings.get(name=job.name)`, \[B\] = `job.name`

C. \[A\] = `client.tunings.get(name=job.base_model)`, \[B\] = `job.base_model`

D. \[A\] = `client.operations.get(job)`, \[B\] = `job.tuned_model.endpoint`

E. \[A\] = `client.tunings.get(name=job.name)`, \[B\] = `job.tuned_model.endpoint`

**정답: E**

**상세 해설**

python-genai README의 Tunings 예제는 `client.tunings.get(name=tuning_job.name)`을 반복 호출해 `state`가 `JOB_STATE_SUCCEEDED`, `JOB_STATE_FAILED`, `JOB_STATE_CANCELLED` 중 하나가 될 때까지 기다린 뒤, `generate_content`의 `model`에 `tuning_job.tuned_model.endpoint`를 넘깁니다. 작업은 작업 리소스 이름(`job.name`)으로 조회하고, 추론은 튜닝 결과의 엔드포인트로 호출한다는 구분이 핵심입니다.

A (오답, 조회 키 오류): `tuned_model_display_name`은 사람이 읽는 표시 이름이지 작업 리소스 이름이 아니므로 `get(name=...)`에 쓸 수 없습니다. \[B\]는 맞습니다.

B (오답, 추론 대상 오류): 조회는 맞지만, `job.name`은 튜닝 작업의 리소스 이름이라 추론 대상 모델이 아닙니다.

C (오답, 기본 모델 지정): `job.base_model`은 튜닝의 출발점이 된 기본 모델이며, 이 값으로 작업을 조회하거나 호출하면 튜닝 결과가 반영되지 않습니다.

D (오답, 다른 종류의 조회): `client.operations.get`은 장기 실행 작업(operation) 조회용으로, 튜닝 작업 조회는 `client.tunings.get`입니다. 인자 형태도 맞지 않습니다. \[B\]는 맞습니다.

E (정답): `client.tunings.get(name=job.name)`으로 최신 상태를 받고, 호출 대상으로 `job.tuned_model.endpoint`를 씁니다.

**근거 문서**: googleapis/python-genai README › Tunings · Gemini Enterprise Agent Platform Docs › Tune Gemini models by using supervised fine-tuning (SDK 버전: google-genai 2.31.0)

---

## Q36. 기본 모델 대비 튜닝 모델 쌍대 비교 평가

단일 선택 · 코드 빈칸 · 도메인 4 · L3

Gemini 모델을 파인튜닝한 뒤, 같은 테스트 질문에 대해 기본 모델의 답변보다 튜닝 모델의 답변이 더 나은지 승률로 확인하려 합니다. Gen AI evaluation 서비스의 Vertex AI SDK(`vertexai.evaluation`)를 쓰며, 데이터프레임에는 `prompt` 열만 있고 두 모델의 추론은 평가 도중 수행합니다. 튜닝 모델은 google-genai 클라이언트로 엔드포인트를 호출하는 함수 `tuned_fn`으로 감쌌습니다.

```python
from vertexai.evaluation import EvalTask, PairwiseMetric, MetricPromptTemplateExamples

def tuned_fn(prompt: str) -> str:
    return client.models.generate_content(model=TUNED_ENDPOINT, contents=prompt).text

metric = PairwiseMetric(
    metric="pairwise_qa_quality",
    metric_prompt_template=MetricPromptTemplateExamples.get_prompt_template(
        "pairwise_question_answering_quality"),
    [A]=BASE_MODEL_ID,
)
task = EvalTask(dataset=eval_df, metrics=[metric])
result = task.evaluate([B]=tuned_fn)
print(result.summary_metrics)
```

&#91;A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

A. \[A\] = `candidate_model`, \[B\] = `baseline_model`

B. \[A\] = `baseline_model_response_column_name`, \[B\] = `model`

C. \[A\] = `baseline_model`, \[B\] = `model`

D. \[A\] = `reference`, \[B\] = `prompt_template`

E. \[A\] = `baseline_model`, \[B\] = `response_column_name`

**정답: C**

**상세 해설**

`EvalTask` 문서의 쌍대(pairwise) 평가 예제는 모델 추론 단계를 포함할 때 기준이 되는 모델을 `PairwiseMetric`의 `baseline_model`로, 비교 대상(후보) 모델을 `EvalTask.evaluate()`의 `model`로 넘기도록 안내합니다. `model`에는 모델 이름 문자열, `GenerativeModel`, 또는 `prompt` 문자열을 받아 응답 문자열을 돌려주는 함수를 줄 수 있습니다. 따라서 기본 모델이 baseline, 튜닝 모델 함수가 후보가 되며, `summary_metrics`에 양쪽 승률이 계산됩니다.

A (오답, 존재하지 않는 인자 / 위치 뒤바뀜): `PairwiseMetric`에 `candidate_model` 인자는 없습니다. `candidate_model`은 문서 예제에서 변수 이름일 뿐이고 `evaluate()`의 `model`로 전달됩니다.

B (오답, 열 이름 인자): `baseline_model_response_column_name`은 `evaluate()`의 인자로, 이미 있는 응답 열의 이름을 지정하는 용도(자체 응답 제공 방식)입니다. `PairwiseMetric`의 인자가 아닙니다.

C (정답): 기본 모델을 `baseline_model`로, 튜닝 모델 함수를 `evaluate(model=...)`로 넘깁니다.

D (오답, 용도 불일치): `reference`는 정답 참조 열 이름이고 `PairwiseMetric`의 인자가 아니며, `prompt_template`에 함수를 넘길 수도 없습니다.

E (오답, 후보 지정 방식 오류): `response_column_name`은 데이터프레임 안 응답 열의 이름을 문자열로 지정하는 인자라, 추론 함수를 받지 않습니다.

**근거 문서**: Vertex AI Python SDK Reference › vertexai.evaluation › EvalTask (Usage Examples 5, 쌍대 평가) · vertexai.evaluation › PairwiseMetric (SDK 버전: google-cloud-aiplatform 2.5.0)

## 검수 메모 (출제 전 확인)

- 지문에 코드 블록이 있는 문항이 문제은행 내보내기에서 정상으로 나오는지 먼저 시험해야 합니다. 기존에는 지문 안의 표가 사라졌습니다.
- 이 문항들은 공식 문서를 모두 읽고 쓴 것이 아니라 SDK 서명·필드와 일부 문서로 확인했습니다. 특히 MCS Q34\~Q36은 구글 클라우드 튜닝·평가 문서 본문을 읽지 못했고, Q36의 `vertexai.evaluation`이 기준일에도 유지되는지는 레퍼런스 페이지 존재만 확인했습니다. `BASE_MODEL`은 기준일의 지원 모델 목록을 확인하지 못해 자리표시자로 두었습니다.
- ADA Q06(병렬 tool\_result를 user 메시지 하나로 돌려주는 규칙)은 Claude 문서 페이지에 직접 서술이 없어 일반 동작으로 확인했습니다. ADA Q02, Q09, Q14의 오답 사유는 SDK 서명과 문서에서 추론했습니다.
- ASX Q28은 기존 ASX 탭의 tool\_result 배치 문항과 같은 지식을 코드로 묻습니다. ASX Q29와 AEP Q22는 기존 문항과 PreToolUse 주제가 겹치고, AEP Q25도 같은 제품의 기존 문항과 겹칩니다. MCS Q32도 `dimensions`를 쓰는 기존 배치 비용 문항과 소재가 일부 겹칩니다. 묻는 관점은 각각 다르지만 중복으로 볼지 판단이 필요합니다.
- ASX Q27의 모더레이션은 입력 유해성 스크리닝이며 인젝션 전용 방어는 아닙니다. ASX Q30의 `gemini-flash-latest` 별칭은 정답과 무관하지만 존재 여부를 확인하지 못했습니다. ASX Q31은 문서상 stateless에서 암호화 추론 항목이 기본 포함되어 `include` 대신 이력 재전송을 빈칸으로 했습니다.
- AEP Q25의 `match_type` 키는 공식 문서 예시에 없고 google-adk 소스와 criteria 페이지 설명으로 확인했습니다. AEP Q22에서 자동 승인된 도구에는 PermissionRequest 훅이 불리지 않는다는 서술은 문서 설명에 기반한 추론입니다. AEP Q16(ADK 2.x Workflow)과 Q18(온디맨드 compaction)은 신규 API라 문서 절 이름이 바뀔 수 있습니다.
- ADK 2.12.0에서 SequentialAgent, ParallelAgent, LoopAgent가 deprecated여서 AEP 문항에서 쓰지 않았습니다. 설치 환경의 anthropic 패키지 버전이 1.15.0으로 표시되었으며, 모델 ID(gpt-6-astra, gemini-3.8-flash, claude-sonnet-5-5)는 문서 기준일 기준의 값입니다.
- 이 유형을 정식 도입하면 가이드 공통 원칙의 "필기(객관식 단일·복수 선택)" 문구와 시험별 문항 수 설명을 함께 고쳐야 합니다.
