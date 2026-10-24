const split=s=>s.trim().split('\n');module.exports={
core:{
modules:split(`A1 AI, models, and the service landscape
A2 Prompting, reasoning, and personalization
A3 Workflow automation and workspaces
B1 API integration fundamentals
B2 Tool calling and MCP
B3 Knowledge, retrieval, and multimodality
B4 Evaluation and optimization
C1 Agent design and orchestration
C2 Agent frameworks and interoperability
C3 Context, memory, and sessions
C4 Safe execution and human oversight
D1 Performance, cost, and capacity
D2 Enterprise platforms, administration, and lifecycle management
D3 Packaging, deployment, and serving
D4 Observability, evaluation operations, and releases
E1 LLM and agent security
E2 Policies, behavior principles, and frontier safety
E3 Data protection and compliance`),
lessons:split(`How LLMs generate answers
Mapping models: tiers, reasoning, and multimodality
Three providers: apps, plans, and features
The wider AI service ecosystem
The structure of effective instructions
Reasoning models and reasoning effort
Improving consistency and accuracy
Personalization and memory
Projects and knowledge spaces
Custom assistants: GPTs and Gems
Connectors and app integrations
Agent and research features
Gemini Enterprise workflow agents
An overview of message APIs
Streaming and long-running requests
Errors, versions, and compatibility conventions
Structured outputs and refusal handling
Token counting and request size
How function calling works
Designing effective tools
Server-side tools: search, code execution, and web fetching
MCP: a standard for connecting tools
Embeddings and vector search
Choosing a RAG architecture
Evidence and citations: grounding
Image, PDF, and document inputs
AI search and SQL functions in data platforms
Evaluation design fundamentals
Diagnosing improvements: context or behavior?
Tuning methods: SFT, DPO, and RFT
What is an agent?
Five workflow patterns
Multi-agent systems and handoffs
Agent execution: sessions and environments
Coding agents: Claude Code and Gemini CLI
The components of the OpenAI Agents SDK
Claude Agent SDK and Skills
The components of Google ADK
A2A: an inter-agent protocol
Context engineering
Compaction and context editing
External memory
Session and state management
Guardrails and approvals
Permission modes and sandboxes
Hooks: controlling execution before and after actions
Risks of computer use and code execution
Prompt and context caching
Batch, flex, and priority processing
Rate limits and quotas
Latency and cost optimization
Reading pricing tables and attributing usage
The roles of enterprise products and APIs
AI gateways and shared search
Migration and end of support
Reliability patterns through architecture frameworks
Container images and Compose
Kubernetes deployment, probes, and resources
GPU scheduling and autoscaling
Model serving and registries
Inference gateways and AI conformance standards
OpenTelemetry and GenAI observability
LLM observability: Datadog, MLflow, Databricks, and Snowflake
Evaluation gates and releases
SLOs and incident response
Threat modeling and attack surfaces
Defending against prompt injection and jailbreaks
Filtering, moderation, and safety settings
Red teaming and safety evaluation
Authentication, authorization, and secrets management standards
Common structures in usage policies
Model behavior principles: Model Spec and Constitution
Frontier safety frameworks
Responsible AI principles and tools
Data retention and use for training
Regions, residency, and encryption keys
GDPR and privacy principles
Audits, certifications, and compliance`),
outcomes:split(`Explain tokens, context windows, and probabilistic generation in your own words.
Distinguish hallucinations caused by knowledge cutoffs, context limits, and the generation process.
Explain the roles of large, mid-sized, and lightweight model tiers.
Choose model tiers based on task difficulty and latency requirements.`)},
alf:{
modules:split(`1. How generative AI produces answers
2. How instruction structure changes results
3. Product formats and feature categories
4. Responsible use and data
5. Adoption value and organizational considerations`),
lessons:split(`Tokens and context windows: how models read
Probabilistic generation and the causes of hallucination
Reasoning models and model tiers
Multimodal inputs and knowledge cutoffs
Clear and specific instructions
Specifying examples and output formats
Providing context through roles, background, files, and images
Breaking complex tasks into steps
Improving results through iteration
Chat apps, projects, and knowledge spaces
Custom assistants: GPTs, Gems, and instructions
Connectors and agent features
Choosing between coding agents, APIs, and other product formats
Common prohibited uses across three providers
Data retention and training use by plan
Identifying sensitive information and using admin controls
Verifying generated content and checking sources
Subscription pricing and token-based pricing
Selecting and prioritizing use cases
Metrics for measuring adoption impact
The purpose of frontier safety frameworks`),
outcomes:split(`Explain what tokens and context windows mean.
Describe the relationship between input length and response quality.
Explain how models select the next token probabilistically.
Distinguish hallucinations caused by knowledge cutoffs, insufficient context, and the generation process.`)},
asf:{
modules:split(`1. OpenAI services and features
2. Anthropic services and features
3. Google services and features
4. Comparing and choosing across three providers
5. AI ethics and responsible use
6. The wider AI service ecosystem`),
lessons:split(`The ChatGPT landscape: models, features, and plans
Projects, personalization, and search
App connections and agents
Codex, data analysis, and deep research
The Claude app and its plans
Projects and Research
Artifacts and file creation
Connectors and Claude Code
The Gemini app and Live
Gems and Workspace integration
Deep Research and Gemini Notebook
AI Studio and the Gemini API
One task, different choices: comparing three providers
The boundaries between coding tools, APIs, and consumer services
Read and execution permissions and approval requirements
Uncertainty and verification
Protecting personal and confidential information
Bias and fairness
Disclosure, human oversight, and misuse prevention
Search and research services: Perplexity and Liner
Open model platforms: Hugging Face Hub
Generative tools and embedded AI: Firefly`),
outcomes:split(`Distinguish companies, models, products, features, and plans.
Classify items in the ChatGPT feature overview by their respective layers.
Explain the roles of projects, personalization, and web search.
Identify which features address recurring context and up-to-date information needs.`)},
wfa:{
modules:split(`1. Instruction and prompt design
2. Building knowledge-based assistants
3. Connectors and agent workflows
4. Sharing, permissions, and data management
5. Quality checks and improvement`),
lessons:split(`System instructions versus in-conversation instructions
Writing examples, output formats, and constraints
Prioritizing lengthy instructions
Resolving instruction conflicts and unexpected behavior
Turning operational manuals into instructions
How uploaded files are used
File format and size limitations
Static and frequently changing resources
Uploads versus connectors: comparing maintenance effort
Comparing Gemini Notebook and knowledge spaces
Connectors and remote MCP servers
Read and write permissions and least privilege
How workspace agents operate
Approval checkpoints for hard-to-reverse actions
Gemini Enterprise workflow agents
Team and organization sharing boundaries
Administrative feature controls
Data retention in enterprise plans
Representative questions and reference answers
Failure types: omissions, fabrications, and formatting errors
Deciding what to improve: instructions, knowledge, or connectors`),
outcomes:split(`Explain how system-level and in-conversation instructions differ in persistence and scope.
Distinguish persistent rules from instructions that should be given with each request.
Explain principles for writing examples, output formats, and constraints.
Identify how to translate format requirements into instructions.`)},
ada:{
modules:split(`1. Prompt and context design
2. API integration and response control
3. Tool calling and external integrations
4. Retrieval augmentation and multimodality
5. Evaluation, cost, and latency optimization`),
lessons:split(`System instructions and few-shot examples
Delimiters, tags, and long-document placement
Instructions for reasoning models
Diagnosing inconsistency: instructions, examples, and formats
Conversation state and message APIs
Streaming and structured outputs
Reasoning effort and token counting
Rate limits, error codes, and retries
Tool schemas and the function-calling round trip
Parallel calls and result formats
Server-side tools versus custom tools
Remote MCP servers and better tool descriptions
Embeddings and vector search
Choosing long context, managed search, or custom RAG
Citations and grounding
Image, PDF, and file uploads
Success criteria and evaluation datasets
Code-based and model-based grading
Caching and batch processing: two ways to reduce costs
Model tiers and latency reduction`),
outcomes:split(`Explain the roles of system instructions and few-shot examples.
Distinguish problems best addressed by instructions from those best addressed by examples.
Explain the effects of delimiters, tags, and long-document ordering.
Identify how to organize documents, questions, and instructions separately.`)},
sda:{
modules:split(`1. Choosing models and reasoning configurations
2. Knowledge and data architecture
3. Performance and cost design
4. Security and data protection design
5. Reliability and quality design`),
lessons:split(`Performance, price, and speed across model tiers
Reasoning effort and context and output limits
Multimodal support and difficulty-based routing
The lowest-cost configuration that meets accuracy goals
Long context versus retrieval: scale boundaries
Managed search and custom RAG
Web grounding and citations
Contextual Retrieval and search quality
Prompt and context caching
Batch, flex, and priority processing tiers
Rate limits, quotas, and reserved throughput
Pricing combinations for different traffic types
Meeting latency targets
API retention and zero-retention options
Regional processing and abuse monitoring
Safety settings and minimal tool permissions
Translating protection requirements into configurations
Evaluation-driven development
Reducing hallucinations and improving consistency
End-of-support schedules and fallback strategies
Model migration procedures that reduce regression risk`),
outcomes:split(`Explain the trade-offs between performance, price, and speed across model tiers.
Match workload requirements to model characteristics to choose a suitable starting tier.
Explain the distinct roles of reasoning effort, context windows, and output limits.
Compare requirements with limits to determine feasibility and select appropriate design alternatives.`)},
aoa:{
modules:split(`1. Containerization and packaging
2. Kubernetes deployment and serving
3. Data and model platform operations
4. Observability and evaluation operations
5. Releases, reliability, and cost`),
lessons:split(`Image build best practices
Build secrets and exposure paths
Compose models and Model Runner
GPU reservations and configuration troubleshooting
Deployment rolling updates and rollbacks
The roles of three probe types
Requests, limits, QoS, and GPU requests
HPA and KEDA ScaledObject
Job, CronJob, and Secret
MLflow and Unity Catalog model registries
Model Serving endpoints
Permissions and data access controls
Snowflake AI functions and Cortex Search
Snowflake Model Registry and serving
OpenTelemetry and GenAI semantic conventions
Datadog LLM observability: instrumentation and spans
ml_obs metrics and cost_tags
Trace storage and evaluation results
Evaluation gates and scorers
Alias promotion and rollback
Rate limits and fallback strategies
Budget alerts versus enforced usage limits`),
outcomes:split(`Explain the roles of multi-stage builds, .dockerignore, and image tags.
Identify causes of image size and reproducibility issues in Dockerfiles.
Explain how build secrets are supplied.
Distinguish paths through which secrets can remain in images.`)},
aep:{
modules:split(`1. Agent architecture design
2. Context and memory management
3. Tool design and interoperability protocols
4. Safe execution and human oversight
5. Evaluation and observability
6. Deployment and operations`),
lessons:split(`What agents are and when not to use them
Workflow patterns: chaining, routing, and parallelization
Patterns: orchestrator-workers and evaluator-optimizer
Multi-agent systems and handoffs
Choosing the simplest architecture
Principles of context engineering
Context compaction
Context editing and tool-result cleanup
External memory: memory tools and Memory Bank
Isolating context with subagents
Designing tools for agents
MCP: a standard for connecting tools
A2A: an inter-agent protocol
Skills: packaging repeatable procedures
Computer use and code execution tools
Input and output guardrails
Tool approvals and human intervention
Permission modes, hooks, and sandboxes
The impact of prompt injection on agents
Agent tracing
Trajectory and final-outcome evaluation
Grader design and scoring
Online and offline evaluation and regression datasets
Locating failures and detecting regressions
Managed runtimes versus self-hosting
Session and state management
Per-step cost limits
Model end of support and gradual rollout`),
outcomes:split(`Explain the difference between workflows and agents.
Identify situations where agents should not be used.
Explain prompt chaining, routing, and parallelization.
Choose patterns that fit the characteristics of a task.`)},
sdp:{
modules:split(`1. Organizational requirements and adoption strategy
2. Enterprise platform architecture
3. Large-scale cost and capacity optimization
4. Integrating security and compliance
5. Migration and lifecycle management
6. Enterprise quality governance`),
lessons:split(`The roles of three enterprise apps and APIs
Benefits and trade-offs of multi-vendor operations
Mapping departmental requirements to configurations
Connecting adoption stages with governance
AI gateways and model routing
Shared search and document permission propagation
Central management of connectors and MCP
Reading reference architectures
Designing access separation between business units
Reserved throughput and capacity planning
Priority, flex, and batch processing
Caching at scale
Attributing usage by department
Designing pricing combinations for mixed traffic
Zero retention and regional processing
Admin controls and audit logs
Model Armor and filtering
Enterprise app security and Trust Centers
Balancing local regulations with operational simplicity
Reading end-of-support policies
API generation changes and platform renaming
Prompt portability
Planning model replacements across services
Shared evaluation criteria
Monitoring operational quality
Risk categories in three providers' safety frameworks
Aligning common release criteria`),
outcomes:split(`Explain the respective roles of ChatGPT Enterprise, Claude Enterprise, Gemini Enterprise, and API-based solutions.
Distinguish enterprise app administration features from controls teams must design for API-based solutions.
Explain the benefits and costs of multi-vendor operations.
Assess whether a vendor configuration fits organizational requirements.`)},
aop:{
modules:split(`1. Platform selection and architecture
2. Serving, scaling, and performance
3. Data, model lifecycle, and governance
4. Observability, SLOs, and incident response
5. Release automation, evaluation gates, and cost controls`),
lessons:split(`Inference gateways and Inference Extension
Kubernetes support lifecycles and releases
Kubernetes AI Conformance
Cross-region inference and data residency
Change planning under platform and regional constraints
GPU scheduling and DRA
HPA behavior and scaling stabilization
KEDA ScaledObject and event-driven scaling
Routing optimization and scale-to-zero
Snowpark container compute pools
Unity Catalog permissions and data access controls
Lineage: tracing impact
Alias promotion and the model lifecycle
Snowflake model access controls and Registry
Data protection requirements and promotion design
Datadog LLM metrics and cost tags
OpenTelemetry collection conditions and sensitive data detection
Cluster Agent and Autodiscovery
Observability in Snowflake and Databricks
SLOs and incident response sequencing
Evaluation gates and automation
Environment-specific prompt deployment and rollback
Budgets, quotas, and resource monitors
Billing usage aggregation and cost analysis
Change risks and the limits of cost controls`),
outcomes:split(`Explain the roles of InferencePool and inference gateways.
Distinguish standard load balancing from inference-aware routing.
Explain the Kubernetes release cycle and support lifecycle.
Identify how support schedules and API deprecations affect change planning.`)},
ses:{
modules:split(`1. LLM threat modeling
2. Defending against prompt injection and jailbreaks
3. Agent and tool security
4. Data protection
5. Red teaming and safety evaluation
6. Detection and response`),
lessons:split(`Attack surfaces in LLM systems
Reading trust boundaries and architecture diagrams
SAIF risk categories and controls
Prioritizing risk paths
Direct and indirect prompt injection
Jailbreak types and mitigations
System prompt leakage
Moderation and filtering services
Combining defense layers
Least privilege and tool approvals
Permission modes and pre-execution hooks
Sandboxes and computer-use risks
Trust in remote MCP servers
Designing separate read and write permissions
API retention and zero-retention options
Abuse-monitoring retention and logging policies
File storage and data lifecycles
Minimizing exposure in systems handling personal information
Red-team scope, scenarios, and documentation
Adversarial evaluation datasets
Automated attack generation and defense-effectiveness metrics
Balancing refusal rates and attack success rates
Abuse monitoring and anomalous usage patterns
Audit logs and key-leak response
Limiting the impact of injection incidents`),
outcomes:split(`Explain the process of attack surface analysis and threat modeling.
Distinguish user input, retrieved documents, web pages, tool outputs, and MCP servers as separate attack surfaces.
Identify trust boundaries in architecture diagrams.
Assess risks in data flows that cross trust boundaries.`)},
ags:{
modules:split(`1. Usage policies and model behavior principles
2. Data governance
3. Organizational usage controls
4. Responsible operating procedures
5. Frontier safety frameworks`),
lessons:split(`Common prohibited uses across three providers
Additional requirements for high-risk uses
The roles of Model Spec and Constitution
Responsibilities of operators and end users
Assessing internal use cases
Retention and training use: consumer, enterprise, and API
Zero-retention conditions and exceptions
Specialized data, including healthcare data
Regional processing and interpreting policy excerpts
Permitted-use criteria by data classification
Admin settings and feature-level access
Connector allowlists
Audit logs and compliance APIs
Security and compliance certifications and Trust Centers
Translating policies into admin settings
Decisions requiring human review
Disclosing AI use
Evaluation records and safety settings
Designing pre-release review procedures
OpenAI Preparedness Framework
Anthropic Responsible Scaling Policy (RSP)
Google Frontier Safety Framework
How access restrictions affect usage plans`),
outcomes:split(`Explain common prohibited-use categories across three providers.
Classify policy provisions as prohibited, restricted, or permitted.
Explain additional requirements for high-risk uses.
Classify tasks according to whether they constitute high-risk use.`)},
mos:{
modules:split(`1. Diagnosing and choosing an optimization path
2. Embeddings and retrieval models
3. Tuning methods and datasets
4. Evaluation and comparison
5. Serving and lifecycle management`),
lessons:split(`Two dimensions of optimization: context and behavior
Problems that prompting can solve
Problems that retrieval augmentation can solve
Problems that tuning can solve
Choosing a path: cost, data, and vendor constraints
Embedding fundamentals: vectors and similarity
Dimensions and task types
Multilingual and domain-specific embeddings
Contextual retrieval and search quality improvements
Choosing embedding models and dimensions
Supervised fine-tuning (SFT)
Direct preference optimization (DPO)
Reinforcement fine-tuning (RFT)
Preparing training data and hyperparameters
Diagnosing data quality problems
Success criteria and evaluation datasets
Code-based and model-based grading
Recognizing signs of overfitting
Measuring improvements over the base model
Designing comparative experiments
Serving tuned models and managing costs
The impact of base model end of support
Alternatives when tuning is discontinued and total cost of ownership`),
outcomes:split(`Explain the difference between insufficient context and behavior or formatting problems.
Classify failures along the context and behavior dimensions.
Explain which types of problems benefit from prompt improvements.
Recognize signs that prompt improvements have reached their limits.`)}
};
