"""API service for backend communication"""

import requests
from typing import Dict, Any, Optional
from telegram_bot.config import Config
from telegram_bot.utils.logger import setup_logger

logger = setup_logger(__name__)


class APIService:
    """Service for handling API communication"""

    def __init__(self):
        self.base_url = Config.API_BASE_URL
        self.timeout = 10

    async def authenticate_user(self, email: str, password: str) -> Dict[str, Any]:
        """
        Authenticate user with email and password

        Args:
            email: User email
            password: User password

        Returns:
            Authentication response data

        Raises:
            requests.exceptions.RequestException: On API errors
        """
        try:
            response = requests.post(
                f"{self.base_url}/api/v1/auth/login",
                data={"username": email, "password": password},
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Authentication failed for {email}: {str(e)}")
            raise

    async def get_user_info(self, token: str) -> Dict[str, Any]:
        """
        Get user information using auth token

        Args:
            token: Authentication token

        Returns:
            User information

        Raises:
            requests.exceptions.RequestException: On API errors
        """
        try:
            response = requests.get(
                f"{self.base_url}/api/v1/users/me",
                headers={"Authorization": f"Bearer {token}"},
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get user info: {str(e)}")
            raise

    async def create_notification_subscription(
        self, token: str, chat_id: int
    ) -> Dict[str, Any]:
        """
        Create notification subscription for user

        Args:
            token: Authentication token
            chat_id: Telegram chat ID

        Returns:
            Subscription response data

        Raises:
            requests.exceptions.RequestException: On API errors
        """
        try:
            response = requests.post(
                f"{self.base_url}/api/v1/notifications",
                json={"chat_id": chat_id},
                headers={"Authorization": f"Bearer {token}"},
                timeout=self.timeout,
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create notification subscription: {str(e)}")
            raise
