# NPS Portal — API (Phase 2)

Express + TypeScript backend that calls the existing Oracle PL/SQL procedures
(from `queries.sql`) through [node-oracledb](https://node-oracledb.readthedocs.io/)
running in **Thin mode** — so no Oracle Instant Client install is required.

## How it works

The PL/SQL procedures communicate via `DBMS_OUTPUT.PUT_LINE`. The API enables
the output buffer, runs each procedure, then drains the lines with
`DBMS_OUTPUT.GET_LINES` and returns them as JSON (`{ "output": [ ...lines ] }`).
Read-only listings (parks, facilities, transactions) query the tables directly
so the frontend gets clean structured JSON.

## 1. Get an Oracle database (local, free)

The fastest local option is Oracle XE in Docker (needs Docker Desktop):

```powershell
docker run -d --name oracle-xe -p 1521:1521 -e ORACLE_PASSWORD=devpass gvenzl/oracle-xe:21-slim
```

Wait ~1–2 minutes for it to report healthy:

```powershell
docker logs -f oracle-xe   # wait for "DATABASE IS READY TO USE!"
```

Default service name for the pluggable DB is **XEPDB1**.

> Using your UMBC college Oracle instead? It is usually only reachable from the
> campus network and not meant for personal deployment — fine for *local
> development while on the VPN*, but confirm with UMBC IT before relying on it.

## 2. Load the schema + procedures

Load `db/schema_and_procedures.sql` (a copy of the project's `queries.sql`) into
the database. With Docker XE you can run it with SQLcl, SQL Developer, or:

```powershell
docker cp "db/schema_and_procedures.sql" oracle-xe:/tmp/schema.sql
docker exec -it oracle-xe sqlplus system/devpass@//localhost:1521/XEPDB1 "@/tmp/schema.sql"
```

(Or just paste it into SQL Developer / VS Code Oracle extension and run.)

## 3. Configure & run the API

```powershell
cd api
copy .env.example .env   # then edit .env with your credentials
npm install
npm run dev              # http://localhost:4000
```

Health check: http://localhost:4000/health

## Endpoints

| Method | Path | Procedure / source |
|---|---|---|
| GET | `/api/parks` | direct read |
| GET | `/api/parks/:id` | park + facilities |
| GET | `/api/facilities?parkId=&type=` | direct read |
| POST | `/api/visitors` | `add_visitor` |
| GET | `/api/visitors/:name/transactions` | `list_visitor_transactions` |
| GET | `/api/tours/by-park/:parkName` | `list_park_tours` |
| GET | `/api/tours/available?name=&date=&spots=` | `list_available_tours` |
| POST | `/api/tours/reserve` | `reserve_tour` |
| GET | `/api/campsites/available?parkName=&start=&end=&people=` | `list_available_campsites` |
| POST | `/api/campsites/reserve` | `reserve_campsite` |
| GET | `/api/parking/by-park/:parkName` | `list_parking_lots` |
| PATCH | `/api/parking/:facilityId/status` | `update_parking_status` |
| GET | `/api/transactions` | direct read |
| POST | `/api/transactions/:id/cancel` | `cancel_transaction` |
| GET | `/api/stats?start=&end=` | `statistics_report` |

### Example requests

```powershell
# Add a visitor
curl -X POST http://localhost:4000/api/visitors -H "Content-Type: application/json" `
  -d '{"name":"Anita Sabriel","email":"anisab@aol.com","address":"106 Hamburg St","state":"MD","zipcode":"21230"}'

# Reserve a campsite (facility 14, visitor 100, 2 days)
curl -X POST http://localhost:4000/api/campsites/reserve -H "Content-Type: application/json" `
  -d '{"facilityId":14,"visitorId":100,"startDate":"2026-06-01","numDays":2,"adults":2,"children":1}'

# Stats report
curl "http://localhost:4000/api/stats?start=2026-05-01&end=2026-05-31"
```
