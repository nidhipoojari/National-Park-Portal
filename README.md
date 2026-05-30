# National Park Service Portal

> IS 620 Advanced Database — Spring 2026 · Group 1 · Nidhi Poojari

A **portfolio-grade, full-stack + AI booking platform** for five Maryland & Virginia national parks, built on Oracle PL/SQL stored procedures with a modern Next.js frontend and an AI concierge powered by LangChain + OpenRouter.

---

## Architecture

```
Browser (Next.js 14 + Tailwind)
   │ REST / JSON                   │ NextAuth JWT
   ▼                               ▼
Express API (Node 20)       Python FastAPI (AI)
   │ node-oracledb                 │ LangChain tools → Express API
   ▼                               │
Oracle XE 21c ◄────────────────────┘
11 Stored Procedures
```

| Layer | Tech | Port |
|---|---|---|
| Frontend | Next.js 14 · TypeScript · Tailwind | 3000 |
| Backend API | Express 4 · TypeScript · node-oracledb | 4000 |
| AI service | Python FastAPI · LangChain 1.x · OpenRouter | 8000 |
| Database | Oracle XE 21c (Docker) | 1521 |

---

## Features

### Public
- Park browser with live Oracle data (5 parks — MD & VA)
- Campsite & tour reservation flows
- Live parking status board

### Authenticated visitors
- Email sign-in (NextAuth v4 JWT)
- Personal dashboard — upcoming reservations & quick actions
- Transactions page with cancellation

### Admin (Alice Smith — `alicesm@opera.com`)
- Metrics dashboard — total/active transactions, revenue
- **Recharts** revenue-by-month bar chart + bookings-by-type pie chart
- AI Executive Summary — LLM-generated management report over `statistics_report`
- **Export to PDF** via jsPDF

### AI Concierge (`/ai/concierge`)
- Natural-language chat: *"Find a campsite for 4 people at Shenandoah next weekend"*
- LangChain tool-calling loop → hits Express API → Oracle stored procs
- Agentic booking (sign-in required): confirms before `reserve_campsite` / `reserve_tour`
- Works with any OpenAI-compatible endpoint (defaults to OpenRouter free tier)

---

## Quick Start (local dev)

### Prerequisites
- Node 20+
- Python 3.12+ (`py` launcher on Windows)
- Docker Desktop

### 1 — Database
```bash
docker run -d --name oracle-xe -p 1521:1521 \
  -e ORACLE_PASSWORD=devpass gvenzl/oracle-xe:21-slim

# Load schema (first run only)
docker cp api/db/queries.sql oracle-xe:/tmp/schema.sql
docker exec -it oracle-xe sqlplus system/devpass@localhost:1521/XEPDB1 @/tmp/load.sql
```

### 2 — Express API
```bash
cd api
cp .env.example .env   # edit DB_CONNECTION_STRING if needed
npm install
npx tsx src/server.ts  # http://localhost:4000
```

### 3 — AI service
```bash
cd ai
py -m venv .venv
.\.venv\Scripts\Activate.ps1        # Windows
# source .venv/bin/activate         # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Add your free key at https://openrouter.ai/keys
# OPENAI_API_KEY=sk-or-v1-...
uvicorn app.main:app --reload --port 8000
```

### 4 — Next.js frontend
```bash
cd web
npm install
# .env.local already committed with dev defaults
npm run dev    # http://localhost:3000
```

---

## Docker Compose (all services)

```bash
# Copy and fill in secrets
cp ai/.env.example ai/.env        # set OPENAI_API_KEY
echo "NEXTAUTH_SECRET=changeme" >> .env

docker compose up --build
```

Services start in order: Oracle → API → AI → Web.

---

## Project Structure

```
.
├── web/          Next.js 14 frontend
├── api/          Express + node-oracledb backend
├── ai/           Python FastAPI AI microservice
├── queries.sql   Oracle schema + 11 PL/SQL stored procedures
├── docker-compose.yml
└── .github/workflows/ci.yml   GitHub Actions CI
```

---

## Environment Variables

### `web/.env.local`
| Variable | Default |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` |
| `NEXT_PUBLIC_AI_URL` | `http://localhost:8000` |
| `NEXTAUTH_URL` | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | set to any random string |
| `ADMIN_EMAILS` | `alicesm@opera.com` |

### `ai/.env`
| Variable | Default |
|---|---|
| `OPENAI_API_KEY` | *(required)* |
| `OPENAI_BASE_URL` | `https://openrouter.ai/api/v1` |
| `AI_MODEL` | `openai/gpt-4o-mini` |
| `BACKEND_API_URL` | `http://localhost:4000` |

---

## Deployment

| Service | Platform |
|---|---|
| `web/` | [Vercel](https://vercel.com) — connect repo, set env vars |
| `api/` | [Render](https://render.com) — Docker deploy from `api/Dockerfile` |
| `ai/` | [Render](https://render.com) or [Fly.io](https://fly.io) — from `ai/Dockerfile` |
| Database | [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/) — Autonomous DB |

---

## Resume Bullets

> "Architected a full-stack park reservation platform integrating a Next.js 14 + TypeScript frontend with an Oracle PL/SQL backend (11 stored procedures) via node-oracledb, ensuring ACID-compliant bookings."

> "Designed an AI concierge layer (LangChain + OpenAI function-calling + FastAPI) that translates natural-language requests into stored-procedure calls, reducing reservation friction from 6 clicks to 1 conversation."

> "Implemented role-based dashboards with real-time revenue analytics (Recharts), LLM-generated executive summaries, and PDF export — patterns directly transferable to financial and enterprise systems."

> "Deployed via Docker Compose with CI/CD on GitHub Actions; full polyglot architecture (TypeScript + Python) demonstrating microservices design thinking."

---

## Database — 11 Stored Procedures

| # | Procedure | Purpose |
|---|---|---|
| 1 | `add_visitor` | Register new visitor |
| 2 | `list_visitor_transactions` | Visitor booking history |
| 3 | `list_park_tours` | Tours at a park |
| 4 | `list_available_tours` | Tour availability check |
| 5 | `list_parking_lots` | Parking status |
| 6 | `update_parking_status` | Update lot occupancy |
| 7 | `statistics_report` | Revenue + visitor analytics |
| 8 | `list_available_campsites` | Campsite availability |
| 9 | `reserve_campsite` | Book a campsite (ACID) |
| 10 | `reserve_tour` | Book a tour (ACID) |
| 11 | `cancel_transaction` | Cancel booking (ACID) |

---

*Built with ❤ for IS 620 Advanced Database, Spring 2026*
