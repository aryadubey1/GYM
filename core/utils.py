from __future__ import annotations

from typing import Any

import requests


def send_telegram_message(bot_token: str, chat_id: str, text: str) -> bool:
    """
    Send a plaintext message to a Telegram chat.

    Returns True if Telegram confirms success, False otherwise.
    """
    if not bot_token or not chat_id:
        return False

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload: dict[str, Any] = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    }
    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
    except Exception:
        return False

    return bool(data.get("ok"))

