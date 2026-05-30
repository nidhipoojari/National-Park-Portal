"""Configuration loaded from environment / .env."""
from __future__ import annotations

import os

from dotenv import load_dotenv

load_dotenv(override=True)


class Settings:
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_base_url: str = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    ai_model: str = os.getenv("AI_MODEL", "openai/gpt-4o-mini")
    backend_api_url: str = os.getenv("BACKEND_API_URL", "http://localhost:4000").rstrip("/")
    cors_origin: str = os.getenv("CORS_ORIGIN", "http://localhost:3000")
    port: int = int(os.getenv("PORT", "8000"))

    @property
    def has_key(self) -> bool:
        return bool(self.openai_api_key)


settings = Settings()
