import type { Conversation, Message, ContextDocument, User } from '@/types/chat'

export const MOCK_USER: User = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah.chen@corp.ai',
  role: 'Senior Engineer',
}

export const MOCK_MESSAGES: Record<string, Message[]> = {
  conv_1: [
    {
      id: 'msg_1',
      role: 'user',
      content: 'Explain the backend architecture of the corpus-nexus project.',
      timestamp: new Date('2026-07-22T09:15:00'),
    },
    {
      id: 'msg_2',
      role: 'assistant',
      content: `## Backend Architecture Overview

The **Corpus Nexus AI** backend follows a modular FastAPI architecture with clean separation of concerns:

### Core Structure

\`\`\`
backend/app/
├── main.py              # FastAPI application entry point
├── core/
│   ├── config.py        # Pydantic settings, env vars
│   └── security.py      # JWT auth, password hashing
├── database/
│   └── session.py       # SQLAlchemy async session
├── models/              # SQLAlchemy ORM models
├── schemas/             # Pydantic request/response schemas
├── services/            # Business logic layer
└── routers/             # API route handlers
    ├── auth/router.py
    ├── corpusguard/router.py
    ├── explorer/router.py
    ├── analytics/router.py
    ├── sprint/router.py
    └── onboarding/router.py
\`\`\`

### Key Design Patterns

1. **Router-per-domain**: Each feature module (\`auth\`, \`corpusguard\`, \`explorer\`, etc.) has its own router directory
2. **Service layer**: Business logic is separated from route handlers via a \`services/\` layer
3. **Async SQLAlchemy**: Database sessions use async drivers for non-blocking I/O
4. **Pydantic schemas**: Strict input/output validation with \`schemas/\` models
5. **JWT Authentication**: Token-based auth with \`core/security.py\` handling hashing and verification

### Request Flow

\`\`\`
Client → Router → Service → Repository (SQLAlchemy) → Database
\`\`\`

All routers are mounted on the main FastAPI app in \`main.py\` and use dependency injection for database sessions and current user context.`,
      timestamp: new Date('2026-07-22T09:15:12'),
    },
    {
      id: 'msg_3',
      role: 'user',
      content: 'How does the authentication flow work?',
      timestamp: new Date('2026-07-22T09:16:00'),
    },
    {
      id: 'msg_4',
      role: 'assistant',
      content: `## Authentication Flow

The authentication system uses **JWT tokens** with a standard access/refresh pattern:

### Login Flow

\`\`\`
1. User sends POST /auth/login with email + password
2. security.py verifies password against bcrypt hash
3. JWT access token (short-lived) + refresh token generated
4. Tokens returned to client
\`\`\`

### Token Validation

\`\`\`
1. Client sends Authorization: Bearer <token>
2. security.py decodes and validates JWT signature
3. User is loaded from database via dependency injection
4. Route handler receives authenticated user object
\`\`\`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/auth/login\` | Authenticate and get tokens |
| POST | \`/auth/register\` | Create new account |
| POST | \`/auth/refresh\` | Refresh access token |
| GET | \`/auth/me\` | Get current user profile |

### Security Features

- **bcrypt** password hashing with salt rounds
- **Token expiration** with configurable TTL
- **Refresh token rotation** to prevent replay attacks
- **CORS** configured for frontend origin`,
      timestamp: new Date('2026-07-22T09:16:15'),
    },
  ],
  conv_2: [
    {
      id: 'msg_5',
      role: 'user',
      content: 'Which projects use Redis in the infrastructure?',
      timestamp: new Date('2026-07-22T08:30:00'),
    },
    {
      id: 'msg_6',
      role: 'assistant',
      content: `## Redis Usage Across Projects

Based on the codebase analysis, Redis is used in the following services:

### 1. Session Caching
- **Service**: Auth module (\`core/security.py\`)
- **Use**: Token blacklist for logout/revocation
- **Key Pattern**: \`blacklist:{token_jti}\` with TTL matching token expiry

### 2. Rate Limiting
- **Service**: API Gateway layer
- **Use**: Request rate limiting per user/IP
- **Key Pattern**: \`ratelimit:{user_id}:{endpoint}\` with sliding window

### 3. Corpus Search Cache
- **Service**: Explorer module (\`routers/explorer\`)
- **Use**: Caching frequent search queries and results
- **Key Pattern**: \`search:{query_hash}\` with 5-minute TTL

### 4. Real-time Features
- **Service**: Sprint planning module
- **Use**: Pub/Sub for live collaboration updates
- **Channel**: \`sprint:{project_id}:updates\`

### Connection Config

\`\`\`python
# core/config.py
REDIS_URL: str = "redis://localhost:6379/0"
REDIS_CACHE_TTL: int = 300
\`\`\``,
      timestamp: new Date('2026-07-22T08:30:20'),
    },
  ],
  conv_3: [
    {
      id: 'msg_7',
      role: 'user',
      content: 'Explain the Docker setup for this project.',
      timestamp: new Date('2026-07-21T14:00:00'),
    },
    {
      id: 'msg_8',
      role: 'assistant',
      content: `## Docker Setup

The project uses **Docker Compose** for local development with multi-service orchestration.

### Services

\`\`\`yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    depends_on: [db, redis]
    
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    
  db:
    image: postgres:16
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]
    
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
\`\`\`

### Development Workflow

\`\`\`bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f backend

# Run migrations
docker compose exec backend alembic upgrade head

# Access shell
docker compose exec backend bash
\`\`\`

### Production Considerations

- **Multi-stage builds** for smaller frontend images
- **Health checks** on all services
- **Volume persistence** for database data
- **Environment-specific** override files (\`docker-compose.prod.yml\`)`,
      timestamp: new Date('2026-07-21T14:00:18'),
    },
  ],
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    title: 'Backend Architecture Deep Dive',
    messages: MOCK_MESSAGES['conv_1'],
    createdAt: new Date('2026-07-22T09:15:00'),
    updatedAt: new Date('2026-07-22T09:16:15'),
    model: 'gpt-4o',
  },
  {
    id: 'conv_2',
    title: 'Redis Infrastructure Analysis',
    messages: MOCK_MESSAGES['conv_2'],
    createdAt: new Date('2026-07-22T08:30:00'),
    updatedAt: new Date('2026-07-22T08:30:20'),
    model: 'gpt-4o',
  },
  {
    id: 'conv_3',
    title: 'Docker Configuration Review',
    messages: MOCK_MESSAGES['conv_3'],
    createdAt: new Date('2026-07-21T14:00:00'),
    updatedAt: new Date('2026-07-21T14:00:18'),
    model: 'gpt-4o',
  },
]

