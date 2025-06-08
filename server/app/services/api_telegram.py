from httpx import AsyncClient

from app.core.config import settings

url = f"https://api.telegram.org/bot{settings.BOT_TOKEN}"


async def send_message(client: AsyncClient, chat_id: int, text: str):
    await client.post(f"{url}/sendMessage", json={"chat_id": chat_id, "text": text})
