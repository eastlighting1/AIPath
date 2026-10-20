# AI 운영 자격증 가이드 · AOA / AOP (가상)

Oct 20, 2026 · @Mathmedix

## 한눈에 보기

ALF 다음 길은 둘이다. ADA→AEP는 AI 서비스를 만들고, AOA→AOP는 만든 서비스를 굴린다. 새 두 자격증은 기존 ADA·AEP와 시험 규모를 맞췄다.

&#91;embedded content: 자격증 트랙 지도 · ALF에서 두 갈래\]

| 항목 | AOA (어소시에이트) | AOP (프로페셔널) |
| --- | --- | --- |
| 대응하는 기존 자격증 | ADA와 같은 규모 | AEP와 같은 규모 |
| 문항 수 · 시간 · 합격선 | 65문항 · 130분 · 72% | 75문항 · 180분 · 75% |
| 문제은행 | 85문항 | 95문항 |
| 선수 | ALF | AOA 합격 권장 (필수 아님, 제안) |
| 시험 구성 | 케이스 36 · 코드 빈칸 10 · 코드·설정 해석 8 · 이론 11 | 케이스 45 · 코드 빈칸 9 · 코드·설정 해석 13 · 이론 8 |
| 핵심 질문 | "AI 서비스를 배포하고 관측하는 기본 절차를 아는가" | "규모·비용·장애·거버넌스가 걸린 운영 결정을 내릴 수 있는가" |

코드는 AOA·AOP로 확정한다. 기존 코드와 겹치지 않고, ADA→AEP와 같은 "A + 영역 + 단계" 패턴이다.

## 설계 원칙과 범위 경계

두 자격증은 "이미 만든 AI 서비스를 안정적으로 굴리는 일"만 시험한다. 모델 학습, 앱 로직 작성, 보안 공격 기법은 기존 자격증이 맡는다.

| 구분 | 포함 | 제외 (담당 자격증) |
| --- | --- | --- |
| 패키징·배포 | Docker 이미지·Compose, 쿠버네티스 배포와 서빙 | 일반 클러스터 관리·노드 운영 (CKA 같은 외부 자격증) |
| 데이터·모델 플랫폼 | Databricks, Snowflake의 실험 추적·모델 등록·서빙·거버넌스·AI 함수 | 모델 튜닝·평가 방법론 (MCS) |
| 관측·운영 | Datadog, OpenTelemetry 기반 트레이싱·모니터·SLO·비용 | 보안 공격 기법과 방어 (ASX), 정책·규제 (RGV) |
| 릴리스 | 평가 게이트, 버전 관리, 카나리, 롤백, 폴백 | 앱·에이전트 로직 작성 (ADA, AEP) |
| 클라우드 사업자 | 다루지 않음 (AWS·Azure·Google의 매니지드 서비스는 범위 밖) | 해당 없음 |

**출제 규칙**

- 공식 문서에 베타·미리보기·legacy 표기가 없는 기능만 정답이 된다(표기가 아예 없으면 정식으로 보되 검수 때 한 번 더 확인한다). 미리보기·폐지 예정 기능은 정답이 될 수 없고, 오답 선택지로 쓸 때는 "정식 출시가 아니다"가 틀린 이유일 때만 쓴다.
- **제품 전용 문항**(Databricks·Snowflake·Datadog의 고유 문법·기능을 알아야 풀리는 문항)의 설계 목표는 시험 전체의 50% 이하, 제품 하나는 15% 이하다. 그런데 문제은행을 실제로 쓰고 시험 조립을 계산해 보니(2026-10-20), 케이스 세트를 통째로 뽑는 제약 아래에서 현재 은행이 달성할 수 있는 최소치는 AOA가 세 제품 합 54%·제품 하나 18%, AOP가 75%·25%였다. 그래서 이번 판의 시험 조립 상한은 이 값으로 두고, 목표치까지 내리려면 제품 중립 문항(Kubernetes·Docker·OpenTelemetry·공개 표준)을 은행에 더 넣어야 한다(아래 '열린 질문과 위험' 참조). Docker·Kubernetes·OpenTelemetry는 공개 표준으로 보고 이 비율에 넣지 않는다. 나머지는 제품 이름이 없어도 풀리는 운영 개념이다.
- 제품 지식은 공개된 "출제 범위 목록"(제품당 12\~15개 개념)에서만 나온다. 응시자는 목록 밖 지식을 몰라도 감점되지 않는다.
- 콘솔 메뉴 경로, 가격 숫자, 버전 번호 암기는 묻지 않는다. 설정·코드·명령·지표 해석을 묻는다.
- 케이스 세트는 한 세트 안에서 환경(회사가 쓰는 플랫폼)을 고정하고, 그 환경을 지문에 적는다.
- 기준일을 문서마다 적고, Databricks·Snowflake·Datadog은 분기 개정 사이에 월 1회 변경 점검을 한다.

## AOA 가이드 (AI 운영 어소시에이트)

AOA는 만들어진 AI 서비스를 컨테이너로 묶어 배포하고, 관측하고, 안전하게 릴리스하는 기본기를 확인한다. 대상은 백엔드·데이터·DevOps 경력 1\~2년 차 엔지니어이고, 선수는 ALF다. Docker와 쿠버네티스의 일반 관리는 범위 밖이다.

| 항목 | 내용 |
| --- | --- |
| 형식 | 필기 객관식 (단일·복수 선택) |
| 문항 수 · 시간 · 합격선 | 65문항 · 130분 · 72% |
| 구성 | 케이스 세트 9개(36문항) + 코드 빈칸 10 + 코드·설정 해석 8 + 이론 11 |
| 문제은행 | 85문항 (케이스 세트 12개 포함) |
| 기준일 | 2026-10-20 |

| 도메인 | 문항 수 | 중심 서비스 |
| --- | --- | --- |
| ① 컨테이너화·패키징 | 12 | Docker |
| ② 쿠버네티스 배포·서빙 | 13 | Kubernetes, KEDA |
| ③ 데이터·모델 플랫폼 운영 | 15 | Databricks, Snowflake |
| ④ 관측·평가 운영 | 13 | Datadog, OpenTelemetry |
| ⑤ 릴리스·안정성·비용 | 12 | 전 영역 (평가 게이트, 롤백, 비용) |

