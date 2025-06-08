# telegram_bot/handlers/base_handlers.py
"""Base handlers for the bot"""

from telegram import Update
from telegram.ext import ContextTypes
from telegram_bot.constants import WELCOME_TEXT, HELP_TEXT, PRIVACY_TEXT
from telegram_bot.keyboards import get_main_keyboard, get_back_to_menu_keyboard
from telegram_bot.utils.logger import setup_logger

logger = setup_logger(__name__)


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Enhanced start command with welcome message"""
    user = update.effective_user
    welcome_message = f"👋 Привет, {user.first_name}!\n\n{WELCOME_TEXT}"

    await update.message.reply_text(
        welcome_message, parse_mode="Markdown", reply_markup=get_main_keyboard()
    )
    logger.info(f"User {user.id} started the bot")


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Help command handler"""
    await show_help(update, context)


async def show_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show help information"""
    if update.callback_query:
        await update.callback_query.edit_message_text(
            HELP_TEXT, parse_mode="Markdown", reply_markup=get_back_to_menu_keyboard()
        )
    else:
        await update.message.reply_text(
            HELP_TEXT, parse_mode="Markdown", reply_markup=get_back_to_menu_keyboard()
        )


async def show_privacy(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show privacy information"""
    if update.callback_query:
        await update.callback_query.edit_message_text(
            PRIVACY_TEXT,
            parse_mode="Markdown",
            reply_markup=get_back_to_menu_keyboard(),
        )
    else:
        await update.message.reply_text(
            PRIVACY_TEXT,
            parse_mode="Markdown",
            reply_markup=get_back_to_menu_keyboard(),
        )


async def back_to_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Return to main menu"""
    query = update.callback_query
    await query.answer()

    user = update.effective_user
    welcome_message = f"👋 {user.first_name}!\n\n{WELCOME_TEXT}"

    await query.edit_message_text(
        welcome_message, parse_mode="Markdown", reply_markup=get_main_keyboard()
    )


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle errors"""
    logger.error(f"Update {update} caused error {context.error}")

    if update.effective_message:
        from telegram_bot.constants import ERROR_MESSAGES

        await update.effective_message.reply_text(
            ERROR_MESSAGES["general_error"], reply_markup=get_main_keyboard()
        )
