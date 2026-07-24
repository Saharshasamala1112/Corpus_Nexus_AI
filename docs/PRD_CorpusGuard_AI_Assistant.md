# Product Requirements Document

## CorpusGuard AI Assistant

| Field | Detail |
|---|---|
| **Document Title** | PRD — CorpusGuard AI Assistant |
| **Module** | CorpusGuard AI |
| **Platform** | Corpus Nexus AI |
| **Version** | 1.0 |
| **Author** | Saharsha |
| **Status** | Draft |
| **Last Updated** | 2026-07-22 |

---

## Table of Contents

1. [Vision](#1-vision)
2. [Objectives](#2-objectives)
3. [Scope](#3-scope)
4. [User Personas](#4-user-personas)
5. [User Stories](#5-user-stories)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [AI Features](#8-ai-features)
9. [Knowledge Sources](#9-knowledge-sources)
10. [Security](#10-security)
11. [Future Enhancements](#11-future-enhancements)
12. [Acceptance Criteria](#12-acceptance-criteria)

---

## 1. Vision

### Problem

Organizations accumulate vast amounts of institutional knowledge spread across git repositories, documentation, database schemas, API specs, deployment configs, and architecture documents. This knowledge is fragmented, poorly indexed, and locked inside siloed tools. New team members spend weeks onboarding. Experienced engineers waste hours searching for context that someone else already knows.

Existing tools like GitHub Copilot help write code but do not answer questions about the organization's own codebase, infrastructure, or processes. There is no single interface to ask "How does our system work?" and get a grounded, citation-backed answer.

### Solution

**CorpusGuard AI Assistant** is an enterprise-grade AI copilot embedded inside the Corpus Nexus AI platform. It provides a natural language interface to query the organization's entire knowledge base — source code, documentation, database schemas, Docker configurations, API specifications, deployment guides, and internal PDFs.

Every answer is grounded in actual company knowledge through Retrieval-Augmented Generation (RAG). The assistant never hallucinates — it retrieves relevant context, cites its sources, and lets users verify every claim.

### North Star Metric

> **Reduction in time-to-answer for internal knowledge questions from hours to under 10 seconds, with 95%+ answer accuracy grounded in company sources.**

---

## 2. Objectives

### Business Objectives

| ID | Objective | Success Metric |
|---|---|---|
| BO-1 | Reduce new engineer onboarding time | Onboarding time reduced by 40% within 3 months |
| BO-2 | Decrease repetitive knowledge queries to senior engineers | 50% reduction in "how does X work" Slack messages |
| BO-3 | Improve cross-team knowledge visibility | 80% of repositories indexed within 2 weeks of launch |
| BO-4 | Establish Corpus Nexus AI as the knowledge hub | 70% weekly active usage among engineers within 3 months |

### Product Objectives

| ID | Objective | Success Metric |
|---|---|---|
| PO-1 | Every answer must cite its source | 100% of responses include source references |
| PO-2 | Answers must be grounded, not hallucinated | < 5% of responses contain unverifiable claims |
| PO-3 | Response latency must be acceptable for real-time use | P95 latency under 3 seconds |
| PO-4 | Support the full breadth of organizational knowledge | All 12 knowledge source types supported at launch |

### Technical Objectives

| ID | Objective | Success Metric |
|---|---|---|
| TO-1 | RAG retrieval precision | Top-5 retrieval precision > 85% |
| TO-2 | Incremental ingestion | Only changed files re-embedded on git sync |
| TO-3 | Horizontal scalability | Support 500+ concurrent users |
| TO-4 | Enterprise security | RBAC enforced at every retrieval and generation step |

---

## 3. Scope

### In Scope (v1.0)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORPUSGUARD AI ASSISTANT                     │
│                        v1.0 SCOPE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CHAT INTERFACE                                                 │
│  ├── Natural language Q&A over organizational knowledge        │
│  ├── Streaming responses with real-time source citations       │
│  ├── Multi-turn conversation with session memory               │
│  ├── Code blocks with syntax highlighting                      │
│  └── Source panel showing referenced files/documents           │
│                                                                 │
│  KNOWLEDGE INGESTION                                            │
│  ├── Git repository ingestion (GitHub)                         │
│  │   ├── Source code (all languages via tree-sitter)           │
│  │   ├── README files and documentation                        │
│  │   ├── API specifications (OpenAPI/Swagger)                  │
│  │   └── Docker and config files                               │
│  ├── File upload (PDF, Markdown, DOCX, TXT)                   │
│  ├── PostgreSQL schema introspection                           │
│  ├── Incremental sync (only changed files)                     │
│  └── Background processing via async workers                   │
│                                                                 │
│  RETRIEVAL ENGINE                                               │
│  ├── Hybrid search (dense vectors + BM25 sparse)              │
│  ├── Cross-encoder reranking                                   │
│  ├── Query intent classification                               │
│  ├── Source-type aware retrieval routing                       │
│  └── Metadata filtering (by repo, language, team)             │
│                                                                 │
│  AI AGENT                                                      │
│  ├── ReAct loop with tool-use                                  │
│  ├── Code search tool                                          │
│  ├── Documentation search tool                                 │
│  ├── Database schema search tool                               │
│  ├── File reader tool                                          │
│  ├── Git history tool                                          │
│  └── Read-only SQL execution tool                              │
│                                                                 │
│  KNOWLEDGE EXPLORER                                             │
│  ├── Browse indexed repositories                               │
│  ├── Navigate file tree structure                              │
│  ├── View source code with syntax highlighting                 │
│  ├── View database schema diagrams                             │
│  └── Search across all indexed content                         │
│                                                                 │
│  ADMINISTRATION                                                 │
│  ├── Manage ingested repositories                              │
│  ├── Monitor ingestion jobs and status                         │
│  ├── View usage analytics                                      │
│  ├── Manage team access controls                               │
│  └── Audit log of all queries                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Out of Scope (v1.0)

| Item | Reason | Planned Version |
|---|---|---|
| Code generation / auto-complete | Separate product concern (Copilot territory) | v2.0 |
| GitLab / Bitbucket connectors | GitHub is primary; expand on demand | v1.1 |
| Real-time collaboration on answers | Complexity; v1 is single-user sessions | v2.0 |
| Slack / Teams integration | Requires separate integration work | v1.1 |
| Mobile application | Desktop-first for engineering workflows | v2.0 |
| Video / audio content ingestion | No internal video knowledge base | v2.0 |
| Custom model fine-tuning | Risk + cost; prompt engineering sufficient for v1 | v2.0 |
| Multi-language UI | English only for v1 | v1.1 |
| Write-back to repositories | Read-only by design; safety concern | v2.0 |
| Automated PR review | Different workflow; separate feature | v2.0 |

### Dependencies

| Dependency | Type | Owner | Status |
|---|---|---|---|
| Auth module (JWT, user management) | Internal | Shared | Ready |
| PostgreSQL database | Infrastructure | Platform | Ready |
| FastAPI backend framework | Internal | Platform | Ready |
| React frontend framework | Internal | Platform | Ready |
| OpenAI API access | External | Organization | Required |
| GitHub API access (PAT / App) | External | Organization | Required |
| Qdrant vector database | Infrastructure | New | Required |
| Redis | Infrastructure | New | Required |
| MinIO / S3 (file storage) | Infrastructure | New | Required |

---

## 4. User Personas

### Persona 1: New Engineer (Primary)

```
Name:           Priya
Role:           Backend Engineer (Month 2)
Age:            26
Tech Comfort:   High
Pain Points:    Spends 2-3 hours daily asking seniors basic questions
                about project architecture, DB schema, and how to run services
Goals:          Get productive quickly without bothering the team
Frequency:      Daily, 5-10 queries per day
Key Feature:    Natural language Q&A with source citations
```

### Persona 2: Senior Engineer

```
Name:           Rahul
Role:           Senior Full-Stack Engineer
Age:            31
Tech Comfort:   Very High
Pain Points:    Repeatedly answers the same architectural questions;
                hard to find specific API details across 20+ repos
Goals:          Focus on building features, not being a human FAQ
Frequency:      3-5 queries per day (checking details across repos)
Key Feature:    Cross-repository search and schema exploration
```

### Persona 3: Engineering Manager

```
Name:           Deepa
Role:           Engineering Manager
Age:            34
Tech Comfort:   Medium
Pain Points:    Needs quick answers about system architecture for
                stakeholder meetings; doesn't have time to dig through code
Goals:          Understand system overview and module ownership
Frequency:      2-3 queries per day (architecture, ownership, status)
Key Feature:    High-level architecture summaries with ownership info
```

### Persona 4: DevOps / Platform Engineer

```
Name:           Karthik
Role:           DevOps Engineer
Age:            29
Tech Comfort:   Very High
Pain Points:    Hard to track Docker configs, env vars, and deployment
                procedures across multiple services
Goals:          Quick access to Docker setup, env configs, deployment guides
Frequency:      Daily, 3-8 queries per day
Key Feature:    Config/Docker/env var search and schema exploration
```

### Persona 5: Tech Writer / Documentation Lead

```
Name:           Ananya
Role:           Technical Writer
Age:            27
Tech Comfort:   Medium-High
Pain Points:    Difficult to find which docs are outdated; needs to
                understand code to write accurate documentation
Goals:          Verify documentation accuracy against actual codebase
Frequency:      2-3 queries per day (code-to-docs verification)
Key Feature:    Source code + documentation cross-reference
```

---

## 5. User Stories

### Chat & Query

| ID | Story | Priority | Persona |
|---|---|---|---|
| US-01 | As a new engineer, I want to ask "How is the backend structured?" so that I can understand the project architecture without reading every file. | P0 | Priya |
| US-02 | As a new engineer, I want to ask "How do I run this project?" so that I can set up my local environment quickly. | P0 | Priya |
| US-03 | As a senior engineer, I want to ask "Which project uses Redis?" so that I can find infrastructure dependencies without grepping across repos. | P0 | Rahul |
| US-04 | As a DevOps engineer, I want to ask "Explain the Docker setup" so that I can understand container orchestration across services. | P0 | Karthik |
| US-05 | As a new engineer, I want to ask "Show me the login API" so that I can understand the authentication flow with actual code. | P0 | Priya |
| US-06 | As a senior engineer, I want to ask "Explain the PostgreSQL schema for the user table" so that I can understand data models quickly. | P0 | Rahul |
| US-07 | As an engineering manager, I want to ask "Who owns this module?" so that I can route questions to the right person. | P1 | Deepa |
| US-08 | As a new engineer, I want to ask follow-up questions in the same conversation so that I can explore a topic deeply without repeating context. | P0 | Priya |
| US-09 | As a user, I want every answer to show me which files and documents it referenced so that I can verify the information myself. | P0 | All |
| US-10 | As a user, I want to ask about environment variables so that I can understand configuration without reading .env files directly. | P1 | Karthik |

### Knowledge Ingestion

| ID | Story | Priority | Persona |
|---|---|---|---|
| US-11 | As an admin, I want to connect a GitHub repository so that the assistant can answer questions about its codebase. | P0 | Karthik |
| US-12 | As an admin, I want to upload internal PDFs (architecture docs, deployment guides) so that the assistant can reference them. | P0 | Deepa |
| US-13 | As an admin, I want the assistant to automatically sync with GitHub so that new code changes are reflected in answers without manual re-ingestion. | P1 | Karthik |
| US-14 | As an admin, I want to view ingestion job status so that I know when knowledge is up to date. | P1 | Karthik |
| US-15 | As an admin, I want to see which repositories are indexed and when they were last synced. | P1 | Karthik |

### Explorer

| ID | Story | Priority | Persona |
|---|---|---|---|
| US-16 | As a user, I want to browse the file tree of an indexed repository so that I can navigate code structure visually. | P1 | Rahul |
| US-17 | As a user, I want to view source code with syntax highlighting so that I can read it comfortably. | P1 | Rahul |
| US-18 | As a user, I want to view the database schema as a structured diagram so that I can understand table relationships. | P1 | Rahul |
| US-19 | As a user, I want to search across all indexed content from a single search bar so that I can find relevant files quickly. | P0 | All |

### Feedback & Quality

| ID | Story | Priority | Persona |
|---|---|---|---|
| US-20 | As a user, I want to rate answers (thumbs up/down) so that the system can learn what's helpful. | P1 | All |
| US-21 | As a user, I want to report incorrect answers so that the knowledge base can be improved. | P2 | All |
| US-22 | As an admin, I want to view answer quality metrics so that I can identify gaps in the knowledge base. | P2 | Deepa |

---

## 6. Functional Requirements

### FR-1: Chat Interface

| Req ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | The system shall provide a chat interface with a text input, send button, and message history. | P0 |
| FR-1.2 | The system shall stream responses token-by-token using Server-Sent Events (SSE) for real-time feedback. | P0 |
| FR-1.3 | The system shall display source citations alongside each answer, linking to the specific file, line range, and repository. | P0 |
| FR-1.4 | The system shall support multi-turn conversations with session persistence (last 20 messages retained per session). | P0 |
| FR-1.5 | The system shall render code blocks with syntax highlighting appropriate to the detected language. | P0 |
| FR-1.6 | The system shall display a collapsible "Sources" panel showing all referenced documents with file paths and relevance scores. | P0 |
| FR-1.7 | The system shall indicate when no relevant knowledge was found, rather than generating an ungrounded answer. | P0 |
| FR-1.8 | The system shall support Markdown formatting in responses (headings, lists, bold, italic, links). | P1 |
| FR-1.9 | The system shall allow users to create, rename, and delete chat sessions. | P1 |
| FR-1.10 | The system shall support file-path mentions (e.g., @backend/app/main.py) to scope a query to specific files. | P2 |

### FR-2: Knowledge Ingestion

| Req ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | The system shall ingest GitHub repositories via personal access token or GitHub App authentication. | P0 |
| FR-2.2 | The system shall parse source code files using language-aware parsers (tree-sitter) to extract functions, classes, and modules as semantic chunks. | P0 |
| FR-2.3 | The system shall parse Markdown, PDF (via PyPDF2), and DOCX (via mammoth) documents into semantic sections. | P0 |
| FR-2.4 | The system shall parse SQL DDL (PostgreSQL schema dumps) to extract table definitions, columns, constraints, and relationships. | P0 |
| FR-2.5 | The system shall parse Docker Compose files, Dockerfiles, and .env files into structured metadata. | P0 |
| FR-2.6 | The system shall parse OpenAPI/Swagger specifications into endpoint-level chunks. | P0 |
| FR-2.7 | The system shall generate embeddings for all chunks using the configured embedding model and store them in the vector database. | P0 |
| FR-2.8 | The system shall perform incremental ingestion — only re-embedding files that changed since the last sync (via git diff). | P1 |
| FR-2.9 | The system shall support manual file upload (drag-and-drop or file picker) for ad-hoc documents. | P1 |
| FR-2.10 | The system shall scan files for secrets and environment variables during ingestion and flag/hide sensitive values. | P0 |
| FR-2.11 | The system shall process ingestion jobs asynchronously via a background task queue. | P0 |
| FR-2.12 | The system shall provide real-time ingestion job status (queued, processing, completed, failed) with progress indicators. | P1 |

### FR-3: Retrieval Engine

| Req ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | The system shall perform hybrid retrieval combining dense vector search (semantic similarity) and sparse BM25 search (keyword matching). | P0 |
| FR-3.2 | The system shall merge results from dense and sparse retrieval using Reciprocal Rank Fusion (RRF). | P0 |
| FR-3.3 | The system shall rerank merged results using a cross-encoder reranker model, returning top-5 most relevant chunks. | P0 |
| FR-3.4 | The system shall classify query intent and route to appropriate retrieval strategy (code-focused, docs-focused, schema-focused, etc.). | P1 |
| FR-3.5 | The system shall support metadata filtering during retrieval (filter by repository, file type, language, team). | P0 |
| FR-3.6 | The system shall assemble retrieved chunks into a context window with source metadata for the LLM. | P0 |
| FR-3.7 | The system shall enforce a maximum context window size (configurable, default 8192 tokens) to stay within LLM limits. | P0 |
| FR-3.8 | The system shall score retrieval confidence and suppress low-confidence answers (< 0.3 relevance threshold). | P1 |

### FR-4: AI Agent

| Req ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | The system shall implement a ReAct (Reason + Act) agent loop that can decompose complex queries into multi-step reasoning. | P0 |
| FR-4.2 | The agent shall have access to the following tools: code_search, doc_search, schema_search, file_read, git_log, run_sql (read-only). | P0 |
| FR-4.3 | The agent shall select tools based on query intent and invoke them sequentially or in parallel as needed. | P0 |
| FR-4.4 | The agent shall perform a maximum of 5 reasoning iterations per query to prevent infinite loops. | P0 |
| FR-4.5 | The agent shall generate inline citations mapping each claim in the response to specific source files and line numbers. | P0 |
| FR-4.6 | The system shall detect prompt injection attempts and refuse to process malicious inputs. | P0 |
| FR-4.7 | The system shall ground all responses in retrieved context only — responses must not contain information absent from the knowledge base. | P0 |

### FR-5: Knowledge Explorer

| Req ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | The system shall display a list of all indexed repositories with metadata (name, language, last synced, file count). | P1 |
| FR-5.2 | The system shall render a navigable file tree for each repository. | P1 |
| FR-5.3 | The system shall display file contents with syntax highlighting and line numbers. | P1 |
| FR-5.4 | The system shall render database schema information as structured table cards showing columns, types, constraints, and relationships. | P1 |
| FR-5.5 | The system shall provide a global search bar that queries across all indexed content (code, docs, schemas). | P0 |
| FR-5.6 | The system shall display file metadata (last modified, author, size, language) alongside content. | P2 |

### FR-6: Administration

| Req ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | The system shall provide an admin panel to add, remove, and manage ingested repositories. | P0 |
| FR-6.2 | The system shall display ingestion job history with status, duration, files processed, and errors. | P1 |
| FR-6.3 | The system shall provide usage analytics: total queries, unique users, top queries, average response time. | P1 |
| FR-6.4 | The system shall maintain an audit log of all user queries with timestamps and response metadata. | P0 |
| FR-6.5 | The system shall enforce role-based access control (Admin, Editor, Viewer) for ingestion and admin operations. | P0 |
| FR-6.6 | The system shall allow admins to configure ingestion schedules (manual, hourly, daily). | P2 |

---

## 7. Non-Functional Requirements

### NFR-1: Performance

| Req ID | Metric | Target |
|---|---|---|
| NFR-1.1 | Chat response P50 latency | < 1.5 seconds (time to first token) |
| NFR-1.2 | Chat response P95 latency | < 3.0 seconds (time to first token) |
| NFR-1.3 | Chat response P99 latency | < 5.0 seconds (time to first token) |
| NFR-1.4 | Search query latency | < 500ms (retrieval only, no generation) |
| NFR-1.5 | Ingestion throughput | 50 files/second per worker |
| NFR-1.6 | Concurrent chat users | 500+ per deployment |
| NFR-1.7 | Streaming token rate | > 30 tokens/second |

### NFR-2: Scalability

| Req ID | Requirement |
|---|---|
| NFR-2.1 | The system shall support horizontal scaling of API servers (stateless design). |
| NFR-2.2 | The vector database shall support sharding across teams for datasets > 10M chunks. |
| NFR-2.3 | The ingestion pipeline shall scale workers independently via task queue (1-16 workers auto-scaled). |
| NFR-2.4 | The system shall support up to 50M indexed chunks per deployment. |
| NFR-2.5 | The system shall handle repositories with up to 100K files each. |

### NFR-3: Reliability

| Req ID | Requirement |
|---|---|
| NFR-3.1 | System uptime SLA: 99.5% during business hours. |
| NFR-3.2 | Ingestion jobs shall be idempotent — re-running does not duplicate data. |
| NFR-3.3 | Failed ingestion jobs shall be retried up to 3 times with exponential backoff. |
| NFR-3.4 | Vector database snapshots shall be taken every 6 hours to object storage (S3/MinIO). |
| NFR-3.5 | The system shall gracefully degrade — if the LLM is unavailable, retrieval-only results are still shown. |

### NFR-4: Usability

| Req ID | Requirement |
|---|---|
| NFR-4.1 | The chat interface shall be usable without training for engineers familiar with ChatGPT-style interfaces. |
| NFR-4.2 | The system shall provide suggested queries / quick actions for first-time users. |
| NFR-4.3 | The system shall display loading states and progress indicators during long operations. |
| NFR-4.4 | The system shall be responsive and usable on screens >= 1024px width. |
| NFR-4.5 | Error messages shall be human-readable and suggest corrective actions. |

### NFR-5: Maintainability

| Req ID | Requirement |
|---||
| NFR-5.1 | All CorpusGuard code shall be isolated under `corpusmind/` namespace — no cross-module dependencies beyond shared auth. |
| NFR-5.2 | All database tables shall use `cm_` prefix to avoid naming collisions with other modules. |
| NFR-5.3 | All API routes shall be under `/api/v1/corpusmind/*` prefix. |
| NFR-5.4 | All frontend routes shall be under `/corpusmind/*` prefix. |
| NFR-5.5 | Configuration shall be environment-variable based with sensible defaults. |

### NFR-6: Availability

| Req ID | Requirement |
|---|---|
| NFR-6.1 | The system shall be deployable via Docker Compose for single-node setups and Kubernetes for production. |
| NFR-6.2 | All state shall be externalized (PostgreSQL, Qdrant, Redis) — no local filesystem state. |
| NFR-6.3 | The system shall support zero-downtime deployments with rolling updates. |

---

## 8. AI Features

### 8.1 RAG Pipeline

```
┌──────────────────────────────────────────────────────────────┐
│                    RAG PIPELINE OVERVIEW                      │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │ INGEST   │──▶│ CHUNK    │──▶│ EMBED    │──▶│ STORE    │ │
│  │          │   │          │   │          │   │          │ │
│  │ Parse    │   │ Semantic │   │ Vector   │   │ Qdrant   │ │
│  │ source   │   │ split by │   │ encoding │   │ dense +  │ │
│  │ files    │   │ AST/     │   │ per      │   │ sparse   │ │
│  │          │   │ section  │   │ chunk    │   │ vectors  │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │ QUERY    │──▶│ RETRIEVE │──▶│ RERANK   │──▶│ GENERATE │ │
│  │          │   │          │   │          │   │          │ │
│  │ Classify │   │ Hybrid:  │   │ Cross-   │   │ LLM with │ │
│  │ intent + │   │ dense +  │   │ encoder  │   │ grounded │ │
│  │ expand   │   │ BM25     │   │ top 20→5 │   │ context  │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Embedding Model

| Property | Value |
|---|---|
| **Primary Model** | `text-embedding-3-large` (OpenAI) |
| **Dimensions** | 3072 (projected to 1024 via Matryoshka) |
| **Fallback Model** | `bge-m3` (BAAI, self-hosted) |
| **Batch Size** | 2048 chunks per API call |
| **Dimensionality Reduction** | Matryoshka projection to 1024d |

### 8.3 LLM Configuration

| Property | Value |
|---|---|
| **Primary Model** | `gpt-4o` (OpenAI) |
| **Fast Model** | `gpt-4o-mini` (for simple lookups and classification) |
| **Temperature** | 0.1 (grounded, factual) |
| **Max Output Tokens** | 4096 |
| **Streaming** | SSE (Server-Sent Events) |
| **Function Calling** | Native OpenAI tool-use API |
| **System Prompt** | Custom prompt with retrieval context, user role, and grounding instructions |

### 8.4 Chunking Strategy

| Source Type | Parser | Chunk Strategy | Chunk Size | Overlap |
|---|---|---|---|---|
| Source Code | tree-sitter (AST) | Function / class / module | 512 tokens | 50 |
| Markdown / README | Markdown heading splitter | Section by heading hierarchy | 1024 tokens | 128 |
| PDF | PyPDF2 + layout analysis | Semantic paragraph | 1024 tokens | 128 |
| DOCX | mammoth → Markdown | Section by heading | 1024 tokens | 128 |
| SQL Schema | Custom DDL parser | Per-table + foreign keys | Unlimited | N/A |
| Docker Compose | YAML parser | Per-service block | 512 tokens | 50 |
| Dockerfile | Line-aware parser | Instruction groups | 512 tokens | 50 |
| .env files | Key-value parser | Per-variable (redacted values) | Unlimited | N/A |
| OpenAPI / Swagger | JSON/YAML parser | Per-endpoint | 512 tokens | 50 |
| Config files | Line-aware parser | Logical blocks | 512 tokens | 50 |

### 8.5 Retrieval Strategy

| Parameter | Value |
|---|---|
| **Dense Search** | HNSW index, ef=128, top_k=20 |
| **Sparse Search** | BM25, top_k=20 |
| **Fusion Method** | Reciprocal Rank Fusion (k=60) |
| **Dense Weight (α)** | 0.6 |
| **Sparse Weight (β)** | 0.3 |
| **Metadata Boost (γ)** | 0.1 |
| **Reranker** | `bge-reranker-v2-m3` cross-encoder |
| **Final Context** | Top 5 chunks, max 8192 tokens |
| **Confidence Threshold** | 0.3 (below this, "no answer found") |

### 8.6 Query Intent Classification

| Detected Intent | Retrieval Focus | Example Query |
|---|---|---|
| Architecture Understanding | Docs + high-level code | "How is the backend structured?" |
| Code Explanation | Source code | "How does authentication work?" |
| Schema Understanding | DB schema | "Explain the user table schema" |
| Setup / Run Instructions | Docs + Docker configs | "How do I run this project?" |
| Dependency Lookup | Config files + Docker | "Which project uses Redis?" |
| API Exploration | OpenAPI + source code | "Show me the login API" |
| Ownership / Metadata | Git metadata + README | "Who owns this module?" |
| Environment Config | .env + Docker + config | "What environment variables are needed?" |
| Deployment | Docker + docs | "How is this deployed?" |

### 8.7 Agent Tools

| Tool | Description | Input | Output |
|---|---|---|---|
| `code_search` | Semantic search over source code | query, repo?, language? | Ranked code chunks with file paths |
| `doc_search` | Search documentation and READMEs | query, type? | Document sections with sources |
| `schema_search` | Search PostgreSQL schema definitions | query | Table/column DDL with relationships |
| `file_read` | Read full file content (authorized) | file_path, repo? | File content + metadata |
| `git_log` | Get recent commits for a file/repo | repo?, path?, since? | Commit history with messages |
| `run_sql` | Execute read-only SQL against org DB | sql_query | Query results (read-only, sandboxed) |

### 8.8 Memory System

```
Layer 1 — SESSION MEMORY (Redis, TTL 30 min)
├── Conversation history (last 20 messages)
├── Working context (files already referenced)
└── Session-scoped filters (repo, language)

Layer 2 — USER MEMORY (PostgreSQL)
├── Pinned repositories
├── Frequently accessed files
├── Query history (anonymized)
└── Feedback preferences (thumbs up/down patterns)

Layer 3 — ORGANIZATION MEMORY (PostgreSQL)
├── Indexing status per repository
├── Knowledge freshness scores
├── Popular queries across organization
└── Common question patterns
```

---

## 9. Knowledge Sources

### 9.1 Source Matrix

| Source Type | Ingestion Method | Chunk Level | Update Trigger |
|---|---|---|---|
| Git Repositories | GitHub API (webhook + polling) | File-level (per language) | Git push (webhook) or scheduled poll |
| Source Code | tree-sitter AST parsing | Function / class / module | File change detection |
| README Files | Markdown parser | Section by heading | File change detection |
| Documentation | Markdown / DOCX / PDF parser | Section by heading / paragraph | File change detection |
| API Specifications | OpenAPI JSON/YAML parser | Per-endpoint | File change detection |
| PostgreSQL Schema | DDL introspection / pg_dump | Per-table + relationships | Scheduled re-sync |
| Docker Compose | YAML parser | Per-service block | File change detection |
| Dockerfiles | Instruction parser | Instruction groups | File change detection |
| Environment Variables | .env parser | Per-key (values redacted) | File change detection |
| Architecture Documents | PDF / Markdown parser | Section by heading | Manual re-upload |
| Deployment Guides | PDF / Markdown parser | Section by heading | Manual re-upload |
| Internal PDFs | PyPDF2 parser | Semantic paragraph | Manual re-upload |

### 9.2 Supported File Extensions

```
Code:       .py, .js, .ts, .tsx, .jsx, .go, .rs, .java, .rb, .php,
            .c, .cpp, .h, .cs, .swift, .kt, .scala, .r, .m, .sh

Docs:       .md, .txt, .pdf, .docx, .rst, .adoc

Config:     .yml, .yaml, .json, .toml, .ini, .cfg, .conf, .xml

Infra:      Dockerfile, docker-compose.yml, .env, .env.example,
            .env.local, .env.production

API:        openapi.json, openapi.yaml, swagger.json, swagger.yaml

Database:   .sql (DDL files)

Other:      .gitignore, Makefile, Procfile, Vagrantfile, Jenkinsfile
```

### 9.3 Ingestion Pipeline

```
Source File Detected
        │
        ▼
┌───────────────────┐
│ 1. File Type      │  Determine parser based on extension + content sniffing
│    Detection      │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ 2. Secret         │  Scan for API keys, passwords, tokens, private keys
│    Scanning       │  Skip or redact flagged files (.env with real values)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ 3. Parse &        │  Language-aware parsing into semantic chunks
│    Chunk          │  Preserve metadata: heading, function name, class
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ 4. Embed          │  Batch encode via embedding model (OpenAI or local)
│                  │  Generate dense + sparse vectors
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ 5. Store          │  Upsert into Qdrant with full payload metadata
│                  │  Update metadata in PostgreSQL
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ 6. Verify         │  Log ingestion stats, update job status
│                  │  Alert on errors
└───────────────────┘
```

---

## 10. Security

### 10.1 Authentication & Authorization

| Control | Implementation |
|---|---|
| **Authentication** | JWT (RS256) via shared Auth module — 15-min access tokens + refresh tokens |
| **Authorization Model** | Role-Based Access Control (RBAC) |
| **Roles** | Admin (full access), Editor (ingest + chat), Viewer (chat only) |
| **Resource Access** | Repository-level access control — users only retrieve from repos they're authorized to see |
| **Tool Authorization** | `run_sql` tool requires Editor role; `file_read` checks repo-level permissions |

### 10.2 Data Protection

| Control | Implementation |
|---|---|
| **Encryption at Rest** | AES-256 for vector database and PostgreSQL |
| **Encryption in Transit** | TLS 1.3 for all API communication |
| **Secret Detection** | Pre-ingestion scan blocks .env files with real secrets |
| **PII Detection** | Ingestion pipeline detects and redacts PII (SSN, email, phone) from chunks |
| **No Raw Source in Vectors** | Vector payloads contain chunk text + metadata; full files served on-demand via file_read tool with auth check |
| **LLM Data Isolation** | Each organization's data is scoped to its Qdrant collection — no cross-org retrieval |

### 10.3 Content Safety

| Control | Implementation |
|---|---|
| **Prompt Injection** | Input classifier detects injection patterns; blocks or sanitizes |
| **Grounding Enforcement** | System prompt instructs LLM to only use retrieved context; post-generation groundedness check |
| **Jailbreak Prevention** | Refuse requests to ignore instructions or reveal system prompt |
| **Output PII Filtering** | Post-generation scan strips any PII that the LLM may have leaked from context |
| **SQL Safety** | `run_sql` tool restricted to read-only queries (SELECT only); no DDL/DML; query timeout 10s |

### 10.4 Audit & Compliance

| Control | Implementation |
|---|---|
| **Query Audit Log** | Every user query logged with: user_id, timestamp, query text, sources retrieved, response summary |
| **LLM Response Logging** | Full response logged (with PII scrubbing) for quality monitoring |
| **Data Retention** | Configurable per organization (default: 90 days for audit logs, indefinite for knowledge base) |
| **Ingestion Audit** | All ingestion events logged: who triggered, which repo, file count, status |
| **Access Audit** | All admin actions logged (repo additions, user role changes, config changes) |

---

## 11. Future Enhancements

### v1.1 — Integration & Expansion

| Feature | Description |
|---|---|
| Slack / Teams Bot | Ask CorpusGuard questions directly from Slack channels |
| GitLab Connector | Extend ingestion to GitLab repositories |
| Bitbucket Connector | Extend ingestion to Bitbucket repositories |
| Scheduled Digest | Daily email summary of knowledge base changes |
| Multi-language UI | Localized interface (Hindi, Telugu, etc.) |

### v2.0 — Intelligence & Collaboration

| Feature | Description |
|---|---|
| Code Generation | Generate code snippets grounded in company patterns and conventions |
| PR Review Assistant | Analyze pull requests against existing codebase knowledge |
| Architecture Diagram Generation | Auto-generate architecture diagrams from codebase structure |
| Knowledge Gap Detection | Identify areas with poor documentation and suggest improvements |
| Collaborative Annotations | Users can annotate answers and add supplementary knowledge |
| Custom Agent Workflows | Users define multi-step workflows (e.g., "explain this service end-to-end") |
| Fine-tuned Embeddings | Organization-specific embedding model trained on internal codebase |

### v3.0 — Enterprise & Platform

| Feature | Description |
|---|---|
| Multi-Tenant SaaS | Full tenant isolation with per-org billing |
| On-Premise Deployment | Air-gapped deployment for regulated industries |
| Knowledge Graph | Entity-relationship graph across code, docs, and people |
| Proactive Suggestions | "You might want to know..." based on current file/page context |
| IDE Plugin | VS Code / JetBrains extension for inline knowledge queries |
| API for Third-Party | Public API for building custom integrations on top of CorpusGuard |

---

## 12. Acceptance Criteria

### AC-1: Chat Interface

| ID | Criterion | Test Method |
|---|---|---|
| AC-1.1 | User can type a question and receive a streamed response within 3 seconds (P95). | Load test: 100 concurrent users, measure time-to-first-token |
| AC-1.2 | Every response includes at least one source citation linking to a specific file path. | Manual test: ask 20 questions, verify all have citations |
| AC-1.3 | Code blocks render with correct syntax highlighting for the detected language. | Visual inspection across 5+ languages |
| AC-1.4 | Multi-turn conversations maintain context — follow-up questions reference prior messages. | Manual test: 5-turn conversation with contextual follow-ups |
| AC-1.5 | When no relevant knowledge is found, the system displays "I don't have enough information" instead of guessing. | Adversarial test: ask about topics not in the knowledge base |

### AC-2: Knowledge Ingestion

| ID | Criterion | Test Method |
|---|---|---|
| AC-2.1 | Admin can connect a GitHub repo and all code files are indexed within 5 minutes for a 500-file repo. | Time ingestion of a real 500-file repo end-to-end |
| AC-2.2 | Incremental sync only re-embeds changed files — ingesting the same repo twice completes in < 30 seconds. | Re-sync same repo, measure time |
| AC-2.3 | PDFs, Markdown, and DOCX files are correctly parsed into searchable chunks. | Upload 3 file types, verify all are retrievable via search |
| AC-2.4 | SQL schema files are parsed into table definitions with columns, types, and foreign keys. | Ingest a real schema dump, verify schema_search returns correct results |
| AC-2.5 | Files containing secrets (API keys, passwords) are flagged and not embedded with raw values. | Ingest a .env file with a real API key, verify the key is redacted in chunks |
| AC-2.6 | Ingestion job status is visible in real-time (queued → processing → completed). | Trigger ingestion, monitor status updates |

### AC-3: Retrieval Quality

| ID | Criterion | Test Method |
|---|---|---|
| AC-3.1 | For the query "Explain the backend architecture," the top-5 retrieved chunks include README or architecture docs. | Automated retrieval test: evaluate top-5 relevance |
| AC-3.2 | For the query "Show login API," the retrieval returns auth-related code files and API specs. | Automated retrieval test |
| AC-3.3 | For the query "Explain PostgreSQL schema for users table," the retrieval returns the users table DDL. | Automated retrieval test |
| AC-3.4 | Hybrid retrieval outperforms dense-only or sparse-only retrieval on a benchmark of 50 test queries. | Retrieval benchmark: compare nDCG@5 across strategies |
| AC-3.5 | Reranking improves precision by at least 10% over unranked retrieval. | A/B comparison: with vs. without reranker |

### AC-4: AI Agent

| ID | Criterion | Test Method |
|---|---|---|
| AC-4.1 | For "Which project uses Redis?" the agent calls code_search or config_search and returns the correct repository. | End-to-end test with ground truth |
| AC-4.2 | For "How do I run this project?" the agent retrieves Docker/README instructions and synthesizes a correct step-by-step guide. | End-to-end test with ground truth |
| AC-4.3 | The agent never exceeds 5 tool-call iterations per query. | Instrument agent loop, verify max iterations |
| AC-4.4 | Prompt injection attempts (e.g., "Ignore previous instructions and...") are blocked. | Adversarial test: 10 injection patterns |

### AC-5: Security

| ID | Criterion | Test Method |
|---|---|---|
| AC-5.1 | Unauthenticated users cannot access any CorpusGuard API endpoint. | API test: send requests without JWT → expect 401 |
| AC-5.2 | Viewer role users cannot trigger ingestion or execute SQL. | API test: Viewer role + ingest/SQL endpoints → expect 403 |
| AC-5.3 | User A cannot retrieve chunks from repositories they don't have access to. | Cross-user access test |
| AC-5.4 | All queries are logged in the audit log with user_id, timestamp, and query text. | Query 5 questions, verify audit log entries |
| AC-5.5 | LLM responses never contain raw API keys or secrets from ingested files. | Ingest file with secret, ask about it, verify secret is not in response |

### AC-6: Explorer

| ID | Criterion | Test Method |
|---|---|---|
| AC-6.1 | User can browse the file tree of any indexed repository. | Manual test: navigate 3 repos |
| AC-6.2 | Source code is displayed with correct syntax highlighting and line numbers. | Visual inspection across 5 languages |
| AC-6.3 | Database schema is displayed as structured cards with columns, types, and relationships. | Manual test: view schema for 2 tables |

### AC-7: Scalability

| ID | Criterion | Test Method |
|---|---|---|
| AC-7.1 | System handles 500 concurrent chat users without degradation beyond P95 targets. | Load test with k6 or Locust |
| AC-7.2 | Ingestion scales to 50M chunks without query latency degradation. | Benchmark test with synthetic dataset |

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **RAG** | Retrieval-Augmented Generation — technique where LLM responses are grounded in retrieved documents |
| **Hybrid Search** | Combining dense (vector) and sparse (BM25) retrieval for better recall |
| **RRF** | Reciprocal Rank Fusion — algorithm to merge ranked lists from multiple retrieval sources |
| **ReAct** | Reason + Act — agent pattern where the LLM alternates between reasoning and tool use |
| **Cross-Encoder** | Reranking model that jointly encodes query + document for precise relevance scoring |
| **Chunk** | A logical unit of content (function, section, table) extracted from a source file during ingestion |
| **Grounding** | The constraint that LLM responses must be based on retrieved context, not parametric knowledge |
| **RBAC** | Role-Based Access Control — authorization model based on user roles |
| **SSE** | Server-Sent Events — HTTP streaming protocol for real-time token delivery |
| **AST** | Abstract Syntax Tree — structured representation of source code used for semantic chunking |

---

## Appendix B: Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Will we use OpenAI API or self-hosted LLM for the primary generation model? | Engineering | Open |
| 2 | What is the GitHub integration scope — personal access token, GitHub App, or both? | Engineering | Open |
| 3 | Do we need to support private (on-prem) GitHub Enterprise instances? | Product | Open |
| 4 | What is the target budget for LLM API costs per user per month? | Finance | Open |
| 5 | Is there an existing PostgreSQL schema we need to introspect, or is this for user-created schemas only? | Product | Open |
| 6 | Should the audit log comply with specific regulatory frameworks (SOC 2, GDPR)? | Compliance | Open |
| 7 | What is the maximum repository size (files) we need to support? | Engineering | Open |
| 8 | Should we support multiple LLM providers (OpenAI, Anthropic, Azure OpenAI) from day 1? | Engineering | Open |