**출제 범위 목록 (정식 출시·공식 문서로 확인된 것만)**

- ① Dockerfile 모범 사례(멀티 스테이지, .dockerignore, 태그 고정, `--pull`), 빌드 시크릿(`--mount=type=secret`, ARG·ENV는 시크릿에 부적합), Compose `models:`(Compose v2.38 이상), Docker Model Runner(OpenAI 호환 API, 호스트 TCP 접근), Compose GPU 예약(`capabilities` 필수, `count`와 `device_ids` 동시 사용 불가), Docker Scout 개념
- ② Deployment 롤링 업데이트와 롤백, probe 3종의 역할, requests/limits, HPA v2, KEDA ScaledObject 기본 필드, Job·CronJob, Secret, 디바이스 플러그인 GPU 요청. 이 영역 일부는 조사 때 문서 본문을 못 읽어서 출제 전 원문 재확인이 필요하다
- ③ MLflow 추적, Unity Catalog 모델 레지스트리와 alias(stage는 미지원), Model Serving 유형(pay-per-token과 provisioned throughput), Unity Catalog 권한 기본, Snowflake AI 함수와 접근 권한, Cortex Search 서비스, Model Registry 버전과 alias
- ④ Datadog LLM 트레이싱 설정(Agent 유무, `ddtrace-run`), span 종류, `ml_obs.*` 지표, `cost_tags`, 평가 개념, OpenTelemetry GenAI 속성 이름
- ⑤ 평가 게이트(`mlflow.genai.evaluate`와 scorer), alias 승급과 롤백, 폴백·레이트 리밋 개념, 비용 통제(Databricks 예산, Snowflake 예산·사용자별 쿼터)

**출제하지 않는 것:** Docker MCP Catalog·Toolkit(베타), Docker Offload(조사 부족), Databricks Prompt Registry(베타), Snowflake Cortex Search 다중 인덱스(미리보기). 정답 근거로 쓸 수 없고, 오답 선택지로만 쓸 수 있다.

## AOP 가이드 (AI 운영 프로페셔널)

AOP는 규모·비용·장애·거버넌스가 함께 걸린 상황에서 운영 결정을 내리는 능력을 확인한다. 대상은 플랫폼·SRE 엔지니어로, 실무 3년 이상을 가정한다. AOA 합격은 권장이고 필수는 아니다(제안). AOA의 범위를 이미 아는 것으로 보고, 문항은 "무엇을 할 것인가"를 묻는다.

| 항목 | 내용 |
| --- | --- |
| 형식 | 필기 객관식 (단일·복수 선택) |
| 문항 수 · 시간 · 합격선 | 75문항 · 180분 · 75% |
| 구성 | 케이스 세트 9개(45문항) + 코드 빈칸 9 + 코드·설정 해석 13 + 이론 8 |
| 문제은행 | 95문항 (케이스 세트 11개 포함) |
| 기준일 | 2026-10-20 |

| 도메인 | 문항 수 | 무엇을 결정하는가 |
| --- | --- | --- |
| ① 플랫폼 선택·아키텍처 | 14 | 주어진 환경 안에서 게이트웨이·리전·적합성 인증·지원 수명 |
| ② 서빙·확장·성능 | 15 | GPU 스케줄링, 자동 확장, 고처리량 엔드포인트, 컴퓨트 풀 비용 |
| ③ 데이터·모델 수명주기·거버넌스 | 15 | 권한·마스킹·리니지, 모델 버전 승급, 모델 접근 통제 |
| ④ 관측·SLO·장애 대응 | 16 | 트레이스 누락 진단, 지표·비용 이상, 민감 정보 탐지, 인시던트 절차 |
| ⑤ 릴리스 자동화·평가 게이트·비용 통제 | 15 | 배포 파이프라인, 프롬프트·모델 롤백, 지출 통제 체계 |

**AOA와 다른 점**

- AOA는 "이 설정이 무엇을 하는가"를 묻고, AOP는 "여러 제약이 걸린 상황에서 무엇을 고를 것인가"를 묻는다.
- 버전 번호·날짜·수치 암기는 묻지 않는다. 결정에 필요한 수치(지원 종료일, 임계값)는 지문의 표로 주고 판단만 묻는다.
- 난이도는 L2\~L3 중심이고, 케이스 세트 하나가 도메인 2개 이상을 가로질러 나온다.

**출제 범위 목록 (정식 출시·공식 문서로 확인된 것만)**

- ① Gateway API Inference Extension(InferencePool은 v1 정식, InferenceObjective는 alpha이고 정의가 llm-d 라우터 저장소로 옮겨 감), CNCF Certified Kubernetes AI Conformance(체크리스트 버전별, 인증 유효기간 1년), 쿠버네티스 버전별 지원 종료 판단, Snowflake 교차 리전 추론(`CORTEX_ENABLED_CROSS_REGION`)
- ② Dynamic Resource Allocation(1.34부터 정식: ResourceClaim, DeviceClass, ResourceSlice), HPA 계산과 behavior, KEDA 0↔1 확장, Databricks 서빙 route optimization(생성 시에만 설정, custom·feature serving만, OAuth 토큰만), scale-to-zero의 운영 제약, Snowpark Container Services 컴퓨트 풀(`AUTO_SUSPEND_SECS`, GPU 요청 실패 조건)
- ③ Unity Catalog 권한 체계와 row filter·column mask 제약, 리니지 시스템 테이블, Databricks alias 승급, Snowflake 모델 접근 통제(`CORTEX_MODELS_ALLOWLIST` 폐지와 애플리케이션 역할 기반 권한), Snowflake Model Registry alias
- ④ Datadog `ml_obs.*` 지표와 `cost_tags`, OpenTelemetry 수집 조건(헤더, 필수 속성, `dd_llmobs_enabled`), Sensitive Data Scanner 평가기, Cluster Agent와 Autodiscovery 주석, Snowflake AI Observability, Databricks 트레이스 저장(실험 한도 100,000개, Unity Catalog 저장은 한도 없음), 인시던트 관리 개념
- ⑤ 평가 게이트, Datadog 프롬프트 관리의 환경별 배포와 롤백, Databricks 번들(`validate`→`deploy`→`run`), Snowflake의 자원 모니터 한계와 예산·사용자별 쿼터, Databricks 예산(하드캡 아님)과 청구 사용량 테이블 집계

