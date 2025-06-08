# telegram_bot/utils/logger.py
"""Logging configuration"""

import logging
import sys
from telegram_bot.config import Config


def setup_logger(name: str = __name__) -> logging.Logger:
    """
    Setup logger with proper formatting

    Args:
        name: Logger name

    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger

    # Set log level
    level = getattr(logging, Config.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(level)

    # Create handler
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(level)

    # Create formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)

    logger.addHandler(handler)
    return logger
