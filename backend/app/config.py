import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./ecokube.db"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENV: str = "development"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
