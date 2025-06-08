# main.py
"""Main application entry point"""

from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    filters,
    ConversationHandler,
)

from telegram_bot.config import Config
from telegram_bot.constants import EMAIL, PASSWORD
from telegram_bot.handlers.base_handlers import (
    start_command,
    help_command,
    error_handler,
)
from telegram_bot.handlers.subscription_handlers import (
    handle_email,
    handle_password,
    cancel_conversation,
)
from telegram_bot.handlers.callback_handlers import button_handler
from telegram_bot.utils.logger import setup_logger

logger = setup_logger(__name__)


def create_conversation_handler():
    """Create the conversation handler for subscription flow"""
    return ConversationHandler(
        entry_points=[
            CallbackQueryHandler(button_handler, pattern="^start_subscription$")
        ],
        states={
            EMAIL: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_email),
                CallbackQueryHandler(cancel_conversation, pattern="^cancel$"),
            ],
            PASSWORD: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_password),
                CallbackQueryHandler(cancel_conversation, pattern="^cancel$"),
            ],
        },
        fallbacks=[
            CommandHandler("cancel", cancel_conversation),
            CallbackQueryHandler(cancel_conversation, pattern="^cancel$"),
        ],
    )


def start_telegram_bot():
    """Start the enhanced telegram bot"""
    try:
        Config.validate()
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        return

    app = ApplicationBuilder().token(Config.BOT_TOKEN).build()

    # Add handlers
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(create_conversation_handler())

    # Handle other callback queries
    app.add_handler(
        CallbackQueryHandler(button_handler, pattern="^(help|privacy|back_to_menu)$")
    )

    # Error handler
    app.add_error_handler(error_handler)

    logger.info("Starting Enhanced Telegram bot...")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    start_telegram_bot()
