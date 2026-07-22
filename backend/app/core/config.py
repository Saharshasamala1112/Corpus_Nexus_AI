from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
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

    # LLM (placeholder)
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o"

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"


@lru_cache
def get_settings() -> Settings:
    return Settings()
