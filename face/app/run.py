import uvicorn
import os
import logging
from app.utils.logging import setup_logging
from app.config import settings

if __name__ == "__main__":
    # Setup logging
    log_level = getattr(logging, os.getenv("LOG_LEVEL", "INFO"))
    logger = setup_logging(log_level=log_level)

    logger.info("Starting Face Recognition API")

    # Run with production settings
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        workers=settings.MAX_WORKERS,
        log_level=log_level.lower(),
        reload=False,  # Disable reload in production
        access_log=True
    )
