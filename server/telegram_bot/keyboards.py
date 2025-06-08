"""Keyboard layouts for the bot"""

from telegram import InlineKeyboardButton, InlineKeyboardMarkup


def get_main_keyboard() -> InlineKeyboardMarkup:
    """Create main menu keyboard"""
    keyboard = [
        [
            InlineKeyboardButton(
                "🚀 Начать подписку", callback_data="start_subscription"
            )
        ],
        [InlineKeyboardButton("ℹ️ Помощь", callback_data="help")],
        [InlineKeyboardButton("🔒 Конфиденциальность", callback_data="privacy")],
    ]
    return InlineKeyboardMarkup(keyboard)


def get_cancel_keyboard() -> InlineKeyboardMarkup:
    """Create cancel keyboard for conversation steps"""
    keyboard = [[InlineKeyboardButton("❌ Отменить", callback_data="cancel")]]
    return InlineKeyboardMarkup(keyboard)


def get_back_to_menu_keyboard() -> InlineKeyboardMarkup:
    """Create back to menu keyboard"""
    keyboard = [[InlineKeyboardButton("🔙 Назад в меню", callback_data="back_to_menu")]]
    return InlineKeyboardMarkup(keyboard)
