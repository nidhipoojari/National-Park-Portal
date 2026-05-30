# NPS Portal — AI Service (Phase 5)

Python FastAPI microservice that adds an **AI concierge** (natural-language
search + agentic booking) and an **admin insights generator** on top of the
existing Express + Oracle PL/SQL backend.

```
Browser (Next.js) ──> FastAPI (this) ──LangChain tools──> Express API ──> Oracle PL/SQL
```

The LLM never touches the database directly — it calls tools that hit the same
Express endpoints the website uses, which run your stored procedures.

## Endpoints
- `GET  /health` — service status + whether the LLM key is configured
- `POST /ai/concierge` — `{ messages: [{role, content}], visitorId?, visitorName? }` → `{ reply }`
- `POST /ai/insights` — `{ start, end }` → `{ summary, report, ... }`

## Setup (Windows / PowerShell)
```powershell
cd "C:\Aditi\ADIIIIIII\COURSE\Projects\Adv. Database\ai"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env   # then edit .env and add OPENAI_API_KEY
```

### LLM key (free option)
Get a free key at https://openrouter.ai/keys and paste it into `.env` as
`OPENAI_API_KEY`. The defaults already point at OpenRouter. To use OpenAI
instead, set `OPENAI_BASE_URL=https://api.openai.com/v1` and `AI_MODEL=gpt-4o-mini`.

The chosen model **must support tool/function calling**.

## Run
```powershell
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

Requires the Express API (port 4000) and Oracle to be running.
