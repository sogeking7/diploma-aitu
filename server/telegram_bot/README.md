# README.md
# Enhanced Telegram Bot

A professional Telegram bot for user authentication and notification subscriptions.

## Features

- 🔐 Secure user authentication
- 📢 Notification subscription management
- 🎯 Interactive inline keyboards
- ✅ Input validation and error handling
- 🌐 RESTful API integration
- 📝 Comprehensive logging
- 🏗️ Modular architecture

## Project Structure

```
telegram_bot/
├── __init__.py
├── config.py                 # Configuration management
├── constants.py              # Static text and constants
├── keyboards.py              # Keyboard layouts
├── handlers/
│   ├── __init__.py
│   ├── base_handlers.py      # Basic command handlers
│   ├── callback_handlers.py  # Callback query handlers
│   └── subscription_handlers.py # Subscription flow handlers
├── services/
│   ├── __init__.py
│   └── api_service.py        # API communication service
└── utils/
    ├── __init__.py
    ├── logger.py             # Logging configuration
    └── validators.py         # Input validation utilities

main.py                       # Application entry point
requirements.txt              # Python dependencies
.env.example                  # Environment variables template
README.md                     # Project documentation
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
4. Set your bot token and API URL in `.env`

## Usage

Run the bot:
```bash
python main.py
```

## Configuration

Configure the following environment variables in `.env`:

- `BOT_TOKEN`: Your Telegram bot token from @BotFather
- `API_BASE_URL`: Your backend API URL (default: http://localhost:8000)
- `LOG_LEVEL`: Logging level (default: INFO)

## API Endpoints

The bot expects the following API endpoints:

- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/users/me` - Get user information
- `POST /api/v1/notifications` - Create notification subscription

## License

This project is licensed under the MIT License.