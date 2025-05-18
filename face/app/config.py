import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # API settings
    API_TITLE: str = "Face Recognition API"
    API_DESCRIPTION: str = "API for face recognition and verification"
    API_V1_PREFIX: str = ""

    # Face recognition settings
    FACE_MATCH_THRESHOLD: float = float(os.getenv("FACE_MATCH_THRESHOLD", "0.7"))
    DEFAULT_TOP_K: int = int(os.getenv("DEFAULT_TOP_K", "1"))

    # Performance settings
    MAX_WORKERS: int = int(os.getenv("MAX_WORKERS", "4"))

    # FAISS settings
    FAISS_INDEX_TYPE: str = os.getenv("FAISS_INDEX_TYPE", "flat")  # flat, ivf, ivfpq, hnsw
    EXPECTED_FACES: int = int(os.getenv("EXPECTED_FACES", "1000"))

    # Data paths
    DATA_DIR: str = os.getenv("DATA_DIR", "data")
    FAISS_INDEX_PATH: str = os.path.join(DATA_DIR, "face_index.faiss")
    METADATA_PATH: str = os.path.join(DATA_DIR, "face_metadata.pkl")

    # Security
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT", "60"))

    class Config:
        env_file = ".env"


settings = Settings()
