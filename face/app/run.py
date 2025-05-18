import uvicorn
import os
import logging
from app.utils.logging import setup_logging
from app.config import settings

if __name__ == "__main__":
    log_level_name = os.getenv("LOG_LEVEL", "INFO")
    log_level = getattr(logging, log_level_name)
    logger = setup_logging(log_level=log_level)

    logger.info("Starting Face Recognition API")

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        workers=settings.MAX_WORKERS,
        log_level=log_level_name.lower(),
        reload=False,  # Disable reload in production
        access_log=True
    )