**출제하지 않는 것:** Datadog 실험·플레이그라운드(조사 부족), Databricks Agent Bricks와 베타 기능, Snowflake Cortex Agents의 프리뷰 도구, SLO를 Datadog 모니터로 만드는 절차(문서 미확인). SLO는 제품 이름 없는 설계 개념으로만 묻는다.

## 문항 설계 공통 원칙

시험의 뼈대는 케이스 스터디 세트이고, 이론은 적게, 코드 빈칸과 코드·설정 해석은 조금씩 섞는다. 형식은 기존 자격증과 같은 필기 객관식(단일·복수 선택)이다.

| 유형 | 무엇을 묻는가 | 규칙 |
| --- | --- | --- |
| 케이스 세트 | 상황 판단: 원인 진단, 아키텍처 선택, 운영 절차 순서, 비용·장애 대응 | 지문 200\~350자 + 자료(로그·지표·설정 발촜) 1\~2개, 문항 AOA 4개 / AOP 5개. 문항은 서로 독립적으로 풀린다(앞 문항의 답을 몰라도 뒤 문항이 풀림) |
| 코드 빈칸 | 공식 문서의 설정·명령·API를 정확히 아는가 | Dockerfile, compose.yaml, K8s 매니페스트, SQL, Python SDK. 15줄 이내, \[A\]·\[B\] 빈칸 2개, 보기 5개 단일 선택 |
| 코드·설정 해석 | 이 설정을 적용하면 무슨 일이 일어나는가, 이 로그·지표의 원인은 무엇인가 | 코드·YAML·로그·지표 표 발촜 20줄 이내. 출력이나 동작을 예측하게 한다 |
| 이론·개념 | 용어 뜻이 아니라 짧은 상황에서의 선택 | 정의 암기 금지. 상황 한두 줄 + 선택 |

- 난이도는 L1(기본 개념 적용), L2(상황 판단), L3(여러 제약 동시 고려). AOA는 L1\~L2 중심, AOP는 L2\~L3 중심이다.
- 문항마다 공식 문서 URL, 기준일, 버전, 검증 수준(실행 확인 / 스키마 확인 / 문서 대조)을 기록한다.
- 오답 선택지는 각각 틀린 이유 한 줄을 갖는다. 이유가 "외운 규칙과 다르다"뿐인 선택지는 쓰지 않는다.
- "가장 좋은 방법" 같은 의견형 정답은 금지한다. 정답은 공식 문서의 동작이나 권장 사항으로 판정된다.
- 한 문제가 여러 제품의 우열을 묻지 않는다. "이 회사는 Databricks를 쓴다"는 환경 안에서 무엇을 할지를 묻는다.

## AOA 문항 설계

65문항의 블루프린트, 도메인×유형 배분, 제품 비율, 케이스 세트 12개, 샘플 문항을 정한다. 문제은행 85문항은 케이스 48(12세트×4) + 코드 빈칸 14 + 코드·설정 해석 10 + 이론 13이고, 도메인별로는 ① 15 · ② 17 · ③ 20 · ④ 17 · ⑤ 16이다. 시험 한 회는 12세트 중 9세트를 뽑는다.

### 블루프린트 (시험 65문항)

| 도메인 | 케이스 | 코드 빈칸 | 코드·설정 해석 | 이론 | 합계 |
| --- | --- | --- | --- | --- | --- |
| ① 컨테이너화·패키징 | 6 | 2 | 2 | 2 | 12 |
| ② 쿠버네티스 배포·서빙 | 7 | 2 | 1 | 3 | 13 |
| ③ 데이터·모델 플랫폼 운영 | 8 | 3 | 1 | 3 | 15 |
| ④ 관측·평가 운영 | 7 | 1 | 3 | 2 | 13 |
| ⑤ 릴리스·안정성·비용 | 8 | 2 | 1 | 1 | 12 |
| 합계 | 36 | 10 | 8 | 11 | 65 |

케이스 세트는 문항 4개가 서로 다른 도메인에 걸쳐 있을 수 있어, 표의 케이스 열은 문항별 도메인 태그 기준이다. 난이도는 L1 22 · L2 36 · L3 7을 목표로 한다(제안).

### 제품 전용 문항 배분

| 도메인 | Databricks | Snowflake | Datadog | 공개 표준·개념 | 합계 |
| --- | --- | --- | --- | --- | --- |
| ① | 0 | 0 | 0 | 12 | 12 |
| ② | 0 | 0 | 0 | 13 | 13 |
| ③ | 6 | 6 | 0 | 3 | 15 |
| ④ | 0 | 0 | 7 | 6 | 13 |
| ⑤ | 2 | 2 | 1 | 7 | 12 |
| 합계 | 8 | 8 | 8 | 41 | 65 |

설계안은 제품 하나 8문항(12.3%), 세 제품 합 24문항(36.9%)이었다. 작성된 은행(85문항)에서는 세 제품 전용 문항이 48문항이고, 케이스 세트를 통째로 뽑아야 해서 한 회에 가능한 최소는 합 35문항(54%), 제품 하나 12문항(18%)이다. 목표 상한(50%·15%)을 넘는 부분은 다음 개정에서 중립 문항을 더해 줄인다.

### 케이스 세트 목록 (문제은행 12세트)

