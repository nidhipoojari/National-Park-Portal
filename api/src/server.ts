import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { initPool, closePool } from "./db";

import parksRouter from "./routes/parks";
import facilitiesRouter from "./routes/facilities";
import visitorsRouter from "./routes/visitors";
import toursRouter from "./routes/tours";
import campsitesRouter from "./routes/campsites";
import parkingRouter from "./routes/parking";
import transactionsRouter from "./routes/transactions";
import statsRouter from "./routes/stats";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

const origins = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: origins }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/parks", parksRouter);
app.use("/api/facilities", facilitiesRouter);
app.use("/api/visitors", visitorsRouter);
app.use("/api/tours", toursRouter);
app.use("/api/campsites", campsitesRouter);
app.use("/api/parking", parkingRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/stats", statsRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Central error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  // eslint-disable-next-line no-console
  console.error("[error]", message);
  res.status(500).json({ error: message });
});

async function start() {
  try {
    await initPool();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`[api] NPS Portal API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[api] Failed to start — could not connect to Oracle.", err);
    process.exit(1);
  }
}

async function shutdown() {
  // eslint-disable-next-line no-console
  console.log("\n[api] Shutting down...");
  await closePool();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
