import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Configuration class for the bot"""

    BOT_TOKEN = os.getenv("BOT_TOKEN")
    API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    @classmethod
    def validate(cls):
        """Validate required configuration"""
        if not cls.BOT_TOKEN:
            raise ValueError("BOT_TOKEN environment variable is required")
        return True