| ID | 제목 | 환경 | 주요 도메인 | 근거 사실 |
| --- | --- | --- | --- | --- |
| A-01 | 로컬 개발 환경에서 모델 호출이 안 된다 | Docker Desktop | ① | Model Runner 호스트 TCP(기본 포트 12434)는 설정을 켜야 열린다, OpenAI SDK base\_url 경로 |
| A-02 | 모델 주소를 하드코딩하지 않는다 | Docker Compose | ① | `models:`의 `endpoint_var`·`model_var`, Compose v2.38 이상 |
| A-03 | GPU 서비스가 기동하지 않는다 | Docker Compose | ①② | `capabilities` 필수, `count`·`device_ids` 동시 사용 불가 |
| A-04 | 배포 직후 트래픽이 끊긴다 | Kubernetes | ②⑤ | probe 역할, 롤링 업데이트·롤백 (원문 재확인 필요) |
| A-05 | 질문이 몰리면 확장해야 한다 | Kubernetes, KEDA | ② | ScaledObject의 `pollingInterval`·`cooldownPeriod`, HPA v2 (HPA는 원문 재확인 필요) |
| A-06 | 배치 잡이 모델 버전을 고정해 둔다 | Databricks | ③ | Unity Catalog alias, stage 미지원 |
| A-07 | 서빙 엔드포인트 유형과 비용 | Databricks | ③⑤ | pay-per-token과 provisioned throughput, scale-to-zero 비권장 |
| A-08 | AI 함수 이름 변경과 권한 | Snowflake | ③ | `AI_` 접두 함수, `CORTEX_USER` 기본 부여, 이전 함수는 폐기 명시 없음 |
| A-09 | RAG 검색 결과가 오래된다 | Snowflake | ③ | Cortex Search `TARGET_LAG`, 초기화 옵션 |
| A-10 | 트레이스가 대시보드에 안 보인다 | Datadog | ④ | `ddtrace-run`과 `LLMObs.enable` 병행 금지, 필수 환경 변수, agentless, 루트 가능 span |
| A-11 | 팀별 LLM 비용이 급증한다 | Datadog | ④⑤ | `cost_tags`, `ml_obs.span.llm.total.cost`(나노달러 단위) |
| A-12 | AI 지출 상한을 걸고 싶다 | Snowflake, Databricks | ⑤ | Snowflake 리소스 모니터 한계와 예산·사용자별 쿼터, Databricks 예산은 하드캡 아님 |

### 케이스 세트 예: A-10

**지문.** 사내 질의응답 서비스(Python)를 Datadog LLM Observability에 연결했다. 컨테이너는 `ddtrace-run python app.py`로 기동하고, 코드 시작부에서 `LLMObs.enable(ml_app="qa-bot")`도 호출한다. 환경 변수는 `DD_API_KEY`만 있고 Datadog Agent는 설치되어 있지 않다. 대시보드에 트레이스가 나타나지 않는다.

| 문항 | 유형 | 무엇을 묻는가 | 정답 요지 |
| --- | --- | --- | --- |
| 1 | 케이스 | 가장 먼저 바꿔야 할 것 | `ddtrace-run`과 `LLMObs.enable`을 함께 쓰지 않는다. 한 방법만 고른다 |
| 2 | 코드 빈칸 | Agent 없이 켜는 코드의 빈칸 | `agentless_enabled=True`, `site=...` |
| 3 | 케이스 | 방금 추가한 retrieval span이 트레이스의 루트가 되지 않는 이유 | 루트가 될 수 있는 종류는 llm·workflow·agent뿐이다 |
| 4 | 케이스 | 팀별 비용을 보려면 | `tags`에 team을 넣고 `cost_tags`에 지정한다 |

문항은 서로 독립적이다. 2번의 빈칸 코드는 1번의 정답을 몰라도 풀린다. 근거: Datadog SDK 설정 문서, span 종류 문서, 비용 문서.

### 샘플 문항

**샘플 1 · 케이스 A-02 · 도메인 ① · L2 · 단일 선택**

팀은 compose.yaml에서 모델 주소를 코드에 하드코딩하지 않으려 한다. 필요한 Compose 버전은 충족한다고 할 때, 아래 파일로 `docker compose up`을 실행하면 app 서비스에 주입되는 환경 변수는?

```yaml
services:
  app:
    image: my-app
    models:
      llm:
        endpoint_var: AI_MODEL_URL
        model_var: AI_MODEL_NAME
models:
  llm:
    model: ai/smollm2
    context_size: 4096
```

A. `LLM_URL`, `LLM_MODEL`

B. `AI_MODEL_URL`, `AI_MODEL_NAME`

C. `LLM_PROVIDER_URL`, `LLM_PROVIDER_MODEL`

D. `AI_MODEL_URL`만 주입되고 모델 이름은 주입되지 않는다

E. `MODEL_RUNNER_URL`, `MODEL_RUNNER_MODEL`

**정답: B.** 긴 문법의 `endpoint_var`·`model_var`가 주입되는 변수 이름을 정한다. A는 `models: [llm]` 짧은 문법의 기본 이름이다. C는 `provider` 서비스 방식에서 의존 서비스가 받는 이름이다. D는 `model_var`를 지정했으므로 틀리다. E는 존재하지 않는 이름이다. 근거: Docker Compose models 문서. 검증: 문서 대조.

**샘플 2 · 코드 빈칸 · 도메인 ① · L1 · 단일 선택**

