"""FastAPI app exposing the AI concierge + admin insights endpoints."""
from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .agent import run_concierge
from .backend_client import BackendError
from .config import settings
from .insights import generate_insights

app = FastAPI(title="NPS Portal AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origin.split(",")],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- schemas ----------

class ChatMessage(BaseModel):
    role: str = Field(description="'user' or 'assistant'")
    content: str


class ConciergeRequest(BaseModel):
    messages: list[ChatMessage]
    visitorId: int | None = None
    visitorName: str | None = None


class ConciergeResponse(BaseModel):
    reply: str


class InsightsRequest(BaseModel):
    start: str
    end: str


# ---------- routes ----------

@app.get("/health")
def health() -> dict:
    return {"ok": True, "model": settings.ai_model, "keyConfigured": settings.has_key}


@app.post("/ai/concierge", response_model=ConciergeResponse)
def concierge(req: ConciergeRequest) -> ConciergeResponse:
    if not req.messages:
        raise HTTPException(status_code=400, detail="messages cannot be empty")
    try:
        reply = run_concierge(
            [m.model_dump() for m in req.messages], req.visitorId, req.visitorName
        )
    except BackendError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except RuntimeError as exc:  # missing key, etc.
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    return ConciergeResponse(reply=reply)


@app.post("/ai/insights")
def insights(req: InsightsRequest) -> dict:
    try:
        return generate_insights(req.start, req.end)
    except BackendError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
