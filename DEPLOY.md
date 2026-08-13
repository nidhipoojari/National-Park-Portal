# Deploying the backend so the AI works on the live link

The live site (https://national-park-portal.vercel.app) currently ships only the
Next.js frontend. The AI concierge is broken there because
`NEXT_PUBLIC_AI_URL` was never set at build time, so `http://localhost:8000` got
compiled into the production bundle — every visitor's browser calls *their own*
machine.

Fixing it needs the whole chain public:

```
Browser (Vercel)  ──>  FastAPI AI (Render)  ──>  Express API (Render)  ──>  Oracle ADB (Oracle Cloud)
```

Work through the stages in order. Stage 1 and 2 need accounts, so you have to do
those parts yourself.

---

## Stage 1 — Oracle Autonomous Database

Docker Oracle XE has no free managed equivalent; Oracle Cloud's **Always Free**
Autonomous Database is the realistic target. Signup needs a credit card for
identity verification — Always Free resources are not charged.

1. Create an account at https://signup.oraclecloud.com and sign in to the console.
2. **Oracle Database → Autonomous Database → Create Autonomous Database**
   - Workload type: **Transaction Processing**
   - Configure: **Always Free** (toggle on)
   - Set and record the **ADMIN password** (14–30 chars, one uppercase, one
     digit, no `"` character)
3. Once provisioned, open the database → **Database connection**, and:
   - Set **Mutual TLS (mTLS) authentication** to **Not required**. This is what
     lets the API connect without shipping a wallet file.
   - Copy the **`_high`** connection string from the *TLS* tab. It looks like:
     ```
     tcps://adb.us-ashburn-1.oraclecloud.com:1522/g1a2b3c_npsdb_high.adb.oraclecloud.com
     ```

### Load the schema

`api/db/schema_clean.sql` runs on ADB unmodified — it creates only tables,
sequences and procedures, with no tablespace, `CREATE USER`, or `GRANT`
statements. Load it as **ADMIN**:

1. Database → **Database actions → SQL** (SQL Developer Web).
2. Open `api/db/schema_clean.sql`, paste it in, run as a script (F5).
   The `DROP` statements at the top will raise `ORA-00942` on a fresh database —
   expected and harmless.
3. Repeat with `api/db/02_add_is_admin.sql` (adds the `IS_ADMIN` flag and
   promotes Alice Smith to admin).
4. Verify:
   ```sql
   SELECT COUNT(*) FROM user_objects WHERE object_type = 'PROCEDURE'; -- expect 11
   SELECT COUNT(*) FROM park;                                          -- expect 5
   SELECT COUNT(*) FROM user_objects WHERE status <> 'VALID';          -- expect 0
   ```

> One `ORA-00001` near the end of the script is expected — a demo
> `reserve_campsite` call hits a duplicate key. It does not affect the schema.

---

## Stage 2 — Backend services on Render

`render.yaml` in the repo root is a Blueprint that defines both services. Both
Dockerfiles are verified to build, and the AI container binds to Render's
injected `$PORT`.

1. Create an account at https://render.com (GitHub sign-in is fine).
2. **New → Blueprint**, connect `nidhipoojari/National-Park-Portal`, pick `main`.
   Render reads `render.yaml` and proposes **nps-api** and **nps-ai**.
3. Fill in the secrets it prompts for (everything marked `sync: false`):

   **nps-api**
   | Variable | Value |
   |---|---|
   | `ORACLE_USER` | `ADMIN` |
   | `ORACLE_PASSWORD` | the ADMIN password from Stage 1 |
   | `ORACLE_CONNECT_STRING` | the `tcps://…_high…` string from Stage 1 |
   | `CORS_ORIGIN` | `https://national-park-portal.vercel.app` |

   **nps-ai**
   | Variable | Value |
   |---|---|
   | `OPENAI_API_KEY` | your OpenRouter key (same one in `ai/.env`) |
   | `CORS_ORIGIN` | `https://national-park-portal.vercel.app` |
   | `BACKEND_API_URL` | *leave blank for now — set in step 5* |

4. Deploy. Note the assigned URLs, e.g. `https://nps-api.onrender.com`.
5. Set **nps-ai** → `BACKEND_API_URL` to the **nps-api** URL (with `https://`,
   no trailing slash) and redeploy nps-ai.

   `fromService` can't be used here: it yields `host:port` with no scheme, which
   the Python client can't parse.

6. Verify both:
   ```bash
   curl https://nps-api.onrender.com/health          # {"ok":true}
   curl https://nps-api.onrender.com/api/parks       # 5 parks from Oracle
   curl https://nps-ai.onrender.com/health           # keyConfigured: true
   ```

> **Free tier caveat:** services sleep after ~15 minutes idle and take ~50s to
> wake. The first concierge message after a quiet spell may time out, and the
> AI→API hop can hit *two* cold starts. For a live demo, hit both `/health`
> endpoints a minute beforehand, or move to a paid instance.

---

## Stage 3 — Point Vercel at the public backend

In the Vercel project **national-park-portal → Settings → Environment
Variables**, set these for **Production**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://nps-api.onrender.com` |
| `NEXT_PUBLIC_AI_URL` | `https://nps-ai.onrender.com` |
| `API_URL` | `https://nps-api.onrender.com` |
| `NEXTAUTH_URL` | `https://national-park-portal.vercel.app` |
| `NEXTAUTH_SECRET` | generate one: `npx auth secret` |
| `ADMIN_EMAILS` | `alicesm@opera.com` |

**Then redeploy.** `NEXT_PUBLIC_*` variables are inlined into the JavaScript
bundle at build time — setting them without rebuilding changes nothing. Use
**Deployments → ⋯ → Redeploy** and leave *Use existing Build Cache* **off**.

### Google sign-in (optional)

Agentic booking needs a signed-in visitor. To enable Google OAuth in production,
add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` to Vercel, then register the
redirect URI in Google Cloud Console → Credentials → your OAuth client:

```
https://national-park-portal.vercel.app/api/auth/callback/google
```

Credentials sign-in works without this.

---

## Stage 4 — Verify the AI on the live link

```bash
# 1. Nothing localhost-shaped left in the bundle
curl -s https://national-park-portal.vercel.app/ai/concierge \
  | grep -oE '/_next/static/chunks/app/ai/concierge/[^"]+\.js' \
  | head -1
# fetch that chunk and confirm it contains the Render URL, not localhost:8000

# 2. Real data (not the "Live data unavailable" seed fallback)
curl -s https://national-park-portal.vercel.app/parks | grep -c "Live data unavailable"   # expect 0

# 3. AI end to end
curl -X POST https://nps-ai.onrender.com/ai/concierge \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"What tours does Great Falls Park offer?"}]}'
```

Then open https://national-park-portal.vercel.app/ai/concierge and ask
"What tours does Great Falls Park offer?" — it should answer *Great Falls Tour,
90 minutes*, which is the same answer the local stack gives.

---

## Local development

Unchanged, and still the fastest way to demo. See `README.md`. Note the local
frontend now runs on **port 3001** (3000 is taken by another project), so
`NEXTAUTH_URL`, and `CORS_ORIGIN` in `api/.env` and `ai/.env`, all point at 3001.
