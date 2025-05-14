import logging
from logging.handlers import RotatingFileHandler
import sys


def get_logger(name: str = __name__) -> logging.Logger:
    # Important: Configure the root logger first
    root_logger = logging.getLogger()
    if not root_logger.handlers:
        # Set the root logger level to DEBUG so it doesn't filter our messages
        root_logger.setLevel(logging.DEBUG)

    # Now configure our specific logger
    logger = logging.getLogger(name)

    # Always explicitly set the level (don't rely on inheritance)
    logger.setLevel(logging.DEBUG)

    # Only add handlers if they don't exist already
    if not logger.handlers:
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.DEBUG)
        console_formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        console_handler.setFormatter(console_formatter)

        # File handler
        file_handler = RotatingFileHandler("app.log", maxBytes=1000000, backupCount=3)
        file_handler.setLevel(logging.DEBUG)
        file_formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(file_formatter)

        logger.addHandler(console_handler)
        logger.addHandler(file_handler)

        # Make sure our logger doesn't propagate messages to parent loggers
        # This avoids duplicate log entries
        logger.propagate = False

    return logger
