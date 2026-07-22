from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    APP_NAME: str = "CorpusGuard AI Assistant"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./corpusguard.db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT / Auth
    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # LLM
    LLM_PROVIDER: str = "ollama"
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "llama3.2"
    LLM_TEMPERATURE: float = 0.1
    LLM_MAX_TOKENS: int = 4096

    # Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2"
    OLLAMA_MAX_RETRIES: int = 2
    OLLAMA_TIMEOUT_SECONDS: int = 120

    # RAG / Knowledge
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    VECTOR_STORE_TYPE: str = "in_memory"
    VECTOR_STORE_PATH: str = "./chroma_db"
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 150
    TOP_K: int = 5
    MIN_RELEVANCE_SCORE: float = 0.3

    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_MAX_REQUESTS: int = 60
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    # Security
    ALLOWED_FILE_EXTENSIONS: list[str] = Field(
        default_factory=lambda: [
            ".py",
            ".ts",
            ".tsx",
            ".js",
            ".jsx",
            ".yaml",
            ".yml",
            ".json",
            ".md",
            ".markdown",
            ".txt",
            ".toml",
            ".cfg",
            ".ini",
            ".sh",
            ".pdf",
            ".rst",
            ".env",
            ".dockerfile",
        ]
    )

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"

    # Explorer compatibility
    corpus_api_base_url: str = "http://127.0.0.1:8000"
    corpus_api_token: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
