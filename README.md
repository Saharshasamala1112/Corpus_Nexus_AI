# 🚀 Corpus Nexus AI

> **An Enterprise AI Platform for the Swecha Ecosystem**

---

# 📖 Project Overview

Corpus Nexus AI is a unified enterprise platform for the Swecha ecosystem that combines multiple AI-powered and productivity-focused modules into a single application. It provides developers, contributors, interns, and administrators with a centralized workspace for corpus analytics, intelligent querying, project management, onboarding, repository exploration, and AI-powered assistance.

The platform follows a modular monorepo architecture where all modules share a common frontend, authentication system, backend services, layouts, routing, and reusable components while remaining independently extensible.

---

# 🎯 Vision & Objectives

- Build a centralized AI-powered platform for the Swecha ecosystem.
- Reduce documentation search effort through intelligent assistance.
- Improve developer productivity.
- Simplify intern onboarding.
- Provide live corpus analytics and exploration.
- Enable AI-assisted sprint planning and project management.
- Maintain a modular, scalable, enterprise-ready architecture.

---

# 🏗️ System Architecture

```text
                        User
                          │
                          ▼
                  Corpus Nexus AI
                          │
 ┌──────────────┬──────────────┬─────────────┐
 │              │              │             │
 ▼              ▼              ▼             ▼
Dashboard  Corpus Insights  Ask Corpus  Corpus Explorer
                          │
                          ▼
                    SprintWise AI
                          │
                          ▼
                  Intern Onboarding
                          │
                          ▼
              CorpusGuard AI Assistant
             (Floating Chatbot - Bottom Right)
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
 Production Corpus APIs             Custom FastAPI APIs
        │                                   │
        ▼                                   ▼
 JWT Authentication        PostgreSQL • MinIO • Ollama
```

---

# ✨ Platform Features

- Unified enterprise dashboard
- Live corpus analytics
- Natural language corpus querying
- Corpus exploration
- AI-assisted sprint planning
- Project & team management
- Intern onboarding workflow
- Repository-aware AI assistant
- Shared authentication
- Responsive enterprise UI
- REST API integration
- Modular architecture

---

# 📦 Complete Module Overview

## 📊 Dashboard

The central landing page providing navigation to every module, shared layouts, application overview, and platform statistics.

---

## 📈 Corpus Insights

Provides interactive analytics using live Corpus backend APIs.

Features include:

- Total corpus records
- Total contributors
- Language distribution
- Media type distribution
- Leaderboard
- Real-time analytics

---

## 🤖 Ask Corpus

Allows users to ask natural language questions about the corpus.

Example questions:

- Which language has the highest number of recordings?
- What is the media type distribution?
- Who are the top contributors?
- How many records exist?

Provides suggested questions and human-readable responses generated from live corpus data.

---

## 🔍 Corpus Explorer

Allows users to browse, search, filter, and explore corpus datasets and resources through a unified interface.

---

## 🚀 SprintWise AI

AI-assisted Agile Sprint Planning module.

Features:

- Project CRUD
- Team Member CRUD
- Sprint generation
- Dashboard statistics
- PostgreSQL persistence
- FastAPI REST APIs
- Shared authentication

---

## 🎓 Intern Onboarding

Guided onboarding experience for interns.

Features:

- Onboarding checklist
- Progress tracking
- Screenshot upload
- MinIO object storage
- Shared JWT authentication
- Custom FastAPI upload service

---

## 🛡️ CorpusGuard AI

Enterprise AI assistant for the Swecha ecosystem.

Features:

- Repository-aware AI assistant
- Hybrid retrieval
- BM25 retrieval
- Query rewriting
- Ollama-backed model routing
- Markdown rendering
- Conversation history
- Regenerate, rename, export & delete chats
- Local document ingestion
- Optional PGVector support

The assistant is available as a **floating chatbot icon at the bottom-right corner** throughout the application.

---

# 🛠️ Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend

- FastAPI
- Python
- SQLAlchemy
- Alembic
- PostgreSQL
- MinIO
- REST APIs

