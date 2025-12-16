from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    PROJECT_NAME: str = "Skin Analysis Service"
    API_V1_STR: str = "/api/v1"

    # Mock Mode - Set to False in production when real ML model is ready
    MOCK_MODE: bool = True

    # CORS - Allow all for development, restrict for production
    BACKEND_CORS_ORIGINS: list[str] = ["*"]


settings = Settings()
