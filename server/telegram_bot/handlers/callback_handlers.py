# telegram_bot/handlers/callback_handlers.py
"""Callback query handlers"""

from telegram import Update
from telegram.ext import ContextTypes, ConversationHandler
from telegram_bot.constants import EMAIL
from telegram_bot.handlers.subscription_handlers import (
    start_subscription,
    cancel_conversation,
)
from telegram_bot.handlers.base_handlers import show_help, show_privacy, back_to_menu
from telegram_bot.utils.logger import setup_logger

logger = setup_logger(__name__)


async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle inline keyboard button presses"""
    query = update.callback_query
    await query.answer()

    logger.info(f"Button pressed: {query.data} by user {update.effective_user.id}")

    if query.data == "start_subscription":
        await start_subscription(update, context)
        return EMAIL
    elif query.data == "help":
        await show_help(update, context)
    elif query.data == "privacy":
        await show_privacy(update, context)
    elif query.data == "cancel":
        await cancel_conversation(update, context)
        return ConversationHandler.END
    elif query.data == "back_to_menu":
        await back_to_menu(update, context)