컨테이너가 GPU 1개를 예약하도록 compose.yaml의 빈칸을 채운다. \[A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          [A]: 1
          capabilities:
            - [B]
```

A. \[A\] = `count`, \[B\] = `gpu`

B. \[A\] = `count`, \[B\] = `nvidia`

C. \[A\] = `gpus`, \[B\] = `gpu`

D. \[A\] = `device_ids`, \[B\] = `gpu`

E. \[A\] = `limit`, \[B\] = `gpu`

**정답: A.** `count`는 GPU 개수(정수 또는 `all`)이고 `capabilities`는 필수 목록이다. B는 `nvidia`가 `driver` 값이라 틀리다. C와 E는 존재하지 않는 키다. D는 `device_ids`가 값 하나가 아니라 ID 목록을 받고, `count`와 함께 쓸 수 없다. 근거: Docker Compose GPU 문서. 검증: 문서 대조.

**샘플 3 · 코드·설정 해석 (케이스 A-06) · 도메인 ③ · L2 · 단일 선택**

배치 잡이 매일 밤 아래 코드로 모델을 불러온다. 어제 팀이 `client.set_registered_model_alias("prod.ml_team.iris_model", "Champion", 2)`를 실행했다. 오늘 밤 잡이 사용하는 모델 버전은?

```python
model = mlflow.pyfunc.load_model("models:/prod.ml_team.iris_model@Champion")
preds = model.predict(test_x)
```

A. 잡이 이전에 불러온 버전이 그대로 고정된다

B. 버전 2

C. 등록된 버전 중 번호가 가장 큰 버전

D. 오류가 난다. Unity Catalog 모델은 stage 없이는 불러올 수 없다

E. 워크스페이스 레지스트리의 Production stage 버전

**정답: B.** alias는 버전을 가리키는 이름표이고 바꿀 수 있어, 코드 변경 없이 다음 실행부터 새 버전을 쓴다. A는 버전 번호 URI(`.../1`)일 때의 동작이다. C는 alias가 최신 번호를 말한다는 오해다. D는 Unity Catalog가 stage를 지원하지 않고 alias를 쓴다는 사실과 반대다. E는 다른 레지스트리(legacy)의 개념이다. 근거: Databricks 모델 수명주기 관리 문서. 검증: 문서 대조 + MLflow SDK 서명 확인 예정.

**샘플 4 · 케이스 A-12 · 도메인 ⑤ · L2 · 단일 선택**

Snowflake를 쓰는 회사가 월 AI 크레딧 상한을 걸기 위해 `CREATE RESOURCE MONITOR ... TRIGGERS ON 100 PERCENT DO SUSPEND`를 만들어 적용했다. 이것으로 AI 함수 지출이 제한되는가?

A. 제한된다. 100%에 도달하면 AI 함수 호출이 중단된다

B. 제한되지 않는다. 리소스 모니터는 웨어하우스만 추적하고 서버리스 기능·AI 서비스는 추적하지 못한다

C. 제한된다. 단 Cortex Analyst만 제외된다

D. 제한되지 않는다. CORTEX\_USER 역할을 회수하는 것이 유일한 방법이다

E. 제한되지 않는다. Snowflake는 AI 지출을 제한하는 수단을 제공하지 않는다

**정답: B.** 리소스 모니터는 웨어하우스 전용이다. AI 지출은 예산(budget)과 사용자별 쿼터로 관리한다. C는 예산 쪽 예외를 리소스 모니터에 잘못 적용한 것이다. D와 E는 예산·쿼터 수단이 있다는 사실과 맞지 않는다. 근거: Snowflake AI 비용 관리·거버넌스 문서, 리소스 모니터 문서. 검증: 문서 대조.

**샘플 5 · 이론 · 도메인 ④ · L1 · 단일 선택**

Datadog Agent를 설치할 수 없는 환경에서 Python SDK로 LLM Observability를 켜는 방법으로 알맞은 것은?

A. `LLMObs.enable(ml_app=..., api_key=..., site=..., agentless_enabled=True)`를 호출한다

B. `ddtrace-run`으로 기동하면서 코드에서도 `LLMObs.enable()`을 호출한다

C. `DD_LLMOBS_ENABLED`만 설정하고 `DD_SITE`는 생략한다

D. `integrations_enabled=False`만 지정한다

E. OpenTelemetry는 지원하지 않으므로 Agent 설치가 유일한 방법이다

**정답: A.** Agent 없이 보내려면 `agentless_enabled=True`와 API 키가 필요하다. B는 병행이 금지된 두 방식이다. C는 `DD_SITE`가 필수다. D는 자동 계측 통합을 끄는 옵션이지 전송 방식이 아니다. E는 Datadog이 OpenTelemetry GenAI 트레이스를 받는다는 사실과 다르다. 근거: Datadog LLM Observability SDK 문서. 검증: 문서 대조 + ddtrace 시그니처 확인 예정.

## AOP 문항 설계

75문항의 블루프린트와 케이스 세트 11개를 정한다. 문제은행 95문항은 케이스 55(11세트×5) + 코드 빈칸 12 + 코드·설정 해석 17 + 이론 11이다. 시험 한 회는 11세트 중 9세트를 뽑는다. AOA보다 케이스 비중이 높고(60%), 코드·설정 해석이 늘어 "실제 설정을 읽고 원인을 짚는 능력"을 더 묻는다.

### 블루프린트 (시험 75문항)

| 도메인 | 케이스 | 코드 빈칸 | 코드·설정 해석 | 이론 | 합계 |
| --- | --- | --- | --- | --- | --- |
| ① 플랫폼 선택·아키텍처 | 8 | 1 | 3 | 2 | 14 |
| ② 서빙·확장·성능 | 9 | 2 | 2 | 2 | 15 |
| ③ 데이터·모델 수명주기·거버넌스 | 9 | 2 | 3 | 1 | 15 |
| ④ 관측·SLO·장애 대응 | 9 | 2 | 3 | 2 | 16 |
| ⑤ 릴리스 자동화·평가 게이트·비용 통제 | 10 | 2 | 2 | 1 | 15 |
| 합계 | 45 | 9 | 13 | 8 | 75 |

난이도 목표는 L1 8 · L2 37 · L3 30이다(제안). 문제은행의 도메인별 배분은 ① 17 · ② 19 · ③ 19 · ④ 20 · ⑤ 20(합 95)이다.

### 제품 전용 문항 배분

| 도메인 | Databricks | Snowflake | Datadog | 공개 표준·개념 | 합계 |
| --- | --- | --- | --- | --- | --- |
| ① | 0 | 1 | 0 | 13 | 14 |
| ② | 3 | 2 | 0 | 10 | 15 |
| ③ | 4 | 4 | 0 | 7 | 15 |
| ④ | 1 | 1 | 7 | 7 | 16 |
| ⑤ | 2 | 2 | 2 | 9 | 15 |
| 합계 | 10 | 10 | 9 | 46 | 75 |

설계안은 제품 하나 9\~10문항(12.0\~13.3%), 세 제품 합 29문항(38.7%)이었다. 작성된 은행(95문항)은 케이스 세트 11개 중 9개가 단일 제품이라 한 회에 가능한 최소가 합 56문항(75%), 제품 하나 19문항(25%)이다. 프로페셔널은 제품 선택과 운영 판단을 묻는 시험이라 제품 비중이 커지는 것을 이번 판에서는 받아들이고, 개정 때 중립 세트(Kubernetes 중심)를 늘리는 쪽으로 조정한다.

### 케이스 세트 목록 (문제은행 11세트)

| ID | 제목 | 환경 | 주요 도메인 | 근거 사실 |
| --- | --- | --- | --- | --- |
| P-01 | 1.34 클러스터에서 GPU 공유 전략 | Kubernetes | ①② | DRA는 1.34에서 이미 정식(resource.k8s.io/v1), 지원 종료일 표는 지문에서 제공 |
| P-02 | 추론 게이트웨이 도입 | Kubernetes | ①② | `InferencePool` v1 정식, `InferenceObjective` alpha, failureMode(기본값 FailClose)와 endpointPickerRef |
| P-03 | AI 적합성 인증 도입 검토 | CNCF | ① | 프로그램 시작 2025-11-11, 버전별 체크리스트, 유효기간 1년, 1.37에서 자동화 테스트 권장과 문서 기반 증명을 섞는 방식으로 바뀜 |
| P-04 | 고QPS 서빙 엔드포인트 | Databricks | ② | route optimization(생성 시에만, custom·feature serving만, OAuth만), scale-to-zero 비권장 |
| P-05 | 컨테이너 서빙의 비용과 기동 | Snowflake | ② | 컴퓨트 풀 `AUTO_SUSPEND_SECS` 기본값과 `AUTO_RESUME`, CPU 모델에 `gpu_requests`를 주면 빌드 실패, 엔드포인트 인증 실패는 404 |
| P-06 | 컴럼 마스킹과 검색 인덱스 | Databricks | ③ | row filter·column mask 제약(뷰 불가, 컬럼당 마스크 하나), ABAC, row filter·mask가 있는 테이블은 인덱스 불가 |
| P-07 | 모델 접근 통제 개편과 데이터 거주 | Snowflake | ①③ | `CORTEX_MODELS_ALLOWLIST` 폐지와 애플리케이션 역할 기반 권한, `CORTEX_ENABLED_CROSS_REGION` 값 |
| P-08 | OpenTelemetry 트레이스 누락 | Datadog | ④ | 헤더, 필수 속성, `dd_llmobs_enabled=false` 차단, 연산 이름→span 종류 매핑 |
| P-09 | 프롬프트·응답의 민감 정보 | Datadog | ④⑤ | Sensitive Data Scanner 평가기는 입력과 출력을 모두 검사, 정부 사이트 미지원 |
| P-10 | 릴리스 게이트와 롤백 | Databricks, Datadog | ⑤ | `mlflow.genai.evaluate`와 scorer, alias 승급, 프롬프트 환경별 배포·롤백, 번들 `validate`→`deploy`→`run` |
| P-11 | AI 지출 통제 체계 | Snowflake, Databricks | ⑤ | 리소스 모니터 한계, 예산·사용자별 쿼터, Databricks 예산은 하드캡 아님, 청구 사용량 집계의 정정 행 |

도메인×세트 배정(문항별 도메인 태그)은 문제 작성 단계에서 확정한다. 세트 하나가 도메인 2개 이상을 가로지르는 것이 정상이다.

### 케이스 세트 예: P-01

**지문.** 금융 서비스 팀이 GPU 노드가 있는 쿠버네티스 1.34 클러스터에서 추론 서비스 3개를 운영한다. GPU를 `nvidia.com/gpu` 정수로 요청해 왔지만, GPU 종류를 골라 쓰고 싶어 Dynamic Resource Allocation(DRA)을 쓰려 한다. 조직은 변경 동결 후 12개월 이상 지원이 유지되는 버전만 허용한다. 오늘은 2026-10-20이다. 지원 종료일은 1.34 2026-10-27, 1.35 2027-02-28, 1.36 2027-06-28, 1.37 2027-10-28다(표는 지문에 주어진다).

| 문항 | 유형 | 무엇을 묻는가 | 정답 요지 |
| --- | --- | --- | --- |
| 1 | 케이스 | 어느 버전으로 올릴까 | 12개월 이상 지원을 만족하는 것은 1.37뿐이다 |
| 2 | 이론 | GPU 종류를 고르는 클러스터 범위 리소스 | `DeviceClass` |
| 3 | 이론 | 노드의 사용 가능한 장치 목록을 게시하는 주체 | DRA 드라이버가 `ResourceSlice`를 게시한다 |
| 4 | 코드·설정 해석 | `spec.resourceClaims`와 `resources.claims`를 쓴 파드 매니페스트가 요청하는 것 | 클레임을 파드에 연결해 특정 종류의 장치를 요청한다 |
| 5 | 코드 빈칸 | `apiVersion`의 빈칸 | `resource.k8s.io/v1` |

근거: Kubernetes 릴리스 페이지, Dynamic Resource Allocation 문서.

### 샘플 문항

**샘플 1 · 케이스 P-01 · 도메인 ① · L3 · 단일 선택**

위 지문의 조건(12개월 이상 지원, DRA 사용)을 모두 만족하는 가장 적절한 결정은?

A. 1.34에 머물며 DRA를 켜서 쓴다

B. 1.35로 올린다

C. 1.36으로 올린다

D. 1.37로 올린다

E. DRA를 포기하고 디바이스 플러그인 방식을 유지한다

**정답: D.** DRA는 1.34에서 이미 정식이라 DRA 때문에 버전을 올릴 필요는 없지만, 오늘부터 12개월 뒤인 2027-10-20 이후까지 지원되는 버전은 1.37(2027-10-28)뿐이다. A는 지원 종료가 2026-10-27라 조건에 맞지 않는다. B는 2027-02-28, C는 2027-06-28에 지원이 끝난다. E는 클러스터 지원 종료 문제를 해결하지 못한다. 근거: Kubernetes 릴리스 페이지(기준일 2026-10-20), DRA 문서. 검증: 문서 대조. 지원 종료일은 지문의 표를 기준으로 판정한다.

**샘플 2 · 코드 빈칸 (케이스 P-08) · 도메인 ④ · L2 · 단일 선택**

OpenTelemetry로 보낸 GenAI 트레이스가 Datadog LLM Observability에 나타나도록 환경 변수를 설정한다. \[A\]와 \[B\]에 들어갈 값으로 알맞은 것은?

```
OTEL_EXPORTER_OTLP_TRACES_PROTOCOL=http/protobuf
OTEL_EXPORTER_OTLP_TRACES_HEADERS=dd-api-key=<KEY>,[A]=llmobs
OTEL_RESOURCE_ATTRIBUTES=[B]=true
```

A. \[A\] = `dd-otlp-source`, \[B\] = `dd_llmobs_enabled`

B. \[A\] = `dd-llmobs-source`, \[B\] = `dd_llmobs_enabled`

C. \[A\] = `dd-otlp-source`, \[B\] = `dd_otlp_enabled`

D. \[A\] = `dd-application-key`, \[B\] = `dd_llmobs_enabled`

E. \[A\] = `dd-otlp-source`, \[B\] = `dd_llmobs_agentless`

**정답: A.** 헤더 `dd-otlp-source=llmobs`가 수집 경로를 지정하고, 리소스 속성 `dd_llmobs_enabled=true`가 트레이스를 허용한다(span 하나라도 `false`면 트레이스가 막히는 것과 짝이다). B·C·E는 존재하지 않는 이름이다. D는 애플리케이션 키이지 수집 경로 지정이 아니다. 근거: Datadog OpenTelemetry 계측 문서. 검증: 문서 대조.

**샘플 3 · 코드·설정 해석 (케이스 P-11) · 도메인 ⑤ · L2 · 단일 선택**

Databricks 청구 사용량을 잡별로 집계하는 쿼리다. `HAVING usage_quantity != 0` 절이 필요한 이유는?

```sql
SELECT usage_metadata.job_id, usage_start_time, usage_end_time,
       SUM(usage_quantity) AS usage_quantity
FROM system.billing.usage
GROUP BY ALL
HAVING usage_quantity != 0
```

A. 정정(retraction) 행이 합산에서 상쇄되어 사용량이 0이 된 그룹을 결과에서 빼기 위해서다

B. 무료 사용량을 제외하기 위해서다

C. 예산 임계값을 넘은 잡만 남기기 위해서다

D. 서버리스 사용량만 남기기 위해서다

E. 중복 행을 제거하기 위해석다

**정답: A.** 사용량 테이블은 정정 시 음수 행(취소 행)을 남기므로 `usage_quantity`를 합산해야 실제 사용량이 나오고, 합이 0인 그룹은 의미가 없다. B·C·D는 이 절이 하는 일이 아니다. E는 취소 행이 중복이 아니라 반대 부호의 사용량이라는 점을 놓친다. 근거: Databricks 청구 시스템 테이블 문서. 검증: 문서 대조.

**샘플 4 · 이론 · 도메인 ④ · L1 · 단일 선택**

OpenTelemetry GenAI 규약에서 LLM 공급자를 나타내는 현재 속성 이름은?

A. `gen_ai.system`

B. `gen_ai.provider.name`

C. `gen_ai.vendor.name`

D. `gen_ai.model.provider`

E. `llm.provider`

**정답: B.** `gen_ai.provider.name`이 `gen_ai.system`을 대체했다. A는 이전 이름이다. C·D·E는 규약에 없다. 근거: OpenTelemetry GenAI 규약, Datadog OpenTelemetry 계측 문서. 검증: 문서 대조. 규약의 안정성 단계가 개발 중으로 표기되어 있어 속성 이름만 묻고 안정성은 묻지 않는다.

## 근거 문서·개정·검증

모든 정답은 공식 문서 한 페이지로 거슬러 올라가야 하고, 기준일은 2026-10-20이다. 이번 조사는 문서 본문이 아니라 요약으로 읽힌 페이지가 있어, 제품별로 확인 수준을 나눠 적는다.

| 제품 | 조사에서 확인한 수준 | 출제 전 검증 방법 |
| --- | --- | --- |
| Docker | 모델 러너, Compose `models`, GPU 예약, 빌드 시크릿 본문 확인. cache mount 구문과 HEALTHCHECK는 미확인 | compose.yaml은 `docker compose config`로 문법 확인 |
| Kubernetes·CNCF | 릴리스, DRA, InferencePool, KEDA, AI Conformance 본문 확인. Deployment·probe·HPA·CronJob·Secret·리소스는 요약만 읽음(원문 재확인 필요) | 매니페스트는 스키마 검증 도구로 확인 |
| Databricks | 문서 대조. 이름이 많이 바뀜(위 규칙 참고) | MLflow SDK를 설치해 함수 시그니처 확인. 계정 실행은 불가 |
| Snowflake | 문서 대조. `model!PREDICT`, Cortex Guard, 계정 제어 페이지 일부는 불러오지 못함 | snowflake-ml-python 시그니처 확인, SQL은 문서 대조 |
| Datadog·OpenTelemetry | 문서 대조. 대부분 페이지에 정식·미리보기 표기 없음 | ddtrace 시그니처 확인 |

문항별 검증 수준은 세 가지로 기록한다. 실행 확인(코드를 실제로 돌림), 스키마·시그니처 확인(SDK를 설치해 이름과 매개변수 대조), 문서 대조(문서만 대조). 이 세 제품은 계정 없이 돌릴 수 없어 실행 확인이 없고, 그만큼 근거가 기존 ADA·AEP보다 약하다.

**개정과 이름 변경 처리**

- 정기 개정은 분기 1회이고, Databricks·Snowflake·Datadog은 월 1회 변경 점검을 더한다. 변경이 보이면 영향받는 문항을 그달 안에 바꾼다.
- 이름이 바뀐 기능은 문항에 "현재 이름(이전 이름)"으로 병기하고, 이름 자체를 정답 근거로 삼지 않는다. 이번 조사에서 보인 사례는 Databricks Vector Search→AI Search(2026-06-01), Asset Bundles→Declarative Automation Bundles, 서빙 AI Gateway→legacy와 후속 Unity Gateway(2026-08-04 정식), Snowflake `COMPLETE`→`AI_COMPLETE`다.
- 폐지 예정인 설정은 폐지 시점을 묻지 않고 "대체 수단이 무엇인가"만 묻는다(예: Snowflake `CORTEX_MODELS_ALLOWLIST`).

**Sources (조사 때 열어 본 페이지)**

- Docker: [Model Runner](https://docs.docker.com/ai/model-runner/), [Compose models](https://docs.docker.com/ai/compose/models-and-compose/), [GPU 지원](https://docs.docker.com/compose/how-tos/gpu-support/), [빌드 시크릿](https://docs.docker.com/build/building/secrets/), [모범 사례](https://docs.docker.com/build/building/best-practices/), [MCP Catalog·Toolkit](https://docs.docker.com/ai/mcp-catalog-and-toolkit/)
- Kubernetes·CNCF: [릴리스](https://kubernetes.io/releases/), [Dynamic Resource Allocation](https://kubernetes.io/docs/concepts/scheduling-eviction/dynamic-resource-allocation/), [Gateway API Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/), [KEDA ScaledObject](https://keda.sh/docs/latest/reference/scaledobject-spec/), [AI Conformance](https://github.com/cncf/k8s-ai-conformance), [OpenTelemetry GenAI 규약](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- Databricks: [모델 수명주기](https://docs.databricks.com/aws/en/machine-learning/manage-model-lifecycle/), [Model Serving](https://docs.databricks.com/aws/en/machine-learning/model-serving/), [행·열 필터](https://docs.databricks.com/aws/en/tables/row-and-column-filters), [예산](https://docs.databricks.com/aws/en/admin/account-settings/budgets), [청구 시스템 테이블](https://docs.databricks.com/aws/en/admin/system-tables/billing)
- Snowflake: [AI 함수](https://docs.snowflake.com/en/user-guide/snowflake-cortex/aisql), [권한과 접근](https://docs.snowflake.com/en/user-guide/snowflake-cortex/aisql-privileges-and-access), [Cortex Search 생성](https://docs.snowflake.com/en/sql-reference/sql/create-cortex-search), [Model Registry 컨테이너 서빙](https://docs.snowflake.com/en/developer-guide/snowflake-ml/model-registry/container), [교차 리전 추론](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cross-region-inference), [리소스 모니터](https://docs.snowflake.com/en/user-guide/resource-monitors)
- Datadog: [Python SDK 설정](https://docs.datadoghq.com/llm_observability/instrumentation/sdk/?tab=python), [OpenTelemetry 계측](https://docs.datadoghq.com/llm_observability/instrumentation/otel_instrumentation/), [비용](https://docs.datadoghq.com/llm_observability/monitoring/cost/), [지표](https://docs.datadoghq.com/llm_observability/monitoring/metrics/)

## 열린 질문과 위험

문항 본문은 2026-10-20에 작성을 마쳤다(AOA 85문항, AOP 95문항). 아래는 작성하면서 드러난 위험과 사용자가 정해야 할 것이다. 제품 비율 상한 초과가 새로 확인된 가장 큰 위험이다.

- [x] 코드 AOA·AOP는 확정됨(2026-10-20), 변경 요청이 있을 때만 다시 연다
- [x] 입문 자격증 이름: 이번에 보여준 트랙 그림은 ALF(AI 리터러시)인데 기존 가이드 문서는 입문 코드를 AFP로 적었다. 같은 자격증인지 확인해야 한다
- [ ] AOP 응시에 AOA 합격을 필수로 할지, 권장으로 둘지(이번 판은 권장으로 가정하고 썼다)
- [x] 문제은행 분량: AOA 85·AOP 95는 ADA·AEP와 같은 숫자지만 케이스 세트 지문을 쓰는 수고가 더 크다. 같은 숫자로 둘지
- [ ] "표기가 없으면 정식으로 본다"는 규칙을 받아들일지 (Datadog 대부분과 Docker Model Runner가 해당. 이번 판은 받아들인 것으로 썼다)
- [ ] AWS·Azure·Google의 매니지드 AI 운영 서비스를 계속 범위 밖으로 둘지

| 위험 | 내용 | 대응 |
| --- | --- | --- |
| 제품 변경 속도 | Databricks는 이번 조사에서만 Vector Search→AI Search(2026-06-01), 게이트웨이 교체(2026-08-04), Agent Bricks 일부 legacy 전환(2026-10-12)이 확인됐다 | 분기 개정만으로는 부족하다. 월 점검과 이름 병기 |
| 조사 한계 | 일부 문서는 본문을 못 읽었다(쿠버네티스 Deployment·probe·HPA·CronJob·Secret·리소스, Docker cache mount·HEALTHCHECK, Snowflake `model!PREDICT`·Cortex Guard·계정 제어, Datadog 모니터 페이지) | 문항을 쓰면서 원문을 다시 확인했다. 그래도 근거가 약한 문항은 각 문제은행 탭 끝의 검수 메모에 모아 두었다 |
| 문서 간 충돌 | Snowflake 사용량 뷰의 대체 이름이 두 페이지에서 다르다(`CORTEX_AISQL_USAGE_HISTORY` / `CORTEX_AI_FUNCTIONS_USAGE_HISTORY`) | 해결 전까지 이 뷰 이름은 출제하지 않는다 |
| 정식 표기 없음 | Datadog 대부분, Snowflake Registry·Container Services·Feature Store·Cortex Analyst, Docker Model Runner에 GA·베타 표기가 없다 | 기능의 동작을 묻고 "정식인가"는 묻지 않는다 |
| 실행 검증 불가 | Databricks·Snowflake·Datadog 코드는 계정 없이 돌릴 수 없다 | 시그니처 확인으로 보완하고 문항에 검증 수준을 표시한다 |
| 공개 표준의 불안정 | OpenTelemetry GenAI 규약은 안정성 단계가 불확실하고 저장소도 옮겨졌다 | 속성 이름 문항만 내고 분기마다 점검한다 |
| 범위 부풀기 | Docker·쿠버네티스 일반 관리 문제가 섞여 들어올 수 있다 | 출제 범위 목록 밖 출제 금지 |

**문제은행을 쓰면서 드러난 위험**

- 제품 비중: 시험 조립 계산에서 최소 제품 전용 비율이 AOA 54%(제품 하나 18%), AOP 75%(25%)로 나왔다. 설계 목표(50%·15%)보다 높다. 중립 세트와 단독 문항을 늘리거나, 목표를 바꾸는 것 중 하나를 골라야 한다.
- AOP 난이도: 은행이 L3 중심(95문항 중 48)으로 쓰였다. 설계의 L1 8·L2 37·L3 30(75문항 기준)에 맞추려면 시험 조립 때 L3를 줄이고 쉬운 문항을 보충해야 한다.
- 단일 선택만: 은행의 모든 문항이 5지선다 단일 선택이다. 가이드의 '단일·복수 선택' 표현은 복수 선택 문항을 추가할 때만 유효하다.
- 실행 검증 한계: Databricks·Snowflake·Datadog 코드는 실계정에서 돌리지 못했다. 문항마다 검증 수준(실행 확인·시그니처 확인·문서 대조)을 적었고, 약한 문항은 검수 메모에 있다.
- 중복 가능성: 별칭 승격·번들 배포·scale-to-zero·HPA/KEDA는 AOA와 AOP에 비슷한 문항이 있을 수 있어, 두 시험을 동시에 준비하는 응시자에게 불필요하게 겹칠 수 있다.
