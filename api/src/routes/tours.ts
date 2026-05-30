import { Router } from "express";
import { callWithOutput, oracledb } from "../db";

const router = Router();

// GET /api/tours/by-park/:parkName  — list_park_tours
router.get("/by-park/:parkName", async (req, res, next) => {
  try {
    const output = await callWithOutput(`BEGIN list_park_tours(:p); END;`, {
      p: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: req.params.parkName },
    });
    res.json({ output });
  } catch (err) {
    next(err);
  }
});

// GET /api/tours/available?name=...&date=YYYY-MM-DD&spots=5  — list_available_tours
router.get("/available", async (req, res, next) => {
  try {
    const { name, date, spots } = req.query;
    if (!name || !date) {
      return res.status(400).json({ error: "name and date are required" });
    }
    const output = await callWithOutput(
      `BEGIN list_available_tours(:name, TO_DATE(:dt, 'YYYY-MM-DD'), :spots); END;`,
      {
        name: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: String(name) },
        dt: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: String(date) },
        spots: {
          dir: oracledb.BIND_IN,
          type: oracledb.NUMBER,
          val: Number(spots ?? 1),
        },
      }
    );
    res.json({ output });
  } catch (err) {
    next(err);
  }
});

// POST /api/tours/reserve  — reserve_tour
// body: { facilityId, visitorId, startTime (YYYY-MM-DD HH24:MI:SS), adults, children }
router.post("/reserve", async (req, res, next) => {
  try {
    const { facilityId, visitorId, startTime, adults, children } = req.body ?? {};
    if (!facilityId || !visitorId || !startTime) {
      return res
        .status(400)
        .json({ error: "facilityId, visitorId and startTime are required" });
    }
    const output = await callWithOutput(
      `BEGIN reserve_tour(:fid, :vid, TO_TIMESTAMP(:ts, 'YYYY-MM-DD HH24:MI:SS'), :ad, :ch); END;`,
      {
        fid: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: Number(facilityId) },
        vid: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: Number(visitorId) },
        ts: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: String(startTime) },
        ad: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: Number(adults ?? 1) },
        ch: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: Number(children ?? 0) },
      }
    );
    res.json({ output, message: output.join("\n") });
  } catch (err) {
    next(err);
  }
});

export default router;