## AI

- Ollama
- Retrieval-Augmented Generation (RAG)
- BM25 Retrieval
- Query Rewriting
- Sentence Transformers
- Optional PGVector

## DevOps

- Docker
- Docker Compose
- Git
- GitLab

---

# 📂 repo Structure

```text
## 📂 Repository Structure

```text
corpus-nexus-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── CorpusInsights/
│   │   │   ├── AskCorpus/
│   │   │   ├── CorpusExplorer/
│   │   │   ├── SprintWise/
│   │   │   ├── Onboarding/
│   │   │   └── CorpusGuard/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── docs/
│
├── docker-compose.yml
├── README.md
├── .gitignore
└── LICENSE
```

---

# ⚙️ Backend Architecture

- FastAPI microservices
- SQLAlchemy ORM
- Alembic migrations
- PostgreSQL persistence
- Shared authentication integration
- Dashboard APIs
- SprintWise APIs
- Corpus integrations
- Upload APIs
- AI services
- MinIO integration

---

# 💻 Frontend Architecture

- React + Vite
- Shared layouts
- Shared routing
- Shared authentication
- Axios client
- Reusable components
- Module-based pages
- Responsive UI

---

# 🤖 AI Architecture (CorpusGuard + Ollama + RAG)

```text
User Query
      │
      ▼
CorpusGuard AI
      │
      ▼
Corpus Retrieval
      │
      ▼
Hybrid Search (BM25 + Metadata)
      │
      ▼
Prompt Construction
      │
      ▼
Ollama LLM
      │
      ▼
AI Response
```

---

# 🔐 Authentication Flow

- Shared JWT authentication
- Production authentication backend
- Protected routes
- Shared Axios interceptor
- Automatic Authorization header injection

---

# 🗄️ Database & Storage

## PostgreSQL

- Projects
- Team Members
- Sprint Plans
- Dashboard statistics

## MinIO

- Onboarding screenshots
- Uploaded files

---

# 📡 API Integrations

- Corpus backend APIs
- Authentication APIs
- Dashboard APIs
- SprintWise APIs
- Corpus Insights APIs
- Ask Corpus services
- Upload APIs
- AI assistant services

---

# 🚀 Installation & Local Setup

```bash
git clone https://code.swecha.org/Meghana_Vanamoju/corpus_nexus_ai
cd corpus-nexus-ai
```

Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🐳 Docker Setup

```bash
docker compose up -d
```

Used for services such as MinIO and other containerized dependencies.

---

# 🌍 Environment Variables

Backend

```env
DATABASE_URL=
SECRET_KEY=
MINIO_ENDPOINT=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET_NAME=
ENABLE_CORPUS_SYNC=
ENABLE_EMBEDDING_WORKER=
```

Frontend

```env
VITE_API_URL=
VITE_OLLAMA_BASE_URL=
```

---

# 🧪 Testing

- Backend API testing
- Frontend integration
- JWT authentication
- Corpus Insights
- Ask Corpus
- SprintWise AI
- Intern Onboarding
- MinIO upload
- CorpusGuard AI

---

# 🚀 Deployment

Deployment targets include:

- React/Vite frontend
- FastAPI backend
- PostgreSQL
- MinIO
- Production environment variables
- Alembic migrations
- Secure CORS configuration

---

# 🔮 Future Roadmap

- Semantic search
- Voice interaction
- Advanced analytics
- Multi-model AI
- Enterprise monitoring
- CI/CD
- Automated testing
- Knowledge synchronization

---

# 👥 Contributors

* **Vanamoju Lakshmi Meghana** - SprintWise AI
* **Kothakapu Akshaya** - Intern Onboarding
* **Samala Saharsha** - Corpus Guard(chatbot)
* **Ramireddy Nitheesha** - Corpus Insights & Ask Corpus
* **Rachamalla Himavantha Reddy** - Corpus Explorer

---

# 📄 License

This project is part of the **Corpus Nexus AI** platform developed for the **Swecha Ecosystem** for educational, research, and organizational purposes.