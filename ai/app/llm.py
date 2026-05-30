"""LLM factory — OpenAI-compatible, works with OpenRouter or OpenAI."""
from __future__ import annotations

from langchain_openai import ChatOpenAI

from .config import settings


def make_llm(temperature: float = 0.2) -> ChatOpenAI:
    if not settings.has_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Copy ai/.env.example to ai/.env and add your key."
        )
    return ChatOpenAI(
        model=settings.ai_model,
        temperature=temperature,
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
    )
