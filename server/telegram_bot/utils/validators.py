# telegram_bot/utils/validators.py
"""Input validation utilities"""

import re
from typing import Tuple


def validate_email(email: str) -> Tuple[bool, str]:
    """
    Validate email address format

    Args:
        email: Email string to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    email = email.strip()

    if not email:
        return False, "Email не может быть пустым"

    # Basic email pattern
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    if not re.match(email_pattern, email):
        return False, "Некорректный формат email адреса"

    if len(email) > 254:  # RFC 5321 limit
        return False, "Email адрес слишком длинный"

    return True, ""


def validate_password(password: str) -> Tuple[bool, str]:
    """
    Basic password validation

    Args:
        password: Password string to validate

    Returns:
        Tuple of (is_valid, error_message)
    """
    if not password:
        return False, "Пароль не может быть пустым"

    if len(password) < 3:  # Minimum length check
        return False, "Пароль слишком короткий"

    return True, ""
