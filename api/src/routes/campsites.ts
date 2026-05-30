import { Router } from "express";
import { callWithOutput, oracledb } from "../db";

const router = Router();

// GET /api/campsites/available?parkName=...&start=YYYY-MM-DD&end=YYYY-MM-DD&people=4
// list_available_campsites
router.get("/available", async (req, res, next) => {
  try {
    const { parkName, start, end, people } = req.query;
    if (!parkName || !start || !end) {
      return res
        .status(400)
        .json({ error: "parkName, start and end are required" });
    }
    const output = await callWithOutput(
      `BEGIN list_available_campsites(:pname, :sdat, :edat, :ppl); END;`,
      {
        pname: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: String(parkName) },
        sdat: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: String(start) },
        edat: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: String(end) },
        ppl: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: Number(people ?? 1) },
      }
    );
    res.json({ output });
  } catch (err) {
    next(err);
  }
});

// POST /api/campsites/reserve  — reserve_campsite
// body: { facilityId, visitorId, startDate (YYYY-MM-DD), numDays, adults, children }
router.post("/reserve", async (req, res, next) => {
  try {
    const { facilityId, visitorId, startDate, numDays, adults, children } =
      req.body ?? {};
    if (!facilityId || !visitorId || !startDate || !numDays) {
      return res.status(400).json({
        error: "facilityId, visitorId, startDate and numDays are required",
      });
    }
    const output = await callWithOutput(
      `BEGIN reserve_campsite(:fid, :vid, TO_DATE(:sd, 'YYYY-MM-DD'), :nd, :ad, :ch); END;`,
      {
        fid: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: Number(facilityId) },
        vid: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: Number(visitorId) },
        sd: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: String(startDate) },
        nd: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: Number(numDays) },
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
