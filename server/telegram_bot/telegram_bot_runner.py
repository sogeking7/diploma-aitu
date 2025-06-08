from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    filters,
    ConversationHandler,
)

from telegram_bot.service.telegram_service import (
    start,
    handle_email,
    handle_password,
    cancel,
)

EMAIL, PASSWORD = range(2)

BOT_TOKEN = "8191476050:AAEeq4Pliit4glM4PamhHBgp4JfaUCK3SLc"


def start_telegram_bot():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            EMAIL: [MessageHandler(filters.TEXT & ~filters.COMMAND, handle_email)],
            PASSWORD: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_password)
            ],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    app.add_handler(conv_handler)

    app.run_polling()
