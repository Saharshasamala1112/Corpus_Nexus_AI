from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "SprintWise AI API"

    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/sprintwise_ai"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
