# 🚀 Corpus Nexus AI

> **An Enterprise AI Platform for the Swecha Ecosystem**

---

# 📖 Project Overview

Corpus Nexus AI is a unified enterprise platform for the Swecha ecosystem that combines multiple AI-powered and productivity-focused modules into a single application. It provides developers, contributors, interns, and administrators with a centralized workspace for corpus analytics, intelligent querying, project management, onboarding, repository exploration, and AI-powered assistance.

The platform follows a modular monorepo architecture where all modules share a common frontend, authentication system, backend services, layouts, routing, and reusable components while remaining independently extensible.

---

# 🎯 Vision & Objectives

* Build a centralized AI-powered platform for the Swecha ecosystem.
* Reduce documentation search effort through intelligent assistance.
* Improve developer productivity.
* Simplify intern onboarding.
* Provide live corpus analytics and exploration.
* Enable AI-assisted sprint planning and project management.
* Maintain a modular, scalable, enterprise-ready architecture.

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

* Unified enterprise dashboard
* Live corpus analytics
* Natural language corpus querying
* Corpus exploration
* AI-assisted sprint planning
* Project & team management
* Intern onboarding workflow
* Repository-aware AI assistant
* Shared authentication
* Responsive enterprise UI
* REST API integration
* Modular architecture

---

# 📦 Complete Module Overview

## 📊 Dashboard

The central landing page providing navigation to every module, shared layouts, application overview, and platform statistics.

---

## 📈 Corpus Insights

Provides interactive analytics using live Corpus backend APIs.

Features include:

* Total corpus records
* Total contributors
* Language distribution
* Media type distribution
* Leaderboard
* Real-time analytics

---

## 🤖 Ask Corpus

Allows users to ask natural language questions about the corpus.

Example questions:

* Which language has the highest number of recordings?
* What is the media type distribution?
* Who are the top contributors?
* How many records exist?

Provides suggested questions and human-readable responses generated from live corpus data.

---

## 🔍 Corpus Explorer

Allows users to browse, search, filter, and explore corpus datasets and resources through a unified interface.

---

## 🚀 SprintWise AI

AI-assisted Agile Sprint Planning module.

Features:

* Project CRUD
* Team Member CRUD
* Sprint generation
* Dashboard statistics
* PostgreSQL persistence
* FastAPI REST APIs
* Shared authentication

---

## 🎓 Intern Onboarding

Guided onboarding experience for interns.

Features:

* Onboarding checklist
* Progress tracking
* Screenshot upload
* MinIO object storage
* Shared JWT authentication
* Custom FastAPI upload service

---

## 🛡️ CorpusGuard AI

Enterprise AI assistant for the Swecha ecosystem.

Features:

* Repository-aware AI assistant
* Hybrid retrieval
* BM25 retrieval
* Query rewriting
* Ollama-backed model routing
* Markdown rendering
* Conversation history
* Regenerate, rename, export & delete chats
* Local document ingestion
* Optional PGVector support

The assistant is available as a **floating chatbot icon at the bottom-right corner** throughout the application.

---

# 📸 Platform Screenshots

## 🏠 Dashboard

The Dashboard serves as the central hub of **Corpus Nexus AI**, providing platform navigation, quick access to all modules, and an overview of key platform statistics.

<p align="center">
  <img src="frontend/src/assets/screenshots/Dashboard-1.png" alt="Dashboard" width="48%">
  <img src="frontend/src/assets/screenshots/Dashboard-2.png" alt="Dashboard Statistics" width="48%">
</p>

---

## 📊 Corpus Insights

Corpus Insights provides interactive analytics and visualizations, including corpus statistics, language distribution, media distribution, and leaderboard information.

<p align="center">
  <img src="frontend/src/assets/screenshots/Corpus-Insights-1.png" alt="Corpus Insights" width="48%">
  <img src="frontend/src/assets/screenshots/Corpus-Insights-2.png" alt="Corpus Insights Dashboard" width="48%">
</p>

---

## 💬 Ask Corpus

Ask Corpus enables users to interact with the corpus using natural language. Powered by Retrieval-Augmented Generation (RAG), BM25 retrieval, and Ollama (Llama 3.2), it delivers contextual and intelligent responses.

<p align="center">
  <img src="frontend/src/assets/screenshots/Ask-Corpus-1.png" alt="Ask Corpus" width="48%">
  <img src="frontend/src/assets/screenshots/Ask-Corpus-2.png" alt="Ask Corpus Response" width="48%">
</p>

---

## 🔍 Corpus Explorer

