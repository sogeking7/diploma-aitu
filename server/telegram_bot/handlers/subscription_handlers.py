# telegram_bot/handlers/subscription_handlers.py
"""Subscription conversation handlers"""

from datetime import datetime
import requests
from telegram import Update
from telegram.ext import ContextTypes, ConversationHandler

from telegram_bot.constants import (
    EMAIL,
    PASSWORD,
    EMAIL_STEP_TEXT,
    PASSWORD_STEP_TEXT,
    SUCCESS_MESSAGE_TEXT,
    ERROR_MESSAGES,
)
from telegram_bot.keyboards import get_cancel_keyboard, get_main_keyboard
from telegram_bot.utils.validators import validate_email, validate_password
from telegram_bot.services.api_service import APIService
from telegram_bot.utils.logger import setup_logger

logger = setup_logger(__name__)


async def start_subscription(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Start the subscription process"""
    if update.callback_query:
        await update.callback_query.edit_message_text(
            EMAIL_STEP_TEXT, parse_mode="Markdown", reply_markup=get_cancel_keyboard()
        )
    else:
        await update.message.reply_text(
            EMAIL_STEP_TEXT, parse_mode="Markdown", reply_markup=get_cancel_keyboard()
        )
    return EMAIL


async def handle_email(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle email input with validation"""
    email = update.message.text.strip()

    # Validate email
    is_valid, error_msg = validate_email(email)
    if not is_valid:
        await update.message.reply_text(
            f"❌ {error_msg}\n\n*Пример: user@example.com*",
            parse_mode="Markdown",
            reply_markup=get_cancel_keyboard(),
        )
        return EMAIL

    context.user_data["email"] = email

    message = PASSWORD_STEP_TEXT.format(email=email)

    await update.message.reply_text(
        message, parse_mode="Markdown", reply_markup=get_cancel_keyboard()
    )
    logger.info(f"Email received for user {update.effective_user.id}")
    return PASSWORD


async def handle_password(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle password input and authentication"""
    email = context.user_data.get("email")
    password = update.message.text
    chat_id = update.effective_chat.id

    # Validate password
    is_valid, error_msg = validate_password(password)
    if not is_valid:
        await update.message.reply_text(
            f"❌ {error_msg}", reply_markup=get_cancel_keyboard()
        )
        return PASSWORD

    # Delete the password message for security
    try:
        await update.message.delete()
    except Exception:
        pass  # Message might be already deleted or bot doesn't have permissions

    # Show processing message
    processing_msg = await context.bot.send_message(
        chat_id=chat_id, text="⏳ Обрабатываем ваши данные...", reply_markup=None
    )

    api_service = APIService()

    try:
        # Authenticate user
        auth_data = await api_service.authenticate_user(email, password)
        token = auth_data["access_token"]

        # Get user info
        user_info = await api_service.get_user_info(token)

        # Create notification subscription
        await api_service.create_notification_subscription(token, chat_id)

        # Success message
        success_message = SUCCESS_MESSAGE_TEXT.format(
            email=user_info.get("email", email),
            chat_id=chat_id,
            date=datetime.now().strftime("%Y-%m-%d"),
        )

        await processing_msg.edit_text(
            success_message, parse_mode="Markdown", reply_markup=get_main_keyboard()
        )

        logger.info(
            f"Successful subscription for user {update.effective_user.id}, email: {email}"
        )

        # Clear user data
        context.user_data.clear()
        return ConversationHandler.END

    except requests.exceptions.Timeout:
        await processing_msg.edit_text(
            ERROR_MESSAGES["timeout"],
            parse_mode="Markdown",
            reply_markup=get_main_keyboard(),
        )

    except requests.exceptions.ConnectionError:
        await processing_msg.edit_text(
            ERROR_MESSAGES["connection_error"],
            parse_mode="Markdown",
            reply_markup=get_main_keyboard(),
        )

    except requests.exceptions.HTTPError as http_err:
        try:
            error_data = http_err.response.json()
            error_msg = error_data.get("message") or error_data.get(
                "detail", "Неизвестная ошибка"
            )

            if http_err.response.status_code == 401:
                error_msg = "Неверный email или пароль"
            elif http_err.response.status_code == 404:
                error_msg = "Пользователь не найден"
            elif http_err.response.status_code >= 500:
                error_msg = "Ошибка сервера. Попробуйте позже"

        except (ValueError, AttributeError):
            error_msg = f"Ошибка HTTP {http_err.response.status_code}"

        await processing_msg.edit_text(
            ERROR_MESSAGES["auth_error"].format(error=error_msg),
            parse_mode="Markdown",
            reply_markup=get_main_keyboard(),
        )

    except Exception as e:
        logger.error(f"Unexpected error in handle_password: {str(e)}")
        await processing_msg.edit_text(
            ERROR_MESSAGES["unexpected_error"].format(error=str(e)),
            parse_mode="Markdown",
            reply_markup=get_main_keyboard(),
        )

    # Clear sensitive data
    context.user_data.clear()
    return ConversationHandler.END


async def cancel_conversation(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Cancel the conversation"""
    context.user_data.clear()

    if update.callback_query:
        await update.callback_query.edit_message_text(
            ERROR_MESSAGES["operation_cancelled"],
            parse_mode="Markdown",
            reply_markup=get_main_keyboard(),
        )
    else:
        await update.message.reply_text(
            ERROR_MESSAGES["operation_cancelled"],
            parse_mode="Markdown",
            reply_markup=get_main_keyboard(),
        )

    logger.info(f"Conversation cancelled by user {update.effective_user.id}")
    return ConversationHandler.END
