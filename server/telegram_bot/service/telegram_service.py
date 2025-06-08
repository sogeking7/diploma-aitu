from telegram import Update
from telegram.ext import ContextTypes, ConversationHandler
import requests

EMAIL, PASSWORD = range(2)
API_BASE_URL = "http://localhost:8000"


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Введите ваш email:")
    return EMAIL


async def handle_email(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["email"] = update.message.text
    await update.message.reply_text("Теперь введите пароль:")
    return PASSWORD


async def handle_password(update: Update, context: ContextTypes.DEFAULT_TYPE):
    email = context.user_data["email"]
    password = update.message.text
    chat_id = update.effective_chat.id

    try:
        res = requests.post(
            f"{API_BASE_URL}/api/v1/auth/login",
            data={"username": email, "password": password},
        )
        res.raise_for_status()
        token = res.json()["access_token"]

        me = requests.get(
            f"{API_BASE_URL}/api/v1/users/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        me.raise_for_status()

        create_notification = requests.post(
            f"{API_BASE_URL}/api/v1/notifications",
            json={"chat_id": chat_id},
            headers={"Authorization": f"Bearer {token}"},
        )
        create_notification.raise_for_status()

        await update.message.reply_text("✅ Вы успешно подписались.")
        return ConversationHandler.END

    except requests.exceptions.HTTPError as http_err:
        error_data = http_err.response.json()
        error_msg = (
            error_data.get("message") or error_data.get("detail") or str(error_data)
        )

        await update.message.reply_text(f"❌ {error_msg}")
        return ConversationHandler.END

    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка входа или подписки: {str(e)}")
        return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Операция отменена.")
    return ConversationHandler.END
