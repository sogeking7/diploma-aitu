import logging
import sys
import os
import time
from logging.handlers import RotatingFileHandler


def setup_logging(log_level=logging.INFO, log_dir="logs"):
    os.makedirs(log_dir, exist_ok=True)

    # Create handlers
    console_handler = logging.StreamHandler(sys.stdout)
    file_handler = RotatingFileHandler(
        f"{log_dir}/face_api.log",
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5
    )

    # Set formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)

    # Return logger for convenience
    return root_logger
