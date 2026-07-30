# Contributing to Corpus Nexus AI

Thank you for your interest in contributing to Corpus Nexus AI! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Docker & Docker Compose (for MinIO, PostgreSQL, Ollama)

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Docker Services

```bash
docker compose up -d
```

## Pre-commit Hooks

This project uses pre-commit to automatically run code quality checks before each commit.

### Installed Hooks

| Hook | Description |
|---|---|
| trailing-whitespace | Removes trailing whitespace |
| end-of-file-fixer | Ensures files end with a newline |
| check-yaml | Validates YAML syntax |
| check-json | Validates JSON syntax |
| check-toml | Validates TOML syntax |
| check-merge-conflict | Detects merge conflict markers |
| detect-private-key | Detects private keys |
| check-added-large-files | Prevents adding large files (>1MB) |
| ruff | Python linting (backend) |
| ruff-format | Python code formatting (backend) |
| eslint | JavaScript/TypeScript linting (frontend) |
| bandit | Security vulnerability scanning (backend) |
| vulture | Dead code detection (backend) |

### Manual Usage

Run all checks manually:

```bash
uv run pre-commit run --all-files
```

Run a specific check:

```bash
uv run pre-commit run ruff
uv run pre-commit run bandit
uv run pre-commit run vulture
```

### Skipping Pre-commit (Use Sparingly)

```bash
git commit --no-verify -m "Your commit message"
```

> Only skip when absolutely necessary. All checks must pass before merging.

## Development Workflow

### Code Quality

This project uses several tools to maintain code quality:

#### Backend (Python)

- **Ruff** for linting and formatting
- **Bandit** for security analysis
- **Vulture** for detecting unused code

Run all backend checks:

```bash
cd backend
ruff check .
ruff format --check .
bandit -r app/
vulture app/
```

#### Frontend (TypeScript/React)

- **ESLint** for linting
- **TypeScript** for type checking

Run all frontend checks:

```bash
cd frontend
npm run lint
npx tsc --noEmit
```

### Testing

#### Backend Tests

```bash
cd backend
pytest
```

Run tests with coverage:

```bash
pytest --cov=app --cov-fail-under=75
```

#### Frontend Tests

```bash
cd frontend
npm run test
```

## Commit Messages

We follow conventional commits format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for test additions/changes
- `chore:` for maintenance tasks
- `style:` for formatting/styling changes
- `perf:` for performance improvements

Example:

```bash
git commit -m "feat: add batch upload support for large files"
```

## Pull Request Process

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure all checks pass.

3. Run quality checks:
   ```bash
   # Backend
   cd backend
   ruff check --fix .
   ruff format .
   pytest

   # Frontend
   cd frontend
   npm run lint
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. Push to remote:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a merge request on GitLab.

## Project Structure

```
corpus-nexus-ai/
├── backend/
│   ├── app/
│   │   ├── api/             # API route handlers
│   │   ├── core/            # Core configuration & settings
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── repositories/    # Data access layer
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # Utility functions
│   │   ├── config.py        # Application config
│   │   ├── db.py            # Database session setup
│   │   └── main.py          # FastAPI entry point
│   ├── alembic/             # Database migrations
│   ├── tests/               # Backend test suite
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Backend container image
│   └── .env.example         # Environment template
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/             # API client & interceptors
│   │   ├── assets/          # Images, icons, fonts
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Page layout components
│   │   ├── lib/             # Utility libraries
│   │   ├── pages/           # Module page components
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # Frontend service layer
│   │   ├── styles/          # Global styles & themes
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper functions
│   │   ├── App.tsx          # Root application component
│   │   └── main.tsx         # Application entry point
│   ├── package.json         # Node.js dependencies
│   ├── vite.config.ts       # Vite build configuration
│   └── .env.example         # Environment template
│
├── docs/
│   └── ai-platform/         # Platform documentation
│
├── docker-compose.yml       # Container orchestration
├── README.md                # Project overview
├── CONTRIBUTING.md          # Contribution guidelines
├── CHANGELOG.md             # Version history
└── LICENSE                  # License information
```

## Code Style

### Python (Backend)

- Follow PEP 8 guidelines
- Use type hints for all function signatures
- Write docstrings for public functions and classes
- Keep functions focused and small
- Use meaningful variable and function names
- Prefer async/await for I/O operations

### TypeScript/React (Frontend)

- Follow the project's ESLint configuration
- Use TypeScript strict mode
- Use functional components with hooks
- Name components in PascalCase
- Name files in camelCase for utilities, PascalCase for components
- Use Tailwind CSS for styling (avoid inline styles)

## Reporting Issues

When reporting issues, please include:

- Python version (`python --version`)
- Node.js version (`node --version`)
- Steps to reproduce the issue
- Expected vs actual behavior
- Error messages or logs if applicable
- Browser and OS information (for frontend issues)

## Feature Requests

We welcome feature requests! Please open an issue with:

- A clear description of the feature
- The problem it solves or value it adds
- Any implementation ideas or references

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see [LICENSE](LICENSE)).