export const MOCK_CONTEXT_DOCUMENTS: ContextDocument[] = [
  {
    id: 'doc_1',
    title: 'Architecture Overview.md',
    type: 'architecture',
    source: 'docs/',
    snippet: 'Microservices architecture with FastAPI backend...',
  },
  {
    id: 'doc_2',
    title: 'auth/router.py',
    type: 'repository',
    source: 'backend/app/routers/auth/',
    snippet: 'POST /login, POST /register, POST /refresh...',
  },
  {
    id: 'doc_3',
    title: 'docker-compose.yml',
    type: 'docker',
    source: 'root/',
    snippet: 'Services: backend, frontend, db, redis...',
  },
  {
    id: 'doc_4',
    title: 'User Model',
    type: 'database',
    source: 'models/user.py',
    snippet: 'Table: users — id, email, hashed_password...',
  },
  {
    id: 'doc_5',
    title: 'Auth API',
    type: 'api',
    source: 'routers/auth/',
    snippet: '/auth/login, /auth/register, /auth/refresh...',
  },
  {
    id: 'doc_6',
    title: 'Corpus Nexus AI',
    type: 'project',
    source: 'backend/',
    snippet: 'FastAPI + SQLAlchemy + PostgreSQL...',
  },
]

export const MOCK_AI_RESPONSES: Record<string, string> = {
  'explain backend architecture': `## Backend Architecture

The Corpus Nexus AI backend is built with **FastAPI** following a clean modular architecture:

### Technology Stack
- **Framework**: FastAPI (async Python)
- **ORM**: SQLAlchemy with async support
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: JWT with bcrypt

### Module Structure
Each feature is organized as a self-contained module with its own router, service, and schema layers.\n\nThis promotes loose coupling and makes the codebase easy to navigate and extend.`,
  'which project uses redis?': `## Redis Usage

Redis is used across several services in the infrastructure:

1. **Auth Module** — Token blacklist and session caching
2. **Explorer Module** — Search query result caching
3. **Sprint Module** — Real-time pub/sub for collaboration
4. **Rate Limiter** — API throttling per user/IP

All Redis operations are centralized through \`core/config.py\` with configurable TTLs.`,
  'explain login flow': `## Login Flow

The authentication follows a standard JWT pattern:

1. **Client** sends credentials to \`POST /auth/login\`
2. **Server** validates against bcrypt-hashed password
3. **JWT tokens** are generated (access + refresh)
4. **Client** stores tokens and includes in \`Authorization\` header
5. **Server** validates token on each protected route

Token refresh happens automatically via \`POST /auth/refresh\`.`,
  'show postgresql schema': `## PostgreSQL Schema

### Users Table
| Column | Type | Constraint |
|--------|------|------------|
| id | UUID | PK |
| email | VARCHAR(255) | UNIQUE NOT NULL |
| hashed_password | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Projects Table
| Column | Type | Constraint |
|--------|------|------------|
| id | UUID | PK |
| name | VARCHAR(255) | NOT NULL |
| owner_id | UUID | FK → users.id |
| created_at | TIMESTAMP | DEFAULT NOW() |`,
  'explain docker setup': `## Docker Setup

Multi-container architecture with Docker Compose:

- **backend**: FastAPI app on port 8000
- **frontend**: Vite dev server on port 5173
- **db**: PostgreSQL 16 on port 5432
- **redis**: Redis 7-alpine on port 6379

Start with \`docker compose up -d\` and view logs with \`docker compose logs -f\`.`,
  'how do i deploy this project?': `## Deployment Guide

### Production Deployment

1. **Build frontend**: \`cd frontend && npm run build\`
2. **Build Docker images**: \`docker compose -f docker-compose.prod.yml build\`
3. **Run migrations**: \`docker compose exec backend alembic upgrade head\`
4. **Start services**: \`docker compose -f docker-compose.prod.yml up -d\`

### Environment Variables
Set these in your \`.env.production\` file:
- \`DATABASE_URL\`
- \`REDIS_URL\`  
- \`JWT_SECRET\`
- \`CORS_ORIGINS\``,
}
