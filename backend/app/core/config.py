from functools import lru_cache

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()


class Settings(BaseSettings):
    APP_NAME: str = "SprintWise AI API"

    DATABASE_URL: str = (
        "postgresql://postgres:postgres@localhost:5432/sprintwise_ai"
    )

    APP_VERSION: str = "1.0.0"

    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000

    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ]

    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET_NAME: str = "onboarding-images"
    MINIO_SECURE: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()