Corpus Explorer allows users to browse, search, and explore corpus datasets through an intuitive and user-friendly interface.

<p align="center">
  <img src="frontend/src/assets/screenshots/Corpus-Explorer-1.png" alt="Corpus Explorer" width="48%">
  <img src="frontend/src/assets/screenshots/Corpus-Explorer-2.png" alt="Corpus Explorer Search" width="48%">
</p>

<p align="center">
  <img src="frontend/src/assets/screenshots/Corpus-Explorer-3.png" alt="Corpus Explorer Details" width="48%">
  <img src="frontend/src/assets/screenshots/Corpus-Explorer-4.png" alt="Corpus Explorer Resources" width="48%">
</p>

---

## 🚀 SprintWise AI

SprintWise AI provides intelligent project management capabilities including project creation, team management, sprint planning, sprint generation, and project analytics.

<p align="center">
  <img src="frontend/src/assets/screenshots/SprintWise-AI-1.png" alt="SprintWise AI Dashboard" width="48%">
  <img src="frontend/src/assets/screenshots/SprintWise-AI-2.png" alt="SprintWise AI Projects" width="48%">
</p>

<p align="center">
  <img src="frontend/src/assets/screenshots/SprintWise-AI-3.png" alt="SprintWise AI Teams" width="48%">
  <img src="frontend/src/assets/screenshots/SprintWise-AI-4.png" alt="SprintWise AI Sprints" width="48%">
</p>

<p align="center">
  <img src="frontend/src/assets/screenshots/SprintWise-AI-5.png" alt="SprintWise AI Analytics" width="48%">
  <img src="frontend/src/assets/screenshots/SprintWise-AI-6.png" alt="SprintWise AI Project Details" width="48%">
</p>

<p align="center">
  <img src="frontend/src/assets/screenshots/SprintWise-AI-7.png" alt="SprintWise AI Team Management" width="48%">
  <img src="frontend/src/assets/screenshots/SprintWise-AI-8.png" alt="SprintWise AI Features" width="48%">
</p>

---

## 📋 Intern Onboarding

The Intern Onboarding module streamlines the onboarding workflow with task tracking, progress monitoring, screenshot uploads, and secure file storage using MinIO.

<p align="center">
  <img src="frontend/src/assets/screenshots/Onboarding-1.png" alt="Intern Onboarding" width="48%">
  <img src="frontend/src/assets/screenshots/Onboarding-2.png" alt="Onboarding Progress" width="48%">
</p>

<p align="center">
  <img src="frontend/src/assets/screenshots/Onboarding-3.png" alt="Onboarding Upload" width="48%">
</p>

---

## 🤖 CorpusGuard AI

CorpusGuard AI is the repository-aware intelligent assistant available throughout the platform. It integrates Ollama (Llama 3.2), Retrieval-Augmented Generation (RAG), BM25 retrieval, and conversation history to provide contextual answers from both local documents and the integrated Swecha Corpus.

<p align="center">
  <img src="frontend/src/assets/screenshots/CorpusGuard-AI.png" alt="CorpusGuard AI" width="75%">
</p>

---

## ⚙️ Settings

Users can configure application preferences and personalize their experience through the Settings module.

<p align="center">
  <img src="frontend/src/assets/screenshots/Settings.png" alt="Settings" width="60%">
</p>

---

## 🚪 Logout

The Logout option provides a secure way to end the current session and protect user access.

<p align="center">
  <img src="frontend/src/assets/screenshots/Logout.png" alt="Logout" width="35%">
</p>

---
# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router

## Backend

* FastAPI
* Python
* SQLAlchemy
* Alembic
* PostgreSQL
* MinIO
* REST APIs

## AI

* Ollama
* Retrieval-Augmented Generation (RAG)
* BM25 Retrieval
* Query Rewriting
* Sentence Transformers
* Optional PGVector

## DevOps

* Docker
* Docker Compose
* Git
* GitLab

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

* Backend API testing
* Frontend integration
* JWT authentication
* Corpus Insights
* Ask Corpus
* SprintWise AI
* Intern Onboarding
* MinIO upload
* CorpusGuard AI

---

# 🚀 Deployment

Deployment targets include:

* React/Vite frontend
* FastAPI backend
* PostgreSQL
* MinIO
* Production environment variables
* Alembic migrations
* Secure CORS configuration

---

# 🔮 Future Roadmap

* Semantic search
* Voice interaction
* Advanced analytics
* Multi-model AI
* Enterprise monitoring
* CI/CD
* Automated testing
* Knowledge synchronization

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