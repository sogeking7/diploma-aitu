from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    NEON_DATABASE_URL: str
    DATABASE_URL: str
    SESSION_DURATION_MINUTES: int = 30
    PINECONE_API_KEY: str
    PINECONE_REGION: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    secret_key: str

    class Config:
        env_file = ".env"


settings = Settings